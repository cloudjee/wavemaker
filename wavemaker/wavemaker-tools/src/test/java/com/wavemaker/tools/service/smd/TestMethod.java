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

package com.wavemaker.tools.service.smd;

import java.util.ArrayList;

import com.wavemaker.infra.WMTestCase;

/**
 * @author Matt Small
 */
public class TestMethod extends WMTestCase {

    public void testMethodComparison() throws Exception {

        Method m1 = new Method();
        m1.setName("a");

        Method m2 = new Method();
        m2.setName("b");

        assertTrue(m1.compareTo(m2) < 0);
        assertEquals(m1.compareTo(m2), -1 * m2.compareTo(m1));

        m2.setName("a");
        assertEquals(0, m1.compareTo(m2));
        assertEquals(m1.compareTo(m2), -1 * m2.compareTo(m1));

        m1.setParameters(new ArrayList<Param>());
        m1.getParameters().add(new Param());
        assertTrue(m1.compareTo(m2) > 0);
        assertEquals(m1.compareTo(m2), -1 * m2.compareTo(m1));

        m2.setParameters(new ArrayList<Param>());
        assertTrue(m1.compareTo(m2) > 0);
        assertEquals(m1.compareTo(m2), -1 * m2.compareTo(m1));

        m2.getParameters().add(new Param());
        assertEquals(0, m1.compareTo(m2));
        assertEquals(m1.compareTo(m2), -1 * m2.compareTo(m1));
    }
}