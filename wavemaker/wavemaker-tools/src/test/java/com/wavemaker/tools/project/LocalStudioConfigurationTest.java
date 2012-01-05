/*
 * Copyright (C) 2007-2008 WaveMaker Software, Inc.
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

package com.wavemaker.tools.project;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockServletContext;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.tools.config.ConfigurationStore;

/**
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class LocalStudioConfigurationTest extends WMTestCase {

    private static String PROJECT_TYPE = System.getProperty("test.project.type");

    private final MockServletContext servletContext = new MockServletContext("classpath:/test-studio-root/");

    public void testOverrideWMHome() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {
            String oldWMHome = System.getProperty(LocalStudioFileSystem.WMHOME_PROP_KEY, null);

            try {
                String newWMHome = "foo";

                System.setProperty(LocalStudioFileSystem.WMHOME_PROP_KEY, "/" + newWMHome);

                StudioFileSystem fileSystem = new LocalStudioFileSystem();
                Resource wmHome = fileSystem.getWaveMakerHome();

                assertEquals(newWMHome, wmHome.getFilename());

            } finally {
                if (oldWMHome == null) {
                    Properties props = System.getProperties();
                    props.remove(LocalStudioFileSystem.WMHOME_PROP_KEY);
                    System.setProperties(props);
                } else {
                    System.setProperty(LocalStudioFileSystem.WMHOME_PROP_KEY, oldWMHome);
                }
            }
        }
    }

    public void testWMHomeDirCreation_File() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {
            String oldPref = ConfigurationStore.getPreference(LocalStudioConfiguration.class, LocalStudioFileSystem.WMHOME_KEY, null);

            try {
                File tempDir = null;

                try {
                    tempDir = IOUtils.createTempDirectory();
                    IOUtils.deleteRecursive(tempDir);

                    assertTrue(!tempDir.exists());

                    LocalStudioFileSystem.setWaveMakerHome(new FileSystemResource(tempDir));
                    assertTrue(tempDir.exists());
                } finally {
                    if (tempDir != null && tempDir.exists()) {
                        IOUtils.deleteRecursive(tempDir);
                    }
                }
            } finally {
                if (oldPref == null) {
                    ConfigurationStore.removePreference(LocalStudioConfiguration.class, LocalStudioFileSystem.WMHOME_KEY);
                } else {
                    LocalStudioFileSystem.setWaveMakerHome(new FileSystemResource(oldPref));
                }
            }
        }
    }

    public void testCommonDirCreation() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {
            File tempDir = null;

            try {
                tempDir = IOUtils.createTempDirectory();
                File tempProjectsDir = new File(tempDir, AbstractStudioFileSystem.PROJECTS_DIR);

                assertTrue(!tempProjectsDir.exists());

                LocalStudioFileSystem sf = new LocalStudioFileSystem();
                sf.setTestWaveMakerHome(tempDir);
                sf.setServletContext(this.servletContext);

                assertTrue(sf.getProjectsDir().exists());
                assertTrue("expected failure in eclipse: expected dir: " + sf.getCommonDir() + " DNE", sf.getCommonDir().exists());

                Resource commonSvn = sf.getCommonDir().createRelative(".svn/");
                assertFalse(commonSvn.exists());
            } finally {
                if (tempDir != null && tempDir.exists()) {
                    IOUtils.deleteRecursive(tempDir);
                }
            }
        }
    }

    public void testGetStudioWebAppRootFile() throws Exception {

        LocalStudioFileSystem sf = new LocalStudioFileSystem();
        sf.setServletContext(this.servletContext);
        Resource studioWebAppRootFile = sf.getStudioWebAppRoot();
        assertTrue(studioWebAppRootFile.exists());
        Resource studioWebInfFile = studioWebAppRootFile.createRelative("WEB-INF/");
        assertTrue(studioWebInfFile.exists());
        Resource webXmlFile = studioWebInfFile.createRelative(ProjectConstants.WEB_XML);
        assertTrue(webXmlFile.exists());
    }

    public void testDefaultStudioHome() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {
            String oldStudioHome = ConfigurationStore.getPreference(LocalStudioConfiguration.class, LocalStudioFileSystem.WMHOME_KEY, null);
            StudioFileSystem sf = new LocalStudioFileSystem();

            try {
                ConfigurationStore.removePreference(LocalStudioConfiguration.class, LocalStudioFileSystem.WMHOME_KEY);

                Resource home = sf.getWaveMakerHome();
                assertTrue("we expected the parent of the home to exist; home: " + home, home.getFile().getParentFile().exists());
                assertEquals("unexpected ending of home path: " + home, home.getFilename(), "WaveMaker");
                assertTrue(home.exists());
            } finally {
                if (oldStudioHome != null) {
                    LocalStudioFileSystem.setWaveMakerHome(new FileSystemResource(oldStudioHome));
                }
            }
        }
    }

    public void testCommonDir() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {
            File tempDir = null;
            try {
                tempDir = IOUtils.createTempDirectory();
                File tempProjectsDir = new File(tempDir, AbstractStudioFileSystem.PROJECTS_DIR);

                assertTrue(!tempProjectsDir.exists());

                LocalStudioFileSystem sc = new LocalStudioFileSystem();
                sc.setTestWaveMakerHome(tempDir);
                sc.setServletContext(this.servletContext);
                Resource projects = sc.getProjectsDir();
                Resource common = sc.getCommonDir();

                assertEquals(projects.getFile().getParentFile(), common.getFile().getParentFile());
            } finally {
                if (tempDir != null && tempDir.exists()) {
                    IOUtils.deleteRecursive(tempDir);
                }
            }
        }
    }

    // MAV-1989
    public void testCommonDirCreation_Threads() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {
            File tempDir = null;

            try {
                tempDir = IOUtils.createTempDirectory();
                File tempProjectsDir = new File(tempDir, AbstractStudioFileSystem.PROJECTS_DIR);

                assertTrue(!tempProjectsDir.exists());

                LocalStudioFileSystem sf = new LocalStudioFileSystem();
                sf.setTestWaveMakerHome(tempDir);
                sf.setServletContext(this.servletContext);

                Thread[] threads = new Thread[100];
                for (int i = 0; i < threads.length; i++) {
                    threads[i] = new CommonDirThread(i, sf);
                }

                for (int i = 0; i < threads.length; i++) {
                    threads[i].start();
                }

                for (int i = 0; i < threads.length; i++) {
                    threads[i].join();
                }

                assertTrue(sf.getProjectsDir().exists());
                assertTrue("expected failure in eclipse: expected dir: " + sf.getCommonDir() + " DNE", sf.getCommonDir().exists());
            } finally {
                if (tempDir != null && tempDir.exists()) {
                    IOUtils.deleteRecursive(tempDir);
                }
            }
        }
    }

    private class CommonDirThread extends Thread {

        int index;

        StudioFileSystem sf;

        public CommonDirThread(int index, StudioFileSystem sc) {

            super();

            this.index = index;
            this.sf = sc;
        }

        @Override
        public void run() {

            Thread.yield();

            try {
                this.sf.getCommonDir();
            } catch (IOException e) {
                throw new RuntimeException("failure on index " + this.index, e);
            }
        }
    }

    public void testGetCurrentVersionInfo() throws Exception {

        VersionInfo vi = LocalStudioConfiguration.getCurrentVersionInfo();
        assertNotNull(vi);
        assertTrue(vi.getMajor() > 4);
    }

    public void testGetRegisteredVersionInfo() throws Exception {

        VersionInfo vi = LocalStudioConfiguration.getRegisteredVersionInfo();
        assertNotNull(vi);
        assertTrue(vi.getMajor() >= 4);
    }
}
