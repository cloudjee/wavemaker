/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.runtime.ws;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.activation.DataSource;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.namespace.QName;
import javax.xml.ws.BindingProvider;
import javax.xml.ws.Dispatch;
import javax.xml.ws.Service;
import javax.xml.ws.handler.MessageContext;
import javax.xml.ws.http.HTTPBinding;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.sun.xml.ws.developer.JAXWSProperties;
import com.sun.xml.ws.encoding.xml.XMLMessage;

/**
 * This class provides helper methods for HTTP binding.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class HTTPBindingSupport {

    public enum HTTPRequestMethod {
        GET, POST, PUT, DELETE
    }

    private static Log logger = LogFactory.getLog(HTTPBindingSupport.class);

    public static <T extends Object> T getResponseObject(QName serviceQName,
            QName portQName, String endpointAddress, HTTPRequestMethod method,
            String contentType, Object postData, Class<T> responseType,
            BindingProperties bindingProperties) throws WebServiceException {

        String msg = (postData == null ? null
                : (postData instanceof String) ? (String) postData
                        : convertToXMLString(postData));

        DataSource postSource = null;
        if (method == HTTPRequestMethod.POST) {
            postSource = createDataSource(contentType, msg);
        }
        DataSource response = getResponse(serviceQName, portQName,
                endpointAddress, method, postSource, bindingProperties,
                DataSource.class);
        try {
            InputStream inputStream = response.getInputStream();
            if (responseType == Void.class) {
                return null;
            } else if (responseType == String.class) {
                String responseString = convertStreamToString(inputStream);
                return responseType.cast(responseString);
            } else {
                JAXBContext context = JAXBContext.newInstance(responseType);
                Unmarshaller unmarshaller = context.createUnmarshaller();
                Object object = unmarshaller.unmarshal(inputStream);
                return responseType.cast(object);
            }
        } catch (IOException e) {
            throw new WebServiceException(e);
        } catch (JAXBException e) {
            throw new WebServiceException(e);
        }
    }

    public static String convertToXMLString(Object o) {
        try {
            JAXBContext context = JAXBContext.newInstance(o.getClass());
            Marshaller marshaller = context.createMarshaller();
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            marshaller.marshal(o, os);
            return new String(os.toByteArray());
        } catch (JAXBException e) {
            throw new WebServiceInvocationException(e);
        }
    }

    public static DataSource createDataSource(String contentType, String msg)
            throws WebServiceException {
        ByteArrayInputStream is = null;
        if (msg != null) {
            try {
                StringBuffer sb = new StringBuffer(msg);
                is = new ByteArrayInputStream(sb.toString().getBytes("UTF-8"));
            } catch (UnsupportedEncodingException e) {
                throw new WebServiceException(e);
            }
        }
        return XMLMessage.createDataSource(contentType, is);
    }

    @SuppressWarnings("unchecked")
    private static <T extends Object> T getResponse(QName serviceQName,
            QName portQName, String endpointAddress, HTTPRequestMethod method,
            T postSource, BindingProperties bindingProperties, Class<T> type)
            throws WebServiceException {

        Service service = Service.create(serviceQName);
        URI endpointURI;
        try {
            if (bindingProperties != null) {
                // if BindingProperties had endpointAddress defined, then use
                // it instead of the endpointAddress passed in from arguments.
                String endAddress = bindingProperties.getEndpointAddress();
                if (endAddress != null) {
                    endpointAddress = endAddress;
                }
            }
            endpointURI = new URI(endpointAddress);
        } catch (URISyntaxException e) {
            throw new WebServiceException(e);
        }

        String endpointPath = null;
        String endpointQueryString = null;
        if (endpointURI != null) {
            endpointPath = endpointURI.getRawPath();
            endpointQueryString = endpointURI.getRawQuery();
        }

        service.addPort(portQName, HTTPBinding.HTTP_BINDING, endpointAddress);

        Dispatch<T> d = service.createDispatch(portQName, type,
                Service.Mode.MESSAGE);

        Map<String, Object> requestContext = d.getRequestContext();
        requestContext.put(MessageContext.HTTP_REQUEST_METHOD, method
                .toString());
        requestContext.put(MessageContext.QUERY_STRING, endpointQueryString);
        requestContext.put(MessageContext.PATH_INFO, endpointPath);

        if (bindingProperties != null) {
            String httpBasicAuthUsername = bindingProperties
                    .getHttpBasicAuthUsername();
            if (httpBasicAuthUsername != null) {
                requestContext.put(BindingProvider.USERNAME_PROPERTY,
                        httpBasicAuthUsername);
                String httpBasicAuthPassword = bindingProperties
                        .getHttpBasicAuthPassword();
                requestContext.put(BindingProvider.PASSWORD_PROPERTY,
                        httpBasicAuthPassword);
            }
            
            int connectionTimeout = bindingProperties.getConnectionTimeout();
            requestContext.put(JAXWSProperties.CONNECT_TIMEOUT, 
                    Integer.valueOf(connectionTimeout));
            
            int requestTimeout = bindingProperties.getRequestTimeout();
            requestContext.put(JAXWSProperties.REQUEST_TIMEOUT, 
                    Integer.valueOf(requestTimeout));
            
            Map<String, List<String>> httpHeaders = 
                bindingProperties.getHttpHeaders();
            if (httpHeaders != null && !httpHeaders.isEmpty()) {
                Map<String, List<String>> reqHeaders = 
                     (Map<String, List<String>>) requestContext.get(
                             MessageContext.HTTP_REQUEST_HEADERS);
                if (reqHeaders == null) {
                    reqHeaders = new HashMap<String, List<String>>();
                    requestContext.put(MessageContext.HTTP_REQUEST_HEADERS, reqHeaders);
                }
                for (Entry<String, List<String>> entry : httpHeaders.entrySet()) {
                    reqHeaders.put(entry.getKey(), entry.getValue());
                }
            }
        }

        logger.info("Invoking HTTP '" + method
                + "' request with URL: " + endpointAddress);

        T result = d.invoke(postSource);
        return result;
    }

    public static String getResponseString(QName serviceQName, QName portQName,
            String endpointAddress, HTTPRequestMethod method,
            DataSource postSource, BindingProperties bindingProperties)
            throws WebServiceException {

        DataSource response = getResponse(serviceQName, portQName,
                endpointAddress, method, postSource, bindingProperties,
                DataSource.class);
        try {
            InputStream inputStream = response.getInputStream();
            return convertStreamToString(inputStream);
        } catch (IOException e) {
            throw new WebServiceException(e);
        }
    }
    
    private static String convertStreamToString(InputStream is)
            throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();
        String line = null;
        try {
            while ((line = reader.readLine()) != null) {
                sb.append(line + "\n");
            }
        } finally {
            is.close();
        }
        return sb.toString();
    }
}
