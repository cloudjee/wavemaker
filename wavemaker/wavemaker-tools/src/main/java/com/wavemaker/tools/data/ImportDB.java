/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.data;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.Callable;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.IOUtils;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.types.Path;
import org.hibernate.cfg.Configuration;
import org.hibernate.tool.ant.ExporterTask;
import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.runtime.service.definition.DeprecatedServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.tools.common.Bootstrap;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.compiler.ProjectCompiler;
import com.wavemaker.tools.data.reveng.BasicMetaDataDialect;
import com.wavemaker.tools.data.reveng.MetaDataDialect;
import com.wavemaker.tools.data.spring.SpringService;
import com.wavemaker.tools.data.util.DataServiceUtils;
import com.wavemaker.tools.project.ResourceFilter;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.tools.service.DefaultClassLoaderFactory;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.util.ResourceClassLoaderUtils;

/**
 * Database import.
 * 
 * Although this class does not require to be run from within Ant, and although it is not an Ant Task, it has
 * dependencies on Ant.
 * 
 * @author Simon Toens
 */
public class ImportDB extends BaseDataModelSetup {

    private static final String REVENG_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "reveng";

    private static final String CLASSES_DIR_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "classesDir";

    private static final String SERVICE_CLASS_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "serviceClass";

    private static final String IMPORT_DATABASE_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "genCfg";

    private static final String GENERATE_SERVICE_CLASS_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "genServiceClass";

    private static final String CREATE_JAR_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "jar";

    private static final String GENERATE_HIBERNATE_CONFIG_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "genHibernateCfg";

    private static final String GENERATE_SERVICE_MAIN_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "genServiceMain";

    private static final String REGENERATE_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "regenerate";

    private static final String GENERATE_OLD_STYLE_OPRS_PROPERTY = SYSTEM_PROPERTY_PREFIX + DataServiceConstants.GENERATE_OLD_STYLE_OPRS_PROPERTY;

    private static final String REVENG_METADATA_DIALECT_SYSTEM_PROPERTY = "hibernatetool.metadatadialect";

    private boolean generateHibernateCfg = false;

    private boolean importDatabase = true;

    private boolean generateServiceClass = true;

    private boolean useIndividualCRUDOperations = false;

    private boolean valuesFromReveng = false;

    private Resource classesdir = null;

    private final List<File> revengFiles = new ArrayList<File>();

    private final WMJDBCConfigurationTask jdbcConf = new WMJDBCConfigurationTask();

    private boolean createJar = false;

    private boolean compile = true;

    private boolean compileServiceClass = this.compile;

    private boolean generateServiceMain = false;

    private boolean regenerate = true;

    private String revengMetaDataDialect = null;

    private DeprecatedServiceDefinition serviceDefinition = null;

    private String currentProjectName;

    /**
     * Main method ctor.
     */
    public ImportDB() {
        // bootstrap has to be called before creating the Project instance
        this(bootstrap(), new Project(), true);
        this.projectCompiler = (ProjectCompiler) RuntimeAccess.getInstance().getSpringBean("projectCompiler");
        this.fileSystem = (StudioFileSystem) RuntimeAccess.getInstance().getSpringBean("fileSystem");
        this.exporterFactory = (ExporterFactory) RuntimeAccess.getInstance().getSpringBean("exporterFactory");
    }

    /**
     * API ctor.
     */
    public ImportDB(boolean resolveSystemProperties) {
        this(false, new Project(), resolveSystemProperties);
    }

    public ImportDB(Project project, boolean resolveSystemProperties) {
        this(false, project, resolveSystemProperties);
    }

    private ImportDB(boolean internal, Project project, boolean resolveSystemProperties) {

        super(project);
        if (resolveSystemProperties) {
            this.properties.putAll(System.getProperties());
        }

        // MAV-26
        this.jdbcConf.setDetectOptimisticLock(false);

        // MAV-311
        this.jdbcConf.setDetectManyToMany(false);

        this.jdbcConf.setProject(project);
    }

    private static boolean bootstrap() {
        Bootstrap.main(null);
        return true;
    }

    public void setUseIndividualCRUDOperations(boolean useIndividualCRUDOperations) {
        this.useIndividualCRUDOperations = useIndividualCRUDOperations;
    }

    @Override
    public boolean getUseIndividualCRUDOperations() {
        return this.useIndividualCRUDOperations;
    }

