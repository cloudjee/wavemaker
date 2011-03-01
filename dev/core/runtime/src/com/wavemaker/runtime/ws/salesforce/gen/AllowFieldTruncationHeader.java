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
 *         &lt;element name="allowFieldTruncation" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
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
    "allowFieldTruncation"
})
@XmlRootElement(name = "AllowFieldTruncationHeader", namespace = "urn:partner.soap.sforce.com")
public class AllowFieldTruncationHeader {

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean allowFieldTruncation;

    /**
     * Gets the value of the allowFieldTruncation property.
     * 
     */
    public boolean isAllowFieldTruncation() {
        return allowFieldTruncation;
    }

    /**
     * Sets the value of the allowFieldTruncation property.
     * 
     */
    public void setAllowFieldTruncation(boolean value) {
        this.allowFieldTruncation = value;
    }

}
