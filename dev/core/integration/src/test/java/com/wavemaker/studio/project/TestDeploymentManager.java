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
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Enumeration;
import java.util.jar.JarFile;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Test;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.BuildExceptionWithOutput;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.DesignServiceManager;

/**
 * @author Joel Hare
 * @author Jeremy Grelle
 * 
 */
public class TestDeploymentManager extends StudioTestCase {

    public static final String PLAN_FILE_TEXT = "";

    public static final long RETRY_SECONDS = 30;

    protected DeploymentManager deploymentManager;

    protected ProjectManager projectManager;

    @Before
    @Override
    public void setUp() throws Exception {

        super.setUp();

        this.deploymentManager = (DeploymentManager) getBean("deploymentManager");
        this.projectManager = (ProjectManager) getBean("projectManager");
    }

    @Test
    public void testTestRun() throws Exception {

        File testTestRunDir = makeProject("testTestRun", /* noTemplate= */false);
        String deployName = getTestWaveMakerHome().getName() + "-testTestRun";
        populateProject(testTestRunDir);

        File webxmlExpected = new File(testTestRunDir, "webapproot/WEB-INF/web.xml");
        File userWebxml = new File(testTestRunDir, "webapproot/WEB-INF/user-web.xml");
        assertFalse(webxmlExpected.exists());
        assertTrue(userWebxml.exists());

        Thread.sleep(3000);
        this.deploymentManager.testRunStart(testTestRunDir.getAbsolutePath(), deployName);

        assertTrue(webxmlExpected.exists());
        assertTrue("0webxmlLast: " + webxmlExpected.lastModified() + ", user last:" + userWebxml.lastModified(),
            userWebxml.lastModified() < webxmlExpected.lastModified());

        checkURLContent(testTestRunDir, deployName, "index.html", INDEX_HTML_TEXT, RETRY_SECONDS, this.deploymentManager);

        File fooPropExpected = new File(testTestRunDir, "webapproot/WEB-INF/classes/foo.properties");
        assertTrue(fooPropExpected.exists());
        assertEquals(FOO_PROPS_CONTENTS, FileUtils.readFileToString(fooPropExpected));

        File log4jExpected = new File(testTestRunDir, "webapproot/WEB-INF/classes/log4j.properties");
        assertTrue(log4jExpected.exists());

        assertTrue(webxmlExpected.exists());

        assertTrue("1webxmlLast: " + webxmlExpected.lastModified() + ", user last:" + userWebxml.lastModified(),
            userWebxml.lastModified() < webxmlExpected.lastModified());
        String webxmlContents = FileUtils.readFileToString(webxmlExpected);
        assertTrue("2webxmlLast: " + webxmlExpected.lastModified() + ", user last:" + userWebxml.lastModified(),
            userWebxml.lastModified() < webxmlExpected.lastModified());
        assertTrue("contents: " + webxmlContents, webxmlContents.contains("display-name"));
        assertTrue("contents: " + webxmlContents, webxmlContents.contains("servlet-mapping"));

        // test before modifications
        Thread.sleep(3000);
        long firstMtime = webxmlExpected.lastModified();
        assertTrue("3userweb: " + userWebxml.lastModified() + " < frst " + firstMtime, userWebxml.lastModified() < firstMtime);
        this.deploymentManager.testRunStart(testTestRunDir.getAbsolutePath(), deployName);
        // web xml is modified by run
        // assertEquals(firstMtime, webxmlExpected.lastModified());

        // test with touch
        com.wavemaker.common.util.IOUtils.touch(userWebxml);
        Thread.sleep(1000);
        this.deploymentManager.testRunStart(testTestRunDir.getAbsolutePath(), deployName);

        this.deploymentManager.testRunClean(testTestRunDir.getAbsolutePath(), deployName);
    }

