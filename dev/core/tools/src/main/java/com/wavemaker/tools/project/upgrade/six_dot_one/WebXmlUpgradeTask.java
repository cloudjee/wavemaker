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

package com.wavemaker.tools.project.upgrade.six_dot_one;

import java.io.IOException;

import org.springframework.core.io.Resource;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * Changes for dynamic loading.
 * 
 * @author S Lee
 * @author Jeremy Grelle
 */
public class WebXmlUpgradeTask implements UpgradeTask {

    private final String str1 = "<url-pattern>*.upload</url-pattern>";

    private final String str2 = "</servlet-mapping>";

    private final String toStr = "<url-pattern>*.upload</url-pattern>" + "\r\n\t</servlet-mapping>" +

    "\r\n\r\n\t<servlet-mapping>" + "\r\n\t\t<servlet-name>springapp</servlet-name>" + "\r\n\t\t<url-pattern>/lib/build/Gzipped/*</url-pattern>"
        + "\r\n\t</servlet-mapping>" +

        "\r\n\r\n\t<servlet-mapping>" + "\r\n\t\t<servlet-name>springapp</servlet-name>" + "\r\n\t\t<url-pattern>/lib/build/themes/*</url-pattern>"
        + "\r\n\t</servlet-mapping>" +

        "\r\n\r\n\t<servlet-mapping>" + "\r\n\t\t<servlet-name>springapp</servlet-name>"
        + "\r\n\t\t<url-pattern>/lib/wm/base/widget/themes/*</url-pattern>" + "\r\n\t</servlet-mapping>" +

        "\r\n\r\n\t<servlet-mapping>" + "\r\n\t\t<servlet-name>springapp</servlet-name>" + "\r\n\t\t<url-pattern>/lib/dojo/*</url-pattern>"
        + "\r\n\t</servlet-mapping>" +

        "\r\n\r\n\t<servlet-mapping>" + "\r\n\t\t<servlet-name>springapp</servlet-name>" + "\r\n\t\t<url-pattern>/lib/boot/boot.js</url-pattern>"
        + "\r\n\t</servlet-mapping>" +

        "\r\n\r\n\t<servlet-mapping>" + "\r\n\t\t<servlet-name>springapp</servlet-name>" + "\r\n\t\t<url-pattern>/lib/runtimeLoader.js</url-pattern>"
        + "\r\n\t</servlet-mapping>";

    private boolean error = false;

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project,
     * com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        Resource webxml = project.getWebXml();

        try {
            String content = project.readFile(webxml);
            int indx1 = content.indexOf(this.str1);
            int indx2 = content.indexOf(this.str2, indx1);
            String fromStr = content.substring(indx1, indx2 + this.str2.length());
            content = content.replace(fromStr, this.toStr);
            project.writeFile(webxml, content);
        } catch (IOException ioe) {
            ioe.printStackTrace();
            this.error = true;
        }

        if (this.error) {
            upgradeInfo.addMessage("*** Terminated with error while upgrading web.xml. " + "Please check the console message.***");
        } else {
            upgradeInfo.addMessage("Upgrading web.xml completed successfully.");
        }
    }
}
