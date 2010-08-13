
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
 *         &lt;element name="BrowseNodeId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Name" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Children" minOccurs="0">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}BrowseNode" maxOccurs="unbounded"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *         &lt;element name="Ancestors" minOccurs="0">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}BrowseNode" maxOccurs="unbounded"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
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
    "browseNodeId",
    "name",
    "children",
    "ancestors"
})
@XmlRootElement(name = "BrowseNode", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class BrowseNode {

    @XmlElement(name = "BrowseNodeId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String browseNodeId;
    @XmlElement(name = "Name", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String name;
    @XmlElement(name = "Children", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected BrowseNode.Children children;
    @XmlElement(name = "Ancestors", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected BrowseNode.Ancestors ancestors;

    /**
     * Gets the value of the browseNodeId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBrowseNodeId() {
        return browseNodeId;
    }

    /**
     * Sets the value of the browseNodeId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBrowseNodeId(String value) {
        this.browseNodeId = value;
    }

    /**
     * Gets the value of the name property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the value of the name property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setName(String value) {
        this.name = value;
    }

    /**
     * Gets the value of the children property.
     * 
     * @return
     *     possible object is
     *     {@link BrowseNode.Children }
     *     
     */
    public BrowseNode.Children getChildren() {
        return children;
    }

    /**
     * Sets the value of the children property.
     * 
     * @param value
     *     allowed object is
     *     {@link BrowseNode.Children }
     *     
     */
    public void setChildren(BrowseNode.Children value) {
        this.children = value;
    }

    /**
     * Gets the value of the ancestors property.
     * 
     * @return
     *     possible object is
     *     {@link BrowseNode.Ancestors }
     *     
     */
    public BrowseNode.Ancestors getAncestors() {
        return ancestors;
    }

    /**
     * Sets the value of the ancestors property.
     * 
     * @param value
     *     allowed object is
     *     {@link BrowseNode.Ancestors }
     *     
     */
    public void setAncestors(BrowseNode.Ancestors value) {
        this.ancestors = value;
    }


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
        "browseNodes"
    })
    public static class Ancestors {

        @XmlElement(name = "BrowseNode", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected List<BrowseNode> browseNodes;

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
        "browseNodes"
    })
    public static class Children {

        @XmlElement(name = "BrowseNode", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected List<BrowseNode> browseNodes;

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

}
