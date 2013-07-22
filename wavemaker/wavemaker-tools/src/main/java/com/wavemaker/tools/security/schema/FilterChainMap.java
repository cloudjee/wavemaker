/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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


package com.wavemaker.tools.security.schema;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.adapters.CollapsedStringAdapter;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element ref="{http://www.springframework.org/schema/security}filter-chain" maxOccurs="unbounded"/>
 *       &lt;/sequence>
 *       &lt;attGroup ref="{http://www.springframework.org/schema/security}filter-chain-map.attlist"/>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "filterChain"
})
@XmlRootElement(name = "filter-chain-map")
public class FilterChainMap {

    @XmlElement(name = "filter-chain", required = true)
    protected List<FilterChain> filterChain;
    @XmlAttribute(name = "path-type")
    @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
    protected String pathType;
    @XmlAttribute(name = "request-matcher")
    @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
    protected String requestMatcher;

    /**
     * Gets the value of the filterChain property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the filterChain property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getFilterChain().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link FilterChain }
     * 
     * 
     */
    public List<FilterChain> getFilterChain() {
        if (filterChain == null) {
            filterChain = new ArrayList<FilterChain>();
        }
        return this.filterChain;
    }

    /**
     * Gets the value of the pathType property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPathType() {
        return pathType;
    }

    /**
     * Sets the value of the pathType property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPathType(String value) {
        this.pathType = value;
    }

    /**
     * Gets the value of the requestMatcher property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRequestMatcher() {
        return requestMatcher;
    }

    /**
     * Sets the value of the requestMatcher property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRequestMatcher(String value) {
        this.requestMatcher = value;
    }

}
