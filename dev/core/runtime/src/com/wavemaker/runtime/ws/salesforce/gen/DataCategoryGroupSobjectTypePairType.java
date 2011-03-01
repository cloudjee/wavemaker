/*
 * Copyright (C) 2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Enterprise.
 *  You may not use this file in any manner except through written agreement with WaveMaker Software, Inc.
 *
 */ 


package com.wavemaker.runtime.ws.salesforce.gen;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for DataCategoryGroupSobjectTypePair complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DataCategoryGroupSobjectTypePair">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="dataCategoryGroupName" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="sobject" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DataCategoryGroupSobjectTypePair", namespace = "urn:partner.soap.sforce.com", propOrder = {
    "dataCategoryGroupName",
    "sobject"
})
public class DataCategoryGroupSobjectTypePairType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String dataCategoryGroupName;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String sobject;

    /**
     * Gets the value of the dataCategoryGroupName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDataCategoryGroupName() {
        return dataCategoryGroupName;
    }

    /**
     * Sets the value of the dataCategoryGroupName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDataCategoryGroupName(String value) {
        this.dataCategoryGroupName = value;
    }

    /**
     * Gets the value of the sobject property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSobject() {
        return sobject;
    }

    /**
     * Sets the value of the sobject property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSobject(String value) {
        this.sobject = value;
    }

}
