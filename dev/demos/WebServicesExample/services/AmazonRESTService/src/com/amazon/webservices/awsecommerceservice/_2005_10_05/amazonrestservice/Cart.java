
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
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Request" minOccurs="0"/>
 *         &lt;element name="CartId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="HMAC" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="URLEncodedHMAC" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="PurchaseURL" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="SubTotal" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartItems" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SavedForLaterItems" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SimilarProducts" minOccurs="0"/>
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
    "request",
    "cartId",
    "hmac",
    "urlEncodedHMAC",
    "purchaseURL",
    "subTotal",
    "cartItems",
    "savedForLaterItems",
    "similarProducts"
})
@XmlRootElement(name = "Cart", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class Cart {

    @XmlElement(name = "Request", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Request request;
    @XmlElement(name = "CartId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String cartId;
    @XmlElement(name = "HMAC", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String hmac;
    @XmlElement(name = "URLEncodedHMAC", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String urlEncodedHMAC;
    @XmlElement(name = "PurchaseURL", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String purchaseURL;
    @XmlElement(name = "SubTotal", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType subTotal;
    @XmlElement(name = "CartItems", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartItems cartItems;
    @XmlElement(name = "SavedForLaterItems", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SavedForLaterItems savedForLaterItems;
    @XmlElement(name = "SimilarProducts", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SimilarProducts similarProducts;

    /**
     * Gets the value of the request property.
     * 
     * @return
     *     possible object is
     *     {@link Request }
     *     
     */
    public Request getRequest() {
        return request;
    }

    /**
     * Sets the value of the request property.
     * 
     * @param value
     *     allowed object is
     *     {@link Request }
     *     
     */
    public void setRequest(Request value) {
        this.request = value;
    }

    /**
     * Gets the value of the cartId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCartId() {
        return cartId;
    }

    /**
     * Sets the value of the cartId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCartId(String value) {
        this.cartId = value;
    }

    /**
     * Gets the value of the hmac property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getHMAC() {
        return hmac;
    }

    /**
     * Sets the value of the hmac property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setHMAC(String value) {
        this.hmac = value;
    }

    /**
     * Gets the value of the urlEncodedHMAC property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getURLEncodedHMAC() {
        return urlEncodedHMAC;
    }

    /**
     * Sets the value of the urlEncodedHMAC property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setURLEncodedHMAC(String value) {
        this.urlEncodedHMAC = value;
    }

    /**
     * Gets the value of the purchaseURL property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPurchaseURL() {
        return purchaseURL;
    }

    /**
     * Sets the value of the purchaseURL property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPurchaseURL(String value) {
        this.purchaseURL = value;
    }

    /**
     * Gets the value of the subTotal property.
     * 
     * @return
     *     possible object is
     *     {@link PriceType }
     *     
     */
    public PriceType getSubTotal() {
        return subTotal;
    }

    /**
     * Sets the value of the subTotal property.
     * 
     * @param value
     *     allowed object is
     *     {@link PriceType }
     *     
     */
    public void setSubTotal(PriceType value) {
        this.subTotal = value;
    }

    /**
     * Gets the value of the cartItems property.
     * 
     * @return
     *     possible object is
     *     {@link CartItems }
     *     
     */
    public CartItems getCartItems() {
        return cartItems;
    }

    /**
     * Sets the value of the cartItems property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartItems }
     *     
     */
    public void setCartItems(CartItems value) {
        this.cartItems = value;
    }

    /**
     * Gets the value of the savedForLaterItems property.
     * 
     * @return
     *     possible object is
     *     {@link SavedForLaterItems }
     *     
     */
    public SavedForLaterItems getSavedForLaterItems() {
        return savedForLaterItems;
    }

    /**
     * Sets the value of the savedForLaterItems property.
     * 
     * @param value
     *     allowed object is
     *     {@link SavedForLaterItems }
     *     
     */
    public void setSavedForLaterItems(SavedForLaterItems value) {
        this.savedForLaterItems = value;
    }

    /**
     * Gets the value of the similarProducts property.
     * 
     * @return
     *     possible object is
     *     {@link SimilarProducts }
     *     
     */
    public SimilarProducts getSimilarProducts() {
        return similarProducts;
    }

    /**
     * Sets the value of the similarProducts property.
     * 
     * @param value
     *     allowed object is
     *     {@link SimilarProducts }
     *     
     */
    public void setSimilarProducts(SimilarProducts value) {
        this.similarProducts = value;
    }

}
