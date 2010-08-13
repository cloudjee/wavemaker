
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
 *         &lt;element name="ExchangeId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ListingId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ASIN" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Title" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Price" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price" minOccurs="0"/>
 *         &lt;element name="StartDate" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="EndDate" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Status" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Quantity" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="QuantityAllocated" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Condition" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="SubCondition" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ConditionNote" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Availability" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="FeaturedCategory" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Seller" minOccurs="0"/>
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
    "exchangeId",
    "listingId",
    "asin",
    "title",
    "price",
    "startDate",
    "endDate",
    "status",
    "quantity",
    "quantityAllocated",
    "condition",
    "subCondition",
    "conditionNote",
    "availability",
    "featuredCategory",
    "seller"
})
@XmlRootElement(name = "SellerListing", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class SellerListing {

    @XmlElement(name = "ExchangeId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String exchangeId;
    @XmlElement(name = "ListingId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String listingId;
    @XmlElement(name = "ASIN", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String asin;
    @XmlElement(name = "Title", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String title;
    @XmlElement(name = "Price", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType price;
    @XmlElement(name = "StartDate", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String startDate;
    @XmlElement(name = "EndDate", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String endDate;
    @XmlElement(name = "Status", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String status;
    @XmlElement(name = "Quantity", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String quantity;
    @XmlElement(name = "QuantityAllocated", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String quantityAllocated;
    @XmlElement(name = "Condition", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String condition;
    @XmlElement(name = "SubCondition", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String subCondition;
    @XmlElement(name = "ConditionNote", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String conditionNote;
    @XmlElement(name = "Availability", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String availability;
    @XmlElement(name = "FeaturedCategory", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String featuredCategory;
    @XmlElement(name = "Seller", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Seller seller;

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
     * Gets the value of the listingId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getListingId() {
        return listingId;
    }

    /**
     * Sets the value of the listingId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setListingId(String value) {
        this.listingId = value;
    }

    /**
     * Gets the value of the asin property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getASIN() {
        return asin;
    }

    /**
     * Sets the value of the asin property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setASIN(String value) {
        this.asin = value;
    }

    /**
     * Gets the value of the title property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the value of the title property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTitle(String value) {
        this.title = value;
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
     * Gets the value of the startDate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStartDate() {
        return startDate;
    }

    /**
     * Sets the value of the startDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStartDate(String value) {
        this.startDate = value;
    }

    /**
     * Gets the value of the endDate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEndDate() {
        return endDate;
    }

    /**
     * Sets the value of the endDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEndDate(String value) {
        this.endDate = value;
    }

    /**
     * Gets the value of the status property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStatus() {
        return status;
    }

    /**
     * Sets the value of the status property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStatus(String value) {
        this.status = value;
    }

    /**
     * Gets the value of the quantity property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getQuantity() {
        return quantity;
    }

    /**
     * Sets the value of the quantity property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setQuantity(String value) {
        this.quantity = value;
    }

    /**
     * Gets the value of the quantityAllocated property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getQuantityAllocated() {
        return quantityAllocated;
    }

    /**
     * Sets the value of the quantityAllocated property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setQuantityAllocated(String value) {
        this.quantityAllocated = value;
    }

    /**
     * Gets the value of the condition property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCondition() {
        return condition;
    }

    /**
     * Sets the value of the condition property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCondition(String value) {
        this.condition = value;
    }

    /**
     * Gets the value of the subCondition property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSubCondition() {
        return subCondition;
    }

    /**
     * Sets the value of the subCondition property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSubCondition(String value) {
        this.subCondition = value;
    }

    /**
     * Gets the value of the conditionNote property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getConditionNote() {
        return conditionNote;
    }

    /**
     * Sets the value of the conditionNote property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setConditionNote(String value) {
        this.conditionNote = value;
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
     * Gets the value of the featuredCategory property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFeaturedCategory() {
        return featuredCategory;
    }

    /**
     * Sets the value of the featuredCategory property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFeaturedCategory(String value) {
        this.featuredCategory = value;
    }

    /**
     * Gets the value of the seller property.
     * 
     * @return
     *     possible object is
     *     {@link Seller }
     *     
     */
    public Seller getSeller() {
        return seller;
    }

    /**
     * Sets the value of the seller property.
     * 
     * @param value
     *     allowed object is
     *     {@link Seller }
     *     
     */
    public void setSeller(Seller value) {
        this.seller = value;
    }

}
