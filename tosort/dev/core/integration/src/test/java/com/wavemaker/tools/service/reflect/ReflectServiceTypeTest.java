/*
 *  Copyright (C) 2009 WaveMaker Software, Inc.
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

package com.wavemaker.tools.service.reflect;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.File;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import org.junit.Test;
import org.springframework.util.ClassUtils;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONState;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.runtime.javaservice.JavaServiceType;
import com.wavemaker.runtime.service.ParsedServiceArguments;
import com.wavemaker.runtime.service.TypedServiceReturn;
import com.wavemaker.runtime.service.reflect.ReflectServiceType;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;
import com.wavemaker.runtime.test.TestSpringContextTestCase;
import com.wavemaker.tools.spring.ComplexReturnBean;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestReflectServiceType extends TestSpringContextTestCase {

    @Test
    public void testFindMethod() throws Exception {

        InternalClass a = new InternalClass();
        Method m = InternalClass.class.getMethod("firstTestMethod", int.class, short.class);
        assertNotNull(m);
        assertEquals(String.class, m.getReturnType());

        Method mp = ReflectServiceType.findMethod("firstTestMethod", a, 2);
        assertEquals(m, mp);
    }

    @Test
    public void testIC_FirstTestMethod() throws Exception {

        InternalClass a = new InternalClass();
        JSON json = JSONUnmarshaller.unmarshal("[1, 2]");
        assertTrue(json.isList());
        JSONArray params = (JSONArray) json;

        JSONState jsonState = new JSONState();

        ReflectServiceWire rsw = new ReflectServiceWire();
        rsw.setServiceBean(a);
        ReflectServiceType rst = new JavaServiceType();

        ParsedServiceArguments serviceArgs = rst.parseServiceArgs(rsw, "firstTestMethod", params, jsonState);
        TypedServiceReturn o = rst.invokeMethod(rsw, "firstTestMethod", serviceArgs, jsonState);
        assertEquals("firstTestMethod(" + 1 + ", " + 2 + ")", o.getReturnValue());
        assertEquals(String.class.getName(), o.getReturnType().getTypeDefinition().getTypeName());
    }

    @Test
    public void testParamsFromAnnotatedMethod() throws Exception {

        Method method = null;
        for (Method m : ComplexReturnBean.class.getMethods()) {
            if (m.getName().equals("testUpload")) {
                method = m;
                break;
            }
        }
        assertNotNull(method);

        Map<String, Object[]> params = new HashMap<String, Object[]>();
        params.put("parma1", new String[] { "foo" });
        params.put("param2", new File[] { new File("/") });

        Object[] ret = ReflectServiceType.paramsFromAnnotatedMethod(method, params);
        assertNotNull(ret);
        assertEquals(2, ret.length);
    }

    @Test
    public void testIC2_FirstTestMethod() throws Exception {

        JSONState jsonState = new JSONState();

        InternalClass2 ic = new InternalClass2();
        JSON json = JSONUnmarshaller.unmarshal("[{\"attr\": 12}, \"foobar\", 12.49]");
        assertTrue(json.isList());
        JSONArray params = (JSONArray) json;

        ReflectServiceWire rsw = new ReflectServiceWire();
        rsw.setServiceBean(ic);
        ReflectServiceType rst = new JavaServiceType();

        ParsedServiceArguments serviceArgs = rst.parseServiceArgs(rsw, "ic2_firstTestMethod", params, jsonState);
        TypedServiceReturn o = rst.invokeMethod(rsw, "ic2_firstTestMethod", serviceArgs, jsonState);

        assertEquals("12foobar12.49", o.getReturnValue());
        assertEquals(String.class.getName(), o.getReturnType().getTypeDefinition().getTypeName());
    }

    @Test
    public void testIC2_failInvoke() {

        try {
            InternalClass2 ic = new InternalClass2();
            JSONState jsonState = new JSONState();

            ReflectServiceWire rsw = new ReflectServiceWire();
            rsw.setServiceBean(ic);
            ReflectServiceType rst = new JavaServiceType();

            ParsedServiceArguments serviceArgs = rst.parseServiceArgs(rsw, "failInvoke", (JSONArray) JSONUnmarshaller.unmarshal("[]"), jsonState);
            rst.invokeMethod(rsw, "failInvoke", serviceArgs, jsonState);

            fail("expected exception");
        } catch (WMRuntimeException e) {
            assertEquals(MessageResource.JSONUTILS_FAILEDINVOKE.getId(), e.getMessageId());

            assertEquals("Failed to invoke method \"failInvoke\" in \"class " + InternalClass2.class.getName() + "\"", e.getMessage());
            assertEquals("the exception", e.getCause().getMessage());
        }
    }

    @Test
    public void testCPInvokeClass_cpic_Short() throws Exception {

        JSONState jsonState = new JSONState();

        CPInvokeClass c = new CPInvokeClass();
        JSON json = JSONUnmarshaller.unmarshal("[12]");
        assertTrue(json.isList());
        JSONArray params = (JSONArray) json;

        ReflectServiceWire rsw = new ReflectServiceWire();
        rsw.setServiceBean(c);
        ReflectServiceType rst = new JavaServiceType();

        ParsedServiceArguments serviceArgs = rst.parseServiceArgs(rsw, "cpic_Short", params, jsonState);
        TypedServiceReturn o = rst.invokeMethod(rsw, "cpic_Short", serviceArgs, jsonState);
        assertEquals("short: 12", o.getReturnValue());
    }

    @Test
    public void testCPInvokeClass_cpic_Many() throws Exception {

        JSONState jsonState = new JSONState();

        CPInvokeClass c = new CPInvokeClass();
        JSON json = JSONUnmarshaller.unmarshal("[12, 13, 14, 15, 16, 17, 18, 19, 20, 21.1]");
        assertTrue(json.isList());
        JSONArray params = (JSONArray) json;

        ReflectServiceWire rsw = new ReflectServiceWire();
        rsw.setServiceBean(c);
        ReflectServiceType rst = new JavaServiceType();

        ParsedServiceArguments serviceArgs = rst.parseServiceArgs(rsw, "cpic_Many", params, jsonState);
        TypedServiceReturn o = rst.invokeMethod(rsw, "cpic_Many", serviceArgs, jsonState);
        assertEquals("12, 13, 14, 15, 16, 17, 18, 19.0, 20.0, 21.1", o.getReturnValue());
    }

    @Test
    public void testCPInvokeClass_cpic_Many_LowerCase() throws Exception {

        JSONState jsonState = new JSONState();

        CPInvokeClass c = new CPInvokeClass();
        JSON json = JSONUnmarshaller.unmarshal("[12, 13, 14, 15, 20, 21.1]");
        assertTrue(json.isList());
        JSONArray params = (JSONArray) json;

        ReflectServiceWire rsw = new ReflectServiceWire();
        rsw.setServiceBean(c);
        ReflectServiceType rst = new JavaServiceType();

        ParsedServiceArguments serviceArgs = rst.parseServiceArgs(rsw, "cpic_Many_LowerCase", params, jsonState);
        TypedServiceReturn o = rst.invokeMethod(rsw, "cpic_Many_LowerCase", serviceArgs, jsonState);

        assertEquals("12, 13, 14, 15, 20.0, 21.1", o.getReturnValue());
    }

    @Test
    public void testCPInvokeClass_noArgs_EmptyArray() throws Exception {

        JSONState jsonState = new JSONState();

        CPInvokeClass c = new CPInvokeClass();
        JSON json = JSONUnmarshaller.unmarshal("[]");
        assertTrue(json.isList());
        JSONArray params = (JSONArray) json;

        ReflectServiceWire rsw = new ReflectServiceWire();
        rsw.setServiceBean(c);
        ReflectServiceType rst = new JavaServiceType();

        ParsedServiceArguments serviceArgs = rst.parseServiceArgs(rsw, "noArgs", params, jsonState);
        TypedServiceReturn o = rst.invokeMethod(rsw, "noArgs", serviceArgs, jsonState);

        assertEquals("noargs", o.getReturnValue());
    }

    @Test
    public void testMethodOverloading() throws Exception {

        JSONState jsonState = new JSONState();

        OverloadedMethodsClass c = new OverloadedMethodsClass();
        ReflectServiceWire rsw = new ReflectServiceWire();
        rsw.setServiceBean(c);
        ReflectServiceType rst = new JavaServiceType();

        JSON json = JSONUnmarshaller.unmarshal("[\"foo\", 12.2]");
        assertTrue(json.isList());
        JSONArray params = (JSONArray) json;
        ParsedServiceArguments serviceArgs = rst.parseServiceArgs(rsw, "args", params, jsonState);
        TypedServiceReturn o = rst.invokeMethod(rsw, "args", serviceArgs, jsonState);
        assertEquals("foo12.2", o.getReturnValue());

        json = JSONUnmarshaller.unmarshal("[\"foo\", 12.2, false]");
        assertTrue(json.isList());
        params = (JSONArray) json;
        serviceArgs = rst.parseServiceArgs(rsw, "args", params, jsonState);
        o = rst.invokeMethod(rsw, "args", serviceArgs, jsonState);
        assertEquals("foo12.2false", o.getReturnValue());
    }

    @Test
    public void testBadMethodOverloading() throws Exception {

        JSONState jsonState = new JSONState();

        OverloadedMethodsClass c = new OverloadedMethodsClass();
        ReflectServiceWire rsw = new ReflectServiceWire();
        rsw.setServiceBean(c);
        ReflectServiceType rst = new JavaServiceType();

        try {
            JSON json = JSONUnmarshaller.unmarshal("[1]");
            assertTrue(json.isList());
            JSONArray params = (JSONArray) json;
            ParsedServiceArguments serviceArgs = rst.parseServiceArgs(rsw, "args", params, jsonState);
            rst.invokeMethod(rsw, "args", serviceArgs, jsonState);
            fail("expected exception");
        } catch (WMRuntimeException e) {
            assertEquals(MessageResource.JSONUTILS_BADMETHODOVERLOAD.getId(), e.getMessageId());
        }
    }

    @Test
    public void testListMethodArg() throws Exception {

        JSONState jsonState = new JSONState();

        InternalClass ic = new InternalClass();
        ReflectServiceWire rsw = new ReflectServiceWire();
        rsw.setServiceBean(ic);
        ReflectServiceType rst = new JavaServiceType();

        JSON json = JSONUnmarshaller.unmarshal("[[\"foo\", \"bar\"]]");
        assertTrue(json.isList());
        JSONArray params = (JSONArray) json;
        ParsedServiceArguments serviceArgs = rst.parseServiceArgs(rsw, "listArgs", params, jsonState);
        assertEquals(1, serviceArgs.getArguments().length);
        assertTrue(serviceArgs.getArguments()[0] instanceof List);
        List<?> resultList = (List<?>) serviceArgs.getArguments()[0];
        assertEquals(2, resultList.size());
        assertTrue(resultList.contains("foo"));
        assertTrue(resultList.contains("bar"));

        json = JSONUnmarshaller.unmarshal("[[\"foo\", \"bar\"]]");
        assertTrue(json.isList());
        params = (JSONArray) json;
        serviceArgs = rst.parseServiceArgs(rsw, "setSet", params, jsonState);
        assertEquals(1, serviceArgs.getArguments().length);
        assertTrue(serviceArgs.getArguments()[0] instanceof Set);
        Set<?> resultSet = (Set<?>) serviceArgs.getArguments()[0];
        assertEquals(2, resultSet.size());
        assertTrue(resultSet.contains("foo"));
        assertTrue(resultSet.contains("bar"));
    }

    @Test
    public void testConversionArray() throws Exception {

        JSONState jsonState = new JSONState();

        InternalClass ic = new InternalClass();
        ReflectServiceWire rsw = new ReflectServiceWire();
        rsw.setServiceBean(ic);
        ReflectServiceType rst = new JavaServiceType();

        JSON json = JSONUnmarshaller.unmarshal("[[1,2]]");
        assertTrue(json.isList());
        JSONArray params = (JSONArray) json;
        ParsedServiceArguments serviceArgs = rst.parseServiceArgs(rsw, "setArrayArgs", params, jsonState);

        assertEquals(1, serviceArgs.getArguments().length);
        assertEquals(ClassUtils.forName("int[]", null), serviceArgs.getArguments()[0].getClass());
        int[] retContents = (int[]) serviceArgs.getArguments()[0];
        assertEquals(2, retContents.length);

        assertEquals(1, retContents[0]);
        assertEquals(2, retContents[1]);
    }

    @Test
    public void testConversionEmptyArray() throws Exception {

        JSONState jsonState = new JSONState();

        InternalClass ic = new InternalClass();
        ReflectServiceWire rsw = new ReflectServiceWire();
        rsw.setServiceBean(ic);
        ReflectServiceType rst = new JavaServiceType();

        JSON json = JSONUnmarshaller.unmarshal("[[]]");
        assertTrue(json.isList());
        JSONArray params = (JSONArray) json;
        ParsedServiceArguments serviceArgs = rst.parseServiceArgs(rsw, "setArrayArgs", params, jsonState);

        assertEquals(1, serviceArgs.getArguments().length);
        assertEquals(ClassUtils.forName("int[]", null), serviceArgs.getArguments()[0].getClass());
        int[] retContents = (int[]) serviceArgs.getArguments()[0];
        assertEquals(0, retContents.length);
    }

    @Test
    public void testExceptionInvoke() throws Exception {

        JSONState jsonState = new JSONState();

        InternalClass2 cp = new InternalClass2();
        ReflectServiceWire rsw = new ReflectServiceWire();
        rsw.setServiceBean(cp);
        ReflectServiceType rst = new JavaServiceType();

        try {
            ParsedServiceArguments serviceArgs = rst.parseServiceArgs(rsw, "failRuntimeInvoke", (JSONArray) JSONUnmarshaller.unmarshal("[]"),
                jsonState);
            rst.invokeMethod(rsw, "cpic_Short", serviceArgs, jsonState);
            fail("didn't get an exception");
        } catch (WMRuntimeException e) {
            assertTrue(e.getCause() instanceof WMRuntimeException);
            assertEquals("the runtime exception", e.getCause().getMessage());
        }
    }

    // test classes
    public static class InternalClass {

        private List<String> arg;

        private Set<String> set;

        private int[] array;

        private int attr = 0;

        private Map<String, String> map;

        public InternalClass() {
        }

        public String firstTestMethod(int i, short j) {
            return "firstTestMethod(" + i + ", " + j + ")";
        }

        public int getAttr() {
            return this.attr;
        }

        public void setAttr(int attr) {
            this.attr = attr;
        }

        public void setArrayArgs(int[] arg) {
            this.array = arg;
        }

        public int[] getArrayArgs() {
            return this.array;
        }

        public void listArgs(List<String> arg) {
            this.arg = arg;
        }

        public List<String> getArg() {
            return this.arg;
        }

        public Set<String> getSet() {
            return this.set;
        }

        public void setSet(Set<String> set) {
            this.set = set;
        }

        public Map<String, String> getMap() {
            return this.map;
        }

        public void setMap(Map<String, String> map) {
            this.map = map;
        }
    }

    public static class InternalClass2 {

        public String ic2_firstTestMethod(InternalClass i, String arg2, float arg3) {
            return "" + i.getAttr() + arg2 + arg3;
        }

        public void failInvoke() throws Exception {
            throw new Exception("the exception");
        }

        public void failRuntimeInvoke() {
            throw new WMRuntimeException("the runtime exception");
        }
    }

    public static class CPInvokeClass {

        public String noArgs() {
            return "noargs";
        }

        public String cpic_Short(Short s) {
            return "short: " + s;
        }

        public String cpic_Many(Byte b, Short s, Integer i, Long l, BigInteger bi, AtomicInteger ai, AtomicLong al, Float f, Double d, BigDecimal bd) {
            return "" + b + ", " + s + ", " + i + ", " + l + ", " + bi + ", " + ai + ", " + al + ", " + f + ", " + d + ", " + bd;
        }

        public String cpic_Many_LowerCase(byte b, short s, int i, long l, float f, double d) {
            return "" + b + ", " + s + ", " + i + ", " + l + ", " + f + ", " + d;
        }
    }

    public static class OverloadedMethodsClass {

        public String args(String arg0, float arg1) {
            return "" + arg0 + arg1;
        }

        public String args(String arg0, float arg1, boolean arg2) {
            return "" + arg0 + arg1 + arg2;
        }

        public String args(int i) {
            return "" + i;
        }

        public String args(float i) {
            return "" + i;
        }
    }
}
