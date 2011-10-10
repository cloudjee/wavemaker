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

package com.wavemaker.runtime.ws.jaxws;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.xml.ws.BindingProvider;
import javax.xml.ws.handler.MessageContext;

import com.sun.xml.ws.developer.JAXWSProperties;
import com.sun.xml.ws.developer.WSBindingProvider;
import com.wavemaker.runtime.ws.BindingProperties;

/**
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class SOAPBindingResolver {

    @SuppressWarnings("unchecked")
    public static void setBindingProperties(BindingProvider service, BindingProperties bindingProperties) {
        if (bindingProperties != null) {
            Map<String, Object> requestContext = service.getRequestContext();

            String endpointAddress = bindingProperties.getEndpointAddress();
            if (endpointAddress != null) {
                requestContext.put(BindingProvider.ENDPOINT_ADDRESS_PROPERTY, endpointAddress);
            }

            String httpBasicAuthUsername = bindingProperties.getHttpBasicAuthUsername();
            if (httpBasicAuthUsername != null) {
                requestContext.put(BindingProvider.USERNAME_PROPERTY, httpBasicAuthUsername);
                String httpBasicAuthPassword = bindingProperties.getHttpBasicAuthPassword();
                requestContext.put(BindingProvider.PASSWORD_PROPERTY, httpBasicAuthPassword);
            }

            int connectionTimeout = bindingProperties.getConnectionTimeout();
            requestContext.put(JAXWSProperties.CONNECT_TIMEOUT, Integer.valueOf(connectionTimeout));

            int requestTimeout = bindingProperties.getRequestTimeout();
            requestContext.put(JAXWSProperties.REQUEST_TIMEOUT, Integer.valueOf(requestTimeout));

            String soapActionURI = bindingProperties.getSoapActionURI();
            if (soapActionURI != null) {
                requestContext.put(BindingProvider.SOAPACTION_USE_PROPERTY, true);
                requestContext.put(BindingProvider.SOAPACTION_URI_PROPERTY, soapActionURI);
            }

            Map<String, List<String>> httpHeaders = bindingProperties.getHttpHeaders();
            if (httpHeaders != null && !httpHeaders.isEmpty()) {
                Map<String, List<String>> reqHeaders = (Map<String, List<String>>) requestContext.get(MessageContext.HTTP_REQUEST_HEADERS);
                if (reqHeaders == null) {
                    reqHeaders = new HashMap<String, List<String>>();
                    requestContext.put(MessageContext.HTTP_REQUEST_HEADERS, reqHeaders);
                }
                for (Entry<String, List<String>> entry : httpHeaders.entrySet()) {
                    reqHeaders.put(entry.getKey(), entry.getValue());
                }
            }
        }
    }

    @Deprecated
    public static void resolve(BindingProvider service, BindingProperties bindingProperties) {
        setBindingProperties(service, bindingProperties);
    }

    public static void setHeaders(WSBindingProvider service, Object... headers) {
        List<Object> soapHeaders = new ArrayList<Object>();
        for (Object header : headers) {
            if (header != null) {
                soapHeaders.add(header);
            }
        }
        if (!soapHeaders.isEmpty()) {
            service.setOutboundHeaders(soapHeaders.toArray(new Object[soapHeaders.size()]));
        }
    }
}
