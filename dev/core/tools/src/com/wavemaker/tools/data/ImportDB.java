/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.data;

import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Properties;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

import org.apache.tools.ant.Project;
import org.apache.tools.ant.types.Path;
import org.apache.commons.io.FileUtils;
import org.hibernate.cfg.Configuration;
import org.hibernate.tool.ant.ExporterTask;
import org.hibernate.tool.ant.Hbm2HbmXmlExporterTask;
import org.hibernate.tool.ant.Hbm2JavaExporterTask;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.data.util.QueryHandler;
import com.wavemaker.runtime.service.definition.DeprecatedServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.tools.common.Bootstrap;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.data.reveng.BasicMetaDataDialect;
import com.wavemaker.tools.data.reveng.MetaDataDialect;
import com.wavemaker.tools.data.spring.SpringService;
import com.wavemaker.tools.data.util.DataServiceUtils;
import com.wavemaker.tools.service.DefaultClassLoaderFactory;
import com.wavemaker.tools.service.DefaultCompileService;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.util.AntUtils;

/**
 * Database import.
 * 
 * Although this class does not require to be run from within Ant, and although it is
 * not an Ant Task, it has dependencies on Ant.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 */
public class ImportDB extends BaseDataModelSetup {

    private static final String REVENG_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "reveng";

    private static final String CLASSES_DIR_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "classesDir";

    private static final String SERVICE_CLASS_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "serviceClass";

    private static final String IMPORT_DATABASE_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "genCfg";

    private static final String GENERATE_SERVICE_CLASS_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "genServiceClass";

    private static final String CREATE_JAR_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "jar";

    private static final String GENERATE_HIBERNATE_CONFIG_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "genHibernateCfg";

    private static final String GENERATE_SERVICE_MAIN_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "genServiceMain";

    private static final String REGENERATE_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "regenerate";

    private static final String GENERATE_OLD_STYLE_OPRS_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + DataServiceConstants.GENERATE_OLD_STYLE_OPRS_PROPERTY;

    private static final String REVENG_METADATA_DIALECT_SYSTEM_PROPERTY = "hibernatetool.metadatadialect";

    private boolean generateHibernateCfg = false;

    private boolean importDatabase = true;

    private boolean generateServiceClass = true;

    private boolean useIndividualCRUDOperations = false;

    private boolean valuesFromReveng = false;

    private File classesdir = null;

    private final List<File> revengFiles = new ArrayList<File>();

    private final WMJDBCConfigurationTask jdbcConf = new WMJDBCConfigurationTask();

    private boolean createJar = false;

    private boolean compile = true;

    private boolean compileServiceClass = compile;

    private boolean generateServiceMain = false;

    private boolean regenerate = true;

    private String revengMetaDataDialect = null;

    private DeprecatedServiceDefinition serviceDefinition = null;

