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
package com.wavemaker.studio;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.nio.CharBuffer;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.junit.Test;

import com.wavemaker.common.util.CastUtils;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONObject;
import com.wavemaker.studio.StudioService.OpenProjectReturn;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.config.ConfigurationStore;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioConfiguration;

/**
 * @author Matt Small
 * @version $Rev$ - $Date$
 *
 */
public class TestStudioService extends StudioTestCase {
    private static String PROJECT_TYPE = System.getProperty("test.project.type");
    
    @Test public void testNewProject() throws Exception {
        
        StudioConfiguration sc = (StudioConfiguration) getBean("studioConfiguration");
        
        // disable the demo dirs
        try {
	    System.out.println("test 1");
            File tempDemoDir = IOUtils.createTempDirectory();
	    System.out.println("test 2");
            sc.setTestDemoDir(tempDemoDir);
	    System.out.println("test 3");
            makeProject("testNewProject");
	    System.out.println("test 4");
            String[] o = (String[])invokeService_toObject("studioService", "listProjects",
                    null);
	    System.out.println("test 5:" + o.getClass().getName());
            assertTrue(o instanceof String[]);
            assertEquals("testNewProject", o[0]);
            makeProject("a");
	    o = (String[])invokeService_toObject("studioService", "listProjects",
				       null);
            assertEquals("a", o[0]);
            assertEquals("testNewProject", o[1]);
            makeProject("d");
            makeProject("c");

	    o = (String[])invokeService_toObject("studioService", "listProjects",
				       null);
            assertEquals("a", o[0]);
            assertEquals("c", o[1]);
            assertEquals("d", o[2]);
            assertEquals("testNewProject", o[3]);
	    /*
            assertTrue(o instanceof Set);
            assertEquals("testNewProject", ((Set<?>) o).iterator().next());
            makeProject("a");
            o = invokeService_toObject("studioService", "listProjects", null);
            assertTrue(o instanceof Set);
            Iterator<?> it = ((Set<?>)o).iterator();
            assertEquals("a", it.next());
            assertEquals("testNewProject", it.next());
            makeProject("d");
            makeProject("c");
            o = invokeService_toObject("studioService", "listProjects", null);
            assertTrue(o instanceof Set);
            it = ((Set<?>)o).iterator();
            assertEquals("a", it.next());

            assertEquals("c", it.next());
            assertEquals("d", it.next());
            assertEquals("testNewProject", it.next());
	    */
            FileUtils.forceDelete(tempDemoDir);
        } finally {
            sc.setTestDemoDir(null);
        }
    }
    
    @Test public void testOpenUpgradeProject() throws Exception {
        
        StudioConfiguration sc = (StudioConfiguration) getBean("studioConfiguration");
        
        // disable the demo dirs
        try {
            File tempDemoDir = IOUtils.createTempDirectory();
            sc.setTestDemoDir(tempDemoDir);

            makeProject("testOpenUpgradeProject");
            
            Project p = ((ProjectManager) getBean("projectManager")).getCurrentProject();
            p.setProjectVersion(0.0);

            Object o = invokeService_toObject("studioService", "openProject",
                    new Object[]{p.getProjectName()});
            assertTrue(o instanceof OpenProjectReturn);
            
            FileUtils.forceDelete(tempDemoDir);
        } finally {
            sc.setTestDemoDir(null);
        }
    }
    
    @Test public void testNewProject2() throws Exception {
        
        String projectName2 = "testNewProject2";
        File expectedPath = new File(new File(getTestWaveMakerHome(),
                StudioConfiguration.PROJECTS_DIR), projectName2);
        assertFalse(expectedPath.exists());
        
        Object o = invokeService_toObject("studioService", "newProject",
                new Object[] {projectName2});

        assertTrue(expectedPath.exists());
        
        Object getWebPathRet = invokeService_toObject("studioService",
                "getWebPath", null);
        
        assertEquals(getWebPathRet, o);
    }
    
    @Test public void testWriteReadExistsFile() throws Exception {
        
        String data = "hihihi";

        makeProject("testWriteStringFile");

        Boolean b = (Boolean) invokeService_toObject("studioService",
                "fileExists", new Object[] {"writefile.data"});
        assertFalse(b);
        
        invokeService_toObject("studioService",
                "writeFile", new Object[] {"writefile.data", data});
        
        b = (Boolean) invokeService_toObject("studioService",
                "fileExists", new Object[] {"writefile.data"});
        assertTrue(b);
        
        File expected = new File(new File(getTestWaveMakerHome(),
                StudioConfiguration.PROJECTS_DIR),
                "testWriteStringFile/writefile.data");
        assertTrue(expected.exists());
        
        FileReader fr = new FileReader(expected);
        CharBuffer cb = CharBuffer.allocate(1024);
        fr.read(cb);
        fr.close();
        cb.rewind();
        String readString = cb.toString();
        readString = readString.trim();
        
        assertEquals(data, readString);
        
        Object o = invokeService_toObject("studioService",
                "readFile", new Object[] {"writefile.data"});
        assertEquals(data, o);
    }
    
