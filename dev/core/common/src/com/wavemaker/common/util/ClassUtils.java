/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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
import java.util.ArrayList;
import java.util.List;

import com.wavemaker.common.WMRuntimeException;

/**
 * Utility methods that work with Class instances (see ObjectUtils, as well).
 * 
 * @author Matt Small
 * @version $Rev$ - $Date$
 */
public class ClassUtils {
    
    public static Object newInstance(Class<?> c) {
        try {
            return c.newInstance();
        } catch (InstantiationException ex) {
            String s = ex.getMessage();
            if (s == null || s.equals("")) {
                s = "Failed to instantiate " + c.getName();
            }
            throw new WMRuntimeException(s, ex);
        } catch (IllegalAccessException ex) {
           throw new WMRuntimeException(ex);
        }
    }

    /**
     * Get all public methods of a class, except for methods contained in
     * Object.
     */
    public static List<Method> getPublicMethods(Class<?> c) {

        Method[] allMethods = c.getMethods();
        List<Method> ret = new ArrayList<Method>(allMethods.length);
        
        for (int i=0;i<allMethods.length;i++) {
            if (!allMethods[i].getDeclaringClass().equals(Object.class)) {
                ret.add(allMethods[i]);
            }
        }
        
        return ret;
    }

    public static List<Field> getPublicFields(Class<?> c) {
        return getPublicFields(c, null);
    }

    public static List<Field> getPublicFields(Class<?> c, Class<?> fieldType) {

        List<Field> rtn = new ArrayList<Field>();

        Field[] f = c.getFields();

        for (int i = 0; i < f.length; i++) {
            if (fieldType != null) {
                if (!fieldType.isAssignableFrom(f[i].getType())) {
                    continue;
                }
            }
            rtn.add(f[i]);
        }

        return rtn;
    }
    
    public static String getPropertyGetterName(String propertyName) {
        return "get" + StringUtils.upperCaseFirstLetter(propertyName);
    }

    public static String getAltPropertyGetterName(String propertyName) {
        return "is" + StringUtils.upperCaseFirstLetter(propertyName);
    }

    public static String getPropertySetterName(String propertyName) {
        return "set" + StringUtils.upperCaseFirstLetter(propertyName);
    }
    
    private ClassUtils() {
        throw new UnsupportedOperationException();
    }
 }