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

package com.wavemaker.json.type.reflect;

import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import org.springframework.util.ClassUtils;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.JSONMarshaller_Objects.ClassWithEnum;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.ListTypeDefinition;
import com.wavemaker.json.type.MapTypeDefinition;
import com.wavemaker.json.type.ObjectTypeDefinition;
import com.wavemaker.json.type.PrimitiveTypeDefinition;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.json.type.TypeState;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestReflectTypeUtils extends WMTestCase {

    @Override
    public void setUp() throws Exception {
        SpringUtils.initSpringConfig();
    }

    public void testGetListTypeDefinition() throws Exception {

        ReflectTypeState typeState = new ReflectTypeState();

        ListTypeDefinition ltd_one = ReflectTypeUtils.getListTypeDefinition(List.class, typeState, false);
        ListTypeDefinition ltd_two = ReflectTypeUtils.getListTypeDefinition(List.class, typeState, false);
        assertEquals(ltd_one, ltd_two);
        assertEquals(List.class.getName(), ltd_one.getTypeName());

        assertEquals(1, typeState.getKnownTypes().size());
    }

    public void testGetDimensionsAndType() throws Exception {

        Tuple.Two<TypeDefinition, List<ListTypeDefinition>> sample;

        sample = ReflectTypeUtils.getArrayDimensions(ClassUtils.forName("int"), new ReflectTypeState(), false);
        assertEquals("int", sample.v1.getTypeName());
        assertEquals(0, sample.v2.size());
    }

    public void testGetDimensionsAndType_IntArr() throws Exception {

        Tuple.Two<TypeDefinition, List<ListTypeDefinition>> sample;

        sample = ReflectTypeUtils.getArrayDimensions(ClassUtils.forName("int[]"), new ReflectTypeState(), false);
        assertEquals("int", sample.v1.getTypeName());
        assertEquals(1, sample.v2.size());
        assertTrue(sample.v2.get(0) instanceof ListTypeDefinition);
        assertEquals("[I", sample.v2.get(0).getTypeName());
    }

    public void testGetDimensionsAndType_IntArrArr() throws Exception {

        Tuple.Two<TypeDefinition, List<ListTypeDefinition>> sample;

        sample = ReflectTypeUtils.getArrayDimensions(ClassUtils.forName("int[][]"), new ReflectTypeState(), false);
        assertEquals("int", sample.v1.getTypeName());
        assertEquals(2, sample.v2.size());
        assertTrue(sample.v2.get(0) instanceof ListTypeDefinition);
        assertEquals("[[I", sample.v2.get(0).getTypeName());
        assertTrue(sample.v2.get(1) instanceof ListTypeDefinition);
        assertEquals("[I", sample.v2.get(1).getTypeName());
    }

    public void testGetDimensionsAndType_Int() throws Exception {

        Tuple.Two<TypeDefinition, List<ListTypeDefinition>> sample;

        sample = ReflectTypeUtils.getArrayDimensions(ClassUtils.forName("int"), new ReflectTypeState(), false);
        assertEquals("int", sample.v1.getTypeName());
        assertEquals(0, sample.v2.size());
    }

    public void testGetDimensionsAndType_BasicListTypes_BoolValList() throws Exception {

        Tuple.Two<TypeDefinition, List<ListTypeDefinition>> sample;
        Method m;

        m = BasicListTypes.class.getMethod("getBoolvallist");
        assertNotNull(m);

        sample = ReflectTypeUtils.getArrayDimensions(m.getGenericReturnType(), new ReflectTypeState(), false);
        assertEquals("java.lang.Boolean", sample.v1.getTypeName());
        assertEquals(1, sample.v2.size());
        assertTrue(sample.v2.get(0) instanceof ListTypeDefinition);
        assertEquals(List.class.getName(), sample.v2.get(0).getTypeName());
    }

    public void testGetDimensionsAndType_BasicListTypes_CharValListList() throws Exception {

        Tuple.Two<TypeDefinition, List<ListTypeDefinition>> sample;
        Method m;

        m = BasicListTypes.class.getMethod("getCharvallistlist");
        assertNotNull(m);

        sample = ReflectTypeUtils.getArrayDimensions(m.getGenericReturnType(), new ReflectTypeState(), false);
        assertEquals("java.lang.Character", sample.v1.getTypeName());
        assertEquals(2, sample.v2.size());
        assertTrue(sample.v2.get(0) instanceof ListTypeDefinition);
        assertEquals(List.class.getName(), sample.v2.get(0).getTypeName());
        assertTrue(sample.v2.get(1) instanceof ListTypeDefinition);
        assertEquals(List.class.getName(), sample.v2.get(1).getTypeName());
        assertEquals(sample.v2.get(0), sample.v2.get(1));
    }

    public void testGetDimensionsAndType_ArrayNestedInList_ListListStringArr() throws Exception {

        Tuple.Two<TypeDefinition, List<ListTypeDefinition>> sample;
        Method m;

        m = ArrayNestedInList.class.getMethod("getListliststringarr");
        assertNotNull(m);

        sample = ReflectTypeUtils.getArrayDimensions(m.getGenericReturnType(), new ReflectTypeState(), false);
        assertEquals("java.lang.String", sample.v1.getTypeName());
        assertEquals(3, sample.v2.size());
        assertEquals(List.class.getName(), sample.v2.get(0).getTypeName());
        assertEquals(List.class.getName(), sample.v2.get(1).getTypeName());
        assertEquals(ClassUtils.forName("java.lang.String[]").getName(), sample.v2.get(2).getTypeName());
    }

    public void testGetDimensionsAndType_ListSetMapType_Complicated() throws Exception {

        Tuple.Two<TypeDefinition, List<ListTypeDefinition>> sample;
        Method m;
        ReflectTypeState typeState;

        m = ListSetMapType.class.getMethod("getComplicated");
        assertNotNull(m);

        typeState = new ReflectTypeState();
        int start = typeState.getKnownTypes().size();
        sample = ReflectTypeUtils.getArrayDimensions(m.getGenericReturnType(), typeState, false);
        assertEquals("java.util.Map<java.lang.String,java.util.List<java.lang.String>>", sample.v1.getTypeName());
        assertEquals(2, sample.v2.size());
        assertTrue(sample.v2.get(0) instanceof ListTypeDefinition);
        assertEquals(List.class.getName(), sample.v2.get(0).getTypeName());
        assertTrue(sample.v2.get(1) instanceof ListTypeDefinition);
        assertEquals(Set.class.getName(), sample.v2.get(1).getTypeName());

        assertEquals(4, typeState.getKnownTypes().size() - start);
        assertNotNull(typeState.getType("java.util.Map<java.lang.String,java.util.List<java.lang.String>>"));
    }

    public void testGetFieldDefinition_Type() throws Exception {

        TypeState ts = new ReflectTypeState();
        FieldDefinition fd;

        fd = ReflectTypeUtils.getFieldDefinition(String.class, ts, false, null);
        assertNotNull(fd);
        assertNotNull(fd.getTypeDefinition());
        assertEquals(String.class.getName(), fd.getTypeDefinition().getTypeName());
        assertTrue(fd.getTypeDefinition() instanceof PrimitiveTypeDefinition);

        Method m = BasicListTypes.class.getMethod("getBoolvallist");
        assertNotNull(m);

        fd = ReflectTypeUtils.getFieldDefinition(m.getGenericReturnType(), ts, false, null);
        assertEquals(1, fd.getDimensions());
        assertEquals(Boolean.class.getName(), fd.getTypeDefinition().getTypeName());
        assertTrue(fd.getTypeDefinition() instanceof PrimitiveTypeDefinition);

        m = BasicListTypes.class.getMethod("getCharvallistlist");
        assertNotNull(m);

        fd = ReflectTypeUtils.getFieldDefinition(m.getGenericReturnType(), ts, false, null);
        assertEquals(2, fd.getDimensions());
        assertEquals(Character.class.getName(), fd.getTypeDefinition().getTypeName());
        assertTrue(fd.getTypeDefinition() instanceof PrimitiveTypeDefinition);
    }

    public void testGetTypeDefinition() throws Exception {

        TypeState typeState = new ReflectTypeState();
        assertFalse(typeState.isTypeKnown(ReflectTypeUtils.getTypeName(String.class)));

        TypeDefinition td = ReflectTypeUtils.getTypeDefinition(String.class, typeState, false);
        assertNotNull(td);
        assertEquals("java.lang.String", td.getTypeName());
        assertEquals("String", td.getShortName());
        assertTrue(td instanceof PrimitiveTypeDefinition);

        td = ReflectTypeUtils.getTypeDefinition(Object.class, typeState, false);
        assertNull(td);
    }

    public void testBasicTypes() throws Exception {

        ReflectTypeState typeState = new ReflectTypeState();
        int start = typeState.getKnownTypes().size();
        TypeDefinition root = ReflectTypeUtils.getTypeDefinition(BasicTypes.class, typeState, false);
        assertEquals(4, typeState.getKnownTypes().size() - start);
        assertTrue(root instanceof ObjectTypeDefinition);
        ObjectTypeDefinition otd = (ObjectTypeDefinition) root;

        assertEquals(BasicTypes.class.getName(), root.getTypeName());

        assertEquals(typeState.getType(Long.class.getName()), otd.getFields().get("biglongval").getTypeDefinition());
        assertEquals(typeState.getType(boolean.class.getName()), otd.getFields().get("boolval").getTypeDefinition());
        assertEquals(typeState.getType(int.class.getName()), otd.getFields().get("intval").getTypeDefinition());

        assertNotNull(typeState.getType(ReflectTypeUtils.getTypeName(Long.class)));
        assertTrue(typeState.getType(ReflectTypeUtils.getTypeName(Long.class)) instanceof PrimitiveTypeDefinition);
        assertTrue(otd.getFields().get("biglongval").getTypeDefinition() instanceof PrimitiveTypeDefinition);

        assertNotNull(typeState.getType(ReflectTypeUtils.getTypeName(int.class)));
        assertTrue(typeState.getType(ReflectTypeUtils.getTypeName(int.class)) instanceof PrimitiveTypeDefinition);
        assertTrue(otd.getFields().get("intval").getTypeDefinition() instanceof PrimitiveTypeDefinition);

        assertNotNull(typeState.getType(ReflectTypeUtils.getTypeName(boolean.class)));
        assertTrue(typeState.getType(ReflectTypeUtils.getTypeName(boolean.class)) instanceof PrimitiveTypeDefinition);
        assertTrue(otd.getFields().get("boolval").getTypeDefinition() instanceof PrimitiveTypeDefinition);
    }

    public void testBasicListTypes() throws Exception {

        FieldDefinition field;
        ReflectTypeState typeState = new ReflectTypeState();
        int start = typeState.getKnownTypes().size();
        TypeDefinition root = ReflectTypeUtils.getTypeDefinition(BasicListTypes.class, typeState, false);
        assertEquals(9, typeState.getKnownTypes().size() - start);
        assertTrue(root instanceof ObjectTypeDefinition);
        ObjectTypeDefinition otd = (ObjectTypeDefinition) root;

        assertEquals(BasicListTypes.class.getName(), root.getTypeName());

        field = otd.getFields().get("biglongdoublearray");
        assertNotNull(field);
        assertEquals(typeState.getType(Long.class.getName()), field.getTypeDefinition());
        assertEquals(2, field.getDimensions());
        assertEquals("[[Ljava.lang.Long;", field.getArrayTypes().get(0).getTypeName());
        assertEquals("[Ljava.lang.Long;", field.getArrayTypes().get(1).getTypeName());

        field = otd.getFields().get("intvalarray");
        assertEquals(typeState.getType(int.class.getName()), field.getTypeDefinition());
        assertEquals(1, field.getDimensions());
        assertEquals("[I", field.getArrayTypes().get(0).getTypeName());

        field = otd.getFields().get("boolvallist");
        assertEquals(typeState.getType(Boolean.class.getName()), field.getTypeDefinition());
        assertEquals(1, field.getDimensions());
        assertEquals("java.util.List", field.getArrayTypes().get(0).getTypeName());

        field = otd.getFields().get("charvallistlist");
        assertEquals(typeState.getType(Character.class.getName()), field.getTypeDefinition());
        assertEquals(2, field.getDimensions());
        assertEquals("java.util.List", field.getArrayTypes().get(0).getTypeName());
        assertEquals("java.util.List", field.getArrayTypes().get(1).getTypeName());
    }

    public void testMapType() throws Exception {

        ReflectTypeState typeState = new ReflectTypeState();
        int start = typeState.getKnownTypes().size();
        Method m = BasicMapTypes.class.getMethod("getStringStringMap");
        assertNotNull(m);
        Type type = m.getGenericReturnType();

        TypeDefinition root = ReflectTypeUtils.getTypeDefinition(type, typeState, false);
        assertEquals("java.util.Map<java.lang.String,java.lang.String>", root.getTypeName());

        assertTrue(root instanceof MapTypeDefinition);
        MapTypeDefinition mtd = (MapTypeDefinition) root;

        assertEquals(String.class.getName(), mtd.getKeyFieldDefinition().getTypeDefinition().getTypeName());
        assertTrue(mtd.getKeyFieldDefinition().getTypeDefinition() instanceof PrimitiveTypeDefinition);
        assertEquals(String.class.getName(), mtd.getValueFieldDefinition().getTypeDefinition().getTypeName());
        assertTrue(mtd.getValueFieldDefinition().getTypeDefinition() instanceof PrimitiveTypeDefinition);

        assertEquals(2, typeState.getKnownTypes().size() - start);
        assertNotNull(typeState.getType(ReflectTypeUtils.getTypeName(String.class)));
    }

    public void testBasicMapTypes() throws Exception {

        FieldDefinition fd;

        ReflectTypeState typeState = new ReflectTypeState();
        int start = typeState.getKnownTypes().size();
        TypeDefinition root = ReflectTypeUtils.getTypeDefinition(BasicMapTypes.class, typeState, false);

        assertNotNull(root);
        assertEquals(4, typeState.getKnownTypes().size() - start);

        assertNotNull(typeState.getType(ReflectTypeUtils.getTypeName(BasicMapTypes.class)));
        assertNotNull(typeState.getType("java.util.Map<java.lang.String,java.lang.String>"));
        assertNotNull(typeState.getType(ReflectTypeUtils.getTypeName(String.class)));

        assertEquals(typeState.getType(ReflectTypeUtils.getTypeName(BasicMapTypes.class)), root);

        assertTrue(root instanceof ObjectTypeDefinition);
        ObjectTypeDefinition otd = (ObjectTypeDefinition) root;
        assertEquals(2, otd.getFields().size());

        assertTrue(otd.getFields().containsKey("stringStringMap"));
        fd = otd.getFields().get("stringStringMap");
        assertTrue(fd.getTypeDefinition() instanceof MapTypeDefinition);

        assertTrue(otd.getFields().containsKey("properties"));
        fd = otd.getFields().get("properties");
        assertTrue(fd.getTypeDefinition() instanceof MapTypeDefinition);
        MapTypeDefinition mtd = (MapTypeDefinition) fd.getTypeDefinition();
        assertEquals(typeState.getType("java.lang.String"), mtd.getKeyFieldDefinition().getTypeDefinition());
        assertEquals(typeState.getType("java.lang.String"), mtd.getValueFieldDefinition().getTypeDefinition());
    }

    public void NOTYETSUPPORTEDtestArrayNestedInList() throws Exception {

        TypeState typeState = new ReflectTypeState();
        TypeDefinition root = ReflectTypeUtils.getTypeDefinition(ArrayNestedInList.class, typeState, false);
        assertNotNull(root);
    }

    public void testListListMapType() throws Exception {

        ReflectTypeState typeState = new ReflectTypeState();
        int start = typeState.getKnownTypes().size();
        TypeDefinition root = ReflectTypeUtils.getTypeDefinition(ListSetMapType.class, typeState, false);

        assertNotNull(root);
        assertEquals(5, typeState.getKnownTypes().size() - start);

        assertNotNull(typeState.getType(ReflectTypeUtils.getTypeName(ListSetMapType.class)));
        assertNotNull(typeState.getType("java.util.Map<java.lang.String,java.util.List<java.lang.String>>"));
        assertNotNull(typeState.getType(ReflectTypeUtils.getTypeName(String.class)));

        assertEquals(typeState.getType(ReflectTypeUtils.getTypeName(ListSetMapType.class)), root);
        assertTrue(root instanceof ObjectTypeDefinition);
        ObjectTypeDefinition otd = (ObjectTypeDefinition) root;

        assertTrue(otd.getFields().containsKey("complicated"));

        FieldDefinition complicatedField = otd.getFields().get("complicated");
        assertTrue(complicatedField.getTypeDefinition() instanceof MapTypeDefinition);

        assertNotNull(complicatedField);
        assertEquals(2, complicatedField.getArrayTypes().size());
        assertEquals(List.class.getName(), complicatedField.getArrayTypes().get(0).getTypeName());
        assertEquals(Set.class.getName(), complicatedField.getArrayTypes().get(1).getTypeName());

        assertTrue(complicatedField.getTypeDefinition() instanceof MapTypeDefinition);
        FieldDefinition complicatedValueField = ((MapTypeDefinition) complicatedField.getTypeDefinition()).getValueFieldDefinition();
        assertEquals(1, complicatedValueField.getDimensions());
        assertEquals(complicatedField.getArrayTypes().get(0), complicatedValueField.getArrayTypes().get(0));
    }

    public void testNestedMapType() throws Exception {

        ReflectTypeState typeState = new ReflectTypeState();
        TypeDefinition root = ReflectTypeUtils.getTypeDefinition(NestedMapType.class, typeState, false);

        assertNotNull(root);

        assertTrue(root instanceof ObjectReflectTypeDefinition);
        ObjectReflectTypeDefinition ortd = (ObjectReflectTypeDefinition) root;

        assertTrue(ortd.getFields().containsKey("mapMapListString"));
        FieldDefinition fd = ortd.getFields().get("mapMapListString");

        assertTrue(fd.getTypeDefinition() instanceof MapReflectTypeDefinition);
        MapReflectTypeDefinition mrtd = (MapReflectTypeDefinition) fd.getTypeDefinition();

        assertTrue(mrtd.getKeyFieldDefinition().getTypeDefinition() instanceof PrimitiveReflectTypeDefinition);
        assertEquals("java.lang.String", mrtd.getKeyFieldDefinition().getTypeDefinition().getTypeName());
        assertEquals(0, mrtd.getKeyFieldDefinition().getDimensions());

        assertTrue(mrtd.getValueFieldDefinition().getTypeDefinition() instanceof MapReflectTypeDefinition);
        assertEquals(0, mrtd.getValueFieldDefinition().getDimensions());
        mrtd = (MapReflectTypeDefinition) mrtd.getValueFieldDefinition().getTypeDefinition();

        assertTrue(mrtd.getKeyFieldDefinition().getTypeDefinition() instanceof PrimitiveReflectTypeDefinition);
        assertEquals("java.lang.String", mrtd.getKeyFieldDefinition().getTypeDefinition().getTypeName());
        assertEquals(0, mrtd.getKeyFieldDefinition().getDimensions());

        assertTrue(mrtd.getValueFieldDefinition().getTypeDefinition() instanceof PrimitiveReflectTypeDefinition);
        assertEquals("java.lang.String", mrtd.getValueFieldDefinition().getTypeDefinition().getTypeName());
        assertTrue(mrtd.getValueFieldDefinition().getArrayTypes().size() > 0);
    }

    public void testNoGetter() throws Exception {

        TypeState typeState = new ReflectTypeState();
        TypeDefinition root = ReflectTypeUtils.getTypeDefinition(NoGetter.class, typeState, false);
        assertEquals(NoGetter.class.getName(), root.getTypeName());
        assertTrue(root instanceof ObjectTypeDefinition);
        ObjectTypeDefinition otd = (ObjectTypeDefinition) root;

        assertEquals(1, otd.getFields().size());
        assertTrue(otd.getFields().containsKey("foo"));
        assertEquals(String.class.getName(), otd.getFields().get("foo").getTypeDefinition().getTypeName());
    }

    public void testCyclicalType() throws Exception {

        TypeState typeState = new ReflectTypeState();
        TypeDefinition typeDefinition = ReflectTypeUtils.getTypeDefinition(Cyclical.class, typeState, false);
        assertNotNull(typeDefinition);
        assertTrue(typeDefinition instanceof ObjectTypeDefinition);
        ObjectTypeDefinition otd = (ObjectTypeDefinition) typeDefinition;

        assertNotNull(otd.getFields());
        assertEquals(1, otd.getFields().size());
        assertTrue(otd.getFields().containsKey("cyclical"));
        assertEquals(otd, otd.getFields().get("cyclical").getTypeDefinition());
    }

    public void testFieldDefinition_ArrayTypes() throws Exception {

        String arr[][] = new String[1][];

        ReflectTypeState typeState = new ReflectTypeState();
        int start = typeState.getKnownTypes().size();
        FieldDefinition fd = ReflectTypeUtils.getFieldDefinition(arr.getClass(), typeState, false, null);

        assertNotNull(fd);
        assertEquals(2, fd.getDimensions());

        assertEquals(String.class.getName(), fd.getTypeDefinition().getTypeName());
        assertEquals(3, typeState.getKnownTypes().size() - start);
        assertTrue(typeState.getKnownTypes().containsKey(String.class.getName()));
    }

    public void testFieldDefinition_getNull() throws Exception {

        TypeState typeState = new ReflectTypeState();
        FieldDefinition fd = ReflectTypeUtils.getFieldDefinition((Type) null, typeState, false, null);
        assertNotNull(fd);
        assertNull(fd.getTypeDefinition());
    }

    public void testListNoGenerics() throws Exception {

        // not strict, everything should work & we get a null type
        TypeDefinition td = ReflectTypeUtils.getTypeDefinition(NoGenerics.class, new ReflectTypeState(), false);
        assertNotNull(td);
        assertTrue(td instanceof ObjectTypeDefinition);
        ObjectTypeDefinition otd = (ObjectTypeDefinition) td;

        assertTrue(otd.getFields().containsKey("strings"));
        FieldDefinition fd = otd.getFields().get("strings");
        assertNull(fd.getTypeDefinition());

        assertNotNull(fd.getArrayTypes());
        assertEquals(1, fd.getArrayTypes().size());
        assertEquals(List.class.getName(), fd.getArrayTypes().get(0).getTypeName());

        // strict mode, we get an error
        try {
            ReflectTypeUtils.getTypeDefinition(NoGenerics.class, new ReflectTypeState(), true);
            fail("expected exception");
        } catch (WMRuntimeException e) {
            assertEquals(MessageResource.JSON_TYPE_NOGENERICS.getId(), e.getMessageId());
        }
    }

    public void testMapNoGenerics() throws Exception {

        // not strict, everything should work & we get a null type
        TypeDefinition td = ReflectTypeUtils.getTypeDefinition(MapNoGenerics.class, new ReflectTypeState(), false);
        assertNotNull(td);
        assertTrue(td instanceof ObjectTypeDefinition);
        ObjectTypeDefinition otd = (ObjectTypeDefinition) td;

        assertTrue(otd.getFields().containsKey("stringStringMap"));
        FieldDefinition fd = otd.getFields().get("stringStringMap");
        assertNull(fd.getTypeDefinition());

        // strict mode, we get an error
        try {
            ReflectTypeUtils.getTypeDefinition(MapNoGenerics.class, new ReflectTypeState(), true);
            fail("expected exception");
        } catch (WMRuntimeException e) {
            assertEquals(MessageResource.JSON_TYPE_NOGENERICS.getId(), e.getMessageId());
        }
    }

    public void testGetClasses() throws Exception {

        TypeDefinition td = ReflectTypeUtils.getTypeDefinition(WithClasses.class, new ReflectTypeState(), false);
        assertNotNull(td);
        assertTrue(td instanceof ObjectTypeDefinition);
        ObjectTypeDefinition otd = (ObjectTypeDefinition) td;

        assertEquals(3, otd.getFields().size());
        assertEquals(Class.class, ((ReflectTypeDefinition) otd.getFields().get("klassQuestion").getTypeDefinition()).getKlass());
        assertEquals(Class.class, ((ReflectTypeDefinition) otd.getFields().get("klassString").getTypeDefinition()).getKlass());
        assertEquals(Class.class, ((ReflectTypeDefinition) otd.getFields().get("klassNothing").getTypeDefinition()).getKlass());
    }

    public void testGetFieldDefinitionDimensions() throws Exception {

        FieldDefinition fd;

        List<String> foo = new ArrayList<String>();
        fd = ReflectTypeUtils.getFieldDefinition(foo.getClass(), new ReflectTypeState(), false, null);
        assertEquals(1, fd.getDimensions());
        assertNull(fd.getTypeDefinition());

        List<List<String>> foo2 = new ArrayList<List<String>>();
        fd = ReflectTypeUtils.getFieldDefinition(foo2.getClass(), new ReflectTypeState(), false, null);
        assertEquals(1, fd.getDimensions());
        assertNull(fd.getTypeDefinition());
        assertNull(fd.getName());

        Object foo3 = new Object();
        fd = ReflectTypeUtils.getFieldDefinition(foo3.getClass(), new ReflectTypeState(), false, "bar");
        assertEquals(0, fd.getDimensions());
        assertNull(fd.getTypeDefinition());
        assertEquals("bar", fd.getName());
    }

    public void testGetEnumTypeDefinition() throws Exception {

        TypeState typeState = new ReflectTypeState();
        TypeDefinition td = ReflectTypeUtils.getTypeDefinition(ClassWithEnum.class, typeState, false);

        assertTrue(td instanceof ObjectTypeDefinition);
        ObjectTypeDefinition otd = (ObjectTypeDefinition) td;

        assertTrue(otd.getFields().containsKey("days"));
        FieldDefinition fd = otd.getFields().get("days");
        assertTrue(fd.getTypeDefinition() instanceof PrimitiveTypeDefinition);
    }

    // WM-124
    public void testGetArrayParameterType() throws Exception {

        Method m = ArrayParameterTestClass.class.getMethod("getProperties", Object.class, String.class, ClassUtils.forName("java.lang.String[]"));
        assertNotNull(m);

        Type[] types = m.getGenericParameterTypes();
        assertEquals(3, types.length);

        FieldDefinition fd = ReflectTypeUtils.getFieldDefinition(types[2], new ReflectTypeState(), false, "arrProps");
        assertEquals(1, fd.getDimensions());
        assertEquals("java.lang.String", fd.getTypeDefinition().getTypeName());
    }

    public void testGetListArrayParameterType() throws Exception {

        Method m = ArrayParameterTestClass.class.getMethod("getProperties2", Object.class, String.class, List.class);
        assertNotNull(m);

        Type[] types = m.getGenericParameterTypes();
        assertEquals(3, types.length);

        FieldDefinition fd = ReflectTypeUtils.getFieldDefinition(types[2], new ReflectTypeState(), false, "arrProps");
        assertEquals(2, fd.getDimensions());
        assertEquals("java.lang.String", fd.getTypeDefinition().getTypeName());
    }

    public static class BasicTypes {

        private int intval;

        private boolean boolval;

        private Long biglongval;

        public int getIntval() {
            return this.intval;
        }

        public void setIntval(int intval) {
            this.intval = intval;
        }

        public boolean isBoolval() {
            return this.boolval;
        }

        public void setBoolval(boolean boolval) {
            this.boolval = boolval;
        }

        public Long getBiglongval() {
            return this.biglongval;
        }

        public void setBiglongval(Long biglongval) {
            this.biglongval = biglongval;
        }
    }

    public static class BasicListTypes {

        private int[] intvalarray;

        private List<Boolean> boolvallist;

        private Long[][] biglongdoublearray;

        private List<List<Character>> charvallistlist;

        public int[] getIntvalarray() {
            return this.intvalarray;
        }

        public void setIntvalarray(int[] intvalarray) {
            this.intvalarray = intvalarray;
        }

        public List<Boolean> getBoolvallist() {
            return this.boolvallist;
        }

        public void setBoolvallist(List<Boolean> boolvallist) {
            this.boolvallist = boolvallist;
        }

        public void setBiglongdoublearray(Long[][] biglongdoublearray) {
            this.biglongdoublearray = biglongdoublearray;
        }

        public Long[][] getBiglongdoublearray() {
            return this.biglongdoublearray;
        }

        public void setCharvallistlist(List<List<Character>> charvallistlist) {
            this.charvallistlist = charvallistlist;
        }

        public List<List<Character>> getCharvallistlist() {
            return this.charvallistlist;
        }
    }

    public static class BasicMapTypes {

        private Map<String, String> stringStringMap;

        private Properties properties;

        public void setStringStringMap(Map<String, String> stringStringMap) {
            this.stringStringMap = stringStringMap;
        }

        public Map<String, String> getStringStringMap() {
            return this.stringStringMap;
        }

        public void setProperties(Properties properties) {
            this.properties = properties;
        }

        public Properties getProperties() {
            return this.properties;
        }
    }

    public static class ListSetMapType {

        private List<Set<Map<String, List<String>>>> complicated;

        public void setComplicated(List<Set<Map<String, List<String>>>> complicated) {
            this.complicated = complicated;
        }

        public List<Set<Map<String, List<String>>>> getComplicated() {
            return this.complicated;
        }
    }

    public static class MapListType {

        private Map<String, List<List<String>>> mapListString;

        public void setMapListString(Map<String, List<List<String>>> mapListString) {
            this.mapListString = mapListString;
        }

        public Map<String, List<List<String>>> getMapListString() {
            return this.mapListString;
        }
    }

    public static class NestedMapType {

        private Map<String, Map<String, List<String>>> mapMapListString;

        public void setMapMapListString(Map<String, Map<String, List<String>>> mapMapListString) {
            this.mapMapListString = mapMapListString;
        }

        public Map<String, Map<String, List<String>>> getMapMapListString() {
            return this.mapMapListString;
        }
    }

    public static class ArrayNestedInList {

        private List<List<String[]>> listliststringarr;

        public void setListliststringarr(List<List<String[]>> listliststringarr) {
            this.listliststringarr = listliststringarr;
        }

        public List<List<String[]>> getListliststringarr() {
            return this.listliststringarr;
        }
    }

    public static class NoGetter {

        @SuppressWarnings("unused")
        private String foo;

        public void setFoo(String foo) {
            this.foo = foo;
        }
    }

    public static class Cyclical {

        private Cyclical cyclical;

        public void setCyclical(Cyclical cyclical) {
            this.cyclical = cyclical;
        }

        public Cyclical getCyclical() {
            return this.cyclical;
        }
    }

    @SuppressWarnings("unchecked")
    public static class NoGenerics {

        private List strings;

        public void setStrings(List strings) {
            this.strings = strings;
        }

        public List getStrings() {
            return this.strings;
        }
    }

    @SuppressWarnings("unchecked")
    public static class MapNoGenerics {

        private Map stringStringMap;

        public void setStringStringMap(Map stringStringMap) {
            this.stringStringMap = stringStringMap;
        }

        public Map getStringStringMap() {
            return this.stringStringMap;
        }
    }

    @SuppressWarnings("unchecked")
    public static class WithClasses {

        private Class<?> klassQuestion;

        private Class<String> klassString;

        private Class klassNothing;

        public void setKlassQuestion(Class<?> klassQuestion) {
            this.klassQuestion = klassQuestion;
        }

        public Class<?> getKlassQuestion() {
            return this.klassQuestion;
        }

        public void setKlassString(Class<String> klassString) {
            this.klassString = klassString;
        }

        public Class<String> getKlassString() {
            return this.klassString;
        }

        public void setKlassNothing(Class klassNothing) {
            this.klassNothing = klassNothing;
        }

        public Class getKlassNothing() {
            return this.klassNothing;
        }
    }

    // for WM-124
    public static class ArrayParameterTestClass {

        public ArrayList<Object> getProperties(Object session, String stepInstanceId, String[] arrProps) throws Exception {
            return null;
        }

        public ArrayList<Object> getProperties2(Object session, String stepInstanceId, List<String[]> arrProps) throws Exception {
            return null;
        }
    }
}