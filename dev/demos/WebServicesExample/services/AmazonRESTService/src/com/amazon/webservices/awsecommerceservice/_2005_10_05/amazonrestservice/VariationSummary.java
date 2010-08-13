
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
 *         &lt;element name="LowestPrice" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price" minOccurs="0"/>
 *         &lt;element name="HighestPrice" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price" minOccurs="0"/>
 *         &lt;element name="LowestSalePrice" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price" minOccurs="0"/>
 *         &lt;element name="HighestSalePrice" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price" minOccurs="0"/>
 *         &lt;element name="SingleMerchantId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
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
    "lowestPrice",
    "highestPrice",
    "lowestSalePrice",
    "highestSalePrice",
    "singleMerchantId"
})
@XmlRootElement(name = "VariationSummary", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class VariationSummary {

    @XmlElement(name = "LowestPrice", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType lowestPrice;
    @XmlElement(name = "HighestPrice", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType highestPrice;
    @XmlElement(name = "LowestSalePrice", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType lowestSalePrice;
    @XmlElement(name = "HighestSalePrice", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType highestSalePrice;
    @XmlElement(name = "SingleMerchantId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String singleMerchantId;

    /**
     * Gets the value of the lowestPrice property.
     * 
     * @return
     *     possible object is
     *     {@link PriceType }
     *     
     */
    public PriceType getLowestPrice() {
        return lowestPrice;
    }

    /**
     * Sets the value of the lowestPrice property.
     * 
     * @param value
     *     allowed object is
     *     {@link PriceType }
     *     
     */
    public void setLowestPrice(PriceType value) {
        this.lowestPrice = value;
    }

    /**
     * Gets the value of the highestPrice property.
     * 
     * @return
     *     possible object is
     *     {@link PriceType }
     *     
     */
    public PriceType getHighestPrice() {
        return highestPrice;
    }

    /**
     * Sets the value of the highestPrice property.
     * 
     * @param value
     *     allowed object is
     *     {@link PriceType }
     *     
     */
    public void setHighestPrice(PriceType value) {
        this.highestPrice = value;
    }

    /**
     * Gets the value of the lowestSalePrice property.
     * 
     * @return
     *     possible object is
     *     {@link PriceType }
     *     
     */
    public PriceType getLowestSalePrice() {
        return lowestSalePrice;
    }

    /**
     * Sets the value of the lowestSalePrice property.
     * 
     * @param value
     *     allowed object is
     *     {@link PriceType }
     *     
     */
    public void setLowestSalePrice(PriceType value) {
        this.lowestSalePrice = value;
    }

    /**
     * Gets the value of the highestSalePrice property.
     * 
     * @return
     *     possible object is
     *     {@link PriceType }
     *     
     */
    public PriceType getHighestSalePrice() {
        return highestSalePrice;
    }

    /**
     * Sets the value of the highestSalePrice property.
     * 
     * @param value
     *     allowed object is
     *     {@link PriceType }
     *     
     */
    public void setHighestSalePrice(PriceType value) {
        this.highestSalePrice = value;
    }

    /**
     * Gets the value of the singleMerchantId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSingleMerchantId() {
        return singleMerchantId;
    }

    /**
     * Sets the value of the singleMerchantId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSingleMerchantId(String value) {
        this.singleMerchantId = value;
    }

}
