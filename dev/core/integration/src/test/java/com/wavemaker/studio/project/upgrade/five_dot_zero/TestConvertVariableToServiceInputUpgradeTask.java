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
package com.wavemaker.studio.project.upgrade.five_dot_zero;

import static org.junit.Assert.*;

import java.io.File;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;

import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.PagesManager;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.project.upgrade.five_dot_zero.ConvertVariableToServiceInputUpgradeTask;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestConvertVariableToServiceInputUpgradeTask extends StudioTestCase {

    @Test public void testBasicUpgrade() throws Exception {

        String projectName = "WMAPP_FinancialServices";
        
        makeProject(projectName, false);
        ProjectManager pm = (ProjectManager) getBean("projectManager");
        Project project = pm.getCurrentProject();

        File webapproot = new File(project.getProjectRoot(), "webapproot");
        assertTrue(webapproot.exists());
        File pagesdir = new File(webapproot, "pages");
        pagesdir.mkdir();

        File varFiles = (new ClassPathResource("com/wavemaker/studio/project/upgrade/five_dot_zero/convertvariabletoserviceinput.files")).getFile();
        File inputMain = new File(varFiles, "input/MainPage");
        assertTrue(inputMain.exists());

        File main = new File(pagesdir, "MainPage");
        FileUtils.copyDirectory(inputMain, main);
        
        
        File inputApp = new File(varFiles, "input/app/WMAPP_FinancialServices.js");
        File app = new File(new File(project.getProjectRoot(), "webapproot"),
                "WMAPP_FinancialServices.js");
        FileUtils.copyFile(inputApp, app);
        

        ConvertVariableToServiceInputUpgradeTask ut = new ConvertVariableToServiceInputUpgradeTask();
        ut.setPagesManager((PagesManager)getBean("pagesManager"));
        UpgradeInfo info = new UpgradeInfo();
        ut.doUpgrade(project, info);

        File expectedMain = new File(varFiles, "expected/MainPage");
        assertEquals(1, expectedMain.listFiles().length);
        boolean gotWidgetsJS = false;
        for (File file: expectedMain.listFiles()) {
            File inputFile = new File(main, file.getName());
            if (inputFile.getName().endsWith(".widgets.js")) {
                gotWidgetsJS = true;
            }
            
            assertEquals(StringUtils.deleteWhitespace(FileUtils.readFileToString(file)),
                    StringUtils.deleteWhitespace(FileUtils.readFileToString(inputFile)));
        }
        assertTrue(gotWidgetsJS);
        
        File expectedApp = new File(varFiles, "expected/app/WMAPP_FinancialServices.js");
        assertEquals(StringUtils.deleteWhitespace(FileUtils.readFileToString(expectedApp)),
                StringUtils.deleteWhitespace(FileUtils.readFileToString(app)));
    }    

    @Test public void testUpgradeTaskPresent() throws Exception {
        
        boolean foundTask = false;
        
        UpgradeManager um = (UpgradeManager) getBean("upgradeManager");
        
        outer: for (List<UpgradeTask> uts : um.getUpgrades().values()) {
            for (UpgradeTask ut : uts) {
                if (ut instanceof ConvertVariableToServiceInputUpgradeTask) {
                    foundTask = true;
                    break outer;
                }
            }
        }
        
        assertTrue(foundTask);
    }
}