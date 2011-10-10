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

package com.wavemaker.tools.ws.wadl;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.wsdl.WSDLException;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.namespace.QName;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;

import org.apache.ws.commons.schema.XmlSchema;
import org.apache.ws.commons.schema.XmlSchemaCollection;
import org.apache.ws.commons.schema.XmlSchemaComplexType;
import org.apache.ws.commons.schema.XmlSchemaElement;
import org.apache.ws.commons.schema.XmlSchemaObject;
import org.apache.ws.commons.schema.XmlSchemaObjectCollection;
import org.apache.ws.commons.schema.XmlSchemaObjectTable;
import org.apache.ws.commons.schema.XmlSchemaParticle;
import org.apache.ws.commons.schema.XmlSchemaSequence;
import org.apache.ws.commons.schema.XmlSchemaType;
import org.jvnet.ws.wadl.Application;
import org.jvnet.ws.wadl.Grammars;
import org.jvnet.ws.wadl.Include;
import org.jvnet.ws.wadl.Method;
import org.jvnet.ws.wadl.Param;
import org.jvnet.ws.wadl.RepresentationType;
import org.jvnet.ws.wadl.Request;
import org.jvnet.ws.wadl.Resource;
import org.jvnet.ws.wadl.Resources;
import org.jvnet.ws.wadl.Response;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.wavemaker.common.util.CastUtils;
import com.wavemaker.runtime.ws.util.Constants;
import com.wavemaker.tools.ws.RESTInputParam;
import com.wavemaker.tools.ws.RESTInputParam.InputType;
import com.wavemaker.tools.ws.RESTWsdlGenerator;

/**
 * Converts WADL to WSDL.
 * 
 * @author ffu
 * @author Jeremy Grelle
 * 
 */
public class Wadl2Wsdl {

    private static final String WADL_PACKAGE = "org.jvnet.ws.wadl";

    private static final String DEFAULT_OPERATION_NAME = "invoke";

    private static JAXBContext jaxbContext;

    private static synchronized JAXBContext getJAXBContext() throws JAXBException {
        if (jaxbContext == null) {
            jaxbContext = JAXBContext.newInstance(WADL_PACKAGE);
        }
        return jaxbContext;
    }

    private final URI wadlUri;

    private final Application application;

    /**
     * Construct a <code>Wadl2Wsdl</code> object.
     * 
     * @param wadlUri The URI of the WADL file to process.
     * @throws JAXBException
     * @throws MalformedURLException
     * @throws URISyntaxException
     */
    public Wadl2Wsdl(URI wadlUri) throws JAXBException, MalformedURLException, URISyntaxException {
        Unmarshaller unmarshaller = getJAXBContext().createUnmarshaller();
        this.wadlUri = wadlUri;
        this.application = (Application) unmarshaller.unmarshal(wadlUri.toURL());
    }

    private Resource getResource() {
        Resource r = this.application.getResources().getResource().get(0);
        Resource res = null;
        while ((res = getChildResource(r)) != null) {
            r = res;
        }
        return r;
    }

    private static Resource getChildResource(Resource r) {
        List<Object> methodOrResource = r.getMethodOrResource();
        for (Object o : methodOrResource) {
            if (o instanceof Resource) {
                return (Resource) o;
            }
        }
        return null;
    }

    private String getServiceURLPath() {
        Resources resources = this.application.getResources();
        StringBuilder sb = new StringBuilder();
        sb.append(resources.getBase());
        Resource res = resources.getResource().get(0);
        sb.append(res.getPath());
        while ((res = getChildResource(res)) != null) {
            sb.append("/");
            sb.append(res.getPath());
        }
        return sb.toString();
    }

    private String getServiceName() {
        String path = getResource().getPath();
        if (path.indexOf('.') > -1) {
            return path.substring(0, path.indexOf('.'));
        } else {
            return path;
        }
    }

    private Method getMethod() throws WADLException {
        List<Object> list1 = this.application.getResourceTypeOrMethodOrRepresentation();
        List<Method> allMethods = new ArrayList<Method>();
        for (Object o : list1) {
            if (o instanceof Method) {
                allMethods.add((Method) o);
            }
        }
        List<Object> list2 = getResource().getMethodOrResource();
        for (Object o : list2) {
            if (o instanceof Method) {
                Method m = (Method) o;
                if (m.getHref() != null) {
                    for (Method method : allMethods) {
                        if (method.getId().equals(m.getHref().substring(1))) {
                            return method;
                        }
                    }
                } else {
                    return m;
                }
            }
        }
        throw new WADLException(com.wavemaker.common.MessageResource.WS_WADL_METHOD_NOT_FOUND);
    }

