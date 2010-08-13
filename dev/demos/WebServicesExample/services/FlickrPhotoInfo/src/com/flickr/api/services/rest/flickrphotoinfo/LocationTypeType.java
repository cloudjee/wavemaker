
package com.flickr.api.services.rest.flickrphotoinfo;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for locationType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="locationType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="locality" type="{}localityType"/>
 *         &lt;element name="region" type="{}regionType"/>
 *         &lt;element name="country" type="{}countryType"/>
 *       &lt;/sequence>
 *       &lt;attribute name="latitude" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="longitude" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="accuracy" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="place_id" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="woeid" type="{http://www.w3.org/2001/XMLSchema}string" />
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "locationType", propOrder = {
    "locality",
    "region",
    "country"
})
public class LocationTypeType {

    @XmlElement(required = true)
    protected LocalityTypeType locality;
    @XmlElement(required = true)
    protected RegionTypeType region;
    @XmlElement(required = true)
    protected CountryTypeType country;
    @XmlAttribute
    protected String latitude;
    @XmlAttribute
    protected String longitude;
    @XmlAttribute
    protected String accuracy;
    @XmlAttribute(name = "place_id")
    protected String placeId;
    @XmlAttribute
    protected String woeid;

    /**
     * Gets the value of the locality property.
     * 
     * @return
     *     possible object is
     *     {@link LocalityTypeType }
     *     
     */
    public LocalityTypeType getLocality() {
        return locality;
    }

    /**
     * Sets the value of the locality property.
     * 
     * @param value
     *     allowed object is
     *     {@link LocalityTypeType }
     *     
     */
    public void setLocality(LocalityTypeType value) {
        this.locality = value;
    }

    /**
     * Gets the value of the region property.
     * 
     * @return
     *     possible object is
     *     {@link RegionTypeType }
     *     
     */
    public RegionTypeType getRegion() {
        return region;
    }

    /**
     * Sets the value of the region property.
     * 
     * @param value
     *     allowed object is
     *     {@link RegionTypeType }
     *     
     */
    public void setRegion(RegionTypeType value) {
        this.region = value;
    }

    /**
     * Gets the value of the country property.
     * 
     * @return
     *     possible object is
     *     {@link CountryTypeType }
     *     
     */
    public CountryTypeType getCountry() {
        return country;
    }

    /**
     * Sets the value of the country property.
     * 
     * @param value
     *     allowed object is
     *     {@link CountryTypeType }
     *     
     */
    public void setCountry(CountryTypeType value) {
        this.country = value;
    }

    /**
     * Gets the value of the latitude property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLatitude() {
        return latitude;
    }

    /**
     * Sets the value of the latitude property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLatitude(String value) {
        this.latitude = value;
    }

    /**
     * Gets the value of the longitude property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLongitude() {
        return longitude;
    }

    /**
     * Sets the value of the longitude property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLongitude(String value) {
        this.longitude = value;
    }

    /**
     * Gets the value of the accuracy property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAccuracy() {
        return accuracy;
    }

    /**
     * Sets the value of the accuracy property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAccuracy(String value) {
        this.accuracy = value;
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
