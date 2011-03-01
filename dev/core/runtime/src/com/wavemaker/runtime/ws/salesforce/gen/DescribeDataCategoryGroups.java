/*
 * Copyright (C) 2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Enterprise.
 *  You may not use this file in any manner except through written agreement with WaveMaker Software, Inc.
 *
 */ 


package com.wavemaker.runtime.ws.salesforce.gen;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="sObjectType" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="10" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "sObjectTypes"
})
@XmlRootElement(name = "describeDataCategoryGroups", namespace = "urn:partner.soap.sforce.com")
public class DescribeDataCategoryGroups {

    @XmlElement(name = "sObjectType", namespace = "urn:partner.soap.sforce.com")
    protected List<String> sObjectTypes;

    /**
     * Gets the value of the sObjectTypes property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the sObjectTypes property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getSObjectTypes().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getSObjectTypes() {
        if (sObjectTypes == null) {
            sObjectTypes = new ArrayList<String>();
        }
        return this.sObjectTypes;
    }

    /**
     * Sets the value of the sObjectTypes property.
     * 
     * @param sObjectTypes
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSObjectTypes(List<String> sObjectTypes) {
        this.sObjectTypes = sObjectTypes;
    }

}
