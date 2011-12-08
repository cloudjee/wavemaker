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
 * Java class for EmailFileAttachment complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="EmailFileAttachment">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="body" type="{http://www.w3.org/2001/XMLSchema}base64Binary" minOccurs="0"/>
 *         &lt;element name="contentType" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="fileName" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="inline" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "EmailFileAttachment", namespace = "urn:partner.soap.sforce.com", propOrder = { "body", "contentType", "fileName", "inline" })
public class EmailFileAttachmentType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", nillable = true)
    protected byte[] body;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", nillable = true)
    protected String contentType;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String fileName;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected Boolean inline;

    /**
     * Gets the value of the body property.
     * 
     * @return possible object is byte[]
     */
    public byte[] getBody() {
        return this.body;
    }

    /**
     * Sets the value of the body property.
     * 
     * @param value allowed object is byte[]
     */
    public void setBody(byte[] value) {
        this.body = value;
    }

    /**
     * Gets the value of the contentType property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getContentType() {
        return this.contentType;
    }

    /**
     * Sets the value of the contentType property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setContentType(String value) {
        this.contentType = value;
    }

    /**
     * Gets the value of the fileName property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getFileName() {
        return this.fileName;
    }

    /**
     * Sets the value of the fileName property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setFileName(String value) {
        this.fileName = value;
    }

    /**
     * Gets the value of the inline property.
     * 
     * @return possible object is {@link Boolean }
     * 
     */
    public Boolean getInline() {
        return this.inline;
    }

    /**
     * Sets the value of the inline property.
     * 
     * @param value allowed object is {@link Boolean }
     * 
     */
    public void setInline(Boolean value) {
        this.inline = value;
    }

}
