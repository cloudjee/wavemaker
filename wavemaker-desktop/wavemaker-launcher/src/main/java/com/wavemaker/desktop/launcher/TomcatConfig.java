/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
/**
 * 
 */

package com.wavemaker.desktop.launcher;

import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URISyntaxException;
import java.util.ArrayList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.*;
import org.xml.sax.SAXException;

/**
 * Wrapped around server.xml, provides access to shutdown and service ports.
 * 
 * @author rkirkland
 * @version $Rev$ - $Date$s
 */
public class TomcatConfig {

    /** Variables */
    // Constants
    public static final String PROPERTY_SHUTDOWN_PORT = "ShutdownPort";

    public static final String PROPERTY_SERVICE_PORT = "ServicePort";

    public static final String PROPERTY_SSL_PORT = "SSLPort";

    // Members
    protected Document source;

    protected NodeList serviceConnectorNodeList;

    protected Node servicePortNode;

    protected Node shutdownPortNode;

    protected Node sslServicePortNode;

    // event Handling
    protected ArrayList<PropertyChangeListener> listeners = new ArrayList<PropertyChangeListener>();

    /** Construction\Destruction */
    protected TomcatConfig(FileInputStream source) {
        this.parseSourceXML(source);
    }

    /** Static Methods */
    public static TomcatConfig GetDefaultConfig() {
        TomcatConfig result = null;
        try {
            File serverXML = Main.getTomcatServerXML();
            if (serverXML != null) {
                FileInputStream source = new FileInputStream(serverXML);
                result = new TomcatConfig(source);
                source.close();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * @param args
     */
    public static void main(String[] args) {
        TomcatConfig tc = GetDefaultConfig();
        System.out.println("Service Port: " + tc.getServicePort());
        System.out.println("Shutdown Port: " + tc.getShutdownPort());
        tc.setServicePort(9999);
        tc.setShutdownPort(5555);
        System.out.println("Service Port: " + tc.getServicePort());
        System.out.println("Shutdown Port: " + tc.getShutdownPort());
        System.out.println("Service Encoding: " + tc.getServiceAttribute("URIEncoding", false));
    }

    /** Instance Methods */
    public void addPropertyChangeListener(PropertyChangeListener listener) {
        this.listeners.add(listener);
    }

    public void removePropertyChangeListener(PropertyChangeListener listener) {
        this.listeners.remove(listener);
    }

    protected void notifyListeners(String propertyName, Object oldValue, Object newValue) {
        for (PropertyChangeListener listener : this.listeners) {
            listener.propertyChange(new PropertyChangeEvent(this, propertyName, oldValue, newValue));
        }
    }

    public String getServiceAttribute(String attribute, Boolean sslEnabled) {
        String result = null;
        int len = this.serviceConnectorNodeList.getLength();
        Node targetNode = null;
        for (int i=0; i<len; i++) {
            Node node = this.serviceConnectorNodeList.item(i);
            Node sslEnabledNode = node.getAttributes().getNamedItem("SSLEnabled");
            if (sslEnabled) {
                if (sslEnabledNode == null || !sslEnabledNode.getNodeValue().equals("true")) {
                    continue;
                } else {
                    targetNode = node;
                    break;
                }
            }
        }

        if (targetNode != null) {
            NamedNodeMap map = targetNode.getAttributes();
            Node target = map.getNamedItem(attribute);
            if (target != null) {
                result = target.getNodeValue();
            }
        }
        return result;
    }

    /**
     * @return the servicePort
     */
    public int getServicePort() {
        return Integer.parseInt(this.servicePortNode.getNodeValue());
    }

    /**
     * @return the shutdownPort
     */
    public int getShutdownPort() {
        return Integer.parseInt(this.shutdownPortNode.getNodeValue());
    }

    /**
     * @return the sslPort
     */
    public int getSslPort() {
        int mySslPort = this.sslServicePortNode == null ? 8443 : Integer.parseInt(this.sslServicePortNode.getNodeValue());
        return mySslPort;
    }

    protected void parseSourceXML(InputStream source) {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        try {
            DocumentBuilder builder = factory.newDocumentBuilder();
            this.source = builder.parse(source);
            XPathFactory pathFactory = XPathFactory.newInstance();
            XPath path = pathFactory.newXPath();
            this.serviceConnectorNodeList = (NodeList) path.evaluate("/Server/Service[@name='Catalina']/Connector", this.source, XPathConstants.NODESET);
            int len = this.serviceConnectorNodeList.getLength();
            for (int i=0; i<len; i++) {
                Node node = this.serviceConnectorNodeList.item(i);
                Node sslEnabledNode = node.getAttributes().getNamedItem("SSLEnabled");
                if (sslEnabledNode == null || !sslEnabledNode.getNodeValue().equals("true")) {
                    this.servicePortNode = node.getAttributes().getNamedItem("port");
                } else {
                    this.sslServicePortNode = node.getAttributes().getNamedItem("port");
                }
            }
            this.shutdownPortNode = (Node) path.evaluate("/Server/@port", this.source, XPathConstants.NODE);
            this.sslServicePortNode = this.sslServicePortNode == null ? this.createSslConnectorNode().getAttributes().getNamedItem("port") : this.sslServicePortNode;
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        } catch (SAXException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        }
    }

    private Node createSslConnectorNode() {
        NodeList serviceNodeList = this.source.getElementsByTagName("Service");
        Node catalinaServiceNode = null;
        for (int i=0; i < serviceNodeList.getLength(); i++) {
            Node serviceNode = serviceNodeList.item(i);
            Node nameNode = serviceNode.getAttributes().getNamedItem("name");
            if (nameNode.getNodeValue().equals("Catalina")) {
                catalinaServiceNode = serviceNode;
                break;
            }
        }

        if (catalinaServiceNode == null) {
            RuntimeException ex = new RuntimeException("*** Your server.xml is corrupted. No \"Service\" element exists ***");
            ex.printStackTrace();
            throw ex;
        }

        Element sslConnector = this.source.createElement("Connector");
        catalinaServiceNode.appendChild(sslConnector);

        sslConnector.setAttribute("port", "8443");
        sslConnector.setAttribute("protocol", "org.apache.coyote.http11.Http11Protocol");
        sslConnector.setAttribute("SSLEnabled", "true");
        sslConnector.setAttribute("clientAuth", "false");
        sslConnector.setAttribute("sslProtocol", "TLS");
        sslConnector.setAttribute("keystoreFile", "conf/keyStores/wmKeyStore");
        sslConnector.setAttribute("keystorePass", "wavemaker");

        return sslConnector;
    }

    /**
     * @param servicePort the servicePort to set
     */
    public void setServicePort(int servicePort) {
        Integer oldValue = new Integer(this.getServicePort());
        this.servicePortNode.setNodeValue(Integer.toString(servicePort));
        this.notifyListeners(PROPERTY_SERVICE_PORT, oldValue, servicePort);
    }

    /**
     * @param sslPort the SSL Port to set
     */
    public void setSslPort(int sslPort) {
        Integer oldValue = new Integer(this.getSslPort());
        this.sslServicePortNode.setNodeValue(Integer.toString(sslPort));
        this.notifyListeners(PROPERTY_SSL_PORT, oldValue, sslPort);
    }

    /**
     * @param shutdownPort the shutdownPort to set
     */
    public void setShutdownPort(int shutdownPort) {
        Integer oldValue = new Integer(this.getShutdownPort());
        this.shutdownPortNode.setNodeValue(Integer.toString(shutdownPort));
        this.notifyListeners(PROPERTY_SHUTDOWN_PORT, oldValue, shutdownPort);
    }

    public void serialize(OutputStream os) {
        try {
            // Prepare the DOM document for writing
            Source source = new DOMSource(this.source);

            // Prepare the output stream
            Result result = new StreamResult(os);

            // Write the DOM document to the file
            Transformer xformer = TransformerFactory.newInstance().newTransformer();
            xformer.transform(source, result);
        } catch (TransformerConfigurationException e) {
            e.printStackTrace();
        } catch (TransformerException e) {
            e.printStackTrace();
        }
    }
}
