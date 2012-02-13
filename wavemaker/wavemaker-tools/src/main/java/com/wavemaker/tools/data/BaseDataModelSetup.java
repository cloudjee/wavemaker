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
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.tools.ant.Project;
import org.hibernate.cfg.Configuration;
import org.hibernate.dialect.DB2Dialect;
import org.hibernate.dialect.HSQLDialect;
import org.hibernate.dialect.OracleDialect;
import org.hibernate.dialect.PostgreSQLDialect;
import org.hibernate.dialect.SQLServerDialect;
import org.hibernate.tool.ant.ExporterTask;
import org.hibernate.tool.ant.GenericExporterTask;
import org.hibernate.tool.hbm2x.Exporter;
import org.springframework.core.io.Resource;

import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.MessageResource;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.data.dialect.MySQLDialect;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.data.util.JDBCUtils;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.data.reveng.DefaultRevengNamingStrategy;
import com.wavemaker.tools.data.reveng.MSSQLRevengNamingStrategy;
import com.wavemaker.tools.compiler.ProjectCompiler;
import com.wavemaker.tools.project.StudioFileSystem;

/**
 * @author Simon Toens
 */
public abstract class BaseDataModelSetup {

    private static final String JDBC_URL_SCHEME = "jdbc:";

    private static final String HSQL_DB_TYPE = "hsql";

    private static final String MYSQL_DB_TYPE = "mysql";

    private static final String ORACLE_DB_TYPE = "oracle";

    private static final String SQL_SERVER_DB_TYPE = "sqlserver";

    private static final String SQL_SERVER_URL_SCHEME = "jtds:";

    private static final String DB2_DB_TYPE = "db2";

    private static final String POSTGRESQL_DB_TYPE = "postgresql";

    private static final String DEFAULT_DB_TYPE = MYSQL_DB_TYPE;

    private static final String DEFAULT_HOST_PORT = "://localhost:3306";

    private static final String TABLE_FILTER_SEP = ",";

    private static final String SCHEMA_FILTER_SEP = ",";

    protected static final Map<String, Class<?>> DB_TYPES_TO_DIALECTS = new HashMap<String, Class<?>>(6);

    protected static final Map<String, String> DB_TYPES_TO_DRIVER_CLASSES = new HashMap<String, String>(6);

    static {
        DB_TYPES_TO_DIALECTS.put(HSQL_DB_TYPE, HSQLDialect.class);
        DB_TYPES_TO_DRIVER_CLASSES.put(HSQL_DB_TYPE, "org.hsqldb.jdbcDriver");

        DB_TYPES_TO_DIALECTS.put(MYSQL_DB_TYPE, MySQLDialect.class);
        DB_TYPES_TO_DRIVER_CLASSES.put(MYSQL_DB_TYPE, "com.mysql.jdbc.Driver");

        DB_TYPES_TO_DIALECTS.put(ORACLE_DB_TYPE, OracleDialect.class);
        DB_TYPES_TO_DRIVER_CLASSES.put(ORACLE_DB_TYPE, "oracle.jdbc.driver.OracleDriver");

        DB_TYPES_TO_DIALECTS.put(SQL_SERVER_DB_TYPE, SQLServerDialect.class);
        DB_TYPES_TO_DRIVER_CLASSES.put(SQL_SERVER_DB_TYPE, "net.sourceforge.jtds.jdbc.Driver");

        DB_TYPES_TO_DIALECTS.put(DB2_DB_TYPE, DB2Dialect.class);
        DB_TYPES_TO_DRIVER_CLASSES.put(DB2_DB_TYPE, "com.ibm.db2.jcc.DB2Driver");

        DB_TYPES_TO_DIALECTS.put(POSTGRESQL_DB_TYPE, PostgreSQLDialect.class);
        DB_TYPES_TO_DRIVER_CLASSES.put(POSTGRESQL_DB_TYPE, "org.postgresql.Driver");
    }

    protected static final String SYSTEM_PROPERTY_PREFIX = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX + "importdb.";

    private static String strip(String s) {
        return StringUtils.fromFirstOccurrence(s, DataServiceConstants.PROP_SEP);
    }

