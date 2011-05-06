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

package com.wavemaker.tools.project.upgrade.swamis;

import java.io.File;
import java.io.IOException;
import java.util.Set;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.PagesManager;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * In conjunction with the necessary client change, it's best to add this to the
 * project upgrade script:
 * 
 * instances of wm.MoneyFormatter become wm.CurrencyFormatter
 * 
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class CurrencyRenameUpgrade implements UpgradeTask {

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project,
     *      com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        try {
            Set<String> pages = getPagesManager().listPages();

            for (String page : pages) {
                File pageDir = getPagesManager().getPageDir(
                        project.getProjectName(), page);
                File widgetsJs = new File(pageDir, page+"."+
                        PagesManager.PAGE_WIDGETS);
                String pageContents = project.readFile(widgetsJs);
                pageContents = pageContents.replace("\"wm.MoneyFormatter\"",
                        "\"wm.CurrencyFormatter\"");
                project.writeFile(widgetsJs, pageContents);
            }
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }

    }
    
    // bean properties
    private PagesManager pagesManager;

    public PagesManager getPagesManager() {
        return pagesManager;
    }

    public void setPagesManager(PagesManager pagesManager) {
        this.pagesManager = pagesManager;
    }
}