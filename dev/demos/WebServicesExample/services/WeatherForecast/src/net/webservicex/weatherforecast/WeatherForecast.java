
package net.webservicex.weatherforecast;

import java.io.IOException;
import java.net.URL;
import javax.xml.namespace.QName;
import javax.xml.ws.BindingProvider;
import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.runtime.ws.jaxws.SOAPBindingResolver;
import org.springframework.core.io.ClassPathResource;


/**
 *  Operations for service "WeatherForecast"
 *  04/06/2009 02:31:35
 * 
 */
public class WeatherForecast {

    public String serviceId = "WeatherForecast";
    private QName weatherForecastQName = new QName("http://www.webservicex.net", "WeatherForecast");
    private BindingProperties bindingProperties;
    private WeatherForecastSoap weatherForecastSoapService;

    public WeatherForecast() {
        WeatherForecastClient weatherForecastClient;
        try {
            URL wsdlLocation = new ClassPathResource("net/webservicex/weatherforecast/temp.wsdl").getURL();
            weatherForecastClient = new WeatherForecastClient(wsdlLocation, weatherForecastQName);
        } catch (IOException e) {
            weatherForecastClient = new WeatherForecastClient();
        }
        weatherForecastSoapService = weatherForecastClient.getWeatherForecastSoap();
    }

    public GetWeatherByPlaceNameResponse getWeatherByPlaceName(GetWeatherByPlaceName parameters) {
        GetWeatherByPlaceNameResponse response;
        SOAPBindingResolver.setBindingProperties(((BindingProvider) weatherForecastSoapService), bindingProperties);
        response = weatherForecastSoapService.getWeatherByPlaceName(parameters);
        return response;
    }

    public GetWeatherByZipCodeResponse getWeatherByZipCode(GetWeatherByZipCode parameters) {
        GetWeatherByZipCodeResponse response;
        SOAPBindingResolver.setBindingProperties(((BindingProvider) weatherForecastSoapService), bindingProperties);
        response = weatherForecastSoapService.getWeatherByZipCode(parameters);
        return response;
    }

    public BindingProperties getBindingProperties() {
        return bindingProperties;
    }

    public void setBindingProperties(BindingProperties bindingProperties) {
        this.bindingProperties = bindingProperties;
    }

}
