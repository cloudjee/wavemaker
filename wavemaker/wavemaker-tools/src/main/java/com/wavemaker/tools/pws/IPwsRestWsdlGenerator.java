/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.pws;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.wsdl.WSDLException;
import javax.xml.namespace.QName;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;

import org.w3c.dom.Element;
import org.xml.sax.SAXException;

import com.wavemaker.tools.ws.RESTInputParam;

/**
 * The default implementation of this interface is <code>RESTWsdlGenerator</code>. Developers may extend the default
 * implementation to customize the content of the generated WSDL.
 * 
 * @author Seung Lee
 * 
 */
public interface IPwsRestWsdlGenerator {

    /**
     * Sets the http request method (<tt>GET</tt>, <tt>POST</tt>, <tt>PUT</tt>, ...)
     * 
     * @param httpMethod the http request method
     */
    void setHttpMethod(String httpMethod);

    /**
     * Sets the content type of the request body (<tt>application/xml</tt>, <tt>application/x-www-form-urlencoded</tt>,
     * ...)
     * 
     * @param contentType the content type
     */
    void setContentType(String contentType);

    /**
     * Sets the input parameter list
     * 
     * @param inputParts_list the list of input parameters
     */
    void setInputParts_list(List<List<RESTInputParam>> inputParts_list);

    /**
     * Sets the flag indicating that the output is string type
     * 
     * @param isStringOutput <i>yes</i> - output is a string, <i>no</i> - output is not a string
     */
    void setStringOutput(boolean isStringOutput);

    /**
     * Sets the name of the output type. Usually, specific response message type name.
     * 
     * @param outputType the name of the output type
     */
    void setOutputType(String outputType);

    /**
     * Sets the list of XML schema strings. Uaually, the list contais only one element unless multiple XSD parts
     * (separated by "--- schema end ---") are involved.
     * 
     * @param schemas the list of schema strings
     */
    void setSchemaStrings(List<String> schemas);

    /**
     * Sets the list of schema elements
     * 
     * @param elems the list of schema strings
     */
    void setSchemaElements(List<Element> elems);

    /**
     * This is the main mathod in the interface and it generates a WSDL based on the populated properties and XSD
     * document.
     * 
     * @param wsdlFile the file where the generated WSDL is stored
     * @throws WSDLException if a WSDL related error occurs
     * @throws IOException if a file IO error occurs
     * @throws SAXException if SAX parser fails
     * @throws ParserConfigurationException if a parser configuration error occurs
     * @throws TransformerException if a XML transformer fails when attempting to write WSDl to the file
     */
    void write(File wsdlFile) throws WSDLException, IOException, SAXException, ParserConfigurationException, TransformerException;

    /**
     * Sets the service name
     * 
     * @param serviceName the service name
     */
    void setServiceName(String serviceName);

    /**
     * Sets the name space string if used
     * 
     * @param namespace the name space
     */
    void setNamespace(String namespace);

    /**
     * Sets the list of operation names
     * 
     * @param operationName_list the list of operation names
     */
    void setOperationNameList(List<String> operationName_list);

    /**
     * Sets the service url including <i>name=value</i> parameters
     * 
     * @param parameterizedUrl the parameterized url
     */
    void setParameterizedUrl(String parameterizedUrl);

    /**
     * Sets the partner name
     * 
     * @param partnerName the partner name
     */
    void setPartnerName(String partnerName);

    /**
     * Builds JDK's <code>QName</code> object. Usually, developers override this method in
     * <code>RESTWsdlGenerator</code> to manipulate the local part of <code>QName</code> when building
     * <code>QName</code> for request messages or response messages.
     * 
     * @param namespace the name space. pass <tt>null</tt> if no name space is used
     * @param operationName the operation name
     * @param suffix the suffix
     * @return a <code>Qname</code> object
     */
    QName buildQName(String namespace, String operationName, String suffix);

}
