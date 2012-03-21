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

import org.junit.Test;

import com.wavemaker.infra.WMTestCase;

/**
 * @author Matt Small
 */
public class VersionInfoTest extends WMTestCase {

    public void testBasic() throws Exception {
        VersionInfo vi = new VersionInfo("1.2.35");
        assertEquals(1, vi.getMajor());
        assertEquals(2, vi.getMinor());
        assertEquals(3, vi.getRevision());
        assertTrue(vi.isRelease());
        assertNull(vi.getReleaseStatus());
        assertEquals("1.2.3", vi.toString());
    }

    public void testWithStatus() throws Exception {
        VersionInfo vi = new VersionInfo("1.2.3ALPHA");
        assertEquals(1, vi.getMajor());
        assertEquals(2, vi.getMinor());
        assertEquals(3, vi.getRevision());
        assertFalse(vi.isRelease());
        assertEquals("ALPHA", vi.getReleaseStatus());
        assertEquals("1.2.3ALPHA", vi.toString());
    }

    public void testLonger() throws Exception {
        VersionInfo vi = new VersionInfo("1.2.34ALPHA");
        assertEquals(1, vi.getMajor());
        assertEquals(2, vi.getMinor());
        assertEquals(34, vi.getRevision());
        assertFalse(vi.isRelease());
        assertEquals("ALPHA", vi.getReleaseStatus());
    }

    public void testCompare() throws Exception {
        VersionInfo vi = new VersionInfo("1.2.3ALPHA");

        VersionInfo other = new VersionInfo("2.2.3");
        assertTrue(vi.compareTo(other) < 0);
        assertTrue(other.compareTo(vi) > 0);

        other = new VersionInfo("1.3.3");
        assertTrue(vi.compareTo(other) < 0);
        assertTrue(other.compareTo(vi) > 0);

        other = new VersionInfo("1.2.4");
        assertTrue(vi.compareTo(other) < 0);
        assertTrue(other.compareTo(vi) > 0);

        other = new VersionInfo("1.2.3ALPHA");
        assertEquals(0, vi.compareTo(other));
        assertEquals(0, other.compareTo(vi));

        other = new VersionInfo("1.2.3BETA");
        assertTrue(vi.compareTo(other) < 0);
        assertTrue(other.compareTo(vi) > 0);

        other = new VersionInfo("1.2.3ALPHA2");
        assertTrue(vi.compareTo(other) < 0);
        assertTrue(other.compareTo(vi) > 0);
    }

    @Test
    public void testMavenSnapshotStyle() throws Exception {
        VersionInfo vi = new VersionInfo("1.2.3.BUILD-SNAPSHOT");
        assertEquals(1, vi.getMajor());
        assertEquals(2, vi.getMinor());
        assertEquals(3, vi.getRevision());
        assertFalse(vi.isRelease());
        assertEquals("BUILD-SNAPSHOT", vi.getReleaseStatus());
        assertEquals("1.2.3.BUILD-SNAPSHOT", vi.toString());
    }

    @Test
    public void testMavenMilestoneStyle() throws Exception {
        VersionInfo vi = new VersionInfo("1.2.3.M2");
        assertEquals(1, vi.getMajor());
        assertEquals(2, vi.getMinor());
        assertEquals(3, vi.getRevision());
        assertFalse(vi.isRelease());
        assertEquals("M2", vi.getReleaseStatus());
        assertEquals("1.2.3.M2", vi.toString());
    }

    @Test
    public void testMavenReleaseStyle() throws Exception {
        VersionInfo vi = new VersionInfo("1.2.3.RELEASE");
        assertEquals(1, vi.getMajor());
        assertEquals(2, vi.getMinor());
        assertEquals(3, vi.getRevision());
        assertTrue(vi.isRelease());
        assertEquals("RELEASE", vi.getReleaseStatus());
        assertEquals("1.2.3.RELEASE", vi.toString());
    }
}
