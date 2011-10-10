/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.common.util;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.wavemaker.common.WMRuntimeException;

/**
 * Encapsulates logic for Class/instance access using reflection.
 * 
 * Only throws runtime exceptions.
 * 
 * Has logic for:
 * 
 * o instantiation. o invoking methods given a String method name and optionally method arguments. o checking annotation
 * presence. o getting input and output types for properties and methods. o object string representation.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class ObjectAccess {

    public static ObjectAccess getInstance() {
        return instance;
    }

    private static ObjectAccess instance = new ObjectAccess();

    private ObjectAccess() {
    }

    public Object newInstance(String className) {
        return newInstance(forName(className));
    }

    public Object newInstance(Class<?> clazz) {
        if (List.class.isAssignableFrom(clazz)) {
            clazz = ArrayList.class;
        } else if (Collection.class.isAssignableFrom(clazz)) {
            clazz = HashSet.class;
        } else if (Map.class.isAssignableFrom(clazz)) {
            clazz = HashMap.class;
        }
        return ClassUtils.newInstance(clazz);
    }

    public Class<?> forName(String className) {
        return ClassLoaderUtils.loadClass(className);
    }

    @SuppressWarnings("unchecked")
    public <T> T invoke(Object o, String methodName) {
        return (T) invoke(o, methodName, (Object[]) null);
    }

    @SuppressWarnings("unchecked")
    public <T> T invoke(Object o, String methodName, Object... params) {

        Class<?> paramTypes[] = null;
        boolean paramIsNull = false;

        if (params != null) {
            paramTypes = new Class[params.length];
            for (int i = 0; i < params.length; i++) {
                if (paramTypes[i] == null) {
                    paramIsNull = true;
                } else {
                    paramTypes[i] = getClassForObject(params[i]);
                }
            }
        }

        Class c = getClassForObject(o);

        Method m = null;

        if (paramIsNull) {
            m = getMethod(c, methodName, paramTypes.length);
        } else {
            m = getMethod(c, methodName, paramTypes);
        }

        if (m == null) {
            throw new MethodNotFoundRuntimeException(methodName, c, paramTypes);
        }

        return (T) invokeInternal(o, m, params);

    }

    @SuppressWarnings("unchecked")
    public <T> T getProperty(Object o, String propertyName) {
        Method m = getGetterMethod(getClassForObject(o), propertyName);
        return (T) invokeInternal(o, m, null);
    }

    public void setProperty(Object o, String propertyName, Object propertyValue) {

        invoke(o, ClassUtils.getPropertySetterName(propertyName), propertyValue);
    }

    public Class<?> getPropertyType(Class<?> clazz, String propertyName) {
        if (clazz == null) {
            throw new IllegalArgumentException("class cannot be null");
        }
        if (propertyName == null) {
            throw new IllegalArgumentException("property name cannot be null");
        }
        Method m = getMethod(clazz, ClassUtils.getPropertySetterName(propertyName), 1);
        if (m != null) {
            return m.getParameterTypes()[0];
        }
        return null;
    }

    public boolean propertyIsNull(Object o, String propertyName) {
        return getProperty(o, propertyName) == null;
    }

    public List<Class<?>> getMethodParamTypes(Class<?> clazz, String methodName, int numParams) {
        Method m = getMethod(clazz, methodName, numParams);
        if (m != null) {
            return Arrays.asList(m.getParameterTypes());
        }
        return null;
    }

    public Class<?> getMethodReturnType(Class<?> clazz, String methodName, int numParams) {
        Method m = getMethod(clazz, methodName, numParams);
        if (m != null) {
            return m.getReturnType();
        }
        return null;
    }

    public List<Class<?>> getGenericReturnTypes(Class<?> clazz, String methodName, int numParams) {
        Method m = getMethod(clazz, methodName, numParams);
        if (m == null) {
            return null;
        }
        return getGenericReturnTypes(m);
    }

    private List<Class<?>> getGenericReturnTypes(Method m) {
        List<Class<?>> rtn = Collections.emptyList();
        Type t = m.getGenericReturnType();
        if (t instanceof ParameterizedType) {
            Type[] gt = ((ParameterizedType) t).getActualTypeArguments();
            rtn = new ArrayList<Class<?>>(gt.length);
            for (Type i : gt) {
                rtn.add((Class<?>) i);
            }
        }
        return rtn;
    }

    public boolean hasAnnotation(Class<?> annotation, Object o, String methodName) {
        return hasAnnotation(annotation, o, methodName, (Class<?>[]) null);
    }

    @SuppressWarnings("unchecked")
    public boolean hasAnnotation(Class annotation, Object o, String methodName, Class<?>... paramTypes) {
        Method m = getMethod(getClassForObject(o), methodName, paramTypes);
        if (m == null) {
            return false;
        }
        return m.getAnnotation(annotation) != null;
    }

    @SuppressWarnings("unchecked")
    public boolean hasAnnotation(Class annotation, Object o, String methodName, int numParams) {
        Method m = getMethod(getClassForObject(o), methodName, numParams);
        if (m == null) {
            return false;
        }
        return m.getAnnotation(annotation) != null;
    }

    public boolean hasProperty(Class<?> clazz, String propertyName) {
        try {
            getGetterMethod(clazz, propertyName);
            return true;
        } catch (MethodNotFoundRuntimeException ex) {
            return false;
        }
    }

    public boolean hasMethod(Class<?> clazz, String methodName, int numParams) {
        Method m = getMethod(clazz, methodName, numParams);
        return m != null;
    }

    public List<String> getPropertyNames(Class<?> clazz) {
        Map<String, Class<?>> m = getProperties(clazz);
        List<String> rtn = new ArrayList<String>(m.size());
        for (String s : m.keySet()) {
            rtn.add(s);
        }
        return rtn;
    }

    public Map<String, Class<?>> getProperties(Class<?> clazz) {

        Map<String, Class<?>> rtn = new LinkedHashMap<String, Class<?>>();

        Collection<String> methodNames = new HashSet<String>();

        for (Method m : getMethods(clazz)) {
            methodNames.add(m.getName());
        }

        for (String s : methodNames) {

            if (s.startsWith("get")) {
                String prop = s.substring(3, s.length());
                if (methodNames.contains("set" + prop)) {
                    // also need check method params/rtn types for consistency
                    String propName = StringUtils.lowerCaseFirstLetter(prop);
                    Class<?> type = getPropertyType(clazz, propName);
                    if (type != null) {
                        rtn.put(propName, type);
                    }
                }
            }
        }
        return rtn;
    }

    public String objectToString(Object o) {
        return objectToString(o, true);
    }

    public String objectToString(Object o, boolean excludeContainers) {
        if (o == null) {
            return "null";
        }

        StringBuilder sb = new StringBuilder();

        sb.append(o.getClass().getName()).append(":");

        if (TypeConversionUtils.isPrimitiveOrWrapper(o.getClass())) {
            sb.append(String.valueOf(o));
            return sb.toString();
        }

        sb.append("{");

        Map<String, Class<?>> propNames = getProperties(getClassForObject(o));
        int i = 0;
        for (Map.Entry<String, Class<?>> e : propNames.entrySet()) {
            Object v = getProperty(o, e.getKey());
            if (excludeContainers) {
                if (v instanceof Collection) {
                    if (!((Collection<?>) v).isEmpty()) {
                        v = "[...]";
                    }
                } else if (v instanceof Map) {
                    if (!((Map<?, ?>) v).isEmpty()) {
                        v = "{...}";
                    }
                }
            }
            sb.append(e.getKey() + ":" + v);
            if (i++ < propNames.size() - 1) {
                sb.append(",");
            }
        }
        sb.append("}");
        return sb.toString();
    }

    private Method getGetterMethod(Class<?> clazz, String propertyName) {
        String name = ClassUtils.getPropertyGetterName(propertyName);
        if (hasMethod(clazz, name, 0)) {
            return getMethod(clazz, name, 0);
        } else {
            String altName = ClassUtils.getAltPropertyGetterName(propertyName);
            if (hasMethod(clazz, altName, 0)) {
                return getMethod(clazz, altName, 0);
            }
        }
        throw new MethodNotFoundRuntimeException(name, clazz, null);
    }

    private Class<?> getClassForObject(Object o) {
        if (o == null) {
            throw new IllegalArgumentException("getClassForObject: instance cannot be null");
        }
        return o.getClass();
    }

    // get method by name and number of params only
    private Method getMethod(Class<?> c, String methodName, int numParams) {
        for (Method m : getMethods(c)) {
            if (m.getName().equals(methodName) && m.getParameterTypes().length == numParams) {
                return m;
            }
        }
        return null;
    }

    private Method getMethod(Class<?> c, String methodName, Class<?>... paramTypes) {
        for (Method m : getMethods(c)) {
            if (m.getName().equals(methodName)) {
                if (paramsMatch(m, paramTypes)) {
                    return m;
                }
            }
        }
        return null;
    }

    private boolean paramsMatch(Method m, Class<?>... paramTypes) {

        Class<?> methodParams[] = m.getParameterTypes();

        if (paramTypes == null && methodParams.length == 0) {
            return true;
        }

        if (methodParams.length != paramTypes.length) {
            return false;
        }

        for (int i = 0; i < methodParams.length; i++) {
            if (!methodParams[i].isAssignableFrom(paramTypes[i]) && !TypeConversionUtils.primitivesMatch(methodParams[i], paramTypes[i])) {
                return false;
            }
        }
        return true;
    }

    private Method[] getMethods(Class<?> clazz) {
        return clazz.getMethods();
    }

    private Object invokeInternal(Object instance, Method m, Object[] params) {
        try {
            return m.invoke(instance, params);
        } catch (IllegalArgumentException ex) {
            throw new WMRuntimeException(ex);
        } catch (IllegalAccessException ex) {
            throw new WMRuntimeException(ex);
        } catch (InvocationTargetException ex) {
            throw new WMRuntimeException(ex);
        }
    }
}
