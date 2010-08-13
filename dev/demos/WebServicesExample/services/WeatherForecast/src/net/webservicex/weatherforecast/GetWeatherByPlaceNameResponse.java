
package net.webservicex.weatherforecast;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="GetWeatherByPlaceNameResult" type="{http://www.webservicex.net}WeatherForecasts"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "getWeatherByPlaceNameResult"
})
@XmlRootElement(name = "GetWeatherByPlaceNameResponse", namespace = "http://www.webservicex.net")
public class GetWeatherByPlaceNameResponse {

    @XmlElement(name = "GetWeatherByPlaceNameResult", namespace = "http://www.webservicex.net", required = true)
    protected WeatherForecasts getWeatherByPlaceNameResult;

    /**
     * Gets the value of the getWeatherByPlaceNameResult property.
     * 
     * @return
     *     possible object is
     *     {@link WeatherForecasts }
     *     
     */
    public WeatherForecasts getGetWeatherByPlaceNameResult() {
        return getWeatherByPlaceNameResult;
    }

    /**
     * Sets the value of the getWeatherByPlaceNameResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link WeatherForecasts }
     *     
     */
    public void setGetWeatherByPlaceNameResult(WeatherForecasts value) {
        this.getWeatherByPlaceNameResult = value;
    }

}
