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

package com.wavemaker.json;

import static com.wavemaker.json.util.JsonTestUtils.assertJSONStringsEquals;

import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeMap;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;
import com.wavemaker.json.type.reflect.converters.DateTypeDefinition;

/**
 * @author Matt Small
 */
public class TestJSONSerialization extends WMTestCase {

    @Override
    public void setUp() throws Exception {
        SpringUtils.initSpringConfig();
    }

    public void testBasic() throws Exception {

        Product p = new Product();
        p.setDescription("foo");
        p.setPrice(Double.valueOf(12.2));
        p.setId(1);

        HashMap<String, Object> map = new HashMap<String, Object>();
        map.put("returnPart", p);

        String jsonString = JSONMarshaller.marshal(map);

        assertJSONStringsEquals(jsonString, "{\"returnPart\":{\"price\":12.2,\"description\":\"foo\",\"id\":1}}");

        RequestMessageProduct rmp = (RequestMessageProduct) AlternateJSONTransformer.toObject((JSONObject) JSONUnmarshaller.unmarshal(jsonString),
            RequestMessageProduct.class);
        assertTrue(rmp instanceof RequestMessageProduct);
        Product retProd = rmp.getReturnPart();
        assertTrue(retProd instanceof Product);
        assertEquals(retProd.getDescription(), p.getDescription());
        assertEquals(retProd.getPrice(), p.getPrice());
        assertEquals(retProd.getId(), p.getId());
    }

    public void testCapitalPrimivites() throws Exception {

        CapitalPrimitiveObject cp = new CapitalPrimitiveObject();
        cp.setShortVal(Short.valueOf((short) 12));
        cp.setByteVal(Byte.valueOf((byte) 13));

        HashMap<String, Object> map = new HashMap<String, Object>();
        map.put("returnPart", cp);

        String jsonString = JSONMarshaller.marshal(map);

        assertJSONStringsEquals(jsonString, "{\"returnPart\": {\"shortVal\": 12, \"byteVal\": 13}}");

        Object r = AlternateJSONTransformer.toObject((JSONObject) JSONUnmarshaller.unmarshal(jsonString), ReturnCapitablePrimitiveObject.class);
        assertTrue(r instanceof ReturnCapitablePrimitiveObject);
        ReturnCapitablePrimitiveObject rcpo = (ReturnCapitablePrimitiveObject) r;

        CapitalPrimitiveObject cpo = rcpo.getReturnPart();
        assertEquals(Short.valueOf((short) 12), cpo.getShortVal());
        assertEquals(Byte.valueOf((byte) 13), cpo.getByteVal());
    }

    public void testSerializerWithExclusion() throws Exception {

        JSONState jc = new JSONState();

        HasProduct hp = new HasProduct();
        hp.setProdVar(new Product());
        hp.setIntVar(12);

        String full = JSONMarshaller.marshal(hp, jc);
        assertEquals("{\"intVar\":12,\"prodVar\":{\"description\":null,\"id\":0,\"price\":null}}", full);

        jc.getExcludes().add("prodVar");
        String partial = JSONMarshaller.marshal(hp, jc);
        assertEquals("{\"intVar\":12}", partial);
    }

    public void testSerializerWithExclusion_Array() throws Exception {

        JSONState jc = new JSONState();

        HasProduct[] hps = new HasProduct[2];
        hps[0] = new HasProduct();
        hps[0].setProdVar(new Product());
        hps[0].setIntVar(11);
        hps[1] = new HasProduct();
        hps[1].setProdVar(new Product());
        hps[1].setIntVar(12);

        String full = JSONMarshaller.marshal(hps, jc);
        assertEquals(
            "[{\"intVar\":11,\"prodVar\":{\"description\":null,\"id\":0,\"price\":null}},{\"intVar\":12,\"prodVar\":{\"description\":null,\"id\":0,\"price\":null}}]",
            full);

        jc.getExcludes().add("prodVar");

        String partial = JSONMarshaller.marshal(hps, jc);
        assertEquals("[{\"intVar\":11},{\"intVar\":12}]", partial);
    }

