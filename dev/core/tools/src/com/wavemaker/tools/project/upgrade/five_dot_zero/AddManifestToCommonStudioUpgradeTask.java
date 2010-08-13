/*
 *  Copyright (C) 2009-2010 WaveMaker Software, Inc.
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
package com.wavemaker.tools.project.upgrade.five_dot_zero;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.project.upgrade.StudioUpgradeTask;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class AddManifestToCommonStudioUpgradeTask implements StudioUpgradeTask {

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.StudioUpgradeTask#doUpgrade(com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(UpgradeInfo upgradeInfo) {
        
        File commonDir = new File(studioConfiguration.getWaveMakerHome(),
                StudioConfiguration.COMMON_DIR);
        File userManifest = new File(commonDir, "manifest.js");
        
        if (commonDir.exists() && !userManifest.exists()) {
            File templateManifest = new File(
                    studioConfiguration.getStudioWebAppRootFile(), "lib/wm/"
                    + StudioConfiguration.COMMON_DIR+"/manifest.js");

            try {
                FileUtils.copyFile(templateManifest, userManifest);
            } catch (IOException e) {
                throw new WMRuntimeException(e);
            }
        }
    }

    private StudioConfiguration studioConfiguration;

    public StudioConfiguration getStudioConfiguration() {
        return studioConfiguration;
    }

    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }
}