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

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

/**
 * <p>
 * Java class for LeadConvert complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="LeadConvert">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="accountId" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="contactId" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="convertedStatus" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="doNotCreateOpportunity" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="leadId" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="opportunityName" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="overwriteLeadSource" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="ownerId" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="sendNotificationEmail" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "LeadConvert", namespace = "urn:partner.soap.sforce.com", propOrder = { "accountId", "contactId", "convertedStatus",
    "doNotCreateOpportunity", "leadId", "opportunityName", "overwriteLeadSource", "ownerId", "sendNotificationEmail" })
public class LeadConvertType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String accountId;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String contactId;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String convertedStatus;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean doNotCreateOpportunity;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String leadId;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String opportunityName;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean overwriteLeadSource;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String ownerId;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean sendNotificationEmail;

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
     * Gets the value of the convertedStatus property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getConvertedStatus() {
        return this.convertedStatus;
    }

    /**
     * Sets the value of the convertedStatus property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setConvertedStatus(String value) {
        this.convertedStatus = value;
    }

    /**
     * Gets the value of the doNotCreateOpportunity property.
     * 
     */
    public boolean isDoNotCreateOpportunity() {
        return this.doNotCreateOpportunity;
    }

    /**
     * Sets the value of the doNotCreateOpportunity property.
     * 
     */
    public void setDoNotCreateOpportunity(boolean value) {
        this.doNotCreateOpportunity = value;
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
     * Gets the value of the opportunityName property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getOpportunityName() {
        return this.opportunityName;
    }

    /**
     * Sets the value of the opportunityName property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setOpportunityName(String value) {
        this.opportunityName = value;
    }

    /**
     * Gets the value of the overwriteLeadSource property.
     * 
     */
    public boolean isOverwriteLeadSource() {
        return this.overwriteLeadSource;
    }

    /**
     * Sets the value of the overwriteLeadSource property.
     * 
     */
    public void setOverwriteLeadSource(boolean value) {
        this.overwriteLeadSource = value;
    }

    /**
     * Gets the value of the ownerId property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getOwnerId() {
        return this.ownerId;
    }

    /**
     * Sets the value of the ownerId property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setOwnerId(String value) {
        this.ownerId = value;
    }

    /**
     * Gets the value of the sendNotificationEmail property.
     * 
     */
    public boolean isSendNotificationEmail() {
        return this.sendNotificationEmail;
    }

    /**
     * Sets the value of the sendNotificationEmail property.
     * 
     */
    public void setSendNotificationEmail(boolean value) {
        this.sendNotificationEmail = value;
    }

}
