/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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

import java.lang.reflect.Array;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.ObjectGraphTraversal.Context;

/**
 * @author Simon Toens
 */
public class ObjectUtils {

    // only use for logging - not guaranteed to be unique
    public static String getId(Object o) {
        if (o == null) {
            return "null";
        }

        return o.getClass().getName() + "@" + System.identityHashCode(o);
    }

    public static boolean isNullOrEmpty(String s) {
        if (s == null) {
            return true;
        }

        if (s.trim().length() == 0) {
            return true;
        }

        return false;
    }

    public static boolean isNullOrEmpty(Object[] o) {
        if (o == null) {
            return true;
        }

        if (o.length == 0) {
            return true;
        }

        return false;
    }
    
    public static boolean isNullOrEmpty(List<?> l) {
        if (l == null) {
            return true;
        }

        if (l.isEmpty()) {
            return true;
        }

        return false;
    }
    

    /**
     * Return new array that contains the elements of all input arrays.
     */
    public static Object[] addArrays(Object[]... o) {

        Class<?> rtnType = o[0].getClass().getComponentType();
        for (int i = 1; i < o.length; i++) {
            if (!o[i].getClass().getComponentType().equals(rtnType)) {
                rtnType = Object.class;
                break;
            }
        }

        int totalLength = 0;
        for (int i = 0; i < o.length; i++) {
            totalLength += o[i].length;
        }

        Object[] rtn = (Object[]) Array.newInstance(rtnType, totalLength);

        int destPos = 0;
        for (int i = 0; i < o.length; i++) {
            System.arraycopy(o[i], 0, rtn, destPos, o[i].length);
            destPos += o[i].length;
        }

        return rtn;
    }

    /**
     * Like Collection.toArray, but without "type checking" warnings if the
     * Collection instance is not typed using generics.
     */
    public static Object[] toArray(Collection<?> c, Class<?> arrayType) {
        Object[] rtn = (Object[]) Array.newInstance(arrayType, c.size());
        int i = 0;
        for (Iterator<?> iter = c.iterator(); iter.hasNext();) {
            rtn[i++] = iter.next();
        }
        return rtn;
    }

    public static String toString(Object[] array) {
        return toString(array, ", ");
    }

    public static String toString(Object[] array, String sep) {
        if (array == null) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < array.length; i++) {
            sb.append(String.valueOf(array[i]));
            if (i < (array.length - 1)) {
                sb.append(sep);
            }
        }
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    public static String toString(Collection c) {
        return toString(c, ", ");
    }

    @SuppressWarnings("unchecked")
    public static String toString(Collection c, String sep) {
        StringBuilder sb = new StringBuilder();
        for (Iterator iter = c.iterator(); iter.hasNext();) {
            sb.append(String.valueOf(iter.next()));
            if (iter.hasNext()) {
                sb.append(sep);
            }
        }
        return sb.toString();
    }

    /**
     * Inspired by python's map function.
     */
    public static Collection<?> map(String[] funcNames, Collection<?> c) {
        Collection<Object> rtn = new ArrayList<Object>(c.size());
        Method[] methods = new Method[funcNames.length];
        for (Iterator<?> iter = c.iterator(); iter.hasNext();) {
            Object o = iter.next();
            for (int i = 0; i < funcNames.length; i++) {
                if (methods[i] == null) {
                    try {
                        methods[i] = o.getClass().getMethod(funcNames[i],
                                (Class[]) null);
                    } catch (Exception ex) {
                        throw new WMRuntimeException(ex);
                    }
                }

                try {
                    o = methods[i].invoke(o, (Object[]) null);
                } catch (Exception ex) {
                    throw new WMRuntimeException(ex);
                }
            }

            rtn.add(o);

        }

        return rtn;
    }

    public static String objectToString(Object o) {
        ObjectAccess a = ObjectAccess.getInstance();
        return a.objectToString(o);
    }

    public static String objectToStringRecursive(Object o) {

        final StringBuilder sb = new StringBuilder();

        if (o instanceof Collection) {
            Collection<?> c = (Collection<?>) o;
            int i = 0;
            for (Object item : c) {
                sb.append("element ").append(i)
                        .append(" in root Collection:\n");
                sb.append(objectToStringRecursive(item));
                sb.append("\n");
            }
            return sb.toString();
        }

        sb.append("root: " + objectToString(o));

        if (o == null) {
            return sb.toString();
        }

        final ObjectAccess oa = ObjectAccess.getInstance();

        ObjectGraphTraversal.ObjectVisitor v = 
	    new ObjectGraphTraversal.ObjectVisitor() {

            public void visit(Object o, Context ctx) {
                sb.append("\n" + ctx.getPropertyPath() + ": "
                        + objectToString(o));
            }

            public void cycle(Object o, Context ctx) {
                sb.append("\n" + ctx.getPropertyPath() + ": Cycle");
            }
        };
        ObjectGraphTraversal.PropertyFactory p = 
	    new ObjectGraphTraversal.PropertyFactory() {

            public List<String> getProperties(Object o, Context ctx) {
                return oa.getPropertyNames(o.getClass());
            }
        };

        new ObjectGraphTraversal(p, v).traverse(o);

        return sb.toString();
    }

