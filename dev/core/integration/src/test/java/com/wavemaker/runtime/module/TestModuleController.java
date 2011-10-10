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

package com.wavemaker.runtime.module;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import javax.servlet.http.HttpServletResponse;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.servlet.support.WebContentGenerator;

import com.wavemaker.common.util.Tuple;
import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.runtime.test.TestSpringContextTestCase;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestModuleController extends TestSpringContextTestCase {

    @Test
    public void testParseRequestPath() throws Exception {

        ModuleController mc = (ModuleController) getBean("wmModuleController");
        assertNotNull(mc);

        MockHttpServletRequest mhsr = new MockHttpServletRequest(WebContentGenerator.METHOD_GET, "/modules/id/barModule/module-configuration.xml");
        Tuple.Two<ModuleWire, String> result = mc.parseRequestPath(mhsr.getRequestURI());
        assertNotNull(result);
        assertEquals("barModule", result.v1.getName());
        assertEquals("module-configuration.xml", result.v2);

        mhsr = new MockHttpServletRequest(WebContentGenerator.METHOD_GET, "/modules/ep/bar/module-configuration.xml");
        result = mc.parseRequestPath(mhsr.getRequestURI());
        assertNotNull(result);
        assertEquals("barModule", result.v1.getName());
        assertEquals("module-configuration.xml", result.v2);
    }

    @Test
    public void testListExtensions() throws Exception {

        ModuleController mc = (ModuleController) getBean("wmModuleController");
        assertNotNull(mc);

        MockHttpServletRequest req = new MockHttpServletRequest(WebContentGenerator.METHOD_GET, "/wavemaker/modules/ep/");
        MockHttpServletResponse resp = new MockHttpServletResponse();

        mc.handleRequest(req, resp);

        assertEquals(HttpServletResponse.SC_OK, resp.getStatus());
        String contents = resp.getContentAsString();

        assertTrue(contents.startsWith("<html>"));
        assertTrue(contents.endsWith("</html>\n"));
        assertFalse(contents.contains("\nconflictModuleOne<br />\n"));
        assertFalse(contents.contains("\nbarModule<br />\n"));
        assertTrue(contents.contains("\nconflict<br />\n"));
        assertTrue(contents.contains("\nbar<br />\n"));

        req = new MockHttpServletRequest(WebContentGenerator.METHOD_GET, "/wavemaker/modules/ep");
        resp = new MockHttpServletResponse();

        mc.handleRequest(req, resp);

        assertEquals(contents, resp.getContentAsString());
    }

    @Test
    public void testListIds() throws Exception {

        ModuleController mc = (ModuleController) getBean("wmModuleController");
        assertNotNull(mc);

        MockHttpServletRequest req = new MockHttpServletRequest(WebContentGenerator.METHOD_GET, "/wavemaker/modules/id/");
        MockHttpServletResponse resp = new MockHttpServletResponse();

        mc.handleRequest(req, resp);

        assertEquals(HttpServletResponse.SC_OK, resp.getStatus());
        String contents = resp.getContentAsString();

        assertTrue(contents.startsWith("<html>"));
        assertTrue(contents.endsWith("</html>\n"));
        assertTrue(contents.contains("\nconflictModuleOne<br />\n"));
        assertTrue(contents.contains("\nbarModule<br />\n"));
        assertFalse(contents.contains("\nconflict<br />\n"));
        assertFalse(contents.contains("\nbar<br />\n"));

        req = new MockHttpServletRequest(WebContentGenerator.METHOD_GET, "/wavemaker/modules/id");
        resp = new MockHttpServletResponse();

        mc.handleRequest(req, resp);

        assertEquals(contents, resp.getContentAsString());
    }

    @Test
    public void testGetModuleFiles() throws Exception {

        ModuleController mc = (ModuleController) getBean("wmModuleController");
        assertNotNull(mc);

        MockHttpServletRequest req = new MockHttpServletRequest(WebContentGenerator.METHOD_GET,
            "/wavemaker/modules/id/fooModule/foo-module-contents.txt");
        MockHttpServletResponse resp = new MockHttpServletResponse();

        mc.handleRequest(req, resp);

        assertEquals(HttpServletResponse.SC_OK, resp.getStatus());
        assertEquals("text/plain", resp.getContentType());
        String contents = resp.getContentAsString();
        assertEquals("foo module contents\n", contents);

        req = new MockHttpServletRequest(WebContentGenerator.METHOD_GET, "/wavemaker/modules/ep/foo/foo-module-contents.txt");
        resp = new MockHttpServletResponse();

        mc.handleRequest(req, resp);

        assertEquals(HttpServletResponse.SC_OK, resp.getStatus());
        assertEquals("text/plain", resp.getContentType());
        assertEquals(contents, resp.getContentAsString());

        req = new MockHttpServletRequest(WebContentGenerator.METHOD_GET, "/wavemaker/modules/ep/fooDNE/foo-module-contents.txt");
        resp = new MockHttpServletResponse();

        mc.handleRequest(req, resp);

        assertEquals(HttpServletResponse.SC_NOT_FOUND, resp.getStatus());
    }

    @Test
    public void testGetModuleJS() throws Exception {

        ModuleController mc = (ModuleController) getBean("wmModuleController");
        assertNotNull(mc);

        MockHttpServletRequest req = new MockHttpServletRequest(WebContentGenerator.METHOD_GET, "/wavemaker/modules/modules.js");
        MockHttpServletResponse resp = new MockHttpServletResponse();

        mc.handleRequest(req, resp);

        assertEquals(HttpServletResponse.SC_OK, resp.getStatus());
        assertEquals("application/json", resp.getContentType());
        String contents = resp.getContentAsString();

        JSON j = JSONUnmarshaller.unmarshal(contents);
        assertTrue(j instanceof JSONObject);
        JSONObject jo = (JSONObject) j;
        assertTrue(jo.containsKey("extensionPoints"));
        jo = (JSONObject) jo.get("extensionPoints");
        assertTrue(jo.containsKey("conflict"));

        assertTrue(jo.get("conflict") instanceof JSONArray);
        assertTrue(((JSONArray) jo.get("conflict")).contains("conflictModuleOne"));
    }
}
