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

import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
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

    // Members
    protected Document source;

    protected Node serviceConnectorNode;

    protected Node servicePortNode;

    protected Node shutdownPortNode;

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
        System.out.println("Service Encoding: " + tc.getServiceAttribute("URIEncoding"));
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

    public String getServiceAttribute(String attribute) {
        String result = null;
        NamedNodeMap map = this.serviceConnectorNode.getAttributes();
        Node target = map.getNamedItem(attribute);
        if (target != null) {
            result = target.getNodeValue();
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

    protected void parseSourceXML(InputStream source) {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        try {
            DocumentBuilder builder = factory.newDocumentBuilder();
            this.source = builder.parse(source);
            XPathFactory pathFactory = XPathFactory.newInstance();
            XPath path = pathFactory.newXPath();
            this.serviceConnectorNode = (Node) path.evaluate("/Server/Service[@name='Catalina']/Connector", this.source, XPathConstants.NODE);
            this.shutdownPortNode = (Node) path.evaluate("/Server/@port", this.source, XPathConstants.NODE);
            this.servicePortNode = (Node) path.evaluate("/Server/Service[@name='Catalina']/Connector/@port", this.source, XPathConstants.NODE);
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

    /**
     * @param servicePort the servicePort to set
     */
    public void setServicePort(int newValue) {
        Integer oldValue = new Integer(this.getServicePort());
        this.servicePortNode.setNodeValue(Integer.toString(newValue));
        this.notifyListeners(PROPERTY_SERVICE_PORT, oldValue, newValue);
    }

    /**
     * @param shutdownPort the shutdownPort to set
     */
    public void setShutdownPort(int newValue) {
        Integer oldValue = new Integer(this.getShutdownPort());
        this.shutdownPortNode.setNodeValue(Integer.toString(newValue));
        this.notifyListeners(PROPERTY_SHUTDOWN_PORT, oldValue, newValue);
    }

    public void setServiceAttribute(String attribute, String newValue) {
        NamedNodeMap map = this.serviceConnectorNode.getAttributes();
        Node target = map.getNamedItem(attribute);
        if (target != null) {
            String oldValue = target.getNodeValue();
            target.setNodeValue(newValue);
            this.notifyListeners(attribute, oldValue, newValue);
        }
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
