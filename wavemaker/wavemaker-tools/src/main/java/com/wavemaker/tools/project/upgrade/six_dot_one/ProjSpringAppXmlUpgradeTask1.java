/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * Changes for dynamic loading.
 * 
 * @author Seung Lee
 */
public class ProjSpringAppXmlUpgradeTask1 implements UpgradeTask {

    private final String fromStr = "/lib/boot/boot.js=fileController";

    private final String toStr = this.fromStr + "\r\n\t\t\t\t/resources/images/**=fileController"
        + "\r\n\t\t\t\t/resources/gzipped/**=fileController\r\n";

    private boolean error = false;

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        File file = project.getWebInfFolder().getFile("project-springapp.xml");

        try {
            String content = file.getContent().asString();
            content = content.replace(this.fromStr, this.toStr);
            file.getContent().write(content);
        } catch (ResourceException e) {
            e.printStackTrace();
            this.error = true;
        }

        if (this.error) {
            upgradeInfo.addMessage("*** Terminated with error while upgrading project-springapp.xml. " + "Please check the console message.***");
        } else {
            upgradeInfo.addMessage("Upgrading project-springapp.xml completed successfully.");
        }
    }
}
