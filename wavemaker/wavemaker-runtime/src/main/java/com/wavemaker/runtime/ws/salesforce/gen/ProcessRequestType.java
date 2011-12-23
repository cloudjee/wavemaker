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
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

/**
 * <p>
 * Java class for ProcessRequest complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ProcessRequest">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="comments" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="nextApproverIds" type="{urn:partner.soap.sforce.com}ID" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ProcessRequest", namespace = "urn:partner.soap.sforce.com", propOrder = { "comments", "nextApproverIds" })
@XmlSeeAlso({ ProcessWorkitemRequestType.class, ProcessSubmitRequestType.class })
public class ProcessRequestType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String comments;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", nillable = true)
    protected List<String> nextApproverIds;

    /**
     * Gets the value of the comments property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getComments() {
        return this.comments;
    }

    /**
     * Sets the value of the comments property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setComments(String value) {
        this.comments = value;
    }

    /**
     * Gets the value of the nextApproverIds property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a snapshot. Therefore any modification you make to
     * the returned list will be present inside the JAXB object. This is why there is not a <CODE>set</CODE> method for
     * the nextApproverIds property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getNextApproverIds().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list {@link String }
     * 
     * 
     */
    public List<String> getNextApproverIds() {
        if (this.nextApproverIds == null) {
            this.nextApproverIds = new ArrayList<String>();
        }
        return this.nextApproverIds;
    }

    /**
     * Sets the value of the nextApproverIds property.
     * 
     * @param nextApproverIds allowed object is {@link String }
     * 
     */
    public void setNextApproverIds(List<String> nextApproverIds) {
        this.nextApproverIds = nextApproverIds;
    }

}
