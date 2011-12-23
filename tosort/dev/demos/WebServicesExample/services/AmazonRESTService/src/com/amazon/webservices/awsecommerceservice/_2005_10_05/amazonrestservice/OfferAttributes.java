
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
 *         &lt;element name="Condition" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="SubCondition" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ConditionNote" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
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
    "condition",
    "subCondition",
    "conditionNote"
})
@XmlRootElement(name = "OfferAttributes", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class OfferAttributes {

    @XmlElement(name = "Condition", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String condition;
    @XmlElement(name = "SubCondition", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String subCondition;
    @XmlElement(name = "ConditionNote", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String conditionNote;

    /**
     * Gets the value of the condition property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCondition() {
        return condition;
    }

    /**
     * Sets the value of the condition property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCondition(String value) {
        this.condition = value;
    }

    /**
     * Gets the value of the subCondition property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSubCondition() {
        return subCondition;
    }

    /**
     * Sets the value of the subCondition property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSubCondition(String value) {
        this.subCondition = value;
    }

    /**
     * Gets the value of the conditionNote property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getConditionNote() {
        return conditionNote;
    }

    /**
     * Sets the value of the conditionNote property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setConditionNote(String value) {
        this.conditionNote = value;
    }

}
