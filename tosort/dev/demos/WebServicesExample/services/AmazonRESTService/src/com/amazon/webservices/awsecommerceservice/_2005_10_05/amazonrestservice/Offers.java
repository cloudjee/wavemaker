
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
 *         &lt;element name="TotalOffers" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
 *         &lt;element name="TotalOfferPages" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Offer" maxOccurs="unbounded" minOccurs="0"/>
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
    "totalOffers",
    "totalOfferPages",
    "offers"
})
@XmlRootElement(name = "Offers", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class Offers {

    @XmlElement(name = "TotalOffers", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "nonNegativeInteger")
    protected BigInteger totalOffers;
    @XmlElement(name = "TotalOfferPages", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "nonNegativeInteger")
    protected BigInteger totalOfferPages;
    @XmlElement(name = "Offer", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected List<Offer> offers;

    /**
     * Gets the value of the totalOffers property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getTotalOffers() {
        return totalOffers;
    }

    /**
     * Sets the value of the totalOffers property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setTotalOffers(BigInteger value) {
        this.totalOffers = value;
    }

    /**
     * Gets the value of the totalOfferPages property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getTotalOfferPages() {
        return totalOfferPages;
    }

    /**
     * Sets the value of the totalOfferPages property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setTotalOfferPages(BigInteger value) {
        this.totalOfferPages = value;
    }

    /**
     * Gets the value of the offers property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the offers property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getOffers().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Offer }
     * 
     * 
     */
    public List<Offer> getOffers() {
        if (offers == null) {
            offers = new ArrayList<Offer>();
        }
        return this.offers;
    }

    /**
     * Sets the value of the offers property.
     * 
     * @param offers
     *     allowed object is
     *     {@link Offer }
     *     
     */
    public void setOffers(List<Offer> offers) {
        this.offers = offers;
    }

}
