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
package com.wavemaker.tools.project.upgrade.six_dot_two;

import java.io.File;
import java.io.IOException;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.runtime.server.ServerConstants;

import org.apache.commons.io.FileUtils;
/**
 * Changes to use custom class in place of InMemoryDaoImpl
 * 
 * @author S Lee
 */
public class ProjSecurityXmlUpgradeTask1 implements UpgradeTask {

    private boolean error = false;

    private String toStr = "com.wavemaker.runtime.security.EnhancedInMemoryDaoImpl";

    private String fromStr = "org.acegisecurity.userdetails.memory.InMemoryDaoImpl";

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        File secxml = project.getSecurityXml();

        try {
            String content = FileUtils.readFileToString(secxml, ServerConstants.DEFAULT_ENCODING);
            content = content.replace(fromStr, toStr);
            FileUtils.writeStringToFile(secxml, content, ServerConstants.DEFAULT_ENCODING);
        } catch (IOException ioe) {
            ioe.printStackTrace();
            error = true;
        }

        if (error) {
            upgradeInfo.addMessage("*** Terminated with error while upgrading project-security.xml. " +
                    "Please check the console message.***");
        } else {
            upgradeInfo.addMessage("Upgrading project-security.xml completed successfully.");
        }
    }
}
