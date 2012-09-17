/*
 * Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.studio.data;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.cloudfoundry.runtime.env.CloudEnvironment;
import org.cloudfoundry.runtime.env.RdbmsServiceInfo;
import org.springframework.util.Assert;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.client.TreeNode;
import com.wavemaker.runtime.data.Input;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.studio.CloudFoundryService;
import com.wavemaker.tools.data.ColumnInfo;
import com.wavemaker.tools.data.ConnectionUrl;
import com.wavemaker.tools.data.DataModelManager;
import com.wavemaker.tools.data.DataServiceLoggers;
import com.wavemaker.tools.data.EntityInfo;
import com.wavemaker.tools.data.InitData;
import com.wavemaker.tools.data.PropertyInfo;
import com.wavemaker.tools.data.QueryInfo;
import com.wavemaker.tools.data.RelatedInfo;
import com.wavemaker.tools.data.TestDBConnection;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.local.LocalFolder;
import com.wavemaker.tools.project.ProjectManager;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 */
@ExposeToClient
public class DataService {

    private DataModelManager dataModelMgr = null;

    public void setDataModelManager(DataModelManager dataModelMgr) {
        this.dataModelMgr = dataModelMgr;
    }

    public void setCloudFoundryService(CloudFoundryService cloudFoundryService) {
    }

    public List<String> getDataModelNames() {
        List<String> ret = new ArrayList<String>(this.dataModelMgr.getDataModelNames());
        Collections.sort(ret);
        return ret;
    }

    public EntityInfo getEntityWithoutProperties(String dataModelName, String entityName) {
        EntityInfo ei = this.dataModelMgr.getDataModel(dataModelName).getEntity(entityName);
        EntityInfo rtn = new EntityInfo();
        rtn.setEntityName(ei.getEntityName());
        rtn.setPackageName(ei.getPackageName());
        rtn.setSchemaName(ei.getSchemaName());
        rtn.setCatalogName(ei.getCatalogName());
        rtn.setTableName(ei.getTableName());
        return rtn;
    }

    public EntityInfo getEntity(String dataModelName, String entityName) {
        // ensure ordered columns when marshalling cols to client
        EntityInfo ei = this.dataModelMgr.getDataModel(dataModelName).getEntity(entityName);
        EntityInfo rtn = (EntityInfo) ei.clone();
        List<ColumnInfo> columns = new ArrayList<ColumnInfo>(rtn.getColumns());
        sortColumns(columns);
        Map<String, ColumnInfo> sortedCols = new LinkedHashMap<String, ColumnInfo>(columns.size());
        for (ColumnInfo ci : columns) {
            sortedCols.put(ci.getName(), ci);
        }
        rtn.setColumns(sortedCols);

        return ei;
    }

    public Collection<String> getEntityNames(String dataModelName) {
        return this.dataModelMgr.getDataModel(dataModelName).getEntityNames();
    }

    public void deleteEntity(String dataModelName, String entityName) {
        this.dataModelMgr.deleteEntity(dataModelName, entityName);
    }

    public void deleteQuery(String dataModelName, String entityName) {
        this.dataModelMgr.deleteQuery(dataModelName, entityName);
    }

    public Collection<RelatedInfo> getRelated(String dataModelName, String entityName) {
        return this.dataModelMgr.getDataModel(dataModelName).getRelated(entityName);
    }

    public QueryInfo getQuery(String dataModelName, String queryName) {
        return this.dataModelMgr.getDataModel(dataModelName).getQuery(queryName);
    }

    public void removeDataModel(String dataModelName) {
        this.dataModelMgr.removeDataModel(dataModelName);
    }

    public void updateEntity(String dataModelName, String entityName, EntityInfo entity, boolean save) {
        this.dataModelMgr.updateEntity(dataModelName, entityName, entity, save);
    }

    public void updateColumns(String dataModelName, String entityName, List<ColumnInfo> columns, List<PropertyInfo> properties) {
        this.dataModelMgr.updateColumns(dataModelName, entityName, columns, properties);
    }

    public void updateRelated(String dataModelName, String entityName, RelatedInfo[] related) {
        this.dataModelMgr.updateRelated(dataModelName, entityName, related);
    }

    public void updateQuery(String dataModelName, QueryInfo query) {
        this.dataModelMgr.updateQuery(dataModelName, query);
    }

