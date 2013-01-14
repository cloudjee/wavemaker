/*
 *  Copyright (C) 2007-2013 VMware, Inc. All rights reserved.
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
import javax.xml.bind.annotation.XmlSchemaType;
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
 *         &lt;element name="intercept-url" maxOccurs="unbounded">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;attGroup ref="{http://www.springframework.org/schema/security}intercept-url.attlist"/>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *       &lt;/sequence>
 *       &lt;attGroup ref="{http://www.springframework.org/schema/security}fsmds.attlist"/>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "interceptUrl"
})
@XmlRootElement(name = "filter-invocation-definition-source")
public class FilterInvocationDefinitionSource {

    @XmlElement(name = "intercept-url", required = true)
    protected List<FilterInvocationDefinitionSource.InterceptUrl> interceptUrl;
    @XmlAttribute(name = "use-expressions")
    protected Boolean useExpressions;
    @XmlAttribute
    @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
    @XmlSchemaType(name = "token")
    protected String id;
    @XmlAttribute(name = "lowercase-comparisons")
    protected Boolean lowercaseComparisons;
    @XmlAttribute(name = "path-type")
    @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
    protected String pathType;
    @XmlAttribute(name = "request-matcher")
    @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
    protected String requestMatcher;

    /**
     * Gets the value of the interceptUrl property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the interceptUrl property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getInterceptUrl().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link FilterInvocationDefinitionSource.InterceptUrl }
     * 
     * 
     */
    public List<FilterInvocationDefinitionSource.InterceptUrl> getInterceptUrl() {
        if (interceptUrl == null) {
            interceptUrl = new ArrayList<FilterInvocationDefinitionSource.InterceptUrl>();
        }
        return this.interceptUrl;
    }

    /**
     * Gets the value of the useExpressions property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isUseExpressions() {
        return useExpressions;
    }

    /**
     * Sets the value of the useExpressions property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setUseExpressions(Boolean value) {
        this.useExpressions = value;
    }

    /**
     * Gets the value of the id property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the value of the id property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setId(String value) {
        this.id = value;
    }

    /**
     * Gets the value of the lowercaseComparisons property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isLowercaseComparisons() {
        return lowercaseComparisons;
    }

    /**
     * Sets the value of the lowercaseComparisons property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setLowercaseComparisons(Boolean value) {
        this.lowercaseComparisons = value;
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


    /**
     * <p>Java class for anonymous complex type.
     * 
     * <p>The following schema fragment specifies the expected content contained within this class.
     * 
     * <pre>
     * &lt;complexType>
     *   &lt;complexContent>
     *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *       &lt;attGroup ref="{http://www.springframework.org/schema/security}intercept-url.attlist"/>
     *     &lt;/restriction>
     *   &lt;/complexContent>
     * &lt;/complexType>
     * </pre>
     * 
     * 
     */
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "")
    public static class InterceptUrl {

        @XmlAttribute(required = true)
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        @XmlSchemaType(name = "token")
        protected String pattern;
        @XmlAttribute
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        @XmlSchemaType(name = "token")
        protected String access;
        @XmlAttribute
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        protected String method;
        @XmlAttribute
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        protected String filters;
        @XmlAttribute(name = "requires-channel")
        @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
        @XmlSchemaType(name = "token")
        protected String requiresChannel;

        /**
         * Gets the value of the pattern property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getPattern() {
            return pattern;
        }

        /**
         * Sets the value of the pattern property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setPattern(String value) {
            this.pattern = value;
        }

        /**
         * Gets the value of the access property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getAccess() {
            return access;
        }

        /**
         * Sets the value of the access property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setAccess(String value) {
            this.access = value;
        }

        /**
         * Gets the value of the method property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getMethod() {
            return method;
        }

        /**
         * Sets the value of the method property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setMethod(String value) {
            this.method = value;
        }

        /**
         * Gets the value of the filters property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getFilters() {
            return filters;
        }

        /**
         * Sets the value of the filters property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setFilters(String value) {
            this.filters = value;
        }

        /**
         * Gets the value of the requiresChannel property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getRequiresChannel() {
            return requiresChannel;
        }

        /**
         * Sets the value of the requiresChannel property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setRequiresChannel(String value) {
            this.requiresChannel = value;
        }

    }

}
