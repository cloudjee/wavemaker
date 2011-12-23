
package com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for CartItem complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="CartItem">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="CartItemId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="ASIN" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ExchangeId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="MerchantId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="SellerId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="SellerNickname" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Quantity" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="Title" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ProductGroup" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ListOwner" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ListType" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Price" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price" minOccurs="0"/>
 *         &lt;element name="ItemTotal" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "CartItem", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", propOrder = {
    "cartItemId",
    "asin",
    "exchangeId",
    "merchantId",
    "sellerId",
    "sellerNickname",
    "quantity",
    "title",
    "productGroup",
    "listOwner",
    "listType",
    "price",
    "itemTotal"
})
public class CartItemType {

    @XmlElement(name = "CartItemId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String cartItemId;
    @XmlElement(name = "ASIN", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String asin;
    @XmlElement(name = "ExchangeId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String exchangeId;
    @XmlElement(name = "MerchantId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String merchantId;
    @XmlElement(name = "SellerId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String sellerId;
    @XmlElement(name = "SellerNickname", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String sellerNickname;
    @XmlElement(name = "Quantity", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String quantity;
    @XmlElement(name = "Title", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String title;
    @XmlElement(name = "ProductGroup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String productGroup;
    @XmlElement(name = "ListOwner", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String listOwner;
    @XmlElement(name = "ListType", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String listType;
    @XmlElement(name = "Price", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType price;
    @XmlElement(name = "ItemTotal", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType itemTotal;

    /**
     * Gets the value of the cartItemId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCartItemId() {
        return cartItemId;
    }

    /**
     * Sets the value of the cartItemId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCartItemId(String value) {
        this.cartItemId = value;
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
     * Gets the value of the merchantId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMerchantId() {
        return merchantId;
    }

    /**
     * Sets the value of the merchantId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMerchantId(String value) {
        this.merchantId = value;
    }

    /**
     * Gets the value of the sellerId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSellerId() {
        return sellerId;
    }

    /**
     * Sets the value of the sellerId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSellerId(String value) {
        this.sellerId = value;
    }

    /**
     * Gets the value of the sellerNickname property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSellerNickname() {
        return sellerNickname;
    }

    /**
     * Sets the value of the sellerNickname property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSellerNickname(String value) {
        this.sellerNickname = value;
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
     * Gets the value of the productGroup property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getProductGroup() {
        return productGroup;
    }

    /**
     * Sets the value of the productGroup property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setProductGroup(String value) {
        this.productGroup = value;
    }

    /**
     * Gets the value of the listOwner property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getListOwner() {
        return listOwner;
    }

    /**
     * Sets the value of the listOwner property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setListOwner(String value) {
        this.listOwner = value;
    }

    /**
     * Gets the value of the listType property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getListType() {
        return listType;
    }

    /**
     * Sets the value of the listType property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setListType(String value) {
        this.listType = value;
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
     * Gets the value of the itemTotal property.
     * 
     * @return
     *     possible object is
     *     {@link PriceType }
     *     
     */
    public PriceType getItemTotal() {
        return itemTotal;
    }

    /**
     * Sets the value of the itemTotal property.
     * 
     * @param value
     *     allowed object is
     *     {@link PriceType }
     *     
     */
    public void setItemTotal(PriceType value) {
        this.itemTotal = value;
    }

}
