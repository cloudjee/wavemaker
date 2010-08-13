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
package com.wavemaker.tools.project.upgrade.swamis;

import java.io.File;

import org.apache.commons.io.FileUtils;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestPanesRenameUpgrade extends WMTestCase {

    public void testUpgrade() throws Exception {
        
        File root = IOUtils.createTempDirectory("testUpgrade", ".dir");
        
        Project p = new  Project(root);
        p.getWebAppRoot().mkdir();
        File panes = new File(p.getWebAppRoot(), "panes");
        panes.mkdir();
        File panesFile = new File(panes, "foo.txt");
        FileUtils.writeStringToFile(panesFile, "foo");
        File pages = new File(p.getWebAppRoot(), ProjectConstants.PAGES_DIR);
        assertFalse(pages.exists());
        
        PanesRenameUpgrade pru = new PanesRenameUpgrade();
        pru.doUpgrade(p, new UpgradeInfo());
        
        assertTrue(pages.exists());
        assertFalse(panes.exists());
        
        File pagesFile = new File(pages, "foo.txt");
        assertTrue(pagesFile.exists());
        assertEquals("foo", FileUtils.readFileToString(pagesFile));
    }
    
    public void testUpgradeEmpty() throws Exception {
        
        File root = IOUtils.createTempDirectory("testUpgrade", ".dir");
        
        Project p = new  Project(root);
        p.getWebAppRoot().mkdir();
        File panes = new File(p.getWebAppRoot(), "panes");
        File pages = new File(p.getWebAppRoot(), ProjectConstants.PAGES_DIR);
        assertFalse(pages.exists());
        
        PanesRenameUpgrade pru = new PanesRenameUpgrade();
        pru.doUpgrade(p, new UpgradeInfo());
        
        assertFalse(pages.exists());
        assertFalse(panes.exists());
    }
}