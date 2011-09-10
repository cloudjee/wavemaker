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
import java.io.IOException;
import java.util.Properties;

import org.apache.commons.io.FileUtils;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.server.ServerConstants;

/**
 * @author Matt Small
 * @version $Rev$ - $Date$
 */
public class TestProject extends WMTestCase {

    File tempDir = null;
    
    @Override
    public void setUp() throws Exception {
        SpringUtils.initSpringConfig();
        tempDir = IOUtils.createTempDirectory();
    }
    
    @Override
    public void tearDown() throws Exception {
        IOUtils.deleteRecursive(tempDir);
    }
    
    public void testProjectName() {
        
        String projectName = "foo";
        
        File projectRoot = new File(tempDir, projectName);
        
        Project p = new Project(projectRoot);
        assertEquals(projectName, p.getProjectName());
    }
    
    public void testProjectUnicode() throws IOException {
        
        String projectName = "foo";
        File projectRoot = new File(tempDir, projectName);
        projectRoot.mkdir();
        Project p = new Project(projectRoot);
        
        p.writeFile("foo.txt", "école マット");
        
        byte[] bytes = FileUtils.readFileToByteArray(new File(projectRoot,
                "foo.txt"));
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
        
        try {
            File projectRoot = new File(tempDir, projectName);
            projectRoot.mkdir();
            Project p = new Project(projectRoot);
            
            assertEquals(Double.valueOf(Project.PROPERTY_PROJECT_VERSION_DEFAULT),
                    p.getProjectVersion());
            
            Properties props = p.getProperties();
            props.setProperty(Project.PROPERTY_PROJECT_VERSION, "12.2");
            p.setProperties(props);
            
            assertEquals(12.2, p.getProjectVersion());
        } finally {
            FileUtils.forceDelete(tempDir);
        }
    }

    public void testGetWebInfClasses() throws Exception {

        String projectName = "testGetWebInfClasses";

        File tempDir = IOUtils.createTempDirectory();
        File projectRoot = new File(tempDir, projectName);
        projectRoot.mkdir();
        Project p = new Project(projectRoot);

        File webinfClasses = new File(new File(new File(projectRoot,
                ProjectConstants.WEB_DIR), ProjectConstants.WEB_INF), "classes");
        assertEquals(webinfClasses, p.getWebInfClasses());
    }
}