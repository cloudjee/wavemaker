
package com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice;

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
 *         &lt;element name="OfferListingId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ExchangeId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Price" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price" minOccurs="0"/>
 *         &lt;element name="SalePrice" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price" minOccurs="0"/>
 *         &lt;element name="Availability" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ISPUStoreAddress" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Address" minOccurs="0"/>
 *         &lt;element name="ISPUStoreHours" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="IsEligibleForSuperSaverShipping" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
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
    "offerListingId",
    "exchangeId",
    "price",
    "salePrice",
    "availability",
    "ispuStoreAddress",
    "ispuStoreHours",
    "isEligibleForSuperSaverShipping"
})
@XmlRootElement(name = "OfferListing", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class OfferListing {

    @XmlElement(name = "OfferListingId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String offerListingId;
    @XmlElement(name = "ExchangeId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String exchangeId;
    @XmlElement(name = "Price", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType price;
    @XmlElement(name = "SalePrice", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType salePrice;
    @XmlElement(name = "Availability", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String availability;
    @XmlElement(name = "ISPUStoreAddress", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected AddressType ispuStoreAddress;
    @XmlElement(name = "ISPUStoreHours", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String ispuStoreHours;
    @XmlElement(name = "IsEligibleForSuperSaverShipping", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Boolean isEligibleForSuperSaverShipping;

    /**
     * Gets the value of the offerListingId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getOfferListingId() {
        return offerListingId;
    }

    /**
     * Sets the value of the offerListingId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setOfferListingId(String value) {
        this.offerListingId = value;
    }

    /**
     * Gets the value of the exchangeId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getExchangeId() {
        return exchangeId;
    }

    /**
     * Sets the value of the exchangeId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setExchangeId(String value) {
        this.exchangeId = value;
    }

    /**
     * Gets the value of the price property.
     * 
     * @return
     *     possible object is
     *     {@link PriceType }
     *     
     */
    public PriceType getPrice() {
        return price;
    }

    /**
     * Sets the value of the price property.
     * 
     * @param value
     *     allowed object is
     *     {@link PriceType }
     *     
     */
    public void setPrice(PriceType value) {
        this.price = value;
    }

    /**
     * Gets the value of the salePrice property.
     * 
     * @return
     *     possible object is
     *     {@link PriceType }
     *     
     */
    public PriceType getSalePrice() {
        return salePrice;
    }

    /**
     * Sets the value of the salePrice property.
     * 
     * @param value
     *     allowed object is
     *     {@link PriceType }
     *     
     */
    public void setSalePrice(PriceType value) {
        this.salePrice = value;
    }

    /**
     * Gets the value of the availability property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAvailability() {
        return availability;
    }

    /**
     * Sets the value of the availability property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAvailability(String value) {
        this.availability = value;
    }

    /**
     * Gets the value of the ispuStoreAddress property.
     * 
     * @return
     *     possible object is
     *     {@link AddressType }
     *     
     */
    public AddressType getISPUStoreAddress() {
        return ispuStoreAddress;
    }

    /**
     * Sets the value of the ispuStoreAddress property.
     * 
     * @param value
     *     allowed object is
     *     {@link AddressType }
     *     
     */
    public void setISPUStoreAddress(AddressType value) {
        this.ispuStoreAddress = value;
    }

    /**
     * Gets the value of the ispuStoreHours property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getISPUStoreHours() {
        return ispuStoreHours;
    }

    /**
     * Sets the value of the ispuStoreHours property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setISPUStoreHours(String value) {
        this.ispuStoreHours = value;
    }

    /**
     * Gets the value of the isEligibleForSuperSaverShipping property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean getIsEligibleForSuperSaverShipping() {
        return isEligibleForSuperSaverShipping;
    }

    /**
     * Sets the value of the isEligibleForSuperSaverShipping property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setIsEligibleForSuperSaverShipping(Boolean value) {
        this.isEligibleForSuperSaverShipping = value;
    }

}