    @Test
    public void testCompilerOutput() throws Exception {

        String projectName = "testCompilerOutput";

        makeProject(projectName, false);
        File projectDir = this.projectManager.getCurrentProject().getProjectRoot().getFile();

        populateProject(projectDir);
        File serviceSrcDir = new File(projectDir, "services/aservice/src");
        FileUtils.forceMkdir(serviceSrcDir);
        File serviceFile = new File(serviceSrcDir, "ValidTestCompile.java");

        FileUtils.writeStringToFile(serviceFile, "public class ValidTestCompile { }");

        String compileOutput = this.deploymentManager.build();
        assertNotNull(compileOutput);
        assertTrue(compileOutput.contains("javac"));
        assertTrue(compileOutput.contains("compile:"));
        assertTrue(compileOutput.contains("build:"));

        String compileOnlyOutput = this.deploymentManager.build();
        assertNotNull(compileOnlyOutput);
        assertTrue(compileOnlyOutput.contains("compile:"));
        assertTrue(compileOnlyOutput.contains("build:"));

        // let the filesystem catch up
        Thread.sleep(3000);

        FileUtils.writeStringToFile(serviceFile, "public class ValidTestCompile { private int i }");
        try {
            compileOutput = this.deploymentManager.build();
            fail("Compile should have thrown an exception");
        } catch (BuildExceptionWithOutput e) {
            if (!e.getCompilerOutput().contains("1 error")) {
                fail("Expected compiler output to have the string \"1 error\", instead it is " + e.getCompilerOutput());
            }
        }
    }

    @Test
    public void testBuildWar() throws Exception {

        String projectName = "testBuildWar";
        File testBuildWarDir = makeProject(projectName, /* noTemplate= */false);
        String deployName = getTestWaveMakerHome().getName() + "-" + projectName;
        populateProject(testBuildWarDir);

        File dist = new File(testBuildWarDir, "dist");
        String warFileName = dist.getAbsolutePath() + File.separatorChar + projectName + ".war";
        this.deploymentManager.buildWar();
        File warFile = new File(warFileName);
        assertTrue("WAR file " + warFile + " does not exist", warFile.exists());

        trimWar(warFile);
        this.deploymentManager.deployWar(warFileName, deployName);
        try {
            checkURLContent(testBuildWarDir, deployName, "index.html", INDEX_HTML_TEXT_EXPECTED, RETRY_SECONDS, this.deploymentManager);
            checkURLContent(testBuildWarDir, deployName, "login.html", INDEX_HTML_TEXT_EXPECTED, RETRY_SECONDS, this.deploymentManager);
            checkURLContent(testBuildWarDir, deployName, "lib/wm/common/foo.txt", "some data", RETRY_SECONDS, this.deploymentManager);
        } finally {
            this.deploymentManager.undeploy(testBuildWarDir.getAbsolutePath(), deployName);
        }
    }

    @Test
    public void testBuildWar_NoSourceDirs() throws Exception {

        String projectName = "testBuildWar_NoSourceDirs";
        File testBuildWarNoSourceDir = makeProject(projectName,
        /* noTemplate= */false);
        populateProject(testBuildWarNoSourceDir);

        File servicesDir = new File(testBuildWarNoSourceDir, DesignServiceManager.getServicesRelativeDir());
        assertTrue(servicesDir.exists());
        FileUtils.forceDelete(servicesDir);
        assertFalse(servicesDir.exists());

        File srcDir = new File(testBuildWarNoSourceDir, "src");
        FileUtils.forceDelete(srcDir);
        assertFalse(srcDir.exists());

        File dist = new File(testBuildWarNoSourceDir, "dist");
        String warFileName = dist.getAbsolutePath() + File.separatorChar + projectName + ".war";
        this.deploymentManager.buildWar();
        File warFile = new File(warFileName);
        assertTrue("WAR file " + warFile + " does not exist", warFile.exists());
    }

