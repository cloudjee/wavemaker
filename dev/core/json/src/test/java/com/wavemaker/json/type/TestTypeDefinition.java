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

package com.wavemaker.json.type;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Map;

import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;
import com.wavemaker.json.type.reflect.TestReflectTypeUtils.BasicMapTypes;
import com.wavemaker.json.type.reflect.TestReflectTypeUtils.MapListType;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestTypeDefinition extends WMTestCase {

    @Override
    public void setUp() throws Exception {
        SpringUtils.initSpringConfig();
    }

    public void testGetTypeName() throws Exception {

        String arr[] = new String[1];
        String arr2[][] = new String[1][];

        assertEquals("java.lang.String", ReflectTypeUtils.getTypeName(String.class));
        assertEquals("[Ljava.lang.String;", ReflectTypeUtils.getTypeName(arr.getClass()));
        assertEquals("[[Ljava.lang.String;", ReflectTypeUtils.getTypeName(arr2.getClass()));

        Type returnType = BasicMapTypes.class.getMethod("getStringStringMap").getGenericReturnType();
        assertTrue(returnType instanceof ParameterizedType);

        ParameterizedType pt = (ParameterizedType) returnType;
        assertEquals(Map.class, pt.getRawType());
        assertEquals(2, pt.getActualTypeArguments().length);

        assertEquals("java.util.Map<java.lang.String,java.lang.String>", ReflectTypeUtils.getTypeName(pt));

        returnType = MapListType.class.getMethod("getMapListString").getGenericReturnType();
        assertTrue(returnType instanceof ParameterizedType);

        pt = (ParameterizedType) returnType;
        assertEquals(Map.class, pt.getRawType());
        assertEquals(2, pt.getActualTypeArguments().length);

        assertEquals("java.util.Map<java.lang.String,java.util.List<java.util.List<java.lang.String>>>", ReflectTypeUtils.getTypeName(pt));
    }
}