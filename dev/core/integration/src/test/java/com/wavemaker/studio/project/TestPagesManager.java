/*
 * Copyright (C) 2008 WaveMaker Software, Inc.
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
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.ClassPathResource;

import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.PagesManager;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestPagesManager extends StudioTestCase {

    PagesManager pagesManager = null;
    
    @Before
    @Override
    public void setUp() throws Exception {
        
        super.setUp();
        
        ApplicationContext ac = getApplicationContext();
        pagesManager = (PagesManager) ac.getBean("pagesManager");
    }
    
    @Test public void testGetPageDir() throws Exception {
        
        String projectName = "testGetPageDir";
        
        makeProject(projectName);
        File projectRoot = pagesManager.getProjectManager().getCurrentProject().
                getProjectRoot();
        
        File actualPagesDir = pagesManager.getPagesDir(projectName);
        File expectedPagesDir = new File(projectRoot, "webapproot/pages");
        assertEquals(expectedPagesDir, actualPagesDir);
        
        File actualPageDir = pagesManager.getPageDir(projectName, "foo");
        File expectedPageDir = new File(actualPagesDir, "foo");
        assertEquals(expectedPageDir, actualPageDir);
    }

    @Test public void testPagesCopyWithRename() throws Exception {
        
        String sourceProject = "testPagesCopy_sourceProject";
        String destProject = "testPagesCopy_destProject";
        String sourcePage = "Main";
        String destPage = "expectedMain";
        
        makeProject(destProject);
        makeProject(sourceProject);
        
        File testPagesDir = (new ClassPathResource(
                "com/wavemaker/tools/project/pages")).getFile();
        assertTrue(testPagesDir.exists());
        
        FileUtils.forceMkdir(pagesManager.getPagesDir(sourceProject));
        FileUtils.copyDirectory(new File(testPagesDir, sourcePage),
                new File(pagesManager.getPagesDir(sourceProject), sourcePage));
        assertTrue(pagesManager.getPageDir(sourceProject, sourcePage).exists());
        
        pagesManager.copyPage(sourceProject, sourcePage, destProject, destPage);
        
        File actualPageDir = pagesManager.getPageDir(destProject, destPage);
        assertTrue(actualPageDir.exists());
        List<File> files = Arrays.asList(actualPageDir.listFiles());
        assertEquals(4, files.size());
        
        List<String> fileNames = Arrays.asList(actualPageDir.list());
        assertTrue(fileNames.contains(destPage+".html"));
        assertTrue(fileNames.contains(destPage+".css"));
        assertTrue(fileNames.contains(destPage+".js"));
        assertTrue(fileNames.contains(destPage+".widgets.js"));
        
        File expectedPagesDir = new File(testPagesDir, destPage);
        for (File actual: actualPageDir.listFiles()) {
            File expected = new File(expectedPagesDir, actual.getName());
            assertTrue("page "+expected+" DNE", expected.exists());
            assertEquals(FileUtils.readFileToString(expected).trim(),
                    FileUtils.readFileToString(actual).trim());
        }
    }
}