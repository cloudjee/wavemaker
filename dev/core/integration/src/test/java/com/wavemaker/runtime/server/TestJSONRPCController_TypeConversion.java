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
package com.wavemaker.runtime.server;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import com.wavemaker.runtime.server.testspring.BeanClass;
import com.wavemaker.runtime.test.TestSpringContextTestCase;

/**
 * Extended tests for JSONRPCController.  Test type conversion.
 *
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestJSONRPCController_TypeConversion
        extends TestSpringContextTestCase {

    @Test public void testNoTranslation() throws Exception {

        BeanClass bc = new BeanClass();
        bc.setName("foo");

        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "noTranslationObject",
                new Object[]{bc}, resp);
        
        String ret = resp.getContentAsString();
        assertEquals("{\"result\":null}", ret);
    }

    @Test public void testSingleTranslation() throws Exception {

        BeanClass bc = new BeanClass();
        bc.setName("foo");

        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "singleParameterType",
                new Object[]{bc, bc.getClass().getCanonicalName()}, resp);
        String ret = resp.getContentAsString();
        assertEquals("{\"result\":null}", ret);
    }

    @Test public void testManyTranslations() throws Exception {

        BeanClass bc = new BeanClass();
        bc.setName("foo");
        BeanClass bc2 = new BeanClass();
        bc.setName("bar");
        BeanClass bc3 = new BeanClass();
        bc.setName("baz");

        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "manyParameterTypes",
                new Object[]{bc, bc.getClass().getCanonicalName(), bc2, bc3,
                bc.getClass().getCanonicalName()}, resp);
        String ret = resp.getContentAsString();
        assertEquals("{\"result\":null}", ret);
    }

    // MAV-683
    @Test public void testNestedListGenerics() throws Exception {
                
        Object o = invokeService_toObject("complexReturnBean",
                "getNestedStringList",
                new Object[]{new Object[]{new Object[]{1}, new Object[]{2}}});
        assertTrue(o instanceof ArrayList);
        assertEquals("1", ((List<?>)((List<?>)o).get(0)).get(0));

        Object res = invokeService_toObject("complexReturnBean",
                "getNestedStringList",
                new Object[]{new Object[]{new Object[]{"1"}, new Object[]{"2"}}});
        assertTrue(res instanceof ArrayList);
        assertEquals("2", ((List<?>)((List<?>)o).get(1)).get(0));
    }

    // MAV-683
    @Test public void testBeanNestedListGenerics() throws Exception {

        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        MockHttpServletRequest mhr = new MockHttpServletRequest("POST", "/"
                + "complexReturnBean" + ".json");
        mhr.setContent("{\"params\": [{\"listListString\": [[1],[2]]}], \"method\": \"getNestedBeanStringList\", \"id\": 3}".getBytes());
        
        invokeService(mhr, mhresp);
        String result = mhresp.getContentAsString();
        assertEquals("{\"result\":{\"array\":null,\"listListString\":[[\"1\"],[\"2\"]]}}", result);
    }

    // MAV-669
    @Test public void testSendFile() throws Exception {

        String filename = "bar.txt";
        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "sendFile", new Object[]{filename},
                resp);
        String ret = resp.getContentAsString();

        assertTrue(ret.startsWith("{\""+ServerConstants.RESULTS_PART+
                "\":\""));
        assertTrue(ret.endsWith(filename+"\"}"));
    }

    @Test public void testReceiveFile() throws Exception {

        String filename = "bar.txt";
        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "receiveFile",
                new Object[]{filename}, resp);
        String ret = resp.getContentAsString();

        assertTrue("ret: "+ret, ret.startsWith("{\""+
                ServerConstants.RESULTS_PART+"\":\""));
        assertTrue(ret.endsWith(filename+"\"}"));
    }
}
