
package com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
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
 *         &lt;element name="AverageRating" type="{http://www.w3.org/2001/XMLSchema}decimal" minOccurs="0"/>
 *         &lt;element name="TotalReviews" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
 *         &lt;element name="TotalReviewPages" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Review" maxOccurs="unbounded" minOccurs="0"/>
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
    "averageRating",
    "totalReviews",
    "totalReviewPages",
    "reviews"
})
@XmlRootElement(name = "CustomerReviews", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class CustomerReviews {

    @XmlElement(name = "AverageRating", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected BigDecimal averageRating;
    @XmlElement(name = "TotalReviews", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "nonNegativeInteger")
    protected BigInteger totalReviews;
    @XmlElement(name = "TotalReviewPages", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "nonNegativeInteger")
    protected BigInteger totalReviewPages;
    @XmlElement(name = "Review", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected List<Review> reviews;

    /**
     * Gets the value of the averageRating property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getAverageRating() {
        return averageRating;
    }

    /**
     * Sets the value of the averageRating property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setAverageRating(BigDecimal value) {
        this.averageRating = value;
    }

    /**
     * Gets the value of the totalReviews property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getTotalReviews() {
        return totalReviews;
    }

    /**
     * Sets the value of the totalReviews property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setTotalReviews(BigInteger value) {
        this.totalReviews = value;
    }

    /**
     * Gets the value of the totalReviewPages property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getTotalReviewPages() {
        return totalReviewPages;
    }

    /**
     * Sets the value of the totalReviewPages property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setTotalReviewPages(BigInteger value) {
        this.totalReviewPages = value;
    }

    /**
     * Gets the value of the reviews property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the reviews property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getReviews().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Review }
     * 
     * 
     */
    public List<Review> getReviews() {
        if (reviews == null) {
            reviews = new ArrayList<Review>();
        }
        return this.reviews;
    }

    /**
     * Sets the value of the reviews property.
     * 
     * @param reviews
     *     allowed object is
     *     {@link Review }
     *     
     */
    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

}
