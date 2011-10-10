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

package com.wavemaker.json.core;

import java.math.BigInteger;
import java.util.Map;

import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.JSONMarshaller_Objects.ClassWithEnum;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestJSONUtils extends WMTestCase {

    public void testIsNumber() throws Exception {

        assertTrue(JSONUtils.isNumber(int.class));
        assertTrue(JSONUtils.isNumber(Integer.class));
        assertTrue(JSONUtils.isNumber(BigInteger.class));
    }

    public void testIsPrimitive() throws Exception {

        assertTrue(JSONUtils.isPrimitive(String.class));
        assertTrue(JSONUtils.isPrimitive(ClassWithEnum.DAYS.class));
        assertTrue(JSONUtils.isPrimitive(boolean.class));
        assertTrue(JSONUtils.isPrimitive(Boolean.class));
        assertTrue(JSONUtils.isPrimitive(char.class));
        assertTrue(JSONUtils.isPrimitive(Character.class));
        assertFalse(JSONUtils.isPrimitive(Map.class));
    }
}