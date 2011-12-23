
package com.strikeiron.basicrealtimequotes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for RealQuote complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="RealQuote">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="Symbol" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="CUSIP" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="CIK" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Name" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Date" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Time" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Last" type="{http://www.w3.org/2001/XMLSchema}double"/>
 *         &lt;element name="Quantity" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="ChangeFromPrevious" type="{http://www.w3.org/2001/XMLSchema}double"/>
 *         &lt;element name="PercentChangeFromPrevious" type="{http://www.w3.org/2001/XMLSchema}double"/>
 *         &lt;element name="Open" type="{http://www.w3.org/2001/XMLSchema}double"/>
 *         &lt;element name="ChangeFromOpen" type="{http://www.w3.org/2001/XMLSchema}double"/>
 *         &lt;element name="PercentChangeFromOpen" type="{http://www.w3.org/2001/XMLSchema}double"/>
 *         &lt;element name="Bid" type="{http://www.w3.org/2001/XMLSchema}double"/>
 *         &lt;element name="Ask" type="{http://www.w3.org/2001/XMLSchema}double"/>
 *         &lt;element name="Spread" type="{http://www.w3.org/2001/XMLSchema}double"/>
 *         &lt;element name="BidQuantity" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="AskQuantity" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="Volume" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="ECNVolume" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="Highest" type="{http://www.w3.org/2001/XMLSchema}double"/>
 *         &lt;element name="Lowest" type="{http://www.w3.org/2001/XMLSchema}double"/>
 *         &lt;element name="Rank" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "RealQuote", namespace = "http://www.strikeiron.com", propOrder = {
    "symbol",
    "cusip",
    "cik",
    "name",
    "date",
    "time",
    "last",
    "quantity",
    "changeFromPrevious",
    "percentChangeFromPrevious",
    "open",
    "changeFromOpen",
    "percentChangeFromOpen",
    "bid",
    "ask",
    "spread",
    "bidQuantity",
    "askQuantity",
    "volume",
    "ecnVolume",
    "highest",
    "lowest",
    "rank"
})
public class RealQuoteType {

    @XmlElement(name = "Symbol", namespace = "http://www.strikeiron.com")
    protected String symbol;
    @XmlElement(name = "CUSIP", namespace = "http://www.strikeiron.com")
    protected String cusip;
    @XmlElement(name = "CIK", namespace = "http://www.strikeiron.com")
    protected String cik;
    @XmlElement(name = "Name", namespace = "http://www.strikeiron.com")
    protected String name;
    @XmlElement(name = "Date", namespace = "http://www.strikeiron.com")
    protected String date;
    @XmlElement(name = "Time", namespace = "http://www.strikeiron.com")
    protected String time;
    @XmlElement(name = "Last", namespace = "http://www.strikeiron.com")
    protected double last;
    @XmlElement(name = "Quantity", namespace = "http://www.strikeiron.com")
    protected int quantity;
    @XmlElement(name = "ChangeFromPrevious", namespace = "http://www.strikeiron.com")
    protected double changeFromPrevious;
    @XmlElement(name = "PercentChangeFromPrevious", namespace = "http://www.strikeiron.com")
    protected double percentChangeFromPrevious;
    @XmlElement(name = "Open", namespace = "http://www.strikeiron.com")
    protected double open;
    @XmlElement(name = "ChangeFromOpen", namespace = "http://www.strikeiron.com")
    protected double changeFromOpen;
    @XmlElement(name = "PercentChangeFromOpen", namespace = "http://www.strikeiron.com")
    protected double percentChangeFromOpen;
    @XmlElement(name = "Bid", namespace = "http://www.strikeiron.com")
    protected double bid;
    @XmlElement(name = "Ask", namespace = "http://www.strikeiron.com")
    protected double ask;
    @XmlElement(name = "Spread", namespace = "http://www.strikeiron.com")
    protected double spread;
    @XmlElement(name = "BidQuantity", namespace = "http://www.strikeiron.com")
    protected int bidQuantity;
    @XmlElement(name = "AskQuantity", namespace = "http://www.strikeiron.com")
    protected int askQuantity;
    @XmlElement(name = "Volume", namespace = "http://www.strikeiron.com")
    protected int volume;
    @XmlElement(name = "ECNVolume", namespace = "http://www.strikeiron.com")
    protected int ecnVolume;
    @XmlElement(name = "Highest", namespace = "http://www.strikeiron.com")
    protected double highest;
    @XmlElement(name = "Lowest", namespace = "http://www.strikeiron.com")
    protected double lowest;
    @XmlElement(name = "Rank", namespace = "http://www.strikeiron.com")
    protected String rank;

