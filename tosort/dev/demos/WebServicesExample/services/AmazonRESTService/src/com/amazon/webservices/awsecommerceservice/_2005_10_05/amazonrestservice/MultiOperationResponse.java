
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
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}OperationRequest" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}HelpResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ItemSearchResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ItemLookupResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ListSearchResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ListLookupResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CustomerContentSearchResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CustomerContentLookupResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SimilarityLookupResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SellerLookupResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartGetResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartAddResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartCreateResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartModifyResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartClearResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}TransactionLookupResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SellerListingSearchResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SellerListingLookupResponse" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}BrowseNodeLookupResponse" minOccurs="0"/>
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
    "operationRequest",
    "helpResponse",
    "itemSearchResponse",
    "itemLookupResponse",
    "listSearchResponse",
    "listLookupResponse",
    "customerContentSearchResponse",
    "customerContentLookupResponse",
    "similarityLookupResponse",
    "sellerLookupResponse",
    "cartGetResponse",
    "cartAddResponse",
    "cartCreateResponse",
    "cartModifyResponse",
    "cartClearResponse",
    "transactionLookupResponse",
    "sellerListingSearchResponse",
    "sellerListingLookupResponse",
    "browseNodeLookupResponse"
})
@XmlRootElement(name = "MultiOperationResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class MultiOperationResponse {

    @XmlElement(name = "OperationRequest", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected OperationRequest operationRequest;
    @XmlElement(name = "HelpResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected HelpResponse helpResponse;
    @XmlElement(name = "ItemSearchResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ItemSearchResponse itemSearchResponse;
    @XmlElement(name = "ItemLookupResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ItemLookupResponse itemLookupResponse;
    @XmlElement(name = "ListSearchResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ListSearchResponse listSearchResponse;
    @XmlElement(name = "ListLookupResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ListLookupResponse listLookupResponse;
    @XmlElement(name = "CustomerContentSearchResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CustomerContentSearchResponse customerContentSearchResponse;
    @XmlElement(name = "CustomerContentLookupResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CustomerContentLookupResponse customerContentLookupResponse;
    @XmlElement(name = "SimilarityLookupResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SimilarityLookupResponse similarityLookupResponse;
    @XmlElement(name = "SellerLookupResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SellerLookupResponse sellerLookupResponse;
    @XmlElement(name = "CartGetResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartGetResponse cartGetResponse;
    @XmlElement(name = "CartAddResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartAddResponse cartAddResponse;
    @XmlElement(name = "CartCreateResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartCreateResponse cartCreateResponse;
    @XmlElement(name = "CartModifyResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartModifyResponse cartModifyResponse;
    @XmlElement(name = "CartClearResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartClearResponse cartClearResponse;
    @XmlElement(name = "TransactionLookupResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected TransactionLookupResponse transactionLookupResponse;
    @XmlElement(name = "SellerListingSearchResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SellerListingSearchResponse sellerListingSearchResponse;
    @XmlElement(name = "SellerListingLookupResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SellerListingLookupResponse sellerListingLookupResponse;
    @XmlElement(name = "BrowseNodeLookupResponse", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected BrowseNodeLookupResponse browseNodeLookupResponse;

    /**
     * Gets the value of the operationRequest property.
     * 
     * @return
     *     possible object is
     *     {@link OperationRequest }
     *     
     */
    public OperationRequest getOperationRequest() {
        return operationRequest;
    }

    /**
     * Sets the value of the operationRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link OperationRequest }
     *     
     */
    public void setOperationRequest(OperationRequest value) {
        this.operationRequest = value;
    }

    /**
     * Gets the value of the helpResponse property.
     * 
     * @return
     *     possible object is
     *     {@link HelpResponse }
     *     
     */
    public HelpResponse getHelpResponse() {
        return helpResponse;
    }

    /**
     * Sets the value of the helpResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link HelpResponse }
     *     
     */
    public void setHelpResponse(HelpResponse value) {
        this.helpResponse = value;
    }

    /**
     * Gets the value of the itemSearchResponse property.
     * 
     * @return
     *     possible object is
     *     {@link ItemSearchResponse }
     *     
     */
    public ItemSearchResponse getItemSearchResponse() {
        return itemSearchResponse;
    }

    /**
     * Sets the value of the itemSearchResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link ItemSearchResponse }
     *     
     */
    public void setItemSearchResponse(ItemSearchResponse value) {
        this.itemSearchResponse = value;
    }

    /**
     * Gets the value of the itemLookupResponse property.
     * 
     * @return
     *     possible object is
     *     {@link ItemLookupResponse }
     *     
     */
    public ItemLookupResponse getItemLookupResponse() {
        return itemLookupResponse;
    }

    /**
     * Sets the value of the itemLookupResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link ItemLookupResponse }
     *     
     */
    public void setItemLookupResponse(ItemLookupResponse value) {
        this.itemLookupResponse = value;
    }

    /**
     * Gets the value of the listSearchResponse property.
     * 
     * @return
     *     possible object is
     *     {@link ListSearchResponse }
     *     
     */
    public ListSearchResponse getListSearchResponse() {
        return listSearchResponse;
    }

    /**
     * Sets the value of the listSearchResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link ListSearchResponse }
     *     
     */
    public void setListSearchResponse(ListSearchResponse value) {
        this.listSearchResponse = value;
    }

    /**
     * Gets the value of the listLookupResponse property.
     * 
     * @return
     *     possible object is
     *     {@link ListLookupResponse }
     *     
     */
    public ListLookupResponse getListLookupResponse() {
        return listLookupResponse;
    }

    /**
     * Sets the value of the listLookupResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link ListLookupResponse }
     *     
     */
    public void setListLookupResponse(ListLookupResponse value) {
        this.listLookupResponse = value;
    }

    /**
     * Gets the value of the customerContentSearchResponse property.
     * 
     * @return
     *     possible object is
     *     {@link CustomerContentSearchResponse }
     *     
     */
    public CustomerContentSearchResponse getCustomerContentSearchResponse() {
        return customerContentSearchResponse;
    }

    /**
     * Sets the value of the customerContentSearchResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link CustomerContentSearchResponse }
     *     
     */
    public void setCustomerContentSearchResponse(CustomerContentSearchResponse value) {
        this.customerContentSearchResponse = value;
    }

    /**
     * Gets the value of the customerContentLookupResponse property.
     * 
     * @return
     *     possible object is
     *     {@link CustomerContentLookupResponse }
     *     
     */
    public CustomerContentLookupResponse getCustomerContentLookupResponse() {
        return customerContentLookupResponse;
    }

    /**
     * Sets the value of the customerContentLookupResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link CustomerContentLookupResponse }
     *     
     */
    public void setCustomerContentLookupResponse(CustomerContentLookupResponse value) {
        this.customerContentLookupResponse = value;
    }

    /**
     * Gets the value of the similarityLookupResponse property.
     * 
     * @return
     *     possible object is
     *     {@link SimilarityLookupResponse }
     *     
     */
    public SimilarityLookupResponse getSimilarityLookupResponse() {
        return similarityLookupResponse;
    }

    /**
     * Sets the value of the similarityLookupResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link SimilarityLookupResponse }
     *     
     */
    public void setSimilarityLookupResponse(SimilarityLookupResponse value) {
        this.similarityLookupResponse = value;
    }

    /**
     * Gets the value of the sellerLookupResponse property.
     * 
     * @return
     *     possible object is
     *     {@link SellerLookupResponse }
     *     
     */
    public SellerLookupResponse getSellerLookupResponse() {
        return sellerLookupResponse;
    }

    /**
     * Sets the value of the sellerLookupResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link SellerLookupResponse }
     *     
     */
    public void setSellerLookupResponse(SellerLookupResponse value) {
        this.sellerLookupResponse = value;
    }

    /**
     * Gets the value of the cartGetResponse property.
     * 
     * @return
     *     possible object is
     *     {@link CartGetResponse }
     *     
     */
    public CartGetResponse getCartGetResponse() {
        return cartGetResponse;
    }

    /**
     * Sets the value of the cartGetResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartGetResponse }
     *     
     */
    public void setCartGetResponse(CartGetResponse value) {
        this.cartGetResponse = value;
    }

    /**
     * Gets the value of the cartAddResponse property.
     * 
     * @return
     *     possible object is
     *     {@link CartAddResponse }
     *     
     */
    public CartAddResponse getCartAddResponse() {
        return cartAddResponse;
    }

    /**
     * Sets the value of the cartAddResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartAddResponse }
     *     
     */
    public void setCartAddResponse(CartAddResponse value) {
        this.cartAddResponse = value;
    }

    /**
     * Gets the value of the cartCreateResponse property.
     * 
     * @return
     *     possible object is
     *     {@link CartCreateResponse }
     *     
     */
    public CartCreateResponse getCartCreateResponse() {
        return cartCreateResponse;
    }

    /**
     * Sets the value of the cartCreateResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartCreateResponse }
     *     
     */
    public void setCartCreateResponse(CartCreateResponse value) {
        this.cartCreateResponse = value;
    }

    /**
     * Gets the value of the cartModifyResponse property.
     * 
     * @return
     *     possible object is
     *     {@link CartModifyResponse }
     *     
     */
    public CartModifyResponse getCartModifyResponse() {
        return cartModifyResponse;
    }

    /**
     * Sets the value of the cartModifyResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartModifyResponse }
     *     
     */
    public void setCartModifyResponse(CartModifyResponse value) {
        this.cartModifyResponse = value;
    }

    /**
     * Gets the value of the cartClearResponse property.
     * 
     * @return
     *     possible object is
     *     {@link CartClearResponse }
     *     
     */
    public CartClearResponse getCartClearResponse() {
        return cartClearResponse;
    }

    /**
     * Sets the value of the cartClearResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartClearResponse }
     *     
     */
    public void setCartClearResponse(CartClearResponse value) {
        this.cartClearResponse = value;
    }

    /**
     * Gets the value of the transactionLookupResponse property.
     * 
     * @return
     *     possible object is
     *     {@link TransactionLookupResponse }
     *     
     */
    public TransactionLookupResponse getTransactionLookupResponse() {
        return transactionLookupResponse;
    }

    /**
     * Sets the value of the transactionLookupResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link TransactionLookupResponse }
     *     
     */
    public void setTransactionLookupResponse(TransactionLookupResponse value) {
        this.transactionLookupResponse = value;
    }

    /**
     * Gets the value of the sellerListingSearchResponse property.
     * 
     * @return
     *     possible object is
     *     {@link SellerListingSearchResponse }
     *     
     */
    public SellerListingSearchResponse getSellerListingSearchResponse() {
        return sellerListingSearchResponse;
    }

    /**
     * Sets the value of the sellerListingSearchResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link SellerListingSearchResponse }
     *     
     */
    public void setSellerListingSearchResponse(SellerListingSearchResponse value) {
        this.sellerListingSearchResponse = value;
    }

    /**
     * Gets the value of the sellerListingLookupResponse property.
     * 
     * @return
     *     possible object is
     *     {@link SellerListingLookupResponse }
     *     
     */
    public SellerListingLookupResponse getSellerListingLookupResponse() {
        return sellerListingLookupResponse;
    }

    /**
     * Sets the value of the sellerListingLookupResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link SellerListingLookupResponse }
     *     
     */
    public void setSellerListingLookupResponse(SellerListingLookupResponse value) {
        this.sellerListingLookupResponse = value;
    }

    /**
     * Gets the value of the browseNodeLookupResponse property.
     * 
     * @return
     *     possible object is
     *     {@link BrowseNodeLookupResponse }
     *     
     */
    public BrowseNodeLookupResponse getBrowseNodeLookupResponse() {
        return browseNodeLookupResponse;
    }

    /**
     * Sets the value of the browseNodeLookupResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link BrowseNodeLookupResponse }
     *     
     */
    public void setBrowseNodeLookupResponse(BrowseNodeLookupResponse value) {
        this.browseNodeLookupResponse = value;
    }

}
