/*
 *  Copyright (C) 2008-2009 WaveMaker Software, Inc.
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

package com.wavemaker.tools;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.lang.reflect.Method;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.mock.web.MockMultipartHttpServletRequest;
import org.springframework.web.servlet.support.WebContentGenerator;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.ClassUtils;
import com.wavemaker.runtime.server.HideExposeClasses;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.runtime.server.ServerUtils;
import com.wavemaker.runtime.service.GetParameterNamesFromEmailServiceClass;
import com.wavemaker.runtime.test.TestSpringContextTestCase;
import com.wavemaker.tools.javaservice.JavaServiceDefinition;
import com.wavemaker.tools.javaservice.testtypes.JavaServiceDefinitionClass_HiddenMethods;
import com.wavemaker.tools.javaservice.testtypes.JavaServiceDefinitionClass_ParamName;
import com.wavemaker.tools.javaservice.testtypes.JavaServiceDefinitionClass_ParamNamesWithVariables;
import com.wavemaker.tools.javaservice.testtypes.OutOfOrder_WM_12;
import com.wavemaker.tools.spring.AopAdvised;
import com.wavemaker.tools.spring.ComplexReturnBean;

/**
 * Server utility test cases
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public class TestServerUtils extends TestSpringContextTestCase {

    @Test
    public void testGetFileName() {

        MockHttpSession session = new MockHttpSession();

        MockHttpServletRequest mhr = new MockHttpServletRequest("POST", "/bar/foo.json");
        mhr.setSession(session);
        assertEquals("foo.json", ServerUtils.getFileName(mhr));

        mhr = new MockHttpServletRequest("POST", "/");
        mhr.setSession(session);
        assertEquals("", ServerUtils.getFileName(mhr));

        mhr = new MockHttpServletRequest("POST", "/foo");
        mhr.setSession(session);
        assertEquals("foo", ServerUtils.getFileName(mhr));

        mhr = new MockHttpServletRequest("POST", "/foo.bar");
        mhr.setSession(session);
        assertEquals("foo.bar", ServerUtils.getFileName(mhr));

        mhr = new MockHttpServletRequest("POST", "/foo.bar");
        mhr.setSession(session);
        assertEquals("foo.bar", ServerUtils.getFileName(mhr));

        mhr = new MockHttpServletRequest("POST", "/foo.bar/baz");
        mhr.setSession(session);
        assertEquals("baz", ServerUtils.getFileName(mhr));
    }

    @Test
    public void testGetDirectory() {

        MockHttpSession session = new MockHttpSession();

        MockHttpServletRequest mhr = new MockHttpServletRequest("POST", "/bar/foo.json");
        mhr.setSession(session);
        assertEquals("foo.json", ServerUtils.getFileName(mhr));

        mhr = new MockHttpServletRequest("POST", "/");
        mhr.setSession(session);
        assertEquals("/", ServerUtils.getDirectory(mhr));

        mhr = new MockHttpServletRequest("POST", "/foo");
        mhr.setSession(session);
        assertEquals("/", ServerUtils.getDirectory(mhr));

        mhr = new MockHttpServletRequest("POST", "/foo/bar");
        mhr.setSession(session);
        assertEquals("/foo", ServerUtils.getDirectory(mhr));

        mhr = new MockHttpServletRequest("POST", "/foo.bar/baz");
        mhr.setSession(session);
        assertEquals("/foo.bar", ServerUtils.getDirectory(mhr));

        mhr = new MockHttpServletRequest("POST", "/foo.bar/baz/");
        mhr.setSession(session);
        assertEquals("/foo.bar/baz", ServerUtils.getDirectory(mhr));
    }

    @Test
    public void testGetServiceName() {

        MockHttpSession session = new MockHttpSession();

        MockHttpServletRequest mhr = new MockHttpServletRequest("POST", "/bar/foo.json");
        mhr.setSession(session);
        assertEquals("foo", ServerUtils.getServiceName(mhr));

        mhr = new MockHttpServletRequest("POST", "/bar/foo.download");
        assertEquals("foo", ServerUtils.getServiceName(mhr));

        mhr = new MockHttpServletRequest("POST", "/bar/foo.upload");
        assertEquals("foo", ServerUtils.getServiceName(mhr));

        mhr = new MockHttpServletRequest("POST", "/bar/foo.bar");
        assertNull(ServerUtils.getServiceName(mhr));
    }

    @Test
    public void testGetMethod() {

        String expectedMethod = "foo";
        String expectedOtherEntry = "fooValue";

        Map<String, Object[]> params = new HashMap<String, Object[]>();
        params.put(ServerConstants.METHOD, new String[] { expectedMethod });
        params.put("fooKey", new String[] { expectedOtherEntry });

        String actualMethod = ServerUtils.getMethod(params);
        assertEquals(expectedMethod, actualMethod);
        assertFalse(params.containsKey(ServerConstants.METHOD));
    }

    @Test
    public void testGetNonexistentMethod() {

        Map<String, Object[]> params = new HashMap<String, Object[]>();
        params.put("fooKey", new String[] { "fooValue" });

        try {
            ServerUtils.getMethod(params);
            fail("expected error");
        } catch (WMRuntimeException e) {
            assertTrue(e.getMessage().startsWith("invalid request"));
        }
    }

    @Test
    public void testMergeParams() {

        String contents = "foo";

        MockMultipartHttpServletRequest req = new MockMultipartHttpServletRequest();
        req.setMethod(WebContentGenerator.METHOD_POST);
        req.setParameter("param1", "bar");
        req.setParameter(ServerConstants.METHOD, "testUpload");
        req.addFile(new MockMultipartFile("param2", contents.getBytes()));

        Map<String, Object[]> params = ServerUtils.mergeParams(req);
        assertTrue(params.containsKey("param1"));
        assertTrue(params.containsKey("param2"));
        assertTrue(params.containsKey(ServerConstants.METHOD));

        req.setParameter("param2", "foo");
        params = ServerUtils.mergeParams(req);
        assertTrue(params.containsKey("param1"));
        assertTrue(params.containsKey("param2"));
        assertTrue(params.containsKey(ServerConstants.METHOD));
        assertEquals(2, params.get("param2").length);
    }

    @Test
    public void testGetParameterNames() throws Exception {

        Method method = null;
        for (Method m : ComplexReturnBean.class.getMethods()) {
            if (m.getName().equals("testUpload")) {
                method = m;
                break;
            }
        }
        assertNotNull(method);

        List<String> paramNames = ServerUtils.getParameterNames(method);
        assertEquals(2, paramNames.size());
        assertEquals("param1", paramNames.get(0));
        assertEquals("param2", paramNames.get(1));

        Method method2 = null;
        for (Method m : JavaServiceDefinitionClass_ParamName.class.getMethods()) {
            if (m.getName().equals("doSomething")) {
                method2 = m;
                break;
            }
        }
        assertNotNull(method2);

        paramNames = ServerUtils.getParameterNames(method2);
        assertEquals(2, paramNames.size());
        assertEquals("foo", paramNames.get(0));
        assertEquals("bar", paramNames.get(1));

        List<Method> methods = ClassUtils.getPublicMethods(JavaServiceDefinitionClass_ParamName.class);
        Collection<Method> retMethods = JavaServiceDefinition.filterOverloadedMethods(methods);
        Method method3 = null;
        for (Method m : retMethods) {
            if (m.getName().equals("doSomething")) {
                method3 = m;
                break;
            }
        }
        assertNotNull(method3);
        paramNames = ServerUtils.getParameterNames(method3);
        assertEquals(2, paramNames.size());
        assertEquals("foo", paramNames.get(0));
        assertEquals("bar", paramNames.get(1));
    }

    @Test
    public void testGetParameterNames_throughCL() throws Exception {

        Class<?> runtimeServiceClass = ClassLoaderUtils.loadClass(JavaServiceDefinitionClass_ParamName.class.getName(), getClass().getClassLoader());
        List<Method> methods = ClassUtils.getPublicMethods(runtimeServiceClass);
        Collection<Method> retMethods = JavaServiceDefinition.filterOverloadedMethods(methods);

        Method method3 = null;
        for (Method m : retMethods) {
            if (m.getName().equals("doSomething")) {
                method3 = m;
                break;
            }
        }
        assertNotNull(method3);
        List<String> paramNames = ServerUtils.getParameterNames(method3);
        assertEquals(2, paramNames.size());
        assertEquals("foo", paramNames.get(0));
        assertEquals("bar", paramNames.get(1));
    }

    // MAV-1360 - didn't repro, but tests back-end functionality
    @Test
    public void testGetParameterNamesWithVariables() throws Exception {

        List<Method> methods = ClassUtils.getPublicMethods(JavaServiceDefinitionClass_ParamNamesWithVariables.class);
        Collection<Method> retMethods = JavaServiceDefinition.filterOverloadedMethods(methods);
        Method method3 = null;
        for (Method m : retMethods) {
            if (m.getName().equals("testMe")) {
                method3 = m;
                break;
            }
        }
        assertNotNull(method3);
        List<String> paramNames = ServerUtils.getParameterNames(method3);
        assertEquals(2, paramNames.size());
        assertEquals("firstName", paramNames.get(0));
        assertEquals("lastName", paramNames.get(1));
    }

    // MAV-1758
    @Test
    public void testGetParameterNamesFromEmailServiceClass() throws Exception {

        List<Method> methods = ClassUtils.getPublicMethods(GetParameterNamesFromEmailServiceClass.class);
        Collection<Method> retMethods = JavaServiceDefinition.filterOverloadedMethods(methods);
        Method method3 = null;
        for (Method m : retMethods) {
            if (m.getName().equals("sendMail")) {
                method3 = m;
                break;
            }
        }
        assertNotNull(method3);
        List<String> paramNames = ServerUtils.getParameterNames(method3);
        assertEquals(9, paramNames.size());
        assertEquals("Host", paramNames.get(0));
        assertEquals("Port", paramNames.get(1));
        assertEquals("User", paramNames.get(2));
        assertEquals("Pass", paramNames.get(3));
        assertEquals("To", paramNames.get(4));
        assertEquals("Cc", paramNames.get(5));
        assertEquals("From", paramNames.get(6));
        assertEquals("Subject", paramNames.get(7));
        assertEquals("Message", paramNames.get(8));
    }

    // WM-12
    @Test
    public void testGetParameterNames_OutOfOrder_WM_12() throws Exception {

        List<Method> methods = ClassUtils.getPublicMethods(OutOfOrder_WM_12.class);
        Collection<Method> retMethods = JavaServiceDefinition.filterOverloadedMethods(methods);
        Method method3 = null;
        for (Method m : retMethods) {
            if (m.getName().equals("testFunction")) {
                method3 = m;
                break;
            }
        }
        assertNotNull(method3);

        List<String> paramNames = ServerUtils.getParameterNames(method3);
        assertEquals(3, paramNames.size());
        assertEquals("one", paramNames.get(0));
        assertEquals("two", paramNames.get(1));
        assertEquals("something", paramNames.get(2));
    }

    @Test
    public void testGetClientExposedMethods() throws Exception {

        List<Method> methods;

        methods = ServerUtils.getClientExposedMethods(HideExposeClasses.Default.class);
        assertEquals(2, methods.size());
        assertTrue(methods.contains(HideExposeClasses.Default.class.getMethod("foo")));
        assertTrue(methods.contains(HideExposeClasses.Default.class.getMethod("expose")));

        methods = ServerUtils.getClientExposedMethods(HideExposeClasses.Expose.class);
        assertEquals(2, methods.size());
        assertTrue(methods.contains(HideExposeClasses.Expose.class.getMethod("foo")));
        assertTrue(methods.contains(HideExposeClasses.Expose.class.getMethod("expose")));

        methods = ServerUtils.getClientExposedMethods(HideExposeClasses.Hide.class);
        assertEquals(1, methods.size());
        assertTrue(methods.contains(HideExposeClasses.Hide.class.getMethod("expose")));

        methods = ServerUtils.getClientExposedMethods(JavaServiceDefinitionClass_HiddenMethods.class);
        assertEquals(0, methods.size());

        methods = ServerUtils.getClientExposedMethods(HideExposeClasses.Conflict.class);
        assertEquals(0, methods.size());
    }

    @Test
    public void testGetRealClass() throws Exception {

        String s = "hi";
        assertEquals(String.class, ServerUtils.getRealClass(s));

        Object aopObject = getBean("aopAdvisedServiceBean");
        assertTrue(aopObject.getClass().getName().contains("CGLIB"));
        assertEquals(AopAdvised.class, ServerUtils.getRealClass(aopObject));
    }

    @Test
    public void testGetClientExposedMethods_ParamNames_AOP() throws Exception {

        Object aopObject = getBean("aopAdvisedServiceBean");
        assertTrue(aopObject.getClass().getName().contains("CGLIB"));

        List<Method> methods = ServerUtils.getClientExposedMethods(ServerUtils.getRealClass(aopObject));
        assertTrue(methods.size() >= 3);

        boolean gotGetIval = false;
        boolean gotSetIval = false;
        boolean gotTestUpload = false;

        for (Method method : methods) {
            if (0 == "getIval".compareTo(method.getName())) {
                gotGetIval = true;
            } else if (0 == "setIval".compareTo(method.getName())) {
                gotSetIval = true;
            } else if (0 == "testUpload".compareTo(method.getName())) {
                gotTestUpload = true;

                List<String> names = ServerUtils.getParameterNames(method);
                assertEquals(2, names.size());
                assertEquals("param1", names.get(0));
                assertEquals("param2", names.get(1));
            }
        }

        assertTrue(gotGetIval);
        assertTrue(gotSetIval);
        assertTrue(gotTestUpload);
    }

    @Test
    public void testGetParamNamesFromInterface() throws Exception {

        Method m = ServerUtilsParamNameConcrete.class.getMethod("getCalculatedString", String.class, String.class);
        assertNotNull(m);
        List<String> p = ServerUtils.getParameterNames(m);
        assertEquals(2, p.size());
        assertEquals("param1", p.get(0));
        assertEquals("param2", p.get(1));
    }
}