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
package com.wavemaker.runtime.data;

import java.util.List;

import com.wavemaker.common.util.ObjectAccess;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public class CheckGeneratedServiceMethods {

    private CheckGeneratedServiceMethods() {
    }

    private static ObjectAccess objectAccess = ObjectAccess.getInstance();

    public static void checkType(Class<?> clazz, Class<?> actorType,
            boolean ignoreById) {

        String simpleName = actorType.getSimpleName();

        assertMethodExists(clazz, "get" + simpleName + "List", 0);
        assertMethodTakesParams(clazz, "get" + simpleName + "List",
                                new Class[] {});
        assertMethodReturns(clazz, "get" + simpleName + "List", 0, List.class,
                new Class[] { actorType });

        assertMethodExists(clazz, "get" + simpleName + "List", 1);
        assertMethodTakesParams(clazz, "get" + simpleName + "List",
                new Class[] { actorType });
        assertMethodReturns(clazz, "get" + simpleName + "List", 1, List.class,
                new Class[] { actorType });

        assertMethodExists(clazz, "get" + simpleName + "List", 2);
        assertMethodTakesParams(clazz, "get" + simpleName + "List",
                                new Class[] { actorType,
                                              QueryOptions.class });
        assertMethodReturns(clazz, "get" + simpleName + "List", 2, List.class,
                new Class[] { actorType });

        assertMethodExists(clazz, "get" + simpleName + "Count", 0);
        assertMethodTakesParams(clazz, "get" + simpleName + "Count",
                                new Class[] {});
        assertMethodReturns(clazz, "get" + simpleName + "Count", 0,
                            Integer.class);

        assertMethodExists(clazz, "get" + simpleName + "Count", 1);
        assertMethodTakesParams(clazz, "get" + simpleName + "Count",
                new Class[] { actorType });
        assertMethodReturns(clazz, "get" + simpleName + "Count", 1,
                            Integer.class);

        assertMethodExists(clazz, "get" + simpleName + "Count", 2);
        assertMethodTakesParams(clazz, "get" + simpleName + "Count",
                                new Class[] {
                actorType, QueryOptions.class });
        assertMethodReturns(clazz, "get" + simpleName + "Count", 1, Integer.class);

        assertMethodExists(clazz, "delete" + simpleName, 1);
        assertMethodTakesParams(clazz, "delete" + simpleName,
                                new Class[] { actorType });
        assertMethodReturns(clazz, "delete" + simpleName, 1, void.class);

        assertMethodExists(clazz, "insert" + simpleName, 1);
        assertMethodTakesParams(clazz, "insert" + simpleName,
                                new Class[] { actorType });
        assertMethodReturns(clazz, "insert" + simpleName, 1, actorType);

        assertMethodExists(clazz, "update" + simpleName, 1);
        assertMethodTakesParams(clazz, "update" + simpleName,
                                new Class[] { actorType });
        assertMethodReturns(clazz, "update" + simpleName, 1, void.class);

        if (!ignoreById) {
            assertMethodExists(clazz, "get" + simpleName + "ById", 1);
            assertMethodTakesParams(clazz, "get" + simpleName + "ById",
                    new Class[] { Short.class });
            assertMethodReturns(clazz, "get" + simpleName + "ById", 1,
                                actorType);
        }
    }

    private static void assertMethodTakesParams(Class<?> clazz,
            String methodName, Class<?>[] expectedInputs) {
        List<Class<?>> l = objectAccess.getMethodParamTypes(clazz, methodName,
                expectedInputs.length);
        if (expectedInputs.length != l.size()) {
            // shouldn't ever happen
            throw new AssertionError("input size mismatch");
        }
        int i = 0;
        for (Class<?> input : l) {
            if (input != expectedInputs[i]) {
                throw new AssertionError("Expected input type "
                        + expectedInputs[i] + " but got " + input);
            }
            i++;
        }

    }

    private static void assertMethodReturns(Class<?> clazz, String methodName,
            int numParams, Class<?> type) {
        assertMethodReturns(clazz, methodName, numParams, type, null);
    }

    private static void assertMethodReturns(Class<?> clazz, String methodName,
            int numParams, Class<?> type, Class<?>[] genericReturnTypes) {
        Class<?> c = objectAccess.getMethodReturnType(clazz, methodName,
                numParams);
        if (type != c) {
            throw new AssertionError("Expected " + methodName + " to return "
                    + type + " but got " + c);
        }
        if (genericReturnTypes != null) {
            List<Class<?>> l = objectAccess.getGenericReturnTypes(clazz,
                    methodName, numParams);
            if (genericReturnTypes.length != l.size()) {
                throw new AssertionError("Num generic return types don't match");
            }
            int i = 0;
            for (Class<?> gt : genericReturnTypes) {
                if (gt != l.get(i)) {
                    throw new AssertionError("Expected " + gt + " but got "
                            + l.get(i));
                }
                i++;
            }
        }
    }

    private static void assertMethodExists(Class<?> clazz, String methodName,
            int numParams) {
        if (!objectAccess.hasMethod(clazz, methodName, numParams)) {
            throw new AssertionError("Method " + methodName + " with "
                    + numParams + " params doesn't exist");
        }

    }

}
