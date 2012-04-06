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
 * Java class for LeadConvertResult complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="LeadConvertResult">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="accountId" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="contactId" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="errors" type="{urn:partner.soap.sforce.com}Error" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="leadId" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="opportunityId" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="success" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "LeadConvertResult", namespace = "urn:partner.soap.sforce.com", propOrder = { "accountId", "contactId", "errors", "leadId",
    "opportunityId", "success" })
public class LeadConvertResultType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String accountId;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String contactId;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<ErrorType> errors;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String leadId;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String opportunityId;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean success;

    /**
     * Gets the value of the accountId property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getAccountId() {
        return this.accountId;
    }

    /**
     * Sets the value of the accountId property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setAccountId(String value) {
        this.accountId = value;
    }

    /**
     * Gets the value of the contactId property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getContactId() {
        return this.contactId;
    }

    /**
     * Sets the value of the contactId property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setContactId(String value) {
        this.contactId = value;
    }

    /**
     * Gets the value of the errors property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a snapshot. Therefore any modification you make to
     * the returned list will be present inside the JAXB object. This is why there is not a <CODE>set</CODE> method for
     * the errors property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getErrors().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list {@link ErrorType }
     * 
     * 
     */
    public List<ErrorType> getErrors() {
        if (this.errors == null) {
            this.errors = new ArrayList<ErrorType>();
        }
        return this.errors;
    }

    /**
     * Gets the value of the leadId property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getLeadId() {
        return this.leadId;
    }

    /**
     * Sets the value of the leadId property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setLeadId(String value) {
        this.leadId = value;
    }

    /**
     * Gets the value of the opportunityId property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getOpportunityId() {
        return this.opportunityId;
    }

    /**
     * Sets the value of the opportunityId property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setOpportunityId(String value) {
        this.opportunityId = value;
    }

    /**
     * Gets the value of the success property.
     * 
     */
    public boolean isSuccess() {
        return this.success;
    }

    /**
     * Sets the value of the success property.
     * 
     */
    public void setSuccess(boolean value) {
        this.success = value;
    }

    /**
     * Sets the value of the errors property.
     * 
     * @param errors allowed object is {@link ErrorType }
     * 
     */
    public void setErrors(List<ErrorType> errors) {
        this.errors = errors;
    }

}
