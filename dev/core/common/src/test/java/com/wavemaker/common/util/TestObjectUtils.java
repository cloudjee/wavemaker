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

import java.util.ArrayList;
import java.util.List;

import com.wavemaker.infra.WMTestCase;

/**
 * @author Simon Toens
 */
public class TestObjectUtils extends WMTestCase {

    @SuppressWarnings("unchecked")
    public void testToArray() {
        List l = new ArrayList(3);
        l.add("s1");
        l.add("s2");
        l.add("s3");
        String s[] = (String[]) ObjectUtils.toArray(l, String.class);
        assertTrue(s[0].equals("s1"));
        assertTrue(s[1].equals("s2"));
        assertTrue(s[2].equals("s3"));
    }

    public void testAddArrays() {
        String[] s1 = { "s1", "s2", "s3" };
        String[] s2 = { "s4", "s5", "s6" };
        String[] s3 = { "s7", "s8", "s9" };

        String[] all = (String[]) ObjectUtils.addArrays(s1, s2, s3);

        assertTrue(all.length == 9);

        for (int i = 0; i < 9; i++) {
            assertTrue(all[i].equals("s" + (i + 1)));
        }
    }

    public void testGetArrayTypeArray() {

        int[] is = new int[] { 1, 2, 3 };
        Integer[] Is = new Integer[] { 1, 2, 3 };
        String[] ss = new String[] { "1", "2", "3" };

        assertEquals(int.class, ObjectUtils.getArrayType(is));
        assertEquals(Integer.class, ObjectUtils.getArrayType(Is));
        assertEquals(String.class, ObjectUtils.getArrayType(ss));
    }

    public void testGetArrayTypeCollection() {

        List<Integer> Is = new ArrayList<Integer>();
        Is.add(Integer.valueOf(1));
        Is.add(Integer.valueOf(2));

        List<Object> Is2 = new ArrayList<Object>();
        Is2.add(Integer.valueOf(1));
        Is2.add(Integer.valueOf(2));

        List<Object> mm = new ArrayList<Object>();
        mm.add("foo");
        mm.add(Integer.valueOf(1));

        Object[] os = new Object[2];
        os[0] = "hi";
        os[1] = Integer.valueOf(12);

        assertEquals(Integer.class, ObjectUtils.getArrayType(Is));
        assertEquals(Integer.class, ObjectUtils.getArrayType(Is2));
        assertEquals(null, ObjectUtils.getArrayType(mm));
        assertEquals(null, ObjectUtils.getArrayType(os));
    }

    public void testGetArrayTypeException() {

        boolean gotException = false;

        try {
            ObjectUtils.getArrayType("foo");
        } catch (IllegalArgumentException e) {
            gotException = true;
        }
        assertTrue(gotException);
    }
}
