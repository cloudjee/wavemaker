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
 * <p>Java class for DescribeLayoutComponent complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DescribeLayoutComponent">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="displayLines" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="tabOrder" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="type" type="{urn:partner.soap.sforce.com}layoutComponentType"/>
 *         &lt;element name="value" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DescribeLayoutComponent", namespace = "urn:partner.soap.sforce.com", propOrder = {
    "displayLines",
    "tabOrder",
    "type",
    "value"
})
public class DescribeLayoutComponentType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected int displayLines;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected int tabOrder;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected LayoutComponentTypeType type;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String value;

    /**
     * Gets the value of the displayLines property.
     * 
     */
    public int getDisplayLines() {
        return displayLines;
    }

    /**
     * Sets the value of the displayLines property.
     * 
     */
    public void setDisplayLines(int value) {
        this.displayLines = value;
    }

    /**
     * Gets the value of the tabOrder property.
     * 
     */
    public int getTabOrder() {
        return tabOrder;
    }

    /**
     * Sets the value of the tabOrder property.
     * 
     */
    public void setTabOrder(int value) {
        this.tabOrder = value;
    }

    /**
     * Gets the value of the type property.
     * 
     * @return
     *     possible object is
     *     {@link LayoutComponentTypeType }
     *     
     */
    public LayoutComponentTypeType getType() {
        return type;
    }

    /**
     * Sets the value of the type property.
     * 
     * @param value
     *     allowed object is
     *     {@link LayoutComponentTypeType }
     *     
     */
    public void setType(LayoutComponentTypeType value) {
        this.type = value;
    }

    /**
     * Gets the value of the value property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getValue() {
        return value;
    }

    /**
     * Sets the value of the value property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setValue(String value) {
        this.value = value;
    }

}