    public InitData getTypeRefTree() {
        return this.dataModelMgr.getTypeRefTree();
    }

    public InitData getQueriesTree() {
        return this.dataModelMgr.getQueriesTree();
    }

    public List<TreeNode> getTypesSubtree(String dataModelName) {
        return this.dataModelMgr.getDataModel(dataModelName).getTypeNodes();
    }

    public List<TreeNode> getQueriesSubtree(String dataModelName) {
        return this.dataModelMgr.getDataModel(dataModelName).getQueryNodes();
    }

    public void writeConnectionProperties(String dataModelName, Properties connectionProperties) {
        ConnectionUrl connectionUrl = new ConnectionUrl(connectionProperties.getProperty(DataServiceConstants.DB_URL_KEY));

        ProjectManager projectManager = (ProjectManager) RuntimeAccess.getInstance().getSession().
                        getAttribute(DataServiceConstants.CURRENT_PROJECT_MANAGER);
        LocalFolder hsqlDbRootFolder = (LocalFolder) projectManager.getCurrentProject().getWebAppRootFolder().getFolder("data");
        try {
            connectionUrl.rewriteUrl(hsqlDbRootFolder.getLocalFile().getCanonicalPath());
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }

        this.dataModelMgr.getDataModel(dataModelName).writeConnectionProperties(connectionUrl.rewriteProperties(connectionProperties));
    }

    public Properties readConnectionProperties(String dataModelName) {
        return this.dataModelMgr.getDataModel(dataModelName).readConnectionProperties();
    }

    public void importDatabase(String serviceId, String packageName, String username, String password, String connectionUrl, String tableFilter,
        String schemaFilter, String driverClassName, String dialectClassName, String revengNamingStrategyClassName, boolean impersonateUser,
        String activeDirectoryDomain) {
        PreparedConnection connection = prepareConnection(connectionUrl);
        try {
            this.dataModelMgr.importDatabase(username, password, connection.getUrl(), serviceId, packageName, tableFilter, schemaFilter, null,
                driverClassName, dialectClassName, revengNamingStrategyClassName, impersonateUser, activeDirectoryDomain);
        } finally {
            connection.release();
        }
    }

    public void importSampleDatabase() {
        String serviceId = "hrdb";
        String packageName = "com.hrdb";
        String username = "sa";
        String password = "";
        String connectionUrl = "jdbc:hsqldb:file:hrdb;shutdown=true;ifexists=true;";
        String tableFilter = ".*";
        String schemaFilter = ".*";
        String driverClassName = "";
        String dialectClassName = "";
        String revengNamingStrategyClassName = "";
        boolean impersonateUser = false;
        String activeDirectoryDomain = "";
        importDatabase(serviceId, packageName, username, password, connectionUrl, tableFilter, schemaFilter, driverClassName, dialectClassName,
            revengNamingStrategyClassName, impersonateUser, activeDirectoryDomain);
    }

    public String exportDatabase(String serviceId, String username, String password, String connectionUrl, String schemaFilter,
        String driverClassName, String dialectClassName, String revengNamingStrategyClassName, boolean overrideTable) {
        PreparedConnection connection = prepareConnection(connectionUrl);
        try {
            return this.dataModelMgr.exportDatabase(username, password, null, connection.getUrl(), serviceId, schemaFilter, driverClassName,
                dialectClassName, revengNamingStrategyClassName, overrideTable);
        } finally {
            connection.release();
        }
    }

    public String cfExportDatabase(String serviceId, String dbName, String dbms, String schemaFilter, String driverClassName,
        String dialectClassName, String revengNamingStrategyClassName, boolean overrideTable) {
        CloudEnvironment cfEnv = WMAppContext.getInstance().getCloudEnvironment();
        Assert.state(cfEnv != null, "Unable to get cloud environment");
        RdbmsServiceInfo info = getCFRdbmsServiceInfo(cfEnv, dbName);
        String connectionUrl = info.getUrl();
        String username = info.getUserName();
        String password = info.getPassword();

        PreparedConnection connection = prepareConnection(connectionUrl);
        try {
            return this.dataModelMgr.exportDatabase(username, password, dbName, dbms, connection.getUrl(), serviceId, schemaFilter, driverClassName,
                dialectClassName, revengNamingStrategyClassName, overrideTable);
        } finally {
            connection.release();
        }
    }

