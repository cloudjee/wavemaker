
package com.flickr.api.services.rest.flickrphotoinfo;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for photoType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="photoType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="owner" type="{}ownerType"/>
 *         &lt;element name="title" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="description" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="visibility" type="{}visibilityType"/>
 *         &lt;element name="dates" type="{}datesType"/>
 *         &lt;element name="editability" type="{}editabilityType"/>
 *         &lt;element name="usage" type="{}usageType"/>
 *         &lt;element name="comments" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="notes" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="tags" type="{}tagsType"/>
 *         &lt;element name="location" type="{}locationType"/>
 *         &lt;element name="geoperms" type="{}geopermsType"/>
 *         &lt;element name="urls" type="{}urlsType"/>
 *       &lt;/sequence>
 *       &lt;attribute name="id" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="secret" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="server" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="farm" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="dateuploaded" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="isfavorite" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="license" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="rotation" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="originalsecret" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="originalformat" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="media" type="{http://www.w3.org/2001/XMLSchema}string" />
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "photoType", propOrder = {
    "owner",
    "title",
    "description",
    "visibility",
    "dates",
    "editability",
    "usage",
    "comments",
    "notes",
    "tags",
    "location",
    "geoperms",
    "urls"
})
public class PhotoTypeType {

    @XmlElement(required = true)
    protected OwnerTypeType owner;
    @XmlElement(required = true)
    protected String title;
    @XmlElement(required = true)
    protected String description;
    @XmlElement(required = true)
    protected VisibilityTypeType visibility;
    @XmlElement(required = true)
    protected DatesTypeType dates;
    @XmlElement(required = true)
    protected EditabilityTypeType editability;
    @XmlElement(required = true)
    protected UsageTypeType usage;
    @XmlElement(required = true)
    protected String comments;
    @XmlElement(required = true)
    protected String notes;
    @XmlElement(required = true)
    protected TagsTypeType tags;
    @XmlElement(required = true)
    protected LocationTypeType location;
    @XmlElement(required = true)
    protected GeopermsTypeType geoperms;
    @XmlElement(required = true)
    protected UrlsTypeType urls;
    @XmlAttribute
    protected String id;
    @XmlAttribute
    protected String secret;
    @XmlAttribute
    protected String server;
    @XmlAttribute
    protected String farm;
    @XmlAttribute
    protected String dateuploaded;
    @XmlAttribute
    protected String isfavorite;
    @XmlAttribute
    protected String license;
    @XmlAttribute
    protected String rotation;
    @XmlAttribute
    protected String originalsecret;
    @XmlAttribute
    protected String originalformat;
    @XmlAttribute
    protected String media;

    /**
     * Gets the value of the owner property.
     * 
     * @return
     *     possible object is
     *     {@link OwnerTypeType }
     *     
     */
    public OwnerTypeType getOwner() {
        return owner;
    }

    /**
     * Sets the value of the owner property.
     * 
     * @param value
     *     allowed object is
     *     {@link OwnerTypeType }
     *     
     */
    public void setOwner(OwnerTypeType value) {
        this.owner = value;
    }

    /**
     * Gets the value of the title property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the value of the title property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTitle(String value) {
        this.title = value;
    }

    /**
     * Gets the value of the description property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the value of the description property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDescription(String value) {
        this.description = value;
    }

    /**
     * Gets the value of the visibility property.
     * 
     * @return
     *     possible object is
     *     {@link VisibilityTypeType }
     *     
     */
    public VisibilityTypeType getVisibility() {
        return visibility;
    }

    /**
     * Sets the value of the visibility property.
     * 
     * @param value
     *     allowed object is
     *     {@link VisibilityTypeType }
     *     
     */
    public void setVisibility(VisibilityTypeType value) {
        this.visibility = value;
    }

    /**
     * Gets the value of the dates property.
     * 
     * @return
     *     possible object is
     *     {@link DatesTypeType }
     *     
     */
    public DatesTypeType getDates() {
        return dates;
    }

    /**
     * Sets the value of the dates property.
     * 
     * @param value
     *     allowed object is
     *     {@link DatesTypeType }
     *     
     */
    public void setDates(DatesTypeType value) {
        this.dates = value;
    }

    /**
     * Gets the value of the editability property.
     * 
     * @return
     *     possible object is
     *     {@link EditabilityTypeType }
     *     
     */
    public EditabilityTypeType getEditability() {
        return editability;
    }

    /**
     * Sets the value of the editability property.
     * 
     * @param value
     *     allowed object is
     *     {@link EditabilityTypeType }
     *     
     */
    public void setEditability(EditabilityTypeType value) {
        this.editability = value;
    }

