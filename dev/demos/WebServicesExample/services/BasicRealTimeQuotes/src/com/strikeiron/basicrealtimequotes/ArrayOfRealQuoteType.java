
package com.strikeiron.basicrealtimequotes;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ArrayOfRealQuote complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ArrayOfRealQuote">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="RealQuote" type="{http://www.strikeiron.com}RealQuote" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ArrayOfRealQuote", namespace = "http://www.strikeiron.com", propOrder = {
    "realQuotes"
})
public class ArrayOfRealQuoteType {

    @XmlElement(name = "RealQuote", namespace = "http://www.strikeiron.com", nillable = true)
    protected List<RealQuoteType> realQuotes;

    /**
     * Gets the value of the realQuotes property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the realQuotes property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getRealQuotes().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link RealQuoteType }
     * 
     * 
     */
    public List<RealQuoteType> getRealQuotes() {
        if (realQuotes == null) {
            realQuotes = new ArrayList<RealQuoteType>();
        }
        return this.realQuotes;
    }

    /**
     * Sets the value of the realQuotes property.
     * 
     * @param realQuotes
     *     allowed object is
     *     {@link RealQuoteType }
     *     
     */
    public void setRealQuotes(List<RealQuoteType> realQuotes) {
        this.realQuotes = realQuotes;
    }

}
