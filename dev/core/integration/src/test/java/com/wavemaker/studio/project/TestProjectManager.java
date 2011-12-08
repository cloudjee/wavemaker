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

package com.wavemaker.studio.project;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.util.Arrays;
import java.util.SortedSet;
import java.util.TreeSet;

import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.AbstractDeploymentManager;
import com.wavemaker.tools.project.LocalDeploymentManager;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;

/**
 * @author small
 * @author Jeremy Grelle
 * 
 */
public class TestProjectManager extends StudioTestCase {

    private File tempDemoDir;

    @Before
    @Override
    public void setUp() throws Exception {

        super.setUp();

        // disable the demo dirs
        this.tempDemoDir = IOUtils.createTempDirectory();
        LocalStudioConfiguration sc = (LocalStudioConfiguration) getBean("studioConfiguration");
        sc.setTestDemoDir(this.tempDemoDir);
    }

    @After
    @Override
    public void tearDown() throws Exception {

        super.tearDown();

        LocalStudioConfiguration sc = (LocalStudioConfiguration) getBean("studioConfiguration");
        sc.setTestDemoDir(null);

        FileUtils.forceDelete(this.tempDemoDir);
    }

    @Test
    public void testNewProject() throws Exception {

        File expected = new File(new File(getTestWaveMakerHome(), LocalStudioConfiguration.PROJECTS_DIR), "testNewProject");
        assertTrue(!expected.exists());
        makeProject("testNewProject");
        assertTrue(expected.exists());
    }

    @Test
    public void testListProjects() throws Exception {

        ProjectManager pm = (ProjectManager) getBean("projectManager");

        SortedSet<String> projectNames = new TreeSet<String>(Arrays.asList(new String[] { "testListProjects1", "testListProjects2" }));
        File badProjPath = new File(getTestWaveMakerHome(), "bad project name");
        badProjPath.mkdir();

        for (String projectName : projectNames) {
            makeProject(projectName);
        }

        SortedSet<String> list = pm.listProjects("");

        assertEquals(projectNames, list);
    }

    @Test
    public void testListProjectsDNE() throws Exception {

        // projectManager requires a session for the aop:scoped-proxy
        setRequestAttributes(new MockHttpServletRequest());
        ProjectManager pm = (ProjectManager) getBean("projectManager");
        pm.getStudioConfiguration().deleteFile(pm.getStudioConfiguration().getProjectsDir());
        assertEquals(0, pm.listProjects("").size());
    }

    @Test
    public void testProjectCopy() throws Exception {

        ProjectManager pm = (ProjectManager) getBean("projectManager");
        String projectA = "testProjectCopy_projectA";
        String projectB = "testProjectCopy_projectB";

        makeProject(projectA);
        File projectAF = pm.getCurrentProject().getProjectRoot().getFile();
        File projectBF = new File(projectAF.getParentFile(), projectB);
        assertTrue(projectAF.exists());
        assertFalse(projectBF.exists());

        // set up project A
        File projectA_TXml = new File(projectAF, projectA + ".xml");
        FileUtils.writeStringToFile(projectA_TXml, "asdf");

        File inIndexA = new ClassPathResource("com/wavemaker/tools/project/expectedProjectA_index.html").getFile();
        File outIndexA = new File(projectAF, ProjectConstants.WEB_DIR + "/index.html");
        FileUtils.copyFile(inIndexA, outIndexA);

        File inJSA = new ClassPathResource("com/wavemaker/tools/project/expectedProjectA_" + projectA + ".js").getFile();
        File outJSA = new File(projectAF, ProjectConstants.WEB_DIR + "/" + projectA + ".js");
        FileUtils.copyFile(inJSA, outJSA);

        File projectA_FooF = new File(projectAF, "bla.txt");
        File projectB_FooF = new File(projectBF, "bla.txt");
        FileUtils.writeStringToFile(projectA_FooF, "abc");

        // copy the project
        pm.copyProject(projectA, projectB);
        assertTrue(projectBF.exists());
        assertEquals(projectAF, pm.getCurrentProject().getProjectRoot().getFile());
        assertTrue(projectB_FooF.exists());
        assertEquals(FileUtils.readFileToString(projectA_FooF), FileUtils.readFileToString(projectB_FooF));

        // verify that files in projectB have been changed
        assertTrue(!new File(projectBF, projectA + ".xml").exists());

        File expectedIndexB = new ClassPathResource("com/wavemaker/tools/project/expectedProjectB_index.html").getFile();
        File expectedJSB = new ClassPathResource("com/wavemaker/tools/project/expectedProjectB_" + projectB + ".js").getFile();
        File actualIndexB = new File(projectBF, ProjectConstants.WEB_DIR + "/index.html");
        File actualJSB = new File(projectBF, ProjectConstants.WEB_DIR + "/" + projectB + ".js");
        File nonActualJSB = new File(projectBF, ProjectConstants.WEB_DIR + "/" + projectA + ".js");

        assertTrue(actualIndexB.exists());
        assertTrue(actualJSB.exists());
        assertTrue(!nonActualJSB.exists());

        assertEquals(FileUtils.readFileToString(expectedIndexB), FileUtils.readFileToString(actualIndexB));
        assertEquals(FileUtils.readFileToString(expectedJSB), FileUtils.readFileToString(actualJSB));
    }

