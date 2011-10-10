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
 *         &lt;element name="transferToUserId" type="{urn:partner.soap.sforce.com}ID"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = { "transferToUserId" })
@XmlRootElement(name = "UserTerritoryDeleteHeader", namespace = "urn:partner.soap.sforce.com")
public class UserTerritoryDeleteHeader {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String transferToUserId;

    /**
     * Gets the value of the transferToUserId property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getTransferToUserId() {
        return this.transferToUserId;
    }

    /**
     * Sets the value of the transferToUserId property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setTransferToUserId(String value) {
        this.transferToUserId = value;
    }

}