    /**
     * Main method ctor.
     */
    public ImportDB() {
        // bootstrap has to be called before creating the Project instance
        this(bootstrap(), new Project(), true);
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

    private ImportDB(boolean internal, Project project,
            boolean resolveSystemProperties) {

        super(project);
        if (resolveSystemProperties) {
            properties.putAll(System.getProperties());
        }

        // MAV-26
        jdbcConf.setDetectOptimisticLock(false);

        // MAV-311
        jdbcConf.setDetectManyToMany(false);

        jdbcConf.setProject(project);
    }

    private static boolean bootstrap() {
        Bootstrap.main(null);
        return true;
    }

    public void setUseIndividualCRUDOperations(
            boolean useIndividualCRUDOperations) {
        this.useIndividualCRUDOperations = useIndividualCRUDOperations;
    }

    @Override
    public boolean getUseIndividualCRUDOperations() {
        return useIndividualCRUDOperations;
    }

    public void setRegenerate(boolean regenerate) {
        this.regenerate = regenerate;
    }

    public void setRevengMetaDataDialect(String revengMetaDataDialect) {
        this.revengMetaDataDialect = revengMetaDataDialect;
    }

    public ServiceDefinition getServiceDefinition() {
        return serviceDefinition;
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
     * Generate a Hibernate configuration. There's no reason to do this since we use
     * Spring.
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
        revengFiles.add(f);
    }

    public void setClassesDir(File classesDir) {
        this.classesdir = classesDir;
    }

    @Override
    protected void customRun() {

        if (importDatabase) {
            generateBaseConfigFiles();
        }

        ClassLoaderUtils.TaskRtn t = new ClassLoaderUtils.TaskRtn() {
            public ServiceDefinition run() {

                if (importDatabase) {
                    generateConfigFiles();
                }

                DeprecatedServiceDefinition def = loadServiceDefinition();

                if (generateServiceClass) {
                    generateServiceClass(def);
                }

                if (compile && compileServiceClass) {
                    compile();
                }

                return def;
            }
        };

        // need classloader with compiled classes and property files,
        // which are in destdir by now
        serviceDefinition = (DeprecatedServiceDefinition) ClassLoaderUtils
                .runInClassLoaderContext(t, destdir, classesdir);

        if (importDatabase && regenerate) {
            // regenerate java types (and mapping files). this gives us
            // java types using generics.
            regenerate();
        }

        if (createJar) {
            AntUtils.jar(new File(serviceName + ".jar"), destdir);
        }

    }

    @Override
    protected void customDispose() {
        if (serviceDefinition != null) {
            serviceDefinition.dispose();
        }
    }

    private void regenerate() {

        File springCfg = new File(destdir, DataServiceUtils
                .getCfgFileName(serviceName));

        DataModelConfiguration cfg = new DataModelConfiguration(springCfg,
                new DefaultClassLoaderFactory(destdir, classesdir),
                new DefaultCompileService(destdir, classesdir));

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

        properties.putAll(connectionProperties);

        jdbcConf.setProperties(properties);

        jdbcConf.setReverseStrategy(revengNamingStrategy);

        Configuration cfg = jdbcConf.getConfiguration();

        getParentTask().setConfiguration(cfg);

        checkTables(cfg);

        destdir.mkdirs();

        writePropertiesFile(cfg);

        getJavaExporter().execute();

        removeConstructor();

        if (compile) {
            compile();
        }
    }

    private void removeConstructor(){

        FilenameFilter filter = new FilenameFilter() {
            public boolean accept(File dir, String name) {
                int len = name.length();
                return name.substring(len-5).equals(".java");
            }          
        };

        File[] javafiles = javadir.listFiles(filter);

        try {
            for (File file : javafiles) {
                String content = FileUtils.readFileToString(file, ServerConstants.DEFAULT_ENCODING);

                String fileName = file.getName();
                int len = fileName.length();
                fileName = fileName.substring(0, len-5);
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

                FileUtils.writeStringToFile(file, content, ServerConstants.DEFAULT_ENCODING);
            }

        } catch (IOException ioe) {
            throw new WMRuntimeException(ioe);
        }
    }

    // generate .hbm.xml, .ql.xml, .spring.xml files.
    private void generateConfigFiles() {

        for (ExporterTask e : getPostCompileExporters()) {
            e.execute();
        }
    }

    private void compile() {
        if (!classesdir.exists()) {
            classesdir.mkdirs();
        }
        String includes = packageName.replace(".", "/") + "/* ";
        if (!packageName.equals(dataPackage)) {
            includes += dataPackage.replace(".", "/") + "/*";
        }
        AntUtils.javac(destdir.getAbsolutePath(), classesdir, includes);
    }

    protected void writePropertiesFile(Configuration cfg) {

        Properties p = getProperties();

        p = DataServiceUtils.addServiceName(p, serviceName);

        DataServiceUtils.writeProperties(p, destdir, serviceName);
    }

    protected void generateServiceClass(DeprecatedServiceDefinition def) {

        GenerationConfiguration genconf = new GenerationConfiguration(def,
                destdir);

        DataServiceGenerator generator = new DataServiceGenerator(genconf);

        generator.setGenerateMain(generateServiceMain);

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
        if (importDatabase) {
            rtn.add(getHQLExporter());
        }
        if (generateHibernateCfg) {
            rtn.add(getHibernateCfgExporter());
        }
        return rtn;
    }

    protected ExporterTask getHibernateCfgExporter() {
        return new HibernateConfigExporterTask(getParentTask());
    }

    protected ExporterTask getJavaExporter() {
        return new Hbm2JavaExporterTask(getParentTask());
    }

    protected ExporterTask getHQLExporter() {
        return new QueryExporterTask(getParentTask(), serviceName);
    }

    protected ExporterTask getMappingExporter() {
        return new Hbm2HbmXmlExporterTask(getParentTask());

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

        if (revengMetaDataDialect == null) {

            revengMetaDataDialect = properties
                    .getProperty(REVENG_METADATA_DIALECT_SYSTEM_PROPERTY);

            if (revengMetaDataDialect == null) {
                revengMetaDataDialect = getDefaultRevengMetaDataDialect();

            }

        }

        if (revengMetaDataDialect != null) {

            if (DataServiceLoggers.importLogger.isInfoEnabled()) {
                DataServiceLoggers.importLogger.info("Using metadata dialect: "
                        + revengMetaDataDialect);
            }

            // these properties are passed to Hibernate Reveng.
            properties.setProperty(REVENG_METADATA_DIALECT_SYSTEM_PROPERTY,
                    revengMetaDataDialect);
        }

    }

    private DeprecatedServiceDefinition loadServiceDefinition() {
        File f = new File(destdir, serviceName
                + DataServiceConstants.SPRING_CFG_EXT);
        DeprecatedServiceDefinition rtn = null;
        try {
            rtn = SpringService.initialize(f);
            String s = StringUtils.fq(packageName, className);
            DataServiceUtils.unwrapAndCast(rtn).getMetaData()
                    .setServiceClassName(s);
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

        if (classesdir == null) {
            String s = properties.getProperty(CLASSES_DIR_SYSTEM_PROPERTY);
            if (s != null) {
                setClassesDir(new File(s));
            }
        }

        if (classesdir == null) {
            classesdir = destdir;
        }
    }

    private void checkImportMode() {

        if (properties.getProperty(IMPORT_DATABASE_SYSTEM_PROPERTY) != null) {
            setImportDatabase(Boolean
                    .getBoolean(IMPORT_DATABASE_SYSTEM_PROPERTY));
        }

        if (properties.getProperty(GENERATE_SERVICE_CLASS_SYSTEM_PROPERTY) != null) {
            setGenerateServiceClass(Boolean
                    .getBoolean(GENERATE_SERVICE_CLASS_SYSTEM_PROPERTY));
        }
    }

    private void checkServiceClass() {
        if (serviceName == null || packageName == null) {

            String s = properties.getProperty(SERVICE_CLASS_SYSTEM_PROPERTY);
            if (s != null) {
                String p = StringUtils.fromLastOccurrence(s, ".", -1);
                String n = StringUtils.fromLastOccurrence(s, ".");

                if (packageName == null) {
                    setPackage(p);
                }

                if (serviceName == null) {
                    setServiceName(n.toLowerCase());
                }

                if (className == null) {
                    setClassName(n);
                }
            }
        }
    }

    private void checkRevengFiles() {

        String s = properties.getProperty(REVENG_SYSTEM_PROPERTY);

        if (s != null) {

            String[] paths = s.split(",");

            for (String path : paths) {
                File f = new File(path);
                if (!f.exists() || f.isDirectory()) {
                    if (DataServiceLoggers.importLogger.isWarnEnabled()) {
                        DataServiceLoggers.importLogger
                                .warn("reverse engineering file "
                                        + f.getAbsolutePath() + " is not valid");
                    }
                    continue;
                }
                addRevengFile(f);
            }

        }
    }

    private void registerRevEngFiles() {
        if (!revengFiles.isEmpty()) {
            Path revengPaths = new Path(getProject());
            for (File f : revengFiles) {
                Path p = new Path(getProject(), f.getAbsolutePath());
                revengPaths.add(p);
            }
            jdbcConf.setRevEngFile(revengPaths);
        }
    }

    private void checkCreateJar() {

        String s = properties.getProperty(CREATE_JAR_SYSTEM_PROPERTY);

        if (s != null) {
            setCreateJar(Boolean.getBoolean(CREATE_JAR_SYSTEM_PROPERTY));
        }
    }

    private void checkGenerateServiceMain() {

        String s = properties
                .getProperty(GENERATE_SERVICE_MAIN_SYSTEM_PROPERTY);

        if (s != null) {
            setGenerateServiceMain(Boolean
                    .getBoolean(GENERATE_SERVICE_MAIN_SYSTEM_PROPERTY));
        }
    }

    private void maybeGenerateRevEng() {

        if (!valuesFromReveng) {

            if (!revengFiles.isEmpty()) {
                throw new ConfigurationException(
                        "Please specify a package name in your reveng file");
            }

            File generatedRevEngFile = null;

            try {
                generatedRevEngFile = File.createTempFile("reveng", ".xml");
            } catch (IOException ex) {
                throw new ConfigurationException(ex);
            }

            registerTmpFileForCleanup(generatedRevEngFile);

            Reveng r = new Reveng();
            r.setPackageName(dataPackage);
            if (tableFilters.isEmpty()) {
                // get default value from reveng for potential error msg
                setTableFilters(r.getTableFilters());
            } else {
                r.setTableFilters(tableFilters);
            }
            if (schemaFilters.isEmpty()) {
                // get default value from reveng for potential error msg
                setSchemaFilters(r.getSchemaFilters());
            } else {
                r.setSchemaFilters(schemaFilters);
            }

            StringWriter sw = new StringWriter();

            try {

                PrintWriter pw = new PrintWriter(sw);
                r.write(pw);
                pw.close();

                if (DataServiceLoggers.importLogger.isDebugEnabled()) {
                    DataServiceLoggers.importLogger
                            .debug("Using reveng file:\n" + sw.toString());
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
        if (packageName != null) {
            return;
        }

        boolean packageSet = false;
        boolean tableFilterSet = false;
        boolean schemaFilterSet = false;

        for (File f : revengFiles) {
            try {
                FileReader reader = new FileReader(f);
                Reveng r = Reveng.load(reader);
                if (r.getPackage() != null && !packageSet) {
                    setPackage(r.getPackage());
                    valuesFromReveng = true;
                    packageSet = true;
                }
                if (r.getTableFilters() != null && !tableFilterSet) {
                    setTableFilters(r.getTableFilters());
                    valuesFromReveng = true;
                    tableFilterSet = true;
                }
                if (r.getSchemaFilters() != null && !schemaFilterSet) {
                    setSchemaFilters(r.getSchemaFilters());
                    valuesFromReveng = true;
                    schemaFilterSet = true;
                }
                reader.close();
            } catch (IOException ignore) {
            }
        }
    }

    private void checkGenerateHibernateConfig() {

        String s = properties
                .getProperty(GENERATE_HIBERNATE_CONFIG_SYSTEM_PROPERTY);

        if (s != null) {
            setGenerateHibernateCfg(Boolean
                    .getBoolean(GENERATE_HIBERNATE_CONFIG_SYSTEM_PROPERTY));
        }
    }

    private void checkRegenerate() {

        String s = properties.getProperty(REGENERATE_SYSTEM_PROPERTY);

        if (s != null) {
            setRegenerate(Boolean.getBoolean(REGENERATE_SYSTEM_PROPERTY));
        }

    }

    private void checkGenerateOldStyleOps() {

        String s = properties.getProperty(GENERATE_OLD_STYLE_OPRS_PROPERTY);

        if (s != null) {
            setUseIndividualCRUDOperations(Boolean
                    .getBoolean(GENERATE_OLD_STYLE_OPRS_PROPERTY));
        }

    }

    @Override
    protected boolean customInit(Collection<String> requiredProperties) {

        // order determines precedence and matters

        checkImportMode(); // sets importDatabase and generateServiceClass

        if (importDatabase) {
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

        if (importDatabase) {
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

        if (Arrays.binarySearch(args, "--help") > -1
                || Arrays.binarySearch(args, "-h") > -1) {
            System.out.println(getHelp(ImportDB.class));
            return;
        }

        ImportDB importer = new ImportDB();

        for (int i = 0; i < args.length; i++) {

            if (!args[i].startsWith("-")) {

                File f = new File(args[i]);

                Properties p = com.wavemaker.runtime.data.util.DataServiceUtils
                        .loadDBProperties(f);

                importer.setProperties(p);
            }
        }

        boolean ok = importer.init();
        if (!ok) {
            return;
        }

        if (Arrays.binarySearch(args, "--values") > -1
                || Arrays.binarySearch(args, "-v") > -1) {
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

        return "\nUsage:\n\n" + "System Properties (optional in brackets):\n"
                + "  -D"
                + DESTDIR_SYSTEM_PROPERTY
                + "=<root output dir>\n"
                + "  -D"
                + SERVICE_CLASS_SYSTEM_PROPERTY
                + "=<fully qualified service class name>\n"
                + "  -D"
                + USER_SYSTEM_PROPERTY
                + "=<db user>\n"
                + "  -D"
                + CONNECTION_URL_SYSTEM_PROPERTY
                + "=<jdbc connection url>\n"
                + "  [-D"
                + PASS_SYSTEM_PROPERTY
                + "=<db password>]\n"
                + "  [-D"
                + TABLE_FILTER_SYSTEM_PROPERTY
                + "=<regular expression>]\n"
                + "  [-D"
                + SCHEMA_FILTER_SYSTEM_PROPERTY
                + "=<regular expression>]\n"
                + "  [-D"
                + CLASSES_DIR_SYSTEM_PROPERTY
                + "=<directory for generated classes>]\n"
                + "\n"
                + "Arguments (all optional):\n\n"
                + "  path to properties file\n"
                + "  -v|--values: show runtime values of properties\n"
                + "  -h|--help: this message\n\n"
                + "Example:\n\n"
                + "  java \\\n"
                + "    -D"
                + DESTDIR_SYSTEM_PROPERTY
                + "=servicedir \\\n"
                + "    -D"
                + SERVICE_CLASS_SYSTEM_PROPERTY
                + "=com.test.DBService \\\n"
                + "    -D"
                + USER_SYSTEM_PROPERTY
                + "=root \\\n"
                + "    -D"
                + CONNECTION_URL_SYSTEM_PROPERTY
                + "=jdbc:mysql://localhost:3306/sakila \\\n"
                + "    -D"
                + DRIVER_CLASS_NAME_SYSTEM_PROPERTY
                + "=com.mysql.jdbc.Driver \\\n"
                + "    "
                + mainClass.getName()
                + "\n";
    }
}
