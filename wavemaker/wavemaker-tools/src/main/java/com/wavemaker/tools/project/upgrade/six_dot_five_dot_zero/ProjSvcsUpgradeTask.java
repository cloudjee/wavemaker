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

package com.wavemaker.tools.project.upgrade.six_dot_five_dot_zero;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * @author Edward Callahan
 */

public class ProjSvcsUpgradeTask implements UpgradeTask {

    private static String rtSBxmlStr = ">\\s*<import resource=\"classpath:com/wavemaker/runtime/service/runtimeServiceBean.xml\"/>\\s*<";

    private static String wmSBxmlStr = ">\\s*<import resource=\"classpath:com/wavemaker/runtime/service/waveMakerServiceBean.xml\"/>\\s*<";

    private static String toStr = ">\n<";

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        File file = project.getWebInfFolder().getFile("project-services.xml");
        try {
            String content = file.getContent().asString();
            content = content.replaceAll(rtSBxmlStr, toStr);
            content = content.replaceAll(wmSBxmlStr, toStr);
            file.getContent().write(content);
            upgradeInfo.addMessage("\nProject-services.xml upgrade to 6.5 imports completed successfully.");
        } catch (ResourceException e) {
            e.printStackTrace();
            upgradeInfo.addMessage("\n*** Terminated with error while upgrading project-services.xml to 6.5 imports. "
                + "Please check the console message.***");
        }
    }
}
