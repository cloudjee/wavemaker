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

package com.wavemaker.tools.security;

import java.io.IOException;
import java.io.InputStream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.tools.util.TomcatUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 * Wrapped around server.xml, provides access to shutdown and service ports.
 * Cloned and created from TomcatConfig in launcher.
 * 
 * @author Seung Lee
 * @version $Rev$ - $Date$s
 */
public class TomcatConfig {

    protected Document source;

    protected NodeList serviceConnectorNodeList;

    protected Node servicePortNode;

    protected Node shutdownPortNode;

    protected Node sslServicePortNode;

    protected TomcatConfig(InputStream source) {
        this.parseSourceXML(source);
    }

    public static TomcatConfig GetDefaultConfig(StudioFileSystem fileSystem) {
        TomcatConfig result = null;
        try {
            File serverXML = TomcatUtils.getTomcatServerXML(fileSystem);
            if (serverXML != null) {
                InputStream source = serverXML.getContent().asInputStream();
                result = new TomcatConfig(source);
                source.close();
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
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
        if (this.sslServicePortNode == null) {
            return -99;
        } else {
            return Integer.parseInt(this.sslServicePortNode.getNodeValue());
        }
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
                Node protocolNode = node.getAttributes().getNamedItem("protocol");
                if (protocolNode != null && !protocolNode.getNodeValue().contains("Http") && !protocolNode.getNodeValue().contains("HTTP")) {
                    continue;
                }
                Node sslEnabledNode = node.getAttributes().getNamedItem("SSLEnabled");
                if (sslEnabledNode == null || !sslEnabledNode.getNodeValue().equals("true")) {
                    servicePortNode = node.getAttributes().getNamedItem("port");
                } else {
                    sslServicePortNode = node.getAttributes().getNamedItem("port");
                }
            }
            this.shutdownPortNode = (Node) path.evaluate("/Server/@port", this.source, XPathConstants.NODE);
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
}
