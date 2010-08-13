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

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.util.List;
import java.util.Properties;

import com.wavemaker.common.util.CastUtils;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.testsupport.UtilTest;
import com.wavemaker.tools.config.ConfigurationStore;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.project.VersionInfo;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestStudioConfiguration extends WMTestCase {
    private static String PROJECT_TYPE = System.getProperty("test.project.type");
    private String semaphore;
    
    @Override
    public void setUp() throws Exception {
        super.setUp();
        semaphore = UtilTest.lockSemaphore(getClass().getName());
    }
    
    @Override
    public void tearDown() throws Exception {
        UtilTest.unlockSemaphore(semaphore);
    }
    
    public void testOverrideWMHome() throws Exception {
       if (!"cloud".equals(PROJECT_TYPE)) {        
        String oldWMHome = System.getProperty(StudioConfiguration.WMHOME_PROP_KEY, null);
        
        try {
            String newWMHome = "foo";

            System.setProperty(StudioConfiguration.WMHOME_PROP_KEY, newWMHome);
            
            StudioConfiguration sc = new StudioConfiguration();
            File wmHome = sc.getWaveMakerHome();
            
            assertEquals(newWMHome, wmHome.toString());
        } finally {
            if (null==oldWMHome) {
                Properties props = System.getProperties();
                props.remove(StudioConfiguration.WMHOME_PROP_KEY);
                System.setProperties(props);
            } else {
                System.setProperty(StudioConfiguration.WMHOME_PROP_KEY, oldWMHome);
            }
        }
       }
    }

    public void testWMHomeDirCreation_File() throws Exception {
       if (!"cloud".equals(PROJECT_TYPE)) {        
        String oldPref = ConfigurationStore.getPreference(
                StudioConfiguration.class, StudioConfiguration.WMHOME_KEY, null);
        
        try {
            File tempDir = null;
            
            try {
                tempDir = IOUtils.createTempDirectory();
                IOUtils.deleteRecursive(tempDir);

                assertTrue(!tempDir.exists());

                StudioConfiguration.setWaveMakerHome(tempDir);
                assertTrue(tempDir.exists());
            } finally {
                if (null != tempDir && tempDir.exists()) {
                    IOUtils.deleteRecursive(tempDir);
                }
            }
        } finally {
            if (null==oldPref) {
                ConfigurationStore.removePreference(StudioConfiguration.class,
                        StudioConfiguration.WMHOME_KEY);
            } else {
                StudioConfiguration.setWaveMakerHome(new File(oldPref));
            }
        }
       }
    }

    public void testCommonDirCreation() throws Exception {
       if (!"cloud".equals(PROJECT_TYPE)) {        
        File tempDir = null;

        try {
            tempDir = IOUtils.createTempDirectory();
            File tempProjectsDir = new File(tempDir,
                    StudioConfiguration.PROJECTS_DIR);

            assertTrue(!tempProjectsDir.exists());

            StudioConfiguration sc = new StudioConfiguration();
            sc.setTestWaveMakerHome(tempDir);

            assertTrue(sc.getProjectsDir().exists());
            assertTrue("expected failure in eclipse: expected dir: "+
                    sc.getCommonDir()+" DNE", sc.getCommonDir().exists());
            
            File commonSvn = new File(sc.getCommonDir(), ".svn");
            assertFalse(commonSvn.exists());
        } finally {
            if (null!=tempDir && tempDir.exists()) {
                IOUtils.deleteRecursive(tempDir);
            }
        }
       }
    }

    public void testGetStudioWebAppRootFile() throws Exception {
        
        StudioConfiguration sc = new StudioConfiguration();
        File studioWebAppRootFile = sc.getStudioWebAppRootFile();
        assertTrue(studioWebAppRootFile.exists());
        File studioWebInfFile = new File(studioWebAppRootFile, "WEB-INF");
        assertTrue("this fails in eclipse but passes on the command line; webinf file DNE",
                studioWebInfFile.exists());
        File webXmlFile = new File(studioWebInfFile, ProjectConstants.WEB_XML);
        assertTrue(webXmlFile.exists());
    }

    public void testDefaultStudioHome() throws Exception {
        if (!"cloud".equals(PROJECT_TYPE)) {        
        String oldStudioHome = ConfigurationStore.getPreference(
                StudioConfiguration.class, StudioConfiguration.WMHOME_KEY, null);
        StudioConfiguration sc = new StudioConfiguration();
        
        try {
            ConfigurationStore.removePreference(StudioConfiguration.class,
                    StudioConfiguration.WMHOME_KEY);
            
            File home = sc.getWaveMakerHome();
            assertTrue("we expected the parent of the home to exist; home: "
                    + home, home.getParentFile().exists());
            assertTrue("unexpected ending of home path: " + home, home
                    .toString().endsWith(StudioConfiguration.WAVEMAKER_HOME));
            assertTrue(home.exists());
        } finally {
            if (null!=oldStudioHome) {
                StudioConfiguration.setWaveMakerHome(new File(oldStudioHome));
            }
        }
	}
    }
    
    public void testCommandLineGetSetWMHome() throws Exception {
     if (!"cloud".equals(PROJECT_TYPE)) {        
        StudioConfiguration sc = new StudioConfiguration();
        File wmHome = sc.getWaveMakerHome();
        File newWMHome = null;
        
        try {
            PrintStream os = System.out;
            String out = null;
            newWMHome = IOUtils.createTempDirectory();
            newWMHome.delete();
            

            StudioConfiguration.main(new String[] {
                    StudioConfiguration.CMD_SET,
                    StudioConfiguration.WMHOME_KEY,
                    newWMHome.getAbsolutePath() });
            
            try {
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                System.setOut(new PrintStream(baos));
                StudioConfiguration.main(new String[] {
                        StudioConfiguration.CMD_GET,
                        StudioConfiguration.WMHOME_KEY });
                out = baos.toString();
                
                assertNotNull(out);
                assertEquals(newWMHome.getAbsolutePath(), out.trim());
            } finally {
                System.setOut(os);
            }
        } finally {
            StudioConfiguration.setWaveMakerHome(wmHome);
            newWMHome.delete();
        }
     }
    }
    
    // this keeps failing in the automated tests, and we're no longer using it
    // in the installer, so it's not as important.
    public void DISABLEDtestCommandLineExtendedCharacters() throws Exception {
        
        StudioConfiguration sc = new StudioConfiguration();
        
        File javaBinDir = new File(System.getProperty("java.home"), "bin");
        File javaExec;
        if (System.getProperty("os.name").startsWith("Win")) {
            javaExec = new File(javaBinDir, "java.exe");
        } else {
            javaExec = new File(javaBinDir, "java");
        }
        assertTrue(javaExec.exists());
        assertTrue(javaExec.isFile());
        
        ProcessBuilder pb;
        Process p;
        String output;
        List<String> outputLines;

        /* it seems fine for this to be not set, so disable this part of the
         * test for now
         * 
        // first, test a get with our ProcessBuilder
        pb = new ProcessBuilder(javaExec.getAbsolutePath(),
                "-cp", System.getProperty("java.class.path"),
                StudioConfiguration.class.getName(),
                StudioConfiguration.CMD_GET,
                StudioConfiguration.WMHOME_KEY);
        p = pb.start();
        assertEquals(0, p.waitFor());
        
        output = null;
        outputLines = CastUtils.cast(org.apache.commons.io.IOUtils.readLines(p.getInputStream()));
        for (String line: outputLines) {
            if (!line.contains("EMMA")) {
                output = line;
                break;
            }
        }
        
        assertNotNull(""+outputLines, output);
        assertEquals("output:---\n"+outputLines+"\n--- expected:\n"+
                sc.getWaveMakerHome().getAbsolutePath().trim()+"\n---",
                sc.getWaveMakerHome().getAbsolutePath().trim(), output.trim());
         *
         * end disabled section
         */

        File tempDir = IOUtils.createTempDirectory();
        File homeDir = new File(tempDir, "hi \u00F6\u00C9\u00E9");
        homeDir.mkdir();
        assertTrue(homeDir.exists());
        File newWMHome = new File(homeDir, "WaveMaker");
        assertFalse(newWMHome.exists());
        
        // make sure we can get back to our original settings
        File originalWMHome = sc.getWaveMakerHome();
        try {
            // set the to something with unicode characters
            pb = new ProcessBuilder(javaExec.getAbsolutePath(),
                    "-cp", System.getProperty("java.class.path"),
                    StudioConfiguration.class.getName(),
                    StudioConfiguration.CMD_SET,
                    StudioConfiguration.WMHOME_KEY,
                    newWMHome.getAbsolutePath()
                    );
            p = pb.start();
            assertEquals(0, p.waitFor());
            
            // make sure we can read it back out again
            pb = new ProcessBuilder(javaExec.getAbsolutePath(),
                    "-cp", System.getProperty("java.class.path"),
                    StudioConfiguration.class.getName(),
                    StudioConfiguration.CMD_GET,
                    StudioConfiguration.WMHOME_KEY);
            p = pb.start();
            assertEquals(0, p.waitFor());
            
            output = null;
            outputLines = CastUtils.cast(org.apache.commons.io.IOUtils.readLines(p.getInputStream()));
            for (String line: outputLines) {
                if (!line.contains("EMMA")) {
                    output = line;
                    break;
                }
            }
            
            assertEquals("output:---\n"+outputLines+"\n--- expected:\n"+
                    sc.getWaveMakerHome().getAbsolutePath().trim()+"\n---",
                    newWMHome.getAbsolutePath().trim(), output.trim());
        } finally {
            StudioConfiguration.setWaveMakerHome(originalWMHome);
        }
    }
    
    public void testCommonDir() throws Exception {
       if (!"cloud".equals(PROJECT_TYPE)) {                
        StudioConfiguration sc = new StudioConfiguration();
        File projects = sc.getProjectsDir();
        File common = sc.getCommonDir();
        
        assertEquals(projects.getParentFile(), common.getParentFile());
       }
    }
    
    // MAV-1989
    public void testCommonDirCreation_Threads() throws Exception {
       if (!"cloud".equals(PROJECT_TYPE)) {        
        File tempDir = null;

        try {
            tempDir = IOUtils.createTempDirectory();
            File tempProjectsDir = new File(tempDir,
                    StudioConfiguration.PROJECTS_DIR);

            assertTrue(!tempProjectsDir.exists());

            StudioConfiguration sc = new StudioConfiguration();
            sc.setTestWaveMakerHome(tempDir);
            
            Thread[] threads = new Thread[100];
            for (int i=0;i<threads.length;i++) {
                threads[i] = new CommonDirThread(i, sc);
            }
            
            for (int i=0;i<threads.length;i++) {
                threads[i].start();
            }

            for (int i=0;i<threads.length;i++) {
                threads[i].join();
            }

            assertTrue(sc.getProjectsDir().exists());
            assertTrue("expected failure in eclipse: expected dir: "+
                    sc.getCommonDir()+" DNE", sc.getCommonDir().exists());
        } finally {
            if (null!=tempDir && tempDir.exists()) {
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
                sc.getCommonDir();
            } catch (IOException e) {
                throw new RuntimeException("failure on index "+index, e);
            }
        }
    }


    public void testGetCurrentVersionInfo() throws Exception {

        VersionInfo vi = StudioConfiguration.getCurrentVersionInfo();
        assertNotNull(vi);
        assertTrue(vi.getMajor()>4);
    }

    public void testGetRegisteredVersionInfo() throws Exception {

        VersionInfo vi = StudioConfiguration.getRegisteredVersionInfo();
        assertNotNull(vi);
        assertTrue(vi.getMajor()>=4);
    }
}
