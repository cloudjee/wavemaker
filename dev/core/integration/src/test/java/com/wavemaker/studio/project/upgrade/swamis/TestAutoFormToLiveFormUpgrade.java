/*
 * Copyright (C) 2008 WaveMaker Software, Inc.
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
package com.wavemaker.studio.project.upgrade.swamis;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.junit.Test;

import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.PagesManager;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.project.upgrade.swamis.AutoFormToLiveFormUpgrade;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestAutoFormToLiveFormUpgrade extends StudioTestCase {

    @Test public void testUpgrade() throws Exception {

        makeProject("TestAutoFormToLiveFormUpgrade-TestUpgrade", false);

        ProjectManager pm = (ProjectManager) getBean("projectManager");
        Project p = pm.getCurrentProject();

        File pagesdir = new File(p.getWebAppRoot(), ProjectConstants.PAGES_DIR);
        pagesdir.mkdir();
        File mainPageDir = new File(pagesdir, "Main");
        mainPageDir.mkdir();
        File mainWidgetsFile = new File(pm.getCurrentProject().getWebAppRoot(),
                "pages/Main/Main.widgets.js");
        FileUtils
                .writeStringToFile(
                        mainWidgetsFile,
                        "Main.widgets = {\n"
                                + "    layoutBox1: [\"turbo.Layout\", {box: \"v\", size: 1, sizeUnits: \"flex\"}, {}, {\n"
                                + "        autoForm1: [\"wm.AutoForm\", {box: \"v\", height: \"248px\"}, {}]\n"
                                + "    }]\n" + "}\n");
        assertTrue(mainWidgetsFile.exists());

        p.setProjectVersion(0.23);

        AutoFormToLiveFormUpgrade upgrade = new AutoFormToLiveFormUpgrade();
        UpgradeInfo ui = new UpgradeInfo();
        upgrade.setPagesManager((PagesManager)getBean("pagesManager"));
        upgrade.doUpgrade(p, ui);

        assertEquals(
                "Main.widgets = {\n"
                        + "    layoutBox1: [\"turbo.Layout\", {box: \"v\", size: 1, sizeUnits: \"flex\"}, {}, {\n"
                        + "        autoForm1: [\"wm.LiveForm\", {box: \"v\", height: \"248px\"}, {}]\n"
                        + "    }]\n" + "}\n",
                        FileUtils.readFileToString(mainWidgetsFile));
    }
    
    @Test public void testUpgradeTaskPresent() throws Exception {
        
        boolean foundTask = false;
        
        UpgradeManager um = (UpgradeManager) getBean("upgradeManager");
        
        outer: for (List<UpgradeTask> uts : um.getUpgrades().values()) {
            for (UpgradeTask ut : uts) {
                if (ut instanceof AutoFormToLiveFormUpgrade) {
                    foundTask = true;
                    break outer;
                }
            }
        }
        
        assertTrue(foundTask);
    }
}