
package com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice;

import java.util.HashMap;
import java.util.Map;
import javax.xml.namespace.QName;
import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.runtime.ws.RESTService;


/**
 *  Operations for service "AmazonRESTService"
 *  04/04/2009 14:45:49
 * 
 */
public class AmazonRESTService {

    public java.lang.String serviceId = "AmazonRESTService";
    private QName amazonRESTServiceQName = new QName("http://webservices.amazon.com/AWSECommerceService/2005-10-05", "AmazonRESTService");
    private BindingProperties bindingProperties;
    private java.lang.String parameterizedURI = "http://webservices.amazon.com/onca/xml?Service=AWSECommerceService&SubscriptionId={subscriptionId}&Operation={operation}&Keywords={keywords}&ItemPage={itemPage}&SearchIndex={searchIndex}&ResponseGroup=Small";
    private RESTService restService;

    public AmazonRESTService() {
        restService = new RESTService(serviceId, amazonRESTServiceQName, parameterizedURI);
    }

    public com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemSearchResponse itemSearch(java.lang.String subscriptionId, java.lang.String operation, java.lang.String keywords, java.lang.String itemPage, java.lang.String searchIndex) {
        Map<String, Object> inputMap = new HashMap<String, Object>();
        inputMap.put("subscriptionId", subscriptionId);
        inputMap.put("operation", operation);
        inputMap.put("keywords", keywords);
        inputMap.put("itemPage", itemPage);
        inputMap.put("searchIndex", searchIndex);
        restService.setBindingProperties(bindingProperties);
        com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemSearchResponse result = restService.invoke(inputMap, com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemSearchResponse.class);
        return ((com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemSearchResponse) result);
    }

    public BindingProperties getBindingProperties() {
        return bindingProperties;
    }

    public void setBindingProperties(BindingProperties bindingProperties) {
        this.bindingProperties = bindingProperties;
    }

}
