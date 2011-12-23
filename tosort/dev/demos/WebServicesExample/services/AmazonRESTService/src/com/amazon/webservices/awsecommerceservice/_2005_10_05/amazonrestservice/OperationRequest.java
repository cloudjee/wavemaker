
package com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice;

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
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}HTTPHeaders" minOccurs="0"/>
 *         &lt;element name="RequestId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Arguments" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Errors" minOccurs="0"/>
 *         &lt;element name="RequestProcessingTime" type="{http://www.w3.org/2001/XMLSchema}float" minOccurs="0"/>
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
    "httpHeaders",
    "requestId",
    "arguments",
    "errors",
    "requestProcessingTime"
})
@XmlRootElement(name = "OperationRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class OperationRequest {

    @XmlElement(name = "HTTPHeaders", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected HTTPHeaders httpHeaders;
    @XmlElement(name = "RequestId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String requestId;
    @XmlElement(name = "Arguments", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Arguments arguments;
    @XmlElement(name = "Errors", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Errors errors;
    @XmlElement(name = "RequestProcessingTime", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Float requestProcessingTime;

    /**
     * Gets the value of the httpHeaders property.
     * 
     * @return
     *     possible object is
     *     {@link HTTPHeaders }
     *     
     */
    public HTTPHeaders getHTTPHeaders() {
        return httpHeaders;
    }

    /**
     * Sets the value of the httpHeaders property.
     * 
     * @param value
     *     allowed object is
     *     {@link HTTPHeaders }
     *     
     */
    public void setHTTPHeaders(HTTPHeaders value) {
        this.httpHeaders = value;
    }

    /**
     * Gets the value of the requestId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRequestId() {
        return requestId;
    }

    /**
     * Sets the value of the requestId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRequestId(String value) {
        this.requestId = value;
    }

    /**
     * Gets the value of the arguments property.
     * 
     * @return
     *     possible object is
     *     {@link Arguments }
     *     
     */
    public Arguments getArguments() {
        return arguments;
    }

    /**
     * Sets the value of the arguments property.
     * 
     * @param value
     *     allowed object is
     *     {@link Arguments }
     *     
     */
    public void setArguments(Arguments value) {
        this.arguments = value;
    }

    /**
     * Gets the value of the errors property.
     * 
     * @return
     *     possible object is
     *     {@link Errors }
     *     
     */
    public Errors getErrors() {
        return errors;
    }

    /**
     * Sets the value of the errors property.
     * 
     * @param value
     *     allowed object is
     *     {@link Errors }
     *     
     */
    public void setErrors(Errors value) {
        this.errors = value;
    }

    /**
     * Gets the value of the requestProcessingTime property.
     * 
     * @return
     *     possible object is
     *     {@link Float }
     *     
     */
    public Float getRequestProcessingTime() {
        return requestProcessingTime;
    }

    /**
     * Sets the value of the requestProcessingTime property.
     * 
     * @param value
     *     allowed object is
     *     {@link Float }
     *     
     */
    public void setRequestProcessingTime(Float value) {
        this.requestProcessingTime = value;
    }

}
