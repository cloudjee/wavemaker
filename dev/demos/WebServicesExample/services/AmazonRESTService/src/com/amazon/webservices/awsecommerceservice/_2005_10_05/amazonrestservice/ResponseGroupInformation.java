
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
 *         &lt;element name="Name" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="CreationDate" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ValidOperations" minOccurs="0">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="Operation" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *         &lt;element name="Elements" minOccurs="0">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="Element" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
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
    "name",
    "creationDate",
    "validOperations",
    "elements"
})
@XmlRootElement(name = "ResponseGroupInformation", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class ResponseGroupInformation {

    @XmlElement(name = "Name", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String name;
    @XmlElement(name = "CreationDate", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String creationDate;
    @XmlElement(name = "ValidOperations", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ResponseGroupInformation.ValidOperations validOperations;
    @XmlElement(name = "Elements", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ResponseGroupInformation.Elements elements;

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
     * Gets the value of the creationDate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCreationDate() {
        return creationDate;
    }

    /**
     * Sets the value of the creationDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCreationDate(String value) {
        this.creationDate = value;
    }

    /**
     * Gets the value of the validOperations property.
     * 
     * @return
     *     possible object is
     *     {@link ResponseGroupInformation.ValidOperations }
     *     
     */
    public ResponseGroupInformation.ValidOperations getValidOperations() {
        return validOperations;
    }

    /**
     * Sets the value of the validOperations property.
     * 
     * @param value
     *     allowed object is
     *     {@link ResponseGroupInformation.ValidOperations }
     *     
     */
    public void setValidOperations(ResponseGroupInformation.ValidOperations value) {
        this.validOperations = value;
    }

    /**
     * Gets the value of the elements property.
     * 
     * @return
     *     possible object is
     *     {@link ResponseGroupInformation.Elements }
     *     
     */
    public ResponseGroupInformation.Elements getElements() {
        return elements;
    }

    /**
     * Sets the value of the elements property.
     * 
     * @param value
     *     allowed object is
     *     {@link ResponseGroupInformation.Elements }
     *     
     */
    public void setElements(ResponseGroupInformation.Elements value) {
        this.elements = value;
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
     *         &lt;element name="Element" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
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
        "elements"
    })
    public static class Elements {

        @XmlElement(name = "Element", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected List<String> elements;

        /**
         * Gets the value of the elements property.
         * 
         * <p>
         * This accessor method returns a reference to the live list,
         * not a snapshot. Therefore any modification you make to the
         * returned list will be present inside the JAXB object.
         * This is why there is not a <CODE>set</CODE> method for the elements property.
         * 
         * <p>
         * For example, to add a new item, do as follows:
         * <pre>
         *    getElements().add(newItem);
         * </pre>
         * 
         * 
         * <p>
         * Objects of the following type(s) are allowed in the list
         * {@link String }
         * 
         * 
         */
        public List<String> getElements() {
            if (elements == null) {
                elements = new ArrayList<String>();
            }
            return this.elements;
        }

        /**
         * Sets the value of the elements property.
         * 
         * @param elements
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setElements(List<String> elements) {
            this.elements = elements;
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
     *         &lt;element name="Operation" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
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
        "operations"
    })
    public static class ValidOperations {

        @XmlElement(name = "Operation", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected List<String> operations;

        /**
         * Gets the value of the operations property.
         * 
         * <p>
         * This accessor method returns a reference to the live list,
         * not a snapshot. Therefore any modification you make to the
         * returned list will be present inside the JAXB object.
         * This is why there is not a <CODE>set</CODE> method for the operations property.
         * 
         * <p>
         * For example, to add a new item, do as follows:
         * <pre>
         *    getOperations().add(newItem);
         * </pre>
         * 
         * 
         * <p>
         * Objects of the following type(s) are allowed in the list
         * {@link String }
         * 
         * 
         */
        public List<String> getOperations() {
            if (operations == null) {
                operations = new ArrayList<String>();
            }
            return this.operations;
        }

        /**
         * Sets the value of the operations property.
         * 
         * @param operations
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setOperations(List<String> operations) {
            this.operations = operations;
        }

    }

}
