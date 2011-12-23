
package com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for SellerListingSearchRequest complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="SellerListingSearchRequest">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="BrowseNode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Country" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Keywords" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ListingPage" type="{http://www.w3.org/2001/XMLSchema}positiveInteger" minOccurs="0"/>
 *         &lt;element name="OfferStatus" minOccurs="0">
 *           &lt;simpleType>
 *             &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *               &lt;enumeration value="Open"/>
 *               &lt;enumeration value="Closed"/>
 *             &lt;/restriction>
 *           &lt;/simpleType>
 *         &lt;/element>
 *         &lt;element name="PostalCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ResponseGroup" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="SearchIndex" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="SellerId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ShipOption" minOccurs="0">
 *           &lt;simpleType>
 *             &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *               &lt;enumeration value="ShipTo"/>
 *               &lt;enumeration value="ShipFrom"/>
 *             &lt;/restriction>
 *           &lt;/simpleType>
 *         &lt;/element>
 *         &lt;element name="Sort" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Title" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "SellerListingSearchRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", propOrder = {
    "browseNode",
    "country",
    "keywords",
    "listingPage",
    "offerStatus",
    "postalCode",
    "responseGroups",
    "searchIndex",
    "sellerId",
    "shipOption",
    "sort",
    "title"
})
public class SellerListingSearchRequestType {

    @XmlElement(name = "BrowseNode", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String browseNode;
    @XmlElement(name = "Country", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String country;
    @XmlElement(name = "Keywords", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String keywords;
    @XmlElement(name = "ListingPage", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "positiveInteger")
    protected BigInteger listingPage;
    @XmlElement(name = "OfferStatus", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String offerStatus;
    @XmlElement(name = "PostalCode", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String postalCode;
    @XmlElement(name = "ResponseGroup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected List<String> responseGroups;
    @XmlElement(name = "SearchIndex", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String searchIndex;
    @XmlElement(name = "SellerId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String sellerId;
    @XmlElement(name = "ShipOption", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String shipOption;
    @XmlElement(name = "Sort", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String sort;
    @XmlElement(name = "Title", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String title;

    /**
     * Gets the value of the browseNode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBrowseNode() {
        return browseNode;
    }

    /**
     * Sets the value of the browseNode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBrowseNode(String value) {
        this.browseNode = value;
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

    /**
     * Gets the value of the keywords property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getKeywords() {
        return keywords;
    }

    /**
     * Sets the value of the keywords property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setKeywords(String value) {
        this.keywords = value;
    }

    /**
     * Gets the value of the listingPage property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getListingPage() {
        return listingPage;
    }

    /**
     * Sets the value of the listingPage property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setListingPage(BigInteger value) {
        this.listingPage = value;
    }

    /**
     * Gets the value of the offerStatus property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getOfferStatus() {
        return offerStatus;
    }

    /**
     * Sets the value of the offerStatus property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setOfferStatus(String value) {
        this.offerStatus = value;
    }

    /**
     * Gets the value of the postalCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPostalCode() {
        return postalCode;
    }

    /**
     * Sets the value of the postalCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPostalCode(String value) {
        this.postalCode = value;
    }

    /**
     * Gets the value of the responseGroups property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the responseGroups property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getResponseGroups().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getResponseGroups() {
        if (responseGroups == null) {
            responseGroups = new ArrayList<String>();
        }
        return this.responseGroups;
    }

    /**
     * Gets the value of the searchIndex property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSearchIndex() {
        return searchIndex;
    }

    /**
     * Sets the value of the searchIndex property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSearchIndex(String value) {
        this.searchIndex = value;
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
     * Gets the value of the shipOption property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getShipOption() {
        return shipOption;
    }

    /**
     * Sets the value of the shipOption property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setShipOption(String value) {
        this.shipOption = value;
    }

    /**
     * Gets the value of the sort property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSort() {
        return sort;
    }

    /**
     * Sets the value of the sort property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSort(String value) {
        this.sort = value;
    }

    /**
     * Gets the value of the title property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the value of the title property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTitle(String value) {
        this.title = value;
    }

    /**
     * Sets the value of the responseGroups property.
     * 
     * @param responseGroups
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setResponseGroups(List<String> responseGroups) {
        this.responseGroups = responseGroups;
    }

}
