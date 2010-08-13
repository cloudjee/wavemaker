
package com.yahooapis.local.trafficdata.yahootraffic;

import java.util.HashMap;
import java.util.Map;
import javax.xml.namespace.QName;
import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.runtime.ws.RESTService;


/**
 *  Operations for service "YahooTraffic"
 *  04/06/2009 02:20:22
 * 
 */
public class YahooTraffic {

    public java.lang.String serviceId = "YahooTraffic";
    private QName yahooTrafficQName = new QName("http://local.yahooapis.com/trafficData", "YahooTraffic");
    private BindingProperties bindingProperties;
    private java.lang.String parameterizedURI = "http://local.yahooapis.com/MapsService/V1/trafficData?appid={appid}&include_map=1&location={location}";
    private RESTService restService;

    public YahooTraffic() {
        restService = new RESTService(serviceId, yahooTrafficQName, parameterizedURI);
    }

    public com.yahooapis.local.trafficdata.yahootraffic.ResultSet getTraffic(java.lang.String appid, java.lang.String location) {
        Map<String, Object> inputMap = new HashMap<String, Object>();
        inputMap.put("appid", appid);
        inputMap.put("location", location);
        restService.setBindingProperties(bindingProperties);
        com.yahooapis.local.trafficdata.yahootraffic.ResultSet result = restService.invoke(inputMap, com.yahooapis.local.trafficdata.yahootraffic.ResultSet.class);
        return ((com.yahooapis.local.trafficdata.yahootraffic.ResultSet) result);
    }

    public BindingProperties getBindingProperties() {
        return bindingProperties;
    }

    public void setBindingProperties(BindingProperties bindingProperties) {
        this.bindingProperties = bindingProperties;
    }

}
