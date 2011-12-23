
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
 *         &lt;element name="ASIN" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Errors" minOccurs="0"/>
 *         &lt;element name="DetailPageURL" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="SalesRank" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="SmallImage" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Image" minOccurs="0"/>
 *         &lt;element name="MediumImage" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Image" minOccurs="0"/>
 *         &lt;element name="LargeImage" type="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Image" minOccurs="0"/>
 *         &lt;element name="ImageSets" minOccurs="0">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ImageSet" maxOccurs="unbounded" minOccurs="0"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ItemAttributes" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}OfferSummary" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Offers" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}VariationSummary" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Variations" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}CustomerReviews" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}EditorialReviews" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SimilarProducts" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Accessories" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}Tracks" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}BrowseNodes" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ListmaniaLists" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}SearchInside" minOccurs="0"/>
 *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}PromotionalTag" minOccurs="0"/>
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
    "asin",
    "errors",
    "detailPageURL",
    "salesRank",
    "smallImage",
    "mediumImage",
    "largeImage",
    "imageSets",
    "itemAttributes",
    "offerSummary",
    "offers",
    "variationSummary",
    "variations",
    "customerReviews",
    "editorialReviews",
    "similarProducts",
    "accessories",
    "tracks",
    "browseNodes",
    "listmaniaLists",
    "searchInside",
    "promotionalTag"
})
@XmlRootElement(name = "Item", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
public class Item {

    @XmlElement(name = "ASIN", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05", required = true)
    protected String asin;
    @XmlElement(name = "Errors", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Errors errors;
    @XmlElement(name = "DetailPageURL", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String detailPageURL;
    @XmlElement(name = "SalesRank", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected String salesRank;
    @XmlElement(name = "SmallImage", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ImageType smallImage;
    @XmlElement(name = "MediumImage", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ImageType mediumImage;
    @XmlElement(name = "LargeImage", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ImageType largeImage;
    @XmlElement(name = "ImageSets", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Item.ImageSets imageSets;
    @XmlElement(name = "ItemAttributes", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ItemAttributes itemAttributes;
    @XmlElement(name = "OfferSummary", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected OfferSummary offerSummary;
    @XmlElement(name = "Offers", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Offers offers;
    @XmlElement(name = "VariationSummary", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected VariationSummary variationSummary;
    @XmlElement(name = "Variations", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Variations variations;
    @XmlElement(name = "CustomerReviews", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected CustomerReviews customerReviews;
    @XmlElement(name = "EditorialReviews", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected EditorialReviews editorialReviews;
    @XmlElement(name = "SimilarProducts", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SimilarProducts similarProducts;
    @XmlElement(name = "Accessories", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Accessories accessories;
    @XmlElement(name = "Tracks", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected Tracks tracks;
    @XmlElement(name = "BrowseNodes", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected BrowseNodes browseNodes;
    @XmlElement(name = "ListmaniaLists", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected ListmaniaLists listmaniaLists;
    @XmlElement(name = "SearchInside", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected SearchInside searchInside;
    @XmlElement(name = "PromotionalTag", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
    protected PromotionalTag promotionalTag;

    /**
     * Gets the value of the asin property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getASIN() {
        return asin;
    }

    /**
     * Sets the value of the asin property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setASIN(String value) {
        this.asin = value;
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

    /**
     * Gets the value of the detailPageURL property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDetailPageURL() {
        return detailPageURL;
    }

    /**
     * Sets the value of the detailPageURL property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDetailPageURL(String value) {
        this.detailPageURL = value;
    }

    /**
     * Gets the value of the salesRank property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSalesRank() {
        return salesRank;
    }

    /**
     * Sets the value of the salesRank property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSalesRank(String value) {
        this.salesRank = value;
    }

    /**
     * Gets the value of the smallImage property.
     * 
     * @return
     *     possible object is
     *     {@link ImageType }
     *     
     */
    public ImageType getSmallImage() {
        return smallImage;
    }

    /**
     * Sets the value of the smallImage property.
     * 
     * @param value
     *     allowed object is
     *     {@link ImageType }
     *     
     */
    public void setSmallImage(ImageType value) {
        this.smallImage = value;
    }

    /**
     * Gets the value of the mediumImage property.
     * 
     * @return
     *     possible object is
     *     {@link ImageType }
     *     
     */
    public ImageType getMediumImage() {
        return mediumImage;
    }

    /**
     * Sets the value of the mediumImage property.
     * 
     * @param value
     *     allowed object is
     *     {@link ImageType }
     *     
     */
    public void setMediumImage(ImageType value) {
        this.mediumImage = value;
    }

    /**
     * Gets the value of the largeImage property.
     * 
     * @return
     *     possible object is
     *     {@link ImageType }
     *     
     */
    public ImageType getLargeImage() {
        return largeImage;
    }

    /**
     * Sets the value of the largeImage property.
     * 
     * @param value
     *     allowed object is
     *     {@link ImageType }
     *     
     */
    public void setLargeImage(ImageType value) {
        this.largeImage = value;
    }

    /**
     * Gets the value of the imageSets property.
     * 
     * @return
     *     possible object is
     *     {@link Item.ImageSets }
     *     
     */
    public Item.ImageSets getImageSets() {
        return imageSets;
    }

    /**
     * Sets the value of the imageSets property.
     * 
     * @param value
     *     allowed object is
     *     {@link Item.ImageSets }
     *     
     */
    public void setImageSets(Item.ImageSets value) {
        this.imageSets = value;
    }

    /**
     * Gets the value of the itemAttributes property.
     * 
     * @return
     *     possible object is
     *     {@link ItemAttributes }
     *     
     */
    public ItemAttributes getItemAttributes() {
        return itemAttributes;
    }

    /**
     * Sets the value of the itemAttributes property.
     * 
     * @param value
     *     allowed object is
     *     {@link ItemAttributes }
     *     
     */
    public void setItemAttributes(ItemAttributes value) {
        this.itemAttributes = value;
    }

    /**
     * Gets the value of the offerSummary property.
     * 
     * @return
     *     possible object is
     *     {@link OfferSummary }
     *     
     */
    public OfferSummary getOfferSummary() {
        return offerSummary;
    }

    /**
     * Sets the value of the offerSummary property.
     * 
     * @param value
     *     allowed object is
     *     {@link OfferSummary }
     *     
     */
    public void setOfferSummary(OfferSummary value) {
        this.offerSummary = value;
    }

    /**
     * Gets the value of the offers property.
     * 
     * @return
     *     possible object is
     *     {@link Offers }
     *     
     */
    public Offers getOffers() {
        return offers;
    }

    /**
     * Sets the value of the offers property.
     * 
     * @param value
     *     allowed object is
     *     {@link Offers }
     *     
     */
    public void setOffers(Offers value) {
        this.offers = value;
    }

    /**
     * Gets the value of the variationSummary property.
     * 
     * @return
     *     possible object is
     *     {@link VariationSummary }
     *     
     */
    public VariationSummary getVariationSummary() {
        return variationSummary;
    }

    /**
     * Sets the value of the variationSummary property.
     * 
     * @param value
     *     allowed object is
     *     {@link VariationSummary }
     *     
     */
    public void setVariationSummary(VariationSummary value) {
        this.variationSummary = value;
    }

    /**
     * Gets the value of the variations property.
     * 
     * @return
     *     possible object is
     *     {@link Variations }
     *     
     */
    public Variations getVariations() {
        return variations;
    }

    /**
     * Sets the value of the variations property.
     * 
     * @param value
     *     allowed object is
     *     {@link Variations }
     *     
     */
    public void setVariations(Variations value) {
        this.variations = value;
    }

    /**
     * Gets the value of the customerReviews property.
     * 
     * @return
     *     possible object is
     *     {@link CustomerReviews }
     *     
     */
    public CustomerReviews getCustomerReviews() {
        return customerReviews;
    }

    /**
     * Sets the value of the customerReviews property.
     * 
     * @param value
     *     allowed object is
     *     {@link CustomerReviews }
     *     
     */
    public void setCustomerReviews(CustomerReviews value) {
        this.customerReviews = value;
    }

    /**
     * Gets the value of the editorialReviews property.
     * 
     * @return
     *     possible object is
     *     {@link EditorialReviews }
     *     
     */
    public EditorialReviews getEditorialReviews() {
        return editorialReviews;
    }

    /**
     * Sets the value of the editorialReviews property.
     * 
     * @param value
     *     allowed object is
     *     {@link EditorialReviews }
     *     
     */
    public void setEditorialReviews(EditorialReviews value) {
        this.editorialReviews = value;
    }

    /**
     * Gets the value of the similarProducts property.
     * 
     * @return
     *     possible object is
     *     {@link SimilarProducts }
     *     
     */
    public SimilarProducts getSimilarProducts() {
        return similarProducts;
    }

    /**
     * Sets the value of the similarProducts property.
     * 
     * @param value
     *     allowed object is
     *     {@link SimilarProducts }
     *     
     */
    public void setSimilarProducts(SimilarProducts value) {
        this.similarProducts = value;
    }

    /**
     * Gets the value of the accessories property.
     * 
     * @return
     *     possible object is
     *     {@link Accessories }
     *     
     */
    public Accessories getAccessories() {
        return accessories;
    }

    /**
     * Sets the value of the accessories property.
     * 
     * @param value
     *     allowed object is
     *     {@link Accessories }
     *     
     */
    public void setAccessories(Accessories value) {
        this.accessories = value;
    }

    /**
     * Gets the value of the tracks property.
     * 
     * @return
     *     possible object is
     *     {@link Tracks }
     *     
     */
    public Tracks getTracks() {
        return tracks;
    }

    /**
     * Sets the value of the tracks property.
     * 
     * @param value
     *     allowed object is
     *     {@link Tracks }
     *     
     */
    public void setTracks(Tracks value) {
        this.tracks = value;
    }

    /**
     * Gets the value of the browseNodes property.
     * 
     * @return
     *     possible object is
     *     {@link BrowseNodes }
     *     
     */
    public BrowseNodes getBrowseNodes() {
        return browseNodes;
    }

    /**
     * Sets the value of the browseNodes property.
     * 
     * @param value
     *     allowed object is
     *     {@link BrowseNodes }
     *     
     */
    public void setBrowseNodes(BrowseNodes value) {
        this.browseNodes = value;
    }

    /**
     * Gets the value of the listmaniaLists property.
     * 
     * @return
     *     possible object is
     *     {@link ListmaniaLists }
     *     
     */
    public ListmaniaLists getListmaniaLists() {
        return listmaniaLists;
    }

    /**
     * Sets the value of the listmaniaLists property.
     * 
     * @param value
     *     allowed object is
     *     {@link ListmaniaLists }
     *     
     */
    public void setListmaniaLists(ListmaniaLists value) {
        this.listmaniaLists = value;
    }

    /**
     * Gets the value of the searchInside property.
     * 
     * @return
     *     possible object is
     *     {@link SearchInside }
     *     
     */
    public SearchInside getSearchInside() {
        return searchInside;
    }

    /**
     * Sets the value of the searchInside property.
     * 
     * @param value
     *     allowed object is
     *     {@link SearchInside }
     *     
     */
    public void setSearchInside(SearchInside value) {
        this.searchInside = value;
    }

    /**
     * Gets the value of the promotionalTag property.
     * 
     * @return
     *     possible object is
     *     {@link PromotionalTag }
     *     
     */
    public PromotionalTag getPromotionalTag() {
        return promotionalTag;
    }

    /**
     * Sets the value of the promotionalTag property.
     * 
     * @param value
     *     allowed object is
     *     {@link PromotionalTag }
     *     
     */
    public void setPromotionalTag(PromotionalTag value) {
        this.promotionalTag = value;
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
     *         &lt;element ref="{http://webservices.amazon.com/AWSECommerceService/2005-10-05}ImageSet" maxOccurs="unbounded" minOccurs="0"/>
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
        "imageSets"
    })
    public static class ImageSets {

        @XmlElement(name = "ImageSet", namespace = "http://webservices.amazon.com/AWSECommerceService/2005-10-05")
        protected List<ImageSet> imageSets;

        /**
         * Gets the value of the imageSets property.
         * 
         * <p>
         * This accessor method returns a reference to the live list,
         * not a snapshot. Therefore any modification you make to the
         * returned list will be present inside the JAXB object.
         * This is why there is not a <CODE>set</CODE> method for the imageSets property.
         * 
         * <p>
         * For example, to add a new item, do as follows:
         * <pre>
         *    getImageSets().add(newItem);
         * </pre>
         * 
         * 
         * <p>
         * Objects of the following type(s) are allowed in the list
         * {@link ImageSet }
         * 
         * 
         */
        public List<ImageSet> getImageSets() {
            if (imageSets == null) {
                imageSets = new ArrayList<ImageSet>();
            }
            return this.imageSets;
        }

        /**
         * Sets the value of the imageSets property.
         * 
         * @param imageSets
         *     allowed object is
         *     {@link ImageSet }
         *     
         */
        public void setImageSets(List<ImageSet> imageSets) {
            this.imageSets = imageSets;
        }

    }

}
