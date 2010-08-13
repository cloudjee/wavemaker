
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
 *         &lt;element name="SubTotal" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price" minOccurs="0"/>
 *         &lt;element name="CartItem" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartItem" maxOccurs="unbounded"/>
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
    "subTotal",
    "cartItems"
})
@XmlRootElement(name = "CartItems", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class CartItems {

    @XmlElement(name = "SubTotal", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType subTotal;
    @XmlElement(name = "CartItem", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected List<CartItemType> cartItems;

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
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the cartItems property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getCartItems().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link CartItemType }
     * 
     * 
     */
    public List<CartItemType> getCartItems() {
        if (cartItems == null) {
            cartItems = new ArrayList<CartItemType>();
        }
        return this.cartItems;
    }

    /**
     * Sets the value of the cartItems property.
     * 
     * @param cartItems
     *     allowed object is
     *     {@link CartItemType }
     *     
     */
    public void setCartItems(List<CartItemType> cartItems) {
        this.cartItems = cartItems;
    }

}
