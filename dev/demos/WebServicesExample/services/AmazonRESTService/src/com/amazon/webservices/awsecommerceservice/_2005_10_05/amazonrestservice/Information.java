
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
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}OperationInformation" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ResponseGroupInformation" maxOccurs="unbounded" minOccurs="0"/>
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
    "operationInformations",
    "responseGroupInformations"
})
@XmlRootElement(name = "Information", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class Information {

    @XmlElement(name = "Request", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Request request;
    @XmlElement(name = "OperationInformation", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected List<OperationInformation> operationInformations;
    @XmlElement(name = "ResponseGroupInformation", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected List<ResponseGroupInformation> responseGroupInformations;

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
     * Gets the value of the operationInformations property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the operationInformations property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getOperationInformations().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link OperationInformation }
     * 
     * 
     */
    public List<OperationInformation> getOperationInformations() {
        if (operationInformations == null) {
            operationInformations = new ArrayList<OperationInformation>();
        }
        return this.operationInformations;
    }

    /**
     * Gets the value of the responseGroupInformations property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the responseGroupInformations property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getResponseGroupInformations().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ResponseGroupInformation }
     * 
     * 
     */
    public List<ResponseGroupInformation> getResponseGroupInformations() {
        if (responseGroupInformations == null) {
            responseGroupInformations = new ArrayList<ResponseGroupInformation>();
        }
        return this.responseGroupInformations;
    }

    /**
     * Sets the value of the operationInformations property.
     * 
     * @param operationInformations
     *     allowed object is
     *     {@link OperationInformation }
     *     
     */
    public void setOperationInformations(List<OperationInformation> operationInformations) {
        this.operationInformations = operationInformations;
    }

    /**
     * Sets the value of the responseGroupInformations property.
     * 
     * @param responseGroupInformations
     *     allowed object is
     *     {@link ResponseGroupInformation }
     *     
     */
    public void setResponseGroupInformations(List<ResponseGroupInformation> responseGroupInformations) {
        this.responseGroupInformations = responseGroupInformations;
    }

}
