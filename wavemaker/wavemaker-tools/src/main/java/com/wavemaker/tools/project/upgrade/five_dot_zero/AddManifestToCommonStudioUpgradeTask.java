/*
 *  Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.project.upgrade.five_dot_zero;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.tools.project.upgrade.StudioUpgradeTask;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;

/**
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class AddManifestToCommonStudioUpgradeTask implements StudioUpgradeTask {

    private StudioFileSystem fileSystem;

    @Override
    public void doUpgrade(UpgradeInfo upgradeInfo) {
        Folder commonFolder = this.fileSystem.getCommonFolder();
        File userManifest = commonFolder.getFile("manifest.js");
        if (commonFolder.exists() && !userManifest.exists()) {
            File templateManifest = this.fileSystem.getStudioWebAppRootFolder().getFile("lib/wm/common/manifest.js");
            userManifest.getContent().write(templateManifest);
        }
    }

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }
}