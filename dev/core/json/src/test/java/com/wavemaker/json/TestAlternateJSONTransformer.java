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

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.JSONMarshaller_Objects.ClassWithEnum;
import com.wavemaker.json.JSONMarshaller_Objects.ClassWithOverridenEnums;
import com.wavemaker.json.JSONMarshaller_Objects.ObjectWithClass;
import com.wavemaker.json.TestAlternateJSONTransformer.IsNested.IsNestedDeeper;
import com.wavemaker.json.TestAlternateJSONTransformer.IsNested.IsNestedDeeper.IsNestedEvenDeeper;
import com.wavemaker.json.TestAlternateJSONTransformer.IsNested.IsNestedDeeper.IsNestedEvenDeeper.IsNestedDeepest;
import com.wavemaker.json.TestJSONSerialization.HasArray;
import com.wavemaker.json.TestJSONSerialization.HasDate;
import com.wavemaker.json.TestJSONSerialization.Product;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.GenericFieldDefinition;
import com.wavemaker.json.type.ObjectTypeDefinition;
import com.wavemaker.json.type.TypeState;
import com.wavemaker.json.type.reflect.ReflectTypeState;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;
import com.wavemaker.json.type.reflect.converters.DateTypeDefinition;
import com.wavemaker.json.type.reflect.converters.FileTypeDefinition;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestAlternateJSONTransformer extends WMTestCase {

    @Override
    public void setUp() throws Exception {
        SpringUtils.initSpringConfig();
    }

    public void testBasic() throws Exception {

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal("{\"price\":21, \"description\":\"foo\"}");
        Object o = AlternateJSONTransformer.toObject(jo, Product.class);

        assertTrue(o instanceof Product);
        Product po = (Product) o;
        assertEquals(new Double(21), po.getPrice());
        assertEquals("foo", po.getDescription());
    }

    public void testHasList() throws Exception {

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal("{\"strings\":[\"a\",\"b\"]}");
        Object o = AlternateJSONTransformer.toObject(jo, HasList.class);

        assertTrue(o instanceof HasList);
        HasList hlo = (HasList) o;
        assertEquals(2, hlo.getStrings().size());
        assertEquals("b", hlo.getStrings().get(1));
    }

    public void testNestedLists() throws Exception {

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal("{\"listOfStrings\":[[\"a\",\"b\"],[\"c\"]]}");
        Object o = AlternateJSONTransformer.toObject(jo, HasNestedList.class);

        assertTrue(o instanceof HasNestedList);
        HasNestedList hlo = (HasNestedList) o;
        assertEquals(2, hlo.getListOfStrings().size());
        assertEquals(2, hlo.getListOfStrings().get(0).size());
        assertEquals(1, hlo.getListOfStrings().get(1).size());
        assertEquals("b", hlo.getListOfStrings().get(0).get(1));
    }

    public void testMap() throws Exception {

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal("{\"map\":{\"a\":\"b\",\"c\":\"d\"}}");
        Object o = AlternateJSONTransformer.toObject(jo, HasMap.class);

        assertTrue(o instanceof HasMap);
        HasMap hlo = (HasMap) o;
        assertEquals(2, hlo.getMap().size());
        assertEquals("b", hlo.getMap().get("a"));
        assertEquals("d", hlo.getMap().get("c"));
    }

    public void testMapWithInts() throws Exception {

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal("{\"map\":{\"a\":1,\"c\":2}}");
        Object o = AlternateJSONTransformer.toObject(jo, HasMap.class);

        assertTrue(o instanceof HasMap);
        HasMap hlo = (HasMap) o;
        assertEquals(2, hlo.getMap().size());
        assertEquals("1", hlo.getMap().get("a"));
        assertEquals("2", hlo.getMap().get("c"));
    }

    public void testNestedMap() throws Exception {

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal("{\"map\":{\"a\":{\"a\":\"b\",\"c\":\"d\"}}}");
        Object o = AlternateJSONTransformer.toObject(jo, HasNestedMap.class);

        assertTrue(o instanceof HasNestedMap);
        HasNestedMap hlo = (HasNestedMap) o;
        assertEquals(1, hlo.getMap().size());
        assertTrue(hlo.getMap().containsKey("a"));

        Map<String, String> map = hlo.getMap().get("a");
        assertEquals("b", map.get("a"));
        assertEquals("d", map.get("c"));
    }

    public void testDates() throws Exception {

        JSONState jsonState = new JSONState();

        jsonState.getTypeState().addType(new DateTypeDefinition(java.util.Date.class));
        FieldDefinition fd = ReflectTypeUtils.getFieldDefinition(HasDate.class, jsonState.getTypeState(), false, null);
        assertTrue(fd.getTypeDefinition() instanceof ObjectTypeDefinition);
        ObjectTypeDefinition otd = (ObjectTypeDefinition) fd.getTypeDefinition();

        assertTrue(otd.getFields().containsKey("date"));
        FieldDefinition dateFD = otd.getFields().get("date");
        assertTrue("dateFD: " + dateFD, dateFD.getTypeDefinition() instanceof DateTypeDefinition);

        long now = System.currentTimeMillis() - 30000;

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal("{\"date\":" + now + "}");

        Object o = AlternateJSONTransformer.toObject(jsonState, jo, fd);
        assertTrue(o instanceof HasDate);
        HasDate hd = (HasDate) o;
        assertEquals(now, hd.getDate().getTime());
    }

    public void testNullAttribute() throws Exception {

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal("{\"map\":null}");
        Object o = AlternateJSONTransformer.toObject(jo, HasMap.class);

        assertTrue(o instanceof HasMap);
        HasMap hlo = (HasMap) o;
        assertNull("map wasA: " + hlo.getMap(), hlo.getMap());
    }

    public void testHasArray() throws Exception {

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal("{\"array\":[1,2]}");
        Object o = AlternateJSONTransformer.toObject(jo, HasArray.class);

        assertTrue(o instanceof HasArray);
        HasArray hlo = (HasArray) o;
        assertEquals(2, hlo.getArray().length);
        assertEquals(2, hlo.getArray()[1]);
    }

    public void testHasSomePrimitives() throws Exception {

        HasSomePrimitives hsp = new HasSomePrimitives();
        hsp.setBooleanVal(false);
        hsp.setCharVal('b');
        hsp.setShortVal((short) 12);

        String js = JSONMarshaller.marshal(hsp);
        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal(js);
        assertEquals(hsp.getShortVal(), ((Long) jo.get("shortVal")).shortValue());
        assertEquals(hsp.getCharVal() + "", jo.get("charVal").toString());

        Object o = AlternateJSONTransformer.toObject(jo, HasSomePrimitives.class);

        assertTrue(o instanceof HasSomePrimitives);
        HasSomePrimitives hlo = (HasSomePrimitives) o;
        assertEquals(hsp.isBooleanVal(), hlo.isBooleanVal());
        assertEquals(hsp.getCharVal(), hlo.getCharVal());
        assertEquals(hsp.getShortVal(), hlo.getShortVal());
    }

    public void testModifiedAttrs() throws Exception {

        IsNestedDeepest inds = new IsNestedDeepest();
        inds.setIntVal(12);
        IsNestedDeepest inds2 = new IsNestedDeepest();
        inds2.setIntVal(13);

        IsNestedEvenDeeper inde = new IsNestedEvenDeeper();
        inde.setDeepest(inds);
        IsNestedEvenDeeper inde2 = new IsNestedEvenDeeper();
        inde2.setDeepest(inds2);

        IsNestedDeeper ind = new IsNestedDeeper();
        ind.setEvenDeeper(inde);
        ind.setEvenDeeper2(inde2);

        IsNested in = new IsNested();
        in.setDeeper(ind);

        String js = JSONMarshaller.marshal(in);

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal(js);
        JSONState jc = new JSONState();
        AlternateJSONTransformer.toObject(jc, jo, IsNested.class);

        List<String> setters = jc.getSettersCalled();
        assertEquals(7, setters.size());
        assertTrue(setters.contains("deeper.evenDeeper.deepest.intVal"));
    }

    public void testBadProperty() throws Exception {

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal("{\"badProp\":[1,2]}");
        AlternateJSONTransformer.toObject(jo, HasSomePrimitives.class);
    }

    // MAV-901
    public void testNoGenerics() throws Exception {

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal("{\"strings\":[\"a\",\"b\"]}");
        HasNoGenericsList hng = (HasNoGenericsList) AlternateJSONTransformer.toObject(jo, HasNoGenericsList.class);
        assertEquals(2, hng.getStrings().size());
        assertEquals("a", hng.getStrings().get(0));
        assertEquals("b", hng.getStrings().get(1));
    }

    // support Properties
    public void testProperties() throws Exception {

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal("{\"props\":{\"a\":\"b\"}}");
        Object o = AlternateJSONTransformer.toObject(jo, HasProperties.class);
        assertTrue(o instanceof HasProperties);
        HasProperties hp = (HasProperties) o;
        assertNotNull(hp.getProps());
        assertEquals("b", hp.getProps().getProperty("a"));
    }

    // MAV-1037
    public void testEnumeration() throws Exception {

        String js = "{\"days\":\"MONDAY\"}";

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal(js);
        Object o = AlternateJSONTransformer.toObject(jo, ClassWithEnum.class);
        assertTrue(o instanceof ClassWithEnum);
        ClassWithEnum cwe = (ClassWithEnum) o;

        assertEquals(ClassWithEnum.DAYS.MONDAY, cwe.getDays());
    }

    // MAV-1037
    public void testOverridenEnums() throws Exception {

        String js = "{\"month\":\"january\"}";

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal(js);
        Object o = AlternateJSONTransformer.toObject(jo, ClassWithOverridenEnums.class);
        assertTrue(o instanceof ClassWithOverridenEnums);
        ClassWithOverridenEnums cwe = (ClassWithOverridenEnums) o;

        assertEquals(ClassWithOverridenEnums.MONTHS.JANUARY, cwe.getMonth());
    }

    public void testObjectWithClass() throws Exception {

        String js = "{\"klass\":\"com.wavemaker.json.TestJSONMarshaller\"}";

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal(js);
        Object o = AlternateJSONTransformer.toObject(jo, ObjectWithClass.class);
        assertTrue(o instanceof ObjectWithClass);
        ObjectWithClass owc = (ObjectWithClass) o;

        assertEquals(TestJSONMarshaller.class, owc.getKlass());
    }

    // MAV-669
    public void testStringToFile() throws Exception {

        File expected = new File("/foo");
        JSONState jc = new JSONState();

        String js = "{\"file\":\"/foo\"}";

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal(js);
        try {
            AlternateJSONTransformer.toObject(jc, jo, HasFile.class);
            fail("expected exception");
        } catch (WMRuntimeException e) {
            assertEquals(MessageResource.JSON_UNKNOWN_OBJECT_TYPE.getId(), e.getMessageId());
        }

        jc.setTypeState(new ReflectTypeState());
        jc.getTypeState().addType(new FileTypeDefinition(File.class));

        Object o = AlternateJSONTransformer.toObject(jc, jo, HasFile.class);

        assertTrue(o instanceof HasFile);
        HasFile owc = (HasFile) o;

        assertEquals(expected.getAbsolutePath(), owc.getFile().getAbsolutePath());
    }

    public void testValueTransformer() throws Exception {

        JSONState state = new JSONState();

        String jsonString = "{\"shortVal\":\"hi\"}";

        JSONObject json = (JSONObject) JSONUnmarshaller.unmarshal(jsonString, state);

        try {
            AlternateJSONTransformer.toObject(state, json, HasSomePrimitives.class);
            fail("no exception");
        } catch (WMRuntimeException e) {
            assertTrue(e.getCause() instanceof NumberFormatException);
        }

        state.setValueTransformer(new ValueTransformer() {

            public Tuple.Three<Object, FieldDefinition, Integer> transformToJSON(Object input, FieldDefinition fieldDefinition, int arrayLevel,
                Object root, String path, TypeState typeState) {

                // unused in this test
                return null;
            }

            public Tuple.Three<Object, FieldDefinition, Integer> transformToJava(Object input, FieldDefinition fieldDefinition, int arrayLevel,
                Object root, String path, TypeState typeState) {

                if ("shortVal".equals(path)) {
                    GenericFieldDefinition fd = new GenericFieldDefinition();
                    fd.setTypeDefinition(typeState.getType(Short.TYPE.getName()));
                    return new Tuple.Three<Object, FieldDefinition, Integer>(12, fd, 0);
                } else {
                    return null;
                }
            }
        });

        HasSomePrimitives hsp = (HasSomePrimitives) AlternateJSONTransformer.toObject(state, json, HasSomePrimitives.class);
        assertEquals(12, hsp.getShortVal());
    }

    public static class HasList {

        private List<String> strings;

        public List<String> getStrings() {
            return this.strings;
        }

        public void setStrings(List<String> strings) {
            this.strings = strings;
        }
    }

    public static class HasNoGenericsList {

        @SuppressWarnings("unchecked")
        private List strings;

        @SuppressWarnings("unchecked")
        public List getStrings() {
            return this.strings;
        }

        @SuppressWarnings("unchecked")
        public void setStrings(List strings) {
            this.strings = strings;
        }
    }

    public static class HasNestedList {

        private List<List<String>> listOfStrings;

        public List<List<String>> getListOfStrings() {
            return this.listOfStrings;
        }

        public void setListOfStrings(List<List<String>> listOfStrings) {
            this.listOfStrings = listOfStrings;
        }
    }

    public static class HasMap {

        private Map<String, String> map;

        public Map<String, String> getMap() {
            return this.map;
        }

        public void setMap(Map<String, String> map) {
            this.map = map;
        }
    }

    public static class HasNestedMap {

        private Map<String, Map<String, String>> map;

        public Map<String, Map<String, String>> getMap() {
            return this.map;
        }

        public void setMap(Map<String, Map<String, String>> map) {
            this.map = map;
        }
    }

    public static class HasSomePrimitives {

        private short shortVal;

        private boolean booleanVal;

        private char charVal;

        public short getShortVal() {
            return this.shortVal;
        }

        public void setShortVal(short shortVal) {
            this.shortVal = shortVal;
        }

        public boolean isBooleanVal() {
            return this.booleanVal;
        }

        public void setBooleanVal(boolean booleanVal) {
            this.booleanVal = booleanVal;
        }

        public char getCharVal() {
            return this.charVal;
        }

        public void setCharVal(char charVal) {
            this.charVal = charVal;
        }

        // bad property, for testBadProperty
        public int getBadProp() {
            return 21;
        }
    }

    public static class HasProperties {

        private Properties props;

        public Properties getProps() {
            return this.props;
        }

        public void setProps(Properties props) {
            this.props = props;
        }
    }

    public static class HasFile {

        private File file;

        public File getFile() {
            return this.file;
        }

        public void setFile(File file) {
            this.file = file;
        }
    }

    public static class IsNested {

        private IsNestedDeeper deeper;

        public IsNestedDeeper getDeeper() {
            return this.deeper;
        }

        public void setDeeper(IsNestedDeeper deeper) {
            this.deeper = deeper;
        }

        public static class IsNestedDeeper {

            private IsNestedEvenDeeper evenDeeper;

            private IsNestedEvenDeeper evenDeeper2;

            public IsNestedEvenDeeper getEvenDeeper() {
                return this.evenDeeper;
            }

            public void setEvenDeeper(IsNestedEvenDeeper evenDeeper) {
                this.evenDeeper = evenDeeper;
            }

            public IsNestedEvenDeeper getEvenDeeper2() {
                return this.evenDeeper2;
            }

            public void setEvenDeeper2(IsNestedEvenDeeper evenDeeper2) {
                this.evenDeeper2 = evenDeeper2;
            }

            public static class IsNestedEvenDeeper {

                private IsNestedDeepest deepest;

                public IsNestedDeepest getDeepest() {
                    return this.deepest;
                }

                public void setDeepest(IsNestedDeepest deepest) {
                    this.deepest = deepest;
                }

                public static class IsNestedDeepest {

                    private int intVal;

                    public int getIntVal() {
                        return this.intVal;
                    }

                    public void setIntVal(int intVal) {
                        this.intVal = intVal;
                    }
                }
            }
        }
    }
}
