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
 * Java class for ProcessWorkitemRequest complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ProcessWorkitemRequest">
 *   &lt;complexContent>
 *     &lt;extension base="{urn:partner.soap.sforce.com}ProcessRequest">
 *       &lt;sequence>
 *         &lt;element name="action" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="workitemId" type="{urn:partner.soap.sforce.com}ID"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ProcessWorkitemRequest", namespace = "urn:partner.soap.sforce.com", propOrder = { "action", "workitemId" })
public class ProcessWorkitemRequestType extends ProcessRequestType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String action;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String workitemId;

    /**
     * Gets the value of the action property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getAction() {
        return this.action;
    }

    /**
     * Sets the value of the action property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setAction(String value) {
        this.action = value;
    }

    /**
     * Gets the value of the workitemId property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getWorkitemId() {
        return this.workitemId;
    }

    /**
     * Sets the value of the workitemId property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setWorkitemId(String value) {
        this.workitemId = value;
    }

}
