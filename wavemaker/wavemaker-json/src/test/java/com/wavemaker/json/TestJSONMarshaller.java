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

import java.io.StringWriter;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.JSONMarshaller_Objects.ClassWithEnum;
import com.wavemaker.json.JSONMarshaller_Objects.ClassWithEnum.DAYS;
import com.wavemaker.json.JSONMarshaller_Objects.ClassWithEnumList;
import com.wavemaker.json.JSONMarshaller_Objects.ClassWithOverridenEnums;
import com.wavemaker.json.JSONMarshaller_Objects.ClassWithOverridenEnums.MONTHS;
import com.wavemaker.json.JSONMarshaller_Objects.ComplexObject;
import com.wavemaker.json.JSONMarshaller_Objects.ObjectWithArray;
import com.wavemaker.json.JSONMarshaller_Objects.ObjectWithClass;
import com.wavemaker.json.JSONMarshaller_Objects.ObjectWithList;
import com.wavemaker.json.JSONMarshaller_Objects.ObjectWithMap;
import com.wavemaker.json.JSONMarshaller_Objects.ObjectWithRecursiveArray;
import com.wavemaker.json.JSONMarshaller_Objects.ObjectWithTypes;
import com.wavemaker.json.JSONMarshaller_Objects.SimpleObject;
import com.wavemaker.json.TestAlternateJSONTransformer.HasSomePrimitives;
import com.wavemaker.json.TestJSONSerialization.CycleA;
import com.wavemaker.json.TestJSONSerialization.CycleB;
import com.wavemaker.json.TestJSONSerialization.HasArray;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.GenericFieldDefinition;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.json.type.TypeState;
import com.wavemaker.json.type.reflect.ReflectTypeState;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;
import com.wavemaker.json.type.reflect.converters.DateTypeDefinition;

/**
 * @author Matt Small
 */
public class TestJSONMarshaller extends WMTestCase {

    public void testDoMarshal() throws Exception {

        JSONState jc = new JSONState();
        StringWriter sw = new StringWriter();

        TypeDefinition stringTypeDef = ReflectTypeUtils.getTypeDefinition(String.class, new ReflectTypeState(), false);

        TypeDefinition boolTypeDef = ReflectTypeUtils.getTypeDefinition(boolean.class, new ReflectTypeState(), false);

        JSONMarshaller.doMarshal(sw, "foo", "foo", jc, false, false, new Stack<Object>(), new Stack<String>(), new GenericFieldDefinition(
            stringTypeDef), 0, new ReflectTypeState(), false, 0, Logger.getLogger(JSONMarshaller.class));
        assertEquals("\"foo\"", sw.toString());

        sw = new StringWriter();
        JSONMarshaller.doMarshal(sw, false, false, jc, false, false, new Stack<Object>(), new Stack<String>(),
            new GenericFieldDefinition(boolTypeDef), 0, new ReflectTypeState(), false, 0, Logger.getLogger(JSONMarshaller.class));
        assertEquals("false", sw.toString());

        sw = new StringWriter();
        JSONMarshaller.doMarshal(sw, Boolean.TRUE, Boolean.TRUE, jc, false, false, new Stack<Object>(), new Stack<String>(),
            new GenericFieldDefinition(boolTypeDef), 0, new ReflectTypeState(), false, 0, Logger.getLogger(JSONMarshaller.class));
        assertEquals("true", sw.toString());
    }

    public void testObject() throws Exception {

        ComplexObject co = new ComplexObject();
        co.setSimpleObject(new SimpleObject());
        co.getSimpleObject().setStr("a");

        String s = JSONMarshaller.marshal(co);
        assertEquals("{\"objectWithMap\":null,\"simpleObject\":{\"str\":\"a\"}}", s);
    }

    public void testObject_UnquoteKeys() throws Exception {

        ComplexObject co = new ComplexObject();
        co.setSimpleObject(new SimpleObject());
        co.getSimpleObject().setStr("a");

        JSONState js = new JSONState();
        js.setUnquoteKeys(true);

        String s = JSONMarshaller.marshal(co, js);
        assertEquals("{objectWithMap:null,simpleObject:{str:\"a\"}}", s);
    }

