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
package com.wavemaker.json;

import junit.framework.AssertionFailedError;
import junit.framework.TestCase;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestJSONUnmarshaller extends TestCase {

    public void testStringsInArray() throws Exception {

        String jsonString = "[\"foo\",\"bar\"]";
        Object o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o instanceof JSONArray);
        JSONArray l = (JSONArray) o;
        assertEquals(2, l.size());
        assertEquals("foo", l.get(0));
        assertEquals("bar", l.get(1));
    }

    public void testStringsInMap() throws Exception {

        String jsonString = "{\"foo\":\"bar\",\"baz\":\"bat\"}";
        Object o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o instanceof JSONObject);
        JSONObject l = (JSONObject) o;
        assertEquals(2, l.size());
        assertEquals("bar", l.get("foo"));
        assertEquals("bat", l.get("baz"));
    }

    public void testSimpleObject() throws Exception {

        String jsonString = "{\"str\":\"bar\"}";
        Object o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o instanceof JSONObject);
        JSONObject l = (JSONObject) o;
        assertEquals("bar", l.get("str"));
    }

    public void testSimpleObject_JSIdent() throws Exception {

        String jsonString = "{str:\"bar\"}";
        Object o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o instanceof JSONObject);
        JSONObject l = (JSONObject) o;
        assertEquals("bar", l.get("str"));
    }

    public void testSimpleEmptyObject() throws Exception {

        String jsonString = "{}";
        Object o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o instanceof JSONObject);
        JSONObject l = (JSONObject) o;
        assertNull(l.get("str"));
    }

    public void testSimpleArray() throws Exception {

        String jsonString = "{\"strArray\":[\"a\",\"b\"]}";
        Object o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o instanceof JSONObject);
        JSONObject l = (JSONObject) o;
        assertNotNull(l.get("strArray"));
        assertTrue(l.get("strArray") instanceof JSONArray);
        JSONArray strArray = (JSONArray) l.get("strArray");
        assertEquals(2, strArray.size());
        assertEquals("b", strArray.get(1));
    }

    public void testSimpleArray_JSIdent() throws Exception {

        String jsonString = "{strArray:[\"a\",\"b\"]}";
        Object o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o instanceof JSONObject);
        JSONObject l = (JSONObject) o;
        assertNotNull(l.get("strArray"));
        assertTrue(l.get("strArray") instanceof JSONArray);
        JSONArray strArray = (JSONArray) l.get("strArray");
        assertEquals(2, strArray.size());
        assertEquals("b", strArray.get(1));
    }

    public void testComplexObject() throws Exception {

        String jsonString = "{\"simpleObject\":{\"str\":\"bar\"}}";
        Object o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o instanceof JSONObject);
        JSONObject l = (JSONObject) o;
        assertNotNull(l.get("simpleObject"));
        assertTrue(l.get("simpleObject") instanceof JSONObject);
        JSONObject jo = (JSONObject) l.get("simpleObject");
        assertEquals("bar", jo.get("str"));
    }
    
    /**
     * Test to make sure the JSONObject can correctly store nulls.
     * @throws Exception
     */
    public void testNulls() throws Exception {
        
        String jsonString = "{\"foo\":null}";
        Object o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o instanceof JSONObject);
        JSONObject jo = (JSONObject) o;
        assertTrue(jo.containsKey("foo"));
        assertNull(jo.get("foo"));
        assertFalse(jo.containsKey("bar"));
        assertNull(jo.get("bar"));
    }
    
    public void testEmptyArray() throws Exception {
        
        String jsonString = "[]";
        JSON o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o.isList());
        JSONArray jl = (JSONArray) o;
        assertEquals(0, jl.size());
    }
    
    public void testEmptyArrayInObject() throws Exception {
        
        String jsonString = "{\"params\":[],\"id\":1,\"method\":\"getProducts\"}";
        JSON o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o.isObject());
        
        JSONObject jo = (JSONObject) o;
        assertTrue(jo.get("params") instanceof JSON);
        o = (JSON) jo.get("params");
        assertTrue(o.isList());
        JSONArray jl = (JSONArray) o;
        assertEquals(0, jl.size());
    }
    
    public void testEmptyObject() throws Exception {
        
        String jsonString = "{}";
        JSON o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o.isObject());
        
        JSONObject jo = (JSONObject) o;
        assertEquals(0, jo.size());
    }

    public void testNegativeInt() throws Exception {
        
        String jsonString = "{\"id\":-12}";
        JSON o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o.isObject());
        JSONObject jo = (JSONObject) o;
        assertEquals(-12l, jo.get("id"));
    }

    public void testNegativeFloat() throws Exception {
        
        String jsonString = "{\"id\":-13.12}";
        JSON o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o.isObject());
        JSONObject jo = (JSONObject) o;
        assertEquals(-13.12, jo.get("id"));
    }
    
    public void testEquals() throws Exception {
        
        String jsonString = "{\"foo\":{\"bar\":[1,2,\"baz\"]}}";
        JSONObject jo1 = (JSONObject) JSONUnmarshaller.unmarshal(jsonString);
        JSONObject jo2 = (JSONObject) JSONUnmarshaller.unmarshal(jsonString);
        assertEquals(jo1, jo2);
        
        String jsonString2 = "{\"foo\":{\"bar\":[1,2,\"baZZZZ\"]}}";
        JSONObject jo3 = (JSONObject) JSONUnmarshaller.unmarshal(jsonString2);
        
        try {
            assertEquals(jo1, jo3);
            fail("bad");
        } catch (AssertionFailedError e) {
        }
    }
    
    /**
     * @see TestJSONMarshaller#testEscaped()
     */
    public void testEscaped() throws Exception {
        
        String jsonString = "{\"foo\":\"b\\noo\\n\\to\"}";
        
        JSONObject obj = (JSONObject) JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(obj.containsKey("foo"));
        assertEquals("b\noo\n\to", obj.get("foo"));
        
        // check to make sure we're matching the correct json output
        jsonString = "{\"foo\":\"\\\"\\\\/\\b\\f\\n\\r\\t⊗\\\\\"}";
        // net.sf.json.JSONObject netfsJsonObj = net.sf.json.JSONObject.fromObject(jsonString);
        // assertTrue(netfsJsonObj.containsKey("foo"));
        // assertEquals("\"\\/\b\f\n\r\t\u2297\\", netfsJsonObj.getString("foo"));
        
        obj = (JSONObject) JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(obj.containsKey("foo"));
        assertEquals("\"\\/\b\f\n\r\t\u2297\\", obj.get("foo"));
        
        // check syntactically correct json
        jsonString = "{\"foo\":\"\\\"\\\\\\/\\b\\f\\n\\r\\t\\u2297\"}";
        obj = (JSONObject) JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(obj.containsKey("foo"));
        assertEquals("\"\\/\b\f\n\r\t\u2297", obj.get("foo"));
        
        // check the highest value
        jsonString = "{\"foo\":\"\uFFFF\"}";
        obj = (JSONObject) JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(obj.containsKey("foo"));
        assertEquals("\uFFFF", obj.get("foo"));
    }
    
    public void testFailedParsing() throws Exception {
        
        String bad = "{fd";
        try {
            JSON j = JSONUnmarshaller.unmarshal(bad);
            assertTrue(j instanceof JSONObject);
            assertEquals(0, ((JSONObject)j).size());
        } catch (WMRuntimeException e) {
            assertEquals(Resource.JSON_FAILED_PARSING.getId(), e.getMessageId());
            assertTrue(e.getMessage().contains(bad));
        }
    }
    
    public void testFailedParsing_JSIdentForValue() throws Exception {
        
        String bad = "{\"fd\":bla}";
        try {
            JSON j = JSONUnmarshaller.unmarshal(bad);
            assertTrue(j instanceof JSONObject);
            assertEquals(1, ((JSONObject)j).size());
            assertNull(((JSONObject)j).get("fd"));
        } catch (WMRuntimeException e) {
            assertEquals(Resource.JSON_FAILED_PARSING.getId(), e.getMessageId());
            assertTrue(e.getMessage().contains(bad));
        }
    }
    
    public void testTrailingCommas() throws Exception {
        
        String s = "{\"hi\":[{\"a\":\"b\",},]}";
        JSON j = JSONUnmarshaller.unmarshal(s);
        
        assertTrue(j instanceof JSONObject);
        JSONObject jo = (JSONObject) j;
        
        assertEquals(1, jo.size());
        assertTrue(jo.containsKey("hi"));
        assertTrue(jo.get("hi") instanceof JSONArray);
        
        JSONArray ja = (JSONArray) jo.get("hi");
        assertEquals("ja: "+ja, 1, ja.size());
        assertTrue(ja.get(0) instanceof JSONObject);
        
        jo = (JSONObject) ja.get(0);
        assertEquals(1, jo.size());
        assertTrue(jo.containsKey("a"));
        assertEquals("b", jo.get("a"));
    }
}