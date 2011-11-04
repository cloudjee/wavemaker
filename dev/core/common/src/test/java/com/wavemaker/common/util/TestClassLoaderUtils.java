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

package com.wavemaker.common.util;

import java.io.File;
import java.io.InputStream;

import org.apache.commons.io.FileUtils;
import org.springframework.core.io.ClassPathResource;

import com.wavemaker.infra.WMTestCase;

/**
 * @author Matt Small
 */
public class TestClassLoaderUtils extends WMTestCase {

    public void testTempClassLoader_getClass() throws Exception {

        File sourceJar = new ClassPathResource("com/wavemaker/common/foojar.jar").getFile();
        File jar = File.createTempFile("testTempClassLoader_getClass", ".jar");
        jar.deleteOnExit();
        FileUtils.copyFile(sourceJar, jar);

        try {
            ClassLoader cl = ClassLoaderUtils.getTempClassLoaderForFile(jar);
            Class<?> klass = ClassLoaderUtils.loadClass("foo.bar.baz.JarType", cl);
            assertNotNull(klass);
        } finally {
            jar.delete();
        }
    }

    public void testTempClassLoader_getResource() throws Exception {

        File sourceJar = new ClassPathResource("com/wavemaker/common/foojar.jar").getFile();
        File jar = File.createTempFile("testTempClassLoader_getClass", ".jar");
        jar.deleteOnExit();
        FileUtils.copyFile(sourceJar, jar);

        try {
            ClassLoader cl = ClassLoaderUtils.getTempClassLoaderForFile(jar);
            InputStream is = ClassLoaderUtils.getResourceAsStream("foo/bar/baz/JarType.java", cl);
            assertNotNull(is);
            assertTrue(is.available() > 0);
            is.close();
        } finally {
            jar.delete();
        }
    }
}