    @Test
    public void testCheckProject() throws Exception {

        // projectManager requires a session for the aop:scoped-proxy
        setRequestAttributes(new MockHttpServletRequest());
        ProjectManager pm = (ProjectManager) getBean("projectManager");
        boolean gotException;

        pm.checkNewProject("foo");

        gotException = false;
        try {
            pm.checkNewProject(".foo");
        } catch (WMRuntimeException e) {
            gotException = true;
        }
        assertTrue(gotException);
    }

    // MAV-103
    @Test
    public void testProjectSession() throws Exception {

        ProjectManager pm = (ProjectManager) getBean("projectManager");

        makeProject("foo");
        File projectRoot = pm.getCurrentProject().getProjectRoot().getFile();
        File expected = new File(projectRoot, "writefile.data");
        makeProject("bar");
        pm.closeProject();

        MockHttpServletRequest mhr = new MockHttpServletRequest("POST", "/" + "studioService.json");
        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        MockHttpSession session = new MockHttpSession();
        session.setAttribute(ProjectManager.OPEN_PROJECT_SESSION_NAME, "foo");
        mhr.setSession(session);
        String jsonString = "{\"params\": [\"" + expected.getName() + "\", \"foo\"], \"method\": \"writeFile\", \"id\": 1}";
        mhr.setContent(jsonString.getBytes());

        invokeService(mhr, mhresp);

        assertTrue(expected.exists());
    }

    @Test
    public void testProjectCopy_ignore_SVN_Export_Dist() throws Exception {

        ProjectManager pm = (ProjectManager) getBean("projectManager");

        String projectA = "testProjectCopy_projectA";
        String projectB = "testProjectCopy_projectB";

        makeProject(projectA);

        File sourceSVNDir = new File(pm.getCurrentProject().getProjectRoot().getFile(), ".svn");
        File sourceExportDir = new File(pm.getCurrentProject().getProjectRoot().getFile(), AbstractDeploymentManager.EXPORT_DIR_DEFAULT);
        File sourceDistDir = new File(pm.getCurrentProject().getProjectRoot().getFile(), LocalDeploymentManager.DIST_DIR_DEFAULT);

        sourceSVNDir.mkdir();
        sourceDistDir.mkdir();
        sourceExportDir.mkdir();

        pm.copyProject(projectA, projectB);

        File destSVNDir = new File(pm.getProjectDir(projectB, false).getFile(), ".svn");
        File destExportDir = new File(pm.getProjectDir(projectB, false).getFile(), AbstractDeploymentManager.EXPORT_DIR_DEFAULT);
        File destDistDir = new File(pm.getProjectDir(projectB, false).getFile(), LocalDeploymentManager.DIST_DIR_DEFAULT);

        assertFalse(destSVNDir.exists());
        assertFalse(destExportDir.exists());
        assertFalse(destDistDir.exists());
    }

    // MAV-1059
    @Test
    public void testSessionClosed() throws Exception {

        ProjectManager pm = (ProjectManager) getBean("projectManager");

        makeProject("foo");
        File projectRoot = pm.getCurrentProject().getProjectRoot().getFile();
        File expected = new File(projectRoot, "writefile.data");

        MockHttpServletRequest mhr = new MockHttpServletRequest("POST", "/" + "studioService.json");
        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        MockHttpSession session = new MockHttpSession();
        mhr.setSession(session);
        String jsonString = "{\"params\": [\"" + expected.getName() + "\", \"foo\"], \"method\": \"writeFile\", \"id\": 1}";
        mhr.setContent(jsonString.getBytes());

        invokeService(mhr, mhresp);

        String result = mhresp.getContentAsString();
        assertTrue(result, result.contains("error"));
        assertTrue(result, result.contains("session expired or invalid session"));
    }
}
