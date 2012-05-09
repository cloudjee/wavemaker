/*
 *  Copyright (C) 2008-2009 WaveMaker Software, Inc.
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

package com.wavemaker.tools.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.tools.project.LocalStudioFileSystem;
import com.wavemaker.tools.spring.ComplexReturnBean;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.filesystem.local.LocalFileSystem;
import com.wavemaker.tools.io.filesystem.FileSystemFolder;

/**
 * @author Matt Small
 */
public class FileServiceTest extends WMTestCase {

    public void testBasicEncoding() throws Exception {

        File f = IOUtils.createTempDirectory("testDirFor_" + this.getName(), ".tmp");
        SampleFileService fs = new SampleFileService(f, "UTF-8");
        fs.writeFile("foo.txt", ComplexReturnBean.EXTENDED_CHARS_TEST_STR);

        File expectedFile = new File(f, "foo.txt");
        assertTrue(expectedFile.exists());

        InputStream is = new FileInputStream(expectedFile);
        byte[] bytes = new byte[ComplexReturnBean.EXTENDED_CHARS_TEST_STR.length() * 2 + 1];
        int len = is.read(bytes);
        String str = new String(bytes, 0, len, "UTF-8");
        assertEquals(ComplexReturnBean.EXTENDED_CHARS_TEST_STR, str);
    }

    public static class SampleFileService extends AbstractFileService {

        private final String encoding;

        private final File basedir;

        public SampleFileService(File basedir, String encoding) {
            super();
            this.encoding = encoding;
            this.basedir = basedir;
        }

        @Override
        public String getEncoding() {
            return this.encoding;
        }

        @Override
        public Folder getFileServiceRoot() {
            LocalFileSystem fileSystem = new LocalFileSystem(this.basedir);
            Folder folder = FileSystemFolder.getRoot(fileSystem);
            return folder;
        }
    }
}