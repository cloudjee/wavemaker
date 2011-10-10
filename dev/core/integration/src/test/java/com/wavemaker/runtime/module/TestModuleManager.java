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

package com.wavemaker.runtime.module;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.net.URL;
import java.net.URLConnection;
import java.util.Arrays;
import java.util.Set;

import org.apache.commons.io.IOUtils;
import org.junit.Test;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.runtime.test.TestSpringContextTestCase;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestModuleManager extends TestSpringContextTestCase {

    @Test
    public void testBootstrapLoad() throws Exception {

        ModuleManager mm = (ModuleManager) getBean("moduleManager");

        boolean gotFoo = false;
        boolean gotBar = false;
        boolean gotBaz = false;
        for (Tuple.Two<URL, ModuleWire> tuple : mm.getModuleLocations().values()) {
            if ("foo".equals(tuple.v2.getExtensionPoint())) {
                gotFoo = true;
            } else if ("bar".equals(tuple.v2.getExtensionPoint())) {
                gotBar = true;
            } else if ("baz".equals(tuple.v2.getExtensionPoint())) {
                gotBaz = true;
            }
        }
        assertTrue(gotFoo);
        assertTrue(gotBar);
        assertTrue(gotBaz);

        ModuleWire fooMW = mm.getModule("foo");
        ModuleWire barMW = mm.getModule("bar");

        File barFile = mm.getModuleRoot(barMW.getName());
        assertTrue(barFile.exists());
        assertFalse(barFile.getName().toLowerCase().endsWith(".jar"));

        File fooFile = mm.getModuleRoot(fooMW.getName());
        assertTrue(fooFile.exists());
        assertTrue(fooFile.getName().toLowerCase().endsWith(".jar"));

        try {
            mm.getModule("conflict");
        } catch (WMRuntimeException e) {
            assertEquals(MessageResource.TOO_MANY_MODULES_FOR_EXTENSION_POINT.getId(), e.getMessageId());
        }
        assertEquals(2, mm.getModules("conflict").size());
    }

    @Test
    public void testListExtensionPoints() throws Exception {

        ModuleManager mm = (ModuleManager) getBean("moduleManager");

        Set<String> extensionPoints = mm.listExtensionPoints();
        assertTrue(extensionPoints.contains("conflict"));
        assertTrue(extensionPoints.contains("bar"));
    }

    @Test
    public void testListModules() throws Exception {

        ModuleManager mm = (ModuleManager) getBean("moduleManager");

        Set<String> modules = mm.listModules();
        assertTrue(modules.contains("conflictModuleOne"));
        assertTrue(modules.contains("barModule"));
    }

    @Test
    public void testGetModuleRoot() throws Exception {

        ModuleManager mm = (ModuleManager) getBean("moduleManager");

        ModuleWire mw = mm.getModule("bar");
        assertNotNull(mw);
        File f = mm.getModuleRoot(mw.getName());
        assertTrue(f.isDirectory());
        assertTrue("f.list: " + Arrays.toString(f.list()) + "\nf: " + f, Arrays.asList(f.list()).contains("bar-module-contents.txt"));

        mw = mm.getModule("foo");
        assertNotNull(mw);
        f = mm.getModuleRoot(mw.getName());
        assertFalse(f.isDirectory());
        assertTrue("f: " + f, f.toString().endsWith(".jar"));
    }

    @Test
    public void testGetModuleResource() throws Exception {

        ModuleManager mm = (ModuleManager) getBean("moduleManager");

        ModuleWire mw = mm.getModule("bar");
        assertNotNull(mw);

        URL url = mm.getModuleResource(mw, "bar-module-contents.txt");
        URLConnection conn = url.openConnection();
        String contents = IOUtils.toString(conn.getInputStream());
        assertEquals("bar module contents\n", contents);

        mw = mm.getModule("foo");
        assertNotNull(mw);

        url = mm.getModuleResource(mw, "foo-module-contents.txt");
        conn = url.openConnection();
        contents = IOUtils.toString(conn.getInputStream());
        assertEquals("foo module contents\n", contents);
    }

    @Test
    public void testGetModuleByName() throws Exception {

        ModuleManager mm = (ModuleManager) getBean("moduleManager");

        ModuleWire fooMW = mm.getModuleByName("fooModule");
        assertNotNull(fooMW);

        ModuleWire barMW = mm.getModuleByName("barModule");
        assertNotNull(barMW);

        ModuleWire conflictMW = mm.getModuleByName("conflictModuleOne");
        assertNotNull(conflictMW);
    }
}
