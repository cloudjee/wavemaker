
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
 *         &lt;element name="CustomerId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="Nickname" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Birthday" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="WishListId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Location" minOccurs="0">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="City" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *                   &lt;element name="State" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *                   &lt;element name="Country" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CustomerReviews" maxOccurs="unbounded"/>
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
    "customerId",
    "nickname",
    "birthday",
    "wishListId",
    "location",
    "customerReviews"
})
@XmlRootElement(name = "Customer", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class Customer {

    @XmlElement(name = "CustomerId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String customerId;
    @XmlElement(name = "Nickname", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String nickname;
    @XmlElement(name = "Birthday", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String birthday;
    @XmlElement(name = "WishListId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String wishListId;
    @XmlElement(name = "Location", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Customer.Location location;
    @XmlElement(name = "CustomerReviews", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected List<CustomerReviews> customerReviews;

    /**
     * Gets the value of the customerId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerId() {
        return customerId;
    }

    /**
     * Sets the value of the customerId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerId(String value) {
        this.customerId = value;
    }

    /**
     * Gets the value of the nickname property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNickname() {
        return nickname;
    }

    /**
     * Sets the value of the nickname property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNickname(String value) {
        this.nickname = value;
    }

    /**
     * Gets the value of the birthday property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBirthday() {
        return birthday;
    }

    /**
     * Sets the value of the birthday property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBirthday(String value) {
        this.birthday = value;
    }

    /**
     * Gets the value of the wishListId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getWishListId() {
        return wishListId;
    }

    /**
     * Sets the value of the wishListId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setWishListId(String value) {
        this.wishListId = value;
    }

    /**
     * Gets the value of the location property.
     * 
     * @return
     *     possible object is
     *     {@link Customer.Location }
     *     
     */
    public Customer.Location getLocation() {
        return location;
    }

    /**
     * Sets the value of the location property.
     * 
     * @param value
     *     allowed object is
     *     {@link Customer.Location }
     *     
     */
    public void setLocation(Customer.Location value) {
        this.location = value;
    }

    /**
     * Gets the value of the customerReviews property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the customerReviews property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getCustomerReviews().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link CustomerReviews }
     * 
     * 
     */
    public List<CustomerReviews> getCustomerReviews() {
        if (customerReviews == null) {
            customerReviews = new ArrayList<CustomerReviews>();
        }
        return this.customerReviews;
    }

    /**
     * Sets the value of the customerReviews property.
     * 
     * @param customerReviews
     *     allowed object is
     *     {@link CustomerReviews }
     *     
     */
    public void setCustomerReviews(List<CustomerReviews> customerReviews) {
        this.customerReviews = customerReviews;
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
     *         &lt;element name="City" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
     *         &lt;element name="State" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
     *         &lt;element name="Country" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
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
        "city",
        "state",
        "country"
    })
    public static class Location {

        @XmlElement(name = "City", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
        protected String city;
        @XmlElement(name = "State", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
        protected String state;
        @XmlElement(name = "Country", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
        protected String country;

        /**
         * Gets the value of the city property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getCity() {
            return city;
        }

        /**
         * Sets the value of the city property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setCity(String value) {
            this.city = value;
        }

        /**
         * Gets the value of the state property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getState() {
            return state;
        }

        /**
         * Sets the value of the state property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setState(String value) {
            this.state = value;
        }

        /**
         * Gets the value of the country property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getCountry() {
            return country;
        }

        /**
         * Sets the value of the country property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setCountry(String value) {
            this.country = value;
        }

    }

}
