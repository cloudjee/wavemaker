
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
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Request" minOccurs="0"/>
 *         &lt;element name="TotalResults" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
 *         &lt;element name="TotalPages" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SearchResultsMap" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Item" maxOccurs="unbounded" minOccurs="0"/>
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
    "request",
    "totalResults",
    "totalPages",
    "searchResultsMap",
    "items"
})
@XmlRootElement(name = "Items", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class Items {

    @XmlElement(name = "Request", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Request request;
    @XmlElement(name = "TotalResults", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "nonNegativeInteger")
    protected BigInteger totalResults;
    @XmlElement(name = "TotalPages", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "nonNegativeInteger")
    protected BigInteger totalPages;
    @XmlElement(name = "SearchResultsMap", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SearchResultsMap searchResultsMap;
    @XmlElement(name = "Item", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected List<Item> items;

    /**
     * Gets the value of the request property.
     * 
     * @return
     *     possible object is
     *     {@link Request }
     *     
     */
    public Request getRequest() {
        return request;
    }

    /**
     * Sets the value of the request property.
     * 
     * @param value
     *     allowed object is
     *     {@link Request }
     *     
     */
    public void setRequest(Request value) {
        this.request = value;
    }

    /**
     * Gets the value of the totalResults property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getTotalResults() {
        return totalResults;
    }

    /**
     * Sets the value of the totalResults property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setTotalResults(BigInteger value) {
        this.totalResults = value;
    }

    /**
     * Gets the value of the totalPages property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getTotalPages() {
        return totalPages;
    }

    /**
     * Sets the value of the totalPages property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setTotalPages(BigInteger value) {
        this.totalPages = value;
    }

    /**
     * Gets the value of the searchResultsMap property.
     * 
     * @return
     *     possible object is
     *     {@link SearchResultsMap }
     *     
     */
    public SearchResultsMap getSearchResultsMap() {
        return searchResultsMap;
    }

    /**
     * Sets the value of the searchResultsMap property.
     * 
     * @param value
     *     allowed object is
     *     {@link SearchResultsMap }
     *     
     */
    public void setSearchResultsMap(SearchResultsMap value) {
        this.searchResultsMap = value;
    }

    /**
     * Gets the value of the items property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the items property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getItems().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Item }
     * 
     * 
     */
    public List<Item> getItems() {
        if (items == null) {
            items = new ArrayList<Item>();
        }
        return this.items;
    }

    /**
     * Sets the value of the items property.
     * 
     * @param items
     *     allowed object is
     *     {@link Item }
     *     
     */
    public void setItems(List<Item> items) {
        this.items = items;
    }

}
