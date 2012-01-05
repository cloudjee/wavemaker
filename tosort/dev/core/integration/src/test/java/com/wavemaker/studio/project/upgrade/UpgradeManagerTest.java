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

package com.wavemaker.studio.project.upgrade;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.io.FileSystemResource;
import org.springframework.test.context.ContextConfiguration;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * @author small
 * @author Jeremy Grelle
 * 
 */
@ContextConfiguration(locations = "/com/wavemaker/studio/project/upgrade/test-upgrademanager.xml")
public class TestUpgradeManager extends StudioTestCase {

    private Double oldStudioVersion = null;

    @Before
    @Override
    public void setUp() throws Exception {

        this.oldStudioVersion = UpgradeManager.getStudioVersion();
        super.setUp();
    }

    @After
    @Override
    public void tearDown() throws Exception {

        UpgradeManager.setStudioVersion(this.oldStudioVersion);
        super.tearDown();
    }

    @Test
    public void testMaxVersionNumber() {

        UpgradeManager um = (UpgradeManager) getApplicationContext().getBean("upgradeManager");
        assertEquals(0.2, um.getCurrentVersion(), 0);
    }

    /**
     * Checks that the 0.0 UpgradeTask isn't called, that 0.1 is called before 0.2, and that the tasks are called in
     * their list order. Also, test the format of the output.
     */
    @Test
    public void testUpgrade() throws Exception {

        UpgradeManager um = (UpgradeManager) getApplicationContext().getBean("upgradeManager");
        ProjectManager pm = (ProjectManager) getApplicationContext().getBean("projectManager");

        File temp = IOUtils.createTempDirectory();

        try {
            makeProject("testUpgrade");
            Project p = pm.getCurrentProject();
            File projectRoot = p.getProjectRoot().getFile();
            p.setProjectVersion(0.0);

            File classesDir = new File(p.getWebInf().getFile(), ProjectConstants.CLASSES_DIR);
            p.getWebAppRoot().getFile().mkdir();
            p.getWebInf().getFile().mkdir();
            classesDir.mkdir();
            assertTrue(classesDir.exists());
            File libDir = p.getWebInfLib().getFile();
            libDir.mkdir();
            IOUtils.touch(new File(classesDir, "foo.txt"));
            IOUtils.touch(new File(libDir, "foo.jar"));

            assertEquals(0.0, p.getProjectVersion(), 0);

            UpgradeInfo output = um.doUpgrades(p);

            assertEquals(0.2, p.getProjectVersion(), 0);

            File versionFile_0_0 = new File(projectRoot, "0.0");
            File versionFile_0_1 = new File(projectRoot, "0.1");
            File versionFile_0_2 = new File(projectRoot, "0.2");
            assertFalse(versionFile_0_0.exists());
            assertTrue(versionFile_0_1.exists());
            assertTrue(versionFile_0_2.exists());

            Map<String, List<String>> messages = output.getMessages();
            assertEquals(3, messages.size());

            List<String> messageList = messages.get("0.1");
            assertEquals(2, messageList.size());
            assertEquals("FileCreationUpgradeTask: 0.1", messageList.get(0));
            assertEquals("CheckFileCreationTask_0_1\n0_1 second line", messageList.get(1));

            messageList = messages.get("0.11");
            assertEquals(1, messageList.size());
            assertEquals("CheckFileCreationTask_0_1_1", messageList.get(0));

            messageList = messages.get("0.2");
            assertEquals(1, messageList.size());
            assertEquals("FileCreationUpgradeTask: 0.2", messageList.get(0));

            assertTrue(output.getBackupExportFile().exists());
            assertFalse(libDir.exists());
            assertFalse(classesDir.exists());
        } finally {
            FileUtils.forceDelete(temp);
        }
    }

    @Test
    public void testNewerProject() throws Exception {

        UpgradeManager um = (UpgradeManager) getApplicationContext().getBean("upgradeManager");

        File temp = IOUtils.createTempDirectory();

        try {
            File projectRoot = new File(temp, "foo");
            projectRoot.mkdir();

            Project p = new Project(new FileSystemResource(projectRoot.getAbsolutePath() + "/"), new LocalStudioConfiguration());
            assertEquals(0.0, p.getProjectVersion(), 0);

            p.setProjectVersion(1.0);

            try {
                um.doUpgrades(p);
                fail("expected exception");
            } catch (WMRuntimeException e) {
                assertEquals(MessageResource.PROJECT_NEWER_THAN_STUDIO.getId(), e.getMessageId());
            }
        } finally {
            FileUtils.forceDelete(temp);
        }
    }

    public static class CheckFileCreationTask_0_1_1 implements UpgradeTask {

        @Override
        public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

            try {
                File versionFile_0_1 = new File(project.getProjectRoot().getFile(), "0.1");
                File versionFile_0_2 = new File(project.getProjectRoot().getFile(), "0.2");

                if (!versionFile_0_1.exists()) {
                    throw new WMRuntimeException("versionFile 0_1 DNE: " + versionFile_0_1);
                }
                if (versionFile_0_2.exists()) {
                    throw new WMRuntimeException("versionFile 0_2 E: " + versionFile_0_2);
                }

                upgradeInfo.addMessage("CheckFileCreationTask_0_1_1");
            } catch (IOException e) {
                throw new WMRuntimeException(e);
            }
        }
    }

    public static class CheckFileCreationTask_0_1 implements UpgradeTask {

        @Override
        public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

            try {
                File versionFile_0_1 = new File(project.getProjectRoot().getFile(), "0.1");
                File versionFile_0_2 = new File(project.getProjectRoot().getFile(), "0.2");

                if (!versionFile_0_1.exists()) {
                    throw new WMRuntimeException("versionFile 0_1 DNE: " + versionFile_0_1);
                }
                if (versionFile_0_2.exists()) {
                    throw new WMRuntimeException("versionFile 0_2 E: " + versionFile_0_2);
                }

                upgradeInfo.addMessage("CheckFileCreationTask_0_1\n0_1 second line");
            } catch (IOException e) {
                throw new WMRuntimeException(e);
            }
        }
    }

    public static class FileCreationUpgradeTask implements UpgradeTask {

        @Override
        public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

            try {
                if (project.getWebInfLib().exists()) {
                    throw new RuntimeException("found existing lib dir: " + project.getWebInfLib());
                }

                File versionFile = new File(project.getProjectRoot().getFile(), getVersion());

                if (versionFile.exists()) {
                    throw new RuntimeException("found existing file: " + versionFile + ", version " + getVersion());
                }

                versionFile.mkdir();

                upgradeInfo.addMessage("FileCreationUpgradeTask: " + getVersion());
            } catch (IOException e) {
                throw new WMRuntimeException(e);
            }
        }

        private String version;

        public String getVersion() {
            return this.version;
        }

        public void setVersion(String version) {
            this.version = version;
        }
    }

    public static class DoNothingUpgradeTask implements UpgradeTask {

        @Override
        public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
            // do nothing
        }
    }
}