    /**
     * Gets the value of the symbol property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSymbol() {
        return symbol;
    }

    /**
     * Sets the value of the symbol property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSymbol(String value) {
        this.symbol = value;
    }

    /**
     * Gets the value of the cusip property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCUSIP() {
        return cusip;
    }

    /**
     * Sets the value of the cusip property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCUSIP(String value) {
        this.cusip = value;
    }

    /**
     * Gets the value of the cik property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCIK() {
        return cik;
    }

    /**
     * Sets the value of the cik property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCIK(String value) {
        this.cik = value;
    }

    /**
     * Gets the value of the name property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the value of the name property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setName(String value) {
        this.name = value;
    }

    /**
     * Gets the value of the date property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDate() {
        return date;
    }

    /**
     * Sets the value of the date property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDate(String value) {
        this.date = value;
    }

    /**
     * Gets the value of the time property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTime() {
        return time;
    }

    /**
     * Sets the value of the time property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTime(String value) {
        this.time = value;
    }

    /**
     * Gets the value of the last property.
     * 
     */
    public double getLast() {
        return last;
    }

    /**
     * Sets the value of the last property.
     * 
     */
    public void setLast(double value) {
        this.last = value;
    }

    /**
     * Gets the value of the quantity property.
     * 
     */
    public int getQuantity() {
        return quantity;
    }

    /**
     * Sets the value of the quantity property.
     * 
     */
    public void setQuantity(int value) {
        this.quantity = value;
    }

    /**
     * Gets the value of the changeFromPrevious property.
     * 
     */
    public double getChangeFromPrevious() {
        return changeFromPrevious;
    }

    /**
     * Sets the value of the changeFromPrevious property.
     * 
     */
    public void setChangeFromPrevious(double value) {
        this.changeFromPrevious = value;
    }

    /**
     * Gets the value of the percentChangeFromPrevious property.
     * 
     */
    public double getPercentChangeFromPrevious() {
        return percentChangeFromPrevious;
    }

    /**
     * Sets the value of the percentChangeFromPrevious property.
     * 
     */
    public void setPercentChangeFromPrevious(double value) {
        this.percentChangeFromPrevious = value;
    }

    /**
     * Gets the value of the open property.
     * 
     */
    public double getOpen() {
        return open;
    }

    /**
     * Sets the value of the open property.
     * 
     */
    public void setOpen(double value) {
        this.open = value;
    }

    /**
     * Gets the value of the changeFromOpen property.
     * 
     */
    public double getChangeFromOpen() {
        return changeFromOpen;
    }

    /**
     * Sets the value of the changeFromOpen property.
     * 
     */
    public void setChangeFromOpen(double value) {
        this.changeFromOpen = value;
    }

    /**
     * Gets the value of the percentChangeFromOpen property.
     * 
     */
    public double getPercentChangeFromOpen() {
        return percentChangeFromOpen;
    }

    /**
     * Sets the value of the percentChangeFromOpen property.
     * 
     */
    public void setPercentChangeFromOpen(double value) {
        this.percentChangeFromOpen = value;
    }

    /**
     * Gets the value of the bid property.
     * 
     */
    public double getBid() {
        return bid;
    }

    /**
     * Sets the value of the bid property.
     * 
     */
    public void setBid(double value) {
        this.bid = value;
    }

    /**
     * Gets the value of the ask property.
     * 
     */
    public double getAsk() {
        return ask;
    }

    /**
     * Sets the value of the ask property.
     * 
     */
    public void setAsk(double value) {
        this.ask = value;
    }

    /**
     * Gets the value of the spread property.
     * 
     */
    public double getSpread() {
        return spread;
    }

    /**
     * Sets the value of the spread property.
     * 
     */
    public void setSpread(double value) {
        this.spread = value;
    }

    /**
     * Gets the value of the bidQuantity property.
     * 
     */
    public int getBidQuantity() {
        return bidQuantity;
    }

    /**
     * Sets the value of the bidQuantity property.
     * 
     */
    public void setBidQuantity(int value) {
        this.bidQuantity = value;
    }

    /**
     * Gets the value of the askQuantity property.
     * 
     */
    public int getAskQuantity() {
        return askQuantity;
    }

    /**
     * Sets the value of the askQuantity property.
     * 
     */
    public void setAskQuantity(int value) {
        this.askQuantity = value;
    }

    /**
     * Gets the value of the volume property.
     * 
     */
    public int getVolume() {
        return volume;
    }

    /**
     * Sets the value of the volume property.
     * 
     */
    public void setVolume(int value) {
        this.volume = value;
    }

    /**
     * Gets the value of the ecnVolume property.
     * 
     */
    public int getECNVolume() {
        return ecnVolume;
    }

    /**
     * Sets the value of the ecnVolume property.
     * 
     */
    public void setECNVolume(int value) {
        this.ecnVolume = value;
    }

    /**
     * Gets the value of the highest property.
     * 
     */
    public double getHighest() {
        return highest;
    }

    /**
     * Sets the value of the highest property.
     * 
     */
    public void setHighest(double value) {
        this.highest = value;
    }

    /**
     * Gets the value of the lowest property.
     * 
     */
    public double getLowest() {
        return lowest;
    }

    /**
     * Sets the value of the lowest property.
     * 
     */
    public void setLowest(double value) {
        this.lowest = value;
    }

    /**
     * Gets the value of the rank property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRank() {
        return rank;
    }

    /**
     * Sets the value of the rank property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRank(String value) {
        this.rank = value;
    }

}
