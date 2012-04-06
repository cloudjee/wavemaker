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

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

/**
 * <p>
 * Java class for anonymous complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="fieldList" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="sObjectType" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="ids" type="{urn:partner.soap.sforce.com}ID" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = { "fieldList", "sObjectType", "ids" })
@XmlRootElement(name = "retrieve", namespace = "urn:partner.soap.sforce.com")
public class Retrieve {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String fieldList;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String sObjectType;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<String> ids;

    /**
     * Gets the value of the fieldList property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getFieldList() {
        return this.fieldList;
    }

    /**
     * Sets the value of the fieldList property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setFieldList(String value) {
        this.fieldList = value;
    }

    /**
     * Gets the value of the sObjectType property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getSObjectType() {
        return this.sObjectType;
    }

    /**
     * Sets the value of the sObjectType property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setSObjectType(String value) {
        this.sObjectType = value;
    }

    /**
     * Gets the value of the ids property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a snapshot. Therefore any modification you make to
     * the returned list will be present inside the JAXB object. This is why there is not a <CODE>set</CODE> method for
     * the ids property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getIds().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list {@link String }
     * 
     * 
     */
    public List<String> getIds() {
        if (this.ids == null) {
            this.ids = new ArrayList<String>();
        }
        return this.ids;
    }

    /**
     * Sets the value of the ids property.
     * 
     * @param ids allowed object is {@link String }
     * 
     */
    public void setIds(List<String> ids) {
        this.ids = ids;
    }

}
