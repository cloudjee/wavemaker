
package com.strikeiron.basicrealtimequotes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for LicenseInfo complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="LicenseInfo">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="UnregisteredUser" type="{http://ws.strikeiron.com}UnregisteredUser" minOccurs="0"/>
 *         &lt;element name="RegisteredUser" type="{http://ws.strikeiron.com}RegisteredUser" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "LicenseInfo", namespace = "http://ws.strikeiron.com", propOrder = {
    "unregisteredUser",
    "registeredUser"
})
@XmlRootElement(name = "LicenseInfo", namespace = "http://ws.strikeiron.com")
public class LicenseInfo {

    @XmlElement(name = "UnregisteredUser", namespace = "http://ws.strikeiron.com")
    protected UnregisteredUserType unregisteredUser;
    @XmlElement(name = "RegisteredUser", namespace = "http://ws.strikeiron.com")
    protected RegisteredUserType registeredUser;

    /**
     * Gets the value of the unregisteredUser property.
     * 
     * @return
     *     possible object is
     *     {@link UnregisteredUserType }
     *     
     */
    public UnregisteredUserType getUnregisteredUser() {
        return unregisteredUser;
    }

    /**
     * Sets the value of the unregisteredUser property.
     * 
     * @param value
     *     allowed object is
     *     {@link UnregisteredUserType }
     *     
     */
    public void setUnregisteredUser(UnregisteredUserType value) {
        this.unregisteredUser = value;
    }

    /**
     * Gets the value of the registeredUser property.
     * 
     * @return
     *     possible object is
     *     {@link RegisteredUserType }
     *     
     */
    public RegisteredUserType getRegisteredUser() {
        return registeredUser;
    }

    /**
     * Sets the value of the registeredUser property.
     * 
     * @param value
     *     allowed object is
     *     {@link RegisteredUserType }
     *     
     */
    public void setRegisteredUser(RegisteredUserType value) {
        this.registeredUser = value;
    }

}
