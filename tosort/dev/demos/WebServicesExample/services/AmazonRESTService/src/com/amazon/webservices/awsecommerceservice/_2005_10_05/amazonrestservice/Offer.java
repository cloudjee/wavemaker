
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
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Merchant" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Seller" minOccurs="0"/>
 *         &lt;element name="SmallImage" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Image" minOccurs="0"/>
 *         &lt;element name="MediumImage" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Image" minOccurs="0"/>
 *         &lt;element name="LargeImage" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Image" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}OfferAttributes" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}OfferListing" maxOccurs="unbounded" minOccurs="0"/>
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
    "merchant",
    "seller",
    "smallImage",
    "mediumImage",
    "largeImage",
    "offerAttributes",
    "offerListings"
})
@XmlRootElement(name = "Offer", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class Offer {

    @XmlElement(name = "Merchant", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Merchant merchant;
    @XmlElement(name = "Seller", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Seller seller;
    @XmlElement(name = "SmallImage", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ImageType smallImage;
    @XmlElement(name = "MediumImage", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ImageType mediumImage;
    @XmlElement(name = "LargeImage", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ImageType largeImage;
    @XmlElement(name = "OfferAttributes", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected OfferAttributes offerAttributes;
    @XmlElement(name = "OfferListing", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected List<OfferListing> offerListings;

    /**
     * Gets the value of the merchant property.
     * 
     * @return
     *     possible object is
     *     {@link Merchant }
     *     
     */
    public Merchant getMerchant() {
        return merchant;
    }

    /**
     * Sets the value of the merchant property.
     * 
     * @param value
     *     allowed object is
     *     {@link Merchant }
     *     
     */
    public void setMerchant(Merchant value) {
        this.merchant = value;
    }

    /**
     * Gets the value of the seller property.
     * 
     * @return
     *     possible object is
     *     {@link Seller }
     *     
     */
    public Seller getSeller() {
        return seller;
    }

    /**
     * Sets the value of the seller property.
     * 
     * @param value
     *     allowed object is
     *     {@link Seller }
     *     
     */
    public void setSeller(Seller value) {
        this.seller = value;
    }

    /**
     * Gets the value of the smallImage property.
     * 
     * @return
     *     possible object is
     *     {@link ImageType }
     *     
     */
    public ImageType getSmallImage() {
        return smallImage;
    }

    /**
     * Sets the value of the smallImage property.
     * 
     * @param value
     *     allowed object is
     *     {@link ImageType }
     *     
     */
    public void setSmallImage(ImageType value) {
        this.smallImage = value;
    }

    /**
     * Gets the value of the mediumImage property.
     * 
     * @return
     *     possible object is
     *     {@link ImageType }
     *     
     */
    public ImageType getMediumImage() {
        return mediumImage;
    }

    /**
     * Sets the value of the mediumImage property.
     * 
     * @param value
     *     allowed object is
     *     {@link ImageType }
     *     
     */
    public void setMediumImage(ImageType value) {
        this.mediumImage = value;
    }

    /**
     * Gets the value of the largeImage property.
     * 
     * @return
     *     possible object is
     *     {@link ImageType }
     *     
     */
    public ImageType getLargeImage() {
        return largeImage;
    }

    /**
     * Sets the value of the largeImage property.
     * 
     * @param value
     *     allowed object is
     *     {@link ImageType }
     *     
     */
    public void setLargeImage(ImageType value) {
        this.largeImage = value;
    }

    /**
     * Gets the value of the offerAttributes property.
     * 
     * @return
     *     possible object is
     *     {@link OfferAttributes }
     *     
     */
    public OfferAttributes getOfferAttributes() {
        return offerAttributes;
    }

    /**
     * Sets the value of the offerAttributes property.
     * 
     * @param value
     *     allowed object is
     *     {@link OfferAttributes }
     *     
     */
    public void setOfferAttributes(OfferAttributes value) {
        this.offerAttributes = value;
    }

    /**
     * Gets the value of the offerListings property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the offerListings property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getOfferListings().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link OfferListing }
     * 
     * 
     */
    public List<OfferListing> getOfferListings() {
        if (offerListings == null) {
            offerListings = new ArrayList<OfferListing>();
        }
        return this.offerListings;
    }

    /**
     * Sets the value of the offerListings property.
     * 
     * @param offerListings
     *     allowed object is
     *     {@link OfferListing }
     *     
     */
    public void setOfferListings(List<OfferListing> offerListings) {
        this.offerListings = offerListings;
    }

}