    public void testList() throws Exception {

        ObjectWithList owl = new ObjectWithList();
        owl.setStringList(new ArrayList<String>());
        owl.getStringList().add("a");
        owl.getStringList().add("b");

        String s = JSONMarshaller.marshal(owl);
        assertEquals("{\"stringList\":[\"a\",\"b\"]}", s);
    }

    public void testWithArray() throws Exception {

        ObjectWithArray owl = new ObjectWithArray();
        owl.setStringArray(new String[] { "a", "b" });

        String s = JSONMarshaller.marshal(owl);
        assertEquals("{\"stringArray\":[\"a\",\"b\"]}", s);

        assertEquals(s, StringUtils.deleteWhitespace(JSONUnmarshaller.unmarshal(s).toString()));
    }

    public void testTopLevelArray() throws Exception {

        String[] strs = new String[] { "a", "b" };
        String s = JSONMarshaller.marshal(strs);
        assertEquals("[\"a\",\"b\"]", s);

        assertEquals(s, StringUtils.deleteWhitespace(JSONUnmarshaller.unmarshal(s).toString()));
    }

    public void testNumericTypes() throws Exception {

        JSONState jc = new JSONState();

        ObjectWithTypes owt = new ObjectWithTypes();
        owt.setBigDecimal(BigDecimal.valueOf(12.2));
        owt.setIntVal(12);
        owt.setFloatVal(13.3f);
        owt.setBigInteger(BigInteger.valueOf(13));
        owt.setBoolVal(false);

        String s = JSONMarshaller.marshal(owt, jc, false);
        assertEquals("{\"bigDecimal\":12.2,\"bigInteger\":13,\"boolVal\":false,\"floatVal\":13.3,\"intVal\":12}", s);

        assertEquals(s, StringUtils.deleteWhitespace(JSONUnmarshaller.unmarshal(s).toString()));
    }

    public void testMap() throws Exception {

        ObjectWithMap owm = new ObjectWithMap();
        owm.setStringDoubleMap(new HashMap<String, Double>());
        owm.getStringDoubleMap().put("b", Double.valueOf(12.2));
        owm.getStringDoubleMap().put("a", Double.valueOf(13.3));

        JSONState jc = new JSONState();

        String s = JSONMarshaller.marshal(owm, jc, true);
        assertEquals("{\"stringDoubleMap\":{\"a\":13.3,\"b\":12.2}}", s);

        assertEquals(s, StringUtils.deleteWhitespace(JSONUnmarshaller.unmarshal(s).toString()));
    }

