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
 * <p>Java class for Field complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="Field">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="autoNumber" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="byteLength" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="calculated" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="calculatedFormula" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="caseSensitive" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="controllerName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="createable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="custom" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="defaultValueFormula" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="defaultedOnCreate" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="dependentPicklist" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="deprecatedAndHidden" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="digits" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="externalId" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="filterable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="groupable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="htmlFormatted" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="idLookup" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="inlineHelpText" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="label" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="length" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="name" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="nameField" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="namePointing" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="nillable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="picklistValues" type="{urn:partner.soap.sforce.com}PicklistEntry" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="precision" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="referenceTo" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="relationshipName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="relationshipOrder" type="{http://www.w3.org/2001/XMLSchema}int" minOccurs="0"/>
 *         &lt;element name="restrictedPicklist" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="scale" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="soapType" type="{urn:partner.soap.sforce.com}soapType"/>
 *         &lt;element name="sortable" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="type" type="{urn:partner.soap.sforce.com}fieldType"/>
 *         &lt;element name="unique" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="updateable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="writeRequiresMasterRead" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "Field", namespace = "urn:partner.soap.sforce.com", propOrder = {
    "autoNumber",
    "byteLength",
    "calculated",
    "calculatedFormula",
    "caseSensitive",
    "controllerName",
    "createable",
    "custom",
    "defaultValueFormula",
    "defaultedOnCreate",
    "dependentPicklist",
    "deprecatedAndHidden",
    "digits",
    "externalId",
    "filterable",
    "groupable",
    "htmlFormatted",
    "idLookup",
    "inlineHelpText",
    "label",
    "length",
    "name",
    "nameField",
    "namePointing",
    "nillable",
    "picklistValues",
    "precision",
    "referenceTos",
    "relationshipName",
    "relationshipOrder",
    "restrictedPicklist",
    "scale",
    "soapType",
    "sortable",
    "type",
    "unique",
    "updateable",
    "writeRequiresMasterRead"
})
public class FieldType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean autoNumber;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected int byteLength;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean calculated;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected String calculatedFormula;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean caseSensitive;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected String controllerName;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean createable;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean custom;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected String defaultValueFormula;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean defaultedOnCreate;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected Boolean dependentPicklist;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean deprecatedAndHidden;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected int digits;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected Boolean externalId;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean filterable;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean groupable;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected Boolean htmlFormatted;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean idLookup;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected String inlineHelpText;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String label;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected int length;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String name;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean nameField;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected Boolean namePointing;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean nillable;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", nillable = true)
    protected List<PicklistEntryType> picklistValues;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected int precision;
    @XmlElement(name = "referenceTo", namespace = "urn:partner.soap.sforce.com", nillable = true)
    protected List<String> referenceTos;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected String relationshipName;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected Integer relationshipOrder;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean restrictedPicklist;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected int scale;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected SoapTypeType soapType;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected Boolean sortable;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected FieldTypeType type;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean unique;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean updateable;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected Boolean writeRequiresMasterRead;

    /**
     * Gets the value of the autoNumber property.
     * 
     */
    public boolean isAutoNumber() {
        return autoNumber;
    }

    /**
     * Sets the value of the autoNumber property.
     * 
     */
    public void setAutoNumber(boolean value) {
        this.autoNumber = value;
    }

    /**
     * Gets the value of the byteLength property.
     * 
     */
    public int getByteLength() {
        return byteLength;
    }

    /**
     * Sets the value of the byteLength property.
     * 
     */
    public void setByteLength(int value) {
        this.byteLength = value;
    }

    /**
     * Gets the value of the calculated property.
     * 
     */
    public boolean isCalculated() {
        return calculated;
    }

    /**
     * Sets the value of the calculated property.
     * 
     */
    public void setCalculated(boolean value) {
        this.calculated = value;
    }

    /**
     * Gets the value of the calculatedFormula property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCalculatedFormula() {
        return calculatedFormula;
    }

    /**
     * Sets the value of the calculatedFormula property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCalculatedFormula(String value) {
        this.calculatedFormula = value;
    }

    /**
     * Gets the value of the caseSensitive property.
     * 
     */
    public boolean isCaseSensitive() {
        return caseSensitive;
    }

    /**
     * Sets the value of the caseSensitive property.
     * 
     */
    public void setCaseSensitive(boolean value) {
        this.caseSensitive = value;
    }

    /**
     * Gets the value of the controllerName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getControllerName() {
        return controllerName;
    }

    /**
     * Sets the value of the controllerName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setControllerName(String value) {
        this.controllerName = value;
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
     * Gets the value of the defaultValueFormula property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDefaultValueFormula() {
        return defaultValueFormula;
    }

    /**
     * Sets the value of the defaultValueFormula property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDefaultValueFormula(String value) {
        this.defaultValueFormula = value;
    }

    /**
     * Gets the value of the defaultedOnCreate property.
     * 
     */
    public boolean isDefaultedOnCreate() {
        return defaultedOnCreate;
    }

    /**
     * Sets the value of the defaultedOnCreate property.
     * 
     */
    public void setDefaultedOnCreate(boolean value) {
        this.defaultedOnCreate = value;
    }

    /**
     * Gets the value of the dependentPicklist property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean getDependentPicklist() {
        return dependentPicklist;
    }

    /**
     * Sets the value of the dependentPicklist property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setDependentPicklist(Boolean value) {
        this.dependentPicklist = value;
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
     * Gets the value of the digits property.
     * 
     */
    public int getDigits() {
        return digits;
    }

    /**
     * Sets the value of the digits property.
     * 
     */
    public void setDigits(int value) {
        this.digits = value;
    }

    /**
     * Gets the value of the externalId property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean getExternalId() {
        return externalId;
    }

    /**
     * Sets the value of the externalId property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setExternalId(Boolean value) {
        this.externalId = value;
    }

    /**
     * Gets the value of the filterable property.
     * 
     */
    public boolean isFilterable() {
        return filterable;
    }

    /**
     * Sets the value of the filterable property.
     * 
     */
    public void setFilterable(boolean value) {
        this.filterable = value;
    }

    /**
     * Gets the value of the groupable property.
     * 
     */
    public boolean isGroupable() {
        return groupable;
    }

    /**
     * Sets the value of the groupable property.
     * 
     */
    public void setGroupable(boolean value) {
        this.groupable = value;
    }

    /**
     * Gets the value of the htmlFormatted property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean getHtmlFormatted() {
        return htmlFormatted;
    }

    /**
     * Sets the value of the htmlFormatted property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setHtmlFormatted(Boolean value) {
        this.htmlFormatted = value;
    }

    /**
     * Gets the value of the idLookup property.
     * 
     */
    public boolean isIdLookup() {
        return idLookup;
    }

    /**
     * Sets the value of the idLookup property.
     * 
     */
    public void setIdLookup(boolean value) {
        this.idLookup = value;
    }

    /**
     * Gets the value of the inlineHelpText property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getInlineHelpText() {
        return inlineHelpText;
    }

    /**
     * Sets the value of the inlineHelpText property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setInlineHelpText(String value) {
        this.inlineHelpText = value;
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
     * Gets the value of the length property.
     * 
     */
    public int getLength() {
        return length;
    }

    /**
     * Sets the value of the length property.
     * 
     */
    public void setLength(int value) {
        this.length = value;
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
     * Gets the value of the nameField property.
     * 
     */
    public boolean isNameField() {
        return nameField;
    }

    /**
     * Sets the value of the nameField property.
     * 
     */
    public void setNameField(boolean value) {
        this.nameField = value;
    }

    /**
     * Gets the value of the namePointing property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean getNamePointing() {
        return namePointing;
    }

    /**
     * Sets the value of the namePointing property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setNamePointing(Boolean value) {
        this.namePointing = value;
    }

    /**
     * Gets the value of the nillable property.
     * 
     */
    public boolean isNillable() {
        return nillable;
    }

    /**
     * Sets the value of the nillable property.
     * 
     */
    public void setNillable(boolean value) {
        this.nillable = value;
    }

    /**
     * Gets the value of the picklistValues property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the picklistValues property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getPicklistValues().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link PicklistEntryType }
     * 
     * 
     */
    public List<PicklistEntryType> getPicklistValues() {
        if (picklistValues == null) {
            picklistValues = new ArrayList<PicklistEntryType>();
        }
        return this.picklistValues;
    }

    /**
     * Gets the value of the precision property.
     * 
     */
    public int getPrecision() {
        return precision;
    }

    /**
     * Sets the value of the precision property.
     * 
     */
    public void setPrecision(int value) {
        this.precision = value;
    }

    /**
     * Gets the value of the referenceTos property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the referenceTos property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getReferenceTos().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getReferenceTos() {
        if (referenceTos == null) {
            referenceTos = new ArrayList<String>();
        }
        return this.referenceTos;
    }

    /**
     * Gets the value of the relationshipName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRelationshipName() {
        return relationshipName;
    }

    /**
     * Sets the value of the relationshipName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRelationshipName(String value) {
        this.relationshipName = value;
    }

    /**
     * Gets the value of the relationshipOrder property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getRelationshipOrder() {
        return relationshipOrder;
    }

    /**
     * Sets the value of the relationshipOrder property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setRelationshipOrder(Integer value) {
        this.relationshipOrder = value;
    }

    /**
     * Gets the value of the restrictedPicklist property.
     * 
     */
    public boolean isRestrictedPicklist() {
        return restrictedPicklist;
    }

    /**
     * Sets the value of the restrictedPicklist property.
     * 
     */
    public void setRestrictedPicklist(boolean value) {
        this.restrictedPicklist = value;
    }

    /**
     * Gets the value of the scale property.
     * 
     */
    public int getScale() {
        return scale;
    }

    /**
     * Sets the value of the scale property.
     * 
     */
    public void setScale(int value) {
        this.scale = value;
    }

    /**
     * Gets the value of the soapType property.
     * 
     * @return
     *     possible object is
     *     {@link SoapTypeType }
     *     
     */
    public SoapTypeType getSoapType() {
        return soapType;
    }

    /**
     * Sets the value of the soapType property.
     * 
     * @param value
     *     allowed object is
     *     {@link SoapTypeType }
     *     
     */
    public void setSoapType(SoapTypeType value) {
        this.soapType = value;
    }

    /**
     * Gets the value of the sortable property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean getSortable() {
        return sortable;
    }

    /**
     * Sets the value of the sortable property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setSortable(Boolean value) {
        this.sortable = value;
    }

    /**
     * Gets the value of the type property.
     * 
     * @return
     *     possible object is
     *     {@link FieldTypeType }
     *     
     */
    public FieldTypeType getType() {
        return type;
    }

    /**
     * Sets the value of the type property.
     * 
     * @param value
     *     allowed object is
     *     {@link FieldTypeType }
     *     
     */
    public void setType(FieldTypeType value) {
        this.type = value;
    }

    /**
     * Gets the value of the unique property.
     * 
     */
    public boolean isUnique() {
        return unique;
    }

    /**
     * Sets the value of the unique property.
     * 
     */
    public void setUnique(boolean value) {
        this.unique = value;
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
     * Gets the value of the writeRequiresMasterRead property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean getWriteRequiresMasterRead() {
        return writeRequiresMasterRead;
    }

    /**
     * Sets the value of the writeRequiresMasterRead property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setWriteRequiresMasterRead(Boolean value) {
        this.writeRequiresMasterRead = value;
    }

    /**
     * Sets the value of the picklistValues property.
     * 
     * @param picklistValues
     *     allowed object is
     *     {@link PicklistEntryType }
     *     
     */
    public void setPicklistValues(List<PicklistEntryType> picklistValues) {
        this.picklistValues = picklistValues;
    }

    /**
     * Sets the value of the referenceTos property.
     * 
     * @param referenceTos
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReferenceTos(List<String> referenceTos) {
        this.referenceTos = referenceTos;
    }

}
