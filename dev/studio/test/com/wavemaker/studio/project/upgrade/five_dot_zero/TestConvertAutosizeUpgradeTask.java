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

import java.io.File;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.core.io.ClassPathResource;

import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.PagesManager;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.project.upgrade.five_dot_zero.ConvertAutosizeUpgradeTask;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestConvertAutosizeUpgradeTask extends StudioTestCase {

    public void testUpgradeWidgets() throws Exception {

        ConvertAutosizeUpgradeTask caut = new ConvertAutosizeUpgradeTask();
        JSON j = JSONUnmarshaller.unmarshal("{caption: \"label1\", height: \"15px\", autoSize: true}");
        caut.upgradeWidgetsJS(j);

        assertEquals("{\n\t\"caption\": \"label1\",\n\t\"height\": \"15px\",\n\t\"width\": \"70px\"\n}",
                j.toString());
    }

    public void testUpgradeWidgets_LargerSample() throws Exception {

        ConvertAutosizeUpgradeTask caut = new ConvertAutosizeUpgradeTask();
        JSON j = JSONUnmarshaller.unmarshal("{foo: \"bar\", somethinig: {}, thething: {caption: \"label1\", height: \"15px\", autoSize: true}}");
        caut.upgradeWidgetsJS(j);
        assertEquals("{\n\t\"foo\": \"bar\",\n\t\"somethinig\": {\n\t},\n\t\"thething\": {\n\t\t\"caption\": \"label1\",\n\t\t\"height\": \"15px\",\n\t\t\"width\": \"70px\"\n\t}\n}",
                j.toString());
    }

    public void testBasicUpgrade() throws Exception {

        String projectName = "testBasicUpgrade_Autosize";
        
        makeProject(projectName, false);
        ProjectManager pm = (ProjectManager) getBean("projectManager");
        Project project = pm.getCurrentProject();

        File webapproot = new File(project.getProjectRoot(), "webapproot");
        assertTrue(webapproot.exists());
        File pagesdir = new File(webapproot, "pages");
        pagesdir.mkdir();

        File autosizeFiles = (new ClassPathResource("com/wavemaker/studio/project/upgrade/five_dot_zero/autosize.files")).getFile();
        File inputMain = new File(autosizeFiles, "input/Main");
        assertTrue(inputMain.exists());

        File main = new File(pagesdir, "Main");
        FileUtils.copyDirectory(inputMain, main);

        ConvertAutosizeUpgradeTask ut = new ConvertAutosizeUpgradeTask();
        ut.setPagesManager((PagesManager)getBean("pagesManager"));
        UpgradeInfo info = new UpgradeInfo();
        ut.doUpgrade(project, info);

        File expectedMain = new File(autosizeFiles, "expected/Main");
        assertEquals(4, expectedMain.listFiles().length);
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
    }

    public void testOutOfOrderUpgrade() throws Exception {

        String projectName = "testOutOfOrderUpgrade_Autosize";
        
        makeProject(projectName, false);
        ProjectManager pm = (ProjectManager) getBean("projectManager");
        Project project = pm.getCurrentProject();

        File webapproot = new File(project.getProjectRoot(), "webapproot");
        assertTrue(webapproot.exists());
        File pagesdir = new File(webapproot, "pages");
        pagesdir.mkdir();

        File autosizeFiles = (new ClassPathResource("com/wavemaker/studio/project/upgrade/five_dot_zero/autosize.files")).getFile();
        File inputLogin = new File(autosizeFiles, "input/Login");
        assertTrue(inputLogin.exists());

        File main = new File(pagesdir, "Login");
        FileUtils.copyDirectory(inputLogin, main);

        ConvertAutosizeUpgradeTask ut = new ConvertAutosizeUpgradeTask();
        ut.setPagesManager((PagesManager)getBean("pagesManager"));
        UpgradeInfo info = new UpgradeInfo();
        ut.doUpgrade(project, info);

        File expectedLogin = new File(autosizeFiles, "expected/Login");
        assertEquals(1, expectedLogin.listFiles().length);
        boolean gotWidgetsJS = false;
        for (File file: expectedLogin.listFiles()) {
            File inputFile = new File(main, file.getName());
            if (inputFile.getName().endsWith(".widgets.js")) {
                gotWidgetsJS = true;
            }
            
            assertEquals(StringUtils.deleteWhitespace(FileUtils.readFileToString(file)),
                    StringUtils.deleteWhitespace(FileUtils.readFileToString(inputFile)));
        }
        assertTrue(gotWidgetsJS);
    }
    

    public void testDefaultAutoSizeUpgrade() throws Exception {

        String projectName = "testDefaultAutoSizeUpgrade";
        
        makeProject(projectName, false);
        ProjectManager pm = (ProjectManager) getBean("projectManager");
        Project project = pm.getCurrentProject();

        File webapproot = new File(project.getProjectRoot(), "webapproot");
        assertTrue(webapproot.exists());
        File pagesdir = new File(webapproot, "pages");
        pagesdir.mkdir();

        File autosizeFiles = (new ClassPathResource("com/wavemaker/studio/project/upgrade/five_dot_zero/autosize.files")).getFile();
        File inputLogin = new File(autosizeFiles, "input/DefaultAutosize");
        assertTrue(inputLogin.exists());

        File main = new File(pagesdir, "DefaultAutosize");
        FileUtils.copyDirectory(inputLogin, main);

        ConvertAutosizeUpgradeTask ut = new ConvertAutosizeUpgradeTask();
        ut.setPagesManager((PagesManager)getBean("pagesManager"));
        UpgradeInfo info = new UpgradeInfo();
        ut.doUpgrade(project, info);

        File expectedLogin = new File(autosizeFiles, "expected/DefaultAutosize");
        assertEquals(1, expectedLogin.listFiles().length);
        boolean gotWidgetsJS = false;
        for (File file: expectedLogin.listFiles()) {
            File inputFile = new File(main, file.getName());
            if (inputFile.getName().endsWith(".widgets.js")) {
                gotWidgetsJS = true;
            }
            
            assertEquals(StringUtils.deleteWhitespace(FileUtils.readFileToString(file)),
                    StringUtils.deleteWhitespace(FileUtils.readFileToString(inputFile)));
        }
        assertTrue(gotWidgetsJS);
    }

    public void testUpgradeTaskPresent() throws Exception {
        
        boolean foundTask = false;
        
        UpgradeManager um = (UpgradeManager) getBean("upgradeManager");
        
        outer: for (List<UpgradeTask> uts : um.getUpgrades().values()) {
            for (UpgradeTask ut : uts) {
                if (ut instanceof ConvertAutosizeUpgradeTask) {
                    foundTask = true;
                    break outer;
                }
            }
        }
        
        assertTrue(foundTask);
    }
}