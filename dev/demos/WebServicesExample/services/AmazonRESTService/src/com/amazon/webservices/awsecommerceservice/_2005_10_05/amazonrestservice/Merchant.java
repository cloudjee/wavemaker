
package com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice;

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
 *         &lt;element name="MerchantId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="Name" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="GlancePage" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
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
    "merchantId",
    "name",
    "glancePage"
})
@XmlRootElement(name = "Merchant", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class Merchant {

    @XmlElement(name = "MerchantId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String merchantId;
    @XmlElement(name = "Name", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String name;
    @XmlElement(name = "GlancePage", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String glancePage;

    /**
     * Gets the value of the merchantId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMerchantId() {
        return merchantId;
    }

    /**
     * Sets the value of the merchantId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMerchantId(String value) {
        this.merchantId = value;
    }

    /**
     * Gets the value of the name property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the value of the name property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setName(String value) {
        this.name = value;
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

}
