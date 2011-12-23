
package com.yahooapis.local.trafficdata.yahootraffic;

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
 *         &lt;element name="LastUpdateDate" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="Warning" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Result" type="{urn:yahoo:maps}ResultType" maxOccurs="50" minOccurs="0"/>
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
    "lastUpdateDate",
    "warning",
    "results"
})
@XmlRootElement(name = "ResultSet", namespace = "urn:yahoo:maps")
public class ResultSet {

    @XmlElement(name = "LastUpdateDate", namespace = "urn:yahoo:maps", required = true)
    protected String lastUpdateDate;
    @XmlElement(name = "Warning", namespace = "urn:yahoo:maps")
    protected String warning;
    @XmlElement(name = "Result", namespace = "urn:yahoo:maps")
    protected List<ResultTypeType> results;

    /**
     * Gets the value of the lastUpdateDate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLastUpdateDate() {
        return lastUpdateDate;
    }

    /**
     * Sets the value of the lastUpdateDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLastUpdateDate(String value) {
        this.lastUpdateDate = value;
    }

    /**
     * Gets the value of the warning property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getWarning() {
        return warning;
    }

    /**
     * Sets the value of the warning property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setWarning(String value) {
        this.warning = value;
    }

    /**
     * Gets the value of the results property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the results property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getResults().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ResultTypeType }
     * 
     * 
     */
    public List<ResultTypeType> getResults() {
        if (results == null) {
            results = new ArrayList<ResultTypeType>();
        }
        return this.results;
    }

    /**
     * Sets the value of the results property.
     * 
     * @param results
     *     allowed object is
     *     {@link ResultTypeType }
     *     
     */
    public void setResults(List<ResultTypeType> results) {
        this.results = results;
    }

}
