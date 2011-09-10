/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.project.upgrade.six_dot_zero;

import java.io.File;
import java.io.IOException;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.runtime.server.ServerConstants;

import org.apache.commons.io.FileUtils;
/**
 * Changes the package of WMPropertyPlaceholderConfigurer.
 * 
 * @author S Lee
 */
public class WebXmlUpgradeTask implements UpgradeTask {

    private String wmListenerStr =
            "<listener-class>com.wavemaker.runtime.server.CleanupListener</listener-class>";
    private String springListenerStr =
            "<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>";
    private String dummyStr = "xxx123456789yyy";
    private boolean error = false;

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        File webxml = project.getWebXml();

        try {
            String content = FileUtils.readFileToString(webxml, ServerConstants.DEFAULT_ENCODING);
            int indxwm = content.indexOf(wmListenerStr);
            int indxspring = content.indexOf(springListenerStr);
            if (indxwm < indxspring) return;
            
            content = content.replace(wmListenerStr, dummyStr);
            content = content.replace(springListenerStr, wmListenerStr);
            content = content.replace(dummyStr, springListenerStr);
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
