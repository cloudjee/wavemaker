/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.runtime.ws.util;

/**
 * Constants.
 * 
 * @author Frankie Fu
 */
public class Constants {

    private Constants() {}

    public static final String XSD_NS = "http://www.w3.org/2001/XMLSchema";

    public static final String WSDL11_NS = "http://schemas.xmlsoap.org/wsdl/";

    public static final String SOAP_ENCODING_NS = "http://schemas.xmlsoap.org/soap/encoding/";

    public static final String SOAP11_ENVELOPE_NS = "http://schemas.xmlsoap.org/soap/envelope/";

    public static final String SOAP_HTTP_BINDING_NS = "http://schemas.xmlsoap.org/soap/http";

    public static final String XSI_NS = "http://www.w3.org/2001/XMLSchema-instance";

    public static final String SOAP12_ENVELOPE_NS = "http://www.w3.org/2003/05/soap-envelope";
    
    public static final String JAXWS_NS = "http://java.sun.com/xml/ns/jaxws";
    
    public static final String JAXB_NS = "http://java.sun.com/xml/ns/jaxb";
    
    public static final String XJC_NS = "http://java.sun.com/xml/ns/jaxb/xjc";
    
    public static final String JAVAEE_NS = "http://java.sun.com/xml/ns/javaee";
    
    public static final String TARGET_NAMESPACE = "targetNamespace";
    
    public static final String SOAP_STYLE_DOCUMENT = "document";
    
    public static final String SOAP_STYLE_RPC = "rpc";
    
    public static final String WSDL_EXT = ".wsdl";
    
    public static final String XSD_EXT = ".xsd";

    public static final String JAXB_BINDING_FILE_EXT = ".xjb";

    public static final String JAXWS_BINDING_FILE_EXT = ".xml";
    
    public static final String JAXB_GLOBAL_BINDING_FILE = "global-binding.xjb";
    
    public static final String SOAP_ENCODING_SCHEMA_FILE = "soapenc.xsd";
    
    public static final String REQUEST_PROPERTY_MAP_VAR_NAME = "requestPropertyMap";
    
    public static final String REST_ENDPOINT_LOCATION_PREFIX = "endpoint=";
    
    public static final String HTTP_METHOD_POST = "POST";
}
