
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
 *         &lt;element name="TransactionItemId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="Quantity" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="UnitPrice" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price"/>
 *         &lt;element name="TotalPrice" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price"/>
 *         &lt;element name="ASIN" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ChildTransactionItems" minOccurs="0">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}TransactionItem" maxOccurs="unbounded"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
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
    "transactionItemId",
    "quantity",
    "unitPrice",
    "totalPrice",
    "asin",
    "childTransactionItems"
})
@XmlRootElement(name = "TransactionItem", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class TransactionItem {

    @XmlElement(name = "TransactionItemId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String transactionItemId;
    @XmlElement(name = "Quantity", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String quantity;
    @XmlElement(name = "UnitPrice", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected PriceType unitPrice;
    @XmlElement(name = "TotalPrice", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected PriceType totalPrice;
    @XmlElement(name = "ASIN", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String asin;
    @XmlElement(name = "ChildTransactionItems", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected TransactionItem.ChildTransactionItems childTransactionItems;

    /**
     * Gets the value of the transactionItemId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTransactionItemId() {
        return transactionItemId;
    }

    /**
     * Sets the value of the transactionItemId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTransactionItemId(String value) {
        this.transactionItemId = value;
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
     * Gets the value of the unitPrice property.
     * 
     * @return
     *     possible object is
     *     {@link PriceType }
     *     
     */
    public PriceType getUnitPrice() {
        return unitPrice;
    }

    /**
     * Sets the value of the unitPrice property.
     * 
     * @param value
     *     allowed object is
     *     {@link PriceType }
     *     
     */
    public void setUnitPrice(PriceType value) {
        this.unitPrice = value;
    }

    /**
     * Gets the value of the totalPrice property.
     * 
     * @return
     *     possible object is
     *     {@link PriceType }
     *     
     */
    public PriceType getTotalPrice() {
        return totalPrice;
    }

    /**
     * Sets the value of the totalPrice property.
     * 
     * @param value
     *     allowed object is
     *     {@link PriceType }
     *     
     */
    public void setTotalPrice(PriceType value) {
        this.totalPrice = value;
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
     * Gets the value of the childTransactionItems property.
     * 
     * @return
     *     possible object is
     *     {@link TransactionItem.ChildTransactionItems }
     *     
     */
    public TransactionItem.ChildTransactionItems getChildTransactionItems() {
        return childTransactionItems;
    }

    /**
     * Sets the value of the childTransactionItems property.
     * 
     * @param value
     *     allowed object is
     *     {@link TransactionItem.ChildTransactionItems }
     *     
     */
    public void setChildTransactionItems(TransactionItem.ChildTransactionItems value) {
        this.childTransactionItems = value;
    }


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
     *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}TransactionItem" maxOccurs="unbounded"/>
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
        "transactionItems"
    })
    public static class ChildTransactionItems {

        @XmlElement(name = "TransactionItem", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected List<TransactionItem> transactionItems;

        /**
         * Gets the value of the transactionItems property.
         * 
         * <p>
         * This accessor method returns a reference to the live list,
         * not a snapshot. Therefore any modification you make to the
         * returned list will be present inside the JAXB object.
         * This is why there is not a <CODE>set</CODE> method for the transactionItems property.
         * 
         * <p>
         * For example, to add a new item, do as follows:
         * <pre>
         *    getTransactionItems().add(newItem);
         * </pre>
         * 
         * 
         * <p>
         * Objects of the following type(s) are allowed in the list
         * {@link TransactionItem }
         * 
         * 
         */
        public List<TransactionItem> getTransactionItems() {
            if (transactionItems == null) {
                transactionItems = new ArrayList<TransactionItem>();
            }
            return this.transactionItems;
        }

        /**
         * Sets the value of the transactionItems property.
         * 
         * @param transactionItems
         *     allowed object is
         *     {@link TransactionItem }
         *     
         */
        public void setTransactionItems(List<TransactionItem> transactionItems) {
            this.transactionItems = transactionItems;
        }

    }

}