    /**
     * Generates the WSDL file in the specified folder.
     * 
     * @param outDir The directory in which the WSDL file to be generated.
     * @return The generated WSDL file.
     * @throws WSDLException
     * @throws SAXException
     * @throws IOException
     * @throws ParserConfigurationException
     * @throws WADLException
     * @throws TransformerException
     */
    public File generateWSDL(File outDir) throws WSDLException, SAXException, IOException, ParserConfigurationException, WADLException,
        TransformerException {
        File wsdlFile = new File(outDir, getServiceName() + Constants.WSDL_EXT);

        String serviceName = getServiceName();
        String namespace = getServiceURLPath();
        String operationName = DEFAULT_OPERATION_NAME;
        QName outputElement = null;
        Map<String, InputType> tempInputParts = new LinkedHashMap<String, InputType>();

        List<Param> initParamList = getResource().getParam();
        for (Param param : initParamList) {
            tempInputParts.put(param.getName(), InputType.STRING);
        }

        Method method = getMethod();
        Request request = method.getRequest();
        List<Param> paramList = request.getParam();
        for (Param param : paramList) {
            tempInputParts.put(param.getName(), InputType.STRING);
        }

        Response response = method.getResponse();
        for (JAXBElement<RepresentationType> representationOrFault : response.getRepresentationOrFault()) {
            if (representationOrFault.getName().getLocalPart().equals("representation")) {
                outputElement = representationOrFault.getValue().getElement();
                break;
            }
        }

        List<RESTInputParam> inputParts = new ArrayList<RESTInputParam>();
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, InputType> inputPart : tempInputParts.entrySet()) {
            String paramName = inputPart.getKey();
            sb.append(URLEncoder.encode(paramName, "UTF-8"));
            sb.append("={");
            sb.append(paramName);
            sb.append("}&");
            inputParts.add(new RESTInputParam(paramName, inputPart.getValue()));
        }
        // remove the last '&'
        if (sb.length() > 0 && sb.charAt(sb.length() - 1) == '&') {
            sb.deleteCharAt(sb.length() - 1);
        }
        String parameterizedURL = getServiceURLPath() + "?" + sb.toString();

        Grammars grammars = this.application.getGrammars();
        List<Element> schemaElements = new ArrayList<Element>();
        if (grammars != null) {
            for (Object any : grammars.getAny()) {
                if (any instanceof Element) {
                    schemaElements.add(checkAndFixUnboundedSequence((Element) any));
                }
            }
            for (Include include : grammars.getInclude()) {
                URI includeUri = this.wadlUri.resolve(include.getHref());
                InputSource input = new InputSource(includeUri.toURL().openStream());
                XmlSchemaCollection xmlSchemaColl = new XmlSchemaCollection();
                XmlSchema xmlSchema = xmlSchemaColl.read(input, null);
                for (Document schemaDocument : xmlSchema.getAllSchemas()) {
                    schemaElements.add(schemaDocument.getDocumentElement());
                }
            }
        }
        RESTWsdlGenerator generator = new RESTWsdlGenerator(serviceName, namespace, operationName, parameterizedURL);
        generator.setSchemaElements(schemaElements);
        generator.setInputParts(inputParts);
        if (outputElement != null) {
            generator.setOutputElementType(outputElement);
        }
        generator.write(wsdlFile);
        return wsdlFile;
    }

    /**
     * Attempts to fix in which if sequence has maxOccurs set to unbounded and the sequence has more than 1 item, JAXB
     * will generate JAXBElement<T> for the corresponding property. To avoid having JAXBElement<T> generated, we modify
     * the maxOccurs to 1. This fix may not be a ideal solution for all cases, and in such cases, user may need to
     * modiify the generated WSDL and set the maxOccurs back to unbounded and reimport again. And then the user will
     * have to deal with the JAXBElement<T> in Java code.
     */
    private static Element checkAndFixUnboundedSequence(Element schema) {
        XmlSchemaCollection xmlSchemaColl = new XmlSchemaCollection();
        XmlSchema xmlSchema = xmlSchemaColl.read(schema);

        boolean isModified = false;

        XmlSchemaObjectTable elements = xmlSchema.getElements();
        Iterator<XmlSchemaObject> elementsIter = CastUtils.cast(elements.getValues());
        while (elementsIter.hasNext()) {
            XmlSchemaObject element = elementsIter.next();
            if (element instanceof XmlSchemaElement) {
                XmlSchemaType schemaType = ((XmlSchemaElement) element).getSchemaType();
                isModified = fixIt(schemaType);
            }
        }

        XmlSchemaObjectTable schemaTypes = xmlSchema.getSchemaTypes();
        Iterator<XmlSchemaObject> schemaTypesIter = CastUtils.cast(schemaTypes.getValues());
        while (schemaTypesIter.hasNext()) {
            XmlSchemaObject schemaType = schemaTypesIter.next();
            if (schemaType instanceof XmlSchemaType) {
                isModified = fixIt((XmlSchemaType) schemaType);
            }
        }

        if (isModified) {
            Document[] allSchemas = xmlSchema.getAllSchemas();
            if (allSchemas.length > 0) {
                return allSchemas[0].getDocumentElement();
            }
        }
        return schema;
    }

    private static boolean fixIt(XmlSchemaType schemaType) {
        if (schemaType != null) {
            if (schemaType instanceof XmlSchemaComplexType) {
                XmlSchemaParticle particle = ((XmlSchemaComplexType) schemaType).getParticle();
                if (particle != null) {
                    if (particle instanceof XmlSchemaSequence) {
                        XmlSchemaSequence sequence = (XmlSchemaSequence) particle;
                        XmlSchemaObjectCollection items = sequence.getItems();
                        if (items.getCount() > 1 && sequence.getMaxOccurs() > 1) {
                            sequence.setMaxOccurs(1);
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}
