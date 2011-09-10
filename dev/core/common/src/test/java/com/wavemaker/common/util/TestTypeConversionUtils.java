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
import java.util.Date;
import java.util.HashMap;
import java.util.concurrent.atomic.AtomicLong;

import com.wavemaker.common.util.TypeConversionUtils;
import com.wavemaker.infra.WMTestCase;

/**
 * @author Simon Toens
 * @version $Rev:22672 $ - $Date:2008-05-30 14:37:26 -0700 (Fri, 30 May 2008) $
 * 
 */
public class TestTypeConversionUtils extends WMTestCase {

    public void testIsPrimitive() {
        
        assertFalse(TypeConversionUtils.isPrimitiveOrWrapper(Object.class));
        assertFalse(TypeConversionUtils
                    .isPrimitiveOrWrapper(ClassUtilsObject.class));
        
        assertTrue(TypeConversionUtils.isPrimitiveOrWrapper(int.class));
        assertTrue(TypeConversionUtils.isPrimitiveOrWrapper(Integer.class));
        assertTrue(TypeConversionUtils.isPrimitiveOrWrapper(AtomicLong.class));
        assertTrue(TypeConversionUtils.isPrimitiveOrWrapper("a".getClass()));
    }
    
    public void testIsArray() {
        
        assertTrue(TypeConversionUtils.isArray((new Object[]{}).getClass()));
        assertFalse(TypeConversionUtils.isArray(int.class));
        assertTrue(TypeConversionUtils.isArray((new ArrayList<Integer>()).getClass()));
        assertFalse(TypeConversionUtils.isArray((new HashMap<Integer, Float>()).getClass()));
    }
    
    public void testIsMap() {


        assertFalse(TypeConversionUtils.isMap((new Object[]{}).getClass()));
        assertFalse(TypeConversionUtils.isMap(int.class));
        assertFalse(TypeConversionUtils.isMap((new ArrayList<Integer>()).getClass()));
        assertTrue(TypeConversionUtils.isMap((new HashMap<Integer, Float>()).getClass()));
    }

    public void testFromString() {
        
        Byte b = (Byte)TypeConversionUtils.fromString(Byte.class, "1");
        assertTrue(b.equals(Byte.valueOf("1")));
        b = (Byte)TypeConversionUtils.fromString(byte.class, "1");
        assertTrue(b.equals(Byte.valueOf("1")));

        Boolean bb = (Boolean)TypeConversionUtils.fromString(Boolean.class, 
                                                             "true");
        assertTrue(bb.equals(Boolean.TRUE));
        bb = (Boolean)TypeConversionUtils.fromString(boolean.class, "true");
        assertTrue(bb.equals(Boolean.TRUE));

        Date da = (Date)TypeConversionUtils.fromString(Date.class, 
                                                       "1191607354000");
        assertTrue(da.getTime() == 1191607354000L);
        
        da = (Date)TypeConversionUtils.fromString(Date.class, 
                "-1191607354000");
        assertTrue(da.getTime() == -1191607354000L);

        Double d = (Double)TypeConversionUtils.fromString(Double.class, "1.2");
        assertTrue(d.equals(Double.valueOf("1.2")));
        d = (Double)TypeConversionUtils.fromString(double.class, "1.2");
        assertTrue(d.equals(Double.valueOf("1.2")));

        Float f = (Float)TypeConversionUtils.fromString(Float.class, "1.3");
        assertTrue(f.equals(Float.valueOf("1.3")));
        f = (Float)TypeConversionUtils.fromString(float.class, "1.3");
        assertTrue(f.equals(Float.valueOf("1.3")));

        Integer i = (Integer)TypeConversionUtils.fromString(Integer.class, "5");
        assertTrue(i.equals(Integer.valueOf("5")));
        i = (Integer)TypeConversionUtils.fromString(int.class, "5");
        assertTrue(i.equals(Integer.valueOf("5")));

        Long l = (Long)TypeConversionUtils.fromString(Long.class, "7");
        assertTrue(l.equals(Long.valueOf("7")));
        l = (Long)TypeConversionUtils.fromString(long.class, "7");
        assertTrue(l.equals(Long.valueOf("7")));

        Short s = (Short)TypeConversionUtils.fromString(Short.class, "6");
        assertTrue(s.equals(Short.valueOf("6")));
        s = (Short)TypeConversionUtils.fromString(short.class, "6");
        assertTrue(s.equals(Short.valueOf("6")));

        String ss = (String)TypeConversionUtils.fromString(String.class, "s");
        assertTrue(ss.equals("s"));
    }
    
    public void testPrimitivesMatch() {

        assertTrue(TypeConversionUtils.primitivesMatch(boolean.class, 
                                                       Boolean.class));
        assertTrue(TypeConversionUtils.primitivesMatch(Boolean.class, 
                                                       boolean.class));

        assertTrue(TypeConversionUtils.primitivesMatch(byte.class, 
                                                       Byte.class));
        assertTrue(TypeConversionUtils.primitivesMatch(Byte.class, 
                                                       byte.class));

        assertTrue(TypeConversionUtils.primitivesMatch(double.class, 
                                                       Double.class));
        assertTrue(TypeConversionUtils.primitivesMatch(Double.class, 
                                                       double.class));

        assertTrue(TypeConversionUtils.primitivesMatch(float.class, 
                                                       Float.class));
        assertTrue(TypeConversionUtils.primitivesMatch(Float.class, 
                                                       float.class));

        assertTrue(TypeConversionUtils.primitivesMatch(int.class, 
                                                       Integer.class));
        assertTrue(TypeConversionUtils.primitivesMatch(Integer.class, 
                                                       int.class));

        assertTrue(TypeConversionUtils.primitivesMatch(long.class, 
                                                       Long.class));
        assertTrue(TypeConversionUtils.primitivesMatch(Long.class, 
                                                       long.class));

        assertTrue(TypeConversionUtils.primitivesMatch(short.class, 
                                                       Short.class));
        assertTrue(TypeConversionUtils.primitivesMatch(Short.class, 
                                                       short.class));



    }
}