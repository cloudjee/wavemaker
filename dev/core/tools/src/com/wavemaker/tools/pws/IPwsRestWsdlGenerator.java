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

package com.wavemaker.tools.pws;

import com.wavemaker.tools.ws.RESTInputParam;

import java.util.List;
import java.io.File;
import java.io.IOException;

import org.w3c.dom.Element;
import org.xml.sax.SAXException;

import javax.wsdl.WSDLException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.namespace.QName;

/**
 * @author slee
 *
 */
public interface IPwsRestWsdlGenerator {

    void setHttpMethod(String httpMethod);

    void setContentType(String contentType);

    void setInputParts_list(List<List<RESTInputParam>> inputParts_list);

    void setStringOutput(boolean isStringOutput);

    void setOutputType(String outputType);

    void setSchemaStrings(List<String> schemas);

    void setSchemaElements(List<Element> schemas);

    void write(File wsdlFile) throws WSDLException, IOException,
            SAXException, ParserConfigurationException, TransformerException;

    void setServiceName(String serviceName);

    void setNamespace(String namespace);

    void setOperationNameList(List<String> operationName_list);

    void setParameterizedUrl(String parameterizedUrl);

    void setPartnerName(String partnerName);

    QName buildQName(String namespace, String operationName, String suffix);

}
