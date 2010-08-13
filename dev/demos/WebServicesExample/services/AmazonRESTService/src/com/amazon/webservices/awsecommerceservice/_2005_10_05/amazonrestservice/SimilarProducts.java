
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
 *         &lt;element name="SimilarProduct" maxOccurs="unbounded">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="ASIN" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *                   &lt;element name="Title" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
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
    "similarProducts"
})
@XmlRootElement(name = "SimilarProducts", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class SimilarProducts {

    @XmlElement(name = "SimilarProduct", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected List<SimilarProducts.SimilarProduct> similarProducts;

    /**
     * Gets the value of the similarProducts property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the similarProducts property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getSimilarProducts().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link SimilarProducts.SimilarProduct }
     * 
     * 
     */
    public List<SimilarProducts.SimilarProduct> getSimilarProducts() {
        if (similarProducts == null) {
            similarProducts = new ArrayList<SimilarProducts.SimilarProduct>();
        }
        return this.similarProducts;
    }

    /**
     * Sets the value of the similarProducts property.
     * 
     * @param similarProducts
     *     allowed object is
     *     {@link SimilarProducts.SimilarProduct }
     *     
     */
    public void setSimilarProducts(List<SimilarProducts.SimilarProduct> similarProducts) {
        this.similarProducts = similarProducts;
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
     *         &lt;element name="ASIN" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
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
    @XmlType(name = "", propOrder = {
        "asin",
        "title"
    })
    public static class SimilarProduct {

        @XmlElement(name = "ASIN", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
        protected String asin;
        @XmlElement(name = "Title", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
        protected String title;

        /**
         * Gets the value of the asin property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getASIN() {
            return asin;
        }

        /**
         * Sets the value of the asin property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setASIN(String value) {
            this.asin = value;
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

    }

}
