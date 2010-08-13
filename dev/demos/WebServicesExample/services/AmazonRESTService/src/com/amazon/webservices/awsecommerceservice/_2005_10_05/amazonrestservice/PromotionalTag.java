
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
 *         &lt;element name="PromotionalTag" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
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
    "promotionalTag"
})
@XmlRootElement(name = "PromotionalTag", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class PromotionalTag {

    @XmlElement(name = "PromotionalTag", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String promotionalTag;

    /**
     * Gets the value of the promotionalTag property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPromotionalTag() {
        return promotionalTag;
    }

    /**
     * Sets the value of the promotionalTag property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPromotionalTag(String value) {
        this.promotionalTag = value;
    }

}
