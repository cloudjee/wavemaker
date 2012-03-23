/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.project.upgrade.six_dot_two;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * Changes to use custom class in place of InMemoryDaoImpl
 * 
 * @author Seung Lee
 * @author Jeremy Grelle
 */
public class ProjSecurityXmlUpgradeTask1 implements UpgradeTask {

    private boolean error = false;

    private final String toStr = "com.wavemaker.runtime.security.EnhancedInMemoryDaoImpl";

    private final String fromStr = "org.acegisecurity.userdetails.memory.InMemoryDaoImpl";

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        File securityXmlFile = project.getSecurityXmlFile();
        try {
            String content = securityXmlFile.getContent().asString();
            content = content.replace(this.fromStr, this.toStr);
            securityXmlFile.getContent().write(content);
        } catch (ResourceException e) {
            e.printStackTrace();
            this.error = true;
        }

        if (this.error) {
            upgradeInfo.addMessage("*** Terminated with error while upgrading project-security.xml. " + "Please check the console message.***");
        } else {
            upgradeInfo.addMessage("Upgrading project-security.xml completed successfully.");
        }
    }
}
