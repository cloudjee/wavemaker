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

import java.io.*;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
/**
 * Delete runtimeService.smd so that it can be re-created reflecting changes (if any) in Runtime Service.
 * 
 * @author S Lee
 */
public class RuntimeServiceSmdTask implements UpgradeTask {

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */

    private boolean processed = false;
    private boolean error = false;

    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        String path = project.getWebAppRoot().getAbsolutePath() + "/services/runtimeService.smd";
        File rtsmd = new File(path);

        boolean success = rtsmd.delete();

        if (success) {
            upgradeInfo.addMessage("runtimeService.smd is successfully deleted for re-creation.");
            processed = true;
        } else {
            upgradeInfo.addMessage("*** Cannot delete runtimeService.smd. Upgrade has failed ***"); 
            error = true;
        }

        if (error) return;

        File webxml = project.getWebXml();

        success = webxml.delete();

        if (success) {
            upgradeInfo.addMessage("\r\n\tweb.xml is successfully deleted for re-creation.");
            processed = true;
        } else {
            upgradeInfo.addMessage("*** Cannot delete web.xml. Upgrade has failed ***");
            error = true;
        }
    }
}
