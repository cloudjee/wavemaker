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

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * Changes for dynamic loading.
 * 
 * @author S Lee
 */
public class ProjSpringAppXmlUpgradeTask implements UpgradeTask {

    private final String fromStr = "/modules/**=wmModuleController";

    private final String toStr = this.fromStr + "\r\n\r\n\t\t\t\t/lib/build/Gzipped/*=fileController"
        + "\r\n\t\t\t\t/lib/build/themes/**=fileController" + "\r\n\t\t\t\t/lib/wm/base/widget/themes/**=fileController"
        + "\r\n\t\t\t\t/lib/dojo/**=fileController" + "\r\n\t\t\t\t/lib/runtimeLoader.js=fileController"
        + "\r\n\t\t\t\t/lib/boot/boot.js=fileController";

    private boolean error = false;

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project,
     * com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        File file = new File(project.getWebInf() + "/project-springapp.xml");

        try {
            String content = FileUtils.readFileToString(file, ServerConstants.DEFAULT_ENCODING);
            content = content.replace(this.fromStr, this.toStr);
            FileUtils.writeStringToFile(file, content, ServerConstants.DEFAULT_ENCODING);
        } catch (IOException ioe) {
            ioe.printStackTrace();
            this.error = true;
        }

        if (this.error) {
            upgradeInfo.addMessage("*** Terminated with error while upgrading project-springapp.xml. " + "Please check the console message.***");
        } else {
            upgradeInfo.addMessage("Upgrading project-springapp.xml completed successfully.");
        }
    }
}
