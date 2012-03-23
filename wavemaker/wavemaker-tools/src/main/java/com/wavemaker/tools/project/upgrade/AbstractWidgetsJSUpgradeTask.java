/*
 *  Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.project.upgrade;

import java.io.IOException;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONMarshaller;
import com.wavemaker.json.JSONState;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.project.PagesManager;
import com.wavemaker.tools.project.Project;

/**
 * Upgrades the contents of the widgets.js for each page in the current project.
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public abstract class AbstractWidgetsJSUpgradeTask implements UpgradeTask {

    private PagesManager pagesManager;

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        if (getPagesManager() == null) {
            throw new WMRuntimeException("No pagesManager in doUpgrade()");
        }

        try {
            for (String page : getPagesManager().listPages()) {
                Folder pageFolder = getPagesManager().getPageFolder(project, page);
                File widgetsJS = pageFolder.getFile(page + "." + PagesManager.PAGE_WIDGETS);
                if (widgetsJS.exists()) {
                    readAndUpgradeWidgets(project, widgetsJS);
                }
            }

            File appJs = project.getWebAppRootFolder().getFile(project.getProjectName() + ".js");
            if (doUpgradeAppJS() && appJs.exists()) {
                readAndUpgradeWidgets(project, appJs);
            }
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    private void readAndUpgradeWidgets(Project project, File widgetsJS) throws IOException {
        String contents = widgetsJS.getContent().asString();
        String ret = upgradeWidgets(contents);
        widgetsJS.getContent().write(ret);
    }

    private String upgradeWidgets(String widgetsContent) throws IOException {
        String jsonString = widgetsContent.substring(widgetsContent.indexOf('{'), widgetsContent.lastIndexOf('}') + 1);
        JSON widgetsJson = JSONUnmarshaller.unmarshal(jsonString);
        upgradeWidgetsJS(widgetsJson);
        JSONState js = new JSONState();
        js.setUnquoteKeys(true);
        return widgetsContent.substring(0, widgetsContent.indexOf('{')) + JSONMarshaller.marshal(widgetsJson, js, false, true)
            + widgetsContent.substring(widgetsContent.lastIndexOf('}') + 1);
    }

    public abstract void upgradeWidgetsJS(JSON j);

    /**
     * @return true if the application js file should be upgraded as well.
     */
    public abstract boolean doUpgradeAppJS();

    public PagesManager getPagesManager() {
        return this.pagesManager;
    }

    public void setPagesManager(PagesManager pagesManager) {
        this.pagesManager = pagesManager;
    }
}