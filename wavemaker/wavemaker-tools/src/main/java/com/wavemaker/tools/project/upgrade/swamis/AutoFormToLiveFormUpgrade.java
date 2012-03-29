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

import java.io.IOException;
import java.util.Set;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.project.PagesManager;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * Transform wm.AutoForm to wm.LiveForm.
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class AutoFormToLiveFormUpgrade implements UpgradeTask {

    private PagesManager pagesManager;

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        try {
            Set<String> pages = getPagesManager().listPages();
            for (String page : pages) {
                Folder pageFolder = getPagesManager().getPageFolder(project, page);
                File widgetsJS = pageFolder.getFile(page + "." + PagesManager.PAGE_WIDGETS);
                if (widgetsJS.exists()) {
                    String contents = widgetsJS.getContent().asString();
                    contents = contents.replace("wm.AutoForm\"", "wm.LiveForm\"");
                    widgetsJS.getContent().write(contents);
                }
            }
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    public PagesManager getPagesManager() {
        return this.pagesManager;
    }

    public void setPagesManager(PagesManager pagesManager) {
        this.pagesManager = pagesManager;
    }
}