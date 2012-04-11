/*
 * Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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
 *         &lt;element name="debugLevel" type="{urn:partner.soap.sforce.com}DebugLevel"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = { "debugLevel" })
@XmlRootElement(name = "DebuggingHeader", namespace = "urn:partner.soap.sforce.com")
public class DebuggingHeader {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected DebugLevelType debugLevel;

    /**
     * Gets the value of the debugLevel property.
     * 
     * @return possible object is {@link DebugLevelType }
     * 
     */
    public DebugLevelType getDebugLevel() {
        return this.debugLevel;
    }

    /**
     * Sets the value of the debugLevel property.
     * 
     * @param value allowed object is {@link DebugLevelType }
     * 
     */
    public void setDebugLevel(DebugLevelType value) {
        this.debugLevel = value;
    }

}
