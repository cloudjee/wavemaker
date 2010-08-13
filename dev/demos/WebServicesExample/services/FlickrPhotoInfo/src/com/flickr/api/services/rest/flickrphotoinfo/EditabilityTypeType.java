
package com.flickr.api.services.rest.flickrphotoinfo;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.XmlValue;


/**
 * <p>Java class for editabilityType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="editabilityType">
 *   &lt;simpleContent>
 *     &lt;extension base="&lt;http://www.w3.org/2001/XMLSchema>string">
 *       &lt;attribute name="cancomment" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="canaddmeta" type="{http://www.w3.org/2001/XMLSchema}string" />
 *     &lt;/extension>
 *   &lt;/simpleContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "editabilityType", propOrder = {
    "value"
})
public class EditabilityTypeType {

    @XmlValue
    protected String value;
    @XmlAttribute
    protected String cancomment;
    @XmlAttribute
    protected String canaddmeta;

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
     * Gets the value of the cancomment property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCancomment() {
        return cancomment;
    }

    /**
     * Sets the value of the cancomment property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCancomment(String value) {
        this.cancomment = value;
    }

    /**
     * Gets the value of the canaddmeta property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCanaddmeta() {
        return canaddmeta;
    }

    /**
     * Sets the value of the canaddmeta property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCanaddmeta(String value) {
        this.canaddmeta = value;
    }

}
