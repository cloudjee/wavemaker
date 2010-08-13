
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
 * <p>Java class for ListLookupRequest complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ListLookupRequest">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Condition" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}DeliveryMethod" minOccurs="0"/>
 *         &lt;element name="ISPUPostalCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ListId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ListType" minOccurs="0">
 *           &lt;simpleType>
 *             &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *               &lt;enumeration value="WishList"/>
 *               &lt;enumeration value="Listmania"/>
 *               &lt;enumeration value="WeddingRegistry"/>
 *             &lt;/restriction>
 *           &lt;/simpleType>
 *         &lt;/element>
 *         &lt;element name="MerchantId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ProductGroup" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ProductPage" type="{http://www.w3.org/2001/XMLSchema}positiveInteger" minOccurs="0"/>
 *         &lt;element name="ResponseGroup" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="Sort" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ListLookupRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", propOrder = {
    "condition",
    "deliveryMethod",
    "ispuPostalCode",
    "listId",
    "listType",
    "merchantId",
    "productGroup",
    "productPage",
    "responseGroups",
    "sort"
})
public class ListLookupRequestType {

    @XmlElement(name = "Condition", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String condition;
    @XmlElement(name = "DeliveryMethod", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String deliveryMethod;
    @XmlElement(name = "ISPUPostalCode", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String ispuPostalCode;
    @XmlElement(name = "ListId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String listId;
    @XmlElement(name = "ListType", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String listType;
    @XmlElement(name = "MerchantId", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String merchantId;
    @XmlElement(name = "ProductGroup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String productGroup;
    @XmlElement(name = "ProductPage", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    @XmlSchemaType(name = "positiveInteger")
    protected BigInteger productPage;
    @XmlElement(name = "ResponseGroup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected List<String> responseGroups;
    @XmlElement(name = "Sort", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String sort;

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
     * Gets the value of the productGroup property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getProductGroup() {
        return productGroup;
    }

    /**
     * Sets the value of the productGroup property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setProductGroup(String value) {
        this.productGroup = value;
    }

    /**
     * Gets the value of the productPage property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getProductPage() {
        return productPage;
    }

    /**
     * Sets the value of the productPage property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setProductPage(BigInteger value) {
        this.productPage = value;
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
     * Gets the value of the sort property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSort() {
        return sort;
    }

    /**
     * Sets the value of the sort property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSort(String value) {
        this.sort = value;
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
