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
import javax.xml.bind.annotation.XmlType;

/**
 * <p>
 * Java class for DescribeGlobalResult complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DescribeGlobalResult">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="encoding" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="maxBatchSize" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="sobjects" type="{urn:partner.soap.sforce.com}DescribeGlobalSObjectResult" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DescribeGlobalResult", namespace = "urn:partner.soap.sforce.com", propOrder = { "encoding", "maxBatchSize", "sobjects" })
public class DescribeGlobalResultType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String encoding;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected int maxBatchSize;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<DescribeGlobalSObjectResultType> sobjects;

    /**
     * Gets the value of the encoding property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getEncoding() {
        return this.encoding;
    }

    /**
     * Sets the value of the encoding property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setEncoding(String value) {
        this.encoding = value;
    }

    /**
     * Gets the value of the maxBatchSize property.
     * 
     */
    public int getMaxBatchSize() {
        return this.maxBatchSize;
    }

    /**
     * Sets the value of the maxBatchSize property.
     * 
     */
    public void setMaxBatchSize(int value) {
        this.maxBatchSize = value;
    }

    /**
     * Gets the value of the sobjects property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a snapshot. Therefore any modification you make to
     * the returned list will be present inside the JAXB object. This is why there is not a <CODE>set</CODE> method for
     * the sobjects property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getSobjects().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list {@link DescribeGlobalSObjectResultType }
     * 
     * 
     */
    public List<DescribeGlobalSObjectResultType> getSobjects() {
        if (this.sobjects == null) {
            this.sobjects = new ArrayList<DescribeGlobalSObjectResultType>();
        }
        return this.sobjects;
    }

    /**
     * Sets the value of the sobjects property.
     * 
     * @param sobjects allowed object is {@link DescribeGlobalSObjectResultType }
     * 
     */
    public void setSobjects(List<DescribeGlobalSObjectResultType> sobjects) {
        this.sobjects = sobjects;
    }

}
