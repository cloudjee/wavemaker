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

package com.wavemaker.tools.javaservice;

import java.util.List;

/**
 * @author Matt Small
 */
public class JavaServiceDefinitionClass {

    // test MAV-897 by throwing an exception in the static initializer
    static {
        if (!false) {
            throw new RuntimeException("MAV-897 failure");
        }
    }

    public void testOperations() {
    }

    public void op1(String s, int i) {
    }

    public void op2(List<String> l) {
    }

    public JavaServiceDefinitionClass op3() {
        return null;
    }

    public List<JavaServiceDefinitionClass> op4() {
        return null;
    }

    public JavaServiceDefinitionClass[] op5() {
        return null;
    }

    public FooClass getQO() {
        return null;
    }

    public static class FooClass {

    }
}