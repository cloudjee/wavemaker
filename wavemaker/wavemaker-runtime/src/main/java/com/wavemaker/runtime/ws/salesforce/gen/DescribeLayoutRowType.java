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
 * Java class for DescribeLayoutRow complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DescribeLayoutRow">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="layoutItems" type="{urn:partner.soap.sforce.com}DescribeLayoutItem" maxOccurs="unbounded"/>
 *         &lt;element name="numItems" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DescribeLayoutRow", namespace = "urn:partner.soap.sforce.com", propOrder = { "layoutItems", "numItems" })
public class DescribeLayoutRowType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected List<DescribeLayoutItemType> layoutItems;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected int numItems;

    /**
     * Gets the value of the layoutItems property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a snapshot. Therefore any modification you make to
     * the returned list will be present inside the JAXB object. This is why there is not a <CODE>set</CODE> method for
     * the layoutItems property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getLayoutItems().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list {@link DescribeLayoutItemType }
     * 
     * 
     */
    public List<DescribeLayoutItemType> getLayoutItems() {
        if (this.layoutItems == null) {
            this.layoutItems = new ArrayList<DescribeLayoutItemType>();
        }
        return this.layoutItems;
    }

    /**
     * Gets the value of the numItems property.
     * 
     */
    public int getNumItems() {
        return this.numItems;
    }

    /**
     * Sets the value of the numItems property.
     * 
     */
    public void setNumItems(int value) {
        this.numItems = value;
    }

    /**
     * Sets the value of the layoutItems property.
     * 
     * @param layoutItems allowed object is {@link DescribeLayoutItemType }
     * 
     */
    public void setLayoutItems(List<DescribeLayoutItemType> layoutItems) {
        this.layoutItems = layoutItems;
    }

}
