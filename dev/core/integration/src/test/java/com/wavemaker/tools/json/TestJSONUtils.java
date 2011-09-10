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
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.lang.reflect.Array;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.springframework.util.ClassUtils;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONMarshaller;
import com.wavemaker.json.JSONState;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.TypeState;
import com.wavemaker.json.type.reflect.ReflectTypeState;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;
import com.wavemaker.runtime.data.Input;
import com.wavemaker.runtime.server.json.JSONUtils;
import com.wavemaker.runtime.server.testspring.BeanClass;
import com.wavemaker.runtime.service.ParsedServiceArguments;
import com.wavemaker.runtime.test.TestSpringContextTestCase;
import com.wavemaker.tools.data.QueryInfo;
import com.wavemaker.tools.spring.ComplexReturnBean;

/**
 * @author Matt Small
 * @version $Rev:22671 $ - $Date:2008-05-30 14:29:23 -0700 (Fri, 30 May 2008) $
 *
 */
public class TestJSONUtils extends TestSpringContextTestCase {
    
    @Test public void testGetParameterTypes() throws Exception {

        TypeState typeState = new ReflectTypeState();
        
        List<FieldDefinition> fDs;
        Method method;
        JSONArray params;
        JSON json;

        method = ComplexReturnBean.class.getMethod("getComplexArray",
                ClassUtils.forName("int[]", null));
        json = JSONUnmarshaller.unmarshal("[[1,2]]");
        assertTrue(json.isList());
        params = (JSONArray) json;
        fDs = JSONUtils.getParameterTypes(method, params, typeState);
        assertEquals(1, fDs.size());
        assertEquals(1, fDs.get(0).getDimensions());
        assertEquals(int.class.getName(), fDs.get(0).getTypeDefinition().getTypeName());

        method = ComplexReturnBean.class.getMethod("noTranslationObject",
                Object.class);
        json = JSONUnmarshaller.unmarshal("[{\"bc\":\"foo\"}]");
        assertTrue(json.isList());
        params = (JSONArray) json;
        fDs = JSONUtils.getParameterTypes(method, params, typeState);
        assertEquals(1, fDs.size());
        assertEquals(0, fDs.get(0).getDimensions());
        assertNull(fDs.get(0).getTypeDefinition());

        method = ComplexReturnBean.class.getMethod("singleParameterType",
                Object.class, String.class);
        json = JSONUnmarshaller.unmarshal("[{\"name\":\"foo\"}," +
                        "\""+BeanClass.class.getCanonicalName()+"\"]");
        assertTrue(json.isList());
        params = (JSONArray) json;
        fDs = JSONUtils.getParameterTypes(method, params, typeState);
        assertEquals(2, fDs.size());
        assertEquals(0, fDs.get(0).getDimensions());
        assertEquals(BeanClass.class.getName(), fDs.get(0).getTypeDefinition().getTypeName());
        assertEquals(0, fDs.get(1).getDimensions());
        assertEquals(String.class.getName(), fDs.get(1).getTypeDefinition().getTypeName());

        method = ComplexReturnBean.class.getMethod("manyParameterTypes",
                Object.class, String.class, Object.class, Object.class,
                String.class);
        json = JSONUnmarshaller.unmarshal("["+
                "{\"name\":\"foo\"},"+"\""+BeanClass.class.getCanonicalName()+
                "\",{\"name\":\"bar\"},"+
                "{\"name\":\"baz\"},"+"\""+BeanClass.class.getCanonicalName()+
                "\"]");
        assertTrue(json.isList());
        params = (JSONArray) json;
        fDs = JSONUtils.getParameterTypes(method, params, typeState);
        assertEquals(5, fDs.size());
        assertEquals(0, fDs.get(0).getDimensions());
        assertEquals(BeanClass.class.getName(), fDs.get(0).getTypeDefinition().getTypeName());
        assertEquals(0, fDs.get(1).getDimensions());
        assertEquals(String.class.getName(), fDs.get(1).getTypeDefinition().getTypeName());
        assertEquals(0, fDs.get(2).getDimensions());
        assertEquals(BeanClass.class.getName(), fDs.get(2).getTypeDefinition().getTypeName());
        assertEquals(0, fDs.get(3).getDimensions());
        assertEquals(BeanClass.class.getName(), fDs.get(3).getTypeDefinition().getTypeName());
        assertEquals(0, fDs.get(4).getDimensions());
        assertEquals(String.class.getName(), fDs.get(4).getTypeDefinition().getTypeName());

        boolean gotException = false;
        try {
            method = ComplexReturnBean.class.getMethod("singleParameterType",
                    Object.class, String.class);
            json = JSONUnmarshaller.unmarshal("[{\"name\":\"foo\"}," +
                            "\""+List.class.getCanonicalName()+"\"]");
            assertTrue(json.isList());
            params = (JSONArray) json;

            fDs = JSONUtils.getParameterTypes(method, params, typeState);
            assertEquals(2, fDs.size());
            assertEquals(0, fDs.get(0).getDimensions());
            assertEquals(BeanClass.class.getName(), fDs.get(0).getTypeDefinition().getTypeName());
            assertEquals(0, fDs.get(1).getDimensions());
            assertEquals(String.class.getName(), fDs.get(1).getTypeDefinition().getTypeName());
        } catch (WMRuntimeException e) {
            gotException = true;
            assertTrue(e.getMessage().startsWith("Types using generics"));
        }
        assertTrue(gotException);
    }

