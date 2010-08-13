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
import java.io.Reader;
import java.io.Writer;
import java.nio.CharBuffer;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.service.AbstractFileService;
import com.wavemaker.tools.service.FileService;
import com.wavemaker.tools.spring.ComplexReturnBean;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestFileService extends WMTestCase {
    
    public void testBasicEncoding() throws Exception {
        
        File f = IOUtils.createTempDirectory(
                "testDirFor_"+this.getName(), ".tmp");
        FileService fs = new SampleFileService(f, "UTF-8");
        fs.writeFile("foo.txt", ComplexReturnBean.EXTENDED_CHARS_TEST_STR);
        
        File expectedFile = new File(f, "foo.txt");
        assertTrue(expectedFile.exists());
        
        InputStream is = new FileInputStream(expectedFile);
        byte[] bytes = new byte[ComplexReturnBean.EXTENDED_CHARS_TEST_STR.length()*2+1];
        int len = is.read(bytes);
        String str = new String(bytes, 0, len, "UTF-8");
        assertEquals(ComplexReturnBean.EXTENDED_CHARS_TEST_STR, str);
    }
    
    public void testProjectBasicEncoding() throws Exception {
        
        File f = IOUtils.createTempDirectory(
                "testDirFor_"+this.getName(), ".tmp");
        FileService fs = new Project(f);
        fs.writeFile("foo.txt", ComplexReturnBean.EXTENDED_CHARS_TEST_STR);
        
        File expectedFile = new File(f, "foo.txt");
        assertTrue(expectedFile.exists());
        
        InputStream is = new FileInputStream(expectedFile);
        byte[] bytes = new byte[ComplexReturnBean.EXTENDED_CHARS_TEST_STR.length()*2+1];
        int len = is.read(bytes);
        String str = new String(bytes, 0, len, "UTF-8");
        assertEquals(ComplexReturnBean.EXTENDED_CHARS_TEST_STR, str);
    }
    
    public void testProjectBasicWriterReaderEncoding() throws Exception {
        
        File f = IOUtils.createTempDirectory(
                "testDirFor_"+this.getName(), ".tmp");
        FileService fs = new Project(f);
        
        Writer writer = fs.getWriter("foo.txt");
        writer.write(ComplexReturnBean.EXTENDED_CHARS_TEST_STR);
        writer.close();
        
        File expectedFile = new File(f, "foo.txt");
        assertTrue(expectedFile.exists());
        
        InputStream is = new FileInputStream(expectedFile);
        byte[] bytes = new byte[ComplexReturnBean.EXTENDED_CHARS_TEST_STR.length()*2+1];
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

    
    
    
    public static class SampleFileService extends AbstractFileService {
        
        private final String encoding;
        private final File basedir;
        
        public SampleFileService(File basedir, String encoding) {
            this.encoding = encoding;
            this.basedir = basedir;
        }
        
        public String getEncoding() {
            return this.encoding;
        }

        public File getFileServiceRoot() {
            return this.basedir;
        }
    }
}