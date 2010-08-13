
package com.flickr.api.services.rest.flickrphotosearch;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for photosType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="photosType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="photo" type="{}photoType" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *       &lt;attribute name="page" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="pages" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="perpage" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="total" type="{http://www.w3.org/2001/XMLSchema}string" />
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "photosType", propOrder = {
    "photos"
})
public class PhotosTypeType {

    @XmlElement(name = "photo")
    protected List<PhotoTypeType> photos;
    @XmlAttribute
    protected String page;
    @XmlAttribute
    protected String pages;
    @XmlAttribute
    protected String perpage;
    @XmlAttribute
    protected String total;

    /**
     * Gets the value of the photos property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the photos property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getPhotos().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link PhotoTypeType }
     * 
     * 
     */
    public List<PhotoTypeType> getPhotos() {
        if (photos == null) {
            photos = new ArrayList<PhotoTypeType>();
        }
        return this.photos;
    }

    /**
     * Gets the value of the page property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPage() {
        return page;
    }

    /**
     * Sets the value of the page property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPage(String value) {
        this.page = value;
    }

    /**
     * Gets the value of the pages property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPages() {
        return pages;
    }

    /**
     * Sets the value of the pages property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPages(String value) {
        this.pages = value;
    }

    /**
     * Gets the value of the perpage property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPerpage() {
        return perpage;
    }

    /**
     * Sets the value of the perpage property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPerpage(String value) {
        this.perpage = value;
    }

    /**
     * Gets the value of the total property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTotal() {
        return total;
    }

    /**
     * Sets the value of the total property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTotal(String value) {
        this.total = value;
    }

    /**
     * Sets the value of the photos property.
     * 
     * @param photos
     *     allowed object is
     *     {@link PhotoTypeType }
     *     
     */
    public void setPhotos(List<PhotoTypeType> photos) {
        this.photos = photos;
    }

}
