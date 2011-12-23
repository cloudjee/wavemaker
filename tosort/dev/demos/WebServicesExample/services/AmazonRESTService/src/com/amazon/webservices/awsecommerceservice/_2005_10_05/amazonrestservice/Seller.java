
package com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice;

import java.math.BigDecimal;
import java.math.BigInteger;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSchemaType;
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
 *         &lt;element name="SellerId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="SellerName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Nickname" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="GlancePage" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="About" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="MoreAbout" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
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
 *         &lt;element name="AverageFeedbackRating" type="{http://www.w3.org/2001/XMLSchema}decimal" minOccurs="0"/>
 *         &lt;element name="TotalFeedback" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
 *         &lt;element name="TotalFeedbackPages" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SellerFeedback" minOccurs="0"/>
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
    "sellerId",
    "sellerName",
    "nickname",
    "glancePage",
    "about",
    "moreAbout",
    "location",
    "averageFeedbackRating",
    "totalFeedback",
    "totalFeedbackPages",
    "sellerFeedback"
})
@XmlRootElement(name = "Seller", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class Seller {

    @XmlElement(name = "SellerId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String sellerId;
    @XmlElement(name = "SellerName", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String sellerName;
    @XmlElement(name = "Nickname", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String nickname;
    @XmlElement(name = "GlancePage", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String glancePage;
    @XmlElement(name = "About", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String about;
    @XmlElement(name = "MoreAbout", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String moreAbout;
    @XmlElement(name = "Location", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Seller.Location location;
    @XmlElement(name = "AverageFeedbackRating", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected BigDecimal averageFeedbackRating;
    @XmlElement(name = "TotalFeedback", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "nonNegativeInteger")
    protected BigInteger totalFeedback;
    @XmlElement(name = "TotalFeedbackPages", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "nonNegativeInteger")
    protected BigInteger totalFeedbackPages;
    @XmlElement(name = "SellerFeedback", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SellerFeedback sellerFeedback;

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
     * Gets the value of the glancePage property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGlancePage() {
        return glancePage;
    }

    /**
     * Sets the value of the glancePage property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGlancePage(String value) {
        this.glancePage = value;
    }

    /**
     * Gets the value of the about property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAbout() {
        return about;
    }

    /**
     * Sets the value of the about property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAbout(String value) {
        this.about = value;
    }

    /**
     * Gets the value of the moreAbout property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMoreAbout() {
        return moreAbout;
    }

    /**
     * Sets the value of the moreAbout property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMoreAbout(String value) {
        this.moreAbout = value;
    }

    /**
     * Gets the value of the location property.
     * 
     * @return
     *     possible object is
     *     {@link Seller.Location }
     *     
     */
    public Seller.Location getLocation() {
        return location;
    }

    /**
     * Sets the value of the location property.
     * 
     * @param value
     *     allowed object is
     *     {@link Seller.Location }
     *     
     */
    public void setLocation(Seller.Location value) {
        this.location = value;
    }

    /**
     * Gets the value of the averageFeedbackRating property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getAverageFeedbackRating() {
        return averageFeedbackRating;
    }

    /**
     * Sets the value of the averageFeedbackRating property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setAverageFeedbackRating(BigDecimal value) {
        this.averageFeedbackRating = value;
    }

    /**
     * Gets the value of the totalFeedback property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getTotalFeedback() {
        return totalFeedback;
    }

    /**
     * Sets the value of the totalFeedback property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setTotalFeedback(BigInteger value) {
        this.totalFeedback = value;
    }

    /**
     * Gets the value of the totalFeedbackPages property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getTotalFeedbackPages() {
        return totalFeedbackPages;
    }

    /**
     * Sets the value of the totalFeedbackPages property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setTotalFeedbackPages(BigInteger value) {
        this.totalFeedbackPages = value;
    }

    /**
     * Gets the value of the sellerFeedback property.
     * 
     * @return
     *     possible object is
     *     {@link SellerFeedback }
     *     
     */
    public SellerFeedback getSellerFeedback() {
        return sellerFeedback;
    }

    /**
     * Sets the value of the sellerFeedback property.
     * 
     * @param value
     *     allowed object is
     *     {@link SellerFeedback }
     *     
     */
    public void setSellerFeedback(SellerFeedback value) {
        this.sellerFeedback = value;
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
