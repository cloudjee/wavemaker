
package com.flickr.api.services.rest.flickrphotoinfo;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.XmlValue;


/**
 * <p>Java class for usageType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="usageType">
 *   &lt;simpleContent>
 *     &lt;extension base="&lt;http://www.w3.org/2001/XMLSchema>string">
 *       &lt;attribute name="candownload" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="canblog" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="canprint" type="{http://www.w3.org/2001/XMLSchema}string" />
 *     &lt;/extension>
 *   &lt;/simpleContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "usageType", propOrder = {
    "value"
})
public class UsageTypeType {

    @XmlValue
    protected String value;
    @XmlAttribute
    protected String candownload;
    @XmlAttribute
    protected String canblog;
    @XmlAttribute
    protected String canprint;

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
     * Gets the value of the candownload property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCandownload() {
        return candownload;
    }

    /**
     * Sets the value of the candownload property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCandownload(String value) {
        this.candownload = value;
    }

    /**
     * Gets the value of the canblog property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCanblog() {
        return canblog;
    }

    /**
     * Sets the value of the canblog property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCanblog(String value) {
        this.canblog = value;
    }

    /**
     * Gets the value of the canprint property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCanprint() {
        return canprint;
    }

    /**
     * Sets the value of the canprint property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCanprint(String value) {
        this.canprint = value;
    }

}
