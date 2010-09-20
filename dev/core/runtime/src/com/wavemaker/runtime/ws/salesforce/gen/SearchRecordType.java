
package com.wavemaker.runtime.ws.salesforce.gen;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for SearchRecord complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="SearchRecord">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="record" type="{urn:sobject.partner.soap.sforce.com}sObject"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "SearchRecord", namespace = "urn:partner.soap.sforce.com", propOrder = {
    "record"
})
public class SearchRecordType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected SObjectType record;

    /**
     * Gets the value of the record property.
     * 
     * @return
     *     possible object is
     *     {@link SObjectType }
     *     
     */
    public SObjectType getRecord() {
        return record;
    }

    /**
     * Sets the value of the record property.
     * 
     * @param value
     *     allowed object is
     *     {@link SObjectType }
     *     
     */
    public void setRecord(SObjectType value) {
        this.record = value;
    }

}