    protected static final String USER_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + strip(DataServiceConstants.DB_USERNAME);

    protected static final String PASS_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + strip(DataServiceConstants.DB_PASS);

    protected static final String CONNECTION_URL_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + strip(DataServiceConstants.DB_URL);

    protected static final String DRIVER_CLASS_NAME_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + strip(DataServiceConstants.DB_DRIVER_CLASS_NAME);

    protected static final String DBTYPE_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "dbtype";

    protected static final String HIBERNATE_DIALECT_SYSTEM_PROPERTY = "hibernate.dialect";

    protected static final String NAME_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "serviceName";

    protected static final String PACKAGE_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "package";

    protected static final String DATA_PACKAGE_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "dataPackage";

    protected static final String DESTDIR_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "outputDir";

    protected static final String TABLE_FILTER_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "tableFilter";

    protected static final String SCHEMA_FILTER_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "schemaFilter";

    private static final String REVENG_NAMING_STRATEGY_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX + "revengNamingStrategy";

    private final String DEFAULT_FILTER = ".*";

    public static String getDriverClassForDBType(String dbtype) {
        return DB_TYPES_TO_DRIVER_CLASSES.get(dbtype);
    }

    public static String getDialectForDBType(String dbtype) {
        return DB_TYPES_TO_DIALECTS.get(dbtype).getName();
    }

    public static String getDBTypeFromURL(String url) {
        if (!url.startsWith(JDBC_URL_SCHEME)) {
            throw new IllegalArgumentException("jdbc url must start with " + JDBC_URL_SCHEME);
        }
        String dbtype = url.substring(JDBC_URL_SCHEME.length()).toLowerCase();

        // MAV-1769
        if (dbtype.startsWith(SQL_SERVER_URL_SCHEME)) {
            return SQL_SERVER_DB_TYPE;
        }

        for (String t : DB_TYPES_TO_DIALECTS.keySet()) {
            if (dbtype.startsWith(t.toLowerCase())) {
                return t;
            }
        }
        return null;
    }

    public BaseDataModelSetup() {
        this(new Project());
    }

    public BaseDataModelSetup(Project project) {
        this.project = project;
    }

    private final WMHibernateToolTask parentTask = new WMHibernateToolTask();

    private final Project project;

    protected String serviceName = null;

    protected String driverClassName = null;

    protected String connectionUrl = null;

    protected String username = null;

    protected String password = null;

    protected String catalogName = null;

    protected String dbtype = null;

    protected String dialect = null;

    protected String className = null;

    protected List<String> tableFilters = new ArrayList<String>();

    protected List<String> schemaFilters = new ArrayList<String>();

    protected String revengNamingStrategy = null;

    // service class package
    protected String packageName = null;

    // data objects package
    protected String dataPackage = null;

    protected Resource destdir = null;

    protected Resource javadir = null;

    protected Properties properties = new Properties();

    protected boolean initialized = false;

    protected boolean impersonateUser = false;

    protected String activeDirectoryDomain = null;

    protected ProjectCompiler projectCompiler;

    protected ExporterFactory exporterFactory;

    protected StudioFileSystem fileSystem;

    private final List<File> tmpFiles = new ArrayList<File>();

    public void setDestDir(Resource destdir) {
        this.destdir = destdir;
        try {
            File f = this.destdir.getFile();
            getParentTask().setDestDir(f);
        } catch(IOException ex) {
            exporterFactory.setDestDir(destdir);     
        } catch(UnsupportedOperationException ex) {
            exporterFactory.setDestDir(destdir);     
        }
        //getParentTask().setDestDir(destdir);
    }

    public void setJavaDir(Resource javadir) {
        this.javadir = javadir;
    }

    public void setDefaultDBType() {
        setDBType(DEFAULT_DB_TYPE);
        setConnectionUrl(JDBC_URL_SCHEME + DEFAULT_DB_TYPE + DEFAULT_HOST_PORT);
        setDriverClassName(getDriverClassForDBType(DEFAULT_DB_TYPE));
        setDialect(getDialectForDBType(DEFAULT_DB_TYPE));
    }

