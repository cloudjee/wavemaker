/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
package com.wavemaker.common.util;

import java.io.PrintWriter;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.xml.stream.XMLStreamReader;

import org.apache.commons.lang.StringEscapeUtils;

/**
 * @author Simon Toens
 */
public class XMLUtils {

    public static final String SCOPE_SEP = ".";

    private XMLUtils() {
        throw new UnsupportedOperationException();
    }
    
    public static String escape(String s) {
        return StringEscapeUtils.escapeXml(s);
    }
    
    public static XMLWriter newXMLWriter(PrintWriter pw) {
        XMLWriter rtn = new XMLWriter(pw, 4 /* indent */, 4 /* attrs on line */);
        rtn.setTextOnSameLineAsParentElement(true);
        return rtn;
    }

    public static Map<String, String> attributesToMap(XMLStreamReader reader) {
        return attributesToMap("", reader);
    }

    public static Map<String, String> attributesToMap(String scope,
            XMLStreamReader reader) {
        int numAttrs = reader.getAttributeCount();
        if (numAttrs == 0) {
            return Collections.emptyMap();
        }
        Map<String, String> rtn = new HashMap<String, String>(numAttrs);
        for (int i = 0; i < numAttrs; i++) {
            StringBuilder attrName = new StringBuilder();
            if (scope.length() > 0) {
                attrName.append(scope).append(SCOPE_SEP);
            }
            attrName.append(reader.getAttributeName(i).toString());
            rtn.put(attrName.toString(), reader.getAttributeValue(i));
        }
        return rtn;
    }
}