    @Test public void testFailedConversion() throws Exception {

        TypeState typeState = new ReflectTypeState();
        String[] jsonStrings = new String[] {
                "[\"foobar\"]",
        };
        List<List<FieldDefinition>> fieldDefinitions = new ArrayList<List<FieldDefinition>>();
        fieldDefinitions.add(new ArrayList<FieldDefinition>());
        fieldDefinitions.get(0).add(ReflectTypeUtils.getFieldDefinition(
                Integer.class, typeState, false, null));
        Object expected[][] = new Object[][] {
                new Object[] { null },
        };

        try {
            doTestConversion(jsonStrings, fieldDefinitions, typeState, expected);
            fail ("no exception");
        } catch (WMRuntimeException e) {
            // pass
        }
    }

    @Test public void testConvertJSONToObjects() throws Exception {
        
        TypeState typeState = new ReflectTypeState();

        String[] jsonStrings = new String[] {
                "[1]",
                "[1]",
                "[null]",
                "[\"1\"]",
                "["+Long.MAX_VALUE+"]",
                "[1, 1, 1, 1, 1, 1]",
                "["+Long.MAX_VALUE+","+Long.MAX_VALUE+","+Long.MAX_VALUE+","+Long.MAX_VALUE+","+Long.MAX_VALUE+","+Long.MAX_VALUE+"]",
                "[null]",
        };
        
        List<List<FieldDefinition>> fieldDefinitions = new ArrayList<List<FieldDefinition>>();
        List<FieldDefinition> fieldDefinition;
        
        fieldDefinition = new ArrayList<FieldDefinition>();
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(Integer.class,
                typeState, false, null));
        fieldDefinitions.add(fieldDefinition);

