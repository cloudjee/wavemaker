
package com.flickr.api.services.rest.flickrphotoinfo;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.XmlValue;


/**
 * <p>Java class for geopermsType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="geopermsType">
 *   &lt;simpleContent>
 *     &lt;extension base="&lt;http://www.w3.org/2001/XMLSchema>string">
 *       &lt;attribute name="ispublic" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="iscontact" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="isfriend" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="isfamily" type="{http://www.w3.org/2001/XMLSchema}string" />
 *     &lt;/extension>
 *   &lt;/simpleContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "geopermsType", propOrder = {
    "value"
})
public class GeopermsTypeType {

    @XmlValue
    protected String value;
    @XmlAttribute
    protected String ispublic;
    @XmlAttribute
    protected String iscontact;
    @XmlAttribute
    protected String isfriend;
    @XmlAttribute
    protected String isfamily;

    /**
     * Gets the value of the value property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getValue() {
        return value;
    }

    /**
     * Sets the value of the value property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setValue(String value) {
        this.value = value;
    }

    /**
     * Gets the value of the ispublic property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIspublic() {
        return ispublic;
    }

    /**
     * Sets the value of the ispublic property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIspublic(String value) {
        this.ispublic = value;
    }

    /**
     * Gets the value of the iscontact property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIscontact() {
        return iscontact;
    }

    /**
     * Sets the value of the iscontact property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIscontact(String value) {
        this.iscontact = value;
    }

    /**
     * Gets the value of the isfriend property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIsfriend() {
        return isfriend;
    }

    /**
     * Sets the value of the isfriend property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIsfriend(String value) {
        this.isfriend = value;
    }

    /**
     * Gets the value of the isfamily property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIsfamily() {
        return isfamily;
    }

    /**
     * Sets the value of the isfamily property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIsfamily(String value) {
        this.isfamily = value;
    }

}
