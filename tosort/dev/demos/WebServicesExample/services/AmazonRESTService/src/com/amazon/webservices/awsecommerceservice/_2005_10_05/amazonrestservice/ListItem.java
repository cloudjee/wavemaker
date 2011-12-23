
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
 *         &lt;element name="ListItemId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="DateAdded" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Comment" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="QuantityDesired" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="QuantityReceived" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Item" minOccurs="0"/>
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
    "listItemId",
    "dateAdded",
    "comment",
    "quantityDesired",
    "quantityReceived",
    "item"
})
@XmlRootElement(name = "ListItem", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class ListItem {

    @XmlElement(name = "ListItemId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String listItemId;
    @XmlElement(name = "DateAdded", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String dateAdded;
    @XmlElement(name = "Comment", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String comment;
    @XmlElement(name = "QuantityDesired", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String quantityDesired;
    @XmlElement(name = "QuantityReceived", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String quantityReceived;
    @XmlElement(name = "Item", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Item item;

    /**
     * Gets the value of the listItemId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getListItemId() {
        return listItemId;
    }

    /**
     * Sets the value of the listItemId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setListItemId(String value) {
        this.listItemId = value;
    }

    /**
     * Gets the value of the dateAdded property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDateAdded() {
        return dateAdded;
    }

    /**
     * Sets the value of the dateAdded property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDateAdded(String value) {
        this.dateAdded = value;
    }

    /**
     * Gets the value of the comment property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getComment() {
        return comment;
    }

    /**
     * Sets the value of the comment property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setComment(String value) {
        this.comment = value;
    }

    /**
     * Gets the value of the quantityDesired property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getQuantityDesired() {
        return quantityDesired;
    }

    /**
     * Sets the value of the quantityDesired property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setQuantityDesired(String value) {
        this.quantityDesired = value;
    }

    /**
     * Gets the value of the quantityReceived property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getQuantityReceived() {
        return quantityReceived;
    }

    /**
     * Sets the value of the quantityReceived property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setQuantityReceived(String value) {
        this.quantityReceived = value;
    }

    /**
     * Gets the value of the item property.
     * 
     * @return
     *     possible object is
     *     {@link Item }
     *     
     */
    public Item getItem() {
        return item;
    }

    /**
     * Sets the value of the item property.
     * 
     * @param value
     *     allowed object is
     *     {@link Item }
     *     
     */
    public void setItem(Item value) {
        this.item = value;
    }

}
