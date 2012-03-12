/*
 *  Copyright (C) 2009 WaveMaker Software, Inc.
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

package com.wavemaker.tools.ant;

import java.io.File;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;

import com.wavemaker.infra.WMTestCase;
import com.wavemaker.tools.util.ResourceClassLoaderUtils;

/**
 * @author Matt Small
 */
public class CopyRuntimeJarsTaskTest extends WMTestCase {

    public void testGetModuleLocations() throws Exception {

        ClassPathResource cpr = new ClassPathResource(this.getClass().getName().replace(".", "/") + ".class");
        File jarOne = new File(cpr.getFile().getParentFile(), "copyruntime_module_jar_one.jar");
        assertTrue(jarOne.exists());
        ClassLoader cl = ResourceClassLoaderUtils.getClassLoaderForResources(new FileSystemResource(jarOne));

        CopyRuntimeJarsTask crjt = new CopyRuntimeJarsTask();
        List<File> modules = crjt.getModuleLocations(cl);
        assertTrue(modules.size() > 0);

        boolean gotExpectedModule = false;
        for (File f : modules) {
            if (f.getAbsoluteFile().equals(jarOne.getAbsoluteFile())) {
                gotExpectedModule = true;
                break;
            }
        }
        assertTrue(gotExpectedModule);

    }
}