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
 *         &lt;element name="userId" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="password" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = { "userId", "password" })
@XmlRootElement(name = "setPassword", namespace = "urn:partner.soap.sforce.com")
public class SetPassword {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String userId;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String password;

    /**
     * Gets the value of the userId property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getUserId() {
        return this.userId;
    }

    /**
     * Sets the value of the userId property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setUserId(String value) {
        this.userId = value;
    }

    /**
     * Gets the value of the password property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getPassword() {
        return this.password;
    }

    /**
     * Sets the value of the password property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setPassword(String value) {
        this.password = value;
    }

}
