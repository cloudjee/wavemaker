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
 * Java class for DescribeTabSetResult complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DescribeTabSetResult">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="label" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="logoUrl" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="namespace" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="selected" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="tabs" type="{urn:partner.soap.sforce.com}DescribeTab" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DescribeTabSetResult", namespace = "urn:partner.soap.sforce.com", propOrder = { "label", "logoUrl", "namespace", "selected", "tabs" })
public class DescribeTabSetResultType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String label;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String logoUrl;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected String namespace;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean selected;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<DescribeTabType> tabs;

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
     * Gets the value of the logoUrl property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getLogoUrl() {
        return this.logoUrl;
    }

    /**
     * Sets the value of the logoUrl property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setLogoUrl(String value) {
        this.logoUrl = value;
    }

    /**
     * Gets the value of the namespace property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getNamespace() {
        return this.namespace;
    }

    /**
     * Sets the value of the namespace property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setNamespace(String value) {
        this.namespace = value;
    }

    /**
     * Gets the value of the selected property.
     * 
     */
    public boolean isSelected() {
        return this.selected;
    }

    /**
     * Sets the value of the selected property.
     * 
     */
    public void setSelected(boolean value) {
        this.selected = value;
    }

    /**
     * Gets the value of the tabs property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a snapshot. Therefore any modification you make to
     * the returned list will be present inside the JAXB object. This is why there is not a <CODE>set</CODE> method for
     * the tabs property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getTabs().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list {@link DescribeTabType }
     * 
     * 
     */
    public List<DescribeTabType> getTabs() {
        if (this.tabs == null) {
            this.tabs = new ArrayList<DescribeTabType>();
        }
        return this.tabs;
    }

    /**
     * Sets the value of the tabs property.
     * 
     * @param tabs allowed object is {@link DescribeTabType }
     * 
     */
    public void setTabs(List<DescribeTabType> tabs) {
        this.tabs = tabs;
    }

}