    public void addSchemaFilter(String schemaFilter) {
        this.schemaFilters.add(schemaFilter);
    }

    public void setSchemaFilters(List<String> schemaFilters) {
        this.schemaFilters = schemaFilters;
    }

    public void addTableFilter(String tableFilter) {
        this.tableFilters.add(tableFilter);
    }

    public void setTableFilters(List<String> tableFilter) {
        this.tableFilters = tableFilter;
    }

    public void setTableFilter(String tableFilter) {
        this.tableFilters = new ArrayList<String>(1);
        this.tableFilters.add(tableFilter);
    }

    public void setTableFilterSplit(String tableFilter) {
        if (tableFilter != null) {
            for (String s : tableFilter.split(TABLE_FILTER_SEP)) {
                addTableFilter(s.trim());
            }
        }
    }

    public void setSchemaFilterSplit(String schemaFilter) {
        if (schemaFilter != null) {
            for (String s : schemaFilter.split(SCHEMA_FILTER_SEP)) {
                addSchemaFilter(s.trim());
            }
        }
    }

    public String getTableFilter() {
        return ObjectUtils.toString(this.tableFilters, ",");
    }

    public String getSchemaFilter() {
        return ObjectUtils.toString(this.schemaFilters, ",");
    }

    public void setRevengNamingStrategy(Class<?> revengNamingStrategy) {
        this.revengNamingStrategy = revengNamingStrategy.getName();
    }

    public void setRevengNamingStrategy(String revengNamingStrategy) {
        this.revengNamingStrategy = revengNamingStrategy;
    }

    public void setDriverClassName(String driverClassName) {
        this.driverClassName = driverClassName;
    }

    public String getDriverClassName() {
        return this.driverClassName;
    }

    public void setConnectionUrl(String connectionUrl) {
        this.connectionUrl = connectionUrl;
    }

    public String getConnectionUrl() {
        return this.connectionUrl;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return this.username;
    }

    public String getDialect() {
        return this.dialect;
    }

    public String getCatalogName() {
        return this.catalogName;
    }

    public boolean isImpersonateUser() {
        return this.impersonateUser;
    }

    public String getActiveDirectoryDomain() {
        return this.activeDirectoryDomain;
    }

    public void setCatalogName(String catalogName) {
        this.catalogName = catalogName;
    }

    public void setPassword(String password) {
        if (SystemUtils.isEncrypted(password)) {
            password = SystemUtils.decrypt(password);
        }
        this.password = password;
    }

    public String getPassword() {
        return this.password;
    }

    public void setDialect(String dialect) {
        this.dialect = dialect;
    }