    /**
     * Simple Object diffing for debugging.
     */
    public static String diffObjects(Object o1, Object o2) {
        if (o1.getClass() != o2.getClass()) {
            throw new IllegalArgumentException("Arguments o1 and o2 must "
                    + "be of same type");
        }

        StringBuilder rtn = new StringBuilder();

        List<?> getters = getSimpleGetters(o1.getClass());

        for (Iterator<?> iter = getters.iterator(); iter.hasNext();) {
            Method m = (Method) iter.next();
            try {
                Object r1 = m.invoke(o1, (Object[]) null);
                Object r2 = m.invoke(o2, (Object[]) null);
                if ((r1 == null && r2 != null) || !r1.equals(r2)) {
                    rtn.append(m.getName()).append(": ").append(r1).append(
                            " != ").append(r2).append("\n");
                }
            } catch (Exception ex) {
                throw new WMRuntimeException(ex);
            }

        }

        return rtn.toString();
    }

    private static final Class<?>[] simpleTypes = new Class<?>[] { int.class,
            Integer.class, String.class, Date.class };

    private static List<?> getSimpleGetters(Class<?> c) {
        return filterMethods(c.getDeclaredMethods(), new String[] { "get" },
                simpleTypes);
    }

    private static List<Method> filterMethods(Method[] methods, String[] names,
            Class<?>[] rtnTypes) {

        List<Method> rtn = new ArrayList<Method>();

        for (int i = 0; i < methods.length; i++) {
            for (int n = 0; n < names.length; n++) {
                if (methods[i].getName().startsWith(names[n])) {
                    for (int t = 0; t < rtnTypes.length; t++) {
                        if (methods[i].getReturnType() == rtnTypes[t]) {
                            rtn.add(methods[i]);
                        }
                    }
                }
            }
        }

        return rtn;
    }

    private static Class<?> getArrayType_ClassMatch(Class<?> oldC, Class<?> newC) {

        Class<?> ret;

        if (null == oldC) {
            ret = newC;
        } else if (oldC.equals(newC)) {
            ret = oldC;
        } else {
            ret = null;
        }

        return ret;
    }

    /**
     * Get the type of an array or collection (passed in as obj). If the array
     * isn't homogeneous, return null. If obj is not an array or a collection, a
     * runtime exception is thrown. All Collections and Object[] are checked for
     * homogeneity, but nothing else.
     * 
     * @param array
     * @return The type of a homogeneous array or Collection, or null if the
     *         array or Collection is not homogeneous.
     * @throws IllegalArgumentException
     *                 If the argument array is not an array or Collection.
     */
    public static Class<?> getArrayType(Object array) {

        if (null == array) {
            throw new IllegalArgumentException(
                    "Argument must be an array or a collection, not " + array);
        }

        Class<?> arrayType;

        if (array.getClass().isArray()) {
            arrayType = array.getClass().getComponentType();

            // if the arrayType is Object, do some deeper checking
            if (arrayType.equals(Object.class)) {
                arrayType = null;

                for (Object elem : (Object[]) array) {
                    arrayType = getArrayType_ClassMatch(arrayType, elem
                            .getClass());
                    if (null == arrayType) {
                        break;
                    }
                }
            }
        } else if (array instanceof Collection) {

            Collection<?> c = (Collection<?>) array;

            if (c.isEmpty()) {
                // empty collection, return dummy type
                return String.class;
            }

            arrayType = null;

            for (Object elem : c) {
                arrayType = getArrayType_ClassMatch(arrayType, elem.getClass());
                if (null == arrayType) {
                    break;
                }
            }
        } else {
            throw new IllegalArgumentException(
                    "Argument must be an array or a collection, not "
                            + array.getClass());
        }

        return arrayType;
    }

    public static Collection<String> getKeysStartingWith(String prefix,
            Map<String, ?> m) {

        Collection<String> rtn = new HashSet<String>();
        for (String s : m.keySet()) {
            if (s.startsWith(prefix)) {
                rtn.add(s);
            }
        }
        return rtn;
    }
    
    public static boolean strCmp(Object o1, Object o2) {
        return String.valueOf(o1).equals(String.valueOf(o2));
    }
    
    private ObjectUtils() {
        throw new UnsupportedOperationException();
    }
}