    public void setRegenerate(boolean regenerate) {
        this.regenerate = regenerate;
    }

    public void setRevengMetaDataDialect(String revengMetaDataDialect) {
        this.revengMetaDataDialect = revengMetaDataDialect;
    }

    public ServiceDefinition getServiceDefinition() {
        return this.serviceDefinition;
    }

    public void setCompile(boolean compile) {
        this.compile = compile;
        this.compileServiceClass = compile;
    }

    public void setGenerateServiceMain(boolean generateServiceMain) {
        this.generateServiceMain = generateServiceMain;
    }

    public void setCompileServiceClass(boolean compileServiceClass) {
        this.compileServiceClass = compileServiceClass;
    }

    /**
     * Generate a Hibernate configuration. There's no reason to do this since we use Spring.
     */
    public void setGenerateHibernateCfg(boolean generateHibernateCfg) {
        this.generateHibernateCfg = generateHibernateCfg;
    }

    public void setCreateJar(boolean createJar) {
        this.createJar = createJar;
    }

    public void setImportDatabase(boolean importDatabase) {
        this.importDatabase = importDatabase;
    }

    public void setGenerateServiceClass(boolean generateServiceClass) {
        this.generateServiceClass = generateServiceClass;
    }

    public void addRevengFile(File f) {
        this.revengFiles.add(f);
    }

    public void setClassesDir(Resource classesDir) {
        this.classesdir = classesDir;
    }

    public void setProjectCompiler(ProjectCompiler projectCompiler) {
        this.projectCompiler = projectCompiler;
    }

    public void setCurrentProjectName(String currentProjectName) {
        this.currentProjectName = currentProjectName;
    }

    @Override
    protected void customRun() {

        if (this.importDatabase) {
            generateBaseConfigFiles();
        }

        Callable<DeprecatedServiceDefinition> t = new Callable<DeprecatedServiceDefinition>() {

            @Override
            public DeprecatedServiceDefinition call() {

                if (ImportDB.this.importDatabase) {
                    generateConfigFiles();
                }

                DeprecatedServiceDefinition def = loadServiceDefinition();

                if (ImportDB.this.generateServiceClass) {
                    generateServiceClass(def);
                }

                if (ImportDB.this.compile && ImportDB.this.compileServiceClass) {
                    compile();
                }

                return def;
            }
        };

        // need classloader with compiled classes and property files,
        // which are in destdir by now
        this.serviceDefinition = ResourceClassLoaderUtils.runInClassLoaderContext(t, this.destdir, this.classesdir);

        if (this.importDatabase && this.regenerate) {
            // regenerate java types (and mapping files). this gives us
            // java types using generics.
            regenerate();
        }

        // cftempfix - 3 lines commented out temporarily
        // if (this.createJar) {
        // AntUtils.jar(new File(this.serviceName + ".jar"), this.destdir);
        // }

    }

    @Override
    protected void customDispose() {
        if (this.serviceDefinition != null) {
            this.serviceDefinition.dispose();
        }
    }

    private void regenerate() {

        // File springCfg = new File(this.destdir, DataServiceUtils.getCfgFileName(this.serviceName));
        Resource springCfg = null;
        try {
            springCfg = this.destdir.createRelative(DataServiceUtils.getCfgFileName(this.serviceName));
        } catch (IOException ex) {
        }

        DataModelConfiguration cfg = new DataModelConfiguration(springCfg, new DefaultClassLoaderFactory(this.destdir, this.classesdir));

        try {

            cfg.touchAllEntities();

            cfg.save();

        } finally {

            cfg.dispose();

        }

    }

    // generate pojos and connection properties
    private void generateBaseConfigFiles() {

        Properties connectionProperties = getHibernateConnectionProperties();

        this.properties.putAll(connectionProperties);

        this.jdbcConf.setProperties(this.properties);

        this.jdbcConf.setReverseStrategy(this.revengNamingStrategy);

        Configuration cfg = this.jdbcConf.getConfiguration();

        getParentTask().setConfiguration(cfg);

        checkTables(cfg);

        // this.destdir.mkdirs();

        writePropertiesFile(cfg);

        getJavaExporter().execute();

        removeConstructor();

        if (this.compile) {
            compile();
        }
    }

