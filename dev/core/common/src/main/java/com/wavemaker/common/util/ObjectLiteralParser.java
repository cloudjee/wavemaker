/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.common.util;

import java.util.ArrayList;
import java.util.List;

import com.wavemaker.common.WMRuntimeException;

/**
 * Parses an object literal (javascript syntax) into an object graph.
 * 
 * {a:a,b:{c:c},d:d}
 * 
 * To do: Lists [a,b,c] are not supported. The literal "null" is not supported...
 * 
 * ...and replace whole thing with antlr generated parser.
 * 
 * @author Simon Toens
 */
public class ObjectLiteralParser {

    private final ObjectAccess objectAccess = ObjectAccess.getInstance();

    private final Class<?> type;

    private final String literal;

    public ObjectLiteralParser(String literal, String type) {
        this(literal, ClassLoaderUtils.loadClass(type, false));
    }

    public ObjectLiteralParser(String literal, Class<?> type) {
        if (literal == null) {
            throw new IllegalArgumentException("literal cannot be null");
        }

        if (type == null) {
            throw new IllegalArgumentException("type cannot be null");
        }

        this.literal = StringUtils.unquote(literal.trim());
        this.type = type;
    }

    public Object parse() {

        return buildObjectGraph(0, this.type);
    }

    private Object buildObjectGraph(int start, Class<?> type) {

        // hack to support simple lists - no nesting! use antlr instead!
        if (this.literal.charAt(start) == '[') {
            return buildList(start, type);
        }

        Object rtn = this.objectAccess.newInstance(type);

        StringBuilder propertyName = new StringBuilder();
        boolean isPropertyName = true;

        StringBuilder strValue = new StringBuilder();

        Object value = null;

        int i = start + 1;
        int nesting = 0;

        while (i < this.literal.length()) {

            char c = this.literal.charAt(i);

            if (c == '{') {
                if (nesting == 0) {
                    String s = propertyName.toString().trim();
                    Class<?> t = getPropertyType(type, s);
                    value = buildObjectGraph(i, t);
                }
                nesting++;
            } else if (c == '}') {
                if (nesting == 1) {
                    start = i + 1;
                }
                nesting--;
            } else if (c == ':' && nesting == 0) {
                isPropertyName = false;
            } else if (c == ',') {
                // handled below
            } else {
                if (nesting == 0) {
                    if (isPropertyName) {
                        propertyName.append(c);
                    } else {
                        strValue.append(c);
                    }
                }
            }

            boolean done = nesting == -1 && c == '}';

            boolean shouldSetProperty = nesting == 0 && c == ',' || done;

            if (shouldSetProperty) {
                // was this a str value or an 'object' value?
                if (strValue.length() > 0) {
                    if (value != null) {
                        throw new AssertionError("value should be null");
                    }
                    value = strValue.toString().trim();
                }

                String propName = StringUtils.unquote(propertyName.toString().trim());

                if (propName.length() == 0) {
                    // it is an empty instance: {}
                } else {
                    setProperty(rtn, propName, value);
                }

                // reset state
                isPropertyName = true;
                propertyName.delete(0, propertyName.length());
                strValue.delete(0, strValue.length());
                value = null;
            }

            if (done) {
                return rtn;
            }

            i++;
        }
        throw new WMRuntimeException("Mismatched braces in \"" + this.literal + "\"");
    }

    private Class<?> getPropertyType(Class<?> clazz, String propertyName) {

        Class<?> rtn = this.objectAccess.getPropertyType(clazz, propertyName);
        if (rtn == null) {
            throw new WMRuntimeException("\"" + clazz.getName() + "\" does not have a property \"" + propertyName + "\"");
        }
        return rtn;
    }

    private void setProperty(Object o, String propertyName, Object value) {
        if (value instanceof String) {

            String strValue = (String) value;

            strValue = StringUtils.unquote(strValue);

            Class<?> t = getPropertyType(o.getClass(), propertyName);
            value = TypeConversionUtils.fromString(t, strValue);
        }

        this.objectAccess.setProperty(o, propertyName, value);
    }

    private List<Object> buildList(int start, Class<?> type) {

        int i = start;
        if (this.literal.charAt(i) != '[') {
            throw new IllegalArgumentException("List must start with '['");
        }

        int j = this.literal.indexOf("]", i + 1);

        if (j == -1) {
            throw new IllegalArgumentException("List must end with ']'");
        }

        List<Object> rtn = new ArrayList<Object>();
        String s = this.literal.substring(i + 1, j);
        for (String token : s.split(",")) {
            Object o = TypeConversionUtils.fromString(type, token.trim());
            rtn.add(o);
        }
        return rtn;

    }

}
