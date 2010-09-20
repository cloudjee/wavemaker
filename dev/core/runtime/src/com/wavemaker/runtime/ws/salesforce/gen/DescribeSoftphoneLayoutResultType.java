
package com.wavemaker.runtime.ws.salesforce.gen;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for DescribeSoftphoneLayoutResult complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DescribeSoftphoneLayoutResult">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="callTypes" type="{urn:partner.soap.sforce.com}DescribeSoftphoneLayoutCallType" maxOccurs="unbounded"/>
 *         &lt;element name="id" type="{urn:partner.soap.sforce.com}ID"/>
 *         &lt;element name="name" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DescribeSoftphoneLayoutResult", namespace = "urn:partner.soap.sforce.com", propOrder = {
    "callTypes",
    "id",
    "name"
})
public class DescribeSoftphoneLayoutResultType {

    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected List<DescribeSoftphoneLayoutCallTypeType> callTypes;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String id;
    @XmlElement(namespace = "urn:partner.soap.sforce.com", required = true)
    protected String name;

    /**
     * Gets the value of the callTypes property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the callTypes property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getCallTypes().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link DescribeSoftphoneLayoutCallTypeType }
     * 
     * 
     */
    public List<DescribeSoftphoneLayoutCallTypeType> getCallTypes() {
        if (callTypes == null) {
            callTypes = new ArrayList<DescribeSoftphoneLayoutCallTypeType>();
        }
        return this.callTypes;
    }

    /**
     * Gets the value of the id property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the value of the id property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setId(String value) {
        this.id = value;
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
     * Sets the value of the callTypes property.
     * 
     * @param callTypes
     *     allowed object is
     *     {@link DescribeSoftphoneLayoutCallTypeType }
     *     
     */
    public void setCallTypes(List<DescribeSoftphoneLayoutCallTypeType> callTypes) {
        this.callTypes = callTypes;
    }

}
