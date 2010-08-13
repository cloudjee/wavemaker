
package com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice;

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
 *         &lt;element name="SubscriptionId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="AssociateTag" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Validate" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="XMLEscaping" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Shared" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}BrowseNodeLookupRequest" minOccurs="0"/>
 *         &lt;element name="Request" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}BrowseNodeLookupRequest" maxOccurs="unbounded" minOccurs="0"/>
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
    "subscriptionId",
    "associateTag",
    "validate",
    "xmlEscaping",
    "shared",
    "requests"
})
@XmlRootElement(name = "BrowseNodeLookup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class BrowseNodeLookup {

    @XmlElement(name = "SubscriptionId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String subscriptionId;
    @XmlElement(name = "AssociateTag", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String associateTag;
    @XmlElement(name = "Validate", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String validate;
    @XmlElement(name = "XMLEscaping", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String xmlEscaping;
    @XmlElement(name = "Shared", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected BrowseNodeLookupRequestType shared;
    @XmlElement(name = "Request", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected List<BrowseNodeLookupRequestType> requests;

    /**
     * Gets the value of the subscriptionId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSubscriptionId() {
        return subscriptionId;
    }

    /**
     * Sets the value of the subscriptionId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSubscriptionId(String value) {
        this.subscriptionId = value;
    }

    /**
     * Gets the value of the associateTag property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAssociateTag() {
        return associateTag;
    }

    /**
     * Sets the value of the associateTag property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAssociateTag(String value) {
        this.associateTag = value;
    }

    /**
     * Gets the value of the validate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getValidate() {
        return validate;
    }

    /**
     * Sets the value of the validate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setValidate(String value) {
        this.validate = value;
    }

    /**
     * Gets the value of the xmlEscaping property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getXMLEscaping() {
        return xmlEscaping;
    }

    /**
     * Sets the value of the xmlEscaping property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setXMLEscaping(String value) {
        this.xmlEscaping = value;
    }

    /**
     * Gets the value of the shared property.
     * 
     * @return
     *     possible object is
     *     {@link BrowseNodeLookupRequestType }
     *     
     */
    public BrowseNodeLookupRequestType getShared() {
        return shared;
    }

    /**
     * Sets the value of the shared property.
     * 
     * @param value
     *     allowed object is
     *     {@link BrowseNodeLookupRequestType }
     *     
     */
    public void setShared(BrowseNodeLookupRequestType value) {
        this.shared = value;
    }

    /**
     * Gets the value of the requests property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the requests property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getRequests().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link BrowseNodeLookupRequestType }
     * 
     * 
     */
    public List<BrowseNodeLookupRequestType> getRequests() {
        if (requests == null) {
            requests = new ArrayList<BrowseNodeLookupRequestType>();
        }
        return this.requests;
    }

    /**
     * Sets the value of the requests property.
     * 
     * @param requests
     *     allowed object is
     *     {@link BrowseNodeLookupRequestType }
     *     
     */
    public void setRequests(List<BrowseNodeLookupRequestType> requests) {
        this.requests = requests;
    }

}
