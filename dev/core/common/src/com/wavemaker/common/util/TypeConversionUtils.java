/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
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

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.sql.Timestamp;
import java.sql.Time;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 */
public class TypeConversionUtils {


    private TypeConversionUtils() {
        throw new UnsupportedOperationException();
    }

    private static final Map<String, Class<?>> PRIMITIVES = 
	new HashMap<String, Class<?>>(8);
    static {
	PRIMITIVES.put(boolean.class.getName(), boolean.class);
	PRIMITIVES.put(byte.class.getName(), byte.class);
	PRIMITIVES.put(char.class.getName(), char.class);
	PRIMITIVES.put(double.class.getName(), double.class);
	PRIMITIVES.put(float.class.getName(), float.class);
	PRIMITIVES.put(int.class.getName(), int.class);
	PRIMITIVES.put(long.class.getName(), long.class);
	PRIMITIVES.put(short.class.getName(), short.class);
    }


   /**
     * List of primitive wrappers (Integer, etc), including Atomic numbers.
     * All standard subclasses of Number are included, and Boolean.
     */
    private static final Collection<Class<?>> PRIMITIVE_WRAPPERS = 
        new HashSet<Class<?>>(11);
    static {
        PRIMITIVE_WRAPPERS.add(AtomicInteger.class);
        PRIMITIVE_WRAPPERS.add(AtomicLong.class);
        PRIMITIVE_WRAPPERS.add(BigDecimal.class);
        PRIMITIVE_WRAPPERS.add(BigInteger.class);
        PRIMITIVE_WRAPPERS.add(Boolean.class);
        PRIMITIVE_WRAPPERS.add(Byte.class);
        PRIMITIVE_WRAPPERS.add(Double.class);
        PRIMITIVE_WRAPPERS.add(Float.class);
        PRIMITIVE_WRAPPERS.add(Integer.class);
        PRIMITIVE_WRAPPERS.add(Long.class);
        PRIMITIVE_WRAPPERS.add(Short.class);
    }

    public static Class<?> primitiveForName(String className) {
	return PRIMITIVES.get(className);
    }

    /**
     * Returns true iff the Class clazz represents a primitive (boolean, int) or
     * a primitive wrapper (Integer), including Big{Integer,Decimal} and
     * Atomic{Integer,Long}.  Also, Strings and Dates are included.
     * 
     * @param clazz
     * @return
     */
    public static boolean isPrimitiveOrWrapper(Class<?> clazz) {
        
        if (clazz.isPrimitive()) {
            return true;
        }
        
        if (clazz.equals(String.class)) {
            return true;
        }

        if (Date.class.isAssignableFrom(clazz)) {
            return true;
        }

        if (PRIMITIVE_WRAPPERS.contains(clazz)) {
            return true;
        }

        return false;
    }
    
    /**
     * Return true iff the parameter is an Array or a Collection.
     * @param clazz
     * @return
     */
    public static boolean isArray(Class<?> clazz) {
        
        return clazz!=null &&
                (Collection.class.isAssignableFrom(clazz) || clazz.isArray());
    }
    
    /**
     * Return true iff the parameter is a Map.
     * @param clazz
     * @return
     */
    public static boolean isMap(Class<?> clazz) {
        
        return clazz!=null &&
                (Map.class.isAssignableFrom(clazz));
    }

    public static Object fromString(Class<?> type, String s) {
	return fromString(type, s, false);
    }

    public static Object fromString(Class<?> type, String s, boolean isList) {

        if (isList || !isPrimitiveOrWrapper(type)) {
            if (s == null) return null;
            ObjectLiteralParser p = new ObjectLiteralParser(s, type);
	        Object o = p.parse();
            return o;
        }

        if (s == null) { 
            return null;
        } else if (type == AtomicInteger.class) {
            return null;
        } else if (type == AtomicLong.class) {
            return null;
        } else if (type == BigDecimal.class) {
            return new BigDecimal(s);
        } else if (type == BigInteger.class) {
            return new BigDecimal(s);
        } else if (type == Boolean.class || type == boolean.class) {
            return Boolean.valueOf(s);
        } else if (type == Byte.class || type == byte.class) {
            return Byte.valueOf(s);
        } else if (type == Date.class) {
            if (StringUtils.isNumber(s)) {
                return new Date(Long.valueOf(s));
            } else {
                throw new IllegalArgumentException(
                    "Unable to convert " + s + " to " + Date.class.getName());
            }
        } else if (type == Double.class || type == double.class) {
            return Double.valueOf(s);
        } else if (type == Float.class || type == float.class) {
            return Float.valueOf(s);
        } else if (type == Integer.class || type == int.class) {
            return Integer.valueOf(s);
        } else if (type == Long.class || type == long.class) {
            return Long.valueOf(s);
        } else if (type == Short.class || type == short.class) {
            return Short.valueOf(s);
        } else if (type == String.class) {
            return s;
        } else {
            throw new AssertionError(
                "Unable to convert \"" + s + "\" to " + type + 
                " - unknown type: " + type);
        }
    }

    public static String getValueString(Class<?> type, String s) {  //xxx

        if (s == null) {
            return "null";
        } else if (type == String.class || type == StringBuffer.class) {
            return "'" + s + "'";
        } else if (type == Date.class || type == java.sql.Date.class || type == Timestamp.class ||
                   type == Time.class) {
            return "'" + s + "'";
        } else {
            return s;
        }
    }

    public static boolean primitivesMatch(Class<?> p1, Class<?> p2) {

        if (!p1.isPrimitive() && !p2.isPrimitive()) {
            return false;
        }

        if (compare(p1, p2, Boolean.class, boolean.class)) {
            return true;
        }
        if (compare(p1, p2, Byte.class, byte.class)) {
            return true;
        }
        if (compare(p1, p2, Double.class, double.class)) {
            return true;
        }
        if (compare(p1, p2, Float.class, float.class)) {
            return true;
        }
        if (compare(p1, p2, Integer.class, int.class)) {
            return true;
        }
        if (compare(p1, p2, Long.class, long.class)) {
            return true;
        }
        if (compare(p1, p2, Short.class, short.class)) {
            return true;
        }

        return false;
    }

    private static boolean compare(Class<?> p1, Class<?> p2, Class<?> t1,
            Class<?> t2) {

        if (p1 == t1 && p2 == t2) {
            return true;
        }

        if (p1 == t2 && p2 == t1) {
            return true;
        }

        return false;
    }
}