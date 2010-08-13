
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
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}EditorialReview" maxOccurs="unbounded" minOccurs="0"/>
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
    "editorialReviews"
})
@XmlRootElement(name = "EditorialReviews", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class EditorialReviews {

    @XmlElement(name = "EditorialReview", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected List<EditorialReview> editorialReviews;

    /**
     * Gets the value of the editorialReviews property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the editorialReviews property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getEditorialReviews().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link EditorialReview }
     * 
     * 
     */
    public List<EditorialReview> getEditorialReviews() {
        if (editorialReviews == null) {
            editorialReviews = new ArrayList<EditorialReview>();
        }
        return this.editorialReviews;
    }

    /**
     * Sets the value of the editorialReviews property.
     * 
     * @param editorialReviews
     *     allowed object is
     *     {@link EditorialReview }
     *     
     */
    public void setEditorialReviews(List<EditorialReview> editorialReviews) {
        this.editorialReviews = editorialReviews;
    }

}
