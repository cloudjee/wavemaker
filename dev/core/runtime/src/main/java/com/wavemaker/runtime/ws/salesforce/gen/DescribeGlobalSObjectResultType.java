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
import javax.xml.bind.annotation.XmlType;

/**
 * <p>
 * Java class for DescribeGlobalSObjectResult complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DescribeGlobalSObjectResult">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="activateable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="createable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="custom" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="customSetting" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="deletable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="deprecatedAndHidden" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="keyPrefix" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="label" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="labelPlural" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="layoutable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="mergeable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="name" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="queryable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="replicateable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="retrieveable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="searchable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="triggerable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="undeletable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="updateable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DescribeGlobalSObjectResult", namespace = "urn:partner.soap.sforce.com", propOrder = { "activateable", "createable", "custom",
    "customSetting", "deletable", "deprecatedAndHidden", "keyPrefix", "label", "labelPlural", "layoutable", "mergeable", "name", "queryable",
    "replicateable", "retrieveable", "searchable", "triggerable", "undeletable", "updateable" })
public class DescribeGlobalSObjectResultType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean activateable;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean createable;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean custom;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean customSetting;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean deletable;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean deprecatedAndHidden;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String keyPrefix;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String label;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String labelPlural;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean layoutable;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean mergeable;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String name;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean queryable;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean replicateable;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean retrieveable;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean searchable;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean triggerable;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean undeletable;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean updateable;

    /**
     * Gets the value of the activateable property.
     * 
     */
    public boolean isActivateable() {
        return this.activateable;
    }

    /**
     * Sets the value of the activateable property.
     * 
     */
    public void setActivateable(boolean value) {
        this.activateable = value;
    }

    /**
     * Gets the value of the createable property.
     * 
     */
    public boolean isCreateable() {
        return this.createable;
    }

    /**
     * Sets the value of the createable property.
     * 
     */
    public void setCreateable(boolean value) {
        this.createable = value;
    }

    /**
     * Gets the value of the custom property.
     * 
     */
    public boolean isCustom() {
        return this.custom;
    }

    /**
     * Sets the value of the custom property.
     * 
     */
    public void setCustom(boolean value) {
        this.custom = value;
    }

    /**
     * Gets the value of the customSetting property.
     * 
     */
    public boolean isCustomSetting() {
        return this.customSetting;
    }

    /**
     * Sets the value of the customSetting property.
     * 
     */
    public void setCustomSetting(boolean value) {
        this.customSetting = value;
    }

    /**
     * Gets the value of the deletable property.
     * 
     */
    public boolean isDeletable() {
        return this.deletable;
    }

    /**
     * Sets the value of the deletable property.
     * 
     */
    public void setDeletable(boolean value) {
        this.deletable = value;
    }

    /**
     * Gets the value of the deprecatedAndHidden property.
     * 
     */
    public boolean isDeprecatedAndHidden() {
        return this.deprecatedAndHidden;
    }

    /**
     * Sets the value of the deprecatedAndHidden property.
     * 
     */
    public void setDeprecatedAndHidden(boolean value) {
        this.deprecatedAndHidden = value;
    }

    /**
     * Gets the value of the keyPrefix property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getKeyPrefix() {
        return this.keyPrefix;
    }

    /**
     * Sets the value of the keyPrefix property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setKeyPrefix(String value) {
        this.keyPrefix = value;
    }

    /**
     * Gets the value of the label property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getLabel() {
        return this.label;
    }

    /**
     * Sets the value of the label property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setLabel(String value) {
        this.label = value;
    }

    /**
     * Gets the value of the labelPlural property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getLabelPlural() {
        return this.labelPlural;
    }

    /**
     * Sets the value of the labelPlural property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setLabelPlural(String value) {
        this.labelPlural = value;
    }

    /**
     * Gets the value of the layoutable property.
     * 
     */
    public boolean isLayoutable() {
        return this.layoutable;
    }

    /**
     * Sets the value of the layoutable property.
     * 
     */
    public void setLayoutable(boolean value) {
        this.layoutable = value;
    }

    /**
     * Gets the value of the mergeable property.
     * 
     */
    public boolean isMergeable() {
        return this.mergeable;
    }

    /**
     * Sets the value of the mergeable property.
     * 
     */
    public void setMergeable(boolean value) {
        this.mergeable = value;
    }

    /**
     * Gets the value of the name property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getName() {
        return this.name;
    }

    /**
     * Sets the value of the name property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setName(String value) {
        this.name = value;
    }

    /**
     * Gets the value of the queryable property.
     * 
     */
    public boolean isQueryable() {
        return this.queryable;
    }

    /**
     * Sets the value of the queryable property.
     * 
     */
    public void setQueryable(boolean value) {
        this.queryable = value;
    }

    /**
     * Gets the value of the replicateable property.
     * 
     */
    public boolean isReplicateable() {
        return this.replicateable;
    }

    /**
     * Sets the value of the replicateable property.
     * 
     */
    public void setReplicateable(boolean value) {
        this.replicateable = value;
    }

    /**
     * Gets the value of the retrieveable property.
     * 
     */
    public boolean isRetrieveable() {
        return this.retrieveable;
    }

    /**
     * Sets the value of the retrieveable property.
     * 
     */
    public void setRetrieveable(boolean value) {
        this.retrieveable = value;
    }

    /**
     * Gets the value of the searchable property.
     * 
     */
    public boolean isSearchable() {
        return this.searchable;
    }

    /**
     * Sets the value of the searchable property.
     * 
     */
    public void setSearchable(boolean value) {
        this.searchable = value;
    }

    /**
     * Gets the value of the triggerable property.
     * 
     */
    public boolean isTriggerable() {
        return this.triggerable;
    }

    /**
     * Sets the value of the triggerable property.
     * 
     */
    public void setTriggerable(boolean value) {
        this.triggerable = value;
    }

    /**
     * Gets the value of the undeletable property.
     * 
     */
    public boolean isUndeletable() {
        return this.undeletable;
    }

    /**
     * Sets the value of the undeletable property.
     * 
     */
    public void setUndeletable(boolean value) {
        this.undeletable = value;
    }

    /**
     * Gets the value of the updateable property.
     * 
     */
    public boolean isUpdateable() {
        return this.updateable;
    }

    /**
     * Sets the value of the updateable property.
     * 
     */
    public void setUpdateable(boolean value) {
        this.updateable = value;
    }

}
