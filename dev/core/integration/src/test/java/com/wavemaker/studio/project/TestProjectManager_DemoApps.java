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
import java.util.SortedSet;

import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioConfiguration;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestProjectManager_DemoApps extends StudioTestCase {
    private static String PROJECT_TYPE = System.getProperty("test.project.type");
    
    ProjectManager pm = null;
    File demoDir = null;
    
    String demoPA;
    String demoPB;
    File demoPAF;
    File demoPBF;
    
    @Before
    @Override
    public void setUp() throws Exception {
        
        super.setUp();
        
        pm = (ProjectManager) getBean("projectManager");
        
        StudioConfiguration sc = (StudioConfiguration) getBean("studioConfiguration");
        demoDir = IOUtils.createTempDirectory();
        sc.setTestDemoDir(demoDir);
        
        // make some demo apps
        
        demoPA = "demoPA";
        demoPB = "demoPB";
        demoPAF = new File(demoDir, demoPA);
        demoPBF = new File(demoDir, demoPB);
        demoPAF.mkdir();
        demoPBF.mkdir();
    }
    
    @After
    @Override
    public void tearDown() throws Exception {
        
        StudioConfiguration sc =
            (StudioConfiguration) getBean("studioConfiguration");
        sc.setTestDemoDir(null);
        
        FileUtils.forceDelete(demoDir);
    }

    @Test public void testListDemos() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {        
        
        String regA = "testListProjects_regA";
        String regB = "testListProjects_regB";
        
        makeProject(regA);
        makeProject(regB);
        
        SortedSet<String> projects = pm.listProjects("");
        assertEquals(4, projects.size());
        assertTrue(projects.contains(demoPA));
        assertTrue(projects.contains(demoPB));
        assertTrue(projects.contains(regA));
        assertTrue(projects.contains(regB));
	}
    }
    
    @Test public void testNewProjectConflict() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {        
        
        boolean gotException = false;
        try {
            pm.newProject(demoPA, true);
        } catch (WMRuntimeException e) {
            gotException = true;
            assertTrue(e.getMessage().endsWith(
                    "conflicts with existing project or demo"));
        }
        assertTrue(gotException);
	}
    }
    
    @Test public void testOpenDemos() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {        
        
        String regA = "testOpenProjects_regA";
        String regB = "testOpenProjects_regB";
        
        makeProject(regA);
        makeProject(regB);
        
        pm.openProject(demoPA);
        assertEquals(demoPAF, pm.getCurrentProject().getProjectRoot());
        pm.openProject(demoPB);
        assertEquals(demoPBF, pm.getCurrentProject().getProjectRoot());
        
        pm.openProject(regA);
        assertEquals(pm.getProjectDir(regA, true),
                pm.getCurrentProject().getProjectRoot());
        pm.openProject(regB);
        assertEquals(pm.getProjectDir(regB, true),
                pm.getCurrentProject().getProjectRoot());
	}
    }
    
    @Test public void testDeleteDemos() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {        
        
        assertTrue(demoPAF.exists());
        pm.deleteProject(demoPA);
        assertFalse(demoPAF.exists());
	}
    }
}