    public String getExportDDL(String serviceId, String username, String password, String connectionUrl, String schemaFilter, String driverClassName,
        String dialectClassName, boolean overrideTable) {
        PreparedConnection connection = prepareConnection(connectionUrl);
        try {
            return this.dataModelMgr.getExportDDL(username, password, "", connection.getUrl(), serviceId, schemaFilter, driverClassName,
                dialectClassName, overrideTable);
        } finally {
            connection.release();
        }
    }

    public void newDataModel(String dataModelName) {
        this.dataModelMgr.newDataModel(dataModelName);
    }

    public void checkQuery(String dataModelName, String query, Input[] inputs, String values) {
        this.dataModelMgr.compile();
        this.dataModelMgr.getDataModel(dataModelName).checkQuery(query, inputs, values);
    }

    public Object runQuery(String dataModelName, String query, Input[] inputs, String values, Long maxResults) {

        if (query == null) {
            throw new IllegalArgumentException("query cannot be null");
        }

        if (inputs == null) {
            inputs = new Input[] {};
            values = "";
        }

        //this.dataModelMgr.compile();
        this.dataModelMgr.getProjectCompiler().compile();

        return this.dataModelMgr.getDataModel(dataModelName).runQuery(query, inputs, values, maxResults);
    }

    public void validate(String dataModelName) {
        this.dataModelMgr.validate(dataModelName);
    }

    public void reImportDatabase(String dataModelName, String username, String password, String connectionUrl, String tableFilter,
        String schemaFilter, String driverClassName, String dialectClassName, String revengNamingStrategyClassName, boolean impersonateUser,
        String activeDirectoryDomain) {
        PreparedConnection connection = prepareConnection(connectionUrl);
        try {
            this.dataModelMgr.reImport(dataModelName, username, password, connection.getUrl(), tableFilter, schemaFilter, driverClassName,
                dialectClassName, revengNamingStrategyClassName, impersonateUser, activeDirectoryDomain);
        } finally {
            connection.release();
        }
    }

    public void testConnection(String username, String password, String connectionUrl, String driverClassName, String dialectClassName) {

        PreparedConnection connection = prepareConnection(connectionUrl);
        try {
            if (DataServiceLoggers.importLogger.isDebugEnabled()) {
                DataServiceLoggers.importLogger.debug("Test connection for " + connectionUrl);
            }

            if (SystemUtils.isEncrypted(password)) {
                password = SystemUtils.decrypt(password);
            }

            TestDBConnection t = new TestDBConnection();
            t.setUsername(username);
            t.setPassword(password);
            t.setDialect(dialectClassName);
            t.setDriverClassName(driverClassName);
            t.setConnectionUrl(connection.getUrl());

            if (!ObjectUtils.isNullOrEmpty(driverClassName)) {
                t.setDriverClassName(driverClassName);
            }

            t.init();

            try {
                t.run();
            } catch (RuntimeException ex) {
                throw com.wavemaker.runtime.data.util.DataServiceUtils.unwrap(ex);
            } finally {
                t.dispose();
            }
        } finally {
            connection.release();
        }
    }

    private void sortColumns(List<ColumnInfo> columns) {
        Collections.sort(columns, new Comparator<ColumnInfo>() {

            @Override
            public int compare(ColumnInfo o1, ColumnInfo o2) {
                if (o1.getIsPk()) {
                    if (o2.getIsPk()) {
                        return o1.getName().compareTo(o2.getName());
                    } else {
                        return -1;
                    }
                } else if (o1.getIsFk()) {
                    if (o2.getIsPk()) {
                        return 1;
                    } else if (o2.getIsFk()) {
                        return o1.getName().compareTo(o2.getName());
                    } else {
                        return -1;
                    }
                } else {
                    if (o2.getIsPk() || o2.getIsFk()) {
                        return 1;
                    } else {
                        return o1.getName().compareTo(o2.getName());
                    }
                }
            }
        });
    }

    // Cloud foundry specific operations

    public void cfTestConnection(String serviceId) {
        CloudEnvironment cfEnv = WMAppContext.getInstance().getCloudEnvironment();
        if (cfEnv != null) {
            RdbmsServiceInfo info = getCFRdbmsServiceInfo(cfEnv, serviceId);
            String url = info.getUrl();
            String username = info.getUserName();
            String password = info.getPassword();
            testConnection(username, password, url, "", null);
        } else {
            throw new UnsupportedOperationException();
        }
    }