    private void removeConstructor() {

        ResourceFilter filter = new ResourceFilter() {

            @Override
            public boolean accept(Resource resource) {
                String name = resource.getFilename();
                int len = name.length();
                return name.substring(len - 5).equals(".java");
            }
        };

        List<Resource> javafiles = this.fileSystem.listChildren(this.javadir, filter);

        if (javafiles != null) {
            try {
                for (Resource file : javafiles) {
                    // String content = FileUtils.readFileToString(file, ServerConstants.DEFAULT_ENCODING);
                    String content = IOUtils.toString(file.getInputStream(), ServerConstants.DEFAULT_ENCODING);

                    String fileName = file.getFilename();
                    int len = fileName.length();
                    fileName = fileName.substring(0, len - 5);
                    String regExp = "public\\s+" + fileName + "\\s*\\([^\\)]*\\)\\s*\\{[^\\}]*\\}";
                    Pattern pattern = Pattern.compile(regExp);
                    Matcher matcher = pattern.matcher(content);

                    boolean done = false;
                    int indx1, indx2;
                    String str;
                    while (!done) {
                        if (matcher.find()) {
                            indx1 = matcher.start();
                            indx2 = matcher.end();
                            str = content.substring(indx1, indx2);
                            content = content.replace(str, "");
                            matcher = pattern.matcher(content);
                        } else {
                            done = true;
                        }
                    }

                    // FileUtils.writeStringToFile(file, content, ServerConstants.DEFAULT_ENCODING);
                    OutputStream os = this.fileSystem.getOutputStream(file);
                    IOUtils.write(content, os, ServerConstants.DEFAULT_ENCODING);
                }

            } catch (IOException ioe) {
                throw new WMRuntimeException(ioe);
            }
        }
    }

    // generate .hbm.xml, .ql.xml, .spring.xml files.
    private void generateConfigFiles() {

        for (ExporterTask e : getPostCompileExporters()) {
            e.execute();
        }
    }

    private void compile() {
<<<<<<< HEAD
        // if (!this.classesdir.exists()) {
        // this.classesdir.mkdirs();
        // }
        this.projectCompiler.compile(this.currentProjectName);
=======
        //if (!this.classesdir.exists()) {
        //    this.classesdir.mkdirs();
        //}
        this.projectCompiler.compile();
>>>>>>> origin/master
    }

    protected void writePropertiesFile(Configuration cfg) {

        Properties p = getProperties();

        p = DataServiceUtils.addServiceName(p, this.serviceName);

        DataServiceUtils.writeProperties(p, this.destdir, this.serviceName);
    }

    protected void generateServiceClass(DeprecatedServiceDefinition def) {

        GenerationConfiguration genconf = new GenerationConfiguration(def, this.destdir);

        DataServiceGenerator generator = new DataServiceGenerator(genconf);

        generator.setGenerateMain(this.generateServiceMain);

        try {
            generator.generate();
        } catch (GenerationException ex) {
            throw new ConfigurationException(ex);
        }
    }

    protected List<ExporterTask> getPostCompileExporters() {
        List<ExporterTask> rtn = new ArrayList<ExporterTask>();
        rtn.add(getMappingExporter());
        rtn.add(getConfigurationExporter());
        if (this.importDatabase) {
            rtn.add(getHQLExporter());
        }
        if (this.generateHibernateCfg) {
            rtn.add(getHibernateCfgExporter());
        }
        return rtn;
    }

    protected ExporterTask getHibernateCfgExporter() {
        return this.exporterFactory.getExporter("config", getParentTask(), null);
    }

    protected ExporterTask getJavaExporter() {
        return this.exporterFactory.getExporter("java", getParentTask(), null);
    }

    protected ExporterTask getHQLExporter() {
        return this.exporterFactory.getExporter("query", getParentTask(), this.serviceName);
    }

    protected ExporterTask getMappingExporter() {
        return this.exporterFactory.getExporter("mapping", getParentTask(), null);
    }

    private String getDefaultRevengMetaDataDialect() {

        if (isMySQL()) {
            return BasicMetaDataDialect.class.getName();
        }

        if (isHSQLDB() || isSQLServer() || isPostgres()) {
            return MetaDataDialect.class.getName();
        }

        return null;
    }

