/*
 * Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.TreeSet;

import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.OneToManyMap;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.client.TreeNode;
import com.wavemaker.runtime.data.DataServiceDefinition;
import com.wavemaker.runtime.data.DataServiceInternal;
import com.wavemaker.runtime.data.DataServiceType;
import com.wavemaker.runtime.data.ExternalDataModelConfig;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.data.util.JDBCUtils;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.runtime.ws.WebServiceType;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.compiler.ProjectCompiler;
import com.wavemaker.tools.data.util.DataServiceUtils;
import com.wavemaker.tools.deployment.DeploymentInfo;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.ClassLoaderFactory;
import com.wavemaker.tools.service.CompileService;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.util.AntUtils;

/**
 * @author Simon Toens
 * @version $Rev: 27087 $ - $Date: 2009-07-23 16:27:07 -0700 (Thu, 23 Jul 2009) $
 * 
 */
public class DataModelManager {

    private static final String DATABASES_NODE = "Databases";

    private static final String LIVETABLES_NODE = "LiveTables";

    private static final String QUERIES_NODE = "Queries";

    public static final String HSQL_SAMPLE_DB_SUB_DIR = "data";

    public static final String HSQLDB = ":hsqldb:";

    public static final String HSQLFILE_PROP = "hsqldbFile";

    private final OneToManyMap<String, String> dataModelNames = new OneToManyMap<String, String>();

    private final Map<DataModelKey, DataModelConfiguration> dataModels = new HashMap<DataModelKey, DataModelConfiguration>();

    // all data model names that have been imported
    private final Collection<String> importedDataModels = new HashSet<String>();

    private ProjectManager projectManager = null;

    private DesignServiceManager serviceManager = null;

    private ProjectCompiler projectCompiler = null;

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    public void setDesignServiceManager(DesignServiceManager serviceManager) {
        this.serviceManager = serviceManager;
    }

    public void setProjectCompiler(ProjectCompiler projectCompiler) {
        this.projectCompiler = projectCompiler;
    }

    public void prepareForDeployment(DeploymentInfo deployment) {

    }

