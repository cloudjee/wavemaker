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

import java.util.Date;

import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.TestJSONSerialization.HasDate;
import com.wavemaker.json.type.reflect.ReflectTypeState;
import com.wavemaker.json.type.reflect.converters.DateTypeDefinition;

/**
 * @author Matt Small
 */
public class TestConversions extends WMTestCase {

    public void testDateToLongSerializer() throws Exception {

        HasDate hd = new HasDate();
        hd.setDate(new java.util.Date(1));
        JSONState jc = new JSONState();

        String s = JSONMarshaller.marshal(hd, jc);
        assertEquals(
            "{\"date\":{\"date\":31,\"day\":3,\"hours\":16,\"minutes\":0,\"month\":11,\"seconds\":0,\"time\":1,\"timezoneOffset\":480,\"year\":69},\"dates\":null,\"foo\":null,\"sqlDate\":null}",
            s);

        jc.setTypeState(new ReflectTypeState());
        jc.getTypeState().addType(new DateTypeDefinition(java.util.Date.class));
        jc.getTypeState().addType(new DateTypeDefinition(java.sql.Date.class));
        s = JSONMarshaller.marshal(hd, jc);
        assertEquals("{\"date\":1,\"dates\":null,\"foo\":null,\"sqlDate\":null}", s);
    }

    public void testListDefaults() throws Exception {

        HasDate hd = new HasDate();
        JSONState jc = new JSONState();

        String s = JSONMarshaller.marshal(hd, jc);
        assertEquals("{\"date\":null,\"dates\":null,\"foo\":null,\"sqlDate\":null}", s);

        // jc.setDefaultSerializerValueConversion(new DefaultSerializerValueConversion());
        s = JSONMarshaller.marshal(hd, jc);
        assertEquals("{\"date\":null,\"dates\":null,\"foo\":null,\"sqlDate\":null}", s);
    }

    public void testNumericDefaults() throws Exception {

        HasNumbers hn = new HasNumbers();
        JSONState jc = new JSONState();

        String s = JSONMarshaller.marshal(hn, jc);
        assertEquals("{\"capitalint\":null,\"regularint\":0}", s);

        // jc.setDefaultSerializerValueConversion(new DefaultSerializerValueConversion());
        s = JSONMarshaller.marshal(hn, jc);
        assertEquals("{\"capitalint\":null,\"regularint\":0}", s);
    }

    public void testLongToDateDeSerializer() throws Exception {

        String jsonString = "{\"date\":1,\"dates\":null,\"foo\":null,\"sqlDate\":null}";
        Object o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o instanceof JSONObject);

        JSONState jc = new JSONState();
        jc.getTypeState().addType(new DateTypeDefinition(Date.class));

        Object op = AlternateJSONTransformer.toObject(jc, o, HasDate.class);
        assertTrue(op instanceof HasDate);
        assertEquals(1, ((HasDate) op).getDate().getTime());
    }

    public void testNegativeLongToDateDeSerializer() throws Exception {

        String jsonString = "{\"date\":-12,\"dates\":null,\"foo\":null,\"sqlDate\":null}";
        Object o = JSONUnmarshaller.unmarshal(jsonString);
        assertTrue(o instanceof JSONObject);

        JSONState jc = new JSONState();
        jc.getTypeState().addType(new DateTypeDefinition(Date.class));

        Object op = AlternateJSONTransformer.toObject(jc, o, HasDate.class);
        assertTrue(op instanceof HasDate);
        assertEquals(-12, ((HasDate) op).getDate().getTime());
    }

    public static class HasNumbers {

        private int regularint;

        private Integer capitalint;

        public int getRegularint() {
            return this.regularint;
        }

        public void setRegularint(int regularint) {
            this.regularint = regularint;
        }

        public Integer getCapitalint() {
            return this.capitalint;
        }

        public void setCapitalint(Integer capitalint) {
            this.capitalint = capitalint;
        }
    }
}