    private void checkRevengMetaDataDialect() {

        if (this.revengMetaDataDialect == null) {

            this.revengMetaDataDialect = this.properties.getProperty(REVENG_METADATA_DIALECT_SYSTEM_PROPERTY);

            if (this.revengMetaDataDialect == null) {
                this.revengMetaDataDialect = getDefaultRevengMetaDataDialect();

            }

        }

        if (this.revengMetaDataDialect != null) {

            if (DataServiceLoggers.importLogger.isInfoEnabled()) {
                DataServiceLoggers.importLogger.info("Using metadata dialect: " + this.revengMetaDataDialect);
            }

            // these properties are passed to Hibernate Reveng.
            this.properties.setProperty(REVENG_METADATA_DIALECT_SYSTEM_PROPERTY, this.revengMetaDataDialect);
        }

    }

    private DeprecatedServiceDefinition loadServiceDefinition() {
        // File f = new File(this.destdir, this.serviceName + DataServiceConstants.SPRING_CFG_EXT);
        Resource f = null;
        try {
            f = this.destdir.createRelative(this.serviceName + DataServiceConstants.SPRING_CFG_EXT);
        } catch (IOException ex) {

        }
        DeprecatedServiceDefinition rtn = null;
        try {
            rtn = SpringService.initialize(f);
            String s = StringUtils.fq(this.packageName, this.className);
            DataServiceUtils.unwrapAndCast(rtn).getMetaData().setServiceClassName(s);
            return rtn;
        } catch (RuntimeException ex) {
            try {
                rtn.dispose();
            } catch (RuntimeException ignore) {

            }
            throw ex;
        }
    }

    private void checkClassesDir() {

        if (this.classesdir == null) {
            String s = this.properties.getProperty(CLASSES_DIR_SYSTEM_PROPERTY);
            if (s != null) {
                setClassesDir(this.fileSystem.getResourceForURI(s));
            }
        }

        if (this.classesdir == null) {
            this.classesdir = this.destdir;
        }
    }

    private void checkImportMode() {

        if (this.properties.getProperty(IMPORT_DATABASE_SYSTEM_PROPERTY) != null) {
            setImportDatabase(Boolean.getBoolean(IMPORT_DATABASE_SYSTEM_PROPERTY));
        }

        if (this.properties.getProperty(GENERATE_SERVICE_CLASS_SYSTEM_PROPERTY) != null) {
            setGenerateServiceClass(Boolean.getBoolean(GENERATE_SERVICE_CLASS_SYSTEM_PROPERTY));
        }
    }

    private void checkServiceClass() {
        if (this.serviceName == null || this.packageName == null) {

            String s = this.properties.getProperty(SERVICE_CLASS_SYSTEM_PROPERTY);
            if (s != null) {
                String p = StringUtils.fromLastOccurrence(s, ".", -1);
                String n = StringUtils.fromLastOccurrence(s, ".");

                if (this.packageName == null) {
                    setPackage(p);
                }

                if (this.serviceName == null) {
                    setServiceName(n.toLowerCase());
                }

                if (this.className == null) {
                    setClassName(n);
                }
            }
        }
    }

    private void checkRevengFiles() {

        String s = this.properties.getProperty(REVENG_SYSTEM_PROPERTY);

        if (s != null) {

            String[] paths = s.split(",");

            for (String path : paths) {
                File f = new File(path);
                if (!f.exists() || f.isDirectory()) {
                    if (DataServiceLoggers.importLogger.isWarnEnabled()) {
                        DataServiceLoggers.importLogger.warn("reverse engineering file " + f.getAbsolutePath() + " is not valid");
                    }
                    continue;
                }
                addRevengFile(f);
            }

        }
    }

    private void registerRevEngFiles() {
        if (!this.revengFiles.isEmpty()) {
            Path revengPaths = new Path(getProject());
            for (File f : this.revengFiles) {
                Path p = new Path(getProject(), f.getAbsolutePath());
                revengPaths.add(p);
            }
            this.jdbcConf.setRevEngFile(revengPaths);
        }
    }

    private void checkCreateJar() {

        String s = this.properties.getProperty(CREATE_JAR_SYSTEM_PROPERTY);

        if (s != null) {
            setCreateJar(Boolean.getBoolean(CREATE_JAR_SYSTEM_PROPERTY));
        }
    }

    private void checkGenerateServiceMain() {

        String s = this.properties.getProperty(GENERATE_SERVICE_MAIN_SYSTEM_PROPERTY);

        if (s != null) {
            setGenerateServiceMain(Boolean.getBoolean(GENERATE_SERVICE_MAIN_SYSTEM_PROPERTY));
        }
    }

