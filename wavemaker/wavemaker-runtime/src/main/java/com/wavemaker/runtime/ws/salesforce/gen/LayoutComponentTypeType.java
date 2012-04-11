/*
 * Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.ws.salesforce.gen;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;

/**
 * <p>
 * Java class for layoutComponentType.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * <p>
 * 
 * <pre>
 * &lt;simpleType name="layoutComponentType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="Field"/>
 *     &lt;enumeration value="Separator"/>
 *     &lt;enumeration value="SControl"/>
 *     &lt;enumeration value="EmptySpace"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 */
@XmlType(name = "layoutComponentType", namespace = "urn:partner.soap.sforce.com")
@XmlEnum
public enum LayoutComponentTypeType {

    @XmlEnumValue("Field")
    FIELD("Field"), @XmlEnumValue("Separator")
    SEPARATOR("Separator"), @XmlEnumValue("SControl")
    S_CONTROL("SControl"), @XmlEnumValue("EmptySpace")
    EMPTY_SPACE("EmptySpace");

    private final String value;

    LayoutComponentTypeType(String v) {
        this.value = v;
    }

    public String value() {
        return this.value;
    }

    public static LayoutComponentTypeType fromValue(String v) {
        for (LayoutComponentTypeType c : LayoutComponentTypeType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
