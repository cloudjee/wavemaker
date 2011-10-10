/*
 *  Copyright (C) 2007-2009 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.project;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.io.Writer;
import java.nio.CharBuffer;
import java.util.Properties;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.util.FileCopyUtils;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.tools.service.FileService;
import com.wavemaker.tools.spring.ComplexReturnBean;

/**
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class TestProject extends WMTestCase {

    private File tempDir = null;

    private final StudioConfiguration studioConfiguration = new LocalStudioConfiguration();

    @Override
    public void setUp() throws Exception {
        SpringUtils.initSpringConfig();
        this.tempDir = IOUtils.createTempDirectory();
    }

    @Override
    public void tearDown() throws Exception {
        IOUtils.deleteRecursive(this.tempDir);
    }

    public void testProjectName() {

        String projectName = "foo";

        Resource projectRoot = new FileSystemResource(this.tempDir.getPath() + "/").createRelative(projectName + "/");

        Project p = new Project(projectRoot, this.studioConfiguration);
        assertEquals(projectName, p.getProjectName());
    }

    public void testProjectUnicode() throws IOException {

        String projectName = "foo";
        Resource projectRoot = new FileSystemResource(this.tempDir.getPath() + "/").createRelative(projectName + "/");
        projectRoot.getFile().mkdir();
        Project p = new Project(projectRoot, this.studioConfiguration);

        assertTrue(projectRoot.getFile().exists());
        assertTrue(projectRoot.getFile().isDirectory());

        p.writeFile("foo.txt", "école マット");

        byte[] bytes = FileCopyUtils.copyToByteArray(projectRoot.createRelative("foo.txt").getInputStream());
        String str = new String(bytes, ServerConstants.DEFAULT_ENCODING);
        assertEquals('\u00E9', str.charAt(0));
        assertEquals('\u30DE', str.charAt(6));

        String str2 = p.readFile("foo.txt");
        assertEquals(str, str2);
        assertEquals('\u00E9', str2.charAt(0));
        assertEquals('\u30DE', str2.charAt(6));
    }

    public void testProjectVersion() throws Exception {

        String projectName = "foo";
        File tempDir = IOUtils.createTempDirectory();

        Resource projectRoot = new FileSystemResource(tempDir.getPath() + "/").createRelative(projectName + "/");
        projectRoot.getFile().mkdir();
        Project p = new Project(projectRoot, this.studioConfiguration);

        assertEquals(Double.valueOf(Project.PROPERTY_PROJECT_VERSION_DEFAULT), p.getProjectVersion());

        Properties props = p.getProperties();
        props.setProperty(Project.PROPERTY_PROJECT_VERSION, "12.2");
        p.setProperties(props);

        assertEquals(12.2, p.getProjectVersion());

    }

    public void testGetWebInfClasses() throws Exception {

        String projectName = "testGetWebInfClasses";

        File tempDir = IOUtils.createTempDirectory();
        Resource projectRoot = new FileSystemResource(tempDir.getPath() + "/").createRelative(projectName + "/");
        projectRoot.getFile().mkdir();
        Project p = new Project(projectRoot, this.studioConfiguration);

        Resource webinfClasses = projectRoot.createRelative("webapproot/WEB-INF/classes/");
        assertEquals(webinfClasses, p.getWebInfClasses());
    }

    public void testProjectBasicEncoding() throws Exception {

        File tempDir = IOUtils.createTempDirectory();
        FileService fs = new Project(new FileSystemResource(tempDir.getPath() + "/"), this.studioConfiguration);
        fs.writeFile("foo.txt", ComplexReturnBean.EXTENDED_CHARS_TEST_STR);

        File expectedFile = new File(tempDir, "foo.txt");
        assertTrue(expectedFile.exists());

        InputStream is = new FileInputStream(expectedFile);
        byte[] bytes = new byte[ComplexReturnBean.EXTENDED_CHARS_TEST_STR.length() * 2 + 1];
        int len = is.read(bytes);
        String str = new String(bytes, 0, len, "UTF-8");
        assertEquals(ComplexReturnBean.EXTENDED_CHARS_TEST_STR, str);
    }

    public void testProjectBasicWriterReaderEncoding() throws Exception {

        File tempDir = IOUtils.createTempDirectory();
        FileService fs = new Project(new FileSystemResource(tempDir.getPath() + "/"), this.studioConfiguration);

        Writer writer = fs.getWriter("foo.txt");
        writer.write(ComplexReturnBean.EXTENDED_CHARS_TEST_STR);
        writer.close();

        File expectedFile = new File(tempDir, "foo.txt");
        assertTrue(expectedFile.exists());

        InputStream is = new FileInputStream(expectedFile);
        byte[] bytes = new byte[ComplexReturnBean.EXTENDED_CHARS_TEST_STR.length() * 2 + 1];
        int len = is.read(bytes);
        String str = new String(bytes, 0, len, "UTF-8");
        assertEquals(ComplexReturnBean.EXTENDED_CHARS_TEST_STR, str);

        CharBuffer cb = CharBuffer.allocate(ComplexReturnBean.EXTENDED_CHARS_TEST_STR.length());
        Reader reader = fs.getReader("foo.txt");
        reader.read(cb);
        reader.close();
        cb.rewind();

        assertEquals(ComplexReturnBean.EXTENDED_CHARS_TEST_STR, cb.toString());
    }
}