/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.project;

import java.io.*;

import java.util.*;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.CommonConstants;

import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.common.util.IOUtils;

import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.license.LicenseProcessor;
import org.json.JSONObject;

/**
 * Manages projects; list of all available projects, and keeps track of any
 * open projects.  Normally this should be session-scoped.
 *
 * @author small
 * @version $Rev: 31083 $ - $Date: 2011-01-19 11:30:47 -0800 (Wed, 19 Jan 2011) $
 *
 */
public class ProjectManagerHide extends ProjectManagerCore{

    public void openProject(String projectName, boolean noSession, boolean skip)
            throws IOException {

        if (!skip) {
            String goOn = LicenseProcessor.verifyLicense();
            if (goOn != null && goOn.length() > 0)
                throw new WMRuntimeException(goOn);
        }
        
        File f = getProjectDir(projectName, false);

        // check the path
        if (!f.exists()) {
            throw new WMRuntimeException(Resource.PROJECT_DNE, projectName, f);
        }
        if (!f.isDirectory()) {
            throw new WMRuntimeException(Resource.UTIL_FILEUTILS_PATHNOTDIR, f);
        }

        // create and open
        Project ret = new Project(f);

        if (null != super.currentProject) {
            closeProject();
        }
        if (null!=getProjectEventNotifier()) {
            getProjectEventNotifier().executeOpenProject(super.currentProject);
        }

        setCurrentProject(ret);
        if (!noSession) {
            RuntimeAccess.getInstance().getSession().setAttribute(
                    OPEN_PROJECT_SESSION_NAME, projectName);
            RuntimeAccess.getInstance().getSession().setAttribute(
                    DataServiceConstants.CURRENT_PROJECT_MANAGER, this);
            RuntimeAccess.getInstance().getSession().setAttribute(
                    DataServiceConstants.CURRENT_PROJECT_NAME, projectName);
            RuntimeAccess.getInstance().getSession().setAttribute(
                    DataServiceConstants.CURRENT_PROJECT_APP_ROOT, ret.getWebAppRoot().getAbsolutePath());
        }

        String appPropPath = ret.getWebAppRoot().getAbsolutePath() + "/WEB-INF/classes/" + CommonConstants.APP_PROPERTY_FILE;
        FileInputStream is = null;       
        boolean fileExists = true;

        int defTenantID = DataServiceConstants.DEFAULT_TENANT_ID;
        String tenantFieldName = DataServiceConstants.DEFAULT_TENANT_FIELD;
        String tenantColumnName = "";

        try {
            is = new FileInputStream(appPropPath);
        } catch (FileNotFoundException ne) {
            fileExists = false;
        }

        if (fileExists) {
            Properties props;

            props = new Properties();
            props.load(is);

            tenantFieldName = props.getProperty(DataServiceConstants.TENANT_FIELD_PROPERTY_NAME);
            defTenantID = Integer.parseInt(props.getProperty(DataServiceConstants.DEFAULT_TENANT_ID_PROPERTY_NAME));
            tenantColumnName = props.getProperty(DataServiceConstants.TENANT_FIELD_PROPERTY_NAME);
        }

        WMAppContext wmApp = WMAppContext.getInstance();
        if (wmApp != null) {
            wmApp.setTenantInfoForProj(projectName, tenantFieldName, defTenantID, tenantColumnName);
        }

        //Store types.js contents in the memory //xxx
        String typesPath = ret.getWebAppRoot().getAbsolutePath() + "/types.js";
        try {
            is = new FileInputStream(typesPath);

            String s = IOUtils.convertStreamToString(is);
            JSONObject typesObj = new JSONObject(s.substring(11));
            if (wmApp != null) {
                wmApp.setTypesObject(typesObj);
            }
        }  catch (FileNotFoundException ex) {
        }  catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public void closeProject() throws IOException {}

}
