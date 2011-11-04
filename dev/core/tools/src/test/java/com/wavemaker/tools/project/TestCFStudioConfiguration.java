/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.project;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.mock.web.MockServletContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.annotation.IfProfileValue;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;

import com.mongodb.gridfs.GridFS;
import com.wavemaker.common.io.GFSResource;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.tools.config.ConfigurationStore;

/**
 * @author Jeremy Grelle
 * @author Ed Callahan
 */
@ContextConfiguration
@RunWith(SpringJUnit4ClassRunner.class)
@IfProfileValue(name = "spring.profiles", value = "cloud-test")
@TestExecutionListeners({ DependencyInjectionTestExecutionListener.class })
public class TestCFStudioConfiguration {

    private final Log log = LogFactory.getLog(TestCFStudioConfiguration.class);

    private static String PROJECT_TYPE = System.getProperty("test.project.type");

    private final MockServletContext servletContext = new MockServletContext("classpath:/test-studio-root/");

    @Autowired
    private SimpleMongoDbFactory mongoFactory;

    @Before
    public void setUp() throws Exception {
        Assert.notNull(this.mongoFactory, "Need a Factory here");
        this.log.info("Connected to: " // ensure mongo is running
            + this.mongoFactory.getDb().getMongo().getAddress().getHost());
    }

    @After
    public void tearDown() throws Exception {
        Assert.notNull(this.mongoFactory, "Need a Factory here");
        this.mongoFactory.getDb().dropDatabase();
    }

