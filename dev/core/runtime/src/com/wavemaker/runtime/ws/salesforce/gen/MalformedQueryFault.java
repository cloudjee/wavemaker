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
 * <p>Java class for MalformedQueryFault complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="MalformedQueryFault">
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
@XmlType(name = "MalformedQueryFault", namespace = "urn:fault.partner.soap.sforce.com")
@XmlRootElement(name = "MalformedQueryFault", namespace = "urn:fault.partner.soap.sforce.com")
public class MalformedQueryFault
    extends ApiQueryFaultType
{


}
