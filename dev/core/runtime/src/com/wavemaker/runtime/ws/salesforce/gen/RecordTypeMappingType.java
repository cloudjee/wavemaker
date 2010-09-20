
package com.wavemaker.runtime.ws.salesforce.gen;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for RecordTypeMapping complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="RecordTypeMapping">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="available" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="defaultRecordTypeMapping" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="layoutId" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="name" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="picklistsForRecordType" type="{urn:partner.soap.sforce.com}PicklistForRecordType" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="recordTypeId" type="{urn:partner.soap.sforce.com}ID"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "RecordTypeMapping", namespace = "urn:partner.soap.sforce.com", propOrder = {
    "available",
    "defaultRecordTypeMapping",
    "layoutId",
    "name",
    "picklistsForRecordTypes",
    "recordTypeId"
})
public class RecordTypeMappingType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean available;
    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected boolean defaultRecordTypeMapping;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String layoutId;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String name;
    @XmlElement(name = "picklistsForRecordType", namespace = "urn:partner.soap.sforce.com", nillable = true)
    protected List<PicklistForRecordTypeType> picklistsForRecordTypes;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true, nillable = true)
    protected String recordTypeId;

    /**
     * Gets the value of the available property.
     * 
     */
    public boolean isAvailable() {
        return available;
    }

    /**
     * Sets the value of the available property.
     * 
     */
    public void setAvailable(boolean value) {
        this.available = value;
    }

    /**
     * Gets the value of the defaultRecordTypeMapping property.
     * 
     */
    public boolean isDefaultRecordTypeMapping() {
        return defaultRecordTypeMapping;
    }

    /**
     * Sets the value of the defaultRecordTypeMapping property.
     * 
     */
    public void setDefaultRecordTypeMapping(boolean value) {
        this.defaultRecordTypeMapping = value;
    }

    /**
     * Gets the value of the layoutId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLayoutId() {
        return layoutId;
    }

    /**
     * Sets the value of the layoutId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLayoutId(String value) {
        this.layoutId = value;
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
     * Gets the value of the picklistsForRecordTypes property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the picklistsForRecordTypes property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getPicklistsForRecordTypes().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link PicklistForRecordTypeType }
     * 
     * 
     */
    public List<PicklistForRecordTypeType> getPicklistsForRecordTypes() {
        if (picklistsForRecordTypes == null) {
            picklistsForRecordTypes = new ArrayList<PicklistForRecordTypeType>();
        }
        return this.picklistsForRecordTypes;
    }

    /**
     * Gets the value of the recordTypeId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRecordTypeId() {
        return recordTypeId;
    }

    /**
     * Sets the value of the recordTypeId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRecordTypeId(String value) {
        this.recordTypeId = value;
    }

    /**
     * Sets the value of the picklistsForRecordTypes property.
     * 
     * @param picklistsForRecordTypes
     *     allowed object is
     *     {@link PicklistForRecordTypeType }
     *     
     */
    public void setPicklistsForRecordTypes(List<PicklistForRecordTypeType> picklistsForRecordTypes) {
        this.picklistsForRecordTypes = picklistsForRecordTypes;
    }

}
