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

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.util.List;
import java.util.Map;

import com.wavemaker.infra.WMTestCase;

/**
 * @author small
 * @version $Rev:22672 $ - $Date:2008-05-30 14:37:26 -0700 (Fri, 30 May 2008) $
 *
 */
public class TestGenerics extends WMTestCase {
    
    public void testGenericReflection() throws Exception {
        
        Field stringListField = GenericSample.class.getField("stringList");
        ParameterizedType type = (ParameterizedType) stringListField.getGenericType();
        assertEquals(String.class, type.getActualTypeArguments()[0]);
        
        Field stringIntMapField = GenericSample.class.getField("stringIntMap");
        type = (ParameterizedType) stringIntMapField.getGenericType();
        assertEquals(String.class, type.getActualTypeArguments()[0]);
        assertEquals(Integer.class, type.getActualTypeArguments()[1]);
        
        Method getBoolShortMapMethod = GenericSample.class.getMethod("getBoolShortMap");
        assertEquals(Map.class, getBoolShortMapMethod.getReturnType());
        type = (ParameterizedType) getBoolShortMapMethod.getGenericReturnType();
        assertEquals(Boolean.class, type.getActualTypeArguments()[0]);
        assertEquals(Short.class, type.getActualTypeArguments()[1]);

        Method setStringIntMapMethod = GenericSample.class.getMethod("setStringIntMap", Map.class);
        assertEquals(Map.class, setStringIntMapMethod.getParameterTypes()[0]);
        type = (ParameterizedType) setStringIntMapMethod.getGenericParameterTypes()[0];
        assertEquals(String.class, type.getActualTypeArguments()[0]);
        assertEquals(Integer.class, type.getActualTypeArguments()[1]);
    }

    public static class GenericSample {
        
        public List<String> stringList;
        public Map<String,Integer> stringIntMap;
        
        public Map<Boolean, Short> getBoolShortMap() { return null; }
        
        public void setStringIntMap(Map<String, Integer> in) {
            stringIntMap = in;
        }
    }
}