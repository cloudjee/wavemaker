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

package com.wavemaker.tools.project.upgrade.six_dot_two;

import java.io.IOException;

import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * Delete runtimeService.smd so that it can be re-created reflecting changes (if any) in Runtime Service.
 * 
 * @author Seung Lee
 * @author Jeremy Grelle
 */
public class RuntimeServiceSmdTask implements UpgradeTask {

    private StudioConfiguration studioConfiguration;

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        Resource rtsmd;
        try {
            rtsmd = project.getWebAppRoot().createRelative("services/runtimeService.smd");
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

        if (this.studioConfiguration.deleteFile(rtsmd)) {
            upgradeInfo.addMessage("runtimeService.smd is successfully deleted for re-creation.");
        } else {
            upgradeInfo.addMessage("*** Cannot delete runtimeService.smd. Upgrade has failed ***");
            return;
        }

        Resource webxml = project.getWebXml();
        if (this.studioConfiguration.deleteFile(webxml)) {
            upgradeInfo.addMessage("\r\n\tweb.xml is successfully deleted for re-creation.");
        } else {
            upgradeInfo.addMessage("*** Cannot delete web.xml. Upgrade has failed ***");
        }
    }

    public StudioConfiguration getStudioConfiguration() {
        return this.studioConfiguration;
    }

    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }
}
