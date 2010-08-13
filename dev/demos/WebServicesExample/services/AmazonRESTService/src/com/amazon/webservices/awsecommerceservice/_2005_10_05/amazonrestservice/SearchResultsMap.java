
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
 *         &lt;element name="SearchIndex" maxOccurs="unbounded">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="IndexName" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *                   &lt;element name="Results" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
 *                   &lt;element name="Pages" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
 *                   &lt;element name="RelevanceRank" type="{http://www.w3.org/2001/XMLSchema}positiveInteger"/>
 *                   &lt;element name="ASIN" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
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
    "searchIndices"
})
@XmlRootElement(name = "SearchResultsMap", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class SearchResultsMap {

    @XmlElement(name = "SearchIndex", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected List<SearchResultsMap.SearchIndex> searchIndices;

    /**
     * Gets the value of the searchIndices property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the searchIndices property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getSearchIndices().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link SearchResultsMap.SearchIndex }
     * 
     * 
     */
    public List<SearchResultsMap.SearchIndex> getSearchIndices() {
        if (searchIndices == null) {
            searchIndices = new ArrayList<SearchResultsMap.SearchIndex>();
        }
        return this.searchIndices;
    }

    /**
     * Sets the value of the searchIndices property.
     * 
     * @param searchIndices
     *     allowed object is
     *     {@link SearchResultsMap.SearchIndex }
     *     
     */
    public void setSearchIndices(List<SearchResultsMap.SearchIndex> searchIndices) {
        this.searchIndices = searchIndices;
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
     *         &lt;element name="IndexName" type="{http://www.w3.org/2001/XMLSchema}string"/>
     *         &lt;element name="Results" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
     *         &lt;element name="Pages" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
     *         &lt;element name="RelevanceRank" type="{http://www.w3.org/2001/XMLSchema}positiveInteger"/>
     *         &lt;element name="ASIN" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
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
        "indexName",
        "results",
        "pages",
        "relevanceRank",
        "asins"
    })
    public static class SearchIndex {

        @XmlElement(name = "IndexName", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected String indexName;
        @XmlElement(name = "Results", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
        @XmlSchemaType(name = "nonNegativeInteger")
        protected BigInteger results;
        @XmlElement(name = "Pages", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
        @XmlSchemaType(name = "nonNegativeInteger")
        protected BigInteger pages;
        @XmlElement(name = "RelevanceRank", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        @XmlSchemaType(name = "positiveInteger")
        protected BigInteger relevanceRank;
        @XmlElement(name = "ASIN", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected List<String> asins;

        /**
         * Gets the value of the indexName property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getIndexName() {
            return indexName;
        }

        /**
         * Sets the value of the indexName property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setIndexName(String value) {
            this.indexName = value;
        }

        /**
         * Gets the value of the results property.
         * 
         * @return
         *     possible object is
         *     {@link BigInteger }
         *     
         */
        public BigInteger getResults() {
            return results;
        }

        /**
         * Sets the value of the results property.
         * 
         * @param value
         *     allowed object is
         *     {@link BigInteger }
         *     
         */
        public void setResults(BigInteger value) {
            this.results = value;
        }

        /**
         * Gets the value of the pages property.
         * 
         * @return
         *     possible object is
         *     {@link BigInteger }
         *     
         */
        public BigInteger getPages() {
            return pages;
        }

        /**
         * Sets the value of the pages property.
         * 
         * @param value
         *     allowed object is
         *     {@link BigInteger }
         *     
         */
        public void setPages(BigInteger value) {
            this.pages = value;
        }

        /**
         * Gets the value of the relevanceRank property.
         * 
         * @return
         *     possible object is
         *     {@link BigInteger }
         *     
         */
        public BigInteger getRelevanceRank() {
            return relevanceRank;
        }

        /**
         * Sets the value of the relevanceRank property.
         * 
         * @param value
         *     allowed object is
         *     {@link BigInteger }
         *     
         */
        public void setRelevanceRank(BigInteger value) {
            this.relevanceRank = value;
        }

        /**
         * Gets the value of the asins property.
         * 
         * <p>
         * This accessor method returns a reference to the live list,
         * not a snapshot. Therefore any modification you make to the
         * returned list will be present inside the JAXB object.
         * This is why there is not a <CODE>set</CODE> method for the asins property.
         * 
         * <p>
         * For example, to add a new item, do as follows:
         * <pre>
         *    getASINS().add(newItem);
         * </pre>
         * 
         * 
         * <p>
         * Objects of the following type(s) are allowed in the list
         * {@link String }
         * 
         * 
         */
        public List<String> getASINS() {
            if (asins == null) {
                asins = new ArrayList<String>();
            }
            return this.asins;
        }

        /**
         * Sets the value of the asins property.
         * 
         * @param asins
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setASINS(List<String> asins) {
            this.asins = asins;
        }

    }

}
