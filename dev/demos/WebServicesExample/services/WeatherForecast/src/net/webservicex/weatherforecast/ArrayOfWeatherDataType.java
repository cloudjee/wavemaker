
package net.webservicex.weatherforecast;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ArrayOfWeatherData complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ArrayOfWeatherData">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="WeatherData" type="{http://www.webservicex.net}WeatherData" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ArrayOfWeatherData", namespace = "http://www.webservicex.net", propOrder = {
    "weatherDatas"
})
public class ArrayOfWeatherDataType {

    @XmlElement(name = "WeatherData", namespace = "http://www.webservicex.net")
    protected List<WeatherDataType> weatherDatas;

    /**
     * Gets the value of the weatherDatas property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the weatherDatas property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getWeatherDatas().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link WeatherDataType }
     * 
     * 
     */
    public List<WeatherDataType> getWeatherDatas() {
        if (weatherDatas == null) {
            weatherDatas = new ArrayList<WeatherDataType>();
        }
        return this.weatherDatas;
    }

    /**
     * Sets the value of the weatherDatas property.
     * 
     * @param weatherDatas
     *     allowed object is
     *     {@link WeatherDataType }
     *     
     */
    public void setWeatherDatas(List<WeatherDataType> weatherDatas) {
        this.weatherDatas = weatherDatas;
    }

}
