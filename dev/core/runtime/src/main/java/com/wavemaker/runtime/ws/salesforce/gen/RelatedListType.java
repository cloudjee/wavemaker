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
 * <p>
 * Java class for RelatedList complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="RelatedList">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="columns" type="{urn:partner.soap.sforce.com}RelatedListColumn" maxOccurs="unbounded"/>
 *         &lt;element name="custom" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="field" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="label" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="limitRows" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="name" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="sobject" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="sort" type="{urn:partner.soap.sforce.com}RelatedListSort" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "RelatedList", namespace = "urn:partner.soap.sforce.com", propOrder = { "columns", "custom", "field", "label", "limitRows", "name",
    "sobject", "sorts" })
public class RelatedListType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected List<RelatedListColumnType> columns;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean custom;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String field;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String label;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected int limitRows;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String name;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String sobject;

    @XmlElement(name = "sort", namespace = "urn:partner.soap.sforce.com")
    protected List<RelatedListSortType> sorts;

    /**
     * Gets the value of the columns property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a snapshot. Therefore any modification you make to
     * the returned list will be present inside the JAXB object. This is why there is not a <CODE>set</CODE> method for
     * the columns property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getColumns().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list {@link RelatedListColumnType }
     * 
     * 
     */
    public List<RelatedListColumnType> getColumns() {
        if (this.columns == null) {
            this.columns = new ArrayList<RelatedListColumnType>();
        }
        return this.columns;
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
     * Gets the value of the field property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getField() {
        return this.field;
    }

    /**
     * Sets the value of the field property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setField(String value) {
        this.field = value;
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
     * Gets the value of the limitRows property.
     * 
     */
    public int getLimitRows() {
        return this.limitRows;
    }

    /**
     * Sets the value of the limitRows property.
     * 
     */
    public void setLimitRows(int value) {
        this.limitRows = value;
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
     * Gets the value of the sobject property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getSobject() {
        return this.sobject;
    }

    /**
     * Sets the value of the sobject property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setSobject(String value) {
        this.sobject = value;
    }

    /**
     * Gets the value of the sorts property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a snapshot. Therefore any modification you make to
     * the returned list will be present inside the JAXB object. This is why there is not a <CODE>set</CODE> method for
     * the sorts property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getSorts().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list {@link RelatedListSortType }
     * 
     * 
     */
    public List<RelatedListSortType> getSorts() {
        if (this.sorts == null) {
            this.sorts = new ArrayList<RelatedListSortType>();
        }
        return this.sorts;
    }

    /**
     * Sets the value of the columns property.
     * 
     * @param columns allowed object is {@link RelatedListColumnType }
     * 
     */
    public void setColumns(List<RelatedListColumnType> columns) {
        this.columns = columns;
    }

    /**
     * Sets the value of the sorts property.
     * 
     * @param sorts allowed object is {@link RelatedListSortType }
     * 
     */
    public void setSorts(List<RelatedListSortType> sorts) {
        this.sorts = sorts;
    }

}