    public void testSerializerWithExclusion_List() throws Exception {

        JSONState jc = new JSONState();

        List<HasProduct> hps = new ArrayList<HasProduct>(2);
        HasProduct t1 = new HasProduct();
        t1.setProdVar(new Product());
        t1.setIntVar(11);
        HasProduct t2 = new HasProduct();
        t2.setProdVar(new Product());
        t2.setIntVar(12);
        hps.add(t1);
        hps.add(t2);

        String full = JSONMarshaller.marshal(hps, jc);
        assertEquals(
            "[{\"intVar\":11,\"prodVar\":{\"description\":null,\"id\":0,\"price\":null}},{\"intVar\":12,\"prodVar\":{\"description\":null,\"id\":0,\"price\":null}}]",
            full);

        jc.getExcludes().add("prodVar");

        String partial = JSONMarshaller.marshal(hps, jc);
        assertEquals("[{\"intVar\":11},{\"intVar\":12}]", partial);
    }

    public void testSerializerObjectWithList() throws Exception {

        JSONState jc = new JSONState();

        List<CapitalPrimitiveObject> cpoList = new ArrayList<CapitalPrimitiveObject>();
        cpoList.add(new CapitalPrimitiveObject());
        CapitalPrimitiveObject cpo = new CapitalPrimitiveObject();
        cpo.setByteVal((byte) 12);
        cpoList.add(cpo);

        ProductWithList pwl = new ProductWithList();
        pwl.setCpoList(cpoList);

        String full = JSONMarshaller.marshal(pwl, jc);
        assertEquals(
            "{\"cpoList\":[{\"byteVal\":null,\"shortVal\":null},{\"byteVal\":12,\"shortVal\":null}],\"description\":null,\"id\":0,\"price\":null}",
            full);

        jc.getExcludes().add("cpoList");
        String partial = JSONMarshaller.marshal(pwl, jc);
        assertEquals("{\"description\":null,\"id\":0,\"price\":null}", partial);
    }

    public void testDateToLong() throws Exception {

        JSONState jc = new JSONState();
        jc.getTypeState().addType(new DateTypeDefinition(java.util.Date.class));
        jc.getTypeState().addType(new DateTypeDefinition(java.sql.Date.class));

        long now = System.currentTimeMillis();

        HasDate hd = new HasDate();
        String jsonStr;

        hd.setDate(new Date(now));
        jsonStr = JSONMarshaller.marshal(hd, jc);
        assertEquals("{\"date\":" + now + ",\"dates\":null,\"foo\":null,\"sqlDate\":null}", jsonStr);

        hd.setDates(new Date[] { new Date(now), new Date(now) });
        jsonStr = JSONMarshaller.marshal(hd, jc);
        assertEquals("{\"date\":" + now + ",\"dates\":[" + now + "," + now + "]" + ",\"foo\":null,\"sqlDate\":null}", jsonStr);

        hd.setFoo("bar");
        jsonStr = JSONMarshaller.marshal(hd, jc);
        assertEquals("{\"date\":" + now + ",\"dates\":[" + now + "," + now + "],\"foo\":\"bar\",\"sqlDate\":null}", jsonStr);

        hd.setSqlDate(new java.sql.Date(now));
        jsonStr = JSONMarshaller.marshal(hd, jc);
        assertEquals("{\"date\":" + now + ",\"dates\":[" + now + "," + now + "],\"foo\":\"bar\",\"sqlDate\":" + now + "}", jsonStr);
    }

    public void testListDatesToLongs() throws Exception {

        JSONState jc = new JSONState();
        jc.getTypeState().addType(new DateTypeDefinition(java.sql.Date.class));

        long now = System.currentTimeMillis();
        String jsonStr;

        HasListDates hld = new HasListDates();
        hld.setListDates(new ArrayList<java.sql.Date>());
        hld.getListDates().add(new java.sql.Date(now));
        hld.getListDates().add(new java.sql.Date(now));
        jsonStr = JSONMarshaller.marshal(hld, jc);
        assertEquals("{\"listDates\":[" + now + "," + now + "]}", jsonStr);
    }

    public void testHasCollections() throws Exception {

        HasCollections hsl = new HasCollections();
        hsl.setStringList(Arrays.asList(new String[] { "a", "b" }));

        Set<HasProduct> hpSet = new HashSet<HasProduct>();
        HasProduct hp = new HasProduct();
        hp.setIntVar(12);
        hpSet.add(hp);
        hsl.setHasProductSet(hpSet);

        String jsonString = JSONMarshaller.marshal(hsl);
        assertTrue(jsonString.contains("\"stringList\":[\"a\",\"b\"]"));

        JSONState jc = new JSONState();
        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal(jsonString, jc);
        HasCollections hsl2 = (HasCollections) AlternateJSONTransformer.toObject(jo, HasCollections.class);
        assertEquals(hsl.getStringList().size(), hsl2.getStringList().size());
        for (int i = 0; i < hsl.getStringList().size(); i++) {
            assertEquals(hsl.getStringList().get(i), hsl2.getStringList().get(i));
        }
        assertEquals(hpSet.size(), hsl2.getHasProductSet().size());
        for (HasProduct hpElem : hsl2.getHasProductSet()) {
            assertEquals(12, hpElem.getIntVar());
        }
    }

