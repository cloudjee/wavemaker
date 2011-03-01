/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.ws;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.StringReader;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.wsdl.Definition;
import javax.wsdl.Input;
import javax.wsdl.Message;
import javax.wsdl.Operation;
import javax.wsdl.Output;
import javax.wsdl.Part;
import javax.wsdl.PortType;
import javax.wsdl.Types;
import javax.wsdl.WSDLException;
import javax.wsdl.extensions.schema.Schema;
import javax.wsdl.factory.WSDLFactory;
import javax.wsdl.xml.WSDLWriter;
import javax.xml.namespace.QName;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.ibm.wsdl.InputImpl;
import com.ibm.wsdl.MessageImpl;
import com.ibm.wsdl.OperationImpl;
import com.ibm.wsdl.OutputImpl;
import com.ibm.wsdl.PartImpl;
import com.ibm.wsdl.PortTypeImpl;
import com.ibm.wsdl.TypesImpl;
import com.ibm.wsdl.extensions.schema.SchemaImpl;
import com.sun.tools.ws.processor.util.IndentingWriter;
import com.wavemaker.runtime.ws.util.Constants;
import com.wavemaker.tools.ws.RESTInputParam.InputType;

/**
 * Generates WSDL which describes how to invoke and process REST service.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class RESTWsdlGenerator {

    private String serviceName;

    private String namespace;

    private String operationName;

    private String parameterizedUrl;

    private List<String> schemaStrings;

    private List<Element> schemaElements;

    private List<RESTInputParam> inputParts;

    private boolean isStringOutput;

    private QName outputElementType;

    private Set<QName> additionalNamespaces = new HashSet<QName>();
    
    private String httpMethod;
    
    private String contentType;

    /**
     * Constructor.
     * 
     * @param serviceName
     *                The name of the service.
     * @param namespace
     *                The namespace for this service. This is mainly used for
     *                generating Java package.
     * @param operationName
     *                The name of the operation.
     * @param parameterizedUrl
     *                The URL with parameters.
     * @param inputParts
     *                Map of input parameters and their types.
     * @param outputElementType
     *                The response element.
     */
    public RESTWsdlGenerator(String serviceName, String namespace,
            String operationName, String parameterizedUrl) {
        this.serviceName = serviceName;
        this.namespace = namespace;
        this.operationName = operationName;
        this.parameterizedUrl = parameterizedUrl;
    }

    public void setSchemaStrings(List<String> schemas) {
        this.schemaStrings = schemas;
    }

    public void setSchemaElements(List<Element> schemas) {
        this.schemaElements = schemas;
    }

    public void setInputParts(List<RESTInputParam> inputParts) {
        this.inputParts = inputParts;
    }

    public void setOutputElementType(QName outputElementType) {
        this.outputElementType = outputElementType;
        additionalNamespaces.add(outputElementType);
    }

    public void setStringOutput(boolean isStringOutput) {
        this.isStringOutput = isStringOutput;
    }

    public void setHttpMethod(String httpMethod) {
        this.httpMethod = httpMethod;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    private Definition generate() throws SAXException, IOException,
            ParserConfigurationException, WSDLException {
        Definition definition = WSDLFactory.newInstance().newDefinition();
        definition.addNamespace("wsdl", Constants.WSDL11_NS);
        definition.addNamespace("xs", Constants.XSD_NS);
        definition.addNamespace("tns", namespace);
        definition.setTargetNamespace(namespace);

        fixInputParamNames();
        
        definition.setDocumentationElement(
                generateDocumentation(Constants.REST_ENDPOINT_LOCATION_PREFIX
                        + parameterizedUrl));

        definition.setTypes(generateTypes());

        Message inputMessage = generateInputMessage();
        Message outputMessage = generateOutputMessage();
        
        for (QName q : additionalNamespaces) {
            if (q.getNamespaceURI() != null && q.getNamespaceURI().length() > 0) {
                definition.addNamespace(q.getPrefix(), q.getNamespaceURI());
            }
        }

        definition.addMessage(inputMessage);
        definition.addMessage(outputMessage);

        definition.addPortType(generatePortType(inputMessage, outputMessage));
        return definition;
    }

    private void fixInputParamNames() {
        if (inputParts != null) {
            for (RESTInputParam param : inputParts) {
                String paramName = param.getName();
                String newParamName = CodeGenUtils.toPropertyName(paramName
                        .replace(" ", ""));
                if (!paramName.equals(newParamName)) {
                    int i = parameterizedUrl.indexOf("{" + paramName + "}");
                    if (i > -1) {
                        int j = i + paramName.length() + 2;
                        parameterizedUrl = parameterizedUrl.substring(0, i)
                                + "{" + newParamName + "}"
                                + parameterizedUrl.substring(j);
                        param.setName(newParamName);
                    }
                }
            }
        }
    }

    private Element generateDocumentation(String content)
            throws ParserConfigurationException {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setNamespaceAware(true);
        DocumentBuilder db = dbf.newDocumentBuilder();
        Document document = db.newDocument();
        Element element = document.createElementNS(Constants.WSDL11_NS,
                "documentation");
        element.setPrefix("wsdl");
        element.setTextContent(content);
        return element;
    }

    private Types generateTypes() throws SAXException, IOException,
            ParserConfigurationException {
        Types types = new TypesImpl();
        if (schemaStrings != null) {
            for (String schemaString : schemaStrings) {
                Schema schema = new SchemaImpl();
                schema.setElementType(new QName(Constants.XSD_NS, "schema"));

                DocumentBuilderFactory dbf = DocumentBuilderFactory
                        .newInstance();
                DocumentBuilder db = dbf.newDocumentBuilder();
                Reader reader = new StringReader(schemaString);
                Document doc = db.parse(new InputSource(reader));

                schema.setElement(doc.getDocumentElement());
                types.addExtensibilityElement(schema);
            }
        }
        if (schemaElements != null) {
            for (Element schemaElement : schemaElements) {
                Schema schema = new SchemaImpl();
                schema.setElementType(new QName(Constants.XSD_NS, "schema"));
                schema.setElement(schemaElement);
                types.addExtensibilityElement(schema);
            }
        }
        return types;
    }

    private Message generateInputMessage() {
        Message message = new MessageImpl();
        message.setUndefined(false);
        message.setQName(new QName(namespace, "RequestMsg"));
        if (inputParts != null) {
            for (RESTInputParam entry : inputParts) {
                Part part = new PartImpl();
                part.setName(entry.getName());
                InputType type = entry.toType();
                if (type == InputType.OTHER) {
                    String outputType = entry.getType();
                    int i = outputType.lastIndexOf(':');
                    QName outType = null;
                    if (i > -1) {
                        outType = new QName(outputType.substring(0, i), 
                                outputType.substring(i + 1));
                    } else {
                        outType = new QName(outputType);
                    }
                    part.setElementName(outType);
                    additionalNamespaces.add(outType);
                } else {
                    part.setTypeName(constructInputSimpleTypeQName(type));
                }
                message.addPart(part);
            }
        }
        return message;
    }

    private Message generateOutputMessage() {
        Message message = new MessageImpl();
        message.setUndefined(false);
        message.setQName(new QName(namespace, "ResponseMsg"));

        Part part = new PartImpl();
        part.setName("body");
        if (isStringOutput) {
            part.setTypeName(new QName(Constants.XSD_NS, "string"));
            message.addPart(part);
        } else if (outputElementType != null) {
            part.setElementName(outputElementType);
            message.addPart(part);
        }

        return message;
    }

    private static QName constructInputSimpleTypeQName(InputType type) {
        if (type == InputType.STRING) {
            return new QName(Constants.XSD_NS, "string");
        } else if (type == InputType.INTEGER) {
            return new QName(Constants.XSD_NS, "int");
        } else {
            return null;
        }
    }

    private PortType generatePortType(Message inputMessage,
            Message outputMessage) throws ParserConfigurationException {
        PortType portType = new PortTypeImpl();
        portType.setUndefined(false);
        portType.setQName(new QName(serviceName));
        Operation operation = new OperationImpl();
        operation.setUndefined(false);
        operation.setName(operationName);
        if (httpMethod != null && httpMethod.equals("POST")) {
            String content = "POST";
            if (contentType != null && contentType.length() > 0) {
                content += " " + contentType;
            }
            operation.setDocumentationElement(generateDocumentation(content));
        }
        Input input = new InputImpl();
        input.setMessage(inputMessage);
        operation.setInput(input);
        Output output = new OutputImpl();
        output.setMessage(outputMessage);
        operation.setOutput(output);
        portType.addOperation(operation);
        return portType;
    }

    /**
     * Writes the generated WSDL into the specified file.
     * 
     * @param wsdlFile
     *                The file to be written to.
     * @throws WSDLException
     * @throws IOException
     * @throws SAXException
     * @throws ParserConfigurationException
     * @throws TransformerException 
     */
    public void write(File wsdlFile) throws WSDLException, IOException,
            SAXException, ParserConfigurationException, TransformerException {
        WSDLWriter writer = WSDLFactory.newInstance().newWSDLWriter();
        Definition definition = generate();
        Document document = writer.getDocument(definition);

        TransformerFactory tFactory = TransformerFactory.newInstance();
        Transformer transformer = tFactory.newTransformer();
        transformer.setOutputProperty(OutputKeys.METHOD, "xml");
        transformer.setOutputProperty(OutputKeys.INDENT, "yes");
        transformer.setOutputProperty(
                "{http://xml.apache.org/xslt}indent-amount", "2");
        transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

        IndentingWriter p = new IndentingWriter(new OutputStreamWriter(
                new FileOutputStream(wsdlFile)));

        DOMSource source = new DOMSource(document);
        StreamResult result = new StreamResult(p);
        transformer.transform(source, result);
        p.close();
    }

}
