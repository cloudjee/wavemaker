
package com.strikeiron.basicrealtimequotes;

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
 *         &lt;element name="GetQuotesResult" type="{http://www.strikeiron.com}ArrayOfRealQuote" minOccurs="0"/>
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
    "getQuotesResult"
})
@XmlRootElement(name = "GetQuotesResponse", namespace = "http://www.strikeiron.com")
public class GetQuotesResponse {

    @XmlElement(name = "GetQuotesResult", namespace = "http://www.strikeiron.com")
    protected ArrayOfRealQuoteType getQuotesResult;

    /**
     * Gets the value of the getQuotesResult property.
     * 
     * @return
     *     possible object is
     *     {@link ArrayOfRealQuoteType }
     *     
     */
    public ArrayOfRealQuoteType getGetQuotesResult() {
        return getQuotesResult;
    }

    /**
     * Sets the value of the getQuotesResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ArrayOfRealQuoteType }
     *     
     */
    public void setGetQuotesResult(ArrayOfRealQuoteType value) {
        this.getQuotesResult = value;
    }

}
