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
 * JAXBDispatcher.java
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
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

/**
 * A wrapper for JAX-WS <code>Dispatch<Object></code> containing methods used by code
 * generated for WADL methods.
 * @author mh124079
 */
public class JAXBDispatcher {
    
    JAXBContext jc;
    
    /**
     * Creates a new instance of JAXBDispatcher
     * 
     * 
     * 
     * @param jc a JAXBContext that will be used to marshall requests and unmarshall responses.
     */
    public JAXBDispatcher(JAXBContext jc) {
        this.jc = jc;
    } 

    
    /**
     * Perform a HTTP GET on the resource
     * 
     * 
     * @return the unmarshalled resource representation.
     * @param url the URL of the resource
     * @param expectedMimeType the MIME type that will be used in the HTTP Accept header
     */
    public Object doGET(String url, Map<String, Object> httpHeaders, String expectedMimeType) throws MalformedURLException, IOException, JAXBException {
        URL u = new URL(url);
        URLConnection c = u.openConnection();
        InputStream in = null;
        String mediaType = null;
        if (c instanceof HttpURLConnection) {
            HttpURLConnection h = (HttpURLConnection)c;
            h.setRequestMethod("GET");
            DSDispatcher.setAccept(h, expectedMimeType);
            for(String key: httpHeaders.keySet())
                h.setRequestProperty(key, httpHeaders.get(key).toString());
            h.connect();
            mediaType = h.getContentType();
            if (h.getResponseCode() < 400)
                in = h.getInputStream();
            else
                in = h.getErrorStream();
        }

        if (expectedMimeType==null)
            return null;
        Unmarshaller um = jc.createUnmarshaller();
        Object o = um.unmarshal(in);
        
        return o;
    }

    /**
     * Perform a HTTP DELETE on the resource
     * 
     * 
     * @return the unmarshalled resource representation.
     * @param url the URL of the resource
     * @param expectedMimeType the MIME type that will be used in the HTTP Accept header
     */
    public Object doDELETE(String url, Map<String, Object> httpHeaders, String expectedMimeType) throws MalformedURLException, IOException, JAXBException {
        URL u = new URL(url);
        URLConnection c = u.openConnection();
        InputStream in = null;
        String mediaType = null;
        if (c instanceof HttpURLConnection) {
            HttpURLConnection h = (HttpURLConnection)c;
            h.setRequestMethod("DELETE");
            DSDispatcher.setAccept(h, expectedMimeType);
            for(String key: httpHeaders.keySet())
                h.setRequestProperty(key, httpHeaders.get(key).toString());
            h.connect();
            mediaType = h.getContentType();
            if (h.getResponseCode() < 400)
                in = h.getInputStream();
            else
                in = h.getErrorStream();
        }
        
        if (expectedMimeType==null)
            return null;
        Unmarshaller um = jc.createUnmarshaller();
        Object o = um.unmarshal(in);
        
        return o;
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
    public Object doPOST(Object input, String inputMimeType, String url, Map<String, Object> httpHeaders, String expectedMimeType) throws MalformedURLException, IOException, JAXBException {
        URL u = new URL(url);
        URLConnection c = u.openConnection();
        InputStream in = null;
        String mediaType = null;
        if (c instanceof HttpURLConnection) {
            HttpURLConnection h = (HttpURLConnection)c;
            h.setRequestMethod("POST");
            h.setChunkedStreamingMode(-1);
            DSDispatcher.setAccept(h, expectedMimeType);
            h.setRequestProperty("Content-Type", inputMimeType);
            for(String key: httpHeaders.keySet())
                h.setRequestProperty(key, httpHeaders.get(key).toString());
            h.setDoOutput(true);
            h.connect();
            OutputStream out = h.getOutputStream();
            Marshaller m = jc.createMarshaller();
            m.marshal(input, out);
            out.close();
            mediaType = h.getContentType();
            if (h.getResponseCode() < 400)
                in = h.getInputStream();
            else
                in = h.getErrorStream();
        }

        if (expectedMimeType==null)
            return null;
        Unmarshaller um = jc.createUnmarshaller();
        Object o = um.unmarshal(in);
        
        return o;
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
    public Object doPUT(Object input, String inputMimeType, String url, Map<String, Object> httpHeaders, String expectedMimeType) throws MalformedURLException, IOException, JAXBException {
        URL u = new URL(url);
        URLConnection c = u.openConnection();
        InputStream in = null;
        String mediaType = null;
        if (c instanceof HttpURLConnection) {
            HttpURLConnection h = (HttpURLConnection)c;
            h.setRequestMethod("PUT");
            h.setChunkedStreamingMode(-1);
            DSDispatcher.setAccept(h, expectedMimeType);
            h.setRequestProperty("Content-Type", inputMimeType);
            for(String key: httpHeaders.keySet())
                h.setRequestProperty(key, httpHeaders.get(key).toString());
            h.setDoOutput(true);
            h.connect();
            OutputStream out = h.getOutputStream();
            Marshaller m = jc.createMarshaller();
            m.marshal(input, out);
            out.close();
            mediaType = h.getContentType();
            if (h.getResponseCode() < 400)
                in = h.getInputStream();
            else
                in = h.getErrorStream();
        }

        if (expectedMimeType==null)
            return null;
        Unmarshaller um = jc.createUnmarshaller();
        Object o = um.unmarshal(in);
        
        return o;
    }
    
    /**
     * Perform a HTTP OPTIONS on the resource
     * 
     * 
     * @return the unmarshalled resource representation.
     * @param url the URL of the resource
     * @param expectedMimeType the MIME type that will be used in the HTTP Accept header
     */
    public Object doOPTIONS(String url, Map<String, Object> httpHeaders, String expectedMimeType) throws MalformedURLException, IOException, JAXBException {
        URL u = new URL(url);
        URLConnection c = u.openConnection();
        InputStream in = null;
        String mediaType = null;
        if (c instanceof HttpURLConnection) {
            HttpURLConnection h = (HttpURLConnection)c;
            h.setRequestMethod("OPTIONS");
            DSDispatcher.setAccept(h, expectedMimeType);
            for(String key: httpHeaders.keySet())
                h.setRequestProperty(key, httpHeaders.get(key).toString());
            h.connect();
            mediaType = h.getContentType();
            if (h.getResponseCode() < 400)
                in = h.getInputStream();
            else
                in = h.getErrorStream();
        }
        
        if (expectedMimeType==null)
            return null;
        Unmarshaller um = jc.createUnmarshaller();
        Object o = um.unmarshal(in);
        
        return o;
    }

}
