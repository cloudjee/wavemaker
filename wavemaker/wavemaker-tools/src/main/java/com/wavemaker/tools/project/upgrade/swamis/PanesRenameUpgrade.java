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

package com.wavemaker.tools.project.upgrade.swamis;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * Rename the old 'panes' directory to 'pages'.
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class PanesRenameUpgrade implements UpgradeTask {

    private static final String OLD_PANES_DIR = "panes";

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        Folder panesFolder = project.getWebAppRootFolder().getFolder(OLD_PANES_DIR);

        // if the project doesn't contain any panes, don't do the upgrade
        if (!panesFolder.exists()) {
            return;
        }
        panesFolder.rename("pages");

        upgradeInfo.addMessage("Moved old " + OLD_PANES_DIR + " to new " + ProjectConstants.PAGES_DIR + "; static references to " + OLD_PANES_DIR
            + " will have to be updated");
    }
}
