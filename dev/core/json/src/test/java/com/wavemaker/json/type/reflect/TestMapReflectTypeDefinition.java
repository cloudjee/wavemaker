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

package com.wavemaker.json.type.reflect;

import java.util.HashMap;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.infra.WMTestCase;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestMapReflectTypeDefinition extends WMTestCase {

    @Override
    public void setUp() throws Exception {
        SpringUtils.initSpringConfig();
    }

    public void testNewInstance() throws Exception {

        MapReflectTypeDefinition mrtd = new MapReflectTypeDefinition();

        mrtd.setKlass(Map.class);
        assertTrue(mrtd.newInstance() instanceof HashMap);

        mrtd.setKlass(TreeMap.class);
        assertTrue(mrtd.newInstance() instanceof TreeMap);

        mrtd.setKlass(SortedMap.class);
        assertTrue(mrtd.newInstance() instanceof TreeMap);
    }
}