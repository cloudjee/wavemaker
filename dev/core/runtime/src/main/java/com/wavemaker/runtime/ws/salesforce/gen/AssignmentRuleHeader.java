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
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

/**
 * <p>
 * Java class for anonymous complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="assignmentRuleId" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="useDefaultRule" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = { "assignmentRuleId", "useDefaultRule" })
@XmlRootElement(name = "AssignmentRuleHeader", namespace = "urn:partner.soap.sforce.com")
public class AssignmentRuleHeader {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String assignmentRuleId;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, type = Boolean.class, nillable = true)
    protected Boolean useDefaultRule;

    /**
     * Gets the value of the assignmentRuleId property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getAssignmentRuleId() {
        return this.assignmentRuleId;
    }

    /**
     * Sets the value of the assignmentRuleId property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setAssignmentRuleId(String value) {
        this.assignmentRuleId = value;
    }

    /**
     * Gets the value of the useDefaultRule property.
     * 
     * @return possible object is {@link Boolean }
     * 
     */
    public Boolean getUseDefaultRule() {
        return this.useDefaultRule;
    }

    /**
     * Sets the value of the useDefaultRule property.
     * 
     * @param value allowed object is {@link Boolean }
     * 
     */
    public void setUseDefaultRule(Boolean value) {
        this.useDefaultRule = value;
    }

}
