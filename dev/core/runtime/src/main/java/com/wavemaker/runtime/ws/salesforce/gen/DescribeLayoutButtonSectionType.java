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
 * <p>Java class for DescribeLayoutButtonSection complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DescribeLayoutButtonSection">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="detailButtons" type="{urn:partner.soap.sforce.com}DescribeLayoutButton" maxOccurs="unbounded"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DescribeLayoutButtonSection", namespace = "urn:partner.soap.sforce.com", propOrder = {
    "detailButtons"
})
public class DescribeLayoutButtonSectionType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected List<DescribeLayoutButtonType> detailButtons;

    /**
     * Gets the value of the detailButtons property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the detailButtons property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getDetailButtons().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link DescribeLayoutButtonType }
     * 
     * 
     */
    public List<DescribeLayoutButtonType> getDetailButtons() {
        if (detailButtons == null) {
            detailButtons = new ArrayList<DescribeLayoutButtonType>();
        }
        return this.detailButtons;
    }

    /**
     * Sets the value of the detailButtons property.
     * 
     * @param detailButtons
     *     allowed object is
     *     {@link DescribeLayoutButtonType }
     *     
     */
    public void setDetailButtons(List<DescribeLayoutButtonType> detailButtons) {
        this.detailButtons = detailButtons;
    }

}