        fieldDefinition = new ArrayList<FieldDefinition>();
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(int.class,
                typeState, false, null));
        fieldDefinitions.add(fieldDefinition);

        fieldDefinition = new ArrayList<FieldDefinition>();
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(Integer.class,
                typeState, false, null));
        fieldDefinitions.add(fieldDefinition);

        fieldDefinition = new ArrayList<FieldDefinition>();
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(String.class,
                typeState, false, null));
        fieldDefinitions.add(fieldDefinition);

        fieldDefinition = new ArrayList<FieldDefinition>();
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(Long.class,
                typeState, false, null));
        fieldDefinitions.add(fieldDefinition);
        
        fieldDefinition = new ArrayList<FieldDefinition>();
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(byte.class,
                typeState, false, null));
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(short.class,
                typeState, false, null));
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(int.class,
                typeState, false, null));
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(long.class,
                typeState, false, null));
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(float.class,
                typeState, false, null));
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(double.class,
                typeState, false, null));
        fieldDefinitions.add(fieldDefinition);
        
        fieldDefinition = new ArrayList<FieldDefinition>();
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(byte.class,
                typeState, false, null));
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(short.class,
                typeState, false, null));
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(int.class,
                typeState, false, null));
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(long.class,
                typeState, false, null));
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(float.class,
                typeState, false, null));
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(double.class,
                typeState, false, null));
        fieldDefinitions.add(fieldDefinition);

        fieldDefinition = new ArrayList<FieldDefinition>();
        fieldDefinition.add(ReflectTypeUtils.getFieldDefinition(Long.class,
                typeState, false, null));
        fieldDefinitions.add(fieldDefinition);
        
        Object[][] expected = new Object[][] {
                new Object[] { Integer.valueOf(1) },
                new Object[] { 1 },
                new Object[] { null },
                new Object[] { "1" },
                new Object[] { Long.MAX_VALUE },
                new Object[] { (byte)1, (short)1, (int)1, (long)1, (float)1, (double)1 },
                new Object[] { (byte)Long.MAX_VALUE, (short)Long.MAX_VALUE, (int)Long.MAX_VALUE, (long)Long.MAX_VALUE, (float)Long.MAX_VALUE, (double)Long.MAX_VALUE },
                new Object[] { null },
        };

        doTestConversion(jsonStrings, fieldDefinitions, typeState, expected);
    }

    @Test public void testConversionBadNonArraySeq() throws Exception {
        
        JSONState jsonState = new JSONState();

        try {
            JSON json = JSONUnmarshaller.unmarshal("[[1,2]]");
            assertTrue(json.isList());
            JSONArray jarr = (JSONArray) json;
            
            List<FieldDefinition> fieldDefinitions = new ArrayList<FieldDefinition>();
            fieldDefinitions.add(ReflectTypeUtils.getFieldDefinition(int.class,
                    jsonState.getTypeState(), false, null));
            
            JSONUtils.convertJSONToObjects(jarr, fieldDefinitions, jsonState);
            fail("no exception");
        } catch (WMRuntimeException e) {
            // ok
        }
    }

    // MAV-8
    @Test public void testConversionInternalArray() throws Exception {

        QueryInfo qi = new QueryInfo();
        Input[] in = new Input[1];
        in[0] = new Input("a", "b", Boolean.TRUE);
        qi.setInputs(in);

        assertEquals(1, qi.getInputs().length);

        String jo = JSONMarshaller.marshal(qi);
        assertJSONStringsEquals(
                "{\"outputType\":null,\"query\":null,\"comment\":null,\"isHQL\":false," +
                "\"isGenerated\":false,\"returnsSingleResult\":false,\"name\":null," +
                "\"inputs\":[{\"paramType\":\"b\",\"paramName\":\"a\"," +
		"\"list\":true}]}",
                jo);
    }

    @Test public void testConversionArrayFuncReturnsNull() throws Exception {
        
        JSONState jsonState = new JSONState();
        
        List<FieldDefinition> fieldDefinitions = new ArrayList<FieldDefinition>();
        fieldDefinitions.add(ReflectTypeUtils.getFieldDefinition(
                ClassUtils.forName("int[]", null), jsonState.getTypeState(), false,
                null));

        JSON json = JSONUnmarshaller.unmarshal("[null]");
        assertTrue(json.isList());
        JSONArray jarr = (JSONArray) json;
        ParsedServiceArguments ret = JSONUtils.convertJSONToObjects(jarr,
                fieldDefinitions, jsonState);

        assertEquals(1, ret.getArguments().length);
        assertEquals(null, ret.getArguments()[0]);
    }
    
    @Test public void testGetParameterTypes_BadTypeInJSONParam() throws Exception {
   
        TypeState typeState = new ReflectTypeState();
        
        Method method = ComplexReturnBean.class.getMethod("singleParameterType",
                Object.class, String.class);
        JSON json = JSONUnmarshaller.unmarshal("[{\"name\":\"foo\"}," +
                        "\"\"]");
        assertTrue(json.isList());
        JSONArray params = (JSONArray) json;
        try {
            JSONUtils.getParameterTypes(method, params, typeState);
            fail("expected exception");
        } catch (WMRuntimeException e) {
            assertEquals(Resource.JSONPARAMETER_COULD_NOTLLOAD_TYPE.getId(),
                    e.getMessageId());
        }
    }

    private void doTestConversion(String[] jsonStrings,
            List<List<FieldDefinition>> fieldDefinitions, TypeState typeState,
            Object[][] expected)
            throws Exception {
        
        JSONState jsonState = new JSONState();

        assertEquals(jsonStrings.length, fieldDefinitions.size());
        assertEquals(expected.length, fieldDefinitions.size());

        for (int i = 0; i < jsonStrings.length; i++) {
            JSON json = JSONUnmarshaller.unmarshal(jsonStrings[i]);
            assertTrue(json.isList());
            JSONArray jarr = (JSONArray) json;
            Object[] result = JSONUtils.convertJSONToObjects(jarr,
                    fieldDefinitions.get(i), jsonState).getArguments();

            String message = "error index " + i + "; jsonString: "
                    + jsonStrings[i] + ", result: " + result;
            assertEquals(message, expected[i].length, Array.getLength(result));

            for (int j = 0; j < Array.getLength(result); j++) {
                if (null==expected[i][j]) {
                    assertEquals(expected[i][j], Array.get(result, j));
                } else {
                    // assertEquals(message, expected[i][j].getClass(),
                    //        result[j].getClass());
                    assertEquals(message, expected[i][j], Array.get(result, j));
                }
            }
        }
    }

    protected void assertClassArrayEquals(Class<?>[] expected, Class<?>[] actual) {

        assertEquals(expected.length, actual.length);
        for (int i=0;i<expected.length;i++) {
            assertEquals("arrays differ at position "+i+", expected: "+
                    expected[i]+", actual: "+actual[i],
                    expected[i], actual[i]);
        }
    }
}