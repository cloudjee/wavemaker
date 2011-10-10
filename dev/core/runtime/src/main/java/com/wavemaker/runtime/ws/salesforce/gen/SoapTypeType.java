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
 * Java class for soapType.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * <p>
 * 
 * <pre>
 * &lt;simpleType name="soapType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="tns:ID"/>
 *     &lt;enumeration value="xsd:base64Binary"/>
 *     &lt;enumeration value="xsd:boolean"/>
 *     &lt;enumeration value="xsd:double"/>
 *     &lt;enumeration value="xsd:int"/>
 *     &lt;enumeration value="xsd:string"/>
 *     &lt;enumeration value="xsd:date"/>
 *     &lt;enumeration value="xsd:dateTime"/>
 *     &lt;enumeration value="xsd:time"/>
 *     &lt;enumeration value="xsd:anyType"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "soapType", namespace = "urn:partner.soap.sforce.com")
@XmlEnum
public enum SoapTypeType {

    @XmlEnumValue("tns:ID")
    TNS_ID("tns:ID"), @XmlEnumValue("xsd:base64Binary")
    XSD_BASE_64_BINARY("xsd:base64Binary"), @XmlEnumValue("xsd:boolean")
    XSD_BOOLEAN("xsd:boolean"), @XmlEnumValue("xsd:double")
    XSD_DOUBLE("xsd:double"), @XmlEnumValue("xsd:int")
    XSD_INT("xsd:int"), @XmlEnumValue("xsd:string")
    XSD_STRING("xsd:string"), @XmlEnumValue("xsd:date")
    XSD_DATE("xsd:date"), @XmlEnumValue("xsd:dateTime")
    XSD_DATE_TIME("xsd:dateTime"), @XmlEnumValue("xsd:time")
    XSD_TIME("xsd:time"), @XmlEnumValue("xsd:anyType")
    XSD_ANY_TYPE("xsd:anyType");

    private final String value;

    SoapTypeType(String v) {
        this.value = v;
    }

    public String value() {
        return this.value;
    }

    public static SoapTypeType fromValue(String v) {
        for (SoapTypeType c : SoapTypeType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
