
package com.wavemaker.runtime.ws.salesforce.gen;

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
 *         &lt;element name="result" type="{urn:partner.soap.sforce.com}DescribeDataCategoryGroupStructureResult" maxOccurs="100" minOccurs="0"/>
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
    "results"
})
@XmlRootElement(name = "describeDataCategoryGroupStructuresResponse", namespace = "urn:partner.soap.sforce.com")
public class DescribeDataCategoryGroupStructuresResponse {

    @XmlElement(name = "result", namespace = "urn:partner.soap.sforce.com")
    protected List<DescribeDataCategoryGroupStructureResultType> results;

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
     * {@link DescribeDataCategoryGroupStructureResultType }
     * 
     * 
     */
    public List<DescribeDataCategoryGroupStructureResultType> getResults() {
        if (results == null) {
            results = new ArrayList<DescribeDataCategoryGroupStructureResultType>();
        }
        return this.results;
    }

    /**
     * Sets the value of the results property.
     * 
     * @param results
     *     allowed object is
     *     {@link DescribeDataCategoryGroupStructureResultType }
     *     
     */
    public void setResults(List<DescribeDataCategoryGroupStructureResultType> results) {
        this.results = results;
    }

}