    @Test
    public void testOverrideWMHome() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {
            String oldWMHome = System.getProperty(CFStudioConfiguration.WMHOME_PROP_KEY, null);

            try {
                String newWMHome = "foo";

                System.setProperty(CFStudioConfiguration.WMHOME_PROP_KEY, "/" + newWMHome);

                StudioConfiguration sc = new CFStudioConfiguration(this.mongoFactory);
                Resource wmHome = sc.getWaveMakerHome();

                assertEquals(newWMHome, wmHome.getFilename());
            } finally {
                if (null == oldWMHome) {
                    Properties props = System.getProperties();
                    props.remove(CFStudioConfiguration.WMHOME_PROP_KEY);
                    System.setProperties(props);
                } else {
                    System.setProperty(CFStudioConfiguration.WMHOME_PROP_KEY, oldWMHome);
                }
            }
        }
    }

    @Test
    public void testWMHomeDirCreation_File() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {
            String oldPref = ConfigurationStore.getPreference(CFStudioConfiguration.class, CFStudioConfiguration.WMHOME_KEY, null);

            try {
                File tempDir = null;

                try {
                    tempDir = IOUtils.createTempDirectory();
                    IOUtils.deleteRecursive(tempDir);

                    assertTrue(!tempDir.exists());

                    GFSResource gfsWMHome = new GFSResource(CFStudioConfiguration.getGFS(), tempDir.getPath() + "/");
                    CFStudioConfiguration.setWaveMakerHome(gfsWMHome);

                    assertTrue(gfsWMHome.exists());
                } finally {
                    if (null != tempDir && tempDir.exists()) {
                        IOUtils.deleteRecursive(tempDir);
                    }
                }
            } finally {
                if (null == oldPref) {
                    ConfigurationStore.removePreference(CFStudioConfiguration.class, CFStudioConfiguration.WMHOME_KEY);
                } else {
                    CFStudioConfiguration.setWaveMakerHome(new GFSResource(CFStudioConfiguration.getGFS(), oldPref));
                }
            }
        }
    }

    @Test
    public void testCommonDirCreation() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {
            File tempDir = null;

            try {
                tempDir = IOUtils.createTempDirectory();
                File tempProjectsDir = new File(tempDir, CFStudioConfiguration.PROJECTS_DIR);

                assertTrue(!tempProjectsDir.exists());

                CFStudioConfiguration sc = new CFStudioConfiguration(this.mongoFactory);
                sc.setTestWaveMakerHome(tempDir);
                sc.setServletContext(this.servletContext);

                assertTrue(sc.getProjectsDir().exists());
                assertTrue("expected failure in eclipse: expected dir: " + sc.getCommonDir() + " DNE", sc.getCommonDir().exists());

                Resource commonSvn = sc.getCommonDir().createRelative(".svn/");
                // was assertFalse, but we just created commonSvn, so it exists -EdC
                assertTrue(commonSvn.exists());
            } finally {
                if (null != tempDir && tempDir.exists()) {
                    IOUtils.deleteRecursive(tempDir);
                }
            }
        }
    }

    @Test
    public void testGetStudioWebAppRootFile() throws Exception {
        CFStudioConfiguration sc = new CFStudioConfiguration(this.mongoFactory);
        sc.setServletContext(this.servletContext);
        Resource studioWebAppRootFile = sc.getStudioWebAppRoot();
        assertTrue(studioWebAppRootFile.exists());
        Resource studioWebInfFile = studioWebAppRootFile.createRelative("WEB-INF/");
        assertTrue(studioWebInfFile.exists());
        Resource webXmlFile = studioWebInfFile.createRelative(ProjectConstants.WEB_XML);
        assertTrue(webXmlFile.exists());
    }

    @Test
    public void testRename() {
        String oldName = "oldFile.txt";
        String oldFilePath = "/old/stuff/";
        String newName = "newFile.txt";
        String newFilePath = "/new/stuff";
        String testFolder = "MyStuff/";
        String fOne = "FileOne.txt";
        String fTwo = "FileTwo.txt";

        GFSResource oldRes = new GFSResource(CFStudioConfiguration.getGFS(), getClass().getResourceAsStream(testFolder + fOne), oldName, oldFilePath);
        oldRes.save();
        GFSResource newRes = new GFSResource(CFStudioConfiguration.getGFS(), getClass().getResourceAsStream(testFolder + fTwo), newName, newFilePath);
        newRes.save();

        CFStudioConfiguration sc = new CFStudioConfiguration(this.mongoFactory);
        sc.rename(oldRes, newRes);
        assertEquals(oldRes.getFilename(), newName);
    }

    @Test
    public void testDefaultStudioHome() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {
            String oldStudioHome = ConfigurationStore.getPreference(CFStudioConfiguration.class, CFStudioConfiguration.WMHOME_KEY, null);
            StudioConfiguration sc = new CFStudioConfiguration(this.mongoFactory);

            try {
                ConfigurationStore.removePreference(CFStudioConfiguration.class, CFStudioConfiguration.WMHOME_KEY);

                Resource home = sc.getWaveMakerHome();
                assertTrue("we expected the home to exist; home: " + home, home.exists());
                String homeFolder = ((GFSResource) home).getPath().replace(((GFSResource) home).getParent() + "/", "");
                // Filename is not the path -EdC
                assertEquals("unexpected ending of home path: " + home, homeFolder, "WaveMaker/");
                assertTrue(home.exists());
            } finally {
                if (null != oldStudioHome) {
                    CFStudioConfiguration.setWaveMakerHome(new GFSResource(CFStudioConfiguration.getGFS(), oldStudioHome));
                }
            }
        }
    }

    @Test
    public void testCommonDir() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {
            File tempDir = null;
            try {
                tempDir = IOUtils.createTempDirectory();
                File tempProjectsDir = new File(tempDir, CFStudioConfiguration.PROJECTS_DIR);

                assertTrue(!tempProjectsDir.exists());

                CFStudioConfiguration sc = new CFStudioConfiguration(this.mongoFactory);
                sc.setTestWaveMakerHome(tempDir);
                sc.setServletContext(this.servletContext);
                Resource projects = sc.getProjectsDir();
                Resource common = sc.getCommonDir();

                assertEquals(((GFSResource) projects).getParent(), ((GFSResource) common).getParent());
            } finally {
                if (null != tempDir && tempDir.exists()) {
                    IOUtils.deleteRecursive(tempDir);
                }
            }
        }
    }

    @Test
    public void testgetOutputStream() {
        String fileName = "doofenshmirtz.js";
        String folderName = "MyStuff/SubFolderOne/";
        String buford = "Buford = { 'status': {'crying':'false'}}";
        String path = "/test/js/";

        OutputStream out = null;
        try {
            CFStudioConfiguration sc = new CFStudioConfiguration(this.mongoFactory);
            GridFS myGFS = CFStudioConfiguration.getGFS();
            InputStream fin = getClass().getResourceAsStream(folderName + fileName);
            GFSResource gfsRes = new GFSResource(myGFS, fin, fileName, path);

            byte buf[] = buford.getBytes();
            out = sc.getOutputStream(gfsRes);
            out.write(buf);
            out.close();

            String gfsResString = FileCopyUtils.copyToString(new InputStreamReader(gfsRes.getInputStream()));
            assertEquals(buford, gfsResString);

        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
    }

    @Test
    public void testListChildren() throws Exception {
        String targetFolder = "/temp/testListChildren/";
        String sourceFolder = "/temp/FolderOStuff";
        String testFolder = "MyStuff/";
        String fOne = "FileOne.txt";
        String fTwo = "FileTwo.txt";
        String fThree = "FileThree.txt";
        List<String> exclusions = new ArrayList<String>();

        CFStudioConfiguration sc = new CFStudioConfiguration(this.mongoFactory);
        GridFS myGFS = CFStudioConfiguration.getGFS();

        // Create folder to be copied and list of resources to compare against
        GFSResource sourceDir = new GFSResource(myGFS, sourceFolder);
        List<Resource> control = new ArrayList<Resource>();

        GFSResource fileOne = new GFSResource(myGFS, getClass().getResourceAsStream(testFolder + fOne), fOne, sourceDir.getPath());
        fileOne.save();
        control.add(fileOne);
        GFSResource fileTwo = new GFSResource(myGFS, getClass().getResourceAsStream(testFolder + fTwo), fTwo, sourceDir.getPath());
        fileTwo.save();
        control.add(fileTwo);
        GFSResource fileThree = new GFSResource(myGFS, getClass().getResourceAsStream(testFolder + fThree), fThree, sourceDir.getPath());
        fileThree.save();
        control.add(fileThree);

        GFSResource targetDir = new GFSResource(myGFS, targetFolder);
        sc.copyRecursive(sourceDir, targetDir, exclusions);

        List<Resource> results = sc.listChildren(targetDir);

        assertEquals(control.size(), results.size());
    }

    // MAV-1989
    @Test
    public void testCommonDirCreation_Threads() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {
            File tempDir = null;

            try {
                tempDir = IOUtils.createTempDirectory();
                File tempProjectsDir = new File(tempDir, CFStudioConfiguration.PROJECTS_DIR);

                assertTrue(!tempProjectsDir.exists());

                CFStudioConfiguration sc = new CFStudioConfiguration(this.mongoFactory);
                sc.setTestWaveMakerHome(tempDir);
                sc.setServletContext(this.servletContext);

                Thread[] threads = new Thread[100];
                for (int i = 0; i < threads.length; i++) {
                    threads[i] = new CommonDirThread(i, sc);
                }

                for (int i = 0; i < threads.length; i++) {
                    threads[i].start();
                }

                for (int i = 0; i < threads.length; i++) {
                    threads[i].join();
                }

                assertTrue(sc.getProjectsDir().exists());
                assertTrue("expected failure in eclipse: expected dir: " + sc.getCommonDir() + " DNE", sc.getCommonDir().exists());
            } finally {
                if (null != tempDir && tempDir.exists()) {
                    IOUtils.deleteRecursive(tempDir);
                }
            }
        }
    }

    private class CommonDirThread extends Thread {

        int index;

        StudioConfiguration sc;

        public CommonDirThread(int index, StudioConfiguration sc) {

            super();

            this.index = index;
            this.sc = sc;
        }

        @Override
        public void run() {

            Thread.yield();

            try {
                this.sc.getCommonDir();
            } catch (IOException e) {
                throw new RuntimeException("failure on index " + this.index, e);
            }
        }
    }

    @Test
    public void testGetCurrentVersionInfo() throws Exception {

        VersionInfo vi = CFStudioConfiguration.getCurrentVersionInfo();
        assertNotNull(vi);
        assertTrue(vi.getMajor() > 4);
    }

    @Test
    public void testGetRegisteredVersionInfo() throws Exception {

        VersionInfo vi = CFStudioConfiguration.getRegisteredVersionInfo();
        assertNotNull(vi);
        assertTrue(vi.getMajor() >= 4);
    }

}
