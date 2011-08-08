/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.runtime.ws;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import javax.xml.namespace.QName;

import com.wavemaker.runtime.ws.HTTPBindingSupport.HTTPRequestMethod;
import com.wavemaker.runtime.ws.util.Constants;

/**
 * This class provides interface to call a REST style Web service.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class RESTService {

    protected String serviceId;

    protected QName serviceQName;

    protected String parameterizedURI;

    protected BindingProperties bindingProperties;

    protected HTTPRequestMethod httpRequestMethod;

    /**
     * Constructs a REST style Web service.
     * 
     * @param serviceId
     *                The service ID.
     * @param serviceQName
     *                The Qualified name of the service in the WSDL service
     *                description.
     * @param parameterizedURI
     *                The parameterized URI used to call the REST service.
     */
    public RESTService(String serviceId, QName serviceQName,
            String parameterizedURI) {
        this(serviceId, serviceQName, parameterizedURI, null);
    }

    /**
     * Constucts a REST style Web service.
     * 
     * @param serviceId
     *            The service ID.
     * @param serviceQName
     *            The Qualified name of the service in the WSDL service
     *            description.
     * @param parameterizedURI
     *            The parameterized URI used to call the REST service.
     * @param bindingProperties
     *            The optional properties for the HTTP binding. For example,
     *            this could contain the HTTP Basic Auth username and password.
     *            This param could be null.
     * 
     */
    public RESTService(String serviceId, QName serviceQName,
            String parameterizedURI, BindingProperties bindingProperties) {
        this.serviceId = serviceId;
        this.serviceQName = serviceQName;
        this.parameterizedURI = parameterizedURI;
        this.bindingProperties = bindingProperties;
    }

    public <T extends Object> T invoke(Map<String, Object> inputs,
            Class<T> responseType) {
        return invoke(inputs, null, null, null, responseType);
    }

    public <T extends Object> T invoke(Map<String, Object> inputs,
            String method, String contentType, String endpoint,
            Class<T> responseType) {
        return invoke(inputs, method, contentType, endpoint, responseType);
    }

    public <T extends Object> T invoke(Map<String, Object> inputs,
            String method, String contentType, String endpoint,
            Class<T> responseType, String partnerName) {
        String endpointAddress = null;

        if (endpoint != null) {
            endpointAddress = endpoint;
        } else {
            endpointAddress = parameterizedURI;
        }
        
        String postData = "";
        if (method != null && method.equals(Constants.HTTP_METHOD_POST)) {
            httpRequestMethod = HTTPRequestMethod.POST;
            if (inputs.size() == 1) {
                for (Object o : inputs.values()) {
                    postData = (String)o;
                }
            } else if (inputs.size() > 1) {
                if (contentType.equalsIgnoreCase(Constants.MIME_TYPE_FORM)) {
                    postData = createFormData(inputs);
                } else {
                    throw new WebServiceInvocationException(
                        "REST service call with HTTP POST should not have more than 1 input.");
                }
            }
        } else {
            httpRequestMethod = HTTPRequestMethod.GET;
            endpointAddress = parameterize(endpointAddress, inputs);
        }

        try {
            return HTTPBindingSupport.getResponseObject(serviceQName,
                    serviceQName, endpointAddress, httpRequestMethod,
                    contentType, postData, responseType, bindingProperties, partnerName);
        } catch (WebServiceException e) {
            throw new WebServiceInvocationException(e);
        }
    }

    private String createFormData(Map<String, Object> inputs) {
        StringBuffer sb = new StringBuffer();
        Set<Entry<String, Object>> entries = inputs.entrySet();
        for (Map.Entry<String, Object> entry : entries) {
            sb.append(entry.getKey());
            sb.append("=");
            sb.append((String)entry.getValue());
            sb.append("&");
        }

        return sb.toString();
    }

    private static String parameterize(String parameterizedURI,
            Map<String, Object> inputs) {
        StringBuilder endpointAddress = new StringBuilder(parameterizedURI);
        for (Entry<String, Object> entry : inputs.entrySet()) {
            String param = entry.getKey();
            int index = endpointAddress.indexOf("{" + param + "}");
            if (index > -1) {
                try {
                    String v = entry.getValue() != null ? entry.getValue()
                            .toString() : "";
                    v = URLEncoder.encode(v, "UTF-8");
                    // java.net.URLEncoder.encode() encodes space " " as "+"
                    // instead of "%20".
                    v = v.replaceAll("\\+", "%20");
                    endpointAddress.replace(index, index + param.length() + 2,
                            v);
                } catch (UnsupportedEncodingException e) {
                    throw new WebServiceInvocationException(e);
                }
            }
        }
        return endpointAddress.toString();
    }
    
    public String getServiceId() {
        return serviceId;
    }

    public void setHttpRequestMethod(String method) {
        this.httpRequestMethod = HTTPRequestMethod.valueOf(method);
    }

    /**
     * Returns the binding properties.
     * 
     * @return The bindingProperties.
     */
    public BindingProperties getBindingProperties() {
        return bindingProperties;
    }

    /**
     * Sets the binding properties.
     * 
     * @param bindingProperties The bindingProperties to set.
     */
    public void setBindingProperties(BindingProperties bindingProperties) {
        this.bindingProperties = bindingProperties;
    }

}
