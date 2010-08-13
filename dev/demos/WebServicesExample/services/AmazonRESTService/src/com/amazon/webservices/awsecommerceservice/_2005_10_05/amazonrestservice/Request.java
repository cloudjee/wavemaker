
package com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice;

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
 *         &lt;element name="IsValid" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="HelpRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}HelpRequest" minOccurs="0"/>
 *         &lt;element name="BrowseNodeLookupRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}BrowseNodeLookupRequest" minOccurs="0"/>
 *         &lt;element name="ItemSearchRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ItemSearchRequest" minOccurs="0"/>
 *         &lt;element name="ItemLookupRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ItemLookupRequest" minOccurs="0"/>
 *         &lt;element name="ListSearchRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ListSearchRequest" minOccurs="0"/>
 *         &lt;element name="ListLookupRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ListLookupRequest" minOccurs="0"/>
 *         &lt;element name="CustomerContentSearchRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CustomerContentSearchRequest" minOccurs="0"/>
 *         &lt;element name="CustomerContentLookupRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CustomerContentLookupRequest" minOccurs="0"/>
 *         &lt;element name="SimilarityLookupRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SimilarityLookupRequest" minOccurs="0"/>
 *         &lt;element name="CartGetRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartGetRequest" minOccurs="0"/>
 *         &lt;element name="CartAddRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartAddRequest" minOccurs="0"/>
 *         &lt;element name="CartCreateRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartCreateRequest" minOccurs="0"/>
 *         &lt;element name="CartModifyRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartModifyRequest" minOccurs="0"/>
 *         &lt;element name="CartClearRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartClearRequest" minOccurs="0"/>
 *         &lt;element name="TransactionLookupRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}TransactionLookupRequest" minOccurs="0"/>
 *         &lt;element name="SellerListingSearchRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SellerListingSearchRequest" minOccurs="0"/>
 *         &lt;element name="SellerListingLookupRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SellerListingLookupRequest" minOccurs="0"/>
 *         &lt;element name="SellerLookupRequest" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SellerLookupRequest" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Errors" minOccurs="0"/>
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
    "isValid",
    "helpRequest",
    "browseNodeLookupRequest",
    "itemSearchRequest",
    "itemLookupRequest",
    "listSearchRequest",
    "listLookupRequest",
    "customerContentSearchRequest",
    "customerContentLookupRequest",
    "similarityLookupRequest",
    "cartGetRequest",
    "cartAddRequest",
    "cartCreateRequest",
    "cartModifyRequest",
    "cartClearRequest",
    "transactionLookupRequest",
    "sellerListingSearchRequest",
    "sellerListingLookupRequest",
    "sellerLookupRequest",
    "errors"
})
@XmlRootElement(name = "Request", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class Request {

    @XmlElement(name = "IsValid", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String isValid;
    @XmlElement(name = "HelpRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected HelpRequestType helpRequest;
    @XmlElement(name = "BrowseNodeLookupRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected BrowseNodeLookupRequestType browseNodeLookupRequest;
    @XmlElement(name = "ItemSearchRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ItemSearchRequestType itemSearchRequest;
    @XmlElement(name = "ItemLookupRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ItemLookupRequestType itemLookupRequest;
    @XmlElement(name = "ListSearchRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ListSearchRequestType listSearchRequest;
    @XmlElement(name = "ListLookupRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ListLookupRequestType listLookupRequest;
    @XmlElement(name = "CustomerContentSearchRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CustomerContentSearchRequestType customerContentSearchRequest;
    @XmlElement(name = "CustomerContentLookupRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CustomerContentLookupRequestType customerContentLookupRequest;
    @XmlElement(name = "SimilarityLookupRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SimilarityLookupRequestType similarityLookupRequest;
    @XmlElement(name = "CartGetRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartGetRequestType cartGetRequest;
    @XmlElement(name = "CartAddRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartAddRequestType cartAddRequest;
    @XmlElement(name = "CartCreateRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartCreateRequestType cartCreateRequest;
    @XmlElement(name = "CartModifyRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartModifyRequestType cartModifyRequest;
    @XmlElement(name = "CartClearRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartClearRequestType cartClearRequest;
    @XmlElement(name = "TransactionLookupRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected TransactionLookupRequestType transactionLookupRequest;
    @XmlElement(name = "SellerListingSearchRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SellerListingSearchRequestType sellerListingSearchRequest;
    @XmlElement(name = "SellerListingLookupRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SellerListingLookupRequestType sellerListingLookupRequest;
    @XmlElement(name = "SellerLookupRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SellerLookupRequestType sellerLookupRequest;
    @XmlElement(name = "Errors", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Errors errors;

    /**
     * Gets the value of the isValid property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIsValid() {
        return isValid;
    }

    /**
     * Sets the value of the isValid property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIsValid(String value) {
        this.isValid = value;
    }

    /**
     * Gets the value of the helpRequest property.
     * 
     * @return
     *     possible object is
     *     {@link HelpRequestType }
     *     
     */
    public HelpRequestType getHelpRequest() {
        return helpRequest;
    }

    /**
     * Sets the value of the helpRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link HelpRequestType }
     *     
     */
    public void setHelpRequest(HelpRequestType value) {
        this.helpRequest = value;
    }

    /**
     * Gets the value of the browseNodeLookupRequest property.
     * 
     * @return
     *     possible object is
     *     {@link BrowseNodeLookupRequestType }
     *     
     */
    public BrowseNodeLookupRequestType getBrowseNodeLookupRequest() {
        return browseNodeLookupRequest;
    }

    /**
     * Sets the value of the browseNodeLookupRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link BrowseNodeLookupRequestType }
     *     
     */
    public void setBrowseNodeLookupRequest(BrowseNodeLookupRequestType value) {
        this.browseNodeLookupRequest = value;
    }

    /**
     * Gets the value of the itemSearchRequest property.
     * 
     * @return
     *     possible object is
     *     {@link ItemSearchRequestType }
     *     
     */
    public ItemSearchRequestType getItemSearchRequest() {
        return itemSearchRequest;
    }

    /**
     * Sets the value of the itemSearchRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link ItemSearchRequestType }
     *     
     */
    public void setItemSearchRequest(ItemSearchRequestType value) {
        this.itemSearchRequest = value;
    }

    /**
     * Gets the value of the itemLookupRequest property.
     * 
     * @return
     *     possible object is
     *     {@link ItemLookupRequestType }
     *     
     */
    public ItemLookupRequestType getItemLookupRequest() {
        return itemLookupRequest;
    }

    /**
     * Sets the value of the itemLookupRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link ItemLookupRequestType }
     *     
     */
    public void setItemLookupRequest(ItemLookupRequestType value) {
        this.itemLookupRequest = value;
    }

    /**
     * Gets the value of the listSearchRequest property.
     * 
     * @return
     *     possible object is
     *     {@link ListSearchRequestType }
     *     
     */
    public ListSearchRequestType getListSearchRequest() {
        return listSearchRequest;
    }

    /**
     * Sets the value of the listSearchRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link ListSearchRequestType }
     *     
     */
    public void setListSearchRequest(ListSearchRequestType value) {
        this.listSearchRequest = value;
    }

    /**
     * Gets the value of the listLookupRequest property.
     * 
     * @return
     *     possible object is
     *     {@link ListLookupRequestType }
     *     
     */
    public ListLookupRequestType getListLookupRequest() {
        return listLookupRequest;
    }

    /**
     * Sets the value of the listLookupRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link ListLookupRequestType }
     *     
     */
    public void setListLookupRequest(ListLookupRequestType value) {
        this.listLookupRequest = value;
    }

    /**
     * Gets the value of the customerContentSearchRequest property.
     * 
     * @return
     *     possible object is
     *     {@link CustomerContentSearchRequestType }
     *     
     */
    public CustomerContentSearchRequestType getCustomerContentSearchRequest() {
        return customerContentSearchRequest;
    }

    /**
     * Sets the value of the customerContentSearchRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link CustomerContentSearchRequestType }
     *     
     */
    public void setCustomerContentSearchRequest(CustomerContentSearchRequestType value) {
        this.customerContentSearchRequest = value;
    }

    /**
     * Gets the value of the customerContentLookupRequest property.
     * 
     * @return
     *     possible object is
     *     {@link CustomerContentLookupRequestType }
     *     
     */
    public CustomerContentLookupRequestType getCustomerContentLookupRequest() {
        return customerContentLookupRequest;
    }

    /**
     * Sets the value of the customerContentLookupRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link CustomerContentLookupRequestType }
     *     
     */
    public void setCustomerContentLookupRequest(CustomerContentLookupRequestType value) {
        this.customerContentLookupRequest = value;
    }

    /**
     * Gets the value of the similarityLookupRequest property.
     * 
     * @return
     *     possible object is
     *     {@link SimilarityLookupRequestType }
     *     
     */
    public SimilarityLookupRequestType getSimilarityLookupRequest() {
        return similarityLookupRequest;
    }

    /**
     * Sets the value of the similarityLookupRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link SimilarityLookupRequestType }
     *     
     */
    public void setSimilarityLookupRequest(SimilarityLookupRequestType value) {
        this.similarityLookupRequest = value;
    }

    /**
     * Gets the value of the cartGetRequest property.
     * 
     * @return
     *     possible object is
     *     {@link CartGetRequestType }
     *     
     */
    public CartGetRequestType getCartGetRequest() {
        return cartGetRequest;
    }

    /**
     * Sets the value of the cartGetRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartGetRequestType }
     *     
     */
    public void setCartGetRequest(CartGetRequestType value) {
        this.cartGetRequest = value;
    }

    /**
     * Gets the value of the cartAddRequest property.
     * 
     * @return
     *     possible object is
     *     {@link CartAddRequestType }
     *     
     */
    public CartAddRequestType getCartAddRequest() {
        return cartAddRequest;
    }

    /**
     * Sets the value of the cartAddRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartAddRequestType }
     *     
     */
    public void setCartAddRequest(CartAddRequestType value) {
        this.cartAddRequest = value;
    }

    /**
     * Gets the value of the cartCreateRequest property.
     * 
     * @return
     *     possible object is
     *     {@link CartCreateRequestType }
     *     
     */
    public CartCreateRequestType getCartCreateRequest() {
        return cartCreateRequest;
    }

    /**
     * Sets the value of the cartCreateRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartCreateRequestType }
     *     
     */
    public void setCartCreateRequest(CartCreateRequestType value) {
        this.cartCreateRequest = value;
    }

    /**
     * Gets the value of the cartModifyRequest property.
     * 
     * @return
     *     possible object is
     *     {@link CartModifyRequestType }
     *     
     */
    public CartModifyRequestType getCartModifyRequest() {
        return cartModifyRequest;
    }

    /**
     * Sets the value of the cartModifyRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartModifyRequestType }
     *     
     */
    public void setCartModifyRequest(CartModifyRequestType value) {
        this.cartModifyRequest = value;
    }

    /**
     * Gets the value of the cartClearRequest property.
     * 
     * @return
     *     possible object is
     *     {@link CartClearRequestType }
     *     
     */
    public CartClearRequestType getCartClearRequest() {
        return cartClearRequest;
    }

    /**
     * Sets the value of the cartClearRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartClearRequestType }
     *     
     */
    public void setCartClearRequest(CartClearRequestType value) {
        this.cartClearRequest = value;
    }

    /**
     * Gets the value of the transactionLookupRequest property.
     * 
     * @return
     *     possible object is
     *     {@link TransactionLookupRequestType }
     *     
     */
    public TransactionLookupRequestType getTransactionLookupRequest() {
        return transactionLookupRequest;
    }

    /**
     * Sets the value of the transactionLookupRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link TransactionLookupRequestType }
     *     
     */
    public void setTransactionLookupRequest(TransactionLookupRequestType value) {
        this.transactionLookupRequest = value;
    }

    /**
     * Gets the value of the sellerListingSearchRequest property.
     * 
     * @return
     *     possible object is
     *     {@link SellerListingSearchRequestType }
     *     
     */
    public SellerListingSearchRequestType getSellerListingSearchRequest() {
        return sellerListingSearchRequest;
    }

    /**
     * Sets the value of the sellerListingSearchRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link SellerListingSearchRequestType }
     *     
     */
    public void setSellerListingSearchRequest(SellerListingSearchRequestType value) {
        this.sellerListingSearchRequest = value;
    }

    /**
     * Gets the value of the sellerListingLookupRequest property.
     * 
     * @return
     *     possible object is
     *     {@link SellerListingLookupRequestType }
     *     
     */
    public SellerListingLookupRequestType getSellerListingLookupRequest() {
        return sellerListingLookupRequest;
    }

    /**
     * Sets the value of the sellerListingLookupRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link SellerListingLookupRequestType }
     *     
     */
    public void setSellerListingLookupRequest(SellerListingLookupRequestType value) {
        this.sellerListingLookupRequest = value;
    }

    /**
     * Gets the value of the sellerLookupRequest property.
     * 
     * @return
     *     possible object is
     *     {@link SellerLookupRequestType }
     *     
     */
    public SellerLookupRequestType getSellerLookupRequest() {
        return sellerLookupRequest;
    }

    /**
     * Sets the value of the sellerLookupRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link SellerLookupRequestType }
     *     
     */
    public void setSellerLookupRequest(SellerLookupRequestType value) {
        this.sellerLookupRequest = value;
    }

    /**
     * Gets the value of the errors property.
     * 
     * @return
     *     possible object is
     *     {@link Errors }
     *     
     */
    public Errors getErrors() {
        return errors;
    }

    /**
     * Sets the value of the errors property.
     * 
     * @param value
     *     allowed object is
     *     {@link Errors }
     *     
     */
    public void setErrors(Errors value) {
        this.errors = value;
    }

}
