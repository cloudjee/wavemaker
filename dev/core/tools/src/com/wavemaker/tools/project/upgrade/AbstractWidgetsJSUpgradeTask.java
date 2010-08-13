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
package com.wavemaker.tools.project.upgrade;

import java.io.File;
import java.io.IOException;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONMarshaller;
import com.wavemaker.json.JSONState;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.tools.project.PagesManager;
import com.wavemaker.tools.project.Project;

/**
 * Upgrades the contents of the widgets.js for each page in the current project.
 * 
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public abstract class AbstractWidgetsJSUpgradeTask implements UpgradeTask {

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        
        if (null==getPagesManager()) {
            throw new WMRuntimeException("No pagesManager in doUpgrade()");
        }
        
        try {
            for (String page: getPagesManager().listPages()) {
                File pageDir = getPagesManager().getPageDir(
                        project.getProjectName(), page);
                File widgetsJS = new File(pageDir, page+"."+
                        PagesManager.PAGE_WIDGETS);

                if (widgetsJS.exists()) {
                    readAndUpgradeWidgets(project, widgetsJS);
                }
            }
            
            File appJs = new File(project.getWebAppRoot(), project.getProjectName()+".js");
            if (doUpgradeAppJS() && appJs.exists()) {
                readAndUpgradeWidgets(project, appJs);
            }
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }
    
    private void readAndUpgradeWidgets(Project project, File widgetsJS)
            throws IOException {
        
        String contents = project.readFile(widgetsJS);
        
        String jsonString = contents.substring(contents.indexOf('{'),
                contents.lastIndexOf('}')+1);

        JSON j = JSONUnmarshaller.unmarshal(jsonString);
        upgradeWidgetsJS(j);

        JSONState js = new JSONState();
        js.setUnquoteKeys(true);

        String ret = contents.substring(0, contents.indexOf('{')) + 
                JSONMarshaller.marshal(j, js, false, true) +
                contents.substring(contents.lastIndexOf('}')+1);
        project.writeFile(widgetsJS, ret);
    }
    
    public abstract void upgradeWidgetsJS(JSON j);
    
    /**
     * @return true iff the application js file should be upgraded as well.
     */
    public abstract boolean doUpgradeAppJS();
    
    
    
    // bean properties
    private PagesManager pagesManager;

    public PagesManager getPagesManager() {
        return pagesManager;
    }

    public void setPagesManager(PagesManager pagesManager) {
        this.pagesManager = pagesManager;
    }
}