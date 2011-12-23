
package com.strikeiron.basicrealtimequotes;

import java.math.BigDecimal;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for SubscriptionInfo complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="SubscriptionInfo">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="LicenseStatusCode" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="LicenseStatus" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="LicenseActionCode" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="LicenseAction" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="RemainingHits" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="Amount" type="{http://www.w3.org/2001/XMLSchema}decimal"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "SubscriptionInfo", namespace = "http://ws.strikeiron.com", propOrder = {
    "licenseStatusCode",
    "licenseStatus",
    "licenseActionCode",
    "licenseAction",
    "remainingHits",
    "amount"
})
@XmlRootElement(name = "SubscriptionInfo", namespace = "http://ws.strikeiron.com")
public class SubscriptionInfo {

    @XmlElement(name = "LicenseStatusCode", namespace = "http://ws.strikeiron.com")
    protected int licenseStatusCode;
    @XmlElement(name = "LicenseStatus", namespace = "http://ws.strikeiron.com")
    protected String licenseStatus;
    @XmlElement(name = "LicenseActionCode", namespace = "http://ws.strikeiron.com")
    protected int licenseActionCode;
    @XmlElement(name = "LicenseAction", namespace = "http://ws.strikeiron.com")
    protected String licenseAction;
    @XmlElement(name = "RemainingHits", namespace = "http://ws.strikeiron.com")
    protected int remainingHits;
    @XmlElement(name = "Amount", namespace = "http://ws.strikeiron.com", required = true)
    protected BigDecimal amount;

    /**
     * Gets the value of the licenseStatusCode property.
     * 
     */
    public int getLicenseStatusCode() {
        return licenseStatusCode;
    }

    /**
     * Sets the value of the licenseStatusCode property.
     * 
     */
    public void setLicenseStatusCode(int value) {
        this.licenseStatusCode = value;
    }

    /**
     * Gets the value of the licenseStatus property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLicenseStatus() {
        return licenseStatus;
    }

    /**
     * Sets the value of the licenseStatus property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLicenseStatus(String value) {
        this.licenseStatus = value;
    }

    /**
     * Gets the value of the licenseActionCode property.
     * 
     */
    public int getLicenseActionCode() {
        return licenseActionCode;
    }

    /**
     * Sets the value of the licenseActionCode property.
     * 
     */
    public void setLicenseActionCode(int value) {
        this.licenseActionCode = value;
    }

    /**
     * Gets the value of the licenseAction property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLicenseAction() {
        return licenseAction;
    }

    /**
     * Sets the value of the licenseAction property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLicenseAction(String value) {
        this.licenseAction = value;
    }

    /**
     * Gets the value of the remainingHits property.
     * 
     */
    public int getRemainingHits() {
        return remainingHits;
    }

    /**
     * Sets the value of the remainingHits property.
     * 
     */
    public void setRemainingHits(int value) {
        this.remainingHits = value;
    }

    /**
     * Gets the value of the amount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getAmount() {
        return amount;
    }

    /**
     * Sets the value of the amount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setAmount(BigDecimal value) {
        this.amount = value;
    }

}
