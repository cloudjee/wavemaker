
package com.flickr.api.services.rest.flickrphotosearch;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.XmlValue;


/**
 * <p>Java class for photoType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="photoType">
 *   &lt;simpleContent>
 *     &lt;extension base="&lt;http://www.w3.org/2001/XMLSchema>string">
 *       &lt;attribute name="id" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="owner" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="secret" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="server" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="farm" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="title" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="ispublic" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="isfriend" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="isfamily" type="{http://www.w3.org/2001/XMLSchema}string" />
 *     &lt;/extension>
 *   &lt;/simpleContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "photoType", propOrder = {
    "value"
})
public class PhotoTypeType {

    @XmlValue
    protected String value;
    @XmlAttribute
    protected String id;
    @XmlAttribute
    protected String owner;
    @XmlAttribute
    protected String secret;
    @XmlAttribute
    protected String server;
    @XmlAttribute
    protected String farm;
    @XmlAttribute
    protected String title;
    @XmlAttribute
    protected String ispublic;
    @XmlAttribute
    protected String isfriend;
    @XmlAttribute
    protected String isfamily;

    /**
     * Gets the value of the value property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getValue() {
        return value;
    }

    /**
     * Sets the value of the value property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setValue(String value) {
        this.value = value;
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
     * Gets the value of the owner property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getOwner() {
        return owner;
    }

    /**
     * Sets the value of the owner property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setOwner(String value) {
        this.owner = value;
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
     * Gets the value of the ispublic property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIspublic() {
        return ispublic;
    }

    /**
     * Sets the value of the ispublic property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIspublic(String value) {
        this.ispublic = value;
    }

    /**
     * Gets the value of the isfriend property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIsfriend() {
        return isfriend;
    }

    /**
     * Sets the value of the isfriend property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIsfriend(String value) {
        this.isfriend = value;
    }

    /**
     * Gets the value of the isfamily property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIsfamily() {
        return isfamily;
    }

    /**
     * Sets the value of the isfamily property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIsfamily(String value) {
        this.isfamily = value;
    }

}
