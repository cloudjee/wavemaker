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

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

/**
 * <p>
 * Java class for PicklistForRecordType complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="PicklistForRecordType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="picklistName" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="picklistValues" type="{urn:partner.soap.sforce.com}PicklistEntry" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "PicklistForRecordType", namespace = "urn:partner.soap.sforce.com", propOrder = { "picklistName", "picklistValues" })
public class PicklistForRecordTypeType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String picklistName;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", nillable = true)
    protected List<PicklistEntryType> picklistValues;

    /**
     * Gets the value of the picklistName property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getPicklistName() {
        return this.picklistName;
    }

    /**
     * Sets the value of the picklistName property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setPicklistName(String value) {
        this.picklistName = value;
    }

    /**
     * Gets the value of the picklistValues property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a snapshot. Therefore any modification you make to
     * the returned list will be present inside the JAXB object. This is why there is not a <CODE>set</CODE> method for
     * the picklistValues property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getPicklistValues().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list {@link PicklistEntryType }
     * 
     * 
     */
    public List<PicklistEntryType> getPicklistValues() {
        if (this.picklistValues == null) {
            this.picklistValues = new ArrayList<PicklistEntryType>();
        }
        return this.picklistValues;
    }

    /**
     * Sets the value of the picklistValues property.
     * 
     * @param picklistValues allowed object is {@link PicklistEntryType }
     * 
     */
    public void setPicklistValues(List<PicklistEntryType> picklistValues) {
        this.picklistValues = picklistValues;
    }

}
