/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.dialect.Dialect;
import org.hibernate.tool.hbm2ddl.DatabaseMetadata;
import org.hibernate.tool.hbm2ddl.SchemaExport;
import org.hibernate.tool.hbm2ddl.SchemaUpdate;

import com.wavemaker.common.Resource;
import com.wavemaker.common.util.CastUtils;
import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.runtime.data.DataServiceRuntimeException;
import com.wavemaker.runtime.data.util.JDBCUtils;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.data.parser.HbmParser;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class ExportDB extends BaseDataModelSetup {
    
    private static final Log log = LogFactory.getLog(BaseDataModelSetup.class);

    private static final String HBM_FILES_DIR_SYSTEM_PROPERTY = 
        SYSTEM_PROPERTY_PREFIX + "hbmFilesDir";

    private File hbmFilesDir = null;

    private boolean exportToDatabase = false;

    private List<Throwable> errors = null;

    private boolean verbose = false;

    private boolean overrideTable = false;

    private String ddl = null;

    private File classesDir = null;

    public void setClassesDir(File classesDir) {
        this.classesDir = classesDir;
    }

    public void setVerbose(boolean verbose) {
        this.verbose = verbose;
    }

    public void setOverrideTable(boolean val) {
        this.overrideTable = val;
    }

    public List<Throwable> getErrors() {
        return errors;
    }

    public void setHbmFilesDir(File hbmFilesDir) {
        this.hbmFilesDir = hbmFilesDir;
    }

    public void addProperties(Properties properties) {
        this.properties.putAll(properties);
    }

    public void setExportToDB(boolean exportToDatabase) {
        this.exportToDatabase = exportToDatabase;
    }

    public String getDDL() {
        return ddl;
    }

    @Override
    protected void customRun() {

        init();

        final Configuration cfg = new Configuration();

        cfg.addDirectory(hbmFilesDir);

        Properties connectionProperties = getHibernateConnectionProperties();

        cfg.addProperties(connectionProperties);

        SchemaExport export = null;
        SchemaUpdate update = null;
        File ddlFile = null;
        
        ClassLoaderUtils.TaskRtn t;

        try {
            if (overrideTable) {
                t = new ClassLoaderUtils.TaskRtn() {
                    public SchemaExport run() {
                        return new SchemaExport(cfg);
                    }
                };

                if (classesDir == null) {
                    export = (SchemaExport) t.run();
                } else {
                    export = (SchemaExport) ClassLoaderUtils.runInClassLoaderContext(t,
                            classesDir);
                }

                ddlFile = File.createTempFile("ddl", ".sql");
                ddlFile.deleteOnExit();

                export.setOutputFile(ddlFile.getAbsolutePath());
                export.setDelimiter(";");
                export.setFormat(true);

                String extraddl = prepareForExport(exportToDatabase);

                export.create(verbose, exportToDatabase);

                errors = CastUtils.cast(export.getExceptions());
                errors = filterError(errors, connectionProperties);

                ddl = IOUtils.read(ddlFile);

                if (!ObjectUtils.isNullOrEmpty(extraddl)) {
                    ddl = extraddl + "\n" + ddl;
                }
            } else {
                t = new ClassLoaderUtils.TaskRtn() {
                    public SchemaUpdate run() {
                        return new SchemaUpdate(cfg);
                    }
                };

                if (classesDir == null) {
                    update = (SchemaUpdate) t.run();
                } else {
                    update = (SchemaUpdate) ClassLoaderUtils.runInClassLoaderContext(t,
                            classesDir);
                }

                prepareForExport(exportToDatabase);

                Connection conn = JDBCUtils.getConnection(this.connectionUrl, this.username,
                        this.password, this.driverClassName);

                Dialect dialect = Dialect.getDialect(connectionProperties);

                DatabaseMetadata meta = new DatabaseMetadata(conn, dialect);

                String[] updateSQL = cfg.generateSchemaUpdateScript(dialect, meta);

                update.execute(verbose, exportToDatabase);

                errors = CastUtils.cast(update.getExceptions());
                StringBuilder sb = new StringBuilder();
                for (String line: updateSQL) {
                    sb = sb.append(line);
                    sb = sb.append("\n");
                }
                ddl = sb.toString();

            }
        } catch (IOException ex) {
            throw new DataServiceRuntimeException(ex);
        } catch (SQLException qex) {
            throw new DataServiceRuntimeException(qex);
        } finally {
            try {
                ddlFile.delete();
            } catch (Exception ignore) {}
        }
    }

    //The DDL Hibernate creates includes "alter table" statement on the top, which causes an error message (Table not found)
    //to be displayed after the DB is exported properly.  Let's hide the error message because it is too misleading.
    //This is not a perfect solution but we have no other way round until Hibernate fixes this problem.

    private List<Throwable> filterError(List<Throwable> errors, Properties props) {
        List<Throwable> rtn = new ArrayList<Throwable>();
        String dialect = (String)props.get(".dialect");
        String dbType;
        if (dialect == null) return rtn; 
        if (dialect.contains("MySQL"))
            dbType = "mysql";
        else if (dialect.contains("HSQL"))
            dbType = "hsql";
        else
            return rtn;

        for (Throwable t: errors) {
            String msg = t.getMessage();
            if ((dbType.equals("mysql") && (msg.substring(0, 5).equals("Table")
                    && msg.lastIndexOf("doesn't exist") == msg.length() - 13)) ||
                 (dbType.equals("hsql") && (msg.substring(0, 16).equals("Table not found:")
                    && msg.contains("in statement [alter table"))))
            {
                continue;
            } else {
                rtn.add(t);
            }
        }

        return rtn;
    }

    @Override
    protected boolean customInit(Collection<String> requiredProperties) {

        checkHbmFilesDir(requiredProperties);

        checkRevengNamingStrategy();

        return initConnection(requiredProperties, true);
    }

    @Override
    protected void customDispose() {}

    private String prepareForExport(boolean run) {

        if (!isMySQL() && !isPostgres()) {
            return null;
        }

        // For export to MySQL or Postgres, we attempt to create the 
        // database.  For Postgres, we should also create the schema.
        // And we should expand this logic to include other supported 
        // database types.

        Tuple.Two<String, String> t = getMappedSchemaAndCatalog();
        String schemaName = t.v1, catalogName = t.v2;
        String urlDBName = getDatabaseNameFromConnectionUrl();
        String url = connectionUrl;

        if (isMySQL() && !ObjectUtils.isNullOrEmpty(schemaName)) {
            throw new ConfigurationException(Resource.UNSET_SCHEMA, "MySQL");
        }

        if (!ObjectUtils.isNullOrEmpty(urlDBName)) {
            url = connectionUrl.substring(0, connectionUrl.indexOf(urlDBName));
            if (isPostgres()) {
                url += "postgres";
            }
            if (ObjectUtils.isNullOrEmpty(catalogName)) {
                catalogName = urlDBName;
            } else if (!ObjectUtils.isNullOrEmpty(catalogName) && !catalogName.equals(urlDBName)) {
                throw new ConfigurationException(
                    Resource.MISMATCH_CATALOG_DBNAME, urlDBName, catalogName);
            }
        } else if (ObjectUtils.isNullOrEmpty(catalogName)) {
            throw new ConfigurationException(Resource.CATALOG_SHOULD_BE_SET);
        }
        

        String ddl = null;
        if (isMySQL()) {
            ddl = "create database if not exists ";
        } else {
            ddl = "create database ";
        }

        ddl += catalogName;

        try {
            if (run) {
                runDDL(ddl, url);
            }
        } catch (RuntimeException ex) {
            log.warn("Unable to create database "+catalogName+" - it's possible it already exists.", ex);
        }

        return ddl;
    }

    private void checkHbmFilesDir(Collection<String> requiredProperties) {
        if (hbmFilesDir == null) {
            String s = properties.getProperty(HBM_FILES_DIR_SYSTEM_PROPERTY);
            if (s != null) {
                setHbmFilesDir(new File(s));
            }
        }

        if (hbmFilesDir == null) {
            requiredProperties.add(HBM_FILES_DIR_SYSTEM_PROPERTY);
        }
    }

    private String getDatabaseNameFromConnectionUrl() {
        return JDBCUtils.getMySQLDatabaseName(connectionUrl);
    }

    private Tuple.Two<String, String> getMappedSchemaAndCatalog() {
        for (String s : hbmFilesDir.list()) {
            File f = new File(hbmFilesDir, s);
            if (!f.isDirectory()) {
                HbmParser p = null;
                try {
                    p = new HbmParser(f);
                    // rely on the fact that all mapping files have the same
                    // schema and catalog
                    return Tuple.tuple(p.getEntity().getSchemaName(),
                                       p.getEntity().getCatalogName());
                } catch (RuntimeException ignore) {
                } finally {
                    try {
                        p.close();
                    } catch (RuntimeException ignore) {}
                }
            }
        }
        return null;
    }
}