    private void maybeGenerateRevEng() {

        if (!this.valuesFromReveng) {

            if (!this.revengFiles.isEmpty()) {
                throw new ConfigurationException("Please specify a package name in your reveng file");
            }

            File generatedRevEngFile = null;

            try {
                generatedRevEngFile = File.createTempFile("reveng", ".xml");
            } catch (IOException ex) {
                throw new ConfigurationException(ex);
            }

            registerTmpFileForCleanup(generatedRevEngFile);

            Reveng r = new Reveng();
            r.setPackageName(this.dataPackage);
            if (this.tableFilters.isEmpty()) {
                // get default value from reveng for potential error msg
                setTableFilters(r.getTableFilters());
            } else {
                r.setTableFilters(this.tableFilters);
            }
            if (this.schemaFilters.isEmpty()) {
                // get default value from reveng for potential error msg
                setSchemaFilters(r.getSchemaFilters());
            } else {
                r.setSchemaFilters(this.schemaFilters);
            }

            StringWriter sw = new StringWriter();

            try {

                PrintWriter pw = new PrintWriter(sw);
                r.write(pw, this.dialect);
                pw.close();

                if (DataServiceLoggers.importLogger.isDebugEnabled()) {
                    DataServiceLoggers.importLogger.debug("Using reveng file:\n" + sw.toString());
                }

                FileWriter fw = new FileWriter(generatedRevEngFile);
                fw.write(sw.toString());

                try {
                    fw.close();
                } catch (IOException ignore) {
                }

            } catch (IOException ex) {
                throw new ConfigurationException(ex);
            }

            addRevengFile(generatedRevEngFile);
        }
    }

    private void setValuesFromRevEngFilesIfNotSet() {
        if (this.packageName != null) {
            return;
        }

        boolean packageSet = false;
        boolean tableFilterSet = false;
        boolean schemaFilterSet = false;

        for (File f : this.revengFiles) {
            try {
                FileReader reader = new FileReader(f);
                Reveng r = Reveng.load(reader);
                if (r.getPackage() != null && !packageSet) {
                    setPackage(r.getPackage());
                    this.valuesFromReveng = true;
                    packageSet = true;
                }
                if (r.getTableFilters() != null && !tableFilterSet) {
                    setTableFilters(r.getTableFilters());
                    this.valuesFromReveng = true;
                    tableFilterSet = true;
                }
                if (r.getSchemaFilters() != null && !schemaFilterSet) {
                    setSchemaFilters(r.getSchemaFilters());
                    this.valuesFromReveng = true;
                    schemaFilterSet = true;
                }
                reader.close();
            } catch (IOException ignore) {
            }
        }
    }

    private void checkGenerateHibernateConfig() {

        String s = this.properties.getProperty(GENERATE_HIBERNATE_CONFIG_SYSTEM_PROPERTY);

        if (s != null) {
            setGenerateHibernateCfg(Boolean.getBoolean(GENERATE_HIBERNATE_CONFIG_SYSTEM_PROPERTY));
        }
    }

    private void checkRegenerate() {

        String s = this.properties.getProperty(REGENERATE_SYSTEM_PROPERTY);

        if (s != null) {
            setRegenerate(Boolean.getBoolean(REGENERATE_SYSTEM_PROPERTY));
        }

    }

    private void checkGenerateOldStyleOps() {

        String s = this.properties.getProperty(GENERATE_OLD_STYLE_OPRS_PROPERTY);

        if (s != null) {
            setUseIndividualCRUDOperations(Boolean.getBoolean(GENERATE_OLD_STYLE_OPRS_PROPERTY));
        }

    }

    @Override
    protected boolean customInit(Collection<String> requiredProperties) {

        // order determines precedence and matters

        checkImportMode(); // sets importDatabase and generateServiceClass

        if (this.importDatabase) {
            checkAlternateConnectionProperties();

            checkUser(requiredProperties);
            checkPass(requiredProperties);
            checkUrl(requiredProperties);
        }

        checkServiceName(false, requiredProperties);
        checkDestdir(requiredProperties);
        checkPackage();
        checkServiceClass();
        checkClassName(requiredProperties);
        checkServiceName(true, requiredProperties);
        checkDataPackage();

        if (this.importDatabase) {
            checkDBType();
            checkDialect(requiredProperties, false);
            checkDialectAndDBType(requiredProperties);
            checkDialect(requiredProperties, true);
            checkCatalogName();

            // defaults driver class from db type
            checkDriverClass(requiredProperties);

            checkRevengFiles();
            checkTableFilter();
            checkSchemaFilter();
            setValuesFromRevEngFilesIfNotSet();
            maybeGenerateRevEng();
            registerRevEngFiles(); // last step in reveng file processing
            checkGenerateHibernateConfig();
            checkRegenerate();
            checkGenerateOldStyleOps();
        }

        checkClassesDir();
        checkCreateJar();
        checkGenerateServiceMain();

        checkRevengMetaDataDialect();
        checkRevengNamingStrategy();

        return true;
    }

