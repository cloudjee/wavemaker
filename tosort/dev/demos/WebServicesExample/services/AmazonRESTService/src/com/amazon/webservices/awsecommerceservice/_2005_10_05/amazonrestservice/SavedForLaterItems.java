
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
 *         &lt;element name="SavedForLaterItem" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartItem" maxOccurs="unbounded"/>
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
    "savedForLaterItems"
})
@XmlRootElement(name = "SavedForLaterItems", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class SavedForLaterItems {

    @XmlElement(name = "SubTotal", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PriceType subTotal;
    @XmlElement(name = "SavedForLaterItem", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected List<CartItemType> savedForLaterItems;

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
     * Gets the value of the savedForLaterItems property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the savedForLaterItems property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getSavedForLaterItems().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link CartItemType }
     * 
     * 
     */
    public List<CartItemType> getSavedForLaterItems() {
        if (savedForLaterItems == null) {
            savedForLaterItems = new ArrayList<CartItemType>();
        }
        return this.savedForLaterItems;
    }

    /**
     * Sets the value of the savedForLaterItems property.
     * 
     * @param savedForLaterItems
     *     allowed object is
     *     {@link CartItemType }
     *     
     */
    public void setSavedForLaterItems(List<CartItemType> savedForLaterItems) {
        this.savedForLaterItems = savedForLaterItems;
    }

}
