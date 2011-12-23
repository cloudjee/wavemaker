
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
 *         &lt;element name="ListmaniaList" maxOccurs="unbounded">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="ListId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *                   &lt;element name="ListName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
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
    "listmaniaLists"
})
@XmlRootElement(name = "ListmaniaLists", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class ListmaniaLists {

    @XmlElement(name = "ListmaniaList", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected List<ListmaniaLists.ListmaniaList> listmaniaLists;

    /**
     * Gets the value of the listmaniaLists property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the listmaniaLists property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getListmaniaLists().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ListmaniaLists.ListmaniaList }
     * 
     * 
     */
    public List<ListmaniaLists.ListmaniaList> getListmaniaLists() {
        if (listmaniaLists == null) {
            listmaniaLists = new ArrayList<ListmaniaLists.ListmaniaList>();
        }
        return this.listmaniaLists;
    }

    /**
     * Sets the value of the listmaniaLists property.
     * 
     * @param listmaniaLists
     *     allowed object is
     *     {@link ListmaniaLists.ListmaniaList }
     *     
     */
    public void setListmaniaLists(List<ListmaniaLists.ListmaniaList> listmaniaLists) {
        this.listmaniaLists = listmaniaLists;
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
     *         &lt;element name="ListId" type="{http://www.w3.org/2001/XMLSchema}string"/>
     *         &lt;element name="ListName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
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
        "listId",
        "listName"
    })
    public static class ListmaniaList {

        @XmlElement(name = "ListId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
        protected String listId;
        @XmlElement(name = "ListName", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
        protected String listName;

        /**
         * Gets the value of the listId property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getListId() {
            return listId;
        }

        /**
         * Sets the value of the listId property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setListId(String value) {
            this.listId = value;
        }

        /**
         * Gets the value of the listName property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getListName() {
            return listName;
        }

        /**
         * Sets the value of the listName property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setListName(String value) {
            this.listName = value;
        }

    }

}
