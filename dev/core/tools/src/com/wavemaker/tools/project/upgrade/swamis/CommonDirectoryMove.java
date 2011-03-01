/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.project.upgrade.swamis;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.config.ConfigurationStore;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.project.upgrade.StudioUpgradeTask;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;

/**
 * Not so much of a project upgrade, this moves the old common directory to a
 * backup directory.
 * 
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class CommonDirectoryMove implements StudioUpgradeTask {
    
    public static final String UPGRADED_KEY = "COMMON_DIR_UPGRADED";

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(UpgradeInfo upgradeInfo) {
        
        File commonDir = new File(studioConfiguration.getWaveMakerHome(),
                StudioConfiguration.COMMON_DIR);
        boolean isUpgraded = ConfigurationStore.getPreferenceBoolean(getClass(),
                UPGRADED_KEY, false);
        
        if (commonDir.exists() && !isUpgraded) {
            File commonBakDir = new File(studioConfiguration.getStudioWebAppRootFile(),
                    "lib/wm/"+StudioConfiguration.COMMON_DIR+".bak");
            if (commonBakDir.exists()) {
                upgradeInfo.addMessage("Common backup directory ("+commonBakDir+
                        ") already exists");
                return;
            }
            
            try {
                //FileUtils.copyDirectory(commonDir, commonBakDir);
                //FileUtils.forceDelete(commonDir);
                upgradeInfo.addMessage("Common directory is now: ("+commonDir+") ");
                // force common directory recreation
                studioConfiguration.getCommonDir();
            } catch (IOException e) {
                throw new WMRuntimeException(e);
            }
            
            // if we had an old-style preference key, remove it
            ConfigurationStore.removePreference(getClass(), UPGRADED_KEY);
            
            upgradeInfo.addMessage("Your common directory has been moved to avoid conflicts and the template version copied in; if you have custom widgets, upgrade them manually from the backup at "+commonBakDir+".");
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