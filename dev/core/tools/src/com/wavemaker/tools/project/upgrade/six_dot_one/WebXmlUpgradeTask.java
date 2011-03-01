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
package com.wavemaker.tools.project.upgrade.six_dot_one;

import java.io.File;
import java.io.IOException;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.runtime.server.ServerConstants;

import org.apache.commons.io.FileUtils;
/**
 * Changes for dynamic loading.
 * 
 * @author S Lee
 */
public class WebXmlUpgradeTask implements UpgradeTask {

    private String str1 =
            "<url-pattern>*.upload</url-pattern>";

    private String str2 =
            "</servlet-mapping>";

    private String toStr =
            "<url-pattern>*.upload</url-pattern>" +
            "\r\n\t</servlet-mapping>" +
                    
            "\r\n\r\n\t<servlet-mapping>" +
            "\r\n\t\t<servlet-name>springapp</servlet-name>" +
            "\r\n\t\t<url-pattern>/lib/build/Gzipped/*</url-pattern>" +
            "\r\n\t</servlet-mapping>" +

            "\r\n\r\n\t<servlet-mapping>" +
            "\r\n\t\t<servlet-name>springapp</servlet-name>" +
            "\r\n\t\t<url-pattern>/lib/build/themes/*</url-pattern>" +
            "\r\n\t</servlet-mapping>" +

            "\r\n\r\n\t<servlet-mapping>" +
            "\r\n\t\t<servlet-name>springapp</servlet-name>" +
            "\r\n\t\t<url-pattern>/lib/wm/base/widget/themes/*</url-pattern>" +
            "\r\n\t</servlet-mapping>" +

            "\r\n\r\n\t<servlet-mapping>" +
            "\r\n\t\t<servlet-name>springapp</servlet-name>" +
            "\r\n\t\t<url-pattern>/lib/dojo/*</url-pattern>" +
            "\r\n\t</servlet-mapping>" +

            "\r\n\r\n\t<servlet-mapping>" +
            "\r\n\t\t<servlet-name>springapp</servlet-name>" +
            "\r\n\t\t<url-pattern>/lib/boot/boot.js</url-pattern>" +
            "\r\n\t</servlet-mapping>" +

            "\r\n\r\n\t<servlet-mapping>" +
            "\r\n\t\t<servlet-name>springapp</servlet-name>" +
            "\r\n\t\t<url-pattern>/lib/runtimeLoader.js</url-pattern>" +
            "\r\n\t</servlet-mapping>";

    private boolean error = false;

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        File webxml = project.getWebXml();

        try {
            String content = FileUtils.readFileToString(webxml, ServerConstants.DEFAULT_ENCODING);
            int indx1 = content.indexOf(str1);
            int indx2 = content.indexOf(str2, indx1);
            String fromStr = content.substring(indx1, indx2 + str2.length());
            
            content = content.replace(fromStr, toStr);
            FileUtils.writeStringToFile(webxml, content, ServerConstants.DEFAULT_ENCODING);
        } catch (IOException ioe) {
            ioe.printStackTrace();
            error = true;
        }

        if (error) {
            upgradeInfo.addMessage("*** Terminated with error while upgrading web.xml. " +
                    "Please check the console message.***");
        } else {
            upgradeInfo.addMessage("Upgrading web.xml completed successfully.");
        }
    }
}
