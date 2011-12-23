
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
 *         &lt;element name="Description" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="RequiredParameters" minOccurs="0">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="Parameter" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *         &lt;element name="AvailableParameters" minOccurs="0">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="Parameter" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *         &lt;element name="DefaultResponseGroups" minOccurs="0">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="ResponseGroup" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *         &lt;element name="AvailableResponseGroups" minOccurs="0">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="ResponseGroup" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
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
    "description",
    "requiredParameters",
    "availableParameters",
    "defaultResponseGroups",
    "availableResponseGroups"
})
@XmlRootElement(name = "OperationInformation", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class OperationInformation {

    @XmlElement(name = "Name", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String name;
    @XmlElement(name = "Description", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String description;
    @XmlElement(name = "RequiredParameters", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected OperationInformation.RequiredParameters requiredParameters;
    @XmlElement(name = "AvailableParameters", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected OperationInformation.AvailableParameters availableParameters;
    @XmlElement(name = "DefaultResponseGroups", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected OperationInformation.DefaultResponseGroups defaultResponseGroups;
    @XmlElement(name = "AvailableResponseGroups", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected OperationInformation.AvailableResponseGroups availableResponseGroups;

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
     * Gets the value of the description property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the value of the description property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDescription(String value) {
        this.description = value;
    }

    /**
     * Gets the value of the requiredParameters property.
     * 
     * @return
     *     possible object is
     *     {@link OperationInformation.RequiredParameters }
     *     
     */
    public OperationInformation.RequiredParameters getRequiredParameters() {
        return requiredParameters;
    }

    /**
     * Sets the value of the requiredParameters property.
     * 
     * @param value
     *     allowed object is
     *     {@link OperationInformation.RequiredParameters }
     *     
     */
    public void setRequiredParameters(OperationInformation.RequiredParameters value) {
        this.requiredParameters = value;
    }

    /**
     * Gets the value of the availableParameters property.
     * 
     * @return
     *     possible object is
     *     {@link OperationInformation.AvailableParameters }
     *     
     */
    public OperationInformation.AvailableParameters getAvailableParameters() {
        return availableParameters;
    }

    /**
     * Sets the value of the availableParameters property.
     * 
     * @param value
     *     allowed object is
     *     {@link OperationInformation.AvailableParameters }
     *     
     */
    public void setAvailableParameters(OperationInformation.AvailableParameters value) {
        this.availableParameters = value;
    }

    /**
     * Gets the value of the defaultResponseGroups property.
     * 
     * @return
     *     possible object is
     *     {@link OperationInformation.DefaultResponseGroups }
     *     
     */
    public OperationInformation.DefaultResponseGroups getDefaultResponseGroups() {
        return defaultResponseGroups;
    }

    /**
     * Sets the value of the defaultResponseGroups property.
     * 
     * @param value
     *     allowed object is
     *     {@link OperationInformation.DefaultResponseGroups }
     *     
     */
    public void setDefaultResponseGroups(OperationInformation.DefaultResponseGroups value) {
        this.defaultResponseGroups = value;
    }

    /**
     * Gets the value of the availableResponseGroups property.
     * 
     * @return
     *     possible object is
     *     {@link OperationInformation.AvailableResponseGroups }
     *     
     */
    public OperationInformation.AvailableResponseGroups getAvailableResponseGroups() {
        return availableResponseGroups;
    }

    /**
     * Sets the value of the availableResponseGroups property.
     * 
     * @param value
     *     allowed object is
     *     {@link OperationInformation.AvailableResponseGroups }
     *     
     */
    public void setAvailableResponseGroups(OperationInformation.AvailableResponseGroups value) {
        this.availableResponseGroups = value;
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
     *         &lt;element name="Parameter" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
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
        "parameters"
    })
    public static class AvailableParameters {

        @XmlElement(name = "Parameter", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected List<String> parameters;

        /**
         * Gets the value of the parameters property.
         * 
         * <p>
         * This accessor method returns a reference to the live list,
         * not a snapshot. Therefore any modification you make to the
         * returned list will be present inside the JAXB object.
         * This is why there is not a <CODE>set</CODE> method for the parameters property.
         * 
         * <p>
         * For example, to add a new item, do as follows:
         * <pre>
         *    getParameters().add(newItem);
         * </pre>
         * 
         * 
         * <p>
         * Objects of the following type(s) are allowed in the list
         * {@link String }
         * 
         * 
         */
        public List<String> getParameters() {
            if (parameters == null) {
                parameters = new ArrayList<String>();
            }
            return this.parameters;
        }

        /**
         * Sets the value of the parameters property.
         * 
         * @param parameters
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setParameters(List<String> parameters) {
            this.parameters = parameters;
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
     *         &lt;element name="ResponseGroup" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
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
        "responseGroups"
    })
    public static class AvailableResponseGroups {

        @XmlElement(name = "ResponseGroup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected List<String> responseGroups;

        /**
         * Gets the value of the responseGroups property.
         * 
         * <p>
         * This accessor method returns a reference to the live list,
         * not a snapshot. Therefore any modification you make to the
         * returned list will be present inside the JAXB object.
         * This is why there is not a <CODE>set</CODE> method for the responseGroups property.
         * 
         * <p>
         * For example, to add a new item, do as follows:
         * <pre>
         *    getResponseGroups().add(newItem);
         * </pre>
         * 
         * 
         * <p>
         * Objects of the following type(s) are allowed in the list
         * {@link String }
         * 
         * 
         */
        public List<String> getResponseGroups() {
            if (responseGroups == null) {
                responseGroups = new ArrayList<String>();
            }
            return this.responseGroups;
        }

        /**
         * Sets the value of the responseGroups property.
         * 
         * @param responseGroups
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setResponseGroups(List<String> responseGroups) {
            this.responseGroups = responseGroups;
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
     *         &lt;element name="ResponseGroup" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
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
        "responseGroups"
    })
    public static class DefaultResponseGroups {

        @XmlElement(name = "ResponseGroup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected List<String> responseGroups;

        /**
         * Gets the value of the responseGroups property.
         * 
         * <p>
         * This accessor method returns a reference to the live list,
         * not a snapshot. Therefore any modification you make to the
         * returned list will be present inside the JAXB object.
         * This is why there is not a <CODE>set</CODE> method for the responseGroups property.
         * 
         * <p>
         * For example, to add a new item, do as follows:
         * <pre>
         *    getResponseGroups().add(newItem);
         * </pre>
         * 
         * 
         * <p>
         * Objects of the following type(s) are allowed in the list
         * {@link String }
         * 
         * 
         */
        public List<String> getResponseGroups() {
            if (responseGroups == null) {
                responseGroups = new ArrayList<String>();
            }
            return this.responseGroups;
        }

        /**
         * Sets the value of the responseGroups property.
         * 
         * @param responseGroups
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setResponseGroups(List<String> responseGroups) {
            this.responseGroups = responseGroups;
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
     *         &lt;element name="Parameter" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded"/>
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
        "parameters"
    })
    public static class RequiredParameters {

        @XmlElement(name = "Parameter", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected List<String> parameters;

        /**
         * Gets the value of the parameters property.
         * 
         * <p>
         * This accessor method returns a reference to the live list,
         * not a snapshot. Therefore any modification you make to the
         * returned list will be present inside the JAXB object.
         * This is why there is not a <CODE>set</CODE> method for the parameters property.
         * 
         * <p>
         * For example, to add a new item, do as follows:
         * <pre>
         *    getParameters().add(newItem);
         * </pre>
         * 
         * 
         * <p>
         * Objects of the following type(s) are allowed in the list
         * {@link String }
         * 
         * 
         */
        public List<String> getParameters() {
            if (parameters == null) {
                parameters = new ArrayList<String>();
            }
            return this.parameters;
        }

        /**
         * Sets the value of the parameters property.
         * 
         * @param parameters
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setParameters(List<String> parameters) {
            this.parameters = parameters;
        }

    }

}
