/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.project.upgrade.five_dot_zero;

import java.io.File;
import java.io.Writer;
import java.io.IOException;
import java.io.InputStream;

import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import com.wavemaker.common.WMRuntimeException;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;

import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;


/**
 * Backs up the current web.xml, and gives the user a message regarding that.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public class WebXmlUpgradeTask implements UpgradeTask {

    protected static final String WEB_XML_BACKUP = ProjectConstants.WEB_XML + ".4_5_bak";

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        File webXml = new File(project.getWebInf(), ProjectConstants.WEB_XML);
        if (webXml.exists()) {
            File webXmlBak = new File(project.getWebInf(), WEB_XML_BACKUP);
            try {
                FileUtils.copyFile(webXml, webXmlBak);
                webXml.delete();
            } catch (IOException e) {
                throw new WMRuntimeException(e);
            }

            File userWebXml = new File(project.getWebInf(),
                    ProjectConstants.USER_WEB_XML);
            InputStream resourceStream = this.getClass().getClassLoader().
                    getResourceAsStream(ProjectManager._TEMPLATE_APP_RESOURCE_NAME);
            ZipInputStream resourceZipStream = new ZipInputStream(resourceStream);

            try {
                ZipEntry zipEntry = null;

                while ((zipEntry = resourceZipStream.getNextEntry()) != null) {
                    if ("webapproot/WEB-INF/user-web.xml".equals(zipEntry.getName())) {
                        Writer writer = project.getWriter(userWebXml);
                        IOUtils.copy(resourceZipStream, writer);
                        writer.close();
                    }
                }

                resourceZipStream.close();
                resourceStream.close();
            } catch (IOException e) {
                throw new WMRuntimeException(e);
            }
            
            
            upgradeInfo.addMessage("The web.xml file has changed.  If you have custom"+
                    "modifications, please copy them from "+WEB_XML_BACKUP+
                    " to the new user-web.xml.");
        }
    }
}
