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

package com.wavemaker.tools.config;

import java.util.prefs.Preferences;

import com.wavemaker.infra.WMTestCase;
import com.wavemaker.testsupport.UtilTest;
import com.wavemaker.tools.project.VersionInfo;

/**
 * @author Matt Small
 */
public class ConfigurationStoreTest extends WMTestCase {

    private String semaphore;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        this.semaphore = UtilTest.lockSemaphore(getClass().getName());
    }

    @Override
    public void tearDown() throws Exception {
        UtilTest.unlockSemaphore(this.semaphore);
        Preferences.userNodeForPackage(getClass()).removeNode();
    }

    public void testNonVersioned() throws Exception {

        ConfigurationStore.setPreference(getClass(), "foo", "bar");
        assertEquals("bar", ConfigurationStore.getPreference(getClass(), "foo", "baz"));
        ConfigurationStore.removePreference(getClass(), "foo");
        assertEquals("baz", ConfigurationStore.getPreference(getClass(), "foo", "baz"));
    }

    public void testGetRootVersionedNode() throws Exception {

        Preferences p = ConfigurationStore.getRootVersionedNode(getClass(), "foo");
        assertEquals("/com/wavemaker/tools/config/wm_versioned__foo", p.absolutePath());
    }

    public void testGetLessThanEqualVersionedNode() throws Exception {

        String key = "testGetLessThanEqualVersionedNode";
        VersionInfo vi = new VersionInfo("1.2.3");

        ConfigurationStore.setPreference(getClass(), key, "a");

        Preferences p = ConfigurationStore.getRootVersionedNode(getClass(), key);
        p = p.node(vi.toString());
        p.put(key, "b");
        String expected = p.absolutePath();

        Preferences pp = ConfigurationStore.getLessThanEqualVersionedNode(getClass(), key, vi);
        assertEquals(expected, pp.absolutePath());

        // try a lower version, so this should return the default location
        pp = ConfigurationStore.getLessThanEqualVersionedNode(getClass(), key, new VersionInfo("1.2.0"));
        assertEquals(Preferences.userNodeForPackage(getClass()).absolutePath(), pp.absolutePath());

        // and add a bad preferences string
        Preferences pbad = ConfigurationStore.getRootVersionedNode(getClass(), key);
        pbad = pbad.node("foofoo");
        pbad.put(key, "b");

        pp = ConfigurationStore.getLessThanEqualVersionedNode(getClass(), key, vi);
        assertEquals(expected, pp.absolutePath());

        // add a higher version
        Preferences phigher = ConfigurationStore.getRootVersionedNode(getClass(), key);
        phigher = phigher.node(new VersionInfo("4.5.4").toString());
        phigher.put(key, "b");

        pp = ConfigurationStore.getLessThanEqualVersionedNode(getClass(), key, vi);
        assertEquals(expected, pp.absolutePath());
    }

    public void testGetExactVersionedNode() throws Exception {

        String key = "testGetExactVersionedNode";
        VersionInfo vi = new VersionInfo("1.2.3");

        ConfigurationStore.setPreference(getClass(), key, "a");

        Preferences p = ConfigurationStore.getRootVersionedNode(getClass(), key);
        p = p.node(vi.toString());
        p.put(key, "b");
        String expected = p.absolutePath();

        Preferences pp = ConfigurationStore.getExactVersionedNode(getClass(), key, vi);
        assertEquals(expected, pp.absolutePath());

        // and add a bad preferences string
        Preferences pbad = ConfigurationStore.getRootVersionedNode(getClass(), key);
        pbad = pbad.node("foofoo");
        pbad.put(key, "b");

        pp = ConfigurationStore.getExactVersionedNode(getClass(), key, vi);
        assertEquals(expected, pp.absolutePath());

        // add a higher version
        Preferences phigher = ConfigurationStore.getRootVersionedNode(getClass(), key);
        phigher = phigher.node(new VersionInfo("4.5.4").toString());
        phigher.put(key, "b");

        pp = ConfigurationStore.getExactVersionedNode(getClass(), key, vi);
        assertEquals(expected, pp.absolutePath());
    }

    public void testVersioned() throws Exception {

        String key = "testVersioned";

        ConfigurationStore.setPreference(getClass(), key, "nonversioned");
        assertEquals("nonversioned", ConfigurationStore.getPreference(getClass(), key, null));

        ConfigurationStore.setVersionedPreference(getClass(), key, "versioned");
        assertEquals("versioned", ConfigurationStore.getPreference(getClass(), key, null));

        ConfigurationStore.setVersionedPreference(getClass(), key, "versioned2");
        assertEquals("versioned2", ConfigurationStore.getPreference(getClass(), key, null));
    }

    public void testSetVersioned_NoPreexisting() throws Exception {

        String key = "testSetVersioned_NoPreexisting";

        ConfigurationStore.setVersionedPreference(getClass(), key, "versioned");
        assertEquals("versioned", ConfigurationStore.getPreference(getClass(), key, null));

        // make sure that an older version gets a default value
        Preferences p = ConfigurationStore.getLessThanEqualVersionedNode(getClass(), key, new VersionInfo("1.1.1"));
        String result = p.get(key, null);
        assertNull("result was: " + result, result);

        ConfigurationStore.setPreference(getClass(), key, "nonversioned");

        p = ConfigurationStore.getLessThanEqualVersionedNode(getClass(), key, new VersionInfo("1.1.1"));
        result = p.get(key, null);
        assertEquals("nonversioned", result);
    }
}
