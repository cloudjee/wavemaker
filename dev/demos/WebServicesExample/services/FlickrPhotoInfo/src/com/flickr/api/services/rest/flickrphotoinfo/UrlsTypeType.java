
package com.flickr.api.services.rest.flickrphotoinfo;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for urlsType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="urlsType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="url" type="{}urlType"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "urlsType", propOrder = {
    "url"
})
public class UrlsTypeType {

    @XmlElement(required = true)
    protected UrlTypeType url;

    /**
     * Gets the value of the url property.
     * 
     * @return
     *     possible object is
     *     {@link UrlTypeType }
     *     
     */
    public UrlTypeType getUrl() {
        return url;
    }

    /**
     * Sets the value of the url property.
     * 
     * @param value
     *     allowed object is
     *     {@link UrlTypeType }
     *     
     */
    public void setUrl(UrlTypeType value) {
        this.url = value;
    }

}
