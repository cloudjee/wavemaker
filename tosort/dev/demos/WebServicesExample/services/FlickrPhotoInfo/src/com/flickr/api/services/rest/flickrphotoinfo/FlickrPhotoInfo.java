
package com.flickr.api.services.rest.flickrphotoinfo;

import java.util.HashMap;
import java.util.Map;
import javax.xml.namespace.QName;
import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.runtime.ws.RESTService;


/**
 *  Operations for service "FlickrPhotoInfo"
 *  04/04/2009 14:41:41
 * 
 */
public class FlickrPhotoInfo {

    public java.lang.String serviceId = "FlickrPhotoInfo";
    private QName flickrPhotoInfoQName = new QName("http://api.flickr.com/services/rest/", "FlickrPhotoInfo");
    private BindingProperties bindingProperties;
    private java.lang.String parameterizedURI = "http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key={apiKey}&photo_id={photoId}";
    private RESTService restService;

    public FlickrPhotoInfo() {
        restService = new RESTService(serviceId, flickrPhotoInfoQName, parameterizedURI);
    }

    public com.flickr.api.services.rest.flickrphotoinfo.Rsp getInfo(java.lang.String apiKey, java.lang.String photoId) {
        Map<String, Object> inputMap = new HashMap<String, Object>();
        inputMap.put("apiKey", apiKey);
        inputMap.put("photoId", photoId);
        restService.setBindingProperties(bindingProperties);
        com.flickr.api.services.rest.flickrphotoinfo.Rsp result = restService.invoke(inputMap, com.flickr.api.services.rest.flickrphotoinfo.Rsp.class);
        return ((com.flickr.api.services.rest.flickrphotoinfo.Rsp) result);
    }

    public BindingProperties getBindingProperties() {
        return bindingProperties;
    }

    public void setBindingProperties(BindingProperties bindingProperties) {
        this.bindingProperties = bindingProperties;
    }

}
