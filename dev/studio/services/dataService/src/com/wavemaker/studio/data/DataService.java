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
 
package com.wavemaker.studio.data;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.client.TreeNode;
import com.wavemaker.runtime.data.util.JDBCUtils;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.data.Input;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.tools.data.*;
import com.wavemaker.tools.project.ProjectManager;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class DataService {

    private DataModelManager dataModelMgr = null;

    public void setDataModelManager(DataModelManager dataModelMgr) {
        this.dataModelMgr = dataModelMgr;
    }

    public List<String> getDataModelNames() {
        List<String> ret = new ArrayList<String>(dataModelMgr
                .getDataModelNames());
        Collections.sort(ret);
        return ret;
    }

    public EntityInfo getEntityWithoutProperties(String dataModelName,
                                                 String entityName) 
    {
        EntityInfo ei = 
            dataModelMgr.getDataModel(dataModelName).getEntity(entityName);
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
        EntityInfo ei = dataModelMgr.getDataModel(dataModelName).getEntity(
                entityName);
        EntityInfo rtn = (EntityInfo) ei.clone();
        List<ColumnInfo> columns = new ArrayList<ColumnInfo>(rtn.getColumns());
        sortColumns(columns);
        Map<String, ColumnInfo> sortedCols = new LinkedHashMap<String, ColumnInfo>(
                columns.size());
        for (ColumnInfo ci : columns) {
            sortedCols.put(ci.getName(), ci);
        }
        rtn.setColumns(sortedCols);

        return ei;
    }

    public Collection<String> getEntityNames(String dataModelName) {
        return dataModelMgr.getDataModel(dataModelName).getEntityNames();
    }

    public void deleteEntity(String dataModelName, String entityName) {
        dataModelMgr.deleteEntity(dataModelName, entityName);
    }

    public void deleteQuery(String dataModelName, String entityName) {
        dataModelMgr.deleteQuery(dataModelName, entityName);
    }

    public Collection<RelatedInfo> getRelated(String dataModelName,
            String entityName) {
        return dataModelMgr.getDataModel(dataModelName).getRelated(entityName);
    }

    public QueryInfo getQuery(String dataModelName, String queryName) {
        return dataModelMgr.getDataModel(dataModelName).getQuery(queryName);
    }

    public void removeDataModel(String dataModelName) {
        dataModelMgr.removeDataModel(dataModelName);
    }

    public void updateEntity(String dataModelName, String entityName,
            EntityInfo entity, boolean save) {
        dataModelMgr.updateEntity(dataModelName, entityName, entity, save);
    }

    public void updateColumns(String dataModelName, String entityName,
            List<ColumnInfo> columns, List<PropertyInfo> properties) {
        dataModelMgr.updateColumns(dataModelName, entityName, columns,
                properties);
    }

    public void updateRelated(String dataModelName, String entityName,
            RelatedInfo[] related) {
        dataModelMgr.updateRelated(dataModelName, entityName, related);
    }

    public void updateQuery(String dataModelName, QueryInfo query) {
        dataModelMgr.updateQuery(dataModelName, query);
    }

    public InitData getTypeRefTree() {
        return dataModelMgr.getTypeRefTree();
    }

    public InitData getQueriesTree() {
        return dataModelMgr.getQueriesTree();
    }

    public List<TreeNode> getTypesSubtree(String dataModelName) {
        return dataModelMgr.getDataModel(dataModelName).getTypeNodes();
    }

    public List<TreeNode> getQueriesSubtree(String dataModelName) {
        return dataModelMgr.getDataModel(dataModelName).getQueryNodes();
    }

    public void writeConnectionProperties(String dataModelName,
            Properties connectionProperties) {
    	
    	String cxnUrl = connectionProperties.getProperty(DataServiceConstants.DB_URL_KEY);
    	if (cxnUrl.contains(DataModelManager.HSQLDB))
    	{
    		//cxnUrl = JDBCUtils.reWriteConnectionUrl(
            //	dataModelMgr.getWebAppRoot() + "/" +
            //	DataModelManager.HSQL_SAMPLE_DB_SUB_DIR, cxnUrl);
            ProjectManager projMgr = (ProjectManager) RuntimeAccess.getInstance().getSession().
                        getAttribute(DataServiceConstants.CURRENT_PROJECT_MANAGER);
            String projRoot = projMgr.getCurrentProject().getWebAppRoot().getPath();
            cxnUrl = JDBCUtils.reWriteConnectionUrl(cxnUrl, projRoot);

            //String projName = RuntimeAccess.getProjectName();
            //cxnUrl = StringUtils.replacePlainStr(cxnUrl, projName, DataServiceConstants.PROJ_TOKEN);

            // Now update the property to the rewitten value
    		connectionProperties.setProperty(DataServiceConstants.DB_URL_KEY, cxnUrl);
    		
    		// Also set the hsqldbFile name
    		int n = cxnUrl.indexOf("/data") + 6;
    		String partialCxn = cxnUrl.substring(n);
    		int k = partialCxn.indexOf(';');
        	String hsqldbFileName = partialCxn.substring(0, k);
        	connectionProperties.setProperty(DataModelManager.HSQLFILE_PROP, hsqldbFileName);
    	}
    	
        dataModelMgr.getDataModel(dataModelName).writeConnectionProperties(
                connectionProperties);
    }

    public Properties readConnectionProperties(String dataModelName) {
        return dataModelMgr.getDataModel(dataModelName)
                .readConnectionProperties();
    }

    public void importDatabase(String serviceId, String packageName,
            String username, String password, String connectionUrl,
            String tableFilter, String schemaFilter, String driverClassName,
            String dialectClassName, String revengNamingStrategyClassName, boolean impersonateUser, String activeDirectoryDomain) {
        
    	if (connectionUrl.contains(DataModelManager.HSQLDB))
    	{
    		//connectionUrl = JDBCUtils.reWriteConnectionUrl(
            //	    dataModelMgr.getWebAppRoot() + "/" +
            //	    DataModelManager.HSQL_SAMPLE_DB_SUB_DIR, connectionUrl);
            ProjectManager projMgr = (ProjectManager) RuntimeAccess.getInstance().getSession().
                        getAttribute(DataServiceConstants.CURRENT_PROJECT_MANAGER);
            String projRoot = projMgr.getCurrentProject().getWebAppRoot().getPath();
            connectionUrl = JDBCUtils.reWriteConnectionUrl(connectionUrl, projRoot);
        }
    	
    	dataModelMgr.importDatabase(username, password, connectionUrl,
                    serviceId, packageName, tableFilter, schemaFilter, null,
                    driverClassName, dialectClassName,
                    revengNamingStrategyClassName, impersonateUser, activeDirectoryDomain);
    	
        return;
    }

    public String exportDatabase(String serviceId, String username,
            String password, String connectionUrl, String schemaFilter,
            String driverClassName, String dialectClassName,
            String revengNamingStrategyClassName, boolean overrideTable) {
    	
        return dataModelMgr.exportDatabase(username, password, connectionUrl,
                serviceId, schemaFilter, driverClassName, dialectClassName,
                revengNamingStrategyClassName, overrideTable);
    }

    public String getExportDDL(String serviceId, String username,
            String password, String connectionUrl, String schemaFilter,
            String driverClassName, String dialectClassName,
            boolean overrideTable) {

    	return dataModelMgr.getExportDDL(username, password, connectionUrl,
                serviceId, schemaFilter, driverClassName, dialectClassName,
                overrideTable);
    }

    public void newDataModel(String dataModelName) {
        dataModelMgr.newDataModel(dataModelName);
    }

    public void checkQuery(String dataModelName, String query, Input[] inputs, 
                           String values) {
        dataModelMgr.compile();
        dataModelMgr.getDataModel(dataModelName).checkQuery(query, inputs, 
                                                            values);
    }

    public Object runQuery(String dataModelName, String query, Input[] inputs,
            String values, Long maxResults) {

        if (query == null) {
            throw new IllegalArgumentException("query cannot be null");
        }

        if (inputs == null) {
            inputs = new Input[] {};
            values = "";
        }

        dataModelMgr.compile();

        return dataModelMgr.getDataModel(dataModelName).runQuery(query, inputs,
                values, maxResults);
    }

    public void validate(String dataModelName) {
        dataModelMgr.validate(dataModelName);
    }

    public void reImportDatabase(String dataModelName, String username,
            String password, String connectionUrl, String tableFilter,
            String schemaFilter, String driverClassName,
            String dialectClassName, String revengNamingStrategyClassName, 
            boolean impersonateUser, String activeDirectoryDomain) {
    	
    	if (connectionUrl.contains(DataModelManager.HSQLDB))
    	{
    		//connectionUrl = JDBCUtils.reWriteConnectionUrl(
            //	    dataModelMgr.getWebAppRoot() + "/" +
            //	    DataModelManager.HSQL_SAMPLE_DB_SUB_DIR, connectionUrl);
            ProjectManager projMgr = (ProjectManager) RuntimeAccess.getInstance().getSession().
                        getAttribute(DataServiceConstants.CURRENT_PROJECT_MANAGER);
            String projRoot = projMgr.getCurrentProject().getWebAppRoot().getPath();
            connectionUrl = JDBCUtils.reWriteConnectionUrl(connectionUrl, projRoot);
        }
         
    	dataModelMgr.reImport(dataModelName, username, password, connectionUrl,
            tableFilter, schemaFilter, driverClassName, dialectClassName,
            revengNamingStrategyClassName, impersonateUser, activeDirectoryDomain);    
    }
    
    public void testConnection(String username, String password,
            String connectionUrl, String driverClassName) {

        if (DataServiceLoggers.importLogger.isDebugEnabled()) {
            DataServiceLoggers.importLogger.debug("Test connection for "
                    + connectionUrl);
        }

        if (SystemUtils.isEncrypted(password)) {
            password = SystemUtils.decrypt(password);
        }

        if (connectionUrl.contains(DataModelManager.HSQLDB))
        {
        	//connectionUrl = JDBCUtils.reWriteConnectionUrl(
        	//    dataModelMgr.getWebAppRoot() + "/" +
        	//    DataModelManager.HSQL_SAMPLE_DB_SUB_DIR, connectionUrl);
            ProjectManager projMgr = (ProjectManager) RuntimeAccess.getInstance().getSession().
                        getAttribute(DataServiceConstants.CURRENT_PROJECT_MANAGER);
            String projRoot = projMgr.getCurrentProject().getWebAppRoot().getPath();
            connectionUrl = JDBCUtils.reWriteConnectionUrl(connectionUrl, projRoot);
        }
        
        TestDBConnection t = new TestDBConnection();
        t.setUsername(username);
        t.setPassword(password);
        t.setConnectionUrl(connectionUrl);

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
    }

    private void sortColumns(List<ColumnInfo> columns) {
        Collections.sort(columns, new Comparator<ColumnInfo>() {
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
}
