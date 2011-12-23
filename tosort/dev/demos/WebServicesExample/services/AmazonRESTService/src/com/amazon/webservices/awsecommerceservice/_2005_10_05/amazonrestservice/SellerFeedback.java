
package com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice;

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
 *         &lt;element name="Feedback" maxOccurs="unbounded">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="Rating" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
 *                   &lt;element name="Comment" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *                   &lt;element name="Date" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *                   &lt;element name="RatedBy" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
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
    "feedbacks"
})
@XmlRootElement(name = "SellerFeedback", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class SellerFeedback {

    @XmlElement(name = "Feedback", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected List<SellerFeedback.Feedback> feedbacks;

    /**
     * Gets the value of the feedbacks property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the feedbacks property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getFeedbacks().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link SellerFeedback.Feedback }
     * 
     * 
     */
    public List<SellerFeedback.Feedback> getFeedbacks() {
        if (feedbacks == null) {
            feedbacks = new ArrayList<SellerFeedback.Feedback>();
        }
        return this.feedbacks;
    }

    /**
     * Sets the value of the feedbacks property.
     * 
     * @param feedbacks
     *     allowed object is
     *     {@link SellerFeedback.Feedback }
     *     
     */
    public void setFeedbacks(List<SellerFeedback.Feedback> feedbacks) {
        this.feedbacks = feedbacks;
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
     *         &lt;element name="Rating" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
     *         &lt;element name="Comment" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
     *         &lt;element name="Date" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
     *         &lt;element name="RatedBy" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
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
        "rating",
        "comment",
        "date",
        "ratedBy"
    })
    public static class Feedback {

        @XmlElement(name = "Rating", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
        @XmlSchemaType(name = "nonNegativeInteger")
        protected BigInteger rating;
        @XmlElement(name = "Comment", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
        protected String comment;
        @XmlElement(name = "Date", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
        protected String date;
        @XmlElement(name = "RatedBy", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
        protected String ratedBy;

        /**
         * Gets the value of the rating property.
         * 
         * @return
         *     possible object is
         *     {@link BigInteger }
         *     
         */
        public BigInteger getRating() {
            return rating;
        }

        /**
         * Sets the value of the rating property.
         * 
         * @param value
         *     allowed object is
         *     {@link BigInteger }
         *     
         */
        public void setRating(BigInteger value) {
            this.rating = value;
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
         * Gets the value of the date property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getDate() {
            return date;
        }

        /**
         * Sets the value of the date property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setDate(String value) {
            this.date = value;
        }

        /**
         * Gets the value of the ratedBy property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getRatedBy() {
            return ratedBy;
        }

        /**
         * Sets the value of the ratedBy property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setRatedBy(String value) {
            this.ratedBy = value;
        }

    }

}
