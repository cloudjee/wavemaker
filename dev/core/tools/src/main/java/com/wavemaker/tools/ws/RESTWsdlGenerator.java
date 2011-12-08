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

package com.wavemaker.tools.ws;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.StringReader;
import java.util.ArrayList;
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
import com.wavemaker.tools.pws.IPwsRestWsdlGenerator;
import com.wavemaker.tools.ws.RESTInputParam.InputType;

/**
 * Generates WSDL which describes how to invoke and process REST service.
 * 
 * @author Frankie Fu
 */
public class RESTWsdlGenerator implements IPwsRestWsdlGenerator {

    private String serviceName;

    private String namespace;

    private List<String> operationName_list;

    private String parameterizedUrl;

    private List<String> schemaStrings;

    private List<Element> schemaElements;

    private List<List<RESTInputParam>> inputParts_list;

    private boolean isStringOutput;

    private QName outputElementType = null;

    private final Set<QName> additionalNamespaces = new HashSet<QName>();

    private String httpMethod;

    private String contentType;

    private String outputType = null;

    public RESTWsdlGenerator() {
    }

    /**
     * Constructor.
     * 
     * @param serviceName The name of the service.
     * @param namespace The namespace for this service. This is mainly used for generating Java package.
     * @param operationName_list The list of the operation names.
     * @param parameterizedUrl The URL with parameters.
     */
    public RESTWsdlGenerator(String serviceName, String namespace, List<String> operationName_list, String parameterizedUrl) {
        this.serviceName = serviceName;
        this.namespace = namespace;
        this.operationName_list = operationName_list;
        this.parameterizedUrl = parameterizedUrl;
    }

    public RESTWsdlGenerator(String serviceName, String namespace, String operationName, String parameterizedUrl) {
        this.serviceName = serviceName;
        this.namespace = namespace;
        this.operationName_list = new ArrayList<String>();
        this.operationName_list.add(operationName);
        this.parameterizedUrl = parameterizedUrl;
    }

    @Override
    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    @Override
    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    @Override
    public void setOperationNameList(List<String> operationName_list) {
        this.operationName_list = operationName_list;
    }

    @Override
    public void setParameterizedUrl(String parameterizedUrl) {
        this.parameterizedUrl = parameterizedUrl;
    }

    @Override
    public void setSchemaStrings(List<String> schemas) {
        this.schemaStrings = schemas;
    }

    @Override
    public void setSchemaElements(List<Element> schemas) {
        this.schemaElements = schemas;
    }

    public void setInputParts(List<RESTInputParam> inputParts) {
        this.inputParts_list = new ArrayList<List<RESTInputParam>>();
        this.inputParts_list.add(inputParts);
    }

    @Override
    public void setInputParts_list(List<List<RESTInputParam>> inputParts_list) {
        this.inputParts_list = inputParts_list;
    }

    public void setOutputElementType(QName outputElementType) {
        this.outputElementType = outputElementType;
        this.additionalNamespaces.add(outputElementType);
    }

    @Override
    public void setStringOutput(boolean isStringOutput) {
        this.isStringOutput = isStringOutput;
    }

    @Override
    public void setOutputType(String outputType) {
        this.outputType = outputType;
    }

    @Override
    public void setHttpMethod(String httpMethod) {
        this.httpMethod = httpMethod;
    }

    @Override
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    @Override
    public void setPartnerName(String partnerName) {
    }

