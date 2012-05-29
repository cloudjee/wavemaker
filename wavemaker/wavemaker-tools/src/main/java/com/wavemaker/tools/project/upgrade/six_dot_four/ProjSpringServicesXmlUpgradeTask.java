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
/**
 * 
 */

package com.wavemaker.tools.project.upgrade.six_dot_four;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * @author Ed Callahan
 */
public class ProjSpringServicesXmlUpgradeTask implements UpgradeTask {

    private static String fromStr = "</beans>";

    private static String toStr = "    <import resource=\"classpath:com/wavemaker/runtime/service/waveMakerServiceBean.xml\"/>\r\n</beans>";

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        File file = project.getWebInfFolder().getFile("project-services.xml");
        try {
            String content = file.getContent().asString();
            content = content.replace(fromStr, toStr);
            file.getContent().write(content);
            upgradeInfo.addMessage("\nUpgrading project-services.xml completed successfully.");
        } catch (ResourceException e) {
            e.printStackTrace();
            upgradeInfo.addMessage("\n*** Terminated with error while upgrading project-services.xml. " + "Please check the console message.***");
        }
    }

}
