
package com.flickr.api.services.rest.flickrphotosearch;

import java.util.HashMap;
import java.util.Map;
import javax.xml.namespace.QName;
import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.runtime.ws.RESTService;


/**
 *  Operations for service "FlickrPhotoSearch"
 *  04/04/2009 14:41:15
 * 
 */
public class FlickrPhotoSearch {

    public java.lang.String serviceId = "FlickrPhotoSearch";
    private QName flickrPhotoSearchQName = new QName("http://api.flickr.com/services/rest/", "FlickrPhotoSearch");
    private BindingProperties bindingProperties;
    private java.lang.String parameterizedURI = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key={apiKey}&text={text}";
    private RESTService restService;

    public FlickrPhotoSearch() {
        restService = new RESTService(serviceId, flickrPhotoSearchQName, parameterizedURI);
    }

    public com.flickr.api.services.rest.flickrphotosearch.Rsp search(java.lang.String apiKey, java.lang.String text) {
        Map<String, Object> inputMap = new HashMap<String, Object>();
        inputMap.put("apiKey", apiKey);
        inputMap.put("text", text);
        restService.setBindingProperties(bindingProperties);
        com.flickr.api.services.rest.flickrphotosearch.Rsp result = restService.invoke(inputMap, com.flickr.api.services.rest.flickrphotosearch.Rsp.class);
        return ((com.flickr.api.services.rest.flickrphotosearch.Rsp) result);
    }

    public BindingProperties getBindingProperties() {
        return bindingProperties;
    }

    public void setBindingProperties(BindingProperties bindingProperties) {
        this.bindingProperties = bindingProperties;
    }

}
