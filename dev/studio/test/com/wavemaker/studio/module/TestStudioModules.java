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
package com.wavemaker.studio.module;

import java.util.List;

import org.springframework.core.io.ClassPathResource;

import com.wavemaker.runtime.module.ModuleManager;
import com.wavemaker.runtime.module.ModuleWire;
import com.wavemaker.studio.infra.StudioTestCase;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestStudioModules extends StudioTestCase {
    
    private static String PROJECT_TYPE = System.getProperty("test.project.type");

    public void testLoadedJars() throws Exception {
        
        
        String[] localResources = new String[]{"local.src.resource", "local.jar.resource"};
        String[] cloudResources = new String[]{"cloud.src.resource", "cloud.jar.resource"};
        
        if ("community".equals(PROJECT_TYPE)) {
            for (String str: localResources) {
                ClassPathResource cpr = new ClassPathResource(str);
                assertTrue("cpr not found: "+cpr, cpr.exists());
            }
            
            for (String str: cloudResources) {
                ClassPathResource cpr = new ClassPathResource(str);
                assertFalse("cpr found: "+cpr, cpr.exists());
            }
        } else if ("enterprise".equals(PROJECT_TYPE)) {
            for (String str: localResources) {
                ClassPathResource cpr = new ClassPathResource(str);
                assertTrue("cpr not found: "+cpr, cpr.exists());
            }
            
            for (String str: cloudResources) {
                ClassPathResource cpr = new ClassPathResource(str);
                assertFalse("cpr found: "+cpr, cpr.exists());
            }
        } else if ("cloud".equals(PROJECT_TYPE)) {
            for (String str: cloudResources) {
                ClassPathResource cpr = new ClassPathResource(str);
                assertTrue("cpr not found: "+cpr, cpr.exists());
            }
            
            for (String str: localResources) {
                ClassPathResource cpr = new ClassPathResource(str);
                assertFalse("cpr found: "+cpr, cpr.exists());
            }
        } else {
            fail("unknown project type: "+PROJECT_TYPE);
        }
    }
    
    public void testLoadedModules() throws Exception {
        
        ModuleManager mm = (ModuleManager) getBean("moduleManager");
        assertNotNull(mm);
        
        if ("community".equals(PROJECT_TYPE)) {
            List<ModuleWire> modules = mm.getModules("local");
            assertNotNull(modules);
            assertTrue(modules.size()>0);
            
            boolean foundModule = false;
            for (ModuleWire mw: modules) {
                if (mw.getName().equals("wm.local")) {
                    foundModule = true;
                }
            }
            assertTrue(foundModule);

            modules = mm.getModules("cloud");
            assertNotNull(modules);
            assertEquals(0, modules.size());
        } else if ("enterprise".equals(PROJECT_TYPE)) {
            List<ModuleWire> modules = mm.getModules("local");
            assertNotNull(modules);
            assertTrue(modules.size()>0);
            
            boolean foundModule = false;
            for (ModuleWire mw: modules) {
                if (mw.getName().equals("wm.local")) {
                    foundModule = true;
                }
            }
            assertTrue(foundModule);

            modules = mm.getModules("cloud");
            assertNotNull(modules);
            assertEquals(0, modules.size());
        } else if ("cloud".equals(PROJECT_TYPE)) {
            List<ModuleWire> modules = mm.getModules("cloud");
            assertNotNull(modules);
            assertTrue(modules.size()>0);

            boolean foundModule = false;
            for (ModuleWire mw: modules) {
                if (mw.getName().equals("wm.cloud")) {
                    foundModule = true;
                }
            }
            assertTrue(foundModule);

            modules = mm.getModules("local");
            assertNotNull(modules);
            assertEquals(0, modules.size());
        } else {
            fail("unknown project type: "+PROJECT_TYPE);
        }
    }
}