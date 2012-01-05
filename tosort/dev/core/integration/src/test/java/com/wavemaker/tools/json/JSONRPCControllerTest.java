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

package com.wavemaker.tools.json;

import static com.wavemaker.json.util.JsonTestUtils.assertJSONStringsEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNotSame;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.servlet.support.WebContentGenerator;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.json.TestJSONSerialization.CycleA;
import com.wavemaker.json.TestJSONSerialization.CycleB;
import com.wavemaker.runtime.data.sample.Product;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.runtime.server.json.JSONUtils;
import com.wavemaker.runtime.server.testspring.DateReturnBean;
import com.wavemaker.runtime.server.testspring.DateReturnBean.WrappedDate;
import com.wavemaker.runtime.test.TestSpringContextTestCase;
import com.wavemaker.tools.spring.ComplexReturnBean;

/**
 * Test for the JSON RPC Controller.
 * 
 * @author Matt Small
 * @version $Rev$ - $Date$
 * 
 */
public class TestJSONRPCController extends TestSpringContextTestCase {

    @Test
    public void testHandleNoargRequest() throws Exception {

        Product[] pl = (Product[]) invokeService_toObject("sampleProductService", "getProducts", null);

        Product p1 = pl[0];
        assertEquals("Lamp", p1.getDescription());
        Product p2 = pl[1];
        assertEquals("Table", p2.getDescription());
        Product p3 = pl[2];
        assertEquals("Chair", p3.getDescription());
    }

    @Test
    public void testHandleNoargRequest_EmptyArray() throws Exception {

        Product[] pl = (Product[]) invokeService_toObject("sampleProductService", "getProducts", new Object[] {});

        Product p1 = pl[0];
        assertEquals("Lamp", p1.getDescription());
        Product p2 = pl[1];
        assertEquals("Table", p2.getDescription());
        Product p3 = pl[2];
        assertEquals("Chair", p3.getDescription());
    }

    /**
     * Dojo's wire, as of revision 10006, defaults to an empty object ({}) for parameters when none are specified. For
     * instance, the following wireml:
     * 
     * <div dojoType="dojox.wire.ml.Invocation" id="products2Invoke" object="sampleProductService" method="getProducts"
     * result="getProducts2Query.result"></div>
     * 
     * (note the lack of a parameters attribute) results in a request like this:
     * 
     * {"params": {}, "method": "getProducts", "id": 1}
     * 
     * This test verifies that that works.
     * 
     * 
     * @throws Exception
     */
    @Test
    public void testHandleNoargRequest_DojoNoParameterDefault() throws Exception {

        String jsonString = "{\"params\": {}, \"method\": \"getProducts\", \"id\": 1}";
        String serviceName = "sampleProductService";

        MockHttpServletRequest mhr = new MockHttpServletRequest(WebContentGenerator.METHOD_POST, "/" + serviceName + ".json");
        mhr.setSession(new MockHttpSession());
        mhr.setContent(jsonString.getBytes());
        MockHttpServletResponse mhresp = new MockHttpServletResponse();

        invokeService(mhr, mhresp);
        String result = mhresp.getContentAsString();
        assertTrue(result.startsWith("{\"" + ServerConstants.RESULTS_PART + "\":"));
    }

    @DirtiesContext
    @Test
    public void testHandleNoargRequest_NonEmptyParamObject() throws Exception {

        String jsonString = "{\"params\": {\"a\":\"b\"}, \"method\": \"getProducts\", \"id\": 1}";
        String serviceName = "sampleProductService";

        MockHttpServletRequest mhr = new MockHttpServletRequest(WebContentGenerator.METHOD_POST, "/" + serviceName + ".json");
        mhr.setSession(new MockHttpSession());
        mhr.setContent(jsonString.getBytes());
        MockHttpServletResponse mhresp = new MockHttpServletResponse();

        invokeService(mhr, mhresp);
        String result = mhresp.getContentAsString();

        assertTrue(result, result.contains("\"" + ServerConstants.ERROR_PART + "\""));
        assertFalse(result, result.contains("\"" + ServerConstants.RESULTS_PART + "\""));

        assertTrue("unexpected message: " + result,
            result.startsWith("{\"" + ServerConstants.ERROR_PART + "\":\"" + "Bad parameters in request (params object must be {}"));
    }

