/*
 * Copyright (C) 2011 VMWare, Inc. All rights reserved.
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
 * Java class for fieldType.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * <p>
 * 
 * <pre>
 * &lt;simpleType name="fieldType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="string"/>
 *     &lt;enumeration value="picklist"/>
 *     &lt;enumeration value="multipicklist"/>
 *     &lt;enumeration value="combobox"/>
 *     &lt;enumeration value="reference"/>
 *     &lt;enumeration value="base64"/>
 *     &lt;enumeration value="boolean"/>
 *     &lt;enumeration value="currency"/>
 *     &lt;enumeration value="textarea"/>
 *     &lt;enumeration value="int"/>
 *     &lt;enumeration value="double"/>
 *     &lt;enumeration value="percent"/>
 *     &lt;enumeration value="phone"/>
 *     &lt;enumeration value="id"/>
 *     &lt;enumeration value="date"/>
 *     &lt;enumeration value="datetime"/>
 *     &lt;enumeration value="time"/>
 *     &lt;enumeration value="url"/>
 *     &lt;enumeration value="email"/>
 *     &lt;enumeration value="encryptedstring"/>
 *     &lt;enumeration value="anyType"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "fieldType", namespace = "urn:partner.soap.sforce.com")
@XmlEnum
public enum FieldTypeType {

    @XmlEnumValue("string")
    STRING("string"), @XmlEnumValue("picklist")
    PICKLIST("picklist"), @XmlEnumValue("multipicklist")
    MULTIPICKLIST("multipicklist"), @XmlEnumValue("combobox")
    COMBOBOX("combobox"), @XmlEnumValue("reference")
    REFERENCE("reference"), @XmlEnumValue("base64")
    BASE_64("base64"), @XmlEnumValue("boolean")
    BOOLEAN("boolean"), @XmlEnumValue("currency")
    CURRENCY("currency"), @XmlEnumValue("textarea")
    TEXTAREA("textarea"), @XmlEnumValue("int")
    INT("int"), @XmlEnumValue("double")
    DOUBLE("double"), @XmlEnumValue("percent")
    PERCENT("percent"), @XmlEnumValue("phone")
    PHONE("phone"), @XmlEnumValue("id")
    ID("id"), @XmlEnumValue("date")
    DATE("date"), @XmlEnumValue("datetime")
    DATETIME("datetime"), @XmlEnumValue("time")
    TIME("time"), @XmlEnumValue("url")
    URL("url"), @XmlEnumValue("email")
    EMAIL("email"), @XmlEnumValue("encryptedstring")
    ENCRYPTEDSTRING("encryptedstring"), @XmlEnumValue("anyType")
    ANY_TYPE("anyType");

    private final String value;

    FieldTypeType(String v) {
        this.value = v;
    }

    public String value() {
        return this.value;
    }

    public static FieldTypeType fromValue(String v) {
        for (FieldTypeType c : FieldTypeType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