    public void importDatabase(String username, String password, String connectionUrl, String serviceId, String packageName, String tableFilter,
        String schemaFilter, String catalogName, String driverClassName, String dialectClassName, String revengNamingStrategyClassName,
        boolean impersonateUser, String activeDirectoryDomain) {

        this.serviceManager.validateServiceId(serviceId);

        File outputDir = getServicePath(serviceId);
        File classesDir;
        try {
            classesDir = this.projectManager.getCurrentProject().getWebInfClasses().getFile();
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

        ImportDB importer = null;

        try {

            importer = runImporter(username, password, connectionUrl, serviceId, packageName, tableFilter, schemaFilter, catalogName,
                driverClassName, dialectClassName, revengNamingStrategyClassName, impersonateUser, activeDirectoryDomain, outputDir, classesDir);

            registerService(serviceId, importer);

            String hsqldbFileName = null;

            // Add the hsqldb file name to the property file
            if (connectionUrl.contains(HSQLDB)) {
                int n = connectionUrl.indexOf("/data") + 6;
                String partialCxn = connectionUrl.substring(n);
                int k = partialCxn.indexOf(';');
                hsqldbFileName = partialCxn.substring(0, k);

                Properties props = importer.getProperties();
                props.setProperty(HSQLFILE_PROP, hsqldbFileName);
                getDataModel(serviceId).writeConnectionProperties(props);
            }

        } catch (RuntimeException ex) {
            try {
                // if import fails, don't leave artifacts from
                // import attempt around
                this.serviceManager.deleteService(serviceId);
            } catch (IOException ignore) {
            } catch (NoSuchMethodException ignore) {
            }

            throw ex;
        } finally {
            if (importer != null) {
                importer.dispose();
            }
        }
    }

    public String getExportDDL(String username, String password, String connectionUrl, String serviceId, String schemaFilter, String driverClassName,
        String dialectClassName, boolean overrideTable) {

        if (connectionUrl.contains(HSQLDB)) {
            connectionUrl = reWriteCxnUrlForHsqlDB(connectionUrl);
        }

        ExportDB exporter = getExporter(username, password, connectionUrl, serviceId, schemaFilter, driverClassName, dialectClassName, overrideTable);

        exporter.setExportToDB(false);
        exporter.setVerbose(false);

        try {
            exporter.run();

            return exporter.getDDL();

        } catch (RuntimeException ex) {
            throw com.wavemaker.runtime.data.util.DataServiceUtils.unwrap(ex);
        } finally {
            exporter.dispose();
        }
    }

    public String exportDatabase(String username, String password, String connectionUrl, String serviceId, String schemaFilter,
        String driverClassName, String dialectClassName, String revengNamingStrategyClassName, boolean overrideTable) {

        if (connectionUrl.contains(HSQLDB)) {
            connectionUrl = reWriteCxnUrlForHsqlDB(connectionUrl);
        }

        ExportDB exporter = getExporter(username, password, connectionUrl, serviceId, schemaFilter, driverClassName, dialectClassName, overrideTable);

        String rtn = "";

        String hsqldbFileName = null;

        if (connectionUrl.contains(HSQLDB)) {
            hsqldbFileName = this.extractHsqlDBFileName(connectionUrl);
        }

        exporter.setExportToDB(true);

        try {
            exporter.run();
            StringBuilder sb = new StringBuilder();
            for (Throwable th : exporter.getErrors()) {
                sb.append(th.getMessage());
                sb.append(SystemUtils.getLineBreak());
                sb.append(SystemUtils.getLineBreak());
            }
            rtn = sb.toString().trim();

            if (connectionUrl.contains(HSQLDB)) {
                Properties props = exporter.getProperties();
                props.setProperty(HSQLFILE_PROP, hsqldbFileName);
                getDataModel(serviceId).writeConnectionProperties(props);
            } else {
                getDataModel(serviceId).writeConnectionProperties(exporter.getProperties());
            }
        } catch (RuntimeException ex) {
            throw com.wavemaker.runtime.data.util.DataServiceUtils.unwrap(ex);
        } finally {
            exporter.dispose();
        }

        return rtn;
    }

    public void reImport(String dataModelName, String username, String password, String connectionUrl, String tableFilter, String schemaFilter,
        String driverClassName, String dialectClassName, String revengNamingStrategyClassName, boolean impersonateUser, String activeDirectoryDomain) {

        reImport(getDataModel(dataModelName), username, password, connectionUrl, dataModelName, tableFilter, schemaFilter, driverClassName,
            dialectClassName, revengNamingStrategyClassName, null, impersonateUser, activeDirectoryDomain);
    }

    public void reImport(DataModelConfiguration cfg, String username, String password, String connectionUrl, String serviceId, String tableFilter,
        String schemaFilter, String driverClassName, String dialectClassName, String revengNamingStrategyClassName, String catalogName,
        boolean impersonateUser, String activeDirectoryDomain) {

        ImportDB importer = null;

        DataModelConfiguration tmpCfg = null;
        // import into a tmp location first in case something goes wrong
        File tmpServiceRoot = null;

        try {
            tmpServiceRoot = IOUtils.createTempDirectory();
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        }

        // keep queries, then add them to new datamodel below
        Collection<QueryInfo> queries = cfg.getQueries();

        try {

            String packageName = cfg.getDataPackage();

            if (packageName.endsWith("." + DataServiceConstants.DATA_PACKAGE_NAME)) {
                packageName = StringUtils.fromLastOccurrence(packageName, DataServiceConstants.DATA_PACKAGE_NAME, -1);
            }

            importer = runImporter(username, password, connectionUrl, serviceId, packageName, tableFilter, schemaFilter, catalogName,
                driverClassName, dialectClassName, revengNamingStrategyClassName, impersonateUser, activeDirectoryDomain, tmpServiceRoot,
                tmpServiceRoot);

            File tmpCfgFile = new File(tmpServiceRoot, serviceId + DataServiceConstants.SPRING_CFG_EXT);

            tmpCfg = new DataModelConfiguration(tmpCfgFile);

            // see if we can successfully add queries - this will blow
            // up if queries reference types that are no longer there
            tmpCfg.addUserQueries(queries);
            tmpCfg.save(true);
            tmpCfg.revert();

            if (tmpCfg.getEntityNames().isEmpty()) {
                throw new ConfigurationException("ReImport didn't create any types");
            }

            // the point of no return for the data model files -
            // cleanup current data model and copy new imported one
            cfg.dispose();

            try {
                // serviceManager.deleteService(serviceId);
                this.serviceManager.deleteServiceSmd(serviceId);
            } catch (IOException ex) {
                throw new ConfigurationException(ex);
            } catch (NoSuchMethodException ex) {
                throw new ConfigurationException(ex);
            }

            // copy imported files into their final service dir home
            File serviceRoot = getServicePath(serviceId);

            AntUtils.copyDir(tmpServiceRoot, serviceRoot, null, "**/*.class");
            File classesDir;
            try {
                classesDir = this.projectManager.getCurrentProject().getWebInfClasses().getFile();
            } catch (IOException ex) {
                throw new WMRuntimeException(ex);
            }
            AntUtils.copyDir(tmpServiceRoot, classesDir, "**/*.class", null);

            registerService(serviceId, importer);

            // set queries from previous dm, in order to preserve user queries
            DataModelConfiguration dmc = getDataModel(serviceId);
            dmc.addUserQueries(queries);
            save(serviceId, dmc, false, false);

            String hsqldbFileName = null;

            // Add the hsqldb file name to the property file
            if (connectionUrl.contains(HSQLDB)) {
                hsqldbFileName = extractHsqlDBFileName(connectionUrl);

                Properties props = importer.getProperties();
                props.setProperty(HSQLFILE_PROP, hsqldbFileName);
                getDataModel(serviceId).writeConnectionProperties(props);
            }

        } finally {
            if (importer != null) {
                importer.dispose();
            }
            if (tmpCfg != null) {
                tmpCfg.dispose();
            }
            try {
                IOUtils.deleteRecursive(tmpServiceRoot);
            } catch (IOException ignore) {
            }
        }

    }

    public void dispose(String projectName) {
        Collection<String> c = this.dataModelNames.get(projectName);
        if (c == null) {
            return;
        }
        for (String dataModelName : new HashSet<String>(c)) {
            DataModelKey key = getKey(projectName, dataModelName);
            remove(key);
        }
    }

    public void removeDataModel(String dataModelName) {
        remove(dataModelName);
        try {
            this.serviceManager.deleteService(dataModelName);
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        } catch (NoSuchMethodException ex) {
            throw new ConfigurationException(ex);
        }
    }

    public void newDataModel(String dataModelName) {

        this.serviceManager.validateServiceId(dataModelName);

        File destDir = getServicePath(dataModelName);

        String serviceClassPackage = DataServiceUtils.getDefaultPackage(dataModelName);
        String dataPackage = DataServiceUtils.getDefaultDataPackage(dataModelName);

        DataServiceUtils.createEmptyDataModel(destDir, dataModelName, serviceClassPackage, dataPackage);

        DataModelConfiguration cfg = initialize(dataModelName, true);

        String serviceClass = StringUtils.fq(serviceClassPackage, StringUtils.upperCaseFirstLetter(dataModelName));

        this.serviceManager.defineService(new com.wavemaker.tools.data.DataServiceDefinition(dataModelName, cfg, this.serviceManager, serviceClass)); // salesforce

        save(dataModelName, cfg, true, true);
    }

    public void updateEntity(String dataModelName, String entityName, EntityInfo entity, boolean save) {

        DataModelConfiguration mgr = null;

        mgr = getDataModel(dataModelName);

        mgr.updateEntity(entityName, entity);

        if (save) {
            save(dataModelName, mgr);
        }
    }

    public void deleteEntity(String dataModelName, String entityName) {

        if (ObjectUtils.isNullOrEmpty(dataModelName)) {
            throw new IllegalArgumentException("dataModelName must bet set");
        }

        if (ObjectUtils.isNullOrEmpty(entityName)) {
            throw new IllegalArgumentException("entityName must be set");
        }

        DataModelConfiguration cfg = getDataModel(dataModelName);

        cfg.deleteEntity(entityName);

        save(dataModelName, cfg);
    }

    public void deleteQuery(String dataModelName, String queryName) {

        if (ObjectUtils.isNullOrEmpty(dataModelName)) {
            throw new IllegalArgumentException("dataModelName must bet set");
        }

        if (ObjectUtils.isNullOrEmpty(queryName)) {
            throw new IllegalArgumentException("queryName must be set");
        }

        DataModelConfiguration cfg = getDataModel(dataModelName);

        cfg.deleteQuery(queryName);

        save(dataModelName, cfg, false, false);
    }

    public void updateColumns(String dataModelName, String entityName, List<ColumnInfo> columns, List<PropertyInfo> properties) {
        DataModelConfiguration mgr = getDataModel(dataModelName);
        mgr.updateColumns(entityName, columns, properties);
        // save(mgr); // save happens in updateRelated, called from client
    }

    public void updateRelated(String dataModelName, String entityName, RelatedInfo[] related) {
        DataModelConfiguration mgr = getDataModel(dataModelName);
        mgr.updateRelated(entityName, Arrays.asList(related));

        save(dataModelName, mgr);
    }

    public void updateQuery(final String dataModelName, QueryInfo query) {
        initialize(false);
        final DataModelConfiguration mgr = getDataModel(dataModelName);
        mgr.updateQuery(query);

        // no need to compile because checkQuery, which runs
        // right before, already compiled
        save(dataModelName, mgr, false, false);
    }

    private void save(String dataModelName, DataModelConfiguration cfg) {
        save(dataModelName, cfg, false, true);
    }

    private void save(final String dataModelName, final DataModelConfiguration mgr, boolean forceUpdate, boolean compile) {

        final ExternalDataModelConfig extCfg = new ExternalDataModelConfig() {

            public boolean returnsSingleResult(String operationName) {
                return mgr.getQueryByOperationName(operationName).getReturnsSingleResult();
            }

            public String getOutputType(String operationName) {
                return mgr.getQueryByOperationName(operationName).getOutputType();
            }

            public String getServiceClass() {
                return DataModelManager.this.serviceManager.getService(dataModelName).getClazz();
            }
        };

        try {
            mgr.save(true, new DataModelConfiguration.UpdateCallback() {

                public void update(DataServiceDefinition def) {
                    def.setExternalConfig(extCfg);
                    setupElementTypeFactory(def.getServiceId(), def);
                    if (dataModelName.equals(CommonConstants.SALESFORCE_SERVICE)) {// salesforce
                        DataModelManager.this.serviceManager.defineService(def, mgr, null, null); // salesforce
                    } else {
                        DataModelManager.this.serviceManager.defineService(def);
                    }
                }
            }, forceUpdate, compile);
            mgr.removeBackupFiles();
        } catch (RuntimeException ex) {
            // initializing hibernate failed, it must not have
            // liked the change we wrote to disk - revert the change
            // and re-init the manager
            mgr.revert();
            mgr.dispose();
            initialize(dataModelName, true);
            throw com.wavemaker.runtime.data.util.DataServiceUtils.unwrap(ex);
        }
    }

    public void validate(String dataModelName) {
        validate(getDataModel(dataModelName));
    }

    public InitData getTypeRefTree() {
        InitData rtn = new InitData(getDatabaseObjectsTree(DATABASES_NODE, true));
        for (String dataModelName : getDataModelNames()) {
            DataModelConfiguration mgr = getDataModel(dataModelName);
            rtn.addValueTypes(dataModelName, mgr.getValueTypes());
        }
        return rtn;
    }

    public InitData getQueriesTree() {
        InitData rtn = new InitData(getDatabaseObjectsTree(DATABASES_NODE, false));
        for (String dataModelName : getDataModelNames()) {
            DataModelConfiguration mgr = getDataModel(dataModelName);
            rtn.addValueTypes(dataModelName, mgr.getValueTypes());
        }
        return rtn;
    }

    public Collection<String> getDataModelNames() { // salesforce
        Collection<String> names = getDataModelNamesAll();
        names.remove(CommonConstants.SALESFORCE_SERVICE);
        return names;
    }

    public Collection<String> getDataModelNames_SF() { // salesforce
        Collection<String> names = getDataModelNamesAll();
        return names;
    }

    public Collection<String> getDataModelNamesAll() { // salesforce
        initialize(false);
        if (this.dataModelNames.containsKey(getProjectName())) {
            return new TreeSet<String>(this.dataModelNames.get(getProjectName()));
        } else {
            return Collections.emptySet();
        }
    }

    public DataModelConfiguration getDataModel(String name) {
        initialize(false);
        DataModelKey k = getKey(name);
        if (!this.dataModels.containsKey(k)) {
            throw new ConfigurationException("Unknown data model " + name + ".  Known ones are " + getDataModelNames());
        }
        return this.dataModels.get(k);
    }

    public void reload() {
        initialize(true);
    }

    private ExportDB getExporter(String username, String password, String connectionUrl, String serviceId, String schemaFilter,
        String driverClassName, String dialectClassName, boolean overrideTable) {

        //
        // Re-write the connection url if it is HSQLDB so that the db is
        // always under the webAppRoot
        //
        if (connectionUrl.contains(HSQLDB)) {
            connectionUrl = reWriteCxnUrlForHsqlDB(connectionUrl);
        }

        // composite classes must be compiled
        compile();

        DataModelConfiguration mgr = getDataModel(serviceId);

        File serviceDir = getServicePath(serviceId);

        List<String> mappingPaths = mgr.getMappings();
        if (mappingPaths == null || mappingPaths.isEmpty()) {
            throw new ConfigurationException("No entities to export");
        }
        String path = mappingPaths.iterator().next();
        File hbmFiles = new File(serviceDir, new File(path).getParent());

        File classesDir;
        try {
            classesDir = this.projectManager.getCurrentProject().getWebInfClasses().getFile();
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

        ExportDB exporter = new ExportDB();
        exporter.setHbmFilesDir(hbmFiles);
        exporter.setClassesDir(classesDir);
        exporter.setUsername(username);
        exporter.setPassword(password);
        exporter.setConnectionUrl(connectionUrl);
        exporter.setVerbose(true);
        exporter.setOverrideTable(overrideTable);

        if (!ObjectUtils.isNullOrEmpty(driverClassName)) {
            exporter.setDriverClassName(driverClassName);
        }

        if (!ObjectUtils.isNullOrEmpty(dialectClassName)) {
            exporter.setDialect(dialectClassName);
        }

        exporter.init();

        if (ObjectUtils.isNullOrEmpty(schemaFilter)) {
            // try to default schema filter so that import will work
            schemaFilter = DataServiceConstants.DEFAULT_FILTER;
            if (exporter.isOracle()) {
                schemaFilter = username.toUpperCase();
            } else if (exporter.isSQLServer()) {
                schemaFilter = DataServiceConstants.SQL_SERVER_DEFAULT_SCHEMA;
            }
        }

        return exporter;
    }

    public void compile() {
        this.serviceManager.getDeploymentManager().build();
    }

    private void registerService(String serviceId, ImportDB importer) {

        initialize(serviceId, true);

        ServiceDefinition def = DataServiceUtils.unwrap(importer.getServiceDefinition());

        setupElementTypeFactory(serviceId, (DataServiceInternal) def);

        this.serviceManager.defineService(def);
    }

    private void validate(DataModelConfiguration mgr) {
        mgr.initRuntime();
    }

    private void setupElementTypeFactory(String serviceId, DataServiceInternal di) {

        DataModelConfiguration mgr = getDataModel(serviceId);

        DataServiceUtils.setupElementTypeFactory(mgr, di);
    }

    private List<TreeNode> getDatabaseObjectsTree(String rootNodeName, boolean getTypes) {
        TreeNode rtn = new TreeNode(rootNodeName);
        rtn.setClosed(false);
        rtn.addData("DBOBJS");
        rtn.addData(rtn.getContent());

        for (String dataModelName : getDataModelNames_SF()) {

            DataModelConfiguration mgr = getDataModel(dataModelName);

            TreeNode dataModelNode = new TreeNode(dataModelName);
            dataModelNode.setClosed(false);
            dataModelNode.addData("DB");
            dataModelNode.addData(dataModelNode.getContent());
            rtn.addChild(dataModelNode);

            if (getTypes) {
                TreeNode dataObjectsNode = new TreeNode(LIVETABLES_NODE);
                dataObjectsNode.setClosed(false);
                dataObjectsNode.addData("TPS");
                dataObjectsNode.addData(dataObjectsNode.getContent());
                dataModelNode.addChild(dataObjectsNode);
                mgr.addDataObjectTree(dataObjectsNode);
            } else {
                TreeNode queriesNode = new TreeNode(QUERIES_NODE);
                queriesNode.setClosed(false);
                queriesNode.addData("QRS");
                queriesNode.addData(queriesNode.getContent());
                dataModelNode.addChild(queriesNode);
                mgr.addQueryTree(queriesNode);
            }
        }

        List<TreeNode> a = new ArrayList<TreeNode>(1);
        a.add(rtn);

        return a;
    }

    // private File getServicePath(String serviceId) {
    public File getServicePath(String serviceId) {
        try {
            return this.serviceManager.getServiceRuntimeDirectory(serviceId).getFile();
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    private String getProjectName() {
        return this.projectManager.getCurrentProject().getProjectName();
    }

    private DataModelKey getKey(String dataModelName) {
        return getKey(getProjectName(), dataModelName);
    }

    private DataModelKey getKey(String projectName, String dataModelName) {
        return new DataModelKey(projectName, dataModelName);
    }

    private void initialize(boolean force) {

        String[] types = { DataServiceType.TYPE_NAME, WebServiceType.TYPE_NAME }; // salesforce

        Set<Service> services = this.serviceManager.getServicesByType(types); // salesforce

        for (Service service : services) {
            // Only SalesForce service should be treated as a data model among web services
            if (service.getType().equals(WebServiceType.TYPE_NAME) && !service.getId().equals(CommonConstants.SALESFORCE_SERVICE)) {
                continue;
            }
            initialize(service.getId(), force);
        }
    }

    private void remove(String serviceId) {
        remove(getKey(serviceId));
    }

    private void remove(DataModelKey key) {
        this.importedDataModels.remove(key.dataModelName);
        DataModelConfiguration cfg = this.dataModels.remove(key);
        cfg.dispose();
        this.dataModelNames.removeValue(getProjectName(), key.dataModelName);
    }

    private DataModelConfiguration initialize(final String serviceId, boolean force) {

        DataModelKey key = getKey(serviceId);

        if (this.dataModels.containsKey(key)) {
            if (force) {
                remove(serviceId);
            } else {
                return null;
            }
        }

        File cfg = new File(getServicePath(serviceId), DataServiceUtils.getCfgFileName(serviceId));

        DataModelConfiguration rtn = null;

        try {

            ExternalDataModelConfig externalConfig = new DesignExternalDataModelConfig(serviceId, this.serviceManager);

            ClassLoaderFactory clf = new ClassLoaderFactory() {

                public ClassLoader getClassLoader() {
                    return DataModelManager.this.serviceManager.getServiceRuntimeClassLoader(serviceId);
                }
            };

            CompileService cs = new CompileService() {

                public void compile(boolean clean) {
                    // only "compile" here, don't "build".
                    // "build" generates the service class and we don't
                    // want to do that because we need to compile generated
                    // java code so that we can initialize Hibernate
                    // and then save data model changes.
                    // the service class can only be generated once the
                    // data model has been saved, since the generation uses
                    // information from the saved data model.
                    // specifically, generating the service class here
                    // will cause a compilation error if the service class
                    // references a type that was just deleted.
                    DeploymentManager mgr = DataModelManager.this.serviceManager.getDeploymentManager();
                    if (clean) {
                        mgr.cleanCompile();
                    } else {
                        mgr.compile();
                    }
                }
            };

            rtn = new DataModelConfiguration(cfg, this.projectManager.getCurrentProject(), serviceId, externalConfig, clf, cs);

            this.dataModels.put(getKey(serviceId), rtn);
            this.dataModelNames.put(getProjectName(), serviceId);

            if (DataServiceLoggers.parserLogger.isInfoEnabled()) {
                DataServiceLoggers.parserLogger.info("Initialized datamodel: " + cfg);
            }

        } catch (IOException ex) {
            DataServiceLoggers.parserLogger.error("Unable to initialize datamodel at " + cfg + ".  Does it exist?", ex);
        }

        return rtn;
    }

    private ImportDB runImporter(String username, String password, String connectionUrl, String serviceId, String packageName, String tableFilter,
        String schemaFilter, String catalogName, String driverClassName, String dialectClassName, String revengNamingStrategyClassName,
        boolean impersonateUser, String activeDirectoryDomain, File outputDir, File classesDir) {

        //
        // Re-write the connection url if it is HSQLDB so that the db is
        // always under the webAppRoot
        //
        if (connectionUrl.contains(HSQLDB)) {
            connectionUrl = reWriteCxnUrlForHsqlDB(connectionUrl);
        }

        if (ObjectUtils.isNullOrEmpty(packageName)) {
            throw new IllegalArgumentException("package must be set");
        }

        packageName = packageName.toLowerCase();
        if (packageName.endsWith(".")) {
            if (packageName.length() == 1) {
                throw new IllegalArgumentException("illegal package name " + packageName);
            }
            packageName = packageName.substring(0, packageName.length() - 1);
        }

        File javaDir = getJavaDir(outputDir, packageName);

        ImportDB importer = new ImportDB();
        importer.setDestDir(outputDir);
        importer.setUsername(username);
        importer.setPassword(password);
        importer.setClassesDir(classesDir);
        importer.setConnectionUrl(connectionUrl);
        importer.setServiceName(serviceId);
        importer.setCatalogName(catalogName);
        importer.setPackage(packageName);
        importer.setJavaDir(javaDir);
        importer.setImpersonateUser(impersonateUser);
        importer.setActiveDirectoryDomain(activeDirectoryDomain);
        importer.setProjectCompiler(this.projectCompiler);
        importer.setCurrentProjectName(this.projectManager.getCurrentProject().getProjectName());

        String dataPackage = packageName;
        if (!dataPackage.endsWith("." + DataServiceConstants.DATA_PACKAGE_NAME)) {
            // make sure package name for data objects won't conflict
            // with generated service class name
            String s = StringUtils.getUniqueName(DataServiceConstants.DATA_PACKAGE_NAME, serviceId.toLowerCase());
            dataPackage = StringUtils.fq(packageName, s);
        }
        importer.setDataPackage(dataPackage);

        importer.setGenerateServiceClass(false);

        if (!ObjectUtils.isNullOrEmpty(tableFilter)) {
            importer.setTableFilterSplit(tableFilter);
        }

        if (!ObjectUtils.isNullOrEmpty(schemaFilter)) {
            importer.setSchemaFilterSplit(schemaFilter);
        }

        if (!ObjectUtils.isNullOrEmpty(driverClassName)) {
            importer.setDriverClassName(driverClassName);
        }

        if (!ObjectUtils.isNullOrEmpty(dialectClassName)) {
            importer.setDialect(dialectClassName);
        }

        if (!ObjectUtils.isNullOrEmpty(revengNamingStrategyClassName)) {
            importer.setRevengNamingStrategy(revengNamingStrategyClassName);
        }

        importer.init();

        try {
            importer.testConnection();
        } catch (RuntimeException ex) {
            throw com.wavemaker.runtime.data.util.DataServiceUtils.unwrap(ex);
        }

        try {
            importer.run();
            this.importedDataModels.add(serviceId);

        } catch (RuntimeException ex) {
            try {
                importer.dispose();
            } catch (Exception ignore) {
            }
            throw ex;
        }

        return importer;

    }

    public String getWebAppRoot() {
        try {
            return this.projectManager.getCurrentProject().getWebAppRoot().getFile().getPath();
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    private String reWriteCxnUrlForHsqlDB(String connectionUrl) {
        // File webAppRoot = projectManager.getCurrentProject().getWebAppRoot();

        // return JDBCUtils.reWriteConnectionUrl(webAppRoot.getPath() + "/" + HSQL_SAMPLE_DB_SUB_DIR,
        // connectionUrl);

        return JDBCUtils.reWriteConnectionUrl(connectionUrl, getWebAppRoot());
    }

    private String extractHsqlDBFileName(String connectionUrl) {
        int n = connectionUrl.indexOf("/data") + 6;
        String partialCxn = connectionUrl.substring(n);
        int k = partialCxn.indexOf(';');
        return partialCxn.substring(0, k);
    }

    public static File getJavaDir(File dir, String pathname) {
        return new File(dir, pathname.replace(".", "/") + "/data");
    }

    private class DataModelKey {

        private final String projectName;

        private final String dataModelName;

        DataModelKey(String projectName, String dataModelName) {

            if (projectName == null) {
                throw new IllegalArgumentException("projectName cannot be null");
            }

            if (dataModelName == null) {
                throw new IllegalArgumentException("dataModelName cannot be null");
            }

            this.projectName = projectName;
            this.dataModelName = dataModelName;
        }

        @Override
        public boolean equals(Object o) {
            if (!(o instanceof DataModelKey)) {
                return false;
            }

            DataModelKey other = (DataModelKey) o;
            return this.projectName.equals(other.projectName) && this.dataModelName.equals(other.dataModelName);
        }

        @Override
        public int hashCode() {
            return this.projectName.hashCode() ^ this.dataModelName.hashCode();
        }

        @Override
        public String toString() {
            return this.projectName + "|" + this.dataModelName;
        }
    }
}
