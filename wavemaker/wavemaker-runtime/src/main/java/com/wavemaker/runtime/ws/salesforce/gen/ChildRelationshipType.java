/*
 * Copyright (C) 2011 VMware, Inc. All rights reserved.
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

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

/**
 * <p>
 * Java class for ChildRelationship complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ChildRelationship">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="cascadeDelete" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="childSObject" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="deprecatedAndHidden" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="field" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="relationshipName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ChildRelationship", namespace = "urn:partner.soap.sforce.com", propOrder = { "cascadeDelete", "childSObject", "deprecatedAndHidden",
    "field", "relationshipName" })
public class ChildRelationshipType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean cascadeDelete;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String childSObject;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean deprecatedAndHidden;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String field;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected String relationshipName;

    /**
     * Gets the value of the cascadeDelete property.
     * 
     */
    public boolean isCascadeDelete() {
        return this.cascadeDelete;
    }

    /**
     * Sets the value of the cascadeDelete property.
     * 
     */
    public void setCascadeDelete(boolean value) {
        this.cascadeDelete = value;
    }

    /**
     * Gets the value of the childSObject property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getChildSObject() {
        return this.childSObject;
    }

    /**
     * Sets the value of the childSObject property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setChildSObject(String value) {
        this.childSObject = value;
    }

    /**
     * Gets the value of the deprecatedAndHidden property.
     * 
     */
    public boolean isDeprecatedAndHidden() {
        return this.deprecatedAndHidden;
    }

    /**
     * Sets the value of the deprecatedAndHidden property.
     * 
     */
    public void setDeprecatedAndHidden(boolean value) {
        this.deprecatedAndHidden = value;
    }

    /**
     * Gets the value of the field property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getField() {
        return this.field;
    }

    /**
     * Sets the value of the field property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setField(String value) {
        this.field = value;
    }

    /**
     * Gets the value of the relationshipName property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getRelationshipName() {
        return this.relationshipName;
    }

    /**
     * Sets the value of the relationshipName property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setRelationshipName(String value) {
        this.relationshipName = value;
    }

}
