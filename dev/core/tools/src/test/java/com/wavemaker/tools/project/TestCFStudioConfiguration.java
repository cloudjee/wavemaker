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
import static org.junit.Assert.fail;

import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.mock.web.MockServletContext;
import org.springframework.test.annotation.IfProfileValue;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;

import com.mongodb.gridfs.GridFS;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.io.GFSResource;
import com.wavemaker.common.util.IOUtils;

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

    private GridFS gfs;

    @Autowired
    private SimpleMongoDbFactory mongoFactory;

    @Before
    public void setUp() throws Exception {
        Assert.notNull(this.mongoFactory, "Need a Factory here");
        this.log.info("Connected to: " // ensure mongo is running
            + this.mongoFactory.getDb().getMongo().getAddress().getHost());
        this.gfs = new GridFS(this.mongoFactory.getDb());
    }

    @After
    public void tearDown() throws Exception {
        Assert.notNull(this.mongoFactory, "Need a Factory here");
        this.mongoFactory.getDb().dropDatabase();
    }

    @Test
    public void testCommonDirCreation() throws Exception {
        CFStudioConfiguration sc = new CFStudioConfiguration(this.mongoFactory);
        sc.setServletContext(this.servletContext);

        assertTrue(sc.getProjectsDir().exists());
        assertTrue(sc.getCommonDir().exists());
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
    public void testRename() throws IOException {
        String oldName = "oldFile.txt";
        String oldFilePath = "/old/stuff/";
        String newName = "newFile.txt";
        String newFilePath = "/new/stuff/";

        CFStudioConfiguration sc = new CFStudioConfiguration(this.mongoFactory);

        ClassPathResource testFile = new ClassPathResource("/com/wavemaker/tools/project/MyStuff/FileOne.txt");
        GFSResource oldRes = (GFSResource) sc.getWaveMakerHome().createRelative(oldFilePath + oldName);
        FileCopyUtils.copy(testFile.getInputStream(), sc.getOutputStream(oldRes));
        String oldContents = FileCopyUtils.copyToString(new InputStreamReader(oldRes.getInputStream()));
        GFSResource newRes = (GFSResource) sc.getWaveMakerHome().createRelative(newFilePath + newName);

        sc.rename(oldRes, newRes);
        assertEquals(newName, newRes.getFilename());
        String newContents = FileCopyUtils.copyToString(new InputStreamReader(newRes.getInputStream()));
        assertEquals(oldContents, newContents);
    }

    @Test
    public void testDefaultStudioHome() throws Exception {
        StudioConfiguration sc = new CFStudioConfiguration(this.mongoFactory);
        Resource home = sc.getWaveMakerHome();
        assertTrue("we expected the home to exist; home: " + home, home.exists());
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
    public void testgetOutputStream() throws IOException {
        String fileName = "doofenshmirtz.js";
        String localPath = "/com/wavemaker/tools/project";
        String targetFolderName = "/MyStuff/SubFolderOne/";
        String path = "/test/js/";

        CFStudioConfiguration sc = new CFStudioConfiguration(this.mongoFactory);
        ClassPathResource testFile = new ClassPathResource(localPath + targetFolderName + fileName);
        GFSResource gfsRes = (GFSResource) sc.getWaveMakerHome().createRelative(path + fileName);

        String localContents = FileCopyUtils.copyToString(new InputStreamReader(testFile.getInputStream()));
        FileCopyUtils.copy(testFile.getInputStream(), sc.getOutputStream(gfsRes));
        String gfsResString = FileCopyUtils.copyToString(new InputStreamReader(gfsRes.getInputStream()));
        assertEquals(localContents, gfsResString);
    }

    @Test
    public void testgetOutputStream_InvalidPath() throws IOException {
        String fileName = "doofenshmirtz.js";
        String localPath = "/com/wavemaker/tools/project";
        String targetFolderName = "/MyStuff//SubFolderOne/";
        String path = "/test//invalid/";

        CFStudioConfiguration sc = new CFStudioConfiguration(this.mongoFactory);
        ClassPathResource testFile = new ClassPathResource(localPath + targetFolderName + fileName);
        GFSResource gfsRes = (GFSResource) sc.getWaveMakerHome().createRelative(path + fileName);

        try {
            FileCopyUtils.copy(testFile.getInputStream(), sc.getOutputStream(gfsRes));
            fail("An error should have been thrown.");
        } catch (WMRuntimeException ex) {
            // expected
        }

    }

    @Test
    public void testListChildren() throws Exception {
        String targetFolder = "/temp/testListChildren/";
        String testFolder = "/com/wavemaker/tools/project/MyStuff/";
        List<String> exclusions = new ArrayList<String>();

        ClassPathResource sourceDir = new ClassPathResource(testFolder);
        CFStudioConfiguration sc = new CFStudioConfiguration(this.mongoFactory);

        GFSResource targetDir = (GFSResource) sc.getWaveMakerHome().createRelative(targetFolder);
        sc.copyRecursive(sourceDir, targetDir, exclusions);

        List<Resource> results = sc.listChildren(targetDir);

        assertEquals(4, results.size());
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
