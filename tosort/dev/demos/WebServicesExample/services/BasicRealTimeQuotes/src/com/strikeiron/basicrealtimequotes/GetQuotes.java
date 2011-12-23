
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
 *         &lt;element name="TickerSymbolList" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
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
    "tickerSymbolList"
})
@XmlRootElement(name = "GetQuotes", namespace = "http://www.strikeiron.com")
public class GetQuotes {

    @XmlElement(name = "TickerSymbolList", namespace = "http://www.strikeiron.com")
    protected String tickerSymbolList;

    /**
     * Gets the value of the tickerSymbolList property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTickerSymbolList() {
        return tickerSymbolList;
    }

    /**
     * Sets the value of the tickerSymbolList property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTickerSymbolList(String value) {
        this.tickerSymbolList = value;
    }

}
