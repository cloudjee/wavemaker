/*
 * Copyright (C) 2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Enterprise.
 *  You may not use this file in any manner except through written agreement with WaveMaker Software, Inc.
 *
 */ 


package com.wavemaker.runtime.ws.salesforce.gen;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for MalformedSearchFault complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="MalformedSearchFault">
 *   &lt;complexContent>
 *     &lt;extension base="{urn:fault.partner.soap.sforce.com}ApiQueryFault">
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "MalformedSearchFault", namespace = "urn:fault.partner.soap.sforce.com")
@XmlRootElement(name = "MalformedSearchFault", namespace = "urn:fault.partner.soap.sforce.com")
public class MalformedSearchFault
    extends ApiQueryFaultType
{


}