    public void testCycle() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.FAIL);

        CycleA a = new CycleA();
        CycleB b = new CycleB();
        a.setCycleB(b);
        a.setAString("a");
        b.setCycleA(a);
        b.setBString("b");

        try {
            JSONMarshaller.marshal(a, jc);
            fail("no exception");
        } catch (WMRuntimeException e) {
            assertEquals(MessageResource.JSON_CYCLE_FOUND.getId(), e.getMessageId());
        }

        jc.setCycleHandler(JSONState.CycleHandler.NULL);

        String json = JSONMarshaller.marshal(a, jc);
        CycleA result = (CycleA) AlternateJSONTransformer.toObject((JSONObject) JSONUnmarshaller.unmarshal(json), CycleA.class);
        assertEquals(a.getAString(), result.getAString());
        assertEquals(a.getCycleB().getBString(), result.getCycleB().getBString());
    }

    // MAV-9
    public void testNullArrays() throws Exception {

        JSONState jc = new JSONState();

        ProductWithList pwl = new ProductWithList();
        pwl.setCpoList(null);

        @SuppressWarnings("unused")
        String pwlJson = JSONMarshaller.marshal(pwl, jc);

        HasDate hd = new HasDate();
        hd.setDates(null);

        @SuppressWarnings("unused")
        String hdJson = JSONMarshaller.marshal(hd, jc);

        @SuppressWarnings("unused")
        String json = JSONMarshaller.marshal((String[]) null, jc);
    }

    // MAV-9
    public void testSerializationRoundtrip_NullArrays() throws Exception {

        JSONState jc = new JSONState();

        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal("{\"dates\":null}", jc);
        HasDate hd = (HasDate) AlternateJSONTransformer.toObject(jo, HasDate.class);
        assertEquals(null, hd.getDates());

        String js = JSONMarshaller.marshal(hd);

        JSONObject jo2 = (JSONObject) JSONUnmarshaller.unmarshal(js, jc);
        assertEquals(jo.get("dates"), jo2.get("dates"));
    }

    // MAV-9
    public void testValueProcessor_Primitive() throws Exception {

        try {
            JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal("{\"id\": null}");
            assertNull(jo.get("id"));
            AlternateJSONTransformer.toObject(jo, Product.class);
            fail("expected exception");
        } catch (IllegalArgumentException e) {
            // good
        }
    }

    // MAV-632
    public void testSortOrder() throws Exception {

        TreeMap<String, String> tm = new TreeMap<String, String>();
        tm.put("a", "b");
        tm.put("c", "d");
        tm.put("b", "c");

        String jo = JSONMarshaller.marshal(tm, new JSONState(), true);
        assertEquals("{\"a\":\"b\",\"b\":\"c\",\"c\":\"d\"}", jo);

        HashMap<String, String> hm = new HashMap<String, String>();
        hm.put("a", "b");
        hm.put("c", "d");
        hm.put("b", "c");
        jo = JSONMarshaller.marshal(hm, new JSONState(), true);
        assertEquals("{\"a\":\"b\",\"b\":\"c\",\"c\":\"d\"}", jo);
    }

    // MAV-902
    public void testCyclesRegular() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NULL);

        CycleA a = getCycle();

        String jo = JSONMarshaller.marshal(a, jc);
        assertTrue(jo.contains("\"cycleA\""));
    }

    // MAV-902
    public void testCyclesNew() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NO_PROPERTY);

        CycleA a = getCycle();

        String jo = JSONMarshaller.marshal(a, jc);
        assertFalse(jo.contains("\"cycleA\""));
    }

    // MAV-902
    public void testCycleArray_Lenient() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NULL);

        HasLoopedList a = getLoopedArray();
        String js = JSONMarshaller.marshal(a, jc);
        assertEquals("{\"loopedArray\":[{\"loopedArray\":null,\"loopedList\":null}],\"loopedList\":null}", js);

        JSONObject jop = (JSONObject) JSONUnmarshaller.unmarshal(js);

        JSONArray resja = (JSONArray) jop.get("loopedArray");
        JSONObject resjo = (JSONObject) resja.get(0);
        assertTrue(resjo.containsKey("loopedArray"));
        assertNull(resjo.get("loopedArray"));
    }

    // MAV-902
    public void testCycleArray_NoProperties() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NO_PROPERTY);

        HasLoopedList a = getLoopedArray();
        String js = JSONMarshaller.marshal(a, jc);
        assertEquals("{\"loopedArray\":[{\"loopedList\":null}],\"loopedList\":null}", js);

        JSONObject jop = (JSONObject) JSONUnmarshaller.unmarshal(js);

        JSONArray resja = (JSONArray) jop.get("loopedArray");
        JSONObject resjo = (JSONObject) resja.get(0);
        assertFalse(resjo.containsKey("loopedArray"));
        assertNull(resjo.get("loopedArray"));
    }

    // MAV-902
    public void testCycleList_Lenient() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NULL);

        HasLoopedList a = getLoopedList();
        String js = JSONMarshaller.marshal(a, jc);

        JSONObject jop = (JSONObject) JSONUnmarshaller.unmarshal(js);

        JSONArray resja = (JSONArray) jop.get("loopedList");
        JSONObject resjo = (JSONObject) resja.get(0);
        assertTrue(resjo.containsKey("loopedList"));
    }

    // MAV-902
    public void testCycleList_NoProperties() throws Exception {

        JSONState jc = new JSONState();
        jc.setCycleHandler(JSONState.CycleHandler.NO_PROPERTY);

        HasLoopedList a = getLoopedList();
        String js = JSONMarshaller.marshal(a, jc);

        JSONObject jop = (JSONObject) JSONUnmarshaller.unmarshal(js);

        JSONArray resja = (JSONArray) jop.get("loopedList");
        JSONObject resjo = (JSONObject) resja.get(0);
        assertFalse(resjo.containsKey("loopedList"));
    }

    // MAV-1792
    public void testListOfDates() throws Exception {

        long now = System.currentTimeMillis();
        long now2 = now + 1;

        List<java.sql.Date> dates = new ArrayList<java.sql.Date>();
        dates.add(new java.sql.Date(now));
        dates.add(new java.sql.Date(now2));

        JSONState jc = new JSONState();

        try {
            JSONMarshaller.marshal(dates, jc);
            fail("expected exception");
        } catch (RuntimeException e) {
            // good
        }

        jc.getTypeState().addType(new DateTypeDefinition(java.sql.Date.class));

        Method m = this.getClass().getMethod("getJavaSqlDateList");
        assertNotNull(m);
        FieldDefinition fd = ReflectTypeUtils.getFieldDefinition(m, jc.getTypeState(), false, null);
        String s = JSONMarshaller.marshal(dates, jc, fd, false);
        assertEquals("[" + now + "," + now2 + "]", s);
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

    private static HasLoopedList getLoopedArray() {

        HasLoopedList hll = new HasLoopedList();
        HasLoopedList hll2 = new HasLoopedList();
        HasLoopedList[] hllarr = new HasLoopedList[] { hll2 };

        hll.setLoopedArray(hllarr);
        hll2.setLoopedArray(hllarr);
        return hll;
    }

    private static HasLoopedList getLoopedList() {

        HasLoopedList hll = new HasLoopedList();
        HasLoopedList hll2 = new HasLoopedList();
        List<HasLoopedList> hllarr = new ArrayList<HasLoopedList>();
        hllarr.add(hll2);

        hll.setLoopedList(hllarr);
        hll2.setLoopedList(hllarr);
        return hll;
    }

    public static List<java.sql.Date> getJavaSqlDateList() {
        return null;
    }

    // test classes
    public static class Product implements Serializable {

        private static final long serialVersionUID = 1L;

        private String description;

        private Double price;

        private int id;

        public void setDescription(String s) {
            this.description = s;
        }

        public String getDescription() {
            return this.description;
        }

        public void setPrice(Double d) {
            this.price = d;
        }

        public Double getPrice() {
            return this.price;
        }

        public void setId(int i) {
            this.id = i;
        }

        public int getId() {
            return this.id;
        }

    }

    public static class ProductWithList extends Product {

        private static final long serialVersionUID = 1L;

        private List<CapitalPrimitiveObject> cpoList;

        public List<CapitalPrimitiveObject> getCpoList() {
            return this.cpoList;
        }

        public void setCpoList(List<CapitalPrimitiveObject> cpoList) {
            this.cpoList = cpoList;
        }
    }

    public static class RequestMessageProduct implements Serializable {

        private static final long serialVersionUID = 1L;

        public RequestMessageProduct() {
        }

        private Product returnPart;

        public Product getReturnPart() {
            return this.returnPart;
        }

        public void setReturnPart(Product returnPart) {
            this.returnPart = returnPart;
        }
    }

    public static class CapitalPrimitiveObject implements Serializable {

        private static final long serialVersionUID = 1L;

        public CapitalPrimitiveObject() {
        }

        private Short shortVal;

        public Short getShortVal() {
            return this.shortVal;
        }

        public void setShortVal(Short s) {
            this.shortVal = s;
        }

        private Byte byteVal;

        public Byte getByteVal() {
            return this.byteVal;
        }

        public void setByteVal(Byte v) {
            this.byteVal = v;
        }
    }

    public static class ReturnCapitablePrimitiveObject implements Serializable {

        private static final long serialVersionUID = 1L;

        public ReturnCapitablePrimitiveObject() {
        }

        private CapitalPrimitiveObject returnPart;

        public CapitalPrimitiveObject getReturnPart() {
            return this.returnPart;
        }

        public void setReturnPart(CapitalPrimitiveObject cpo) {
            this.returnPart = cpo;
        }
    }

    public static class HasProduct {

        private int intVar;

        private Product prodVar;

        public int getIntVar() {
            return this.intVar;
        }

        public void setIntVar(int intVar) {
            this.intVar = intVar;
        }

        public Product getProdVar() {
            return this.prodVar;
        }

        public void setProdVar(Product prodVar) {
            this.prodVar = prodVar;
        }
    }

    public static class HasDate {

        private Date date;

        private Date[] dates;

        private String foo;

        private java.sql.Date sqlDate;

        public Date getDate() {
            return this.date;
        }

        public void setDate(Date date) {
            this.date = date;
        }

        public Date[] getDates() {
            return this.dates;
        }

        public void setDates(Date[] dates) {
            this.dates = dates;
        }

        public String getFoo() {
            return this.foo;
        }

        public void setFoo(String foo) {
            this.foo = foo;
        }

        public java.sql.Date getSqlDate() {
            return this.sqlDate;
        }

        public void setSqlDate(java.sql.Date sqlDate) {
            this.sqlDate = sqlDate;
        }
    }

    public static class HasListDates {

        private List<java.sql.Date> listDates;

        public List<java.sql.Date> getListDates() {
            return this.listDates;
        }

        public void setListDates(List<java.sql.Date> listDates) {
            this.listDates = listDates;
        }
    }

    public static class HasCollections {

        private List<String> stringList;

        private Set<HasProduct> hasProductSet;

        public List<String> getStringList() {
            return this.stringList;
        }

        public void setStringList(List<String> stringList) {
            this.stringList = stringList;
        }

        public Set<HasProduct> getHasProductSet() {
            return this.hasProductSet;
        }

        public void setHasProductSet(Set<HasProduct> hasProductSet) {
            this.hasProductSet = hasProductSet;
        }
    }

    public static class CycleA {

        private CycleB cycleB;

        private String aString;

        public CycleB getCycleB() {
            return this.cycleB;
        }

        public void setCycleB(CycleB cycleB) {
            this.cycleB = cycleB;
        }

        public String getAString() {
            return this.aString;
        }

        public void setAString(String string) {
            this.aString = string;
        }
    }

    public static class CycleB {

        private CycleA cycleA;

        private String bString;

        public CycleA getCycleA() {
            return this.cycleA;
        }

        public void setCycleA(CycleA cycleA) {
            this.cycleA = cycleA;
        }

        public String getBString() {
            return this.bString;
        }

        public void setBString(String string) {
            this.bString = string;
        }
    }

    public static class HasLoopedList {

        private HasLoopedList[] loopedArray;

        private List<HasLoopedList> loopedList;

        public HasLoopedList[] getLoopedArray() {
            return this.loopedArray;
        }

        public void setLoopedArray(HasLoopedList[] loopedArray) {
            this.loopedArray = loopedArray;
        }

        public List<HasLoopedList> getLoopedList() {
            return this.loopedList;
        }

        public void setLoopedList(List<HasLoopedList> loopedList) {
            this.loopedList = loopedList;
        }
    }

    public static class HasArray {

        private int[] array;

        private List<List<String>> listListString;

        public int[] getArray() {
            return this.array;
        }

        public void setArray(int[] array) {
            this.array = array;
        }

        @Override
        public String toString() {
            return "HasArray(" + this.array + ")";
        }

        public List<List<String>> getListListString() {
            return this.listListString;
        }

        public void setListListString(List<List<String>> listListString) {
            this.listListString = listListString;
        }
    }
}
