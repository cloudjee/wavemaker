
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
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Help" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ItemSearch" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ItemLookup" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ListSearch" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ListLookup" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CustomerContentSearch" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CustomerContentLookup" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SimilarityLookup" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SellerLookup" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartGet" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartAdd" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartCreate" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartModify" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CartClear" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}TransactionLookup" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SellerListingSearch" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SellerListingLookup" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}BrowseNodeLookup" minOccurs="0"/>
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
    "help",
    "itemSearch",
    "itemLookup",
    "listSearch",
    "listLookup",
    "customerContentSearch",
    "customerContentLookup",
    "similarityLookup",
    "sellerLookup",
    "cartGet",
    "cartAdd",
    "cartCreate",
    "cartModify",
    "cartClear",
    "transactionLookup",
    "sellerListingSearch",
    "sellerListingLookup",
    "browseNodeLookup"
})
@XmlRootElement(name = "MultiOperation", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class MultiOperation {

    @XmlElement(name = "Help", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Help help;
    @XmlElement(name = "ItemSearch", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ItemSearch itemSearch;
    @XmlElement(name = "ItemLookup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ItemLookup itemLookup;
    @XmlElement(name = "ListSearch", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ListSearch listSearch;
    @XmlElement(name = "ListLookup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ListLookup listLookup;
    @XmlElement(name = "CustomerContentSearch", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CustomerContentSearch customerContentSearch;
    @XmlElement(name = "CustomerContentLookup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CustomerContentLookup customerContentLookup;
    @XmlElement(name = "SimilarityLookup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SimilarityLookup similarityLookup;
    @XmlElement(name = "SellerLookup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SellerLookup sellerLookup;
    @XmlElement(name = "CartGet", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartGet cartGet;
    @XmlElement(name = "CartAdd", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartAdd cartAdd;
    @XmlElement(name = "CartCreate", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartCreate cartCreate;
    @XmlElement(name = "CartModify", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartModify cartModify;
    @XmlElement(name = "CartClear", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CartClear cartClear;
    @XmlElement(name = "TransactionLookup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected TransactionLookup transactionLookup;
    @XmlElement(name = "SellerListingSearch", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SellerListingSearch sellerListingSearch;
    @XmlElement(name = "SellerListingLookup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SellerListingLookup sellerListingLookup;
    @XmlElement(name = "BrowseNodeLookup", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected BrowseNodeLookup browseNodeLookup;

    /**
     * Gets the value of the help property.
     * 
     * @return
     *     possible object is
     *     {@link Help }
     *     
     */
    public Help getHelp() {
        return help;
    }

    /**
     * Sets the value of the help property.
     * 
     * @param value
     *     allowed object is
     *     {@link Help }
     *     
     */
    public void setHelp(Help value) {
        this.help = value;
    }

    /**
     * Gets the value of the itemSearch property.
     * 
     * @return
     *     possible object is
     *     {@link ItemSearch }
     *     
     */
    public ItemSearch getItemSearch() {
        return itemSearch;
    }

    /**
     * Sets the value of the itemSearch property.
     * 
     * @param value
     *     allowed object is
     *     {@link ItemSearch }
     *     
     */
    public void setItemSearch(ItemSearch value) {
        this.itemSearch = value;
    }

    /**
     * Gets the value of the itemLookup property.
     * 
     * @return
     *     possible object is
     *     {@link ItemLookup }
     *     
     */
    public ItemLookup getItemLookup() {
        return itemLookup;
    }

    /**
     * Sets the value of the itemLookup property.
     * 
     * @param value
     *     allowed object is
     *     {@link ItemLookup }
     *     
     */
    public void setItemLookup(ItemLookup value) {
        this.itemLookup = value;
    }

    /**
     * Gets the value of the listSearch property.
     * 
     * @return
     *     possible object is
     *     {@link ListSearch }
     *     
     */
    public ListSearch getListSearch() {
        return listSearch;
    }

    /**
     * Sets the value of the listSearch property.
     * 
     * @param value
     *     allowed object is
     *     {@link ListSearch }
     *     
     */
    public void setListSearch(ListSearch value) {
        this.listSearch = value;
    }

    /**
     * Gets the value of the listLookup property.
     * 
     * @return
     *     possible object is
     *     {@link ListLookup }
     *     
     */
    public ListLookup getListLookup() {
        return listLookup;
    }

    /**
     * Sets the value of the listLookup property.
     * 
     * @param value
     *     allowed object is
     *     {@link ListLookup }
     *     
     */
    public void setListLookup(ListLookup value) {
        this.listLookup = value;
    }

    /**
     * Gets the value of the customerContentSearch property.
     * 
     * @return
     *     possible object is
     *     {@link CustomerContentSearch }
     *     
     */
    public CustomerContentSearch getCustomerContentSearch() {
        return customerContentSearch;
    }

    /**
     * Sets the value of the customerContentSearch property.
     * 
     * @param value
     *     allowed object is
     *     {@link CustomerContentSearch }
     *     
     */
    public void setCustomerContentSearch(CustomerContentSearch value) {
        this.customerContentSearch = value;
    }

    /**
     * Gets the value of the customerContentLookup property.
     * 
     * @return
     *     possible object is
     *     {@link CustomerContentLookup }
     *     
     */
    public CustomerContentLookup getCustomerContentLookup() {
        return customerContentLookup;
    }

    /**
     * Sets the value of the customerContentLookup property.
     * 
     * @param value
     *     allowed object is
     *     {@link CustomerContentLookup }
     *     
     */
    public void setCustomerContentLookup(CustomerContentLookup value) {
        this.customerContentLookup = value;
    }

    /**
     * Gets the value of the similarityLookup property.
     * 
     * @return
     *     possible object is
     *     {@link SimilarityLookup }
     *     
     */
    public SimilarityLookup getSimilarityLookup() {
        return similarityLookup;
    }

    /**
     * Sets the value of the similarityLookup property.
     * 
     * @param value
     *     allowed object is
     *     {@link SimilarityLookup }
     *     
     */
    public void setSimilarityLookup(SimilarityLookup value) {
        this.similarityLookup = value;
    }

    /**
     * Gets the value of the sellerLookup property.
     * 
     * @return
     *     possible object is
     *     {@link SellerLookup }
     *     
     */
    public SellerLookup getSellerLookup() {
        return sellerLookup;
    }

    /**
     * Sets the value of the sellerLookup property.
     * 
     * @param value
     *     allowed object is
     *     {@link SellerLookup }
     *     
     */
    public void setSellerLookup(SellerLookup value) {
        this.sellerLookup = value;
    }

    /**
     * Gets the value of the cartGet property.
     * 
     * @return
     *     possible object is
     *     {@link CartGet }
     *     
     */
    public CartGet getCartGet() {
        return cartGet;
    }

    /**
     * Sets the value of the cartGet property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartGet }
     *     
     */
    public void setCartGet(CartGet value) {
        this.cartGet = value;
    }

    /**
     * Gets the value of the cartAdd property.
     * 
     * @return
     *     possible object is
     *     {@link CartAdd }
     *     
     */
    public CartAdd getCartAdd() {
        return cartAdd;
    }

    /**
     * Sets the value of the cartAdd property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartAdd }
     *     
     */
    public void setCartAdd(CartAdd value) {
        this.cartAdd = value;
    }

    /**
     * Gets the value of the cartCreate property.
     * 
     * @return
     *     possible object is
     *     {@link CartCreate }
     *     
     */
    public CartCreate getCartCreate() {
        return cartCreate;
    }

    /**
     * Sets the value of the cartCreate property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartCreate }
     *     
     */
    public void setCartCreate(CartCreate value) {
        this.cartCreate = value;
    }

    /**
     * Gets the value of the cartModify property.
     * 
     * @return
     *     possible object is
     *     {@link CartModify }
     *     
     */
    public CartModify getCartModify() {
        return cartModify;
    }

    /**
     * Sets the value of the cartModify property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartModify }
     *     
     */
    public void setCartModify(CartModify value) {
        this.cartModify = value;
    }

    /**
     * Gets the value of the cartClear property.
     * 
     * @return
     *     possible object is
     *     {@link CartClear }
     *     
     */
    public CartClear getCartClear() {
        return cartClear;
    }

    /**
     * Sets the value of the cartClear property.
     * 
     * @param value
     *     allowed object is
     *     {@link CartClear }
     *     
     */
    public void setCartClear(CartClear value) {
        this.cartClear = value;
    }

    /**
     * Gets the value of the transactionLookup property.
     * 
     * @return
     *     possible object is
     *     {@link TransactionLookup }
     *     
     */
    public TransactionLookup getTransactionLookup() {
        return transactionLookup;
    }

    /**
     * Sets the value of the transactionLookup property.
     * 
     * @param value
     *     allowed object is
     *     {@link TransactionLookup }
     *     
     */
    public void setTransactionLookup(TransactionLookup value) {
        this.transactionLookup = value;
    }

    /**
     * Gets the value of the sellerListingSearch property.
     * 
     * @return
     *     possible object is
     *     {@link SellerListingSearch }
     *     
     */
    public SellerListingSearch getSellerListingSearch() {
        return sellerListingSearch;
    }

    /**
     * Sets the value of the sellerListingSearch property.
     * 
     * @param value
     *     allowed object is
     *     {@link SellerListingSearch }
     *     
     */
    public void setSellerListingSearch(SellerListingSearch value) {
        this.sellerListingSearch = value;
    }

    /**
     * Gets the value of the sellerListingLookup property.
     * 
     * @return
     *     possible object is
     *     {@link SellerListingLookup }
     *     
     */
    public SellerListingLookup getSellerListingLookup() {
        return sellerListingLookup;
    }

    /**
     * Sets the value of the sellerListingLookup property.
     * 
     * @param value
     *     allowed object is
     *     {@link SellerListingLookup }
     *     
     */
    public void setSellerListingLookup(SellerListingLookup value) {
        this.sellerListingLookup = value;
    }

    /**
     * Gets the value of the browseNodeLookup property.
     * 
     * @return
     *     possible object is
     *     {@link BrowseNodeLookup }
     *     
     */
    public BrowseNodeLookup getBrowseNodeLookup() {
        return browseNodeLookup;
    }

    /**
     * Sets the value of the browseNodeLookup property.
     * 
     * @param value
     *     allowed object is
     *     {@link BrowseNodeLookup }
     *     
     */
    public void setBrowseNodeLookup(BrowseNodeLookup value) {
        this.browseNodeLookup = value;
    }

}
