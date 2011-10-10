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
 * Java class for DescribeTab complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DescribeTab">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="custom" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="iconUrl" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="label" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="miniIconUrl" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="sobjectName" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="url" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DescribeTab", namespace = "urn:partner.soap.sforce.com", propOrder = { "custom", "iconUrl", "label", "miniIconUrl", "sobjectName",
    "url" })
public class DescribeTabType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean custom;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String iconUrl;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String label;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String miniIconUrl;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String sobjectName;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String url;

    /**
     * Gets the value of the custom property.
     * 
     */
    public boolean isCustom() {
        return this.custom;
    }

    /**
     * Sets the value of the custom property.
     * 
     */
    public void setCustom(boolean value) {
        this.custom = value;
    }

    /**
     * Gets the value of the iconUrl property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getIconUrl() {
        return this.iconUrl;
    }

    /**
     * Sets the value of the iconUrl property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setIconUrl(String value) {
        this.iconUrl = value;
    }

    /**
     * Gets the value of the label property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getLabel() {
        return this.label;
    }

    /**
     * Sets the value of the label property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setLabel(String value) {
        this.label = value;
    }

    /**
     * Gets the value of the miniIconUrl property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getMiniIconUrl() {
        return this.miniIconUrl;
    }

    /**
     * Sets the value of the miniIconUrl property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setMiniIconUrl(String value) {
        this.miniIconUrl = value;
    }

    /**
     * Gets the value of the sobjectName property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getSobjectName() {
        return this.sobjectName;
    }

    /**
     * Sets the value of the sobjectName property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setSobjectName(String value) {
        this.sobjectName = value;
    }

    /**
     * Gets the value of the url property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getUrl() {
        return this.url;
    }

    /**
     * Sets the value of the url property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setUrl(String value) {
        this.url = value;
    }

}
