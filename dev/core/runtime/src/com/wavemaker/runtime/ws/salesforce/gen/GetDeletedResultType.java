/*
 * Copyright (C) 2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Enterprise.
 *  You may not use this file in any manner except through written agreement with WaveMaker Software, Inc.
 *
 */ 


package com.wavemaker.runtime.ws.salesforce.gen;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;
import com.wavemaker.runtime.ws.jaxb.DateXmlAdapter;


/**
 * <p>Java class for GetDeletedResult complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="GetDeletedResult">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="deletedRecords" type="{urn:partner.soap.sforce.com}DeletedRecord" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="earliestDateAvailable" type="{http://www.w3.org/2001/XMLSchema}dateTime"/>
 *         &lt;element name="latestDateCovered" type="{http://www.w3.org/2001/XMLSchema}dateTime"/>
 *         &lt;element name="sforceReserved" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "GetDeletedResult", namespace = "urn:partner.soap.sforce.com", propOrder = {
    "deletedRecords",
    "earliestDateAvailable",
    "latestDateCovered",
    "sforceReserved"
})
public class GetDeletedResultType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<DeletedRecordType> deletedRecords;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, type = String.class)
    @XmlJavaTypeAdapter(DateXmlAdapter.class)
    @XmlSchemaType(name = "dateTime")
    protected Date earliestDateAvailable;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, type = String.class)
    @XmlJavaTypeAdapter(DateXmlAdapter.class)
    @XmlSchemaType(name = "dateTime")
    protected Date latestDateCovered;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected String sforceReserved;

    /**
     * Gets the value of the deletedRecords property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the deletedRecords property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getDeletedRecords().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link DeletedRecordType }
     * 
     * 
     */
    public List<DeletedRecordType> getDeletedRecords() {
        if (deletedRecords == null) {
            deletedRecords = new ArrayList<DeletedRecordType>();
        }
        return this.deletedRecords;
    }

    /**
     * Gets the value of the earliestDateAvailable property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public Date getEarliestDateAvailable() {
        return earliestDateAvailable;
    }

    /**
     * Sets the value of the earliestDateAvailable property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEarliestDateAvailable(Date value) {
        this.earliestDateAvailable = value;
    }

    /**
     * Gets the value of the latestDateCovered property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public Date getLatestDateCovered() {
        return latestDateCovered;
    }

    /**
     * Sets the value of the latestDateCovered property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLatestDateCovered(Date value) {
        this.latestDateCovered = value;
    }

    /**
     * Gets the value of the sforceReserved property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSforceReserved() {
        return sforceReserved;
    }

    /**
     * Sets the value of the sforceReserved property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSforceReserved(String value) {
        this.sforceReserved = value;
    }

    /**
     * Sets the value of the deletedRecords property.
     * 
     * @param deletedRecords
     *     allowed object is
     *     {@link DeletedRecordType }
     *     
     */
    public void setDeletedRecords(List<DeletedRecordType> deletedRecords) {
        this.deletedRecords = deletedRecords;
    }

}
