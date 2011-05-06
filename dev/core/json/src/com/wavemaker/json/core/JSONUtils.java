/*
 *  Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/*
 * Copyright 2002-2007 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.wavemaker.json.core;

import java.math.BigDecimal;
import java.math.BigInteger;

import com.wavemaker.common.WMRuntimeException;

/**
 * Provides useful methods on java objects and JSON values.
 * 
 * @author Andres Almiray <aalmiray@users.sourceforge.net>
 * @version 6
 * 
 * Modified by Matt Small <msmall@wavemaker.com>, as well as parts added.
 * @version $Rev$ - $Date$
 */
public class JSONUtils {

    public static String quote(String string) {
        
        StringBuffer ret = new StringBuffer(string.length()+2);
        ret.append('\"');
        for (char character: string.toCharArray()) {
            switch (character) {
            
            case '"':
                ret.append('\\');
                ret.append('"');
                break;
            case '\\':
                ret.append('\\');
                ret.append('\\');
                break;
            case '\b':
                ret.append('\\');
                ret.append('b');
                break;
            case '\f':
                ret.append('\\');
                ret.append('f');
                break;
            case '\n':
                ret.append('\\');
                ret.append('n');
                break;
            case '\r':
                ret.append('\\');
                ret.append('r');
                break;
            case '\t':
                ret.append('\\');
                ret.append('t');
                break;
            default:
                ret.append(character);
            }
        }
        ret.append('\"');
        
        return ret.toString();
    }

    /**
     * Produce a string from a Number.
     * 
     * @param n
     *                A Number
     * @return A String.
     * @throws Exception
     *                 If n is a non-finite number.
     */
    public static String numberToString(Number n) {
        if (n == null) {
            throw new WMRuntimeException("Null pointer");
        }
        testValidity(n);

        // Shave off trailing zeros and decimal point, if possible.

        String s = n.toString();
        if (s.indexOf('.') > 0 && s.indexOf('e') < 0 && s.indexOf('E') < 0) {
            while (s.endsWith("0")) {
                s = s.substring(0, s.length() - 1);
            }
            if (s.endsWith(".")) {
                s = s.substring(0, s.length() - 1);
            }
        }
        return s;
    }

    /**
     * Throw an exception if the object is an NaN or infinite number.
     * 
     * @param o
     *                The object to test.
     * @throws Exception
     *                 If o is a non-finite number.
     */
    public static void testValidity(Object o) {
        if (o != null) {
            if (o instanceof Double) {
                if (((Double) o).isInfinite() || ((Double) o).isNaN()) {
                    throw new WMRuntimeException(
                            "JSON does not allow non-finite numbers");
                }
            } else if (o instanceof Float) {
                if (((Float) o).isInfinite() || ((Float) o).isNaN()) {
                    throw new WMRuntimeException(
                            "JSON does not allow non-finite numbers.");
                }
            } else if (o instanceof BigDecimal || o instanceof BigInteger) {
                // ok
                return;
            }
        }
    }

    /**
     * Tests if Class represents a primitive number or wrapper.<br>
     */
    public static boolean isNumber(Class<?> clazz) {
        return clazz != null
                && (Byte.TYPE.isAssignableFrom(clazz)
                        || Short.TYPE.isAssignableFrom(clazz)
                        || Integer.TYPE.isAssignableFrom(clazz)
                        || Long.TYPE.isAssignableFrom(clazz)
                        || Float.TYPE.isAssignableFrom(clazz)
                        || Double.TYPE.isAssignableFrom(clazz)
                        || Number.class.isAssignableFrom(clazz));
    }

    /**
     * Tests if Class represents a primitive double or wrapper.<br>
     */
    public static boolean isDouble(Class<?> clazz) {
        return clazz != null
                && (Double.TYPE.isAssignableFrom(clazz) || Double.class
                        .isAssignableFrom(clazz));
    }

    /**
     * Tests if Class represents a Boolean or primitive boolean
     */
    public static boolean isBoolean(Class<?> clazz) {
        return clazz != null
                && (Boolean.TYPE.isAssignableFrom(clazz) || Boolean.class
                        .isAssignableFrom(clazz));
    }
    
    /**
     * Tests if the Class represents a json primitive, including enums and Class
     * objects.
     */
    public static boolean isPrimitive(Class<?> klass) {
        
        if (CharSequence.class.isAssignableFrom(klass)) {
            return true;
        
        // no special method for char yet, do we need it?
        } else if (Character.TYPE.isAssignableFrom(klass) ||
                Character.class.isAssignableFrom(klass)) {
            return true;
        } else if (isNumber(klass)) {
            return true;
        } else if (isBoolean(klass)) {
            return true;
        } else if (klass.isEnum()
                || (null != klass.getDeclaringClass() && klass
                        .getDeclaringClass().isEnum())) {
            return true;
        } else if (Class.class.isAssignableFrom(klass)) {
            return true;
        } else {
            return false;
        }
    }
}