    public void setDBType(String dbtype) {
        this.dbtype = dbtype;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getClassName() {
        return this.className;
    }

    public void setPackage(String packageName) {
        this.packageName = packageName;
    }

    public String getPackage() {
        return this.packageName;
    }

    public void setDataPackage(String dataPackage) {
        this.dataPackage = dataPackage;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    protected Project getProject() {
        return this.project;
    }

    public void setProperties(Properties additionalProperties) {
        this.properties.putAll(additionalProperties);
    }

    public void setImpersonateUser(boolean impersonateUser) {
        this.impersonateUser = impersonateUser;
    }

    public void setActiveDirectoryDomain(String activeDirectoryDomain) {
        this.activeDirectoryDomain = activeDirectoryDomain;
    }

    protected void registerTmpFileForCleanup(File f) {
        f.deleteOnExit(); // we really want this file to go away
        this.tmpFiles.add(f);
    }

    protected abstract boolean customInit(Collection<String> requiredProperties);

    protected abstract void customRun();

    protected abstract void customDispose();

    public boolean init() {

        Collection<String> requiredProperties = new HashSet<String>();

        boolean rtn = customInit(requiredProperties);

        checkProperties(requiredProperties);

        this.initialized = true;

        return rtn;
    }

    public void run() {
        if (!this.initialized) {
            boolean ok = init();
            if (!ok) {
                return;
            }
        }

        this.parentTask.setConfiguration(new Configuration());
        this.parentTask.setProject(this.project);

        customRun();
    }

    public void dispose() {
        try {
            customDispose();
        } finally {
            for (File f : this.tmpFiles) {
                try {
                    f.delete();
                } catch (Exception ignore) {
                }
            }
        }
    }

    protected void runDDL(String sql) {
        runDDL(sql, this.connectionUrl);
    }

    protected void runDDL(String sql, String url) {
        JDBCUtils.runSql(new String[] { sql }, url, this.username, this.password, this.driverClassName, DataServiceLoggers.importLogger, true);
    }

    /**
     * Returns all relevant configuration properties.
     */
    public Properties getProperties() {
        return getProperties(true);
    }

    private Properties getProperties(boolean strip) {

        Properties p = new Properties();

        p.put(DataServiceConstants.DB_USERNAME, this.username);
        p.put(DataServiceConstants.DB_PASS, this.password);
        p.put(DataServiceConstants.DB_URL, this.connectionUrl);
        p.put(DataServiceConstants.DB_DRIVER_CLASS_NAME, this.driverClassName);
        p.put(DataServiceConstants.DB_DIALECT, this.dialect);

        // preserve info about how db was imported
        String s = getTableFilter();
        if (ObjectUtils.isNullOrEmpty(s)) {
            s = this.DEFAULT_FILTER;
        }
        p.setProperty(DataServiceConstants.DB_TABLE_FILTER, s);

        s = getSchemaFilter();
        if (ObjectUtils.isNullOrEmpty(s)) {
            s = this.DEFAULT_FILTER;
        }
        p.setProperty(DataServiceConstants.DB_SCHEMA_FILTER, s);

        p.setProperty(DataServiceConstants.DB_REVENG_NAMING, this.revengNamingStrategy == null ? "" : this.revengNamingStrategy);

        Properties rtn = null;

        if (strip) {
            rtn = new Properties();
            for (Iterator<Object> iter = p.keySet().iterator(); iter.hasNext();) {
                String key = (String) iter.next();
                String value = p.getProperty(key);
                rtn.setProperty(strip(key), value);
            }
        } else {
            rtn = p;
        }

        return rtn;
    }

    protected Properties getHibernateConnectionProperties() {

        Properties rtn = DataServiceUtils.toHibernateConnectionProperties(getProperties(false));

        if (this.dbtype.equals(MYSQL_DB_TYPE)) {
            String defaultCatalog = this.catalogName;
            if (defaultCatalog == null && !this.connectionUrl.endsWith("/")) {
                defaultCatalog = this.connectionUrl.substring(this.connectionUrl.lastIndexOf("/") + 1);
            }
            if (defaultCatalog != null) {
                rtn.setProperty("hibernate.default_catalog", defaultCatalog);
            }
        }

        if (DataServiceLoggers.importLogger.isInfoEnabled()) {
            DataServiceLoggers.importLogger.info("Connection properties: " + rtn);
        }

        return rtn;
    }

    protected void checkDialectAndDBType(Collection<String> requiredProperties) {

        if (this.dbtype == null && this.dialect == null) {
            return;
        }

        if (this.dbtype != null && this.dialect == null) {
            // dialect not set, but we have dbtype, so determine Hibernate
            // Dialect from dbtype
            Class<?> c = DB_TYPES_TO_DIALECTS.get(this.dbtype);
            if (c == null) {
                throw new ConfigurationException("Unknown dbtype \"" + this.dbtype + "\", cannot determine dialect");
            }
            this.dialect = c.getName();
        } else if (this.dbtype == null && this.dialect != null) {
            // if Hibernate Dialect is set, use that and try to set dbtype to
            // something meaningful
            String s = this.dialect.toLowerCase();
            s = StringUtils.fromLastOccurrence(s, "dialect", -1);
            this.dbtype = StringUtils.fromLastOccurrence(s, ".");
        }
    }

    protected void checkTableFilter() {

        if (this.tableFilters.isEmpty()) {

            String s = this.properties.getProperty(TABLE_FILTER_SYSTEM_PROPERTY);

            if (s != null) {
                setTableFilterSplit(s);
            }
        }
    }

    protected void checkSchemaFilter() {

        if (this.schemaFilters.isEmpty()) {

            String s = this.properties.getProperty(SCHEMA_FILTER_SYSTEM_PROPERTY);

            if (s != null) {
                setSchemaFilterSplit(s);
            }
        }
    }

    protected void checkRevengNamingStrategy() {

        if (this.revengNamingStrategy == null) {

            this.revengNamingStrategy = this.properties.getProperty(REVENG_NAMING_STRATEGY_SYSTEM_PROPERTY);

            if (this.revengNamingStrategy == null) {
                if (this.dialect != null && this.dialect.contains("SQLServer")) {
                    setRevengNamingStrategy(getMSSQLRevengNamingStrategy());
                } else {
                    setRevengNamingStrategy(getDefaultRevengNamingStrategy());
                }
            }
        }
    }

    private Class<?> getDefaultRevengNamingStrategy() {
        return DefaultRevengNamingStrategy.class;
    }

    private Class<?> getMSSQLRevengNamingStrategy() {
        return MSSQLRevengNamingStrategy.class;
    }

    protected void checkTables(Configuration cfg) {
        Iterator<?> iter = cfg.getClassMappings();
        int i = 0;
        while (iter.hasNext()) {
            i++;
            iter.next();
        }

        if (i == 0) {
            throw new ConfigurationException("No matching tables found for table filter \"" + this.tableFilters + "\" and schema filter \""
                + this.schemaFilters + "\"");
        }
    }

    protected void checkDialect(Collection<String> requiredProperties, boolean isFatal) {
        if (this.dialect == null) {
            String s = this.properties.getProperty(HIBERNATE_DIALECT_SYSTEM_PROPERTY);
            if (s != null) {
                setDialect(s);
            }
        }

        if (this.dialect == null && isFatal) {
            requiredProperties.add(HIBERNATE_DIALECT_SYSTEM_PROPERTY);
        }

    }

    protected void checkDBType() {
        if (this.dbtype == null) {

            String s = this.properties.getProperty(DBTYPE_SYSTEM_PROPERTY);

            if (s == null) {
                // try to get dbtype from the connection url
                if (this.connectionUrl != null) {
                    s = getDBTypeFromURL(this.connectionUrl);
                } else {
                    // will cause errror later
                }
            }

            if (s != null) {
                setDBType(s);
            }
        }
    }

    protected void checkUser(Collection<String> requiredProperties) {

        if (this.username == null) {

            String s = this.properties.getProperty(USER_SYSTEM_PROPERTY);

            if (s == null) {
                s = this.properties.getProperty(DataServiceConstants.HIBERNATE_USER_PROPERTY);
            }

            if (s == null) {
                s = "";
            }

            setUsername(s);

        }

    }

    protected void checkPass(Collection<String> requiredProperties) {

        if (this.password == null) {

            String s = this.properties.getProperty(PASS_SYSTEM_PROPERTY);

            if (s == null) {
                s = this.properties.getProperty(DataServiceConstants.HIBERNATE_PASS_PROPERTY);
            }

            if (s == null) {
                s = "";
            }

            setPassword(s);
        }
    }

    protected void checkDriverClass(Collection<String> requiredProperties) {

        if (this.driverClassName == null) {

            String s = this.properties.getProperty(DRIVER_CLASS_NAME_SYSTEM_PROPERTY);

            if (s == null) {
                s = this.properties.getProperty(DataServiceConstants.HIBERNATE_DRIVER_CLASS_NAME_PROPERTY);
            }

            if (s != null) {
                setDriverClassName(s);
            }
        }

        if (this.driverClassName == null) {
            // if we have db type, we can default driver class
            setDriverClassName(DB_TYPES_TO_DRIVER_CLASSES.get(this.dbtype));
        }

        if (this.driverClassName == null) {
            requiredProperties.add(DRIVER_CLASS_NAME_SYSTEM_PROPERTY);
        }

    }

    protected void checkAlternateConnectionProperties() {

        if (!SystemUtils.allPropertiesAreSet(this.properties, USER_SYSTEM_PROPERTY, CONNECTION_URL_SYSTEM_PROPERTY, DRIVER_CLASS_NAME_SYSTEM_PROPERTY)) {

            Properties p = DataServiceUtils.toHibernateConnectionProperties(this.properties);

            this.properties.putAll(p);
        }
    }

    protected void checkUrl(Collection<String> requiredProperties) {

        if (this.connectionUrl == null) {

            String s = this.properties.getProperty(CONNECTION_URL_SYSTEM_PROPERTY);

            if (s == null) {
                s = this.properties.getProperty(DataServiceConstants.HIBERNATE_CONNECTION_URL_PROPERTY);
            }

            if (s != null) {
                setConnectionUrl(s);
            }
        }

        if (this.connectionUrl == null) {
            requiredProperties.add(CONNECTION_URL_SYSTEM_PROPERTY);
        }
    }

    protected void checkCatalogName() {
        // depending on the db we're connection to, the catalog name
        // overrides parts of the connection url
        if (this.catalogName != null) {
            if (this.dbtype == MYSQL_DB_TYPE) {
                int i = this.connectionUrl.indexOf(this.catalogName);
                if (i == -1) {
                    String newUrl = this.connectionUrl;
                    String props = "";
                    int j = this.connectionUrl.indexOf(";");
                    if (j > -1) {
                        props = this.connectionUrl.substring(j);
                        newUrl = this.connectionUrl.substring(0, j);
                    }
                    int k = this.connectionUrl.lastIndexOf("//");
                    int l = this.connectionUrl.lastIndexOf("/");
                    if (k != l - 1) {
                        newUrl = newUrl.substring(0, l);
                    }
                    newUrl += "/" + this.catalogName + props;
                    this.connectionUrl = newUrl;
                    if (DataServiceLoggers.importLogger.isInfoEnabled()) {
                        DataServiceLoggers.importLogger.info("Added catalog to connection url: " + this.connectionUrl);
                    }
                }
            }
        }
    }

    protected void checkServiceName(boolean fatal, Collection<String> requiredProperties) {
        if (this.serviceName == null) {
            String s = this.properties.getProperty(NAME_SYSTEM_PROPERTY);
            if (s != null) {
                setServiceName(s);
            }
        }

        if (this.serviceName == null) {
            if (this.className != null) {
                setServiceName(StringUtils.lowerCaseFirstLetter(this.className));
            }
        }

        if (this.serviceName == null) {
            if (fatal) {
                requiredProperties.add(NAME_SYSTEM_PROPERTY);
            }
        } else {
            // some basic checking of service name
            if (this.serviceName.indexOf(".") > -1) {
                throw new ConfigurationException("servicename cannot contain '.': " + this.serviceName);
            }

            if (this.serviceName.indexOf(" ") > -1) {
                throw new ConfigurationException("servicename cannot contain spaces");
            }
        }
    }

    protected void checkDestdir(Collection<String> requiredProperties) {
        if (this.destdir == null) {
            String s = this.properties.getProperty(DESTDIR_SYSTEM_PROPERTY);
            if (s != null) {
                setDestDir(fileSystem.getResourceForURI(s));
            }
        }

        if (this.destdir == null) {
            requiredProperties.add(DESTDIR_SYSTEM_PROPERTY);
        } else {
            if (this.destdir.exists()) {
                if (!fileSystem.isDirectory(this.destdir)) {
                    throw new ConfigurationException(MessageResource.PROPERTY_MUST_BE_DIR, DESTDIR_SYSTEM_PROPERTY,
                            fileSystem.getPath(this.destdir));
                }
            }
        }
    }

    protected void checkPackage() {
        if (this.packageName == null) {

            String s = this.properties.getProperty(PACKAGE_SYSTEM_PROPERTY);
            if (s != null) {
                setPackage(s);
            }
        }
    }

    protected void checkDataPackage() {
        if (this.dataPackage == null) {

            String s = this.properties.getProperty(DATA_PACKAGE_SYSTEM_PROPERTY);
            if (s != null) {
                setDataPackage(s);
            }
        }

        if (this.dataPackage == null) {
            setDataPackage(this.packageName);
        }
    }

    protected void checkClassName(Collection<String> requiredProperties) {
        if (this.className == null) {
            if (this.serviceName != null) {
                String s = com.wavemaker.tools.data.util.DataServiceUtils.getServiceClassName(this.serviceName);
                setClassName(s);
            }
        }
    }

    protected WMHibernateToolTask getParentTask() {
        return this.parentTask;
    }

    protected ExporterTask getConfigurationExporter() {

        exporterFactory.setPackageName(BaseDataModelSetup.this.packageName);
        exporterFactory.setDataPackage(BaseDataModelSetup.this.dataPackage);
        exporterFactory.setClassName(BaseDataModelSetup.this.className);
        exporterFactory.setUseIndividualCRUDOperations(getUseIndividualCRUDOperations());
        exporterFactory.setImpersonateUser(BaseDataModelSetup.this.impersonateUser);
        exporterFactory.setActiveDirectoryDomain(BaseDataModelSetup.this.activeDirectoryDomain);
        
        return exporterFactory.getExporter("springConfig", getParentTask(), this.serviceName);
    }

    protected boolean getUseIndividualCRUDOperations() {
        return false;
    }

    protected boolean initConnection(Collection<String> requiredProperties, boolean dialectIsRequired) {

        if (this.initialized) {
            return true;
        }

        checkAlternateConnectionProperties();

        checkUser(requiredProperties);
        checkPass(requiredProperties);
        checkUrl(requiredProperties);

        checkDBType();
        checkDialect(requiredProperties, false);
        checkDialectAndDBType(requiredProperties);
        checkDialect(requiredProperties, dialectIsRequired);

        // defaults driver class from db type
        checkDriverClass(requiredProperties);

        return true;
    }

    public boolean isMySQL() {
        if (this.dbtype == null) {
            return false;
        }
        return this.dbtype == MYSQL_DB_TYPE;
    }

    public boolean isSQLServer() {
        if (this.dbtype == null) {
            return false;
        }
        return this.dbtype == SQL_SERVER_DB_TYPE;
    }

    public boolean isOracle() {
        if (this.dbtype == null) {
            return false;
        }
        return this.dbtype == ORACLE_DB_TYPE;
    }

    public boolean isHSQLDB() {
        if (this.dbtype == null) {
            return false;
        }
        return this.dbtype == HSQL_DB_TYPE;
    }

    public boolean isDB2() {
        if (this.dbtype == null) {
            return false;
        }
        return this.dbtype == DB2_DB_TYPE;
    }

    public boolean isPostgres() {
        if (this.dbtype == null) {
            return false;
        }
        return this.dbtype == POSTGRESQL_DB_TYPE;
    }

    public void testConnection() {

        Collection<String> requiredProperties = new HashSet<String>();
        initConnection(requiredProperties, false);
        checkProperties(requiredProperties);

        if (this.dbtype == HSQL_DB_TYPE) {
            JDBCUtils.testHSQLConnection(this.connectionUrl, this.username, this.password, this.driverClassName);

        } else if (this.dbtype == MYSQL_DB_TYPE) {
            JDBCUtils.testMySQLConnection(this.connectionUrl, this.username, this.password, this.driverClassName);
        } else if (this.dbtype == ORACLE_DB_TYPE) {
            JDBCUtils.testOracleConnection(this.connectionUrl, this.username, this.password, this.driverClassName);
        } else if (this.dbtype == SQL_SERVER_DB_TYPE) {
            JDBCUtils.testSQLServerConnection(this.connectionUrl, this.username, this.password, this.driverClassName);
        } else {
            if (DataServiceLoggers.importLogger.isInfoEnabled()) {
                DataServiceLoggers.importLogger.info("Generic connection test for: " + this.connectionUrl);
            }
            JDBCUtils.getConnection(this.connectionUrl, this.username, this.password, this.driverClassName);
        }
    }

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    public void setExporterFactory(ExporterFactory exporterFactory) {
        this.exporterFactory = exporterFactory;
    }

    private void checkProperties(Collection<String> requiredProperties) {
        if (!requiredProperties.isEmpty()) {
            throw new ConfigurationException(MessageResource.MISSING_SYS_PROPERTIES.getMessage(ObjectUtils.toString(requiredProperties, ", ")));
        }
    }
}