    protected Definition generate() throws SAXException, IOException, ParserConfigurationException, WSDLException {
        Definition definition = WSDLFactory.newInstance().newDefinition();
        definition.addNamespace("wsdl", Constants.WSDL11_NS);
        definition.addNamespace("xs", Constants.XSD_NS);
        definition.addNamespace("tns", this.namespace);
        definition.setTargetNamespace(this.namespace);

        fixInputParamNames();

        definition.setDocumentationElement(generateDocumentation(Constants.REST_ENDPOINT_LOCATION_PREFIX + this.parameterizedUrl));

        /*
         * if (xmlSchema_list == null && xmlSchemaPath_list == null) { Types types = new TypesImpl();
         * definition.setTypes(generateTypes(types, this.schemaStrings, this.schemaElements)); } else {
         * definition.setTypes(generateTypes()); }
         */

        definition.setTypes(generateTypes());

        Message inputMessage;
        Message outputMessage;

        PortType portType = new PortTypeImpl();
        portType.setUndefined(false);
        portType.setQName(new QName(this.serviceName));

        int indx = 0;
        for (String operationName : this.operationName_list) {
            inputMessage = generateInputMessage(operationName, this.inputParts_list.get(indx));
            outputMessage = generateOutputMessage(operationName);

            for (QName q : this.additionalNamespaces) {
                if (q.getNamespaceURI() != null && q.getNamespaceURI().length() > 0) {
                    definition.addNamespace(q.getPrefix(), q.getNamespaceURI());
                }
            }

            definition.addMessage(inputMessage);
            definition.addMessage(outputMessage);

            Operation operation = new OperationImpl();
            operation.setUndefined(false);
            operation.setName(operationName);
            if (this.httpMethod != null && this.httpMethod.equals("POST")) {
                String content = "POST";
                if (this.contentType != null && this.contentType.length() > 0) {
                    content += " " + this.contentType;
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
            indx++;
        }

        definition.addPortType(portType);

        return definition;
    }

    private void fixInputParamNames() {
        for (List<RESTInputParam> inputParts : this.inputParts_list) {
            fixInputParamNamesForOper(inputParts);
        }
    }

    private void fixInputParamNamesForOper(List<RESTInputParam> inputParts) {
        if (inputParts != null) {
            for (RESTInputParam param : inputParts) {
                String paramName = param.getName();
                String newParamName = toPropertyName(paramName);
                if (!paramName.equals(newParamName)) {
                    int i = this.parameterizedUrl.indexOf("{" + paramName + "}");
                    if (i > -1) {
                        int j = i + paramName.length() + 2;
                        this.parameterizedUrl = this.parameterizedUrl.substring(0, i) + "{" + newParamName + "}" + this.parameterizedUrl.substring(j);
                        param.setName(newParamName);
                    }
                }
            }
        }
    }

    public String toPropertyName(String name) {
        String newParamName = CodeGenUtils.toPropertyName(name.replace(" ", ""));
        return newParamName;
    }

    private Element generateDocumentation(String content)
            throws ParserConfigurationException {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setNamespaceAware(true);
        DocumentBuilder db = dbf.newDocumentBuilder();
        Document document = db.newDocument();
        Element element = document.createElementNS(Constants.WSDL11_NS, "documentation");
        element.setPrefix("wsdl");
        element.setTextContent(content);
        return element;
    }

    private Types generateTypes() throws SAXException, IOException, ParserConfigurationException {
        Types types = new TypesImpl();

        if (this.schemaStrings != null) {
            for (String schemaString : this.schemaStrings) {
                Schema schema = new SchemaImpl();
                schema.setElementType(new QName(Constants.XSD_NS, "schema"));

                DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
                DocumentBuilder db = dbf.newDocumentBuilder();
                Reader reader = new StringReader(schemaString);
                Document doc = db.parse(new InputSource(reader));

                schema.setElement(doc.getDocumentElement());
                types.addExtensibilityElement(schema);
            }
        }
        if (this.schemaElements != null) {
            for (Element schemaElement : this.schemaElements) {
                Schema schema = new SchemaImpl();
                schema.setElementType(new QName(Constants.XSD_NS, "schema"));
                schema.setElement(schemaElement);
                types.addExtensibilityElement(schema);
            }
        }
        return types;
    }

    protected Message generateInputMessage(String operName, List<RESTInputParam> inputParts) {
        Message message = new MessageImpl();
        message.setUndefined(false);
        message.setQName(buildQName(this.namespace, operName, "RequestMsg"));

        if (inputParts != null) {
            for (RESTInputParam entry : inputParts) {
                Part part = new PartImpl();
                part.setName(entry.getName());
                InputType type = entry.toType();
                if (type == InputType.OTHER) {
                    String inputType = entry.getType();
                    int i = inputType.lastIndexOf(':');
                    QName inType = null;
                    if (i > -1) {
                        inType = new QName(inputType.substring(0, i), inputType.substring(i + 1));
                    } else {
                        inType = new QName(inputType);
                    }
                    part.setElementName(inType);
                    this.additionalNamespaces.add(inType);
                } else {
                    part.setTypeName(constructInputSimpleTypeQName(type));
                }
                message.addPart(part);
            }
        }
        return message;
    }

    protected Message generateOutputMessage(String operName) {
        Message message = new MessageImpl();
        message.setUndefined(false);
        message.setQName(buildQName(this.namespace, operName, "ResponseMsg"));

        QName outType = null;
        if (this.outputType != null) { // called from WebServiceToolsManager
            int i = this.outputType.lastIndexOf(':');
            if (i > -1) {
                outType = new QName(this.outputType.substring(0, i), this.outputType.substring(i + 1));
            } else {
                outType = buildQName(null, operName, this.outputType);
            }
            this.additionalNamespaces.add(outType);
        } else if (this.outputElementType != null) { // callled from Wadl2Wsdl
            outType = this.outputElementType;
        }

        Part part = new PartImpl();
        part.setName("body");
        if (this.isStringOutput) {
            part.setTypeName(new QName(Constants.XSD_NS, "string"));
            message.addPart(part);
        } else if (outType != null) {
            part.setElementName(outType);
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

    @Override
    public QName buildQName(String namespace, String operationName, String suffix) {
        if (namespace == null || namespace.length() == 0) {
            return new QName(suffix);
        } else {
            return new QName(namespace, suffix);
        }
    }

    /**
     * Writes the generated WSDL into the specified file.
     * 
     * @param wsdlFile The file to be written to.
     * @throws WSDLException
     * @throws IOException
     * @throws SAXException
     * @throws ParserConfigurationException
     * @throws TransformerException
     */
    @Override
    public void write(File wsdlFile) throws WSDLException, IOException, SAXException, ParserConfigurationException, TransformerException {
        WSDLWriter writer = WSDLFactory.newInstance().newWSDLWriter();
        Definition definition = generate();
        Document document = writer.getDocument(definition);

        TransformerFactory tFactory = TransformerFactory.newInstance();
        Transformer transformer = tFactory.newTransformer();
        transformer.setOutputProperty(OutputKeys.METHOD, "xml");
        transformer.setOutputProperty(OutputKeys.INDENT, "yes");
        transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
        transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

        IndentingWriter p = new IndentingWriter(new OutputStreamWriter(new FileOutputStream(wsdlFile)));

        DOMSource source = new DOMSource(document);
        StreamResult result = new StreamResult(p);
        transformer.transform(source, result);
        p.close();
    }

}
