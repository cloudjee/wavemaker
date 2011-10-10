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

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author small
 * @version $Rev$ - $Date$
 */
public class JSONMarshaller_Objects {

    public static class ComplexObject {

        private ObjectWithMap objectWithMap;

        private SimpleObject simpleObject;

        public ObjectWithMap getObjectWithMap() {
            return this.objectWithMap;
        }

        public void setObjectWithMap(ObjectWithMap objectWithMap) {
            this.objectWithMap = objectWithMap;
        }

        public SimpleObject getSimpleObject() {
            return this.simpleObject;
        }

        public void setSimpleObject(SimpleObject simpleObject) {
            this.simpleObject = simpleObject;
        }
    }

    public static class ObjectWithMap {

        private Map<String, Double> stringDoubleMap;

        public Map<String, Double> getStringDoubleMap() {
            return this.stringDoubleMap;
        }

        public void setStringDoubleMap(Map<String, Double> stringDoubleMap) {
            this.stringDoubleMap = stringDoubleMap;
        }
    }

    public static class SimpleObject {

        private String str;

        public String getStr() {
            return this.str;
        }

        public void setStr(String str) {
            this.str = str;
        }
    }

    public static class ObjectWithList {

        private List<String> stringList;

        public List<String> getStringList() {
            return this.stringList;
        }

        public void setStringList(List<String> stringList) {
            this.stringList = stringList;
        }
    }

    public static class ObjectWithArray {

        private String[] stringArray;

        public String[] getStringArray() {
            return this.stringArray;
        }

        public void setStringArray(String[] stringArray) {
            this.stringArray = stringArray;
        }
    }

    public static class ObjectWithClass {

        private Class<?> klass;

        public Class<?> getKlass() {
            return this.klass;
        }

        public void setKlass(Class<?> klass) {
            this.klass = klass;
        }
    }

    public static class ObjectWithTypes {

        private BigDecimal bigDecimal;

        private int intVal;

        private Float floatVal;

        private BigInteger bigInteger;

        private boolean boolVal;

        public BigDecimal getBigDecimal() {
            return this.bigDecimal;
        }

        public void setBigDecimal(BigDecimal bigDecimal) {
            this.bigDecimal = bigDecimal;
        }

        public int getIntVal() {
            return this.intVal;
        }

        public void setIntVal(int intVal) {
            this.intVal = intVal;
        }

        public Float getFloatVal() {
            return this.floatVal;
        }

        public void setFloatVal(Float floatVal) {
            this.floatVal = floatVal;
        }

        public BigInteger getBigInteger() {
            return this.bigInteger;
        }

        public void setBigInteger(BigInteger bigInteger) {
            this.bigInteger = bigInteger;
        }

        public boolean isBoolVal() {
            return this.boolVal;
        }

        public void setBoolVal(boolean boolVal) {
            this.boolVal = boolVal;
        }
    }

    public static class ClassWithEnum {

        public enum DAYS {
            MONDAY, TUESDAY, WEDNESDAY
        };

        private DAYS days;

        public void setDays(DAYS days) {
            this.days = days;
        }

        public DAYS getDays() {
            return this.days;
        }
    }

    public static class ClassWithEnumList {

        private List<ClassWithEnum.DAYS> days;

        public List<ClassWithEnum.DAYS> getDays() {
            return this.days;
        }

        public void setDays(List<ClassWithEnum.DAYS> days) {
            this.days = days;
        }
    }

    public static class ClassWithOverridenEnums {

        public enum MONTHS {

            JANUARY("january"), FEBRUARY("february");

            private final String month;

            MONTHS(String string) {
                this.month = string;
            }

            @Override
            public String toString() {
                return this.month;
            }
        }

        private MONTHS month;

        public MONTHS getMonth() {
            return this.month;
        }

        public void setMonth(MONTHS month) {
            this.month = month;
        }
    }

    public static class ObjectWithRecursiveArray {

        private List<ObjectWithRecursiveArray> list = new ArrayList<ObjectWithRecursiveArray>();

        private String str;

        public List<ObjectWithRecursiveArray> getList() {
            return this.list;
        }

        public void setList(List<ObjectWithRecursiveArray> list) {
            this.list = list;
        }

        public String getStr() {
            return this.str;
        }

        public void setStr(String str) {
            this.str = str;
        }
    }
}