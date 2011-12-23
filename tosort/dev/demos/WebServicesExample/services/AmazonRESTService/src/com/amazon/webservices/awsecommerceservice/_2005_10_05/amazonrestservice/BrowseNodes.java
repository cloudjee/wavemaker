
package com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Request" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}BrowseNode" maxOccurs="unbounded"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "request",
    "browseNodes"
})
@XmlRootElement(name = "BrowseNodes", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class BrowseNodes {

    @XmlElement(name = "Request", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Request request;
    @XmlElement(name = "BrowseNode", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected List<BrowseNode> browseNodes;

    /**
     * Gets the value of the request property.
     * 
     * @return
     *     possible object is
     *     {@link Request }
     *     
     */
    public Request getRequest() {
        return request;
    }

    /**
     * Sets the value of the request property.
     * 
     * @param value
     *     allowed object is
     *     {@link Request }
     *     
     */
    public void setRequest(Request value) {
        this.request = value;
    }

    /**
     * Gets the value of the browseNodes property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the browseNodes property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getBrowseNodes().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link BrowseNode }
     * 
     * 
     */
    public List<BrowseNode> getBrowseNodes() {
        if (browseNodes == null) {
            browseNodes = new ArrayList<BrowseNode>();
        }
        return this.browseNodes;
    }

    /**
     * Sets the value of the browseNodes property.
     * 
     * @param browseNodes
     *     allowed object is
     *     {@link BrowseNode }
     *     
     */
    public void setBrowseNodes(List<BrowseNode> browseNodes) {
        this.browseNodes = browseNodes;
    }

}
