
package com.flickr.api.services.rest.flickrphotoinfo;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for rspType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="rspType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="photo" type="{}photoType"/>
 *       &lt;/sequence>
 *       &lt;attribute name="stat" type="{http://www.w3.org/2001/XMLSchema}string" />
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "rspType", propOrder = {
    "photo"
})
@XmlRootElement(name = "rsp")
public class Rsp {

    @XmlElement(required = true)
    protected PhotoTypeType photo;
    @XmlAttribute
    protected String stat;

    /**
     * Gets the value of the photo property.
     * 
     * @return
     *     possible object is
     *     {@link PhotoTypeType }
     *     
     */
    public PhotoTypeType getPhoto() {
        return photo;
    }

    /**
     * Sets the value of the photo property.
     * 
     * @param value
     *     allowed object is
     *     {@link PhotoTypeType }
     *     
     */
    public void setPhoto(PhotoTypeType value) {
        this.photo = value;
    }

    /**
     * Gets the value of the stat property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStat() {
        return stat;
    }

    /**
     * Sets the value of the stat property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStat(String value) {
        this.stat = value;
    }

}