    @Test public void testClobber() throws Exception {
        
        String data = "hihihi";
        String data2 = "byebyebye";

        makeProject("testClobber");
        
        invokeService_toObject("studioService",
                "writeFile", new Object[] {"writefile.data", data});
        
        invokeService_toObject("studioService",
                "writeFile", new Object[] {"writefile.data", data2, true});
        Object ret = invokeService_toObject("studioService",
                "readFile", new Object[] {"writefile.data"});
        assertEquals(data, ret);
        
        invokeService_toObject("studioService",
                "writeFile", new Object[] {"writefile.data", data2, false});
        ret = invokeService_toObject("studioService",
                "readFile", new Object[] {"writefile.data"});
        assertEquals(data2, ret);
        
        invokeService_toObject("studioService",
                "writeFile", new Object[] {"writefile.data", data});
        ret = invokeService_toObject("studioService",
                "readFile", new Object[] {"writefile.data"});
        assertEquals(data, ret);
        

        
        invokeService_toObject("studioService",
                "writeWebFile", new Object[] {"writefile.data", data});
        
        invokeService_toObject("studioService",
                "writeWebFile", new Object[] {"writefile.data", data2, true});
        ret = invokeService_toObject("studioService",
                "readWebFile", new Object[] {"writefile.data"});
        assertEquals(data, ret);
        
        invokeService_toObject("studioService",
                "writeWebFile", new Object[] {"writefile.data", data2, false});
        ret = invokeService_toObject("studioService",
                "readWebFile", new Object[] {"writefile.data"});
        assertEquals(data2, ret);
        
        invokeService_toObject("studioService",
                "writeWebFile", new Object[] {"writefile.data", data});
        ret = invokeService_toObject("studioService",
                "readWebFile", new Object[] {"writefile.data"});
        assertEquals(data, ret);
    }
    
    @Test public void testReadObjectSpringConfigFile() throws Exception {
        
        File projectDir = makeProject("testReadSpringConfigFile");
        makeSpringConfig(projectDir);

        Object o = invokeService_toObject("studioService",
                "readObject", new Object[] { "config/spring.xml" });
        
        assertTrue("o: "+o+" ("+o.getClass()+")", o instanceof JSONObject);
        
        JSONObject jo = (JSONObject) o;
        JSONArray ja = (JSONArray) jo.get("beanList");
        for (Object elem: ja) {
            assertTrue(elem instanceof JSONObject);
            JSONObject jelem = (JSONObject) elem;
            if ("book1".equals(jelem.get("id"))) {
                assertEquals("com.wavemaker.tools.spring.Book",
                        jelem.get("clazz"));
            }
        }
    }

    @Test public void testReadFileSpringConfigFile() throws Exception {
        
        String path = "config/spring.xml";
        
        File projectDir = makeProject("testReadSpringConfigFile");
        makeSpringConfig(projectDir);

        String original = FileUtils.readFileToString(new File(projectDir, path));

        String s = (String) invokeService_toObject("studioService", "readFile",
                new Object[] { path });

        assertEquals(original.trim(), s.trim());
    }
    
    @Test public void testWriteReadWebFile() throws Exception {
        
        String projectName = "testWriteWebFile";
        makeProject(projectName);
        
        String sendPath = "foo";
        String sendData = "b\noo\n";
        
        Object o = invokeService_toObject("studioService",
                "writeWebFile", new Object[] {sendPath, sendData});
        assertNull(o);
        
        File expected = new File(new File(new File(new File(
                getTestWaveMakerHome(),
                StudioConfiguration.PROJECTS_DIR), projectName),
                ProjectConstants.WEB_DIR), sendPath);
        assertTrue(expected.exists());
        assertEquals(sendData, FileUtils.readFileToString(expected));
        
        o = invokeService_toObject("studioService",
                    "readWebFile", new Object[] {sendPath});
        assertTrue(o instanceof String);
        assertEquals(sendData, o);
        
        o = invokeService_toObject("studioService",
                "getWebPath", new Object[] {});
        assertEquals(projectName+"/"+ProjectConstants.WEB_DIR, o);
    }
    
    @Test public void testDeleteProject() throws Exception {
        
        String projectName = "testDeleteProject";
        File projectRoot = makeProject(projectName);
        assertTrue(projectRoot.exists());
        
        invokeService_toObject("studioService",
                "deleteProject", new Object[] {projectName});
        
        assertFalse(projectRoot.exists());
    }
    
