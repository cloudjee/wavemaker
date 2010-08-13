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

import java.io.File;

import java.util.Arrays;
import java.util.SortedSet;
import java.util.TreeSet;

import com.wavemaker.common.WMRuntimeException;

import com.wavemaker.common.util.IOUtils;

import com.wavemaker.studio.infra.StudioTestCase;

import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioConfiguration;

import org.apache.commons.io.FileUtils;

import org.springframework.core.io.ClassPathResource;

import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestProjectManager extends StudioTestCase {

    private File tempDemoDir;
    
    @Override
    public void onSetUp() throws Exception {
        
        super.onSetUp();
        
        // disable the demo dirs
        tempDemoDir = IOUtils.createTempDirectory();
        StudioConfiguration sc = (StudioConfiguration) getBean("studioConfiguration");
        sc.setTestDemoDir(tempDemoDir);
    }
    
    @Override
    public void onTearDown() throws Exception {

        super.onTearDown();

        StudioConfiguration sc = (StudioConfiguration) getBean("studioConfiguration");
        sc.setTestDemoDir(null);
        
        FileUtils.forceDelete(tempDemoDir);
    }
    
    
    
    public void testNewProject() throws Exception {
        
        File expected = new File(new File(getTestWaveMakerHome(),
                StudioConfiguration.PROJECTS_DIR), "testNewProject");
        assertTrue(!expected.exists());
        makeProject("testNewProject");
        assertTrue(expected.exists());
    }
    
    public void testListProjects() throws Exception {
        
        ProjectManager pm = (ProjectManager) getBean("projectManager");
        
        SortedSet<String> projectNames = new TreeSet<String>(Arrays.asList(
                new String[] {"testListProjects1", "testListProjects2"}));
        File badProjPath = new File(getTestWaveMakerHome(), "bad project name");
        badProjPath.mkdir();
        
        for (String projectName: projectNames) {
            makeProject(projectName);
        }
        
        SortedSet<String> list = pm.listProjects("");
        
        assertEquals(projectNames, list);
    }

    public void testListProjectsDNE() throws Exception {

        // projectManager requires a session for the aop:scoped-proxy
        setRequestAttributes(new MockHttpServletRequest());
        ProjectManager pm = (ProjectManager) getBean("projectManager");
        
        IOUtils.deleteRecursive(
                pm.getStudioConfiguration().getProjectsDir());
        assertEquals(0, pm.listProjects("").size());
    }
    
    public void testProjectCopy() throws Exception {
        
        ProjectManager pm = (ProjectManager) getBean("projectManager");
        String projectA = "testProjectCopy_projectA";
        String projectB = "testProjectCopy_projectB";
        
        makeProject(projectA);
        File projectAF = pm.getCurrentProject().getProjectRoot();
        File projectBF = new File(projectAF.getParentFile(), projectB);
        assertTrue(projectAF.exists());
        assertFalse(projectBF.exists());
        
        // set up project A
        File projectA_TXml = new File(projectAF, projectA+".xml");
        FileUtils.writeStringToFile(projectA_TXml, "asdf");
        
        File inIndexA = (new ClassPathResource("com/wavemaker/tools/project/expectedProjectA_index.html")).getFile();
        File outIndexA = new File(projectAF, ProjectConstants.WEB_DIR+"/index.html");
        FileUtils.copyFile(inIndexA, outIndexA);
        
        File inJSA = (new ClassPathResource("com/wavemaker/tools/project/expectedProjectA_"+projectA+".js")).getFile();
        File outJSA = new File(projectAF, ProjectConstants.WEB_DIR+"/"+projectA+".js");
        FileUtils.copyFile(inJSA, outJSA);
        
        File projectA_FooF = new File(projectAF, "bla.txt");
        File projectB_FooF = new File(projectBF, "bla.txt");
        FileUtils.writeStringToFile(projectA_FooF, "abc");
        
        // copy the project
        pm.copyProject(projectA, projectB);
        assertTrue(projectBF.exists());
        assertEquals(projectAF, pm.getCurrentProject().getProjectRoot());
        assertTrue(projectB_FooF.exists());
        assertEquals(FileUtils.readFileToString(projectA_FooF),
                FileUtils.readFileToString(projectB_FooF));
        
        // verify that files in projectB have been changed
        assertTrue(!(new File(projectBF, projectA+".xml").exists()));
        
        File expectedIndexB = (new ClassPathResource("com/wavemaker/tools/project/expectedProjectB_index.html")).getFile();
        File expectedJSB = (new ClassPathResource("com/wavemaker/tools/project/expectedProjectB_"+projectB+".js")).getFile();
        File actualIndexB = new File(projectBF, ProjectConstants.WEB_DIR+"/index.html");
        File actualJSB = new File(projectBF, ProjectConstants.WEB_DIR+"/"+projectB+".js");
        File nonActualJSB = new File(projectBF, ProjectConstants.WEB_DIR+"/"+projectA+".js");
        
        assertTrue(actualIndexB.exists());
        assertTrue(actualJSB.exists());
        assertTrue(!nonActualJSB.exists());
        
        assertEquals(FileUtils.readFileToString(expectedIndexB),
                FileUtils.readFileToString(actualIndexB));
        assertEquals(FileUtils.readFileToString(expectedJSB),
                FileUtils.readFileToString(actualJSB));
    }
    
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
    public void testProjectSession() throws Exception {
        
        ProjectManager pm = (ProjectManager) getBean("projectManager");
        
        makeProject("foo");
        File projectRoot = pm.getCurrentProject().getProjectRoot();
        File expected = new File(projectRoot, "writefile.data");
        makeProject("bar");
        pm.closeProject();
        
        MockHttpServletRequest mhr = new MockHttpServletRequest("POST", "/"
                + "studioService.json");
        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        MockHttpSession session = new MockHttpSession();
        session.setAttribute(ProjectManager.OPEN_PROJECT_SESSION_NAME, "foo");
        mhr.setSession(session);
        String jsonString = "{\"params\": [\""+expected.getName()+"\", \"foo\"], \"method\": \"writeFile\", \"id\": 1}";
        mhr.setContent(jsonString.getBytes());
        
        invokeService(mhr, mhresp);
        
        assertTrue(expected.exists());
    }
    
    public void testProjectCopy_ignore_SVN_Export_Dist() throws Exception {
        
        ProjectManager pm = (ProjectManager) getBean("projectManager");
        
        String projectA = "testProjectCopy_projectA";
        String projectB = "testProjectCopy_projectB";
        
        makeProject(projectA);
        
        File sourceSVNDir = new File(pm.getCurrentProject().getProjectRoot(),
                ".svn");
        File sourceExportDir = new File(pm.getCurrentProject().getProjectRoot(),
                DeploymentManager.EXPORT_DIR_DEFAULT);
        File sourceDistDir = new File(pm.getCurrentProject().getProjectRoot(),
                DeploymentManager.DIST_DIR_DEFAULT);
        
        sourceSVNDir.mkdir();
        sourceDistDir.mkdir();
        sourceExportDir.mkdir();
        
        pm.copyProject(projectA, projectB);
        
        File destSVNDir = new File(pm.getProjectDir(projectB, false), ".svn");
        File destExportDir = new File(pm.getProjectDir(projectB, false),
                DeploymentManager.EXPORT_DIR_DEFAULT);
        File destDistDir = new File(pm.getProjectDir(projectB, false),
                DeploymentManager.DIST_DIR_DEFAULT);
        
        assertFalse(destSVNDir.exists());
        assertFalse(destExportDir.exists());
        assertFalse(destDistDir.exists());
    }
    
    // MAV-1059
    public void testSessionClosed() throws Exception {
        
        ProjectManager pm = (ProjectManager) getBean("projectManager");
        
        makeProject("foo");
        File projectRoot = pm.getCurrentProject().getProjectRoot();
        File expected = new File(projectRoot, "writefile.data");
        
        MockHttpServletRequest mhr = new MockHttpServletRequest("POST", "/"
                + "studioService.json");
        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        MockHttpSession session = new MockHttpSession();
        mhr.setSession(session);
        String jsonString = "{\"params\": [\""+expected.getName()+"\", \"foo\"], \"method\": \"writeFile\", \"id\": 1}";
        mhr.setContent(jsonString.getBytes());
        
        invokeService(mhr, mhresp);
        
        String result = mhresp.getContentAsString();
        assertTrue(result, result.contains("error"));
        assertTrue(result, result.contains("session expired or invalid session"));
    }
}
