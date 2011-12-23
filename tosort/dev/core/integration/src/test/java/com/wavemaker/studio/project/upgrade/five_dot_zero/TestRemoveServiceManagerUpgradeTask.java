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

package com.wavemaker.studio.project.upgrade.five_dot_zero;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;

import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.project.upgrade.five_dot_zero.RemoveServiceManagerUpgradeTask;
import com.wavemaker.tools.service.ConfigurationCompiler;

/**
 * @author small
 * @author Jeremy Grelle
 * 
 */
public class TestRemoveServiceManagerUpgradeTask extends StudioTestCase {

    private final String FILES_PATH = "com/wavemaker/studio/project/upgrade/five_dot_zero/removeservicemanagerupgrade.files/";

    @Test
    public void testRemoveServiceManager() throws Exception {

        makeProject("testRemoveServiceManager", false);
        Project project = ((ProjectManager) getBean("projectManager")).getCurrentProject();

        File managersXml = ConfigurationCompiler.getRuntimeManagersXml(project).getFile();
        File inputManagersXml = new ClassPathResource(this.FILES_PATH + "managers-with-servicesmanager.xml").getFile();
        FileUtils.copyFile(inputManagersXml, managersXml);

        UpgradeTask task = new RemoveServiceManagerUpgradeTask();
        UpgradeInfo info = new UpgradeInfo();
        task.doUpgrade(project, info);
        assertEquals(1, info.getMessages().size());
        assertEquals("Removed servicesManager from " + ConfigurationCompiler.RUNTIME_SERVICES,
            info.getMessages().entrySet().iterator().next().getValue().get(0));

        new ClassPathResource(this.FILES_PATH + "managers-with-expected.xml").getFile();
    }

    @Test
    public void testDontRemoveServiceManager() throws Exception {

        makeProject("testRemoveServiceManager", false);
        Project project = ((ProjectManager) getBean("projectManager")).getCurrentProject();

        File managersXml = ConfigurationCompiler.getRuntimeManagersXml(project).getFile();
        File inputManagersXml = new ClassPathResource(this.FILES_PATH + "managers-without-servicesmanager.xml").getFile();
        FileUtils.copyFile(inputManagersXml, managersXml);

        UpgradeTask task = new RemoveServiceManagerUpgradeTask();
        UpgradeInfo info = new UpgradeInfo();
        task.doUpgrade(project, info);
        assertEquals(0, info.getMessages().size());

        File expected = new ClassPathResource(this.FILES_PATH + "managers-without-expected.xml").getFile();
        assertEquals(FileUtils.readFileToString(expected), FileUtils.readFileToString(managersXml));
    }

    @Test
    public void testUpgradeTaskPresent() throws Exception {

        boolean foundTask = false;

        UpgradeManager um = (UpgradeManager) getBean("upgradeManager");

        outer: for (List<UpgradeTask> uts : um.getUpgrades().values()) {
            for (UpgradeTask ut : uts) {
                if (ut instanceof RemoveServiceManagerUpgradeTask) {
                    foundTask = true;
                    break outer;
                }
            }
        }

        assertTrue(foundTask);
    }
}
