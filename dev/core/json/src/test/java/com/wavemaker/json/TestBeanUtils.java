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

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.beanutils.PropertyUtils;

import com.wavemaker.infra.WMTestCase;

/**
 * Test beanutils access, and provides examples of its use.
 * 
 * @author Matt Small
 */
public class TestBeanUtils extends WMTestCase {

    public void testBasic() throws Exception {

        SampleClass sc = new SampleClass();

        assertEquals(sc.getSingleString(), PropertyUtils.getProperty(sc, "singleString"));
        assertEquals(sc.getStrings().get(1), PropertyUtils.getProperty(sc, "strings[1]"));
    }

    public void testNested() throws Exception {

        SampleNestingClass snc = new SampleNestingClass();
        assertEquals(snc.getSc().getSingleString(), PropertyUtils.getProperty(snc, "sc.singleString"));
        assertEquals(snc.getSc().getStrings().get(1), PropertyUtils.getProperty(snc, "sc.strings[1]"));
    }

    public static class SampleNestingClass {

        public SampleNestingClass() {
            this.sc = new SampleClass();
        }

        private SampleClass sc;

        public SampleClass getSc() {
            return this.sc;
        }

        public void setSc(SampleClass sc) {
            this.sc = sc;
        }
    }

    public static class SampleClass {

        public SampleClass() {

            List<String> l = new ArrayList<String>();
            l.add("a");
            l.add("b");
            l.add("c");
            this.setStrings(l);
            this.setSingleString("foo");
        }

        private List<String> strings;

        private String singleString;

        public List<String> getStrings() {
            return this.strings;
        }

        public void setStrings(List<String> strings) {
            this.strings = strings;
        }

        public String getSingleString() {
            return this.singleString;
        }

        public void setSingleString(String singleString) {
            this.singleString = singleString;
        }
    }
}