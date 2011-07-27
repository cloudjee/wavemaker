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

package com.wavemaker.runtime;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.CommonConstants;
import com.wavemaker.runtime.data.util.DataServiceConstants;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import java.io.*;
import java.util.Properties;
import java.util.HashMap;

import org.json.JSONObject;
import org.springframework.core.io.Resource;
import org.springframework.web.context.support.ServletContextResource;
import org.apache.commons.io.IOUtils;

/**
 * This singleton class is to store any properties in the scope of the
 * application context.
 *
 * @author S Lee
 * @author Jeremy Grelle
 */
public class WMAppContext
{
    private static WMAppContext instance;
    private int defaultTenantID = DataServiceConstants.DEFAULT_TENANT_ID;
    private String tenantFieldName = DataServiceConstants.DEFAULT_TENANT_FIELD;
    private String tenantColumnName = "";
    private HashMap<String, ProjectInfo> hm;
    ServletContext context;
    private String appName;
    private static HashMap<String, Integer> tenantIdMap = new HashMap<String, Integer>();
    private static HashMap<String, String> userNameMap = new HashMap<String, String>();
    private JSONObject typesObj; //salesforce

    private WMAppContext(ServletContextEvent event) {
        context = event.getServletContext();
        appName = context.getServletContextName();
        if (appName == null) appName = "Project Name";
        
        //In Studio, the tenant field and def tenant ID is injected by ProjectManager when a project opens
        if (!appName.equals(DataServiceConstants.WAVEMAKER_STUDIO)) {
            //Store types.js contents in memory
            try {
                Resource typesResource = new ServletContextResource(context, "/types.js");
                String s = IOUtils.toString(typesResource.getInputStream());
                typesObj = new JSONObject(s.substring(11));
            } catch (Exception e) {
                e.printStackTrace();
                return;
            }

            //Set up multi-tenant info
            Resource appPropsResource = null;
            try {
                appPropsResource = new ServletContextResource(context, "/WEB-INF/classes/"+CommonConstants.APP_PROPERTY_FILE);
            } catch (WMRuntimeException re) {
                return;
            } catch (Exception e) {
                e.printStackTrace();
                return;
            }

            if (!appPropsResource.exists()) {
                return;
            }
            
            Properties props;

            try {
                props = new Properties();
                props.load(appPropsResource.getInputStream());
            } catch (IOException ioe) {
                ioe.printStackTrace();
                return;
            }

            tenantFieldName = props.getProperty(DataServiceConstants.TENANT_FIELD_PROPERTY_NAME);
            tenantColumnName = props.getProperty(DataServiceConstants.TENANT_COLUMN_PROPERTY_NAME);
            defaultTenantID = Integer.parseInt(props.getProperty(DataServiceConstants.DEFAULT_TENANT_ID_PROPERTY_NAME));
        }
    }

    public static synchronized WMAppContext getInstance(ServletContextEvent event) {
        if (instance == null) {
            instance = new WMAppContext(event);
        }

        return instance;
    }

    public static synchronized WMAppContext getInstance() {
        return instance;
    }

    public Object clone() throws CloneNotSupportedException {
        throw new CloneNotSupportedException();
    }

    public int getDefaultTenantID() {
        if (appName.equals(DataServiceConstants.WAVEMAKER_STUDIO)) {
            String p = (String)RuntimeAccess.getInstance().getSession().
                    getAttribute(DataServiceConstants.CURRENT_PROJECT_NAME);
            if (hm == null) {
                return DataServiceConstants.DEFAULT_TENANT_ID;
            } else {
                ProjectInfo pi = hm.get(p);
                if (pi == null) {
                    return DataServiceConstants.DEFAULT_TENANT_ID;
                } else {
                    return pi.defTenantId;
                }
            }
        } else
            return defaultTenantID;
    }

    public String getTenantFieldName() {
        if (appName.equals(DataServiceConstants.WAVEMAKER_STUDIO)) {
            String p = (String)RuntimeAccess.getInstance().getSession().
                    getAttribute(DataServiceConstants.CURRENT_PROJECT_NAME);
            if (hm == null) {
                return DataServiceConstants.DEFAULT_TENANT_FIELD;
            } else {
                ProjectInfo pi = hm.get(p);
                if (pi == null) {
                    return DataServiceConstants.DEFAULT_TENANT_FIELD;
                } else {
                    return pi.tenantFldName;
                }
            }
        } else
            return tenantFieldName;
    }

    public String getTenantColumnName() {
        if (appName.equals(DataServiceConstants.WAVEMAKER_STUDIO)) {
            String p = (String)RuntimeAccess.getInstance().getSession().
                    getAttribute(DataServiceConstants.CURRENT_PROJECT_NAME);
            if (hm == null) {
                return "";
            } else {
                ProjectInfo pi = hm.get(p);
                if (pi == null) {
                    return "";
                } else {
                    return pi.tenantColName;
                }
            }
        } else
            return tenantColumnName;
    }

    public void setTenantInfoForProj(String projName, String val1, int val2, String val3) {
        if (hm == null) hm = new HashMap<String, ProjectInfo>();
        ProjectInfo pi = new ProjectInfo(val1, val2, val3);
        hm.put(projName, pi);
    }

    public boolean isMultiTenant() {
        String tf;
        boolean multiTenancy;

        if (appName.equals(DataServiceConstants.WAVEMAKER_STUDIO)) {
            String p = (String)RuntimeAccess.getInstance().getSession().
                    getAttribute(DataServiceConstants.CURRENT_PROJECT_NAME);

            if (hm == null) {
                tf = DataServiceConstants.DEFAULT_TENANT_FIELD;
            } else {
                ProjectInfo pi = hm.get(p);
                if (pi == null) {
                    tf = DataServiceConstants.DEFAULT_TENANT_FIELD;
                } else {
                    tf = pi.tenantFldName;
                }
            }
        } else
            tf = tenantFieldName;

        if (tf.equalsIgnoreCase(DataServiceConstants.DEFAULT_TENANT_FIELD) ||
                tf.length() == 0 || tf == null) {
            multiTenancy = false;
        } else {
            multiTenancy = true;
        }

        return multiTenancy;
    }

    public void setTenantIdForUser(String userName, int tenantId) {
        tenantIdMap.put(userName, tenantId);
    }
    
    public int getTenantIdForUser(String userName) {
        return tenantIdMap.get(userName);
    }

     public void setUserNameForUserID(String userId, String userName) {
        userNameMap.put(userId, userName);
    }

    public String getUserNameForUserID(String userId) {
        return userNameMap.get(userId);
    }

    public String getAppName() {
        return appName;
    }

    public String getAppContextRoot() {
        return context.getRealPath("");    
    }

    public JSONObject  getTypesObject() { //salesforce
        return typesObj;
    }

    public void setTypesObject(JSONObject val) { //salesforce
        this.typesObj = val;
    }

    class ProjectInfo {
        String tenantFldName;
        int defTenantId;
        String tenantColName;

        private ProjectInfo(String val1, int val2, String val3) {
            tenantFldName = val1;
            defTenantId = val2;
            tenantColName = val3;
        }
    }
}