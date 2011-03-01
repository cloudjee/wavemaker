/*
 * Copyright (C) 2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Enterprise.
 *  You may not use this file in any manner except through written agreement with WaveMaker Software, Inc.
 *
 */ 


package com.wavemaker.runtime.ws.salesforce.gen;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for DebugLevel.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="DebugLevel">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="None"/>
 *     &lt;enumeration value="DebugOnly"/>
 *     &lt;enumeration value="Db"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "DebugLevel", namespace = "urn:partner.soap.sforce.com")
@XmlEnum
public enum DebugLevelType {

    @XmlEnumValue("None")
    NONE("None"),
    @XmlEnumValue("DebugOnly")
    DEBUG_ONLY("DebugOnly"),
    @XmlEnumValue("Db")
    DB("Db");
    private final String value;

    DebugLevelType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static DebugLevelType fromValue(String v) {
        for (DebugLevelType c: DebugLevelType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
