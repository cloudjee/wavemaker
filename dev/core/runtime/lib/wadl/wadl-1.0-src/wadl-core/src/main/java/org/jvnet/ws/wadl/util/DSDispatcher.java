/*
 * The contents of this file are subject to the terms
 * of the Common Development and Distribution License
 * (the "License").  You may not use this file except
 * in compliance with the License.
 * 
 * You can obtain a copy of the license at
 * http://www.opensource.org/licenses/cddl1.php
 * See the License for the specific language governing
 * permissions and limitations under the License.
 */

/*
 * DSDispatcher.java
 *
 * Created on May 1, 2006, 9:57 AM
 */

package org.jvnet.ws.wadl.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Map;
import javax.activation.DataSource;

/**
 * Comms utility containing methods used by code
 * generated for WADL methods.
 * @author mh124079
 */
public class DSDispatcher {
    
    /**
     * Creates a new instance of JAXBDispatcher
     */
    public DSDispatcher() {
    }
    
    /**
     * Perform a HTTP GET on the resource
     * @return the unmarshalled resource representation.
     * @param url the URL of the resource
     * @param expectedMimeType the MIME type that will be used in the HTTP Accept header
     */
    public DataSource doGET(String url, Map<String, Object> httpHeaders, String expectedMimeType) throws MalformedURLException, IOException {
        URL u = new URL(url);
        URLConnection c = u.openConnection();
        InputStream in = null;
        String mediaType = null;
        if (c instanceof HttpURLConnection) {
            HttpURLConnection h = (HttpURLConnection)c;
            h.setRequestMethod("GET");
            setAccept(h, expectedMimeType);
            for(String key: httpHeaders.keySet())
                h.setRequestProperty(key, httpHeaders.get(key).toString());
            h.connect();
            mediaType = h.getContentType();
            if (h.getResponseCode() < 400)
                in = h.getInputStream();
            else
                in = h.getErrorStream();
        }
        
        return new StreamDataSource(mediaType, in);
    }

    /**
     * Perform a HTTP DELETE on the resource
     * @return the unmarshalled resource representation.
     * @param url the URL of the resource
     * @param expectedMimeType the MIME type that will be used in the HTTP Accept header
     */
    public DataSource doDELETE(String url, Map<String, Object> httpHeaders, String expectedMimeType) throws MalformedURLException, IOException {
        URL u = new URL(url);
        URLConnection c = u.openConnection();
        InputStream in = null;
        String mediaType = null;
        if (c instanceof HttpURLConnection) {
            HttpURLConnection h = (HttpURLConnection)c;
            h.setRequestMethod("DELETE");
            if (expectedMimeType != null)
                h.setRequestProperty("Accept", expectedMimeType);
            for(String key: httpHeaders.keySet())
                h.setRequestProperty(key, httpHeaders.get(key).toString());
            h.connect();
            mediaType = h.getContentType();
            if (h.getResponseCode() < 400)
                in = h.getInputStream();
            else
                in = h.getErrorStream();
        }
        
        return new StreamDataSource(mediaType, in);
    }

    /**
     * Perform a HTTP POST on the resource
     * 
     * @return the unmarshalled resource representation.
     * @param url the URL of the resource
     * @param input the body of the POST request
     * @param inputMimeType the MIME type of the body of the POST request
     * @param expectedMimeType the MIME type that will be used in the HTTP Accept header
     */
    public DataSource doPOST(DataSource input, String inputMimeType, String url, Map<String, Object> httpHeaders, String expectedMimeType) throws MalformedURLException, IOException {
        URL u = new URL(url);
        URLConnection c = u.openConnection();
        InputStream in = null;
        String mediaType = null;
        if (c instanceof HttpURLConnection) {
            HttpURLConnection h = (HttpURLConnection)c;
            h.setRequestMethod("POST");
            h.setChunkedStreamingMode(-1);
            setAccept(h, expectedMimeType);
            h.setRequestProperty("Content-Type", inputMimeType);
            for(String key: httpHeaders.keySet())
                h.setRequestProperty(key, httpHeaders.get(key).toString());
            h.setDoOutput(true);
            h.connect();
            OutputStream out = h.getOutputStream();
            byte buffer[] = new byte[4096];
            int bytes;
            InputStream inputStream = input.getInputStream();
            while ((bytes = inputStream.read(buffer)) != -1) {
                out.write(buffer, 0, bytes);
            }
            out.close();
            mediaType = h.getContentType();
            if (h.getResponseCode() < 400)
                in = h.getInputStream();
            else
                in = h.getErrorStream();
        }
        
        return new StreamDataSource(mediaType, in);
    }

    /**
     * Perform a HTTP PUT on the resource
     * 
     * @return the unmarshalled resource representation.
     * @param url the URL of the resource
     * @param input the body of the POST request
     * @param inputMimeType the MIME type of the body of the POST request
     * @param expectedMimeType the MIME type that will be used in the HTTP Accept header
     */
    public DataSource doPUT(DataSource input, String inputMimeType, String url, Map<String, Object> httpHeaders,  String expectedMimeType) throws MalformedURLException, IOException {
        URL u = new URL(url);
        URLConnection c = u.openConnection();
        InputStream in = null;
        String mediaType = null;
        if (c instanceof HttpURLConnection) {
            HttpURLConnection h = (HttpURLConnection)c;
            h.setRequestMethod("PUT");
            h.setChunkedStreamingMode(-1);
            setAccept(h, expectedMimeType);
            h.setRequestProperty("Content-Type", inputMimeType);
            for(String key: httpHeaders.keySet())
                h.setRequestProperty(key, httpHeaders.get(key).toString());
            h.setDoOutput(true);
            h.connect();
            OutputStream out = h.getOutputStream();
            byte buffer[] = new byte[4096];
            int bytes;
            InputStream inputStream = input.getInputStream();
            while ((bytes = inputStream.read(buffer)) != -1) {
                out.write(buffer, 0, bytes);
            }
            out.close();
            mediaType = h.getContentType();
            if (h.getResponseCode() < 400)
                in = h.getInputStream();
            else
                in = h.getErrorStream();
        }
        
        return new StreamDataSource(mediaType, in);
    }

    /**
     * Perform a HTTP OPTIONS on the resource
     * @return the unmarshalled resource representation.
     * @param url the URL of the resource
     * @param expectedMimeType the MIME type that will be used in the HTTP Accept header
     */
    public DataSource doOPTIONS(String url, Map<String, Object> httpHeaders, String expectedMimeType) throws MalformedURLException, IOException {
        URL u = new URL(url);
        URLConnection c = u.openConnection();
        InputStream in = null;
        String mediaType = null;
        if (c instanceof HttpURLConnection) {
            HttpURLConnection h = (HttpURLConnection)c;
            h.setRequestMethod("OPTIONS");
            setAccept(h, expectedMimeType);
            for(String key: httpHeaders.keySet())
                h.setRequestProperty(key, httpHeaders.get(key).toString());
            h.connect();
            mediaType = h.getContentType();
            if (h.getResponseCode() < 400)
                in = h.getInputStream();
            else
                in = h.getErrorStream();
        }
        
        return new StreamDataSource(mediaType, in);
    }
    
    public static void setAccept(HttpURLConnection connection, String expectedMimeType) {
        if (expectedMimeType != null)
            connection.setRequestProperty("Accept", expectedMimeType);
    }

}
