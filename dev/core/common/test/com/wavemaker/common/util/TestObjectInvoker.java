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

import java.util.Map;

import com.wavemaker.common.util.MethodNotFoundRuntimeException;
import com.wavemaker.common.util.ObjectAccess;
import com.wavemaker.infra.WMTestCase;

/**
 * @author Simon Toens
 * @version $Rev:22672 $ - $Date:2008-05-30 14:37:26 -0700 (Fri, 30 May 2008) $
 * 
 */
public class TestObjectInvoker extends WMTestCase {

    private ObjectAccess oi = ObjectAccess.getInstance();

    public void setUp() {
        A.RTN = null;
        A.RTN_OBJ = null;
    }

    static class Arg1 {
    }

    static class A {

        static String SIMPLE_METHOD_RTN = "simpleMethodRtn";

        static Arg1 RTN = null;

        static Object RTN_OBJ = null;

        public String simpleMethod() {
            return SIMPLE_METHOD_RTN;
        }

        public Integer simpleMethodArg(Integer i) {
            return i;
        }

        public ObjectAccess simpleMethodArg(Integer i, ObjectAccess oi) {
            return oi;
        }

        public void methodArg1(Arg1 a) {
            RTN = a;
        }

        public void methodObject(Object o) {
            RTN_OBJ = o;
        }

        @SuppressWarnings("unused")
        private void privateMethod() {
        }

        protected void protectedMethod() {
        }

        void packageProtectedMethod() {
        }

    }
    
    class B extends A {

        private String foo;
        
        public String methodInChildClass(Integer i) {
            return i.toString();
        }

        public void setFoo(String foo) { this.foo = foo; }
        public String getFoo() { return foo; }
        
    }

    class AnnotationClass {
        public void annotatedMethod() {}

        public void notAnnotatedMethod() {}

    }

    public void testMethodNoArg() {
        String rtn = oi.invoke(new A(), "simpleMethod");
        assertTrue(rtn == A.SIMPLE_METHOD_RTN);
    }

    public void testMethodArg() {
        Integer i = Integer.valueOf(2);
        Integer rtn = oi.invoke(new A(), "simpleMethodArg", i);
        assertTrue(rtn == i);
    }

    public void testMethodArgOverloaded() {
        Integer i = Integer.valueOf(2);
        ObjectAccess rtn = oi.invoke(new A(), "simpleMethodArg", i, oi);
        assertTrue(rtn == oi);
    }

    public void testMethodArg1() {
        Arg1 a = new Arg1();
        assertTrue(A.RTN == null);
        oi.invoke(new A(), "methodArg1", a);
        assertTrue(A.RTN == a);
    }

    public void testMethodObject() {
        Arg1 a = new Arg1();
        assertTrue(A.RTN_OBJ == null);
        oi.invoke(new A(), "methodObject", a);
        assertTrue(A.RTN_OBJ == a);
    }

    public void testCannotCallPrivateMethod() {
        try {
            oi.invoke(new A(), "privateMethod");
        } catch (MethodNotFoundRuntimeException ex) {
            return;
        }
        fail();
    }

    public void testCannotCallProtectedMethod() {
        try {
            oi.invoke(new A(), "protectedMethod");
        } catch (MethodNotFoundRuntimeException ex) {
            return;
        }
        fail();
    }

    public void testCannotCallPackageProtectedMethod() {
        try {
          oi.invoke(new A(), "packageProtectedMethod");
        } catch (MethodNotFoundRuntimeException ex) {
            return;
        }
        fail();
    }
    
    public void testMethodInChildClass() {
        String s = oi.invoke(new B(), "methodInChildClass", 2);
        assertTrue(s.equals("2"));
    }
    
    public void testMethodInParentClass() {
        String rtn = oi.invoke(new B(), "simpleMethod");
        assertTrue(rtn == A.SIMPLE_METHOD_RTN);        
    }

    public void testGetProperties() {
        Map<String, Class<?>> properties = oi.getProperties(B.class);
        assertTrue(properties.size() == 1);
        assertTrue(properties.get("foo") == String.class);
    }

    public void testNewInstance() {
        TestObjectInvoker t = (TestObjectInvoker)
            oi.newInstance("com.wavemaker.common.util.TestObjectInvoker");
        assertTrue(t != null);
    }

    public void testSetProperty() {
        B b = new B();
        oi.setProperty(b, "foo", "test");
        assertTrue(b.getFoo().equals("test"));
    }

    public void testSetPropertyToNull() {
        B b = new B();
        oi.setProperty(b, "foo", null);
        assertTrue(b.getFoo() == null);
    }

}
