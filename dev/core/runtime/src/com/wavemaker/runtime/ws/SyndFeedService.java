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

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

import com.sun.syndication.feed.synd.SyndFeed;
import com.sun.syndication.io.FeedException;
import com.sun.syndication.io.SyndFeedInput;
import com.sun.syndication.io.XmlReader;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;

/**
 * This service is used to consume RSS and Atom feeds.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
@HideFromClient
public class SyndFeedService {
   
    private static final String USER_AGENT_KEY = "User-Agent";

    private static final String USER_AGENT_VALUE = "WaveMaker http://dev.wavemaker.com";
    
    private static final String BASIC_AUTH_KEY = "Authorization";
    
    private static final String BASIC_AUTH_VALUE_PREFIX = "Basic ";
    
    private BindingProperties bindingProperties;
    
    public SyndFeedService() {
    }

    /**
     * Reads from the InputStream of the specified URL and builds the feed
     * object from the returned XML.
     * 
     * @param feedURL
     *            The URL to read feed from.
     * @return A feed object.
     */
    @ExposeToClient
    public Feed getFeed(String feedURL) {
        String httpBasicAuthUsername = null;
        String httpBasicAuthPassword = null;
        int connectionTimeout = 0;

        if (bindingProperties != null) {
            connectionTimeout = bindingProperties.getConnectionTimeout();

            httpBasicAuthUsername = bindingProperties
                    .getHttpBasicAuthUsername();
            if (httpBasicAuthUsername != null) {
                httpBasicAuthPassword = bindingProperties
                        .getHttpBasicAuthPassword();
            }
        }
        return getFeedWithHttpConfig(feedURL, httpBasicAuthUsername,
                httpBasicAuthPassword, connectionTimeout);
    }

    /**
     * Reads from the InputStream of the specified URL and builds the feed
     * object from the returned XML.
     * 
     * @param feedURL
     *            The URL to read feed from.
     * @param httpBasicAuthUsername
     *            The username for HTTP Basic Authentication.
     * @param httpBasicAuthPassword
     *            The password for HTTP Basic Authentication.
     * @param connectionTimeout
     *            HTTP connection timeout.
     * @return A feed object.
     */
    @ExposeToClient
    public Feed getFeedWithHttpConfig(String feedURL, String httpBasicAuthUsername,
            String httpBasicAuthPassword, int connectionTimeout) {
        URL url = null;
        try {
            url = new URL(feedURL);
        } catch (MalformedURLException e) {
            throw new WebServiceInvocationException(e);
        }

        SyndFeedInput input = new SyndFeedInput();
        try {
            URLConnection urlConn = url.openConnection();
            if (urlConn instanceof HttpURLConnection) {
                urlConn.setAllowUserInteraction(false);
                urlConn.setDoInput(true);
                urlConn.setDoOutput(false);
                ((HttpURLConnection) urlConn).setInstanceFollowRedirects(true);
                urlConn.setUseCaches(false);
                urlConn.setRequestProperty(USER_AGENT_KEY, USER_AGENT_VALUE);

                urlConn.setConnectTimeout(connectionTimeout);

                if (httpBasicAuthUsername != null
                        && httpBasicAuthUsername.length() > 0) {
                    String auth = (httpBasicAuthPassword == null) ? httpBasicAuthUsername
                            : httpBasicAuthUsername + ":"
                                    + httpBasicAuthPassword;
                    urlConn.setRequestProperty(BASIC_AUTH_KEY,
                            BASIC_AUTH_VALUE_PREFIX
                                    + new sun.misc.BASE64Encoder().encode(auth
                                            .getBytes()));
                }
            }
            SyndFeed feed = input.build(new XmlReader(urlConn));
            return new Feed(feed);
        } catch (IllegalArgumentException e) {
            throw new WebServiceInvocationException(e);
        } catch (FeedException e) {
            throw new WebServiceInvocationException(e);
        } catch (IOException e) {
            throw new WebServiceInvocationException(e);
        }
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
     * @param bindingProperties
     *            The bindingProperties to set.
     */
    public void setBindingProperties(BindingProperties bindingProperties) {
        this.bindingProperties = bindingProperties;
    }
    
}
