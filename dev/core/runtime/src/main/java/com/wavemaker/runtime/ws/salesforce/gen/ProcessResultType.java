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
 * <p>Java class for ProcessResult complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ProcessResult">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="actorIds" type="{urn:partner.soap.sforce.com}ID" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="entityId" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="errors" type="{urn:partner.soap.sforce.com}Error" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="instanceId" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="instanceStatus" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="newWorkitemIds" type="{urn:partner.soap.sforce.com}ID" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="success" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ProcessResult", namespace = "urn:partner.soap.sforce.com", propOrder = {
    "actorIds",
    "entityId",
    "errors",
    "instanceId",
    "instanceStatus",
    "newWorkitemIds",
    "success"
})
public class ProcessResultType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<String> actorIds;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String entityId;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<ErrorType> errors;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String instanceId;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String instanceStatus;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", nillable = true)
    protected List<String> newWorkitemIds;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean success;

    /**
     * Gets the value of the actorIds property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the actorIds property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getActorIds().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getActorIds() {
        if (actorIds == null) {
            actorIds = new ArrayList<String>();
        }
        return this.actorIds;
    }

    /**
     * Gets the value of the entityId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEntityId() {
        return entityId;
    }

    /**
     * Sets the value of the entityId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEntityId(String value) {
        this.entityId = value;
    }

    /**
     * Gets the value of the errors property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the errors property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getErrors().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ErrorType }
     * 
     * 
     */
    public List<ErrorType> getErrors() {
        if (errors == null) {
            errors = new ArrayList<ErrorType>();
        }
        return this.errors;
    }

    /**
     * Gets the value of the instanceId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getInstanceId() {
        return instanceId;
    }

    /**
     * Sets the value of the instanceId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setInstanceId(String value) {
        this.instanceId = value;
    }

    /**
     * Gets the value of the instanceStatus property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getInstanceStatus() {
        return instanceStatus;
    }

    /**
     * Sets the value of the instanceStatus property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setInstanceStatus(String value) {
        this.instanceStatus = value;
    }

    /**
     * Gets the value of the newWorkitemIds property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the newWorkitemIds property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getNewWorkitemIds().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getNewWorkitemIds() {
        if (newWorkitemIds == null) {
            newWorkitemIds = new ArrayList<String>();
        }
        return this.newWorkitemIds;
    }

    /**
     * Gets the value of the success property.
     * 
     */
    public boolean isSuccess() {
        return success;
    }

    /**
     * Sets the value of the success property.
     * 
     */
    public void setSuccess(boolean value) {
        this.success = value;
    }

    /**
     * Sets the value of the actorIds property.
     * 
     * @param actorIds
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setActorIds(List<String> actorIds) {
        this.actorIds = actorIds;
    }

    /**
     * Sets the value of the errors property.
     * 
     * @param errors
     *     allowed object is
     *     {@link ErrorType }
     *     
     */
    public void setErrors(List<ErrorType> errors) {
        this.errors = errors;
    }

    /**
     * Sets the value of the newWorkitemIds property.
     * 
     * @param newWorkitemIds
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNewWorkitemIds(List<String> newWorkitemIds) {
        this.newWorkitemIds = newWorkitemIds;
    }

}
