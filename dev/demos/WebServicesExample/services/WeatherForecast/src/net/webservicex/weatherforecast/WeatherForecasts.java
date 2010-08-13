
package net.webservicex.weatherforecast;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for WeatherForecasts complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="WeatherForecasts">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="Latitude" type="{http://www.w3.org/2001/XMLSchema}float"/>
 *         &lt;element name="Longitude" type="{http://www.w3.org/2001/XMLSchema}float"/>
 *         &lt;element name="AllocationFactor" type="{http://www.w3.org/2001/XMLSchema}float"/>
 *         &lt;element name="FipsCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="PlaceName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="StateCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Status" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Details" type="{http://www.webservicex.net}ArrayOfWeatherData" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "WeatherForecasts", namespace = "http://www.webservicex.net", propOrder = {
    "latitude",
    "longitude",
    "allocationFactor",
    "fipsCode",
    "placeName",
    "stateCode",
    "status",
    "details"
})
@XmlRootElement(name = "WeatherForecasts", namespace = "http://www.webservicex.net")
public class WeatherForecasts {

    @XmlElement(name = "Latitude", namespace = "http://www.webservicex.net")
    protected float latitude;
    @XmlElement(name = "Longitude", namespace = "http://www.webservicex.net")
    protected float longitude;
    @XmlElement(name = "AllocationFactor", namespace = "http://www.webservicex.net")
    protected float allocationFactor;
    @XmlElement(name = "FipsCode", namespace = "http://www.webservicex.net")
    protected String fipsCode;
    @XmlElement(name = "PlaceName", namespace = "http://www.webservicex.net")
    protected String placeName;
    @XmlElement(name = "StateCode", namespace = "http://www.webservicex.net")
    protected String stateCode;
    @XmlElement(name = "Status", namespace = "http://www.webservicex.net")
    protected String status;
    @XmlElement(name = "Details", namespace = "http://www.webservicex.net")
    protected ArrayOfWeatherDataType details;

    /**
     * Gets the value of the latitude property.
     * 
     */
    public float getLatitude() {
        return latitude;
    }

    /**
     * Sets the value of the latitude property.
     * 
     */
    public void setLatitude(float value) {
        this.latitude = value;
    }

    /**
     * Gets the value of the longitude property.
     * 
     */
    public float getLongitude() {
        return longitude;
    }

    /**
     * Sets the value of the longitude property.
     * 
     */
    public void setLongitude(float value) {
        this.longitude = value;
    }

    /**
     * Gets the value of the allocationFactor property.
     * 
     */
    public float getAllocationFactor() {
        return allocationFactor;
    }

    /**
     * Sets the value of the allocationFactor property.
     * 
     */
    public void setAllocationFactor(float value) {
        this.allocationFactor = value;
    }

    /**
     * Gets the value of the fipsCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFipsCode() {
        return fipsCode;
    }

    /**
     * Sets the value of the fipsCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFipsCode(String value) {
        this.fipsCode = value;
    }

    /**
     * Gets the value of the placeName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPlaceName() {
        return placeName;
    }

    /**
     * Sets the value of the placeName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPlaceName(String value) {
        this.placeName = value;
    }

    /**
     * Gets the value of the stateCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStateCode() {
        return stateCode;
    }

    /**
     * Sets the value of the stateCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStateCode(String value) {
        this.stateCode = value;
    }

    /**
     * Gets the value of the status property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStatus() {
        return status;
    }

    /**
     * Sets the value of the status property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStatus(String value) {
        this.status = value;
    }

    /**
     * Gets the value of the details property.
     * 
     * @return
     *     possible object is
     *     {@link ArrayOfWeatherDataType }
     *     
     */
    public ArrayOfWeatherDataType getDetails() {
        return details;
    }

    /**
     * Sets the value of the details property.
     * 
     * @param value
     *     allowed object is
     *     {@link ArrayOfWeatherDataType }
     *     
     */
    public void setDetails(ArrayOfWeatherDataType value) {
        this.details = value;
    }

}
