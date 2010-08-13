
package com.flickr.api.services.rest.flickrphotoinfo;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.XmlValue;


/**
 * <p>Java class for datesType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="datesType">
 *   &lt;simpleContent>
 *     &lt;extension base="&lt;http://www.w3.org/2001/XMLSchema>string">
 *       &lt;attribute name="posted" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="taken" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="takengranularity" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="lastupdate" type="{http://www.w3.org/2001/XMLSchema}string" />
 *     &lt;/extension>
 *   &lt;/simpleContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "datesType", propOrder = {
    "value"
})
public class DatesTypeType {

    @XmlValue
    protected String value;
    @XmlAttribute
    protected String posted;
    @XmlAttribute
    protected String taken;
    @XmlAttribute
    protected String takengranularity;
    @XmlAttribute
    protected String lastupdate;

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
     * Gets the value of the posted property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPosted() {
        return posted;
    }

    /**
     * Sets the value of the posted property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPosted(String value) {
        this.posted = value;
    }

    /**
     * Gets the value of the taken property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTaken() {
        return taken;
    }

    /**
     * Sets the value of the taken property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTaken(String value) {
        this.taken = value;
    }

    /**
     * Gets the value of the takengranularity property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTakengranularity() {
        return takengranularity;
    }

    /**
     * Sets the value of the takengranularity property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTakengranularity(String value) {
        this.takengranularity = value;
    }

    /**
     * Gets the value of the lastupdate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLastupdate() {
        return lastupdate;
    }

    /**
     * Sets the value of the lastupdate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLastupdate(String value) {
        this.lastupdate = value;
    }

}
