/*
 * Copyright (C) 2009 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.wavemaker.studio.project.upgrade;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.upgrade.RemoveObsoleteFilesUpgradeTask;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestRemoveObsoleteFilesUpgradeTask extends StudioTestCase {
    
    public void testRemoveConfigIndex() throws Exception {

        String projectName = "testOutOfOrderUpgrade_Autosize";
        
        makeProject(projectName, false);
        ProjectManager pm = (ProjectManager) getBean("projectManager");
        Project project = pm.getCurrentProject();

        File webapproot = new File(project.getProjectRoot(), "webapproot");
        assertTrue(webapproot.exists());
        File indexhtml = new File(webapproot, "index.html");
        File configjs = new File(webapproot, "config.js");
        IOUtils.touch(indexhtml);
        IOUtils.touch(configjs);
        assertTrue(indexhtml.exists());
        assertTrue(configjs.exists());
        
        RemoveObsoleteFilesUpgradeTask ut = new RemoveObsoleteFilesUpgradeTask();
        ut.setFiles(new ArrayList<String>());
        ut.getFiles().add("webapproot/config.js");
        ut.getFiles().add("webapproot/index.html");
        UpgradeInfo info = new UpgradeInfo();
        ut.doUpgrade(project, info);
        
        assertFalse(indexhtml.exists());
        assertFalse(configjs.exists());
    }
    
    public void testUpgradeTaskPresent() throws Exception {
        
        boolean foundTask = false;
        
        UpgradeManager um = (UpgradeManager) getBean("upgradeManager");
        
        outer: for (List<UpgradeTask> uts : um.getUpgrades().values()) {
            for (UpgradeTask ut : uts) {
                if (ut instanceof RemoveObsoleteFilesUpgradeTask) {
                    foundTask = true;
                    break outer;
                }
            }
        }
        
        assertTrue(foundTask);
    }
}