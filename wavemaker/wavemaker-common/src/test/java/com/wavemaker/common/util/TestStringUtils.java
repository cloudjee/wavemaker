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

package com.wavemaker.common.util;

import java.util.List;

import com.wavemaker.infra.WMTestCase;

/**
 * @author Simon Toens
 */
public class TestStringUtils extends WMTestCase {

    public void testToJavaIdentifier1() {
        String s = StringUtils.toJavaIdentifier("1234", '_');
        assertEquals("_1234", s);
    }

    public void testToJavaIdentifier2() {
        String s = StringUtils.toJavaIdentifier("import", '_');
        assertEquals("_import", s);
    }

    public void testToJavaIdentifier3() {
        String s = StringUtils.toJavaIdentifier("my&name", '_');
        assertEquals("my_name", s);
    }

    public void testSplit1() {
        List<String> l = StringUtils.split("a,b,c");
        assertTrue(l.size() == 3);
        assertTrue(l.get(0).equals("a"));
        assertTrue(l.get(1).equals("b"));
        assertTrue(l.get(2).equals("c"));
    }

    public void testSplit2() {
        List<String> l = StringUtils.split("a,d:{a:b,c:d},c");
        assertTrue(l.size() == 3);
        assertTrue(l.get(0).equals("a"));
        assertTrue(l.get(1).equals("d:{a:b,c:d}"));
        assertTrue(l.get(2).equals("c"));
    }

    public void testSplit3() {
        List<String> l = StringUtils.split("a,d:{a:b,c:d},'c,d,e',f");
        assertTrue(l.size() == 4);
        assertTrue(l.get(0).equals("a"));
        assertTrue(l.get(1).equals("d:{a:b,c:d}"));
        assertTrue(l.get(2).equals("'c,d,e'"));
        assertTrue(l.get(3).equals("f"));
    }

    public void testSplit4() {
        List<String> l = StringUtils.split("{}, {}");
        assertTrue(l.size() == 2);
        assertTrue(l.get(0).equals("{}"));
        assertTrue(l.get(1).equals("{}"));
    }

    public void testSplit5() {
        List<String> l = StringUtils.split("{}, {}");
        assertTrue(l.size() == 2);
        assertTrue(l.get(0).equals("{}"));
        assertTrue(l.get(1).equals("{}"));
    }

    public void testSplit6() {
        List<String> l = StringUtils.split("nKDv8_LV34F3PdYFDoVQCgoCPmQVN7N0nvLypL26TuY6tA0MR5E.9CqtY7QEkn64,301 Howard,San Francisco,CA");
        assertTrue(l.size() == 4);
        assertTrue(l.get(0).equals("nKDv8_LV34F3PdYFDoVQCgoCPmQVN7N0nvLypL26TuY6tA0MR5E.9CqtY7QEkn64"));
        assertTrue(l.get(1).equals("301 Howard"));
        assertTrue(l.get(2).equals("San Francisco"));
        assertTrue(l.get(3).equals("CA"));
    }

    public void testSplitList() {
        List<String> l = StringUtils.split("[a,b,c]");
        assertEquals(1, l.size());
        assertEquals("[a,b,c]", l.get(0));
    }
}