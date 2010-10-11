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

import java.io.File;
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

import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.Resource;
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

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
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

    protected static final Map<String, Class<?>> DB_TYPES_TO_DIALECTS = new HashMap<String, Class<?>>(
            6);

    protected static final Map<String, String> DB_TYPES_TO_DRIVER_CLASSES = new HashMap<String, String>(
            6);

    static {
        DB_TYPES_TO_DIALECTS.put(HSQL_DB_TYPE, HSQLDialect.class);
        DB_TYPES_TO_DRIVER_CLASSES.put(HSQL_DB_TYPE, "org.hsqldb.jdbcDriver");

        DB_TYPES_TO_DIALECTS.put(MYSQL_DB_TYPE, MySQLDialect.class);
        DB_TYPES_TO_DRIVER_CLASSES.put(MYSQL_DB_TYPE, "com.mysql.jdbc.Driver");

        DB_TYPES_TO_DIALECTS.put(ORACLE_DB_TYPE, OracleDialect.class);
        DB_TYPES_TO_DRIVER_CLASSES.put(ORACLE_DB_TYPE,
                "oracle.jdbc.driver.OracleDriver");

        DB_TYPES_TO_DIALECTS.put(SQL_SERVER_DB_TYPE, SQLServerDialect.class);
        DB_TYPES_TO_DRIVER_CLASSES.put(SQL_SERVER_DB_TYPE,
                "net.sourceforge.jtds.jdbc.Driver");

        DB_TYPES_TO_DIALECTS.put(DB2_DB_TYPE, DB2Dialect.class);
        DB_TYPES_TO_DRIVER_CLASSES
                .put(DB2_DB_TYPE, "com.ibm.db2.jcc.DB2Driver");

        DB_TYPES_TO_DIALECTS.put(POSTGRESQL_DB_TYPE, PostgreSQLDialect.class);
        DB_TYPES_TO_DRIVER_CLASSES.put(POSTGRESQL_DB_TYPE,
                "org.postgresql.Driver");
    }

    protected static final String SYSTEM_PROPERTY_PREFIX = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX
            + "importdb.";

    private static String strip(String s) {
        return StringUtils
                .fromFirstOccurrence(s, DataServiceConstants.PROP_SEP);
    }

    protected static final String USER_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + strip(DataServiceConstants.DB_USERNAME);

    protected static final String PASS_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + strip(DataServiceConstants.DB_PASS);

    protected static final String CONNECTION_URL_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + strip(DataServiceConstants.DB_URL);

    protected static final String DRIVER_CLASS_NAME_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + strip(DataServiceConstants.DB_DRIVER_CLASS_NAME);

    protected static final String DBTYPE_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "dbtype";

    protected static final String HIBERNATE_DIALECT_SYSTEM_PROPERTY = "hibernate.dialect";

    protected static final String NAME_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "serviceName";

    protected static final String PACKAGE_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "package";

    protected static final String DATA_PACKAGE_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "dataPackage";

    protected static final String DESTDIR_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "outputDir";

    protected static final String TABLE_FILTER_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "tableFilter";

    protected static final String SCHEMA_FILTER_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "schemaFilter";

    private static final String REVENG_NAMING_STRATEGY_SYSTEM_PROPERTY = SYSTEM_PROPERTY_PREFIX
            + "revengNamingStrategy";

    private String DEFAULT_FILTER = ".*";

    public static String getDriverClassForDBType(String dbtype) {
        return DB_TYPES_TO_DRIVER_CLASSES.get(dbtype);
    }

    public static String getDialectForDBType(String dbtype) {
        return DB_TYPES_TO_DIALECTS.get(dbtype).getName();
    }

    public static String getDBTypeFromURL(String url) {
        if (!url.startsWith(JDBC_URL_SCHEME)) {
            throw new IllegalArgumentException("jdbc url must start with "
                    + JDBC_URL_SCHEME);
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

    protected File destdir = null;

    protected File javadir = null;

    protected Properties properties = new Properties();

    protected boolean initialized = false;

    private List<File> tmpFiles = new ArrayList<File>();

    public void setDestDir(File destdir) {
        this.destdir = destdir;
        getParentTask().setDestDir(destdir);
    }

    public void setJavaDir(File javadir) {
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
        return ObjectUtils.toString(tableFilters, ",");
    }

    public String getSchemaFilter() {
        return ObjectUtils.toString(schemaFilters, ",");
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
        return driverClassName;
    }

    public void setConnectionUrl(String connectionUrl) {
        this.connectionUrl = connectionUrl;
    }

    public String getConnectionUrl() {
        return connectionUrl;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public String getDialect() {
        return dialect;
    }

    public String getCatalogName() {
        return catalogName;
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
        return password;
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
        return className;
    }

    public void setPackage(String packageName) {
        this.packageName = packageName;
    }

    public String getPackage() {
        return packageName;
    }

    public void setDataPackage(String dataPackage) {
        this.dataPackage = dataPackage;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    protected Project getProject() {
        return project;
    }

    public void setProperties(Properties additionalProperties) {
        properties.putAll(additionalProperties);
    }

    protected void registerTmpFileForCleanup(File f) {
        f.deleteOnExit(); // we really want this file to go away
        tmpFiles.add(f);
    }

    protected abstract boolean customInit(Collection<String> requiredProperties);

    protected abstract void customRun();

    protected abstract void customDispose();

    public boolean init() {

        Collection<String> requiredProperties = new HashSet<String>();

        boolean rtn = customInit(requiredProperties);

        checkProperties(requiredProperties);

        initialized = true;

        return rtn;
    }

    public void run() {
        if (!initialized) {
            boolean ok = init();
            if (!ok) {
                return;
            }
        }

        parentTask.setConfiguration(new Configuration());
        parentTask.setProject(project);

        customRun();
    }

    public void dispose() {
        try {
            customDispose();
        } finally {
            for (File f : tmpFiles) {
                try {
                    f.delete();
                } catch (Exception ignore) {
                }
            }
        }
    }

    protected void runDDL(String sql) {
        runDDL(sql, connectionUrl);
    }

    protected void runDDL(String sql, String url) {
        JDBCUtils.runSql(new String[] { sql }, url, username, password,
                driverClassName, DataServiceLoggers.importLogger, true);
    }

    /**
     * Returns all relevant configuration properties.
     */
    public Properties getProperties() {
        return getProperties(true);
    }

    @SuppressWarnings("unchecked")
    private Properties getProperties(boolean strip) {

        Properties p = new Properties();

        p.put(DataServiceConstants.DB_USERNAME, username);
        p.put(DataServiceConstants.DB_PASS, password);
        p.put(DataServiceConstants.DB_URL, connectionUrl);
        p.put(DataServiceConstants.DB_DRIVER_CLASS_NAME, driverClassName);
        p.put(DataServiceConstants.DB_DIALECT, dialect);

        // preserve info about how db was imported
        String s = getTableFilter();
        if (ObjectUtils.isNullOrEmpty(s)) {
            s = DEFAULT_FILTER;
        }
        p.setProperty(DataServiceConstants.DB_TABLE_FILTER, s);

        s = getSchemaFilter();
        if (ObjectUtils.isNullOrEmpty(s)) {
            s = DEFAULT_FILTER;
        }
        p.setProperty(DataServiceConstants.DB_SCHEMA_FILTER, s);

        p.setProperty(DataServiceConstants.DB_REVENG_NAMING,
                (revengNamingStrategy == null ? "" : revengNamingStrategy));

        Properties rtn = null;

        if (strip) {
            rtn = new Properties();
            for (Iterator iter = p.keySet().iterator(); iter.hasNext();) {
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

        Properties rtn = DataServiceUtils
                .toHibernateConnectionProperties(getProperties(false));

        if (DataServiceLoggers.importLogger.isInfoEnabled()) {
            DataServiceLoggers.importLogger.info("Connection properties: "
                    + rtn);
        }

        return rtn;
    }

    protected void checkDialectAndDBType(Collection<String> requiredProperties) {

        if (dbtype == null && dialect == null) {
            return;
        }

        if (dbtype != null && dialect == null) {
            // dialect not set, but we have dbtype, so determine Hibernate
            // Dialect from dbtype
            Class<?> c = DB_TYPES_TO_DIALECTS.get(dbtype);
            if (c == null) {
                throw new ConfigurationException("Unknown dbtype \"" + dbtype
                        + "\", cannot determine dialect");
            }
            dialect = c.getName();
        } else if (dbtype == null && dialect != null) {
            // if Hibernate Dialect is set, use that and try to set dbtype to
            // something meaningful
            String s = dialect.toLowerCase();
            s = StringUtils.fromLastOccurrence(s, "dialect", -1);
            dbtype = StringUtils.fromLastOccurrence(s, ".");
        }
    }

    protected void checkTableFilter() {

        if (tableFilters.isEmpty()) {

            String s = properties.getProperty(TABLE_FILTER_SYSTEM_PROPERTY);

            if (s != null) {
                setTableFilterSplit(s);
            }
        }
    }

    protected void checkSchemaFilter() {

        if (schemaFilters.isEmpty()) {

            String s = properties.getProperty(SCHEMA_FILTER_SYSTEM_PROPERTY);

            if (s != null) {
                setSchemaFilterSplit(s);
            }
        }
    }

    protected void checkRevengNamingStrategy() {

        if (revengNamingStrategy == null) {

            revengNamingStrategy = properties
                    .getProperty(REVENG_NAMING_STRATEGY_SYSTEM_PROPERTY);

            if (revengNamingStrategy == null) {
                if (dialect != null && dialect.contains("SQLServer"))
                    setRevengNamingStrategy(getMSSQLRevengNamingStrategy());
                else
                    setRevengNamingStrategy(getDefaultRevengNamingStrategy());
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
            throw new ConfigurationException(
                    "No matching tables found for table filter \""
                            + tableFilters + "\" and schema filter \""
                            + schemaFilters + "\"");
        }
    }

    protected void checkDialect(Collection<String> requiredProperties,
            boolean isFatal) {
        if (dialect == null) {
            String s = properties
                    .getProperty(HIBERNATE_DIALECT_SYSTEM_PROPERTY);
            if (s != null) {
                setDialect(s);
            }
        }

        if (dialect == null && isFatal) {
            requiredProperties.add(HIBERNATE_DIALECT_SYSTEM_PROPERTY);
        }

    }

    protected void checkDBType() {
        if (dbtype == null) {

            String s = properties.getProperty(DBTYPE_SYSTEM_PROPERTY);

            if (s == null) {
                // try to get dbtype from the connection url
                if (connectionUrl != null) {
                    s = getDBTypeFromURL(connectionUrl);
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

        if (username == null) {

            String s = properties.getProperty(USER_SYSTEM_PROPERTY);

            if (s == null) {
                s = properties
                        .getProperty(DataServiceConstants.HIBERNATE_USER_PROPERTY);
            }

            if (s == null) {
                s = "";
            }

            setUsername(s);

        }

    }

    protected void checkPass(Collection<String> requiredProperties) {

        if (password == null) {

            String s = properties.getProperty(PASS_SYSTEM_PROPERTY);

            if (s == null) {
                s = properties
                        .getProperty(DataServiceConstants.HIBERNATE_PASS_PROPERTY);
            }

            if (s == null) {
                s = "";
            }

            setPassword(s);
        }
    }

    protected void checkDriverClass(Collection<String> requiredProperties) {

        if (driverClassName == null) {

            String s = properties
                    .getProperty(DRIVER_CLASS_NAME_SYSTEM_PROPERTY);

            if (s == null) {
                s = properties
                        .getProperty(DataServiceConstants.HIBERNATE_DRIVER_CLASS_NAME_PROPERTY);
            }

            if (s != null) {
                setDriverClassName(s);
            }
        }

        if (driverClassName == null) {
            // if we have db type, we can default driver class
            setDriverClassName(DB_TYPES_TO_DRIVER_CLASSES.get(dbtype));
        }

        if (driverClassName == null) {
            requiredProperties.add(DRIVER_CLASS_NAME_SYSTEM_PROPERTY);
        }

    }

    protected void checkAlternateConnectionProperties() {

        if (!SystemUtils.allPropertiesAreSet(properties, USER_SYSTEM_PROPERTY,
                CONNECTION_URL_SYSTEM_PROPERTY,
                DRIVER_CLASS_NAME_SYSTEM_PROPERTY)) {

            Properties p = DataServiceUtils
                    .toHibernateConnectionProperties(properties);

            properties.putAll(p);
        }
    }

    protected void checkUrl(Collection<String> requiredProperties) {

        if (connectionUrl == null) {

            String s = properties.getProperty(CONNECTION_URL_SYSTEM_PROPERTY);

            if (s == null) {
                s = properties
                        .getProperty(DataServiceConstants.HIBERNATE_CONNECTION_URL_PROPERTY);
            }

            if (s != null) {
                setConnectionUrl(s);
            }
        }

        if (connectionUrl == null) {
            requiredProperties.add(CONNECTION_URL_SYSTEM_PROPERTY);
        }
    }

    protected void checkCatalogName() {
        // depending on the db we're connection to, the catalog name
        // overrides parts of the connection url
        if (catalogName != null) {
            if (dbtype == MYSQL_DB_TYPE) {
                int i = connectionUrl.indexOf(catalogName);
                if (i == -1) {
                    String newUrl = connectionUrl;
                    String props = "";
                    int j = connectionUrl.indexOf(";");
                    if (j > -1) {
                        props = connectionUrl.substring(j);
                        newUrl = connectionUrl.substring(0, j);
                    }
                    int k = connectionUrl.lastIndexOf("//");
                    int l = connectionUrl.lastIndexOf("/");
                    if (k != (l - 1)) {
                        newUrl = newUrl.substring(0, l);
                    }
                    newUrl += "/" + catalogName + props;
                    connectionUrl = newUrl;
                    if (DataServiceLoggers.importLogger.isInfoEnabled()) {
                        DataServiceLoggers.importLogger
                                .info("Added catalog to connection url: "
                                        + connectionUrl);
                    }
                }
            }
        }
    }

    protected void checkServiceName(boolean fatal,
            Collection<String> requiredProperties) {
        if (serviceName == null) {
            String s = properties.getProperty(NAME_SYSTEM_PROPERTY);
            if (s != null) {
                setServiceName(s);
            }
        }

        if (serviceName == null) {
            if (className != null) {
                setServiceName(StringUtils.lowerCaseFirstLetter(className));
            }
        }

        if (serviceName == null) {
            if (fatal) {
                requiredProperties.add(NAME_SYSTEM_PROPERTY);
            }
        } else {
            // some basic checking of service name
            if (serviceName.indexOf(".") > -1) {
                throw new ConfigurationException(
                        "servicename cannot contain '.': " + serviceName);
            }

            if (serviceName.indexOf(" ") > -1) {
                throw new ConfigurationException(
                        "servicename cannot contain spaces");
            }
        }
    }

    protected void checkDestdir(Collection<String> requiredProperties) {
        if (destdir == null) {
            String s = properties.getProperty(DESTDIR_SYSTEM_PROPERTY);
            if (s != null) {
                setDestDir(new File(s));
            }
        }

        if (destdir == null) {
            requiredProperties.add(DESTDIR_SYSTEM_PROPERTY);
        } else {
            if (destdir.exists()) {
                if (destdir.isFile()) {
                    throw new ConfigurationException(
                            Resource.PROPERTY_MUST_BE_DIR,
                            DESTDIR_SYSTEM_PROPERTY, destdir.getAbsolutePath());
                }
            }
        }
    }

    protected void checkPackage() {
        if (packageName == null) {

            String s = properties.getProperty(PACKAGE_SYSTEM_PROPERTY);
            if (s != null) {
                setPackage(s);
            }
        }
    }

    protected void checkDataPackage() {
        if (dataPackage == null) {

            String s = properties.getProperty(DATA_PACKAGE_SYSTEM_PROPERTY);
            if (s != null) {
                setDataPackage(s);
            }
        }

        if (dataPackage == null) {
            setDataPackage(packageName);
        }
    }

    protected void checkClassName(Collection<String> requiredProperties) {
        if (className == null) {
            if (serviceName != null) {
                String s = com.wavemaker.tools.data.util.DataServiceUtils
                    .getServiceClassName(serviceName);
                setClassName(s);
            }
        }
    }

    protected WMHibernateToolTask getParentTask() {
        return parentTask;
    }

    protected ExporterTask getConfigurationExporter() {
        return new GenericExporterTask(getParentTask()) {
            public Exporter createExporter() {
                return new HibernateSpringConfigExporter(serviceName,
                        packageName, dataPackage, className,
                        getUseIndividualCRUDOperations());
            };
        };
    }

    protected boolean getUseIndividualCRUDOperations() {
        return false;
    }

    protected boolean initConnection(Collection<String> requiredProperties,
            boolean dialectIsRequired) {

        if (initialized) {
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
        if (dbtype == null) {
            return false;
        }
        return dbtype == MYSQL_DB_TYPE;
    }

    public boolean isSQLServer() {
        if (dbtype == null) {
            return false;
        }
        return dbtype == SQL_SERVER_DB_TYPE;
    }

    public boolean isOracle() {
        if (dbtype == null) {
            return false;
        }
        return dbtype == ORACLE_DB_TYPE;
    }

    public boolean isHSQLDB() {
        if (dbtype == null) {
            return false;
        }
        return dbtype == HSQL_DB_TYPE;
    }

    public boolean isDB2() {
        if (dbtype == null) {
            return false;
        }
        return dbtype == DB2_DB_TYPE;
    }

    public boolean isPostgres() {
        if (dbtype == null) {
            return false;
        }
        return dbtype == POSTGRESQL_DB_TYPE;
    }

    public void testConnection() {

        Collection<String> requiredProperties = new HashSet<String>();
        initConnection(requiredProperties, false);
        checkProperties(requiredProperties);

        if (dbtype == HSQL_DB_TYPE) {
            JDBCUtils.testHSQLConnection(connectionUrl, username, password,
                    driverClassName);

        } else if (dbtype == MYSQL_DB_TYPE) {
            JDBCUtils.testMySQLConnection(connectionUrl, username, password,
                    driverClassName);
        } else if (dbtype == ORACLE_DB_TYPE) {
            JDBCUtils.testOracleConnection(connectionUrl, username, password,
                    driverClassName);
        } else if (dbtype == SQL_SERVER_DB_TYPE) {
            JDBCUtils.testSQLServerConnection(connectionUrl, username,
                    password, driverClassName);
        } else {
            if (DataServiceLoggers.importLogger.isInfoEnabled()) {
                DataServiceLoggers.importLogger
                        .info("Generic connection test for: " + connectionUrl);
            }
            JDBCUtils.getConnection(connectionUrl, username, password,
                    driverClassName);
        }
    }

    private void checkProperties(Collection<String> requiredProperties) {
        if (!requiredProperties.isEmpty()) {
            throw new ConfigurationException(Resource.MISSING_SYS_PROPERTIES
                    .getMessage(ObjectUtils.toString(requiredProperties, ", ")));
        }
    }
}
