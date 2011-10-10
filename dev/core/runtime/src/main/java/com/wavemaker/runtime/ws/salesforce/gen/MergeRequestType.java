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

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

/**
 * <p>
 * Java class for MergeRequest complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="MergeRequest">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="masterRecord" type="{urn:sobject.partner.soap.sforce.com}sObject"/>
 *         &lt;element name="recordToMergeIds" type="{urn:partner.soap.sforce.com}ID" maxOccurs="unbounded"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "MergeRequest", namespace = "urn:partner.soap.sforce.com", propOrder = { "masterRecord", "recordToMergeIds" })
public class MergeRequestType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected SObjectType masterRecord;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected List<String> recordToMergeIds;

    /**
     * Gets the value of the masterRecord property.
     * 
     * @return possible object is {@link SObjectType }
     * 
     */
    public SObjectType getMasterRecord() {
        return this.masterRecord;
    }

    /**
     * Sets the value of the masterRecord property.
     * 
     * @param value allowed object is {@link SObjectType }
     * 
     */
    public void setMasterRecord(SObjectType value) {
        this.masterRecord = value;
    }

    /**
     * Gets the value of the recordToMergeIds property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a snapshot. Therefore any modification you make to
     * the returned list will be present inside the JAXB object. This is why there is not a <CODE>set</CODE> method for
     * the recordToMergeIds property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getRecordToMergeIds().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list {@link String }
     * 
     * 
     */
    public List<String> getRecordToMergeIds() {
        if (this.recordToMergeIds == null) {
            this.recordToMergeIds = new ArrayList<String>();
        }
        return this.recordToMergeIds;
    }

    /**
     * Sets the value of the recordToMergeIds property.
     * 
     * @param recordToMergeIds allowed object is {@link String }
     * 
     */
    public void setRecordToMergeIds(List<String> recordToMergeIds) {
        this.recordToMergeIds = recordToMergeIds;
    }

}