    @Test
    public void testBuildWar_JustSrcDir() throws Exception {

        String projectName = "testBuildWar_JustSrcDir";
        File testBuildWarJustSrcDir = makeProject(projectName,
        /* noTemplate= */false);
        populateProject(testBuildWarJustSrcDir);

        File servicesDir = new File(testBuildWarJustSrcDir, DesignServiceManager.getServicesRelativeDir());
        assertTrue(servicesDir.exists());
        FileUtils.forceDelete(servicesDir);
        assertFalse(servicesDir.exists());

        File srcDir = new File(testBuildWarJustSrcDir, "src");
        srcDir.mkdir();
        File srcFile = new File(srcDir, "Foo.java");
        FileUtils.writeStringToFile(srcFile, "public class Foo{}");

        File dist = new File(testBuildWarJustSrcDir, "dist");
        String warFileName = dist.getAbsolutePath() + File.separatorChar + projectName + ".war";
        this.deploymentManager.buildWar();
        File warFile = new File(warFileName);
        assertTrue("WAR file " + warFile + " does not exist", warFile.exists());

        // make sure the compiled java class is in there
        JarFile jf = new JarFile(warFile);
        try {
            assertNotNull("couldn't find expected entry", jf.getEntry("WEB-INF/classes/Foo.class"));
            assertNotNull("couldn't find expected entry", jf.getEntry("WEB-INF/web.xml"));
        } finally {
            jf.close();
        }
    }

    @Test
    public void testBuildWar_NoWmDir() throws Exception {

        String projectName = "testBuildWar";
        File testBuildWarDir = makeProject(projectName, /* noTemplate= */false);
        String deployName = getTestWaveMakerHome().getName() + "-" + projectName;
        populateProject(testBuildWarDir);

        // remove wm directory
        File wmDir = new File(getTestWaveMakerHome(), LocalStudioConfiguration.COMMON_DIR);
        FileUtils.forceDelete(wmDir);

        File dist = new File(testBuildWarDir, "dist");
        String warFileName = dist.getAbsolutePath() + File.separatorChar + projectName + ".war";
        this.deploymentManager.buildWar();

        File warFile = new File(warFileName);
        assertTrue("WAR file " + warFile + " does not exist", warFile.exists());

        trimWar(warFile);
        this.deploymentManager.deployWar(warFileName, deployName);

        try {
            checkURLContent(testBuildWarDir, deployName, "index.html", INDEX_HTML_TEXT_EXPECTED, RETRY_SECONDS, this.deploymentManager);
            checkURLContent(testBuildWarDir, deployName, "login.html", INDEX_HTML_TEXT_EXPECTED, RETRY_SECONDS, this.deploymentManager);

            try {
                checkURLContent(testBuildWarDir, deployName, "common/foo.txt", "some data", RETRY_SECONDS, this.deploymentManager);
                fail("expected exception");
            } catch (WMRuntimeException e) {
                assertTrue(e.getMessage().contains("FileNotFound"));
            }
        } finally {
            this.deploymentManager.undeploy(testBuildWarDir.getAbsolutePath(), deployName);
        }
    }

    @Test
    public void testBuildWar_JustServiceSrcDir() throws Exception {

        String projectName = "testBuildWar_JustServiceSrcDir";
        File testBuildWarJustServiceSrcDir = makeProject(projectName, /*
                                                                       * noTemplate=
                                                                       */
            false);
        populateProject(testBuildWarJustServiceSrcDir);

        File servicesDir = new File(testBuildWarJustServiceSrcDir, DesignServiceManager.getServicesRelativeDir());
        assertTrue(servicesDir.exists());
        File serviceFooDir = new File(servicesDir, "foo");
        File serviceFooSrcDir = new File(serviceFooDir, "src");
        FileUtils.forceMkdir(serviceFooSrcDir);
        File serviceFooSrc = new File(serviceFooSrcDir, "Foo.java");
        FileUtils.writeStringToFile(serviceFooSrc, "public class Foo{}");

        File srcDir = new File(testBuildWarJustServiceSrcDir, "src");
        FileUtils.forceDelete(srcDir);

        File dist = new File(testBuildWarJustServiceSrcDir, "dist");
        String warFileName = dist.getAbsolutePath() + File.separatorChar + projectName + ".war";
        this.deploymentManager.buildWar();
        File warFile = new File(warFileName);
        assertTrue("WAR file " + warFile + " does not exist", warFile.exists());

        // make sure the compiled java class is in there
        JarFile jf = new JarFile(warFile);
        assertNotNull("couldn't find expected entry", jf.getEntry("WEB-INF/classes/Foo.class"));
        jf.close();
    }