    public void testNotACycle() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NULL);

        CycleA a = new CycleA();
        String s = "foo";
        a.setAString(s);
        a.setCycleB(new CycleB());
        a.getCycleB().setBString(s);

        String js = JSONMarshaller.marshal(a, jc, true);
        assertEquals("{\"AString\":\"foo\",\"cycleB\":{\"BString\":\"foo\",\"cycleA\":null}}", js);
    }

    public void testCycles() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NULL);

        CycleA a = getCycle();

        String js = JSONMarshaller.marshal(a, jc, true);
        assertTrue(js.contains("\"cycleA\""));
        assertEquals("{\"AString\":\"a\",\"cycleB\":{\"BString\":\"b\",\"cycleA\":null}}", js);

        jc.setCycleHandler(JSONState.CycleHandler.NO_PROPERTY);

        js = JSONMarshaller.marshal(a, jc, true);
        assertFalse(js.contains("\"cycleA\""));
        assertEquals("{\"AString\":\"a\",\"cycleB\":{\"BString\":\"b\"}}", js);
    }

    public void testCyclesWithRequire() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NULL);
        jc.getRequiredProperties().add("cycleB.cycleA");

        CycleA a = getCycle();

        jc.setCycleHandler(JSONState.CycleHandler.NO_PROPERTY);

        String js = JSONMarshaller.marshal(a, jc, true);
        assertEquals("{\"AString\":\"a\",\"cycleB\":{\"BString\":\"b\",\"cycleA\":{\"AString\":\"a\"}}}", js);
    }

    public void testCyclesWithRequireAndTrimStackLevel() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NULL);
        jc.getRequiredProperties().add("cycleA");
        jc.setTrimStackLevel(1);

        CycleA a = getCycle();

        jc.setCycleHandler(JSONState.CycleHandler.NO_PROPERTY);

        String js = JSONMarshaller.marshal(a, jc, true);
        assertEquals("{\"AString\":\"a\",\"cycleB\":{\"BString\":\"b\",\"cycleA\":{\"AString\":\"a\"}}}", js);
    }

    public void testMapCyclesStrict() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.FAIL);

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("foo", map);

        try {
            JSONMarshaller.marshal(map, jc, true);
            fail("no exception");
        } catch (WMRuntimeException e) {
            assertEquals(MessageResource.JSON_CYCLE_FOUND.getId(), e.getMessageId());
        }
    }

    public void testMapCycles() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NULL);

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("foo", map);

        String js = JSONMarshaller.marshal(map, jc, true);
        assertEquals("{\"foo\":null}", js);
    }

    public void testListCycles() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NULL);

        ObjectWithRecursiveArray owa = new ObjectWithRecursiveArray();
        owa.getList().add(owa);
        owa.setStr("top");

        ObjectWithRecursiveArray owa2 = new ObjectWithRecursiveArray();
        owa2.setStr("bot");
        owa.getList().add(owa2);

        String js = JSONMarshaller.marshal(owa, jc, true);
        assertEquals("{\"list\":[{\"list\":null,\"str\":\"top\"},{\"list\":[],\"str\":\"bot\"}],\"str\":\"top\"}", js);

        jc.setCycleHandler(JSONState.CycleHandler.NO_PROPERTY);
        js = JSONMarshaller.marshal(owa, jc, true);
        assertEquals("{\"list\":[{\"str\":\"top\"},{\"list\":[],\"str\":\"bot\"}],\"str\":\"top\"}", js);
    }

    public void testExclusions() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NULL);
        jc.getExcludes().add("AString");
        jc.getExcludes().add("cycleB.BString");

        CycleA a = getCycle();

        String js = JSONMarshaller.marshal(a, jc, true);
        assertTrue(js.contains("\"cycleA\""));
        assertEquals("{\"cycleB\":{\"cycleA\":null}}", js);
    }

    public void testExclusionsWithTrimStack() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NULL);
        jc.getExcludes().add("BString");
        jc.setTrimStackLevel(1);

        CycleA a = getCycle();

        String js = JSONMarshaller.marshal(a, jc, true);
        assertTrue(js.contains("\"cycleA\""));
        assertEquals("{\"AString\":\"a\",\"cycleB\":{\"cycleA\":null}}", js);
    }

    public void testMapExclusions() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NULL);
        jc.getExcludes().add("AString");

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("AString", "foo");

        String js = JSONMarshaller.marshal(map, jc, true);
        assertEquals("{}", js);
    }

    // MAV-1037
    public void testEnumeration() throws Exception {

        ClassWithEnum cwe = new ClassWithEnum();
        cwe.setDays(DAYS.MONDAY);
        String js = JSONMarshaller.marshal(cwe);
        assertEquals("{\"days\":\"MONDAY\"}", js);
    }

    // MAV-1037
    public void testEnumerationList() throws Exception {

        ClassWithEnumList cwe = new ClassWithEnumList();
        cwe.setDays(new ArrayList<DAYS>());
        cwe.getDays().add(DAYS.MONDAY);
        cwe.getDays().add(DAYS.TUESDAY);
        String js = JSONMarshaller.marshal(cwe);
        assertEquals("{\"days\":[\"MONDAY\",\"TUESDAY\"]}", js);
    }

    // MAV-1037
    public void testOverridenEnums() throws Exception {

        ClassWithOverridenEnums c = new ClassWithOverridenEnums();
        c.setMonth(MONTHS.JANUARY);

        String js = JSONMarshaller.marshal(c);
        assertEquals("{\"month\":\"january\"}", js);
    }

    public void testWithClass() throws Exception {

        ObjectWithClass owc = new ObjectWithClass();
        owc.setKlass(this.getClass());

        // this is what json-lib produces
        String expected = "{\"klass\":\"com.wavemaker.json.TestJSONMarshaller\"}";

        String s = JSONMarshaller.marshal(owc);
        assertEquals(expected, s);
    }

    public void testPrettyPrint() throws Exception {

        ClassWithOverridenEnums c = new ClassWithOverridenEnums();
        c.setMonth(MONTHS.JANUARY);

        StringWriter sw = new StringWriter();
        JSONMarshaller.marshal(sw, c, new JSONState(), true, true);
        String js = sw.toString();
        assertEquals("{\n\t\"month\": \"january\"\n}", js);
    }

    public void testPrettyPrintDeeper() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NULL);
        jc.getExcludes().add("AString");
        jc.getExcludes().add("cycleB.BString");

        CycleA a = getCycle();

        StringWriter sw = new StringWriter();
        JSONMarshaller.marshal(sw, a, jc, true, true);
        String js = sw.toString();
        assertTrue(js.contains("\"cycleA\""));
        assertEquals("{\n\t\"cycleB\": {\n\t\t\"cycleA\": null\n\t}\n}", js);
    }

    public void testPrettyPrintArray() throws Exception {

        ClassWithEnumList cwe = new ClassWithEnumList();
        cwe.setDays(new ArrayList<DAYS>());
        cwe.getDays().add(DAYS.MONDAY);
        cwe.getDays().add(DAYS.TUESDAY);

        StringWriter sw = new StringWriter();
        JSONMarshaller.marshal(sw, cwe, new JSONState(), true, true);
        String js = sw.toString();
        assertEquals("{\n\t\"days\": [\"MONDAY\", \"TUESDAY\"]\n}", js);
    }

    public void testOrdering() throws Exception {

        Map<String, String> map = new LinkedHashMap<String, String>();
        map.put("foo", "bar");
        map.put("a", "b");
        String s = JSONMarshaller.marshal(map, new JSONState(), false);
        assertEquals("{\"foo\":\"bar\",\"a\":\"b\"}", s);

        s = JSONMarshaller.marshal(map, new JSONState(), true);
        assertEquals("{\"a\":\"b\",\"foo\":\"bar\"}", s);
    }

    public void testChar() throws Exception {

        HasSomePrimitives hsp = new HasSomePrimitives();
        hsp.setBooleanVal(false);
        hsp.setCharVal('b');
        hsp.setShortVal((short) 12);

        String js = JSONMarshaller.marshal(hsp);
        assertEquals("{\"badProp\":21,\"booleanVal\":false,\"charVal\":\"b\",\"shortVal\":12}", js);
    }

    /**
     * @see TestJSONUnmarshaller#testEscaped()
     */
    public void testEscaped() throws Exception {

        Map<String, String> map = new HashMap<String, String>();
        map.put("foo", "b\noo\n\to");
        String expectedJson = "{\"foo\":\"b\\noo\\n\\to\"}";

        String jsonString = JSONMarshaller.marshal(map);
        assertEquals(expectedJson, jsonString);

        map.put("foo", "/");
        // assertEquals("{\"foo\":\"/\"}", net.sf.json.JSONObject.fromObject(map).toString());
        assertEquals("{\"foo\":\"/\"}", JSONMarshaller.marshal(map));

        map.put("foo", "\\");
        // assertEquals("{\"foo\":\"\\\\\"}", net.sf.json.JSONObject.fromObject(map).toString());
        assertEquals("{\"foo\":\"\\\\\"}", JSONMarshaller.marshal(map));

        map.put("foo", "\\/");
        // assertEquals("{\"foo\":\"\\\\/\"}", net.sf.json.JSONObject.fromObject(map).toString());
        assertEquals("{\"foo\":\"\\\\/\"}", JSONMarshaller.marshal(map));

        map.put("foo", "\\/\b");
        // assertEquals("{\"foo\":\"\\\\/\\b\"}", net.sf.json.JSONObject.fromObject(map).toString());
        assertEquals("{\"foo\":\"\\\\/\\b\"}", JSONMarshaller.marshal(map));

        map.put("foo", "\"\\/\b");
        // assertEquals("{\"foo\":\"\\\"\\\\/\\b\"}", net.sf.json.JSONObject.fromObject(map).toString());
        assertEquals("{\"foo\":\"\\\"\\\\/\\b\"}", JSONMarshaller.marshal(map));

        map.put("foo", "\"\\/\b\f\n\r\t\u2297\\");
        // assertEquals("{\"foo\":\"\\\"\\\\/\\b\\f\\n\\r\\t⊗\\\\\"}",
        // net.sf.json.JSONObject.fromObject(map).toString());
        assertEquals("{\"foo\":\"\\\"\\\\/\\b\\f\\n\\r\\t⊗\\\\\"}", JSONMarshaller.marshal(map));

        // this is maybe more correct, but doesn't match json-lib
        // assertEquals("{\"foo\":\"\\\"\\\\\\/\\b\\f\\n\\r\\t\\u2297\"}", jsonString);
    }

    public void testValueTransformer() throws Exception {

        JSONState state = new JSONState();

        Map<String, Object> enclosed = new HashMap<String, Object>();
        enclosed.put("hi", "foo");

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("bar", enclosed);

        assertEquals("{\"bar\":{\"hi\":\"foo\"}}", JSONMarshaller.marshal(map, state));

        state.setValueTransformer(new ValueTransformer() {

            @Override
            public Tuple.Three<Object, FieldDefinition, Integer> transformToJSON(Object input, FieldDefinition fieldDefinition, int arrayLevel,
                Object root, String path, TypeState typeState) {

                if ("bar.hi".equals(path)) {
                    GenericFieldDefinition fd = new GenericFieldDefinition();
                    fd.setTypeDefinition(typeState.getType(String.class.getName()));
                    return new Tuple.Three<Object, FieldDefinition, Integer>(input + " transformed, root: " + root.hashCode(), fd, 0);
                } else if ("bar.bye".equals(path)) {
                    GenericFieldDefinition fd = new GenericFieldDefinition();
                    fd.setTypeDefinition(typeState.getType(Short.TYPE.getName()));
                    return new Tuple.Three<Object, FieldDefinition, Integer>(12, fd, 0);
                } else {
                    return null;
                }
            }

            @Override
            public Tuple.Three<Object, FieldDefinition, Integer> transformToJava(Object input, FieldDefinition fieldDefinition, int arrayLevel,
                Object root, String path, TypeState typeState) {

                // unused in this test
                return null;
            }
        });

        assertEquals("{\"bar\":{\"hi\":\"foo transformed, root: " + map.hashCode() + "\"}}", JSONMarshaller.marshal(map, state));

        enclosed.remove("hi");
        enclosed.put("bye", "fdks");
        assertEquals("{\"bar\":{\"bye\":12}}", JSONMarshaller.marshal(map, state));
    }

    public void testMapWithAListOfDate() throws Exception {

        JSONState state = new JSONState();
        state.getTypeState().addType(new DateTypeDefinition(Date.class));

        Map<String, Object> map = new HashMap<String, Object>();
        List<Object> dates = new ArrayList<Object>();
        dates.add(new Date(1));
        dates.add(new Date(2));
        map.put("result", dates);

        String s = JSONMarshaller.marshal(map, state);
        assertEquals("{\"result\":[1,2]}", s);
    }

    public void testNestedLists() throws Exception {

        JSONState state = new JSONState();

        List<List<String>> list = new ArrayList<List<String>>();
        list.add(new ArrayList<String>());

        String s = JSONMarshaller.marshal(list, state);
        assertEquals("[[]]", s);

        assertEquals(s, JSONUnmarshaller.unmarshal(s).toString());

        list.get(0).add("foo");
        s = JSONMarshaller.marshal(list, state);
        assertEquals("[[\"foo\"]]", s);

        assertEquals(s, JSONUnmarshaller.unmarshal(s).toString());
    }

    public void testHasArray() throws Exception {

        JSONState state = new JSONState();

        HasArray ha = new HasArray();
        ha.setListListString(new ArrayList<List<String>>());
        ha.getListListString().add(new ArrayList<String>());
        ha.getListListString().get(0).add("foo");
        ha.getListListString().get(0).add("bar");

        String s = JSONMarshaller.marshal(ha, state);
        assertEquals("{\"array\":null,\"listListString\":[[\"foo\",\"bar\"]]}", s);

        ha.setArray(new int[] { 1, 2 });
        s = JSONMarshaller.marshal(ha, state);
        assertEquals("{\"array\":[1,2],\"listListString\":[[\"foo\",\"bar\"]]}", s);
    }

    private static CycleA getCycle() {

        CycleA ret = new CycleA();
        CycleB b = new CycleB();
        ret.setAString("a");
        ret.setCycleB(b);
        b.setBString("b");
        b.setCycleA(ret);

        return ret;
    }
}