
package com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSchemaType;
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
 *         &lt;element name="ListId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="ListURL" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="RegistryNumber" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ListName" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="ListType">
 *           &lt;simpleType>
 *             &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *               &lt;enumeration value="WishList"/>
 *               &lt;enumeration value="WeddingRegistry"/>
 *               &lt;enumeration value="BabyRegistry"/>
 *               &lt;enumeration value="Listmania"/>
 *             &lt;/restriction>
 *           &lt;/simpleType>
 *         &lt;/element>
 *         &lt;element name="TotalItems" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
 *         &lt;element name="TotalPages" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
 *         &lt;element name="DateCreated" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="OccasionDate" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="CustomerName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="PartnerName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="AdditionalName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Comment" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Image" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Image" minOccurs="0"/>
 *         &lt;element name="AverageRating" type="{http://www.w3.org/2001/XMLSchema}decimal" minOccurs="0"/>
 *         &lt;element name="TotalVotes" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
 *         &lt;element name="TotalTimesRead" type="{http://www.w3.org/2001/XMLSchema}nonNegativeInteger" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ListItem" maxOccurs="unbounded" minOccurs="0"/>
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
    "listURL",
    "registryNumber",
    "listName",
    "listType",
    "totalItems",
    "totalPages",
    "dateCreated",
    "occasionDate",
    "customerName",
    "partnerName",
    "additionalName",
    "comment",
    "image",
    "averageRating",
    "totalVotes",
    "totalTimesRead",
    "listItems"
})
@XmlRootElement(name = "List", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class List {

    @XmlElement(name = "ListId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String listId;
    @XmlElement(name = "ListURL", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String listURL;
    @XmlElement(name = "RegistryNumber", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String registryNumber;
    @XmlElement(name = "ListName", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String listName;
    @XmlElement(name = "ListType", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String listType;
    @XmlElement(name = "TotalItems", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "nonNegativeInteger")
    protected BigInteger totalItems;
    @XmlElement(name = "TotalPages", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "nonNegativeInteger")
    protected BigInteger totalPages;
    @XmlElement(name = "DateCreated", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String dateCreated;
    @XmlElement(name = "OccasionDate", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String occasionDate;
    @XmlElement(name = "CustomerName", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String customerName;
    @XmlElement(name = "PartnerName", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String partnerName;
    @XmlElement(name = "AdditionalName", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String additionalName;
    @XmlElement(name = "Comment", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String comment;
    @XmlElement(name = "Image", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ImageType image;
    @XmlElement(name = "AverageRating", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected BigDecimal averageRating;
    @XmlElement(name = "TotalVotes", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "nonNegativeInteger")
    protected BigInteger totalVotes;
    @XmlElement(name = "TotalTimesRead", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "nonNegativeInteger")
    protected BigInteger totalTimesRead;
    @XmlElement(name = "ListItem", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected java.util.List<ListItem> listItems;

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
     * Gets the value of the listURL property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getListURL() {
        return listURL;
    }

    /**
     * Sets the value of the listURL property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setListURL(String value) {
        this.listURL = value;
    }

    /**
     * Gets the value of the registryNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRegistryNumber() {
        return registryNumber;
    }

    /**
     * Sets the value of the registryNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRegistryNumber(String value) {
        this.registryNumber = value;
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

    /**
     * Gets the value of the listType property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getListType() {
        return listType;
    }

    /**
     * Sets the value of the listType property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setListType(String value) {
        this.listType = value;
    }

    /**
     * Gets the value of the totalItems property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getTotalItems() {
        return totalItems;
    }

    /**
     * Sets the value of the totalItems property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setTotalItems(BigInteger value) {
        this.totalItems = value;
    }

    /**
     * Gets the value of the totalPages property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getTotalPages() {
        return totalPages;
    }

    /**
     * Sets the value of the totalPages property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setTotalPages(BigInteger value) {
        this.totalPages = value;
    }

    /**
     * Gets the value of the dateCreated property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDateCreated() {
        return dateCreated;
    }

    /**
     * Sets the value of the dateCreated property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDateCreated(String value) {
        this.dateCreated = value;
    }

    /**
     * Gets the value of the occasionDate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getOccasionDate() {
        return occasionDate;
    }

    /**
     * Sets the value of the occasionDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setOccasionDate(String value) {
        this.occasionDate = value;
    }

    /**
     * Gets the value of the customerName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerName() {
        return customerName;
    }

    /**
     * Sets the value of the customerName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerName(String value) {
        this.customerName = value;
    }

    /**
     * Gets the value of the partnerName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPartnerName() {
        return partnerName;
    }

    /**
     * Sets the value of the partnerName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPartnerName(String value) {
        this.partnerName = value;
    }

    /**
     * Gets the value of the additionalName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAdditionalName() {
        return additionalName;
    }

    /**
     * Sets the value of the additionalName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAdditionalName(String value) {
        this.additionalName = value;
    }

    /**
     * Gets the value of the comment property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getComment() {
        return comment;
    }

    /**
     * Sets the value of the comment property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setComment(String value) {
        this.comment = value;
    }

    /**
     * Gets the value of the image property.
     * 
     * @return
     *     possible object is
     *     {@link ImageType }
     *     
     */
    public ImageType getImage() {
        return image;
    }

    /**
     * Sets the value of the image property.
     * 
     * @param value
     *     allowed object is
     *     {@link ImageType }
     *     
     */
    public void setImage(ImageType value) {
        this.image = value;
    }

    /**
     * Gets the value of the averageRating property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getAverageRating() {
        return averageRating;
    }

    /**
     * Sets the value of the averageRating property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setAverageRating(BigDecimal value) {
        this.averageRating = value;
    }

    /**
     * Gets the value of the totalVotes property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getTotalVotes() {
        return totalVotes;
    }

    /**
     * Sets the value of the totalVotes property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setTotalVotes(BigInteger value) {
        this.totalVotes = value;
    }

    /**
     * Gets the value of the totalTimesRead property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getTotalTimesRead() {
        return totalTimesRead;
    }

    /**
     * Sets the value of the totalTimesRead property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setTotalTimesRead(BigInteger value) {
        this.totalTimesRead = value;
    }

    /**
     * Gets the value of the listItems property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the listItems property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getListItems().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ListItem }
     * 
     * 
     */
    public java.util.List<ListItem> getListItems() {
        if (listItems == null) {
            listItems = new ArrayList<ListItem>();
        }
        return this.listItems;
    }

    /**
     * Sets the value of the listItems property.
     * 
     * @param listItems
     *     allowed object is
     *     {@link ListItem }
     *     
     */
    public void setListItems(java.util.List<ListItem> listItems) {
        this.listItems = listItems;
    }

}
