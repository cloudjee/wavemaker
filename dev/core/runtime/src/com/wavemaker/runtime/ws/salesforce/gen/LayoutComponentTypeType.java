
package com.wavemaker.runtime.ws.salesforce.gen;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for layoutComponentType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
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
 * 
 */
@XmlType(name = "layoutComponentType", namespace = "urn:partner.soap.sforce.com")
@XmlEnum
public enum LayoutComponentTypeType {

    @XmlEnumValue("Field")
    FIELD("Field"),
    @XmlEnumValue("Separator")
    SEPARATOR("Separator"),
    @XmlEnumValue("SControl")
    S_CONTROL("SControl"),
    @XmlEnumValue("EmptySpace")
    EMPTY_SPACE("EmptySpace");
    private final String value;

    LayoutComponentTypeType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static LayoutComponentTypeType fromValue(String v) {
        for (LayoutComponentTypeType c: LayoutComponentTypeType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
