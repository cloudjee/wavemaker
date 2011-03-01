/*
 * Copyright (C) 2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Enterprise.
 *  You may not use this file in any manner except through written agreement with WaveMaker Software, Inc.
 *
 */ 


package com.wavemaker.runtime.ws.salesforce.gen;

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
 *         &lt;element name="packageVersions" type="{urn:partner.soap.sforce.com}PackageVersion" maxOccurs="unbounded" minOccurs="0"/>
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
    "packageVersions"
})
@XmlRootElement(name = "PackageVersionHeader", namespace = "urn:partner.soap.sforce.com")
public class PackageVersionHeader {

    @XmlElement(namespace = "urn:partner.soap.sforce.com")
    protected List<PackageVersionType> packageVersions;

    /**
     * Gets the value of the packageVersions property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the packageVersions property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getPackageVersions().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link PackageVersionType }
     * 
     * 
     */
    public List<PackageVersionType> getPackageVersions() {
        if (packageVersions == null) {
            packageVersions = new ArrayList<PackageVersionType>();
        }
        return this.packageVersions;
    }

    /**
     * Sets the value of the packageVersions property.
     * 
     * @param packageVersions
     *     allowed object is
     *     {@link PackageVersionType }
     *     
     */
    public void setPackageVersions(List<PackageVersionType> packageVersions) {
        this.packageVersions = packageVersions;
    }

}
