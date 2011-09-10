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
 * <p>Java class for DescribeSObjectResult complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DescribeSObjectResult">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="activateable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="childRelationships" type="{urn:partner.soap.sforce.com}ChildRelationship" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="createable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="custom" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="customSetting" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="deletable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="deprecatedAndHidden" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="fields" type="{urn:partner.soap.sforce.com}Field" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="keyPrefix" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="label" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="labelPlural" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="layoutable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="mergeable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="name" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="queryable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="recordTypeInfos" type="{urn:partner.soap.sforce.com}RecordTypeInfo" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="replicateable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="retrieveable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="searchable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="triggerable" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="undeletable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="updateable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="urlDetail" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="urlEdit" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="urlNew" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DescribeSObjectResult", namespace = "urn:partner.soap.sforce.com", propOrder = {
    "activateable",
    "childRelationships",
    "createable",
    "custom",
    "customSetting",
    "deletable",
    "deprecatedAndHidden",
    "fields",
    "keyPrefix",
    "label",
    "labelPlural",
    "layoutable",
    "mergeable",
    "name",
    "queryable",
    "recordTypeInfos",
    "replicateable",
    "retrieveable",
    "searchable",
    "triggerable",
    "undeletable",
    "updateable",
    "urlDetail",
    "urlEdit",
    "urlNew"
})
public class DescribeSObjectResultType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean activateable;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<ChildRelationshipType> childRelationships;
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
    @XmlElement(namespace = "urn:partner.soap.sforce.com", nillable = true)
    protected List<FieldType> fields;
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
    protected List<RecordTypeInfoType> recordTypeInfos;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean replicateable;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean retrieveable;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean searchable;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected Boolean triggerable;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean undeletable;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean updateable;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String urlDetail;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String urlEdit;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String urlNew;

    /**
     * Gets the value of the activateable property.
     * 
     */
    public boolean isActivateable() {
        return activateable;
    }

    /**
     * Sets the value of the activateable property.
     * 
     */
    public void setActivateable(boolean value) {
        this.activateable = value;
    }

    /**
     * Gets the value of the childRelationships property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the childRelationships property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getChildRelationships().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ChildRelationshipType }
     * 
     * 
     */
    public List<ChildRelationshipType> getChildRelationships() {
        if (childRelationships == null) {
            childRelationships = new ArrayList<ChildRelationshipType>();
        }
        return this.childRelationships;
    }

    /**
     * Gets the value of the createable property.
     * 
     */
    public boolean isCreateable() {
        return createable;
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
        return custom;
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
        return customSetting;
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
        return deletable;
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
        return deprecatedAndHidden;
    }

    /**
     * Sets the value of the deprecatedAndHidden property.
     * 
     */
    public void setDeprecatedAndHidden(boolean value) {
        this.deprecatedAndHidden = value;
    }

    /**
     * Gets the value of the fields property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the fields property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getFields().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link FieldType }
     * 
     * 
     */
    public List<FieldType> getFields() {
        if (fields == null) {
            fields = new ArrayList<FieldType>();
        }
        return this.fields;
    }

    /**
     * Gets the value of the keyPrefix property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getKeyPrefix() {
        return keyPrefix;
    }

    /**
     * Sets the value of the keyPrefix property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setKeyPrefix(String value) {
        this.keyPrefix = value;
    }

    /**
     * Gets the value of the label property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLabel() {
        return label;
    }

    /**
     * Sets the value of the label property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLabel(String value) {
        this.label = value;
    }

    /**
     * Gets the value of the labelPlural property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLabelPlural() {
        return labelPlural;
    }

    /**
     * Sets the value of the labelPlural property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
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
        return layoutable;
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
        return mergeable;
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
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the value of the name property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
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
        return queryable;
    }

    /**
     * Sets the value of the queryable property.
     * 
     */
    public void setQueryable(boolean value) {
        this.queryable = value;
    }

    /**
     * Gets the value of the recordTypeInfos property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the recordTypeInfos property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getRecordTypeInfos().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link RecordTypeInfoType }
     * 
     * 
     */
    public List<RecordTypeInfoType> getRecordTypeInfos() {
        if (recordTypeInfos == null) {
            recordTypeInfos = new ArrayList<RecordTypeInfoType>();
        }
        return this.recordTypeInfos;
    }

    /**
     * Gets the value of the replicateable property.
     * 
     */
    public boolean isReplicateable() {
        return replicateable;
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
        return retrieveable;
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
        return searchable;
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
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean getTriggerable() {
        return triggerable;
    }

    /**
     * Sets the value of the triggerable property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setTriggerable(Boolean value) {
        this.triggerable = value;
    }

    /**
     * Gets the value of the undeletable property.
     * 
     */
    public boolean isUndeletable() {
        return undeletable;
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
        return updateable;
    }

    /**
     * Sets the value of the updateable property.
     * 
     */
    public void setUpdateable(boolean value) {
        this.updateable = value;
    }

    /**
     * Gets the value of the urlDetail property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUrlDetail() {
        return urlDetail;
    }

    /**
     * Sets the value of the urlDetail property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUrlDetail(String value) {
        this.urlDetail = value;
    }

    /**
     * Gets the value of the urlEdit property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUrlEdit() {
        return urlEdit;
    }

    /**
     * Sets the value of the urlEdit property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUrlEdit(String value) {
        this.urlEdit = value;
    }

    /**
     * Gets the value of the urlNew property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUrlNew() {
        return urlNew;
    }

    /**
     * Sets the value of the urlNew property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUrlNew(String value) {
        this.urlNew = value;
    }

    /**
     * Sets the value of the childRelationships property.
     * 
     * @param childRelationships
     *     allowed object is
     *     {@link ChildRelationshipType }
     *     
     */
    public void setChildRelationships(List<ChildRelationshipType> childRelationships) {
        this.childRelationships = childRelationships;
    }

    /**
     * Sets the value of the fields property.
     * 
     * @param fields
     *     allowed object is
     *     {@link FieldType }
     *     
     */
    public void setFields(List<FieldType> fields) {
        this.fields = fields;
    }

    /**
     * Sets the value of the recordTypeInfos property.
     * 
     * @param recordTypeInfos
     *     allowed object is
     *     {@link RecordTypeInfoType }
     *     
     */
    public void setRecordTypeInfos(List<RecordTypeInfoType> recordTypeInfos) {
        this.recordTypeInfos = recordTypeInfos;
    }

}
