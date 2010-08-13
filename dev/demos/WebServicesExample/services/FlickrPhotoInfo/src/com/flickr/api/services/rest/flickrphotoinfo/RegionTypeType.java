
package com.flickr.api.services.rest.flickrphotoinfo;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.XmlValue;


/**
 * <p>Java class for regionType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="regionType">
 *   &lt;simpleContent>
 *     &lt;extension base="&lt;http://www.w3.org/2001/XMLSchema>string">
 *       &lt;attribute name="place_id" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="woeid" type="{http://www.w3.org/2001/XMLSchema}string" />
 *     &lt;/extension>
 *   &lt;/simpleContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "regionType", propOrder = {
    "value"
})
public class RegionTypeType {

    @XmlValue
    protected String value;
    @XmlAttribute(name = "place_id")
    protected String placeId;
    @XmlAttribute
    protected String woeid;

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
     * Gets the value of the placeId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPlaceId() {
        return placeId;
    }

    /**
     * Sets the value of the placeId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPlaceId(String value) {
        this.placeId = value;
    }

    /**
     * Gets the value of the woeid property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getWoeid() {
        return woeid;
    }

    /**
     * Sets the value of the woeid property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setWoeid(String value) {
        this.woeid = value;
    }

}
