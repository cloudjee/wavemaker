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

import java.io.IOException;
import java.util.Date;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.type.reflect.converters.DateTypeDefinition;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestJSONThreads extends WMTestCase {

    private static final long DATE = 1201;

    public void testThreads() throws Exception {

        DoUnserializeNoName noname = new DoUnserializeNoName();
        DoUnserializeNoDesc nodesc = new DoUnserializeNoDesc();

        noname.start();
        nodesc.start();

        noname.join();
        nodesc.join();

        assertNull(noname.failed, noname.failed);
        assertNull(nodesc.failed, nodesc.failed);
    }

    public static final String NAME = "foo";

    public static final String DESC = "bar";

    public static abstract class DoUnserialize extends Thread {

        protected abstract String getExclude();

        public String failed = null;

        @Override
        public void run() {

            if (null == getExclude()) {
                throw new RuntimeException("Exclude was null");
            }

            Product p = new Product();
            p.setName(NAME);
            p.setDescription(DESC);
            p.setDate(new Date(DATE));
            assertEquals(DATE, p.getDate().getTime());

            JSONState jc = new JSONState();
            jc.getTypeState().addType(new DateTypeDefinition(Date.class));
            jc.getExcludes().add(getExclude());

            for (int i = 0; i < 50; i++) {

                String serialized;
                try {
                    serialized = JSONMarshaller.marshal(p, jc);
                } catch (IOException e2) {
                    throw new WMRuntimeException(e2);
                }

                if (serialized.contains(getExclude())) {
                    this.failed = "got " + getExclude() + " where not expected: '" + serialized + "'";
                    throw new RuntimeException(this.failed);
                }

                JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal(serialized, jc);

                Object o = AlternateJSONTransformer.toObject(jc, jo, Product.class);
                assertTrue(o instanceof Product);
                Product pp = (Product) o;
                assertEquals(DATE, pp.getDate().getTime());

                try {
                    Thread.sleep(5);
                } catch (InterruptedException e) {
                    System.out.println("interrupted!");
                    Thread.yield();
                }

            }
        }
    }

    public static class DoUnserializeNoName extends DoUnserialize {

        @Override
        protected String getExclude() {
            return "name";
        }
    }

    public static class DoUnserializeNoDesc extends DoUnserialize {

        @Override
        protected String getExclude() {
            return "description";
        }
    }

    public static class Product {

        private String name;

        private String description;

        private Date date;

        public String getName() {
            return this.name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return this.description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Date getDate() {
            return this.date;
        }

        public void setDate(Date date) {
            this.date = date;
        }
    }
}