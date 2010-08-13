
package com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ItemLookupRequest complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ItemLookupRequest">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Condition" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}DeliveryMethod" minOccurs="0"/>
 *         &lt;element name="FutureLaunchDate" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="IdType" minOccurs="0">
 *           &lt;simpleType>
 *             &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *               &lt;enumeration value="ASIN"/>
 *               &lt;enumeration value="UPC"/>
 *               &lt;enumeration value="SKU"/>
 *               &lt;enumeration value="EAN"/>
 *             &lt;/restriction>
 *           &lt;/simpleType>
 *         &lt;/element>
 *         &lt;element name="ISPUPostalCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="MerchantId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="OfferPage" type="{http://www.w3.org/2001/XMLSchema}positiveInteger" minOccurs="0"/>
 *         &lt;element name="ItemId" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="ResponseGroup" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="ReviewPage" type="{http://www.w3.org/2001/XMLSchema}positiveInteger" minOccurs="0"/>
 *         &lt;element name="SearchIndex" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="SearchInsideKeywords" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="VariationPage" type="{http://www.w3.org/2001/XMLSchema}positiveInteger" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ItemLookupRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", propOrder = {
    "condition",
    "deliveryMethod",
    "futureLaunchDate",
    "idType",
    "ispuPostalCode",
    "merchantId",
    "offerPage",
    "itemIds",
    "responseGroups",
    "reviewPage",
    "searchIndex",
    "searchInsideKeywords",
    "variationPage"
})
public class ItemLookupRequestType {

    @XmlElement(name = "Condition", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String condition;
    @XmlElement(name = "DeliveryMethod", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String deliveryMethod;
    @XmlElement(name = "FutureLaunchDate", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String futureLaunchDate;
    @XmlElement(name = "IdType", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String idType;
    @XmlElement(name = "ISPUPostalCode", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String ispuPostalCode;
    @XmlElement(name = "MerchantId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String merchantId;
    @XmlElement(name = "OfferPage", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "positiveInteger")
    protected BigInteger offerPage;
    @XmlElement(name = "ItemId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected List<String> itemIds;
    @XmlElement(name = "ResponseGroup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected List<String> responseGroups;
    @XmlElement(name = "ReviewPage", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "positiveInteger")
    protected BigInteger reviewPage;
    @XmlElement(name = "SearchIndex", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String searchIndex;
    @XmlElement(name = "SearchInsideKeywords", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String searchInsideKeywords;
    @XmlElement(name = "VariationPage", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "positiveInteger")
    protected BigInteger variationPage;

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
     * Gets the value of the deliveryMethod property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDeliveryMethod() {
        return deliveryMethod;
    }

    /**
     * Sets the value of the deliveryMethod property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDeliveryMethod(String value) {
        this.deliveryMethod = value;
    }

    /**
     * Gets the value of the futureLaunchDate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFutureLaunchDate() {
        return futureLaunchDate;
    }

    /**
     * Sets the value of the futureLaunchDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFutureLaunchDate(String value) {
        this.futureLaunchDate = value;
    }

    /**
     * Gets the value of the idType property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIdType() {
        return idType;
    }

    /**
     * Sets the value of the idType property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIdType(String value) {
        this.idType = value;
    }

    /**
     * Gets the value of the ispuPostalCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getISPUPostalCode() {
        return ispuPostalCode;
    }

    /**
     * Sets the value of the ispuPostalCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setISPUPostalCode(String value) {
        this.ispuPostalCode = value;
    }

    /**
     * Gets the value of the merchantId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMerchantId() {
        return merchantId;
    }

    /**
     * Sets the value of the merchantId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMerchantId(String value) {
        this.merchantId = value;
    }

    /**
     * Gets the value of the offerPage property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getOfferPage() {
        return offerPage;
    }

    /**
     * Sets the value of the offerPage property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setOfferPage(BigInteger value) {
        this.offerPage = value;
    }

    /**
     * Gets the value of the itemIds property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the itemIds property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getItemIds().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getItemIds() {
        if (itemIds == null) {
            itemIds = new ArrayList<String>();
        }
        return this.itemIds;
    }

    /**
     * Gets the value of the responseGroups property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the responseGroups property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getResponseGroups().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getResponseGroups() {
        if (responseGroups == null) {
            responseGroups = new ArrayList<String>();
        }
        return this.responseGroups;
    }

    /**
     * Gets the value of the reviewPage property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getReviewPage() {
        return reviewPage;
    }

    /**
     * Sets the value of the reviewPage property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setReviewPage(BigInteger value) {
        this.reviewPage = value;
    }

    /**
     * Gets the value of the searchIndex property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSearchIndex() {
        return searchIndex;
    }

    /**
     * Sets the value of the searchIndex property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSearchIndex(String value) {
        this.searchIndex = value;
    }

    /**
     * Gets the value of the searchInsideKeywords property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSearchInsideKeywords() {
        return searchInsideKeywords;
    }

    /**
     * Sets the value of the searchInsideKeywords property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSearchInsideKeywords(String value) {
        this.searchInsideKeywords = value;
    }

    /**
     * Gets the value of the variationPage property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getVariationPage() {
        return variationPage;
    }

    /**
     * Sets the value of the variationPage property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setVariationPage(BigInteger value) {
        this.variationPage = value;
    }

    /**
     * Sets the value of the itemIds property.
     * 
     * @param itemIds
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setItemIds(List<String> itemIds) {
        this.itemIds = itemIds;
    }

    /**
     * Sets the value of the responseGroups property.
     * 
     * @param responseGroups
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setResponseGroups(List<String> responseGroups) {
        this.responseGroups = responseGroups;
    }

}