    /**
     * Gets the value of the usage property.
     * 
     * @return
     *     possible object is
     *     {@link UsageTypeType }
     *     
     */
    public UsageTypeType getUsage() {
        return usage;
    }

    /**
     * Sets the value of the usage property.
     * 
     * @param value
     *     allowed object is
     *     {@link UsageTypeType }
     *     
     */
    public void setUsage(UsageTypeType value) {
        this.usage = value;
    }

    /**
     * Gets the value of the comments property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getComments() {
        return comments;
    }

    /**
     * Sets the value of the comments property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setComments(String value) {
        this.comments = value;
    }

    /**
     * Gets the value of the notes property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNotes() {
        return notes;
    }

    /**
     * Sets the value of the notes property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNotes(String value) {
        this.notes = value;
    }

    /**
     * Gets the value of the tags property.
     * 
     * @return
     *     possible object is
     *     {@link TagsTypeType }
     *     
     */
    public TagsTypeType getTags() {
        return tags;
    }

    /**
     * Sets the value of the tags property.
     * 
     * @param value
     *     allowed object is
     *     {@link TagsTypeType }
     *     
     */
    public void setTags(TagsTypeType value) {
        this.tags = value;
    }

    /**
     * Gets the value of the location property.
     * 
     * @return
     *     possible object is
     *     {@link LocationTypeType }
     *     
     */
    public LocationTypeType getLocation() {
        return location;
    }

    /**
     * Sets the value of the location property.
     * 
     * @param value
     *     allowed object is
     *     {@link LocationTypeType }
     *     
     */
    public void setLocation(LocationTypeType value) {
        this.location = value;
    }

    /**
     * Gets the value of the geoperms property.
     * 
     * @return
     *     possible object is
     *     {@link GeopermsTypeType }
     *     
     */
    public GeopermsTypeType getGeoperms() {
        return geoperms;
    }

    /**
     * Sets the value of the geoperms property.
     * 
     * @param value
     *     allowed object is
     *     {@link GeopermsTypeType }
     *     
     */
    public void setGeoperms(GeopermsTypeType value) {
        this.geoperms = value;
    }

    /**
     * Gets the value of the urls property.
     * 
     * @return
     *     possible object is
     *     {@link UrlsTypeType }
     *     
     */
    public UrlsTypeType getUrls() {
        return urls;
    }

    /**
     * Sets the value of the urls property.
     * 
     * @param value
     *     allowed object is
     *     {@link UrlsTypeType }
     *     
     */
    public void setUrls(UrlsTypeType value) {
        this.urls = value;
    }

    /**
     * Gets the value of the id property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the value of the id property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setId(String value) {
        this.id = value;
    }

    /**
     * Gets the value of the secret property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSecret() {
        return secret;
    }

    /**
     * Sets the value of the secret property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSecret(String value) {
        this.secret = value;
    }

    /**
     * Gets the value of the server property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getServer() {
        return server;
    }

    /**
     * Sets the value of the server property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setServer(String value) {
        this.server = value;
    }

    /**
     * Gets the value of the farm property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFarm() {
        return farm;
    }

    /**
     * Sets the value of the farm property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFarm(String value) {
        this.farm = value;
    }

    /**
     * Gets the value of the dateuploaded property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDateuploaded() {
        return dateuploaded;
    }

    /**
     * Sets the value of the dateuploaded property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDateuploaded(String value) {
        this.dateuploaded = value;
    }

    /**
     * Gets the value of the isfavorite property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIsfavorite() {
        return isfavorite;
    }

    /**
     * Sets the value of the isfavorite property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIsfavorite(String value) {
        this.isfavorite = value;
    }

    /**
     * Gets the value of the license property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLicense() {
        return license;
    }

    /**
     * Sets the value of the license property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLicense(String value) {
        this.license = value;
    }

    /**
     * Gets the value of the rotation property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRotation() {
        return rotation;
    }

    /**
     * Sets the value of the rotation property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRotation(String value) {
        this.rotation = value;
    }

    /**
     * Gets the value of the originalsecret property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getOriginalsecret() {
        return originalsecret;
    }

    /**
     * Sets the value of the originalsecret property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setOriginalsecret(String value) {
        this.originalsecret = value;
    }

    /**
     * Gets the value of the originalformat property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getOriginalformat() {
        return originalformat;
    }

    /**
     * Sets the value of the originalformat property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setOriginalformat(String value) {
        this.originalformat = value;
    }

    /**
     * Gets the value of the media property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMedia() {
        return media;
    }

    /**
     * Sets the value of the media property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMedia(String value) {
        this.media = value;
    }

}
