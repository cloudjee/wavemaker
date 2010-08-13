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
package com.wavemaker.studio;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.SortedSet;

import org.apache.commons.io.FileUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.studio.infra.StudioTestCase;

/**
 * @author small
 * @version $Rev$ - $Date$
 */
public class TestPagesService extends StudioTestCase {
    
    PagesService pagesService;
    
    @Override
    public void onSetUp() throws Exception {

        super.onSetUp();
        
        pagesService = (PagesService) getApplicationContext().getBean("pagesService");
    }
    
    public void testEmptyPagesList() throws Exception {
        
        String projectName = "testEmptyPagesList";
        makeProject(projectName);
        
        Object o = invokeService_toObject("pagesService",
                "listPages", null);
        assertNotNull(o);
        assertTrue(o instanceof SortedSet);
        assertEquals(0, ((SortedSet<?>)o).size());
    }
    
    @SuppressWarnings("unchecked")
    public void testPagesList() throws Exception {
        
        String projectName = "testPagesList";
        makeProject(projectName);
        
        invokeService_toObject("studioService",
                "writeWebFile", new Object[] {"pages/pageA/pageA.js", "hihi"});
        invokeService_toObject("studioService",
                "writeWebFile", new Object[] {"pages/pageB/pageB.js", "byebye"});
        invokeService_toObject("studioService",
                "writeWebFile", new Object[] {"pages/.svn/pageB.js", "byebye"});
        
        Object o = invokeService_toObject("pagesService",
                "listPages", null);
        assertNotNull(o);
        assertTrue(o instanceof SortedSet);
        SortedSet<String> output = (SortedSet<String>) o;
        assertEquals(2, output.size());
        
        List<String> expected = new ArrayList<String>(2);
        expected.add("pageB");
        expected.add("pageA");

        Collections.sort(expected);
        assertEquals(expected, output);
        
        invokeService_toObject("pagesService",
                "deletePage", new Object[] {"pageB"});
        expected.remove("pageB");
        
        o = invokeService_toObject("pagesService",
                "listPages", null);
        assertNotNull(o);
        assertTrue(o instanceof SortedSet);
        output = (SortedSet<String>) o;
        assertEquals(1, output.size());
       
        Collections.sort(expected);
        assertEquals(expected, output);
        
        makeProject("otherProject");
        o = invokeService_toObject("pagesService",
                "listPages", new Object[]{projectName});
        assertNotNull(o);
        assertTrue(o instanceof SortedSet);
        SortedSet output2 = (SortedSet) o;
        assertEquals(output.size(), output2.size());
        assertEquals(output, output2);
    }
    
    public void testPagesCopy() throws Exception {
        
        String sourceProject = "testPagesCopy_sourceProject";
        String destProject = "testPagesCopy_destProject";
        
        makeProject(destProject);
        makeProject(sourceProject);

        invokeService_toObject("studioService",
                "writeWebFile", new Object[] {"pages/pageA/pageA.js", "hihi"});
        invokeService_toObject("studioService",
                "writeWebFile", new Object[] {"pages/pageA/pageA.html", "hihi"});
        invokeService_toObject("studioService",
                "writeWebFile", new Object[] {"pages/pageA/pageA.widgets.js", "hihi"});
        invokeService_toObject("studioService",
                "writeWebFile", new Object[] {"pages/pageA/pageA.css", "hihi"});
        
        invokeService_toObject("studioService",
                "writeWebFile", new Object[] {"pages/pageB/pageB.js", "byebye"});
        
        File actual = new File(
                pagesService.getPagesManager().getProjectManager().
                    getProjectDir(destProject, false),
                "webapproot/pages/pageA");
        File expected = new File(
                pagesService.getPagesManager().getProjectManager().
                    getProjectDir(sourceProject, false),
                "webapproot/pages/pageA");
        assertTrue(!actual.exists());
        assertTrue(expected.exists());
        File expectedSvn = new File(expected, ".svn");
        expectedSvn.mkdir();

        invokeService_toObject("studioService",
                "openProject", new Object[] {destProject});

        invokeService_toObject("pagesService",
                "copyPage", new Object[] {sourceProject, "pageA", "pageA"});
        assertTrue(actual.exists());
        
        File actualJS = new File(actual, "pageA.js");
        File expectedJS = new File(expected, "pageA.js");
        assertEquals(FileUtils.readFileToString(expectedJS),
                FileUtils.readFileToString(actualJS));
        
        File actualSvn = new File(actual, ".svn");
        assertFalse(actualSvn.exists());
        
        // try a failing copy because the dest already exists
        boolean gotException = false;
        try {
            invokeService_toObject("pagesService",
                    "copyPage", new Object[] {sourceProject, "pageA", "pageA"});
        } catch (WMRuntimeException e) {
            gotException = true;
            assertTrue(e.getMessage().contains("already exists"));
        }
        assertTrue(gotException);
        
        // try a failing copy because the source doesn't exist
        gotException = false;
        try {
            invokeService_toObject("pagesService",
                    "copyPage", new Object[] {sourceProject, "pageDNE", "pageDNE"});
        } catch (WMRuntimeException e) {
            gotException = true;
            assertTrue(e.getMessage().contains("does not exist"));
        }
        assertTrue(gotException);
    }
}
