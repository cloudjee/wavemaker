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
 * Java class for DescribeLayout complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DescribeLayout">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="buttonLayoutSection" type="{urn:partner.soap.sforce.com}DescribeLayoutButtonSection" minOccurs="0"/>
 *         &lt;element name="detailLayoutSections" type="{urn:partner.soap.sforce.com}DescribeLayoutSection" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="editLayoutSections" type="{urn:partner.soap.sforce.com}DescribeLayoutSection" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="id" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="relatedLists" type="{urn:partner.soap.sforce.com}RelatedList" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DescribeLayout", namespace = "urn:partner.soap.sforce.com", propOrder = { "buttonLayoutSection", "detailLayoutSections",
    "editLayoutSections", "id", "relatedLists" })
public class DescribeLayoutType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected DescribeLayoutButtonSectionType buttonLayoutSection;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<DescribeLayoutSectionType> detailLayoutSections;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<DescribeLayoutSectionType> editLayoutSections;

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String id;

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<RelatedListType> relatedLists;

    /**
     * Gets the value of the buttonLayoutSection property.
     * 
     * @return possible object is {@link DescribeLayoutButtonSectionType }
     * 
     */
    public DescribeLayoutButtonSectionType getButtonLayoutSection() {
        return this.buttonLayoutSection;
    }

    /**
     * Sets the value of the buttonLayoutSection property.
     * 
     * @param value allowed object is {@link DescribeLayoutButtonSectionType }
     * 
     */
    public void setButtonLayoutSection(DescribeLayoutButtonSectionType value) {
        this.buttonLayoutSection = value;
    }

    /**
     * Gets the value of the detailLayoutSections property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a snapshot. Therefore any modification you make to
     * the returned list will be present inside the JAXB object. This is why there is not a <CODE>set</CODE> method for
     * the detailLayoutSections property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getDetailLayoutSections().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list {@link DescribeLayoutSectionType }
     * 
     * 
     */
    public List<DescribeLayoutSectionType> getDetailLayoutSections() {
        if (this.detailLayoutSections == null) {
            this.detailLayoutSections = new ArrayList<DescribeLayoutSectionType>();
        }
        return this.detailLayoutSections;
    }

    /**
     * Gets the value of the editLayoutSections property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a snapshot. Therefore any modification you make to
     * the returned list will be present inside the JAXB object. This is why there is not a <CODE>set</CODE> method for
     * the editLayoutSections property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getEditLayoutSections().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list {@link DescribeLayoutSectionType }
     * 
     * 
     */
    public List<DescribeLayoutSectionType> getEditLayoutSections() {
        if (this.editLayoutSections == null) {
            this.editLayoutSections = new ArrayList<DescribeLayoutSectionType>();
        }
        return this.editLayoutSections;
    }

    /**
     * Gets the value of the id property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getId() {
        return this.id;
    }

    /**
     * Sets the value of the id property.
     * 
     * @param value allowed object is {@link String }
     * 
     */
    public void setId(String value) {
        this.id = value;
    }

    /**
     * Gets the value of the relatedLists property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a snapshot. Therefore any modification you make to
     * the returned list will be present inside the JAXB object. This is why there is not a <CODE>set</CODE> method for
     * the relatedLists property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getRelatedLists().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list {@link RelatedListType }
     * 
     * 
     */
    public List<RelatedListType> getRelatedLists() {
        if (this.relatedLists == null) {
            this.relatedLists = new ArrayList<RelatedListType>();
        }
        return this.relatedLists;
    }

    /**
     * Sets the value of the detailLayoutSections property.
     * 
     * @param detailLayoutSections allowed object is {@link DescribeLayoutSectionType }
     * 
     */
    public void setDetailLayoutSections(List<DescribeLayoutSectionType> detailLayoutSections) {
        this.detailLayoutSections = detailLayoutSections;
    }

    /**
     * Sets the value of the editLayoutSections property.
     * 
     * @param editLayoutSections allowed object is {@link DescribeLayoutSectionType }
     * 
     */
    public void setEditLayoutSections(List<DescribeLayoutSectionType> editLayoutSections) {
        this.editLayoutSections = editLayoutSections;
    }

    /**
     * Sets the value of the relatedLists property.
     * 
     * @param relatedLists allowed object is {@link RelatedListType }
     * 
     */
    public void setRelatedLists(List<RelatedListType> relatedLists) {
        this.relatedLists = relatedLists;
    }

}
