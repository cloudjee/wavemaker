
package net.webservicex.weatherforecast;

import javax.xml.bind.annotation.XmlRegistry;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the net.webservicex.weatherforecast package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {


    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: net.webservicex.weatherforecast
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link WeatherForecasts }
     * 
     */
    public WeatherForecasts createWeatherForecasts() {
        return new WeatherForecasts();
    }

    /**
     * Create an instance of {@link GetWeatherByZipCodeResponse }
     * 
     */
    public GetWeatherByZipCodeResponse createGetWeatherByZipCodeResponse() {
        return new GetWeatherByZipCodeResponse();
    }

    /**
     * Create an instance of {@link WeatherDataType }
     * 
     */
    public WeatherDataType createWeatherDataType() {
        return new WeatherDataType();
    }

    /**
     * Create an instance of {@link ArrayOfWeatherDataType }
     * 
     */
    public ArrayOfWeatherDataType createArrayOfWeatherDataType() {
        return new ArrayOfWeatherDataType();
    }

    /**
     * Create an instance of {@link GetWeatherByZipCode }
     * 
     */
    public GetWeatherByZipCode createGetWeatherByZipCode() {
        return new GetWeatherByZipCode();
    }

    /**
     * Create an instance of {@link GetWeatherByPlaceNameResponse }
     * 
     */
    public GetWeatherByPlaceNameResponse createGetWeatherByPlaceNameResponse() {
        return new GetWeatherByPlaceNameResponse();
    }

    /**
     * Create an instance of {@link GetWeatherByPlaceName }
     * 
     */
    public GetWeatherByPlaceName createGetWeatherByPlaceName() {
        return new GetWeatherByPlaceName();
    }

}
