
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
 *         &lt;element name="LowestNewPrice" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price" minOccurs="0"/>
 *         &lt;element name="LowestUsedPrice" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price" minOccurs="0"/>
 *         &lt;element name="LowestCollectiblePrice" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price" minOccurs="0"/>
 *         &lt;element name="LowestRefurbishedPrice" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price" minOccurs="0"/>
 *         &lt;element name="TotalNew" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="TotalUsed" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="TotalCollectible" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="TotalRefurbished" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
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
    "lowestNewPrice",
    "lowestUsedPrice",
    "lowestCollectiblePrice",
    "lowestRefurbishedPrice",
    "totalNew",
    "totalUsed",
    "totalCollectible",
    "totalRefurbished"
})
@XmlRootElement(name = "OfferSummary", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class OfferSummary {

    @XmlElement(name = "LowestNewPrice", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType lowestNewPrice;
    @XmlElement(name = "LowestUsedPrice", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType lowestUsedPrice;
    @XmlElement(name = "LowestCollectiblePrice", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType lowestCollectiblePrice;
    @XmlElement(name = "LowestRefurbishedPrice", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType lowestRefurbishedPrice;
    @XmlElement(name = "TotalNew", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String totalNew;
    @XmlElement(name = "TotalUsed", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String totalUsed;
    @XmlElement(name = "TotalCollectible", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String totalCollectible;
    @XmlElement(name = "TotalRefurbished", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String totalRefurbished;

    /**
     * Gets the value of the lowestNewPrice property.
     * 
     * @return
     *     possible object is
     *     {@link PriceType }
     *     
     */
    public PriceType getLowestNewPrice() {
        return lowestNewPrice;
    }

    /**
     * Sets the value of the lowestNewPrice property.
     * 
     * @param value
     *     allowed object is
     *     {@link PriceType }
     *     
     */
    public void setLowestNewPrice(PriceType value) {
        this.lowestNewPrice = value;
    }

    /**
     * Gets the value of the lowestUsedPrice property.
     * 
     * @return
     *     possible object is
     *     {@link PriceType }
     *     
     */
    public PriceType getLowestUsedPrice() {
        return lowestUsedPrice;
    }

    /**
     * Sets the value of the lowestUsedPrice property.
     * 
     * @param value
     *     allowed object is
     *     {@link PriceType }
     *     
     */
    public void setLowestUsedPrice(PriceType value) {
        this.lowestUsedPrice = value;
    }

    /**
     * Gets the value of the lowestCollectiblePrice property.
     * 
     * @return
     *     possible object is
     *     {@link PriceType }
     *     
     */
    public PriceType getLowestCollectiblePrice() {
        return lowestCollectiblePrice;
    }

    /**
     * Sets the value of the lowestCollectiblePrice property.
     * 
     * @param value
     *     allowed object is
     *     {@link PriceType }
     *     
     */
    public void setLowestCollectiblePrice(PriceType value) {
        this.lowestCollectiblePrice = value;
    }

    /**
     * Gets the value of the lowestRefurbishedPrice property.
     * 
     * @return
     *     possible object is
     *     {@link PriceType }
     *     
     */
    public PriceType getLowestRefurbishedPrice() {
        return lowestRefurbishedPrice;
    }

    /**
     * Sets the value of the lowestRefurbishedPrice property.
     * 
     * @param value
     *     allowed object is
     *     {@link PriceType }
     *     
     */
    public void setLowestRefurbishedPrice(PriceType value) {
        this.lowestRefurbishedPrice = value;
    }

    /**
     * Gets the value of the totalNew property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTotalNew() {
        return totalNew;
    }

    /**
     * Sets the value of the totalNew property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTotalNew(String value) {
        this.totalNew = value;
    }

    /**
     * Gets the value of the totalUsed property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTotalUsed() {
        return totalUsed;
    }

    /**
     * Sets the value of the totalUsed property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTotalUsed(String value) {
        this.totalUsed = value;
    }

    /**
     * Gets the value of the totalCollectible property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTotalCollectible() {
        return totalCollectible;
    }

    /**
     * Sets the value of the totalCollectible property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTotalCollectible(String value) {
        this.totalCollectible = value;
    }

    /**
     * Gets the value of the totalRefurbished property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTotalRefurbished() {
        return totalRefurbished;
    }

    /**
     * Sets the value of the totalRefurbished property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTotalRefurbished(String value) {
        this.totalRefurbished = value;
    }

}