    @Test
    public void testExportProject() throws Exception {

        String projectName = "testExportProject";
        File testExportProjectDir = makeProject(projectName, /* noTemplate= */
            false);
        populateProject(testExportProjectDir);

        File deploymentDescriptorXml = new File(testExportProjectDir, projectName + ".xml");
        com.wavemaker.common.util.IOUtils.touch(deploymentDescriptorXml);

        this.deploymentManager.build();
        File exportDir = new File(testExportProjectDir, "export");
        File webInf = new File(testExportProjectDir, ProjectConstants.WEB_DIR + "/" + ProjectConstants.WEB_INF);
        assertTrue(webInf.exists());
        assertTrue(new File(webInf, ProjectConstants.LIB_DIR).exists());
        assertTrue(new File(webInf, ProjectConstants.CLASSES_DIR).exists());

        String zipFileName = exportDir.getAbsolutePath() + File.separator + projectName + ".zip";
        this.deploymentManager.exportProject();
        File zipFile = new File(zipFileName);
        assertTrue("ZIP file " + zipFile + " does not exist", zipFile.exists());

        ZipFile zf = new ZipFile(zipFile);
        try {
            boolean foundWebInf = false;
            Enumeration<?> e = zf.entries();
            while (e.hasMoreElements()) {
                ZipEntry ze = (ZipEntry) e.nextElement();
                if (ze.getName().startsWith(projectName + "/webapproot/WEB-INF/lib")) {
                    fail("got lib entry: " + ze.getName());
                } else if (ze.getName().startsWith(projectName + "/webapproot/WEB-INF/classes")) {
                    fail("got classes entry: " + ze.getName());
                } else if (ze.getName().startsWith(projectName + "/webapproot/WEB-INF")) {
                    foundWebInf = true;
                } else if (ze.getName().startsWith(projectName + "/" + projectName + ".xml")) {
                    fail("got deployment descriptor: " + ze.getName());
                }
            }
            assertTrue(foundWebInf);
        } finally {
            zf.close();
        }
    }

    public static void checkURLContent(File projectDir, String deployName, String filename, String expectedResult, long retrySeconds,
        DeploymentManager deploymentManager) throws InterruptedException {

        String tomcatHost = deploymentManager.getStudioConfiguration().getTomcatHost();
        int tomcatPort = deploymentManager.getStudioConfiguration().getTomcatPort();

        String contentURLString = "http://" + tomcatHost + ":" + tomcatPort + "/" + deployName + "/" + filename;
        long startTime = System.currentTimeMillis();
        Object actual = null;
        while (null == actual) {
            try {
                Thread.sleep(512);
                URL url = new URL(contentURLString);
                StringBuilder sb = new StringBuilder();
                InputStreamReader contentStream = new InputStreamReader((InputStream) url.getContent());
                char[] cbuf = new char[256];
                int rc = 0;
                while ((rc = contentStream.read(cbuf)) >= 0) {
                    sb.append(cbuf, 0, rc);
                }
                actual = sb.toString();
                assertEquals(contentURLString + " contained " + actual + ", not the expected " + expectedResult, expectedResult, actual);
            } catch (IOException e) {
                if (System.currentTimeMillis() - startTime > 1000 * retrySeconds) {
                    throw new WMRuntimeException("Exception after " + retrySeconds + " seconds have passed: " + e.toString());
                }
            }
        }
    }

    /**
     * Avoids OOM during testing by making wars we deploy artifically small.
     */
    public static void trimWar(File warFileName) throws IOException {

        File outFile = new File(warFileName.getAbsolutePath() + ".bak");
        outFile.deleteOnExit();

        ZipInputStream zfinis = new ZipInputStream(new FileInputStream(warFileName));
        ZipOutputStream zfoutos = new ZipOutputStream(new FileOutputStream(outFile));

        ZipEntry zein;
        while (null != (zein = zfinis.getNextEntry())) {
            if (zein.getName().startsWith("lib/") && !zein.getName().startsWith("lib/wm/")) {
                continue;
            } else {
                zfoutos.putNextEntry(zein);
                IOUtils.copy(zfinis, zfoutos);
                zfoutos.closeEntry();
                zfinis.closeEntry();
            }
        }

        zfinis.close();
        zfoutos.close();

        warFileName.delete();
        FileUtils.copyFile(outFile, warFileName);
        outFile.delete();
    }
}
