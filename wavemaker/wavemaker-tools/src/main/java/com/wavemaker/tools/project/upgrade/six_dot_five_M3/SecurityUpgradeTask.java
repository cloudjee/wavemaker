/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.project.upgrade.six_dot_five_M3;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

public class SecurityUpgradeTask implements UpgradeTask {

    private static String objDefStr = "objectDefinitionSource";

    private static String jsonStr = "/*.json=";

    private static String svcsJsonStr = "/*/*.json=";

    private static String fromStrFully = "/*.json=IS_AUTHENTICATED_FULLY";

    private static String toStrFully = "/*.json=IS_AUTHENTICATED_FULLY\n\t\t\t\t/*/*.json=IS_AUTHENTICATED_FULLY";

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        File file = project.getWebInfFolder().getFile("project-security.xml");
        try {
            String content = file.getContent().asString();
            if (!content.contains(svcsJsonStr) && content.contains(objDefStr)) {
                if (!content.contains("/*/*.json=IS_AUTHENTICATED_FULLY")) {
                    content = content.replace(fromStrFully, toStrFully);
                    file.getContent().write(content);
                    upgradeInfo.addMessage("\nProject-security.xml has been corrected, fully authenticated.");
                } else {
                    int start = content.indexOf(jsonStr);
                    int end = content.indexOf("\n", start);
                    String authLevel = content.substring(start + jsonStr.length(), end);
                    content = content.replace(jsonStr + authLevel, jsonStr + authLevel + "\n\t\t\t\t" + svcsJsonStr + authLevel);
                    file.getContent().write(content);
                    upgradeInfo.addMessage("\nProject-security.xml has been corrected, custom authentication.");
                }
            } else {
                upgradeInfo.addMessage("\nProject-security.xml was already corrected or security not enabled. Task skipped");
            }
        } catch (ResourceException e) {
            e.printStackTrace();
            upgradeInfo.addMessage("\n*** Terminated with error while updating project-security.xml. " + "Please check the console message.***");
        }

    }
}
