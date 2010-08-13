/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
package com.wavemaker.tools.project.upgrade.swamis;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.JAXBException;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.service.ConfigurationCompiler;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.util.DesignTimeUtils;

/**
 * Removes com.activegrid references from files in WEB-INF (specifically,
 * project-managers.xml, project-services.xml, and web.xml).
 * 
 * In web.xml, upgrade references to CleanupListener.
 * 
 * project-managers: removed, it will be regenerated next time.
 * 
 * project-services: removed, it will be regenerated next time.
 * 
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class WebInfActiveGridUpgrade implements UpgradeTask {

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        
        File webinf = project.getWebInf();
        
        File servicesConfig = ConfigurationCompiler.getRuntimeServicesXml(project);
        File managersConfig = ConfigurationCompiler.getRuntimeManagersXml(project);
        File webxml = new File(webinf, ProjectConstants.WEB_XML);
        
        List<String> changedFiles = new ArrayList<String>();
        List<String> regenedFiles = new ArrayList<String>();
        
        DesignServiceManager dsm = DesignTimeUtils.getDSMForProjectRoot(
                project.getProjectRoot());
        
        try {
            if (servicesConfig.exists()) {
                ConfigurationCompiler.generateServices(project, servicesConfig,
                        dsm.getServices());
                regenedFiles.add(ConfigurationCompiler.RUNTIME_SERVICES);
            }

            if (managersConfig.exists()) {
                ConfigurationCompiler.generateManagers(project, managersConfig,
                        dsm.getServices());
                regenedFiles.add(ConfigurationCompiler.RUNTIME_MANAGERS);
            }

            if (webxml.exists()) {
                String webxmlContents = FileUtils.readFileToString(webxml,
                        ServerConstants.DEFAULT_ENCODING);
                webxmlContents = webxmlContents.replace(
                        "com.activegrid.runtime.server.CleanupListener",
                        "com.wavemaker.runtime.server.CleanupListener");
                webxmlContents = webxmlContents.replace(
                        "com.activegrid.runtime.security.AcegiAjaxFilter",
                        "com.wavemaker.runtime.security.AcegiAjaxFilter");
                FileUtils.writeStringToFile(webxml, webxmlContents,
                        ServerConstants.DEFAULT_ENCODING);
                
                changedFiles.add(ProjectConstants.WEB_XML);
            }
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        } catch (JAXBException e2) {
            throw new WMRuntimeException(e2);
        }

        String ret = null;
        if (!changedFiles.isEmpty()) {
            ret = "Removed com.activegrid references from "+
                    StringUtils.join(changedFiles, ", ");
        }
        if (!regenedFiles.isEmpty()) {
            if (null!=ret) {
                ret += "\n";
            } else {
                ret = "";
            }
            
            ret += "Re-generated files: "+StringUtils.join(regenedFiles, ", ");
        }

        upgradeInfo.addVerbose(ret);
    }
}