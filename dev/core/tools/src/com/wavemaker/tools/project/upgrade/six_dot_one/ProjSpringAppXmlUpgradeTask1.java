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
public class ProjSpringAppXmlUpgradeTask1 implements UpgradeTask {

    private String fromStr = "/lib/boot/boot.js=fileController";

    private String toStr = fromStr +
                           "\r\n\t\t\t\t/resources/images/**=fileController" +
				           "\r\n\t\t\t\t/resources/gzipped/**=fileController\r\n";

    private boolean error = false;

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        File file = new File(project.getWebInf() + "/project-springapp.xml");

        try {
            String content = FileUtils.readFileToString(file, ServerConstants.DEFAULT_ENCODING);
            content = content.replace(fromStr, toStr);
            FileUtils.writeStringToFile(file, content, ServerConstants.DEFAULT_ENCODING);
        } catch (IOException ioe) {
            ioe.printStackTrace();
            error = true;
        }

        if (error) {
            upgradeInfo.addMessage("*** Terminated with error while upgrading project-springapp.xml. " +
                    "Please check the console message.***");
        } else {
            upgradeInfo.addMessage("Upgrading project-springapp.xml completed successfully.");
        }
    }
}
