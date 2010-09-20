
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
 *         &lt;element name="actions" type="{urn:partner.soap.sforce.com}ProcessRequest" maxOccurs="unbounded" minOccurs="0"/>
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
    "actions"
})
@XmlRootElement(name = "process", namespace = "urn:partner.soap.sforce.com")
public class Process {

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<ProcessRequestType> actions;

    /**
     * Gets the value of the actions property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the actions property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getActions().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ProcessRequestType }
     * 
     * 
     */
    public List<ProcessRequestType> getActions() {
        if (actions == null) {
            actions = new ArrayList<ProcessRequestType>();
        }
        return this.actions;
    }

    /**
     * Sets the value of the actions property.
     * 
     * @param actions
     *     allowed object is
     *     {@link ProcessRequestType }
     *     
     */
    public void setActions(List<ProcessRequestType> actions) {
        this.actions = actions;
    }

}
