/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.ws.wsdl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.wsdl.Binding;
import javax.wsdl.Definition;
import javax.wsdl.Import;
import javax.wsdl.Operation;
import javax.wsdl.Port;
import javax.wsdl.PortType;
import javax.wsdl.Service;
import javax.wsdl.Types;
import javax.wsdl.extensions.UnknownExtensibilityElement;
import javax.wsdl.extensions.schema.Schema;
import javax.wsdl.extensions.schema.SchemaImport;
import javax.xml.namespace.QName;

import org.apache.ws.commons.schema.XmlSchema;
import org.apache.ws.commons.schema.XmlSchemaCollection;
import org.w3c.dom.Element;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.util.CastUtils;
import com.wavemaker.runtime.ws.HTTPBindingSupport.HTTPRequestMethod;
import com.wavemaker.runtime.ws.util.Constants;
import com.wavemaker.tools.ws.CodeGenUtils;
import com.wavemaker.tools.ws.jaxws.JAXWSBuilder;
import com.wavemaker.tools.ws.wsdl.WSDL.WebServiceType;
import com.wavemaker.tools.ws.wsdl.WSDLUtils.Soap11Address;
import com.wavemaker.tools.ws.wsdl.WSDLUtils.SoapAddress;

/**
 * This class builds a <code>WSDL</code> object from a WSDL file. The <code>WSDL</code> object represents the Web
 * Service definition that the framework could process.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class WSDLBuilder {

    private final List<XmlSchema> xmlSchemas = new ArrayList<XmlSchema>();

    private final Map<String, Element> schemaMap = new LinkedHashMap<String, Element>();

    private final List<String> importedSchemas = new ArrayList<String>();

    private final List<String> importedNoRefSchemas = new ArrayList<String>();

    private final String wsdlURI;

    private final Definition definition;

    private final WebServiceType serviceType;

    public WSDLBuilder(String wsdlURI) throws WSDLException {
        this.wsdlURI = wsdlURI;
        this.definition = WSDLUtils.readDefinition(wsdlURI);
        this.serviceType = getWebServiceType();
    }

    public WSDL buildWSDL(String serviceId) throws WSDLException {
        List<PortTypeInfo> portTypeInfoList = buildServices();
        processSchemas(this.definition);
        Map<String, Element> schemas = buildSchemas();

        String name = WSDLUtils.generateServiceName(this.definition);
        String serviceClassName = CodeGenUtils.toClassName(name);
        if (serviceId == null || serviceId.length() == 0) {
            serviceId = toValidServiceId(name);
        }

        List<ServiceInfo> serviceInfoList = buildServiceInfoList(serviceId, portTypeInfoList);

        try {
            WSDL wsdl = new WSDL(serviceId, serviceClassName, serviceInfoList, this.definition, this.wsdlURI, this.serviceType, schemas,
                this.xmlSchemas);
            populateWSDL(wsdl);
            return wsdl;
        } catch (SchemaException e) {
            throw new WSDLException(e);
        }
    }

    private void populateWSDL(WSDL wsdl) throws WSDLException {
        String packageName = CodeGenUtils.constructPackageName(wsdl.getTargetNamespace(), wsdl.getServiceId());
        wsdl.setPackageName(packageName);

        wsdl.setImportedNoRefSchemas(this.importedNoRefSchemas);

        if (wsdl.getWebServiceType() == WebServiceType.REST) {
            String restParameterizedURL = null;
            Element element = this.definition.getDocumentationElement();
            if (element != null && element.getFirstChild() != null) {
                String s = element.getFirstChild().getTextContent();
                s = s.trim();
                int i = s.indexOf(Constants.REST_ENDPOINT_LOCATION_PREFIX);
                if (i > -1) {
                    restParameterizedURL = s.substring(Constants.REST_ENDPOINT_LOCATION_PREFIX.length());
                    if (restParameterizedURL.charAt(0) == '[') {
                        int j = restParameterizedURL.indexOf(']');
                        String httpMethod = restParameterizedURL.substring(1, j);
                        HTTPRequestMethod v = HTTPRequestMethod.valueOf(httpMethod);
                        if (v != null) {
                            wsdl.setHttpRequestMethod(v);
                        }
                        restParameterizedURL = restParameterizedURL.substring(j + 1);
                    }
                }
            }

            if (restParameterizedURL != null) {
                wsdl.setEndpointLocation(restParameterizedURL);
            } else {
                throw new WSDLException(MessageResource.WS_REST_WSDL_MISSING_URL);
            }

        } else {
            String style = WSDLUtils.getStyle(this.definition);
            boolean isRPC = style != null && style.equals(Constants.SOAP_STYLE_RPC);
            wsdl.setRPC(isRPC);

            wsdl.setSOAPEncoded(WSDLUtils.isSOAPEncoded(this.definition));

            wsdl.setAuxiliaryClasses(JAXWSBuilder.getGeneratedSeiClasses(wsdl));
        }

        Map<String, Operation> operationMap = new TreeMap<String, Operation>();
        for (ServiceInfo serviceInfo : wsdl.getServiceInfoList()) {
            for (PortTypeInfo portTypeInfo : serviceInfo.getPortTypeInfoList()) {
                operationMap.putAll(portTypeInfo.getOperationMap());
            }
        }
        wsdl.setOperationsMap(operationMap);

        // check with MessageInterceptorManager to see if there are
        // interceptors need to be set into the WSDL object.
        List<String> interceptorClassNames = MessageInterceptorManager.getInstance().getInterceptorClassNames(wsdl.getServiceId());
        if (interceptorClassNames != null) {
            wsdl.setInterceptorClassNames(interceptorClassNames);
        }
    }

    private WebServiceType getWebServiceType() {
        WebServiceType serviceType = WebServiceType.SOAP;
        if (WSDLUtils.getBindingForSOAP(this.definition, null) == null) {
            serviceType = WebServiceType.REST;
        }
        return serviceType;
    }

    private List<ServiceInfo> buildServiceInfoList(String serviceId, List<PortTypeInfo> portTypeInfoList) {
        List<ServiceInfo> serviceInfoList = new ArrayList<ServiceInfo>();
        if (this.serviceType == WebServiceType.REST) {
            ServiceInfo serviceInfo = new ServiceInfo(new QName(this.definition.getTargetNamespace(), serviceId));
            serviceInfo.setPortTypeInfoList(portTypeInfoList);
            serviceInfoList.add(serviceInfo);
        } else {
            for (PortTypeInfo portTypeInfo : portTypeInfoList) {
                Service serv = portTypeInfo.getService();
                if (serv != null) {
                    ServiceInfo serviceInfo = getOrCreateServiceInfo(serv.getQName(), serviceInfoList);
                    serviceInfo.addPortTypeInfo(portTypeInfo);
                }
            }
        }
        return serviceInfoList;
    }

    private Map<String, Element> buildSchemas() {
        Map<String, Element> schemas = new HashMap<String, Element>();
        int schemaElementCount = 1;
        for (String id : this.schemaMap.keySet()) {
            Element schema = this.schemaMap.get(id);
            String location = schema.getOwnerDocument().getDocumentURI();
            String systemId;
            if (this.serviceType == WebServiceType.REST) {
                systemId = location;

                // this is for the case if there is more than one <schema> in
                // the WSDL. For example,
                // <wsdl:types>
                // <xs:schema>
                // ...
                // </xs:schema>
                // <xs:schema>
                // ...
                // </xs:schema>
                // </wsdl:types>
                if (schemas.containsKey(systemId)) {
                    systemId = location + "#types?schema" + schemaElementCount++;
                }
            } else {
                if (this.importedSchemas.contains(location)) {
                    // the schema document is an XSD file, so just use that as
                    // the location.
                    systemId = location;
                } else {
                    systemId = location + "#types?schema" + schemaElementCount++;
                }
            }
            schemas.put(systemId, schema);
        }
        return schemas;
    }

    private List<PortTypeInfo> buildServices() {
        List<PortTypeInfo> portTypeInfoList = new ArrayList<PortTypeInfo>();
        if (this.definition.getServices().isEmpty()) {
            Collection<PortType> portTypes = CastUtils.cast(this.definition.getAllPortTypes().values());
            for (PortType portType : portTypes) {
                portTypeInfoList.addAll(buildServices(this.definition, portType));
            }
        } else {
            for (Iterator<QName> ite = CastUtils.cast(this.definition.getServices().keySet().iterator()); ite.hasNext();) {
                QName qn = ite.next();
                portTypeInfoList.addAll(buildServices(this.definition, qn));
            }
        }
        return portTypeInfoList;
    }

    private List<PortTypeInfo> buildServices(Definition d, QName name) {
        Service serv = d.getService(name);
        return buildServices(d, serv);
    }

    private List<PortTypeInfo> buildServices(Definition def, Service serv) {
        Map<QName, PortTypeInfo> services = new LinkedHashMap<QName, PortTypeInfo>();

        for (Port port : getSoapPorts(serv)) {
            Binding binding = port.getBinding();
            PortType pt = binding.getPortType();
            buildServices(services, def, pt, port, serv);
        }

        return new ArrayList<PortTypeInfo>(services.values());
    }

    private List<PortTypeInfo> buildServices(Definition def, PortType pt) {
        Map<QName, PortTypeInfo> services = new LinkedHashMap<QName, PortTypeInfo>();
        buildServices(services, def, pt, null, null);
        return new ArrayList<PortTypeInfo>(services.values());
    }

    private void buildServices(Map<QName, PortTypeInfo> services, Definition def, PortType pt, Port p, Service serv) {
        PortTypeInfo portTypeInfo = services.get(pt.getQName());
        if (portTypeInfo == null) {
            portTypeInfo = new PortTypeInfo(pt);
            portTypeInfo.setTargetNamespace(def.getTargetNamespace());
            if (p != null) {
                portTypeInfo.setPort(p);
            }
            if (serv != null) {
                portTypeInfo.setService(serv);
            }

            services.put(pt.getQName(), portTypeInfo);
        }
    }

    private XmlSchemaCollection processSchemas(Definition def) {
        XmlSchemaCollection schemaCol = new XmlSchemaCollection();

        List<Definition> defList = new ArrayList<Definition>();
        parseImports(def, defList);
        extractSchema(def, schemaCol);
        processSchemaList(def);
        for (Definition def2 : defList) {
            extractSchema(def2, schemaCol);
            processSchemaList(def2);
        }

        return schemaCol;
    }

    private void parseImports(Definition def, List<Definition> defList) {
        List<Import> importList = new ArrayList<Import>();

        Collection<List<Import>> ilist = CastUtils.cast(def.getImports().values());
        for (List<Import> list : ilist) {
            importList.addAll(list);
        }
        for (Import impt : importList) {
            parseImports(impt.getDefinition(), defList);
            defList.add(impt.getDefinition());
        }
    }

    private void extractSchema(Definition def, XmlSchemaCollection schemaCol) {
        Types typesElement = def.getTypes();
        if (typesElement != null) {
            int schemaCount = 1;
            for (Object obj : typesElement.getExtensibilityElements()) {
                org.w3c.dom.Element schemaElem = null;
                if (obj instanceof Schema) {
                    Schema schema = (Schema) obj;
                    schemaElem = schema.getElement();
                } else if (obj instanceof UnknownExtensibilityElement) {
                    org.w3c.dom.Element elem = ((UnknownExtensibilityElement) obj).getElement();
                    if (elem.getLocalName().equals("schema")) {
                        schemaElem = elem;
                    }
                }
                if (schemaElem != null) {
                    for (Object prefix : def.getNamespaces().keySet()) {
                        String ns = (String) def.getNamespaces().get(prefix);
                        if (!"".equals(prefix) && !schemaElem.hasAttribute("xmlns:" + prefix)) {
                            schemaElem.setAttributeNS(javax.xml.XMLConstants.XMLNS_ATTRIBUTE_NS_URI, "xmlns:" + prefix, ns);
                        }
                    }
                    String systemId = def.getDocumentBaseURI() + "#types?schema" + schemaCount;

                    schemaCol.setBaseUri(def.getDocumentBaseURI());
                    XmlSchema xmlSchema = schemaCol.read(schemaElem, systemId);
                    this.xmlSchemas.add(xmlSchema);
                    schemaCount++;
                }
            }
        }
    }

    private void processSchemaList(Definition def) {
        Types typesElement = def.getTypes();
        if (typesElement != null) {
            Iterator<Object> ite = CastUtils.cast(typesElement.getExtensibilityElements().iterator());
            while (ite.hasNext()) {
                Object obj = ite.next();
                if (obj instanceof Schema) {
                    Schema schema = (Schema) obj;
                    addSchema(schema, false);
                }
            }
        }
    }

    private void addSchema(Schema schema, boolean isImport) {
        String docBaseURI = schema.getDocumentBaseURI();
        Element schemaEle = schema.getElement();
        if (this.schemaMap.get(docBaseURI) == null) {
            this.schemaMap.put(docBaseURI, schemaEle);
            if (isImport) {
                this.importedSchemas.add(docBaseURI);
            }
        } else if (this.schemaMap.get(docBaseURI) != null && this.schemaMap.containsValue(schemaEle)) {
            // do nothing
        } else {
            String tns = schema.getDocumentBaseURI() + "#" + schema.getElement().getAttribute(Constants.TARGET_NAMESPACE);
            if (this.schemaMap.get(tns) == null) {
                this.schemaMap.put(tns, schema.getElement());
            }
        }

        Map<String, List<?>> imports = CastUtils.cast(schema.getImports());
        if (imports != null && imports.size() > 0) {
            Collection<String> importKeys = imports.keySet();
            for (String importNamespace : importKeys) {
                if (!isSchemaParsed(schema.getDocumentBaseURI(), importNamespace)) {
                    List<SchemaImport> schemaImports = CastUtils.cast(imports.get(importNamespace));
                    for (SchemaImport schemaImport : schemaImports) {
                        Schema tempImport = schemaImport.getReferencedSchema();
                        if (tempImport != null && !this.schemaMap.containsValue(tempImport.getElement())) {
                            addSchema(tempImport, true);
                        } else {
                            this.importedNoRefSchemas.add(schemaImport.getNamespaceURI());
                        }
                    }
                }
            }
        }
    }

    private boolean isSchemaParsed(String baseUri, String ns) {
        if (this.schemaMap.get(baseUri) != null) {
            Element ele = this.schemaMap.get(baseUri);
            String tns = ele.getAttribute(Constants.TARGET_NAMESPACE);
            if (ns.equals(tns)) {
                return true;
            }
        }
        return false;
    }

    private static ServiceInfo getOrCreateServiceInfo(QName servQName, List<ServiceInfo> serviceInfoList) {
        for (ServiceInfo serviceInfo : serviceInfoList) {
            if (serviceInfo.getQName().equals(servQName)) {
                return serviceInfo;
            }
        }
        ServiceInfo serviceInfo = new ServiceInfo(servQName);
        serviceInfoList.add(serviceInfo);
        return serviceInfo;
    }

    private static List<Port> getSoapPorts(Service serv) {
        List<Port> ports = new ArrayList<Port>();
        for (Port p : CastUtils.cast(serv.getPorts().values(), Port.class)) {
            SoapAddress soapAddress = WSDLUtils.getSoapAddress(p);
            if (soapAddress != null) {
                Port duplPort = findPortWithSamePortType(ports, p);
                if (duplPort == null) {
                    ports.add(p);
                } else {
                    if (soapAddress instanceof Soap11Address) {
                        ports.remove(duplPort);
                        ports.add(p);
                    }
                }
            }
        }
        return ports;
    }

    private static Port findPortWithSamePortType(List<Port> ports, Port p) {
        for (Port port : ports) {
            if (p.getBinding().getPortType().getQName().equals(port.getBinding().getPortType().getQName())) {
                return port;
            }
        }
        return null;
    }

    /**
     * Converts a name to a valid service ID.
     */
    private static String toValidServiceId(String name) {
        return name.replace("-", "");
    }
}