    @Test public void testGetSetPreferences() throws Exception {
	System.out.println("TEST GETSET 1");
        StudioConfiguration sc = (StudioConfiguration) getBean("studioConfiguration");
	System.out.println("TEST GETSET 2");
        File wmHome = sc.getWaveMakerHome();
	System.out.println("TEST GETSET 3");
        File demoDir = sc.getDemoDir();
       	System.out.println("TEST GETSET 4");
        Map<String,String> prefs = CastUtils.cast((Map<?,?>)invokeService_toObject(
                "studioService", "getPreferences", new Object[] {}));
	System.out.println("TEST GETSET 5");
        assertTrue(prefs.containsKey(StudioConfiguration.WMHOME_KEY));
	System.out.println("TEST GETSET 6");
        assertEquals(wmHome.getAbsolutePath(),
                prefs.get(StudioConfiguration.WMHOME_KEY));
	if (demoDir == null)
	    System.out.println("TEST GETSET 7:null"  );
	else
	    System.out.println("TEST GETSET 7:" + demoDir.toString());
	if ("cloud".equals(PROJECT_TYPE)) {
	    assertNull(demoDir);
	} else {
	    System.out.println("TEST GETSET 8");
	    System.out.println("TEST GETSET 9:" + demoDir.toString());
	    assertEquals(demoDir.getAbsolutePath(),
			 prefs.get(StudioConfiguration.DEMOHOME_KEY));
        }
	    System.out.println("TEST GETSET 10");
        String oldPref = ConfigurationStore.getPreference(
                StudioConfiguration.class, StudioConfiguration.WMHOME_KEY, null);
	    System.out.println("TEST GETSET 11");
        File newDir = IOUtils.createTempDirectory();
	System.out.println("TEST GETSET 12:"+newDir.toString());
        try {
            prefs.put(StudioConfiguration.WMHOME_KEY, newDir.getAbsolutePath());
	    System.out.println("TEST GETSET 13");
            invokeService_toObject(
                    "studioService", "setPreferences", new Object[] {prefs});
	    System.out.println("TEST GETSET 14");
	    if ("cloud".equals(PROJECT_TYPE)) {
		System.out.println("TEST GETSET 14.1:" + (wmHome == null));
		System.out.println("TEST GETSET 14.2:" + (prefs == null));
		System.out.println("TEST GETSET 14.3:" + (StudioConfiguration.WMHOME_KEY == null));
		System.out.println("TEST GETSET 14.4:" + (prefs.get(StudioConfiguration.WMHOME_KEY == null)));
		prefs = CastUtils.cast((Map<?,?>)invokeService_toObject("studioService", "getPreferences", new Object[] {}));
		System.out.println("TEST GETSET 14.5");
		assertEquals(wmHome.getAbsolutePath(),
			     prefs.get(StudioConfiguration.WMHOME_KEY));
		System.out.println("TEST GETSET 14.6");
	    } else {
	    System.out.println("TEST GETSET 15");
		assertEquals(newDir.getAbsolutePath(), ConfigurationStore
			     .getPreference(StudioConfiguration.class,
					    StudioConfiguration.WMHOME_KEY, null));
	    }
	    System.out.println("TEST GETSET 16");
        } finally {
            if (null==oldPref) {
	    System.out.println("TEST GETSET 17");
                ConfigurationStore.removePreference(StudioConfiguration.class,
                        StudioConfiguration.WMHOME_KEY);
	    System.out.println("TEST GETSET 18");
            } else {
	    System.out.println("TEST GETSET 19");
                StudioConfiguration.setWaveMakerHome(new File(oldPref));
	    System.out.println("TEST GETSET 20");
            }
	    System.out.println("TEST GETSET 21");
            FileUtils.forceDelete(newDir);
	    System.out.println("TEST GETSET 22");
        }
    }

    @Test public void testGetStudioProjectType() throws Exception {
        
        Object o = invokeService_toObject("studioService",
                "getStudioProjectType", null);
        assertTrue(o instanceof String);
        String s = (String) o;
        assertEquals(System.getProperty("test.project.type"), s);
    }
    
    

    
    protected void makeWidget(File project) throws Exception {
        
        File widgetsDir = new File(project, "widgets");
        if (!widgetsDir.exists()) {
            widgetsDir.mkdir();
        }
        
        File tempWidget = new File(widgetsDir, "foo.xwgt");
        tempWidget.createNewFile();
        BufferedWriter bw = new BufferedWriter(new FileWriter(tempWidget));
        bw.write("<?xml version=\"1.0\" ?>\n"
                        + "<xwgt:widget name=\"foo\"\n"
                        + "        xmlns:xwgt=\"http://www.activegrid.com/namespaces/XmlWidget/1.0\">\n"
                        + "    <xwgt:child widget=\"LayoutContainer\" id=\"topofpe\" />\n"
                        + "</xwgt:widget>\n");
        bw.close();
    }
    
    protected void makeSpringConfig(File project) throws Exception {
        File springDir = new File(project, "config");
        if (!springDir.exists()) {
            springDir.mkdir();
        }

        File tempSpringConfig = new File(springDir, "spring.xml");
        tempSpringConfig.createNewFile();
        BufferedWriter bw = new BufferedWriter(new FileWriter(tempSpringConfig));
        bw.write("<?xml version=\"1.0\" ?>\n"
                        + "<beans xmlns=\"http://www.springframework.org/schema/beans\"\n"
                        + "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n"
                        + "xsi:schemaLocation=\"http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd\">\n"
                        + "<bean id=\"book1\"\n"
                        + "class=\"com.wavemaker.tools.spring.Book\"\n"
                        + "lazy-init=\"true\"/>" + "</beans>");
        bw.close();
    }
}
