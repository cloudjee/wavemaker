
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
 *         &lt;element name="TransactionId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="SellerId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="Condition" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="TransactionDate" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="TransactionDateEpoch" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="SellerName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="PayingCustomerId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="OrderingCustomerId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Totals" minOccurs="0">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="Total" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price"/>
 *                   &lt;element name="Subtotal" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price"/>
 *                   &lt;element name="Tax" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price"/>
 *                   &lt;element name="ShippingCharge" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price"/>
 *                   &lt;element name="Promotion" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *         &lt;element name="TransactionItems" minOccurs="0">
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
 *         &lt;element name="Shipments" minOccurs="0">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="Shipment" maxOccurs="unbounded">
 *                     &lt;complexType>
 *                       &lt;complexContent>
 *                         &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                           &lt;sequence>
 *                             &lt;element name="Condition" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *                             &lt;element name="DeliveryMethod" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *                             &lt;element name="ShipmentItems" minOccurs="0">
 *                               &lt;complexType>
 *                                 &lt;complexContent>
 *                                   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                                     &lt;sequence>
 *                                       &lt;element name="TransactionItemId" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
 *                                     &lt;/sequence>
 *                                   &lt;/restriction>
 *                                 &lt;/complexContent>
 *                               &lt;/complexType>
 *                             &lt;/element>
 *                             &lt;element name="Packages" minOccurs="0">
 *                               &lt;complexType>
 *                                 &lt;complexContent>
 *                                   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                                     &lt;sequence>
 *                                       &lt;element name="Package" maxOccurs="unbounded">
 *                                         &lt;complexType>
 *                                           &lt;complexContent>
 *                                             &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                                               &lt;sequence>
 *                                                 &lt;element name="TrackingNumber" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *                                                 &lt;element name="CarrierName" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *                                               &lt;/sequence>
 *                                             &lt;/restriction>
 *                                           &lt;/complexContent>
 *                                         &lt;/complexType>
 *                                       &lt;/element>
 *                                     &lt;/sequence>
 *                                   &lt;/restriction>
 *                                 &lt;/complexContent>
 *                               &lt;/complexType>
 *                             &lt;/element>
 *                           &lt;/sequence>
 *                         &lt;/restriction>
 *                       &lt;/complexContent>
 *                     &lt;/complexType>
 *                   &lt;/element>
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
    "transactionId",
    "sellerId",
    "condition",
    "transactionDate",
    "transactionDateEpoch",
    "sellerName",
    "payingCustomerId",
    "orderingCustomerId",
    "totals",
    "transactionItems",
    "shipments"
})
@XmlRootElement(name = "Transaction", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class Transaction {

    @XmlElement(name = "TransactionId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String transactionId;
    @XmlElement(name = "SellerId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String sellerId;
    @XmlElement(name = "Condition", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String condition;
    @XmlElement(name = "TransactionDate", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String transactionDate;
    @XmlElement(name = "TransactionDateEpoch", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String transactionDateEpoch;
    @XmlElement(name = "SellerName", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String sellerName;
    @XmlElement(name = "PayingCustomerId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String payingCustomerId;
    @XmlElement(name = "OrderingCustomerId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String orderingCustomerId;
    @XmlElement(name = "Totals", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Transaction.Totals totals;
    @XmlElement(name = "TransactionItems", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Transaction.TransactionItems transactionItems;
    @XmlElement(name = "Shipments", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Transaction.Shipments shipments;

    /**
     * Gets the value of the transactionId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTransactionId() {
        return transactionId;
    }

    /**
     * Sets the value of the transactionId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTransactionId(String value) {
        this.transactionId = value;
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
     * Gets the value of the transactionDate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTransactionDate() {
        return transactionDate;
    }

    /**
     * Sets the value of the transactionDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTransactionDate(String value) {
        this.transactionDate = value;
    }

    /**
     * Gets the value of the transactionDateEpoch property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTransactionDateEpoch() {
        return transactionDateEpoch;
    }

    /**
     * Sets the value of the transactionDateEpoch property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTransactionDateEpoch(String value) {
        this.transactionDateEpoch = value;
    }

    /**
     * Gets the value of the sellerName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSellerName() {
        return sellerName;
    }

    /**
     * Sets the value of the sellerName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSellerName(String value) {
        this.sellerName = value;
    }

    /**
     * Gets the value of the payingCustomerId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPayingCustomerId() {
        return payingCustomerId;
    }

    /**
     * Sets the value of the payingCustomerId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPayingCustomerId(String value) {
        this.payingCustomerId = value;
    }

    /**
     * Gets the value of the orderingCustomerId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getOrderingCustomerId() {
        return orderingCustomerId;
    }

    /**
     * Sets the value of the orderingCustomerId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setOrderingCustomerId(String value) {
        this.orderingCustomerId = value;
    }

    /**
     * Gets the value of the totals property.
     * 
     * @return
     *     possible object is
     *     {@link Transaction.Totals }
     *     
     */
    public Transaction.Totals getTotals() {
        return totals;
    }

    /**
     * Sets the value of the totals property.
     * 
     * @param value
     *     allowed object is
     *     {@link Transaction.Totals }
     *     
     */
    public void setTotals(Transaction.Totals value) {
        this.totals = value;
    }

    /**
     * Gets the value of the transactionItems property.
     * 
     * @return
     *     possible object is
     *     {@link Transaction.TransactionItems }
     *     
     */
    public Transaction.TransactionItems getTransactionItems() {
        return transactionItems;
    }

    /**
     * Sets the value of the transactionItems property.
     * 
     * @param value
     *     allowed object is
     *     {@link Transaction.TransactionItems }
     *     
     */
    public void setTransactionItems(Transaction.TransactionItems value) {
        this.transactionItems = value;
    }

    /**
     * Gets the value of the shipments property.
     * 
     * @return
     *     possible object is
     *     {@link Transaction.Shipments }
     *     
     */
    public Transaction.Shipments getShipments() {
        return shipments;
    }

    /**
     * Sets the value of the shipments property.
     * 
     * @param value
     *     allowed object is
     *     {@link Transaction.Shipments }
     *     
     */
    public void setShipments(Transaction.Shipments value) {
        this.shipments = value;
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
     *         &lt;element name="Shipment" maxOccurs="unbounded">
     *           &lt;complexType>
     *             &lt;complexContent>
     *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *                 &lt;sequence>
     *                   &lt;element name="Condition" type="{http://www.w3.org/2001/XMLSchema}string"/>
     *                   &lt;element name="DeliveryMethod" type="{http://www.w3.org/2001/XMLSchema}string"/>
     *                   &lt;element name="ShipmentItems" minOccurs="0">
     *                     &lt;complexType>
     *                       &lt;complexContent>
     *                         &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *                           &lt;sequence>
     *                             &lt;element name="TransactionItemId" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
     *                           &lt;/sequence>
     *                         &lt;/restriction>
     *                       &lt;/complexContent>
     *                     &lt;/complexType>
     *                   &lt;/element>
     *                   &lt;element name="Packages" minOccurs="0">
     *                     &lt;complexType>
     *                       &lt;complexContent>
     *                         &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *                           &lt;sequence>
     *                             &lt;element name="Package" maxOccurs="unbounded">
     *                               &lt;complexType>
     *                                 &lt;complexContent>
     *                                   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *                                     &lt;sequence>
     *                                       &lt;element name="TrackingNumber" type="{http://www.w3.org/2001/XMLSchema}string"/>
     *                                       &lt;element name="CarrierName" type="{http://www.w3.org/2001/XMLSchema}string"/>
     *                                     &lt;/sequence>
     *                                   &lt;/restriction>
     *                                 &lt;/complexContent>
     *                               &lt;/complexType>
     *                             &lt;/element>
     *                           &lt;/sequence>
     *                         &lt;/restriction>
     *                       &lt;/complexContent>
     *                     &lt;/complexType>
     *                   &lt;/element>
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
        "shipments"
    })
    public static class Shipments {

        @XmlElement(name = "Shipment", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected List<Transaction.Shipments.Shipment> shipments;

        /**
         * Gets the value of the shipments property.
         * 
         * <p>
         * This accessor method returns a reference to the live list,
         * not a snapshot. Therefore any modification you make to the
         * returned list will be present inside the JAXB object.
         * This is why there is not a <CODE>set</CODE> method for the shipments property.
         * 
         * <p>
         * For example, to add a new item, do as follows:
         * <pre>
         *    getShipments().add(newItem);
         * </pre>
         * 
         * 
         * <p>
         * Objects of the following type(s) are allowed in the list
         * {@link Transaction.Shipments.Shipment }
         * 
         * 
         */
        public List<Transaction.Shipments.Shipment> getShipments() {
            if (shipments == null) {
                shipments = new ArrayList<Transaction.Shipments.Shipment>();
            }
            return this.shipments;
        }

        /**
         * Sets the value of the shipments property.
         * 
         * @param shipments
         *     allowed object is
         *     {@link Transaction.Shipments.Shipment }
         *     
         */
        public void setShipments(List<Transaction.Shipments.Shipment> shipments) {
            this.shipments = shipments;
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
         *         &lt;element name="Condition" type="{http://www.w3.org/2001/XMLSchema}string"/>
         *         &lt;element name="DeliveryMethod" type="{http://www.w3.org/2001/XMLSchema}string"/>
         *         &lt;element name="ShipmentItems" minOccurs="0">
         *           &lt;complexType>
         *             &lt;complexContent>
         *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
         *                 &lt;sequence>
         *                   &lt;element name="TransactionItemId" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
         *                 &lt;/sequence>
         *               &lt;/restriction>
         *             &lt;/complexContent>
         *           &lt;/complexType>
         *         &lt;/element>
         *         &lt;element name="Packages" minOccurs="0">
         *           &lt;complexType>
         *             &lt;complexContent>
         *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
         *                 &lt;sequence>
         *                   &lt;element name="Package" maxOccurs="unbounded">
         *                     &lt;complexType>
         *                       &lt;complexContent>
         *                         &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
         *                           &lt;sequence>
         *                             &lt;element name="TrackingNumber" type="{http://www.w3.org/2001/XMLSchema}string"/>
         *                             &lt;element name="CarrierName" type="{http://www.w3.org/2001/XMLSchema}string"/>
         *                           &lt;/sequence>
         *                         &lt;/restriction>
         *                       &lt;/complexContent>
         *                     &lt;/complexType>
         *                   &lt;/element>
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
            "condition",
            "deliveryMethod",
            "shipmentItems",
            "packages"
        })
        public static class Shipment {

            @XmlElement(name = "Condition", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
            protected String condition;
            @XmlElement(name = "DeliveryMethod", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
            protected String deliveryMethod;
            @XmlElement(name = "ShipmentItems", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
            protected Transaction.Shipments.Shipment.ShipmentItems shipmentItems;
            @XmlElement(name = "Packages", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
            protected Transaction.Shipments.Shipment.Packages packages;

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
             * Gets the value of the deliveryMethod property.
             * 
             * @return
             *     possible object is
             *     {@link String }
             *     
             */
            public String getDeliveryMethod() {
                return deliveryMethod;
            }

            /**
             * Sets the value of the deliveryMethod property.
             * 
             * @param value
             *     allowed object is
             *     {@link String }
             *     
             */
            public void setDeliveryMethod(String value) {
                this.deliveryMethod = value;
            }

            /**
             * Gets the value of the shipmentItems property.
             * 
             * @return
             *     possible object is
             *     {@link Transaction.Shipments.Shipment.ShipmentItems }
             *     
             */
            public Transaction.Shipments.Shipment.ShipmentItems getShipmentItems() {
                return shipmentItems;
            }

            /**
             * Sets the value of the shipmentItems property.
             * 
             * @param value
             *     allowed object is
             *     {@link Transaction.Shipments.Shipment.ShipmentItems }
             *     
             */
            public void setShipmentItems(Transaction.Shipments.Shipment.ShipmentItems value) {
                this.shipmentItems = value;
            }

            /**
             * Gets the value of the packages property.
             * 
             * @return
             *     possible object is
             *     {@link Transaction.Shipments.Shipment.Packages }
             *     
             */
            public Transaction.Shipments.Shipment.Packages getPackages() {
                return packages;
            }

            /**
             * Sets the value of the packages property.
             * 
             * @param value
             *     allowed object is
             *     {@link Transaction.Shipments.Shipment.Packages }
             *     
             */
            public void setPackages(Transaction.Shipments.Shipment.Packages value) {
                this.packages = value;
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
             *         &lt;element name="Package" maxOccurs="unbounded">
             *           &lt;complexType>
             *             &lt;complexContent>
             *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
             *                 &lt;sequence>
             *                   &lt;element name="TrackingNumber" type="{http://www.w3.org/2001/XMLSchema}string"/>
             *                   &lt;element name="CarrierName" type="{http://www.w3.org/2001/XMLSchema}string"/>
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
                "packages"
            })
            public static class Packages {

                @XmlElement(name = "Package", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
                protected List<Transaction.Shipments.Shipment.Packages.Package> packages;

                /**
                 * Gets the value of the packages property.
                 * 
                 * <p>
                 * This accessor method returns a reference to the live list,
                 * not a snapshot. Therefore any modification you make to the
                 * returned list will be present inside the JAXB object.
                 * This is why there is not a <CODE>set</CODE> method for the packages property.
                 * 
                 * <p>
                 * For example, to add a new item, do as follows:
                 * <pre>
                 *    getPackages().add(newItem);
                 * </pre>
                 * 
                 * 
                 * <p>
                 * Objects of the following type(s) are allowed in the list
                 * {@link Transaction.Shipments.Shipment.Packages.Package }
                 * 
                 * 
                 */
                public List<Transaction.Shipments.Shipment.Packages.Package> getPackages() {
                    if (packages == null) {
                        packages = new ArrayList<Transaction.Shipments.Shipment.Packages.Package>();
                    }
                    return this.packages;
                }

                /**
                 * Sets the value of the packages property.
                 * 
                 * @param packages
                 *     allowed object is
                 *     {@link Transaction.Shipments.Shipment.Packages.Package }
                 *     
                 */
                public void setPackages(List<Transaction.Shipments.Shipment.Packages.Package> packages) {
                    this.packages = packages;
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
                 *         &lt;element name="TrackingNumber" type="{http://www.w3.org/2001/XMLSchema}string"/>
                 *         &lt;element name="CarrierName" type="{http://www.w3.org/2001/XMLSchema}string"/>
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
                    "trackingNumber",
                    "carrierName"
                })
                public static class Package {

                    @XmlElement(name = "TrackingNumber", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
                    protected String trackingNumber;
                    @XmlElement(name = "CarrierName", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
                    protected String carrierName;

                    /**
                     * Gets the value of the trackingNumber property.
                     * 
                     * @return
                     *     possible object is
                     *     {@link String }
                     *     
                     */
                    public String getTrackingNumber() {
                        return trackingNumber;
                    }

                    /**
                     * Sets the value of the trackingNumber property.
                     * 
                     * @param value
                     *     allowed object is
                     *     {@link String }
                     *     
                     */
                    public void setTrackingNumber(String value) {
                        this.trackingNumber = value;
                    }

                    /**
                     * Gets the value of the carrierName property.
                     * 
                     * @return
                     *     possible object is
                     *     {@link String }
                     *     
                     */
                    public String getCarrierName() {
                        return carrierName;
                    }

                    /**
                     * Sets the value of the carrierName property.
                     * 
                     * @param value
                     *     allowed object is
                     *     {@link String }
                     *     
                     */
                    public void setCarrierName(String value) {
                        this.carrierName = value;
                    }

                }

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
             *         &lt;element name="TransactionItemId" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
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
                "transactionItemIds"
            })
            public static class ShipmentItems {

                @XmlElement(name = "TransactionItemId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
                protected List<String> transactionItemIds;

                /**
                 * Gets the value of the transactionItemIds property.
                 * 
                 * <p>
                 * This accessor method returns a reference to the live list,
                 * not a snapshot. Therefore any modification you make to the
                 * returned list will be present inside the JAXB object.
                 * This is why there is not a <CODE>set</CODE> method for the transactionItemIds property.
                 * 
                 * <p>
                 * For example, to add a new item, do as follows:
                 * <pre>
                 *    getTransactionItemIds().add(newItem);
                 * </pre>
                 * 
                 * 
                 * <p>
                 * Objects of the following type(s) are allowed in the list
                 * {@link String }
                 * 
                 * 
                 */
                public List<String> getTransactionItemIds() {
                    if (transactionItemIds == null) {
                        transactionItemIds = new ArrayList<String>();
                    }
                    return this.transactionItemIds;
                }

                /**
                 * Sets the value of the transactionItemIds property.
                 * 
                 * @param transactionItemIds
                 *     allowed object is
                 *     {@link String }
                 *     
                 */
                public void setTransactionItemIds(List<String> transactionItemIds) {
                    this.transactionItemIds = transactionItemIds;
                }

            }

        }

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
     *         &lt;element name="Total" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price"/>
     *         &lt;element name="Subtotal" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price"/>
     *         &lt;element name="Tax" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price"/>
     *         &lt;element name="ShippingCharge" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price"/>
     *         &lt;element name="Promotion" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Price"/>
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
        "total",
        "subtotal",
        "tax",
        "shippingCharge",
        "promotion"
    })
    public static class Totals {

        @XmlElement(name = "Total", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected PriceType total;
        @XmlElement(name = "Subtotal", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected PriceType subtotal;
        @XmlElement(name = "Tax", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected PriceType tax;
        @XmlElement(name = "ShippingCharge", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected PriceType shippingCharge;
        @XmlElement(name = "Promotion", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected PriceType promotion;

        /**
         * Gets the value of the total property.
         * 
         * @return
         *     possible object is
         *     {@link PriceType }
         *     
         */
        public PriceType getTotal() {
            return total;
        }

        /**
         * Sets the value of the total property.
         * 
         * @param value
         *     allowed object is
         *     {@link PriceType }
         *     
         */
        public void setTotal(PriceType value) {
            this.total = value;
        }

        /**
         * Gets the value of the subtotal property.
         * 
         * @return
         *     possible object is
         *     {@link PriceType }
         *     
         */
        public PriceType getSubtotal() {
            return subtotal;
        }

        /**
         * Sets the value of the subtotal property.
         * 
         * @param value
         *     allowed object is
         *     {@link PriceType }
         *     
         */
        public void setSubtotal(PriceType value) {
            this.subtotal = value;
        }

        /**
         * Gets the value of the tax property.
         * 
         * @return
         *     possible object is
         *     {@link PriceType }
         *     
         */
        public PriceType getTax() {
            return tax;
        }

        /**
         * Sets the value of the tax property.
         * 
         * @param value
         *     allowed object is
         *     {@link PriceType }
         *     
         */
        public void setTax(PriceType value) {
            this.tax = value;
        }

        /**
         * Gets the value of the shippingCharge property.
         * 
         * @return
         *     possible object is
         *     {@link PriceType }
         *     
         */
        public PriceType getShippingCharge() {
            return shippingCharge;
        }

        /**
         * Sets the value of the shippingCharge property.
         * 
         * @param value
         *     allowed object is
         *     {@link PriceType }
         *     
         */
        public void setShippingCharge(PriceType value) {
            this.shippingCharge = value;
        }

        /**
         * Gets the value of the promotion property.
         * 
         * @return
         *     possible object is
         *     {@link PriceType }
         *     
         */
        public PriceType getPromotion() {
            return promotion;
        }

        /**
         * Sets the value of the promotion property.
         * 
         * @param value
         *     allowed object is
         *     {@link PriceType }
         *     
         */
        public void setPromotion(PriceType value) {
            this.promotion = value;
        }

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
    public static class TransactionItems {

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
