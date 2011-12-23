
package com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for Image complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="Image">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="URL" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="Height" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}DecimalWithUnits"/>
 *         &lt;element name="Width" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}DecimalWithUnits"/>
 *         &lt;element name="IsVerified" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "Image", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", propOrder = {
    "url",
    "height",
    "width",
    "isVerified"
})
public class ImageType {

    @XmlElement(name = "URL", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String url;
    @XmlElement(name = "Height", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected DecimalWithUnitsType height;
    @XmlElement(name = "Width", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected DecimalWithUnitsType width;
    @XmlElement(name = "IsVerified", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String isVerified;

    /**
     * Gets the value of the url property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getURL() {
        return url;
    }

    /**
     * Sets the value of the url property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setURL(String value) {
        this.url = value;
    }

    /**
     * Gets the value of the height property.
     * 
     * @return
     *     possible object is
     *     {@link DecimalWithUnitsType }
     *     
     */
    public DecimalWithUnitsType getHeight() {
        return height;
    }

    /**
     * Sets the value of the height property.
     * 
     * @param value
     *     allowed object is
     *     {@link DecimalWithUnitsType }
     *     
     */
    public void setHeight(DecimalWithUnitsType value) {
        this.height = value;
    }

    /**
     * Gets the value of the width property.
     * 
     * @return
     *     possible object is
     *     {@link DecimalWithUnitsType }
     *     
     */
    public DecimalWithUnitsType getWidth() {
        return width;
    }

    /**
     * Sets the value of the width property.
     * 
     * @param value
     *     allowed object is
     *     {@link DecimalWithUnitsType }
     *     
     */
    public void setWidth(DecimalWithUnitsType value) {
        this.width = value;
    }

    /**
     * Gets the value of the isVerified property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIsVerified() {
        return isVerified;
    }

    /**
     * Sets the value of the isVerified property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIsVerified(String value) {
        this.isVerified = value;
    }

}
