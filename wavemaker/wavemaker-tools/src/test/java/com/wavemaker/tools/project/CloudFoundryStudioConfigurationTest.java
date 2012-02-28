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
public class CloudFoundryStudioConfigurationTest {

    private final Log log = LogFactory.getLog(CloudFoundryStudioConfigurationTest.class);

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
    public void testCommonDirCreation() throws Exception {
        GridFSStudioFileSystem sf = new GridFSStudioFileSystem(this.mongoFactory);
        sf.setServletContext(this.servletContext);

        assertTrue(sf.getProjectsDir().exists());
        assertTrue(sf.getCommonDir().exists());
    }

    @Test
    public void testGetStudioWebAppRootFile() throws Exception {
        GridFSStudioFileSystem sf = new GridFSStudioFileSystem(this.mongoFactory);
        sf.setServletContext(this.servletContext);
        Resource studioWebAppRootFile = sf.getStudioWebAppRoot();
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

        GridFSStudioFileSystem sf = new GridFSStudioFileSystem(this.mongoFactory);

        ClassPathResource testFile = new ClassPathResource("/com/wavemaker/tools/project/MyStuff/FileOne.txt");
        GFSResource oldRes = (GFSResource) sf.getWaveMakerHome().createRelative(oldFilePath + oldName);
        FileCopyUtils.copy(testFile.getInputStream(), sf.getOutputStream(oldRes));
        String oldContents = FileCopyUtils.copyToString(new InputStreamReader(oldRes.getInputStream()));
        GFSResource newRes = (GFSResource) sf.getWaveMakerHome().createRelative(newFilePath + newName);

        sf.rename(oldRes, newRes);
        assertEquals(newName, newRes.getFilename());
        String newContents = FileCopyUtils.copyToString(new InputStreamReader(newRes.getInputStream()));
        assertEquals(oldContents, newContents);
    }

    @Test
    public void testDefaultStudioHome() throws Exception {
        StudioFileSystem sf = new GridFSStudioFileSystem(this.mongoFactory);
        Resource home = sf.getWaveMakerHome();
        assertTrue("we expected the home to exist; home: " + home, home.exists());
    }

    @Test
    public void testCommonDir() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {
            File tempDir = null;
            try {
                tempDir = IOUtils.createTempDirectory();
                File tempProjectsDir = new File(tempDir, CloudFoundryStudioConfiguration.PROJECTS_DIR);

                assertTrue(!tempProjectsDir.exists());

                GridFSStudioFileSystem sf = new GridFSStudioFileSystem(this.mongoFactory);
                sf.setTestWaveMakerHome(tempDir);
                sf.setServletContext(this.servletContext);
                Resource projects = sf.getProjectsDir();
                Resource common = sf.getCommonDir();

                assertEquals(((GFSResource) projects).getParent(), ((GFSResource) common).getParent());
            } finally {
                if (tempDir != null && tempDir.exists()) {
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

        GridFSStudioFileSystem sf = new GridFSStudioFileSystem(this.mongoFactory);
        ClassPathResource testFile = new ClassPathResource(localPath + targetFolderName + fileName);
        GFSResource gfsRes = (GFSResource) sf.getWaveMakerHome().createRelative(path + fileName);

        String localContents = FileCopyUtils.copyToString(new InputStreamReader(testFile.getInputStream()));
        FileCopyUtils.copy(testFile.getInputStream(), sf.getOutputStream(gfsRes));
        String gfsResString = FileCopyUtils.copyToString(new InputStreamReader(gfsRes.getInputStream()));
        assertEquals(localContents, gfsResString);
    }

    @Test
    public void testgetOutputStream_InvalidPath() throws IOException {
        String fileName = "doofenshmirtz.js";
        String localPath = "/com/wavemaker/tools/project";
        String targetFolderName = "/MyStuff//SubFolderOne/";
        String path = "/test//invalid/";

        GridFSStudioFileSystem sf = new GridFSStudioFileSystem(this.mongoFactory);
        ClassPathResource testFile = new ClassPathResource(localPath + targetFolderName + fileName);
        GFSResource gfsRes = (GFSResource) sf.getWaveMakerHome().createRelative(path + fileName);

        try {
            FileCopyUtils.copy(testFile.getInputStream(), sf.getOutputStream(gfsRes));
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
        GridFSStudioFileSystem sf = new GridFSStudioFileSystem(this.mongoFactory);

        GFSResource targetDir = (GFSResource) sf.getWaveMakerHome().createRelative(targetFolder);
        sf.copyRecursive(sourceDir, targetDir, exclusions);

        List<Resource> results = sf.listChildren(targetDir);

        assertEquals(4, results.size());
    }

    @Test
    public void testGetCurrentVersionInfo() throws Exception {

        VersionInfo vi = CloudFoundryStudioConfiguration.getCurrentVersionInfo();
        assertNotNull(vi);
        assertTrue(vi.getMajor() > 4);
    }
}
