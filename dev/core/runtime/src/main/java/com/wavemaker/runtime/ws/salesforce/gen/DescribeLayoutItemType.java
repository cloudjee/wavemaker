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
 * Java class for DescribeLayoutItem complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DescribeLayoutItem">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="editable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="label" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="layoutComponents" type="{urn:partner.soap.sforce.com}DescribeLayoutComponent" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="placeholder" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="required" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DescribeLayoutItem", namespace = "urn:partner.soap.sforce.com", propOrder = { "editable", "label", "layoutComponents",
    "placeholder", "required" })
public class DescribeLayoutItemType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean editable;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String label;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<DescribeLayoutComponentType> layoutComponents;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean placeholder;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean required;

    /**
     * Gets the value of the editable property.
     * 
     */
    public boolean isEditable() {
        return this.editable;
    }

    /**
     * Sets the value of the editable property.
     * 
     */
    public void setEditable(boolean value) {
        this.editable = value;
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
     * Gets the value of the layoutComponents property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a snapshot. Therefore any modification you make to
     * the returned list will be present inside the JAXB object. This is why there is not a <CODE>set</CODE> method for
     * the layoutComponents property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getLayoutComponents().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list {@link DescribeLayoutComponentType }
     * 
     * 
     */
    public List<DescribeLayoutComponentType> getLayoutComponents() {
        if (this.layoutComponents == null) {
            this.layoutComponents = new ArrayList<DescribeLayoutComponentType>();
        }
        return this.layoutComponents;
    }

    /**
     * Gets the value of the placeholder property.
     * 
     */
    public boolean isPlaceholder() {
        return this.placeholder;
    }

    /**
     * Sets the value of the placeholder property.
     * 
     */
    public void setPlaceholder(boolean value) {
        this.placeholder = value;
    }

    /**
     * Gets the value of the required property.
     * 
     */
    public boolean isRequired() {
        return this.required;
    }

    /**
     * Sets the value of the required property.
     * 
     */
    public void setRequired(boolean value) {
        this.required = value;
    }

    /**
     * Sets the value of the layoutComponents property.
     * 
     * @param layoutComponents allowed object is {@link DescribeLayoutComponentType }
     * 
     */
    public void setLayoutComponents(List<DescribeLayoutComponentType> layoutComponents) {
        this.layoutComponents = layoutComponents;
    }

}