    @Test
    public void testHandleArgRequest_Dojo() throws Exception {

        Product pl = (Product) invokeService_toObject("sampleProductService", "getProduct", new Object[] { new Integer(1) });
        assertEquals("Lamp", pl.getDescription());
    }

    @Test
    public void testReflectionInvoke_getProduct_1() throws Exception {

        Object o = null;

        o = invokeService_toObject("sampleProductService", "getProduct", new Object[] { new Integer(1) });

        assertTrue(o instanceof Product);
        Product p = (Product) o;
        assertEquals(p.getDescription(), "Lamp");
    }

    @Test
    public void testReflectionInvoke_retProduct() throws Exception {

        Object o = null;
        Product inp = new Product("fooProd", 12.2, 9);

        o = invokeService_toObject("sampleProductService", "retProduct", new Object[] { inp });

        assertTrue(o instanceof Product);
        Product p = (Product) o;
        assertEquals(p.getDescription(), inp.getDescription());
        assertNotSame(p, inp);
    }

    @DirtiesContext
    @Test
    public void testReflectionInvoke_badMethod() throws Exception {

        Object o = null;
        boolean gotException = false;
        try {
            o = invokeService_toObject("sampleProductService", "fooBarBadMethod", new Object[] { 1 });
        } catch (WMRuntimeException e) {
            if (-1 == e.getMessage().indexOf("not found in service") || -1 == e.getMessage().indexOf("Method")) {
                fail("bad error message: " + e.getMessage());
            }
            gotException = true;
        }
        assertNull(o);
        assertTrue(gotException);
    }

    /**
     * Tests the event listener; similar to testHandleNoargRequest(), but makes sure that the additional Product
     * provided by SampleProductServiceEventListener is also present.
     */
    @Test
    public void testServletEventListener() throws Exception {

        Product[] pl = (Product[]) invokeService_toObject("sampleProductService", "getProducts", null);

        assertEquals(4, pl.length);
        Product p1 = pl[0];
        assertEquals("Lamp", p1.getDescription());
        Product p2 = pl[1];
        assertEquals("Table", p2.getDescription());
        Product p3 = pl[2];
        assertEquals("Chair", p3.getDescription());
        Product p4 = pl[3];
        assertEquals("pmelProduct", p4.getDescription());
    }

    @Test
    public void testServiceEventListener() throws Exception {

        Object o = invokeService_toObject("serviceEventBean", "getCount", null);
        assertEquals(Long.valueOf(1001), o);

        o = invokeService_toObject("serviceEventBean", "getCount", null);
        assertEquals(Long.valueOf(1003), o);

        o = invokeService_toObject("serviceEventBean", "getValue", new Object[] { new Long(2) });
        assertEquals(Long.valueOf(3002), o);

        o = invokeService_toObject("serviceEventBean", "throwsException", null);
        assertEquals(Long.valueOf(10000), o);
    }

    @Test
    public void testServiceEventListenerMultiple() throws Exception {

        Object o = invokeService_toObject("serviceEventBean2", "getCount", null);
        assertEquals(Long.valueOf(2002), o);

        o = invokeService_toObject("serviceEventBean2", "getCount", null);
        assertEquals(Long.valueOf(2006), o);

        o = invokeService_toObject("serviceEventBean2", "getValue", new Object[] { new Long(2) });
        assertEquals(Long.valueOf(6002), o);

        o = invokeService_toObject("serviceEventBean2", "throwsException", null);
        assertEquals(Long.valueOf(11000), o);
    }

