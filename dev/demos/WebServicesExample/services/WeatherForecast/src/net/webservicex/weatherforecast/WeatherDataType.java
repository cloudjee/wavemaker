
package net.webservicex.weatherforecast;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for WeatherData complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="WeatherData">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="Day" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="WeatherImage" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="MaxTemperatureF" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="MinTemperatureF" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="MaxTemperatureC" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="MinTemperatureC" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "WeatherData", namespace = "http://www.webservicex.net", propOrder = {
    "day",
    "weatherImage",
    "maxTemperatureF",
    "minTemperatureF",
    "maxTemperatureC",
    "minTemperatureC"
})
public class WeatherDataType {

    @XmlElement(name = "Day", namespace = "http://www.webservicex.net")
    protected String day;
    @XmlElement(name = "WeatherImage", namespace = "http://www.webservicex.net")
    protected String weatherImage;
    @XmlElement(name = "MaxTemperatureF", namespace = "http://www.webservicex.net")
    protected String maxTemperatureF;
    @XmlElement(name = "MinTemperatureF", namespace = "http://www.webservicex.net")
    protected String minTemperatureF;
    @XmlElement(name = "MaxTemperatureC", namespace = "http://www.webservicex.net")
    protected String maxTemperatureC;
    @XmlElement(name = "MinTemperatureC", namespace = "http://www.webservicex.net")
    protected String minTemperatureC;

    /**
     * Gets the value of the day property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDay() {
        return day;
    }

    /**
     * Sets the value of the day property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDay(String value) {
        this.day = value;
    }

    /**
     * Gets the value of the weatherImage property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getWeatherImage() {
        return weatherImage;
    }

    /**
     * Sets the value of the weatherImage property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setWeatherImage(String value) {
        this.weatherImage = value;
    }

    /**
     * Gets the value of the maxTemperatureF property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMaxTemperatureF() {
        return maxTemperatureF;
    }

    /**
     * Sets the value of the maxTemperatureF property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMaxTemperatureF(String value) {
        this.maxTemperatureF = value;
    }

    /**
     * Gets the value of the minTemperatureF property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMinTemperatureF() {
        return minTemperatureF;
    }

    /**
     * Sets the value of the minTemperatureF property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMinTemperatureF(String value) {
        this.minTemperatureF = value;
    }

    /**
     * Gets the value of the maxTemperatureC property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMaxTemperatureC() {
        return maxTemperatureC;
    }

    /**
     * Sets the value of the maxTemperatureC property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMaxTemperatureC(String value) {
        this.maxTemperatureC = value;
    }

    /**
     * Gets the value of the minTemperatureC property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMinTemperatureC() {
        return minTemperatureC;
    }

    /**
     * Sets the value of the minTemperatureC property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMinTemperatureC(String value) {
        this.minTemperatureC = value;
    }

}