    public void cfImportDatabase(String serviceId, String packageName, String tableFilter, String schemaFilter, String driverClassName,
        String dialectClassName, String revengNamingStrategyClassName, boolean impersonateUser, String activeDirectoryDomain) {
        CloudEnvironment cfEnv = WMAppContext.getInstance().getCloudEnvironment();
        if (cfEnv != null) {
            RdbmsServiceInfo info = getCFRdbmsServiceInfo(cfEnv, serviceId);
            String connectionUrl = info.getUrl();
            String username = info.getUserName();
            String password = info.getPassword();
            importDatabase(serviceId, packageName, username, password, connectionUrl, tableFilter, schemaFilter, driverClassName, dialectClassName,
                revengNamingStrategyClassName, impersonateUser, activeDirectoryDomain);
        } else {
            throw new UnsupportedOperationException();
        }
    }

    public String cfGetExportDDL(String serviceId, String dbName, String dbms, String schemaFilter, String driverClassName, String dialectClassName,
        boolean overrideTable) {
        String username = "";
        String password = "";
        String connectionUrl = "";
        CloudEnvironment cfEnv = WMAppContext.getInstance().getCloudEnvironment();
        if (cfEnv != null) {
            try {
                RdbmsServiceInfo info = getCFRdbmsServiceInfo(cfEnv, dbName);
                connectionUrl = info.getUrl();
                username = info.getUserName();
                password = info.getPassword();
            } catch (WMRuntimeException ex) {
            }
        }
        PreparedConnection connection = prepareConnection(connectionUrl);
        try {
            return this.dataModelMgr.getExportDDL(username, password, dbName, dbms, connection.getUrl(), serviceId, schemaFilter, driverClassName,
                dialectClassName, overrideTable);
        } finally {
            connection.release();
        }
    }

    public RdbmsServiceInfo getCFRdbmsServiceInfo(CloudEnvironment cfEnv, String serviceId) throws WMRuntimeException {
        try {
            return cfEnv.getServiceInfo(serviceId, RdbmsServiceInfo.class);
        } catch (NullPointerException npe) {
            throw new WMRuntimeException("Unable to find service: " + serviceId + ". Ensure service is bound");
        }
    }

    /**
     * Prepare a connection that can be used to read a database. NOTE: the connection must be
     * {@link PreparedConnection#release() released} after use.
     * 
     * @param url the connection URL
     * @return a {@link PreparedConnection}.
     */
    private PreparedConnection prepareConnection(String url) {
        ConnectionUrl connectionUrl = new ConnectionUrl(url);
        PreparedConnection preparedConnection = new PreparedConnection(connectionUrl);
        if (connectionUrl.isHsqldb()) {
            ProjectManager projectManager = (ProjectManager) RuntimeAccess.getInstance().getSession().getAttribute(
                DataServiceConstants.CURRENT_PROJECT_MANAGER);
            Folder hsqlDbRootFolder = projectManager.getCurrentProject().getWebAppRootFolder().getFolder("data");
            if (hsqlDbRootFolder.exists()) {
                if (hsqlDbRootFolder instanceof LocalFolder) {
                    connectionUrl.setHsqldbRootFolder((LocalFolder) hsqlDbRootFolder);
                } else {
                    LocalFolder tempFolder = createTempFolder();
                    hsqlDbRootFolder.copyContentsTo(tempFolder);
                    preparedConnection.deleteFolderOnRelease(tempFolder);
                    connectionUrl.setHsqldbRootFolder(tempFolder);
                }
            }
        }
        return preparedConnection;
    }

    private LocalFolder createTempFolder() {
        try {
            return new LocalFolder(IOUtils.createTempDirectory());
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }

    /**
     * A connection that has been prepared for reading.
     */
    private static class PreparedConnection {

        private final ConnectionUrl url;

        private final List<Folder> foldersToDeleteOnRelease = new ArrayList<Folder>();

        public PreparedConnection(ConnectionUrl url) {
            this.url = url;
        }

        public void deleteFolderOnRelease(Folder folder) {
            this.foldersToDeleteOnRelease.add(folder);
        }

        public ConnectionUrl getUrl() {
            return this.url;
        }

        public void release() {
            for (Folder folder : this.foldersToDeleteOnRelease) {
                try {
                    folder.delete();
                } catch (Exception e) {
                    // FIXME warning
                }
            }
        }
    }
}