    @Test
    public void testOverloadInvoke() throws Exception {

        Object o = invokeService_toObject("methodOverloadTestBean", "args", new Object[] { "foo", 2 });

        assertTrue(o instanceof String);
        String s = (String) o;
        assertEquals("foo2.0", s);

        o = invokeService_toObject("methodOverloadTestBean", "args", new Object[] { "foo", 2, false });

        assertTrue(o instanceof String);
        s = (String) o;
        assertEquals("foo2.0false", s);
    }

    @Test
    public void testBadOverloadInvoke() throws Exception {

        try {
            invokeService_toObject("methodOverloadTestBean", "args", new Object[] { 2 });
            fail("didn't get exception");
        } catch (WMRuntimeException e) {
            assertTrue(e.getMessage().startsWith("Methods cannot be overloaded by type, only by number of arguments; method "));
        }
    }

    @Test
    public void testExclusion_IncludeRecursive() throws Exception {

        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "getComplexScopedBean", null, resp);
        String ret = resp.getContentAsString();
        assertEquals("{\"" + ServerConstants.RESULTS_PART + "\":{\"bc\":{\"name\":\"bc\"},\"bc2\":{\"name\":\"bc2\"}" + ",\"str\":\"foo\"}}", ret);
    }

    @Test
    public void testGetUtilDate() throws Exception {

        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("dateReturnBean", "getUtilDate", null, resp);
        String ret = resp.getContentAsString();

        DateReturnBean dateBean = (DateReturnBean) getApplicationContext().getBean("dateReturnBean");

        assertEquals("{\"" + ServerConstants.RESULTS_PART + "\":" + dateBean.getNow() + "}", ret);
    }

    @Test
    public void testGetSqlDate() throws Exception {

        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("dateReturnBean", "getSqlDate", null, resp);
        String ret = resp.getContentAsString();

        DateReturnBean dateBean = (DateReturnBean) getApplicationContext().getBean("dateReturnBean");

        assertEquals("{\"" + ServerConstants.RESULTS_PART + "\":" + dateBean.getNow() + "}", ret);
    }

    @Test
    public void testGetAndParamSqlDate() throws Exception {

        DateReturnBean dateBean = (DateReturnBean) getApplicationContext().getBean("dateReturnBean");
        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("dateReturnBean", "getSqlDateFromParam", new Object[] { dateBean.getNow() }, resp);
        String ret = resp.getContentAsString();

        assertEquals("{\"" + ServerConstants.RESULTS_PART + "\":" + (dateBean.getNow() + 1) + "}", ret);
    }

    @Test
    public void testGetAndParamUtilDate() throws Exception {

        DateReturnBean dateBean = (DateReturnBean) getApplicationContext().getBean("dateReturnBean");
        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("dateReturnBean", "getUtilDateFromParam", new Object[] { dateBean.getNow() }, resp);
        String ret = resp.getContentAsString();

        assertEquals("{\"" + ServerConstants.RESULTS_PART + "\":" + (dateBean.getNow() + 1) + "}", ret);
    }

    // test MAV-442
    @Test
    public void testGetAndParamSqlTime() throws Exception {

        DateReturnBean dateBean = (DateReturnBean) getApplicationContext().getBean("dateReturnBean");
        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("dateReturnBean", "getSqlTimeFromParam", new Object[] { dateBean.getNow() }, resp);
        String ret = resp.getContentAsString();

        assertEquals("{\"" + ServerConstants.RESULTS_PART + "\":" + (dateBean.getNow() + 1) + "}", ret);
    }

    // test MAV-442
    @Test
    public void testGetAndParamSqlTimestamp() throws Exception {

        DateReturnBean dateBean = (DateReturnBean) getApplicationContext().getBean("dateReturnBean");
        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("dateReturnBean", "getSqlTimestampFromParam", new Object[] { dateBean.getNow() }, resp);
        String ret = resp.getContentAsString();

        assertEquals("{\"" + ServerConstants.RESULTS_PART + "\":" + (dateBean.getNow() + 1) + "}", ret);
    }

    // MAV-2198
    @Test
    public void testGetAndParamUtilDate_Negative() throws Exception {

        Calendar c = Calendar.getInstance();
        c.set(1960, 12, 25);
        java.util.Date d = c.getTime();

        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("dateReturnBean", "getUtilDateFromParam", new Object[] { d }, resp);
        String ret = resp.getContentAsString();

        assertEquals("{\"" + ServerConstants.RESULTS_PART + "\":" + (d.getTime() + 1) + "}", ret);
    }

    // test MAV-8
    @Test
    public void testArrayParameters() throws Exception {

        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "getArrayArgument", new Object[] { new String[] { "hi", "bye" }, 12 }, resp);

        String ret = resp.getContentAsString();
        assertEquals("{\"" + ServerConstants.RESULTS_PART + "\":\"12,hi,bye\"}", ret);
    }

    // test MAV-8 2
    @Test
    public void testArrayParametersSecondLevel() throws Exception {

        String post = "{\"params\": [" + "{\"name\": \"getActorById\", \"query\":" + "\"from Actors _a where _a.id=:id\", \"isHQL\": true, "
            + "\"inputs\": [{\"paramType\": \"java.lang.Short\"," + "\"paramName\": \"id\"}], "
            + "\"outputType\": \"com.wavemaker.runtime.data.sample.sakila.Actor\"}], " + "\"method\": \"mav8_2_updateQuery\", \"id\": 9}";

        MockHttpServletResponse resp = new MockHttpServletResponse();
        MockHttpServletRequest req = new MockHttpServletRequest();

        req.setMethod(WebContentGenerator.METHOD_POST);
        req.setRequestURI("/services/complexReturnBean." + ServerConstants.JSON_EXTENSION);
        req.setContent(post.getBytes());

        invokeService(req, resp);

        String ret = resp.getContentAsString();
        assertJSONStringsEquals("{\"" + ServerConstants.RESULTS_PART + "\":\"getActorById, 1\"}", ret);
    }

    @Test
    public void testNullAsArrayParameterAndReturn() throws Exception {

        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "getArray", new Object[] { null }, resp);

        String ret = resp.getContentAsString();
        assertJSONStringsEquals("{\"" + ServerConstants.RESULTS_PART + "\":null}", ret);
    }

    // MAV-9
    @Test
    public void testNullAsListParameterAndReturn() throws Exception {

        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "getList", new Object[] { null }, resp);

        String ret = resp.getContentAsString();
        assertJSONStringsEquals("{\"" + ServerConstants.RESULTS_PART + "\":null}", ret);
    }

    // MAV-9
    @Test
    public void testNullAsArrayInObjectReturn() throws Exception {

        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "getComplexArray", new Object[] { null }, resp);

        String ret = resp.getContentAsString();
        assertJSONStringsEquals("{\"" + ServerConstants.RESULTS_PART + "\":{\"array\":null,\"listListString\":null}}", ret);
    }

    // test MAV-6
    @Test
    public void testNullParameters() throws Exception {

        String post = "{\"params\":null,\"id\":1," + "\"method\":\"getComplexScopedBean\"}";

        MockHttpServletResponse resp = new MockHttpServletResponse();
        MockHttpServletRequest req = new MockHttpServletRequest();

        req.setMethod(WebContentGenerator.METHOD_POST);
        req.setRequestURI("/services/complexReturnBean." + ServerConstants.JSON_EXTENSION);
        req.setContent(post.getBytes());

        invokeService(req, resp);

        String ret = resp.getContentAsString();
        assertNotNull(ret);
    }

    @Test
    public void testArrayInObjectReturn() throws Exception {

        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "getComplexArray", new Object[] { new int[] { 1, 2 } }, resp);

        String ret = resp.getContentAsString();
        assertJSONStringsEquals("{\"" + ServerConstants.RESULTS_PART + "\":{\"array\":[1,2],\"listListString\":null}}", ret);
    }

    @Test
    public void testIntegerReturnReallyNull() throws Exception {

        Object o = invokeService_toObject("complexReturnBean", "integerButReallyNull", null);

        assertNull(o);

        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "integerButReallyNull", null, resp);

        String ret = resp.getContentAsString();
        assertJSONStringsEquals("{\"" + ServerConstants.RESULTS_PART + "\":null}", ret);
    }

    @Test
    public void testGetReturnStringList() throws Exception {

        List<String> param = new ArrayList<String>();
        param.add("a");
        param.add("b");

        Object o = invokeService_toObject("complexReturnBean", "getStringList", new Object[] { param });

        assertTrue(o instanceof List);
        List<?> ret = (List<?>) o;
        assertEquals(param.size(), ret.size());
        for (int i = 0; i < param.size(); i++) {
            assertEquals(param.get(i) + "a", ret.get(i));
        }
    }

    @Test
    public void testStringStringArray() throws Exception {

        Object o = invokeService_toObject("complexReturnBean", "stringStringArray", new Object[] { "a", "b", new String[] { "c", "d" } });

        assertTrue(o instanceof String);
        assertEquals("abcd", o);
    }

    @Test
    public void testStringStringEmptyArray() throws Exception {

        Object o = invokeService_toObject("complexReturnBean", "stringStringArray", new Object[] { "a", "b", new String[] {} });

        assertTrue(o instanceof String);
        assertEquals("ab", o);
    }

    @Test
    public void testReflectionInvokeException() throws Exception {

        try {
            invokeService_toObject("complexReturnBean", "throwAGRuntimeException", null);
            fail("didn't get exception");
        } catch (WMRuntimeException e) {
            assertEquals("the runtime exception", e.getMessage());
        }
    }

    @Test
    public void testGetCycle() throws Exception {

        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "getCycle", new Object[] {}, resp);

        String respStr = resp.getContentAsString();
        respStr = respStr.substring(respStr.indexOf('{', 1), respStr.length() - 1);
        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal(respStr);
        Object o = JSONUtils.toBean(jo, CycleA.class);
        assertTrue(o instanceof CycleA);
        CycleA a = (CycleA) o;
        assertEquals("a", a.getAString());
        CycleB b = a.getCycleB();
        assertEquals("b", b.getBString());
        assertNull(b.getCycleA());

        // MAV-902
        assertFalse(jo.toString().contains("\"cycleA\""));
    }

    // MAV-538
    @Test
    public void testTakesLong() throws Exception {

        MockHttpServletRequest mhr = new MockHttpServletRequest(WebContentGenerator.METHOD_POST, "/" + "complexReturnBean" + ".json");
        mhr.setContent("{\"params\": [1], \"method\": \"takesLong\", \"id\": 3}".getBytes());
        MockHttpServletResponse mhresp = new MockHttpServletResponse();

        invokeService(mhr, mhresp);

        assertEquals("{\"" + ServerConstants.RESULTS_PART + "\":\"takesLong: 1\"}", mhresp.getContentAsString());
    }

    @Test
    public void testTakesLCInt() throws Exception {

        MockHttpServletRequest mhr = new MockHttpServletRequest(WebContentGenerator.METHOD_POST, "/" + "complexReturnBean" + ".json");
        mhr.setContent("{\"params\": [1], \"method\": \"takesLCInt\", \"id\": 3}".getBytes());
        MockHttpServletResponse mhresp = new MockHttpServletResponse();

        invokeService(mhr, mhresp);

        assertEquals("{\"" + ServerConstants.RESULTS_PART + "\":\"takesLCInt: 1\"}", mhresp.getContentAsString());
    }

    @Test
    public void testTakesLCIntWithString() throws Exception {

        MockHttpServletRequest mhr = new MockHttpServletRequest(WebContentGenerator.METHOD_POST, "/" + "complexReturnBean" + ".json");
        mhr.setContent("{\"params\": [\"1\"], \"method\": \"takesLCInt\", \"id\": 3}".getBytes());
        MockHttpServletResponse mhresp = new MockHttpServletResponse();

        invokeService(mhr, mhresp);

        assertEquals("{\"" + ServerConstants.RESULTS_PART + "\":\"takesLCInt: 1\"}", mhresp.getContentAsString());
    }

    // MAV-559
    @Test
    public void testWrappedDate() throws Exception {

        WrappedDate wd = new WrappedDate();
        wd.setFooDate(new java.util.Date(10000));
        wd.setSqlDate(new java.sql.Date(100001));
        wd.setSqlTime(new java.sql.Time(102));
        wd.setSqlTimestamp(new java.sql.Timestamp(103));

        MockHttpServletResponse response = new MockHttpServletResponse();

        invokeService("dateReturnBean", "getWrappedDate", new Object[] { wd }, response);
        assertJSONStringsEquals("{\"result\":{" + "\"sqlTimestamp\":" + wd.getSqlTimestamp().getTime() + ",\"fooDate\":" + wd.getFooDate().getTime()
            + ",\"sqlTime\":" + wd.getSqlTime().getTime() + ",\"sqlDate\":" + wd.getSqlDate().getTime() + "}}", response.getContentAsString());
    }

    // MAV-589
    @Test
    public void testUnwrappingExceptions() throws Exception {
        try {
            invokeService_toObject("complexReturnBean", "doTwiceWrappedException", null);
        } catch (WMRuntimeException e) {
            assertEquals(e.getMessage(), "foo");
        }
    }

    // MAV-855
    @Test
    public void testExtendedCharsString() throws Exception {

        MockHttpServletResponse resp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "getExtendedCharsString", new Object[] {}, resp);

        String respStr = resp.getContentAsString();
        assertEquals("{\"" + ServerConstants.RESULTS_PART + "\":\"" + ComplexReturnBean.EXTENDED_CHARS_TEST_STR + "\"}", respStr);
    }

    // MAV-879
    @Test
    public void testSetterList() throws Exception {

        MockHttpServletRequest mhr = new MockHttpServletRequest(WebContentGenerator.METHOD_POST, "/" + "complexReturnBean" + ".json");
        mhr.setContent("{\"params\": [{\"array\":[1,2,3]},{\"name\":\"foo\"}], \"method\": \"checkSetterList\", \"id\": 3}".getBytes());
        MockHttpServletResponse mhresp = new MockHttpServletResponse();

        invokeService(mhr, mhresp);

        assertEquals("{\"" + ServerConstants.RESULTS_PART + "\":\"879\"}", mhresp.getContentAsString());
    }

    @Test
    public void testTakesProperties() throws Exception {

        MockHttpServletRequest mhr = new MockHttpServletRequest(WebContentGenerator.METHOD_POST, "/" + "complexReturnBean" + ".json");
        mhr.setContent("{\"params\": [{\"a\":\"b\"}], \"method\": \"takesProperties\", \"id\": 3}".getBytes());

        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        invokeService(mhr, mhresp);

        assertEquals("{\"" + ServerConstants.RESULTS_PART + "\":\"p: {a=b}\"}", mhresp.getContentAsString());
    }

    @Test
    public void testSuccessResponse() throws Exception {

        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "getConcreteSuccessResponse", null, mhresp);
        assertEquals("{\"randomKey\":\"randomValue\",\"result\":\"bar\"}", mhresp.getContentAsString());
    }

    @Test
    public void testErrorResponse() throws Exception {

        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "getConcreteFailureResponse", null, mhresp);
        assertEquals("{\"error\":\"bar\",\"otherMessage\":\"otherMessage\"}", mhresp.getContentAsString());
    }

    // MAV-1204
    @Test
    public void testCallHiddenMethod() throws Exception {

        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "cantCall", null, mhresp);
        assertTrue(mhresp.getContentAsString().contains("cantCall"));
    }

    // MAV-1792
    @Test
    public void testReturnListDates() throws Exception {

        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "getJavaSqlDateList", null, mhresp);
        String response = mhresp.getContentAsString();
        assertEquals("{\"result\":[1,2]}", response);
    }

    // MAV-1792
    @Test
    public void testReturnMapDates() throws Exception {

        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "getJavaSqlDateMap", null, mhresp);
        String response = mhresp.getContentAsString();
        assertEquals("{\"result\":{\"foo\":1,\"bar\":2}}", response);
    }

    // MAV-2060
    @Test
    public void testGetDatesInUntypedResponse() throws Exception {

        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "getDatesInUntypedResponse", null, mhresp);
        String response = mhresp.getContentAsString();
        assertEquals("{\"result\":[[1,2,3]]}", response);
    }

    // MAV-2060
    @Test
    public void testGetDateUntypedResponse() throws Exception {

        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "getDateUntypedResponse", null, mhresp);
        String response = mhresp.getContentAsString();
        assertEquals("{\"result\":1}", response);
    }

    // MAV-2149
    @Test
    public void testReturnLOBs() throws Exception {

        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        invokeService("complexReturnBean", "getLOBs", null, mhresp);
        String response = mhresp.getContentAsString();
        assertEquals("{\"result\":{\"blob\":[1,2,3,4,5],\"clob\":\"abcde\"}}", response);
    }

    // MAV-2149
    @Test
    public void testParameterLOBs() throws Exception {

        MockHttpServletRequest mhr = new MockHttpServletRequest(WebContentGenerator.METHOD_POST, "/" + "complexReturnBean" + ".json");
        mhr.setContent("{\"params\": [{\"blob\":[1,2,3,4,5],\"clob\":\"abcde\"}], \"method\": \"sendLOBs\", \"id\": 4}".getBytes());

        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        invokeService(mhr, mhresp);

        String response = mhresp.getContentAsString();
        assertEquals("{\"result\":\"abcde:[1, 2, 3, 4, 5]\"}", response);
    }

    // MAV-2241
    @Test
    public void testUntypedMapParameter() throws Exception {

        MockHttpServletRequest mhr = new MockHttpServletRequest(WebContentGenerator.METHOD_POST, "/" + "complexReturnBean" + ".json");
        mhr.setContent("{\"params\": [{\"a\":\"b\"}], \"method\": \"takesUntypedMap\", \"id\": 4}".getBytes());

        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        invokeService(mhr, mhresp);

        String response = mhresp.getContentAsString();
        assertEquals("{\"result\":\"pass\"}", response);
    }

    // MAV-2244
    @Test
    public void testUntypedObject() throws Exception {

        MockHttpServletRequest mhr = new MockHttpServletRequest(WebContentGenerator.METHOD_POST, "/" + "complexReturnBean" + ".json");
        mhr.setContent("{\"params\": [{\"a\":\"b\"}], \"method\": \"takesUntypedObject\", \"id\": 4}".getBytes());

        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        invokeService(mhr, mhresp);

        String response = mhresp.getContentAsString();
        assertEquals("{\"result\":\"pass\"}", response);
    }

    // MAV-2275
    @Test
    public void testStringArrayArgument() throws Exception {

        String s = (String) invokeService_toObject("complexReturnBean", "takesStringArray", new Object[] { new String[] { "hi", "bye" } });
        assertEquals("hibye", s);
    }

    // MAV-823
    @Test
    public void testStringBuffer() throws Exception {

        StringBuffer sb = (StringBuffer) invokeService_toObject("complexReturnBean", "stringBuffer", new Object[] { new StringBuffer("foo") });
        assertEquals("got foo", sb.toString());
    }

    @Test
    public void testGetFromAopAdvised() throws Exception {

        int i = (Integer) invokeService_toObject("aopAdvisedServiceBean", "getIval", null);
        assertEquals(12, i);

        Object o = getBean("aopAdvisedServiceBean");
        assertTrue(o.getClass().getName().contains("CGLIB"));
    }
}