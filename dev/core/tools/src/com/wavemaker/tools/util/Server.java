/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
package com.wavemaker.tools.util;

import java.io.IOException;

import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.Socket;
import java.net.URL;
import java.net.UnknownHostException;

import com.wavemaker.tools.common.ConfigurationException;

/**
 * This class represents a generic server on the network.
 *
 * @author Simon Toens
 * @version $Rev$ - $Date$
 */
public class Server {

    private InetAddress ip = null;

    private int port = 8080;

    public Server() {
        try {
            ip = InetAddress.getLocalHost();
        } catch (UnknownHostException ex) {
            throw new ConfigurationException(ex);
        }
    }

    public Server(String host, int port) {
        setHost(host);
        setPort(port);
    }

    public void setHost(String host) {
        try {
            ip = InetAddress.getByName(host);
        } catch (UnknownHostException ex) {
            throw new ConfigurationException(ex);
        }        
    }

    public String getHostName() {
        return ip.getHostName();
    }

    public String getIP() {
        return ip.getHostAddress();
    }

    public void setPort(int port) {
        this.port = port;
    }

    public int getPort() {
        return port;
    }

    public boolean isListening() {
        try {
            new Socket(ip, port);
        } catch (Exception ex) {
            return false;
        }
        return true;
    }

    protected HttpURLConnection getPutConnection(String uri) {

        HttpURLConnection rtn = getConnection(uri);
        try {
            rtn.setRequestMethod("PUT");
        } catch (ProtocolException ex) {
            throw new ConfigurationException(ex);
        }

        rtn.setDoOutput(true);

        return rtn;
    }

    protected HttpURLConnection getGetConnection(String uri) {

        HttpURLConnection rtn = getConnection(uri);
        try {
            rtn.setRequestMethod("GET");
        } catch (ProtocolException ex) {
            throw new ConfigurationException(ex);
        }
        rtn.setDoOutput(false);

        return rtn;
    }

    private HttpURLConnection getConnection(String uri) {

        if (uri == null) {
            throw new IllegalArgumentException("uri cannot be null");
        }

        HttpURLConnection rtn = null;

        try {
            String url = "http://" + getHostName() + ":" + getPort() + "/" + 
                uri;
            rtn = (HttpURLConnection)new URL(url).openConnection();
        } catch (MalformedURLException ex) {
            throw new AssertionError(ex);
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        }

        rtn.setAllowUserInteraction(false);
        rtn.setDoInput(true);
        rtn.setUseCaches(false);

        return rtn;
    }
    
}
