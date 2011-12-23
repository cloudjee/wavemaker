
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
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}OperationRequest" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SellerListings" maxOccurs="unbounded" minOccurs="0"/>
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
    "operationRequest",
    "sellerListings"
})
@XmlRootElement(name = "SellerListingSearchResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class SellerListingSearchResponse {

    @XmlElement(name = "OperationRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected OperationRequest operationRequest;
    @XmlElement(name = "SellerListings", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected List<SellerListings> sellerListings;

    /**
     * Gets the value of the operationRequest property.
     * 
     * @return
     *     possible object is
     *     {@link OperationRequest }
     *     
     */
    public OperationRequest getOperationRequest() {
        return operationRequest;
    }

    /**
     * Sets the value of the operationRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link OperationRequest }
     *     
     */
    public void setOperationRequest(OperationRequest value) {
        this.operationRequest = value;
    }

    /**
     * Gets the value of the sellerListings property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the sellerListings property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getSellerListings().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link SellerListings }
     * 
     * 
     */
    public List<SellerListings> getSellerListings() {
        if (sellerListings == null) {
            sellerListings = new ArrayList<SellerListings>();
        }
        return this.sellerListings;
    }

    /**
     * Sets the value of the sellerListings property.
     * 
     * @param sellerListings
     *     allowed object is
     *     {@link SellerListings }
     *     
     */
    public void setSellerListings(List<SellerListings> sellerListings) {
        this.sellerListings = sellerListings;
    }

}
