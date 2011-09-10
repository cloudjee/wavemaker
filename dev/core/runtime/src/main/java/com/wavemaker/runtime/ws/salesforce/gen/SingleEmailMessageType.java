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
 * <p>Java class for SingleEmailMessage complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="SingleEmailMessage">
 *   &lt;complexContent>
 *     &lt;extension base="{urn:partner.soap.sforce.com}Email">
 *       &lt;sequence>
 *         &lt;element name="bccAddresses" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="25" minOccurs="0"/>
 *         &lt;element name="ccAddresses" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="25" minOccurs="0"/>
 *         &lt;element name="charset" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="documentAttachments" type="{urn:partner.soap.sforce.com}ID" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="htmlBody" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="inReplyTo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="fileAttachments" type="{urn:partner.soap.sforce.com}EmailFileAttachment" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="orgWideEmailAddressId" type="{urn:partner.soap.sforce.com}ID" minOccurs="0"/>
 *         &lt;element name="plainTextBody" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="references" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="targetObjectId" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="templateId" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="toAddresses" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="100" minOccurs="0"/>
 *         &lt;element name="whatId" type="{urn:partner.soap.sforce.com}ID"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "SingleEmailMessage", namespace = "urn:partner.soap.sforce.com", propOrder = {
    "bccAddresses",
    "ccAddresses",
    "charset",
    "documentAttachments",
    "htmlBody",
    "inReplyTo",
    "fileAttachments",
    "orgWideEmailAddressId",
    "plainTextBody",
    "references",
    "targetObjectId",
    "templateId",
    "toAddresses",
    "whatId"
})
public class SingleEmailMessageType
    extends EmailType
{

    @XmlElement(namespace = "urn:partner.soap.sforce.com", nillable = true)
    protected List<String> bccAddresses;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", nillable = true)
    protected List<String> ccAddresses;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String charset;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<String> documentAttachments;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String htmlBody;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", nillable = true)
    protected String inReplyTo;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<EmailFileAttachmentType> fileAttachments;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", nillable = true)
    protected String orgWideEmailAddressId;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String plainTextBody;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", nillable = true)
    protected String references;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String targetObjectId;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String templateId;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", nillable = true)
    protected List<String> toAddresses;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String whatId;

    /**
     * Gets the value of the bccAddresses property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the bccAddresses property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getBccAddresses().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getBccAddresses() {
        if (bccAddresses == null) {
            bccAddresses = new ArrayList<String>();
        }
        return this.bccAddresses;
    }

    /**
     * Gets the value of the ccAddresses property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the ccAddresses property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getCcAddresses().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getCcAddresses() {
        if (ccAddresses == null) {
            ccAddresses = new ArrayList<String>();
        }
        return this.ccAddresses;
    }

    /**
     * Gets the value of the charset property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCharset() {
        return charset;
    }

    /**
     * Sets the value of the charset property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCharset(String value) {
        this.charset = value;
    }

    /**
     * Gets the value of the documentAttachments property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the documentAttachments property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getDocumentAttachments().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getDocumentAttachments() {
        if (documentAttachments == null) {
            documentAttachments = new ArrayList<String>();
        }
        return this.documentAttachments;
    }

    /**
     * Gets the value of the htmlBody property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getHtmlBody() {
        return htmlBody;
    }

    /**
     * Sets the value of the htmlBody property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setHtmlBody(String value) {
        this.htmlBody = value;
    }

    /**
     * Gets the value of the inReplyTo property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getInReplyTo() {
        return inReplyTo;
    }

    /**
     * Sets the value of the inReplyTo property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setInReplyTo(String value) {
        this.inReplyTo = value;
    }

    /**
     * Gets the value of the fileAttachments property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the fileAttachments property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getFileAttachments().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link EmailFileAttachmentType }
     * 
     * 
     */
    public List<EmailFileAttachmentType> getFileAttachments() {
        if (fileAttachments == null) {
            fileAttachments = new ArrayList<EmailFileAttachmentType>();
        }
        return this.fileAttachments;
    }

    /**
     * Gets the value of the orgWideEmailAddressId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getOrgWideEmailAddressId() {
        return orgWideEmailAddressId;
    }

    /**
     * Sets the value of the orgWideEmailAddressId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setOrgWideEmailAddressId(String value) {
        this.orgWideEmailAddressId = value;
    }

    /**
     * Gets the value of the plainTextBody property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPlainTextBody() {
        return plainTextBody;
    }

    /**
     * Sets the value of the plainTextBody property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPlainTextBody(String value) {
        this.plainTextBody = value;
    }

    /**
     * Gets the value of the references property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getReferences() {
        return references;
    }

    /**
     * Sets the value of the references property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReferences(String value) {
        this.references = value;
    }

    /**
     * Gets the value of the targetObjectId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTargetObjectId() {
        return targetObjectId;
    }

    /**
     * Sets the value of the targetObjectId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTargetObjectId(String value) {
        this.targetObjectId = value;
    }

    /**
     * Gets the value of the templateId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTemplateId() {
        return templateId;
    }

    /**
     * Sets the value of the templateId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTemplateId(String value) {
        this.templateId = value;
    }

    /**
     * Gets the value of the toAddresses property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the toAddresses property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getToAddresses().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getToAddresses() {
        if (toAddresses == null) {
            toAddresses = new ArrayList<String>();
        }
        return this.toAddresses;
    }

    /**
     * Gets the value of the whatId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getWhatId() {
        return whatId;
    }

    /**
     * Sets the value of the whatId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setWhatId(String value) {
        this.whatId = value;
    }

    /**
     * Sets the value of the bccAddresses property.
     * 
     * @param bccAddresses
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBccAddresses(List<String> bccAddresses) {
        this.bccAddresses = bccAddresses;
    }

    /**
     * Sets the value of the ccAddresses property.
     * 
     * @param ccAddresses
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCcAddresses(List<String> ccAddresses) {
        this.ccAddresses = ccAddresses;
    }

    /**
     * Sets the value of the documentAttachments property.
     * 
     * @param documentAttachments
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDocumentAttachments(List<String> documentAttachments) {
        this.documentAttachments = documentAttachments;
    }

    /**
     * Sets the value of the fileAttachments property.
     * 
     * @param fileAttachments
     *     allowed object is
     *     {@link EmailFileAttachmentType }
     *     
     */
    public void setFileAttachments(List<EmailFileAttachmentType> fileAttachments) {
        this.fileAttachments = fileAttachments;
    }

    /**
     * Sets the value of the toAddresses property.
     * 
     * @param toAddresses
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setToAddresses(List<String> toAddresses) {
        this.toAddresses = toAddresses;
    }

}