    public static void main(String args[]) {

        Arrays.sort(args);

        if (Arrays.binarySearch(args, "--help") > -1 || Arrays.binarySearch(args, "-h") > -1) {
            System.out.println(getHelp(ImportDB.class));
            return;
        }

        ImportDB importer = new ImportDB();

        for (int i = 0; i < args.length; i++) {

            if (!args[i].startsWith("-")) {

                File f = new File(args[i]);

                Properties p = com.wavemaker.runtime.data.util.DataServiceUtils.loadDBProperties(f);

                importer.setProperties(p);
            }
        }

        boolean ok = importer.init();
        if (!ok) {
            return;
        }

        if (Arrays.binarySearch(args, "--values") > -1 || Arrays.binarySearch(args, "-v") > -1) {
            System.out.println(getValues(importer));
            return;
        }

        try {
            importer.run();
        } finally {
            try {
                importer.dispose();
            } catch (Exception ignore) {
            }
        }
    }

    private static String getValues(ImportDB db) {

        String s = "Settings:\n\n";

        s += "  Connection properties:\n";
        s += "  user: " + db.username + "\n";
        s += "  password: " + db.password + "\n";
        s += "  url: " + db.connectionUrl + "\n";

        s += "\n";

        s += "  outputdir: " + db.destdir + "\n";
        s += "  classesdir: " + db.classesdir + "\n";
        s += "  service name: " + db.serviceName + "\n";
        s += "  service class " + db.className + "\n";
        s += "  java package: " + db.packageName + "\n";

        s += "\n";

        s += "  dbtype: " + db.dbtype + "\n";
        s += "  dialect: " + db.dialect + "\n";

        s += "\n";

        s += "  import database: " + db.importDatabase + "\n";
        s += "  generate service class: " + db.generateServiceClass;

        return s;

    }

    public static String getHelp(Class<?> mainClass) {

        return "\nUsage:\n\n" + "System Properties (optional in brackets):\n" + "  -D" + DESTDIR_SYSTEM_PROPERTY + "=<root output dir>\n" + "  -D"
            + SERVICE_CLASS_SYSTEM_PROPERTY + "=<fully qualified service class name>\n" + "  -D" + USER_SYSTEM_PROPERTY + "=<db user>\n" + "  -D"
            + CONNECTION_URL_SYSTEM_PROPERTY + "=<jdbc connection url>\n" + "  [-D" + PASS_SYSTEM_PROPERTY + "=<db password>]\n" + "  [-D"
            + TABLE_FILTER_SYSTEM_PROPERTY + "=<regular expression>]\n" + "  [-D" + SCHEMA_FILTER_SYSTEM_PROPERTY + "=<regular expression>]\n"
            + "  [-D" + CLASSES_DIR_SYSTEM_PROPERTY + "=<directory for generated classes>]\n" + "\n" + "Arguments (all optional):\n\n"
            + "  path to properties file\n" + "  -v|--values: show runtime values of properties\n" + "  -h|--help: this message\n\n" + "Example:\n\n"
            + "  java \\\n" + "    -D" + DESTDIR_SYSTEM_PROPERTY + "=servicedir \\\n" + "    -D" + SERVICE_CLASS_SYSTEM_PROPERTY
            + "=com.test.DBService \\\n" + "    -D" + USER_SYSTEM_PROPERTY + "=root \\\n" + "    -D" + CONNECTION_URL_SYSTEM_PROPERTY
            + "=jdbc:mysql://localhost:3306/sakila \\\n" + "    -D" + DRIVER_CLASS_NAME_SYSTEM_PROPERTY + "=com.mysql.jdbc.Driver \\\n" + "    "
            + mainClass.getName() + "\n";
    }
}
