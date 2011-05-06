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

import java.util.List;
import java.util.Map;

/**
 * This class contains properties used to configure the client binding through
 * request context.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class BindingProperties {

    private String endpointAddress;

    private String httpBasicAuthUsername;

    private String httpBasicAuthPassword;
    
    private int connectionTimeout;
    
    private int requestTimeout;

    private String soapActionURI;

    private Map<String, List<String>> httpHeaders;

    /**
     * Returns the target service endpoint address.
     * 
     * @return The service endpoint address.
     */
    public String getEndpointAddress() {
        return endpointAddress;
    }

    /**
     * Sets the target service endpoint address.
     * 
     * @param endpointAddress
     *            The service endpoint address.
     */
    public void setEndpointAddress(String endpointAddress) {
        this.endpointAddress = endpointAddress;
    }

    /**
     * Returns the username to be used for HTTP basic authentication.
     * 
     * @return The username for authentication.
     */
    public String getHttpBasicAuthUsername() {
        return httpBasicAuthUsername;
    }

    /**
     * Sets the username to be used for HTTP basic authentication.
     * 
     * @param httpBasicAuthUsername
     *            The username for authentication.
     */
    public void setHttpBasicAuthUsername(String httpBasicAuthUsername) {
        this.httpBasicAuthUsername = httpBasicAuthUsername;
    }

    /**
     * Returns the password to be used for HTTP basic authentication.
     * 
     * @return The password for authentication.
     */
    public String getHttpBasicAuthPassword() {
        return httpBasicAuthPassword;
    }

    /**
     * Sets the password to be used for HTTP basic authentication.
     * 
     * @param httpBasicAuthPassword
     *            The password for authentication.
     */
    public void setHttpBasicAuthPassword(String httpBasicAuthPassword) {
        this.httpBasicAuthPassword = httpBasicAuthPassword;
    }

    /**
     * Returns the connection timeout value.
     * 
     * @return The connection timeout value
     */
    public int getConnectionTimeout() {
        return connectionTimeout;
    }

    /**
     * Sets the connection timeout value.
     * 
     * @param connectionTimeout The connection timeout value to set.
     */
    public void setConnectionTimeout(int connectionTimeout) {
        this.connectionTimeout = connectionTimeout;
    }

    /**
     * Returns the request timeout value.
     * 
     * @return The request timeout value.
     */
    public int getRequestTimeout() {
        return requestTimeout;
    }

    /**
     * Sets the request timeout value.
     * 
     * @param requestTimeout The request timeout value to set.
     */
    public void setRequestTimeout(int requestTimeout) {
        this.requestTimeout = requestTimeout;
    }

    /**
     * Returns the SOAPAction URI.
     * 
     * @return The SOAPAction URI.
     */
    public String getSoapActionURI() {
        return soapActionURI;
    }

    /**
     * Sets the SOAPAction URI.
     * 
     * @param soapActionURI
     *            The SOAPAction URI.
     */
    public void setSoapActionURI(String soapActionURI) {
        this.soapActionURI = soapActionURI;
    }

    /**
     * Returns additional HTTP headers.
     * 
     * @return The additional HTTP headers.
     */
    public Map<String, List<String>> getHttpHeaders() {
        return httpHeaders;
    }

    /**
     * Sets additional HTTP headers.
     * 
     * @param httpHeaders Additional HTTP headers.
     */
    public void setHttpHeaders(Map<String, List<String>> httpHeaders) {
        this.httpHeaders = httpHeaders;
    }
}
