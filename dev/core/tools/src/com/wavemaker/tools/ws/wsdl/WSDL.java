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
package com.wavemaker.tools.ws.wsdl;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.wsdl.Definition;
import javax.wsdl.Input;
import javax.wsdl.Message;
import javax.wsdl.Operation;
import javax.wsdl.Output;
import javax.wsdl.Part;
import javax.xml.namespace.QName;

import org.apache.ws.commons.schema.XmlSchema;
import org.apache.ws.commons.schema.XmlSchemaElement;
import org.apache.ws.commons.schema.XmlSchemaType;
import org.w3c.dom.Element;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.CastUtils;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.service.ServiceType;
import com.wavemaker.runtime.service.definition.AbstractDeprecatedServiceDefinition;
import com.wavemaker.runtime.service.definition.ReflectServiceDefinition;
import com.wavemaker.runtime.ws.HTTPBindingSupport.HTTPRequestMethod;
import com.wavemaker.tools.ws.wsdl.WSDLUtils.SoapHeader;

/**
 * This class represents a Web Service definition.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 */
public class WSDL  extends AbstractDeprecatedServiceDefinition
        implements ReflectServiceDefinition {

    public enum WebServiceType {
        SOAP, REST
    }
    
    private static final int MAX_NESTED_CHILD_LEVEL = 10;

    private String serviceId;
    
    private String serviceClassName;

    private List<ServiceInfo> serviceInfoList;

    private Set<String> auxiliaryClasses;

    private WebServiceType webServiceType;

    private String packageName;

    private Definition definition;

    private String wsdlURI;

    private Map<String, Element> schemas;

    private List<XmlSchema> xmlSchemas;
    
    private List<String> importedNoRefSchemas;

    private boolean isRPC;
    
    private boolean isSOAPEncoded;

    private String endpointLocation;

    private HTTPRequestMethod httpRequestMethod;

    private boolean noOverwriteCustomizationFiles;

    private boolean skipInternalCustomization;

    private List<File> jaxbCustomizationFiles;

    private List<File> jaxwsCustomizationFiles;

    private List<String> interceptorClassNames = new ArrayList<String>();

    private Map<String, Operation> operationMap;

    private TypeMapper typeMapper;

    private String runtimeConfiguration;

    @SuppressWarnings("unused")
    private WSDL() {
    }

    public WSDL(String serviceId, String serviceClassName,
            List<ServiceInfo> serviceInfoList, Definition definition,
            String wsdlURI, WebServiceType webServiceType,
            Map<String, Element> schemas, List<XmlSchema> xmlSchemas)
            throws SchemaException {
        this.serviceId = serviceId;
        this.serviceClassName = serviceClassName;
        this.serviceInfoList = serviceInfoList;
        this.definition = definition;
        this.wsdlURI = wsdlURI;
        this.webServiceType = webServiceType;
        this.schemas = schemas;
        this.xmlSchemas = xmlSchemas;
    }

    public String getServiceId() {
        return serviceId;
    }

    public List<ServiceInfo> getServiceInfoList() {
        return serviceInfoList;
    }

    public ServiceType getServiceType() {
        return new com.wavemaker.runtime.ws.WebServiceType();
    }

    public WebServiceType getWebServiceType() {
        return webServiceType;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String pkg) {
        this.packageName = pkg;
    }

    /**
     * Returns the definition object.
     * 
     * @return The actual WSDL's <code>Definition</code> object.
     */
    public Definition getDefinition() {
        return definition;
    }

    /**
     * Returns the URI (can be a filename or URL) pointing to a WSDL XML
     * definition.
     * 
     * @return The URI.
     */
    public String getURI() {
        return wsdlURI;
    }

    /**
     * Returns the target namespace in which the WSDL elements are defined.
     * 
     * @return The target namespace.
     */
    public String getTargetNamespace() {
        return definition.getTargetNamespace();
    }

    /**
     * Returns a map view of all the schemas defined in the WSDL. The key is the
     * system identifier for the schema, and the value is the Element form for
     * the schema.
     * 
     * @return A list of schemas
     */
    public Map<String, Element> getSchemas() {
        return schemas;
    }

    /**
     * Returns all the schemas defined in the WSDL. This list will include
     * schema for "http://www.w3.org/2001/XMLSchema".
     * 
     * @return A list of schemas.
     */
    public List<XmlSchema> getXmlSchemas() {
        return xmlSchemas;
    }

    /**
     * Returns a list of schema namespace URIs which are imported as part of 
     * schema definition but don't specify the actual schema location.  For this
     * list of schemas, we may have to add them to the bindings explicitly.
     * 
     * @return A list of schema namespace URIs.
     */
    public List<String> getImportedNoRefSchemas() {
        return importedNoRefSchemas;
    }

    public void setImportedNoRefSchemas(List<String> importedNoRefSchemas) {
        this.importedNoRefSchemas = importedNoRefSchemas;
    }

    /**
     * Returns true if the WSDL is RPC style. A WSDL is RPC style if the style
     * attribute is specified and the value is "rpc".
     * 
     * @return True if the WSDL is RPC style.
     */
    public boolean isRPC() {
        return isRPC;
    }

    public void setRPC(boolean isRPC) {
        this.isRPC = isRPC;
    }

    /**
     * Returns true if the WSDL is SOAP encoded. A WSDL is SOAP encoded if one
     * of the soap:body element has the use attribue set to "encoded".
     * 
     * @return True if the WSDL is SOAP encoded.
     */
    public boolean isSOAPEncoded() {
        return isSOAPEncoded;
    }

    public void setSOAPEncoded(boolean isSOAPEncoded) {
        this.isSOAPEncoded = isSOAPEncoded;
    }

    /**
     * Returns the location of the service endpoint. For SOAP type, this would
     * be a fully resolvable URL. If the WSDL is REST type, then this would be a
     * parameterized URL.
     * 
     * @return The endpoint location.
     */
    public String getEndpointLocation() {
        return endpointLocation;
    }

    /**
     * Sets the location of the service endpoint.
     * 
     * @param endpointLocation
     *            The endpoint location.
     */
    public void setEndpointLocation(String endpointLocation) {
        this.endpointLocation = endpointLocation;
    }

    /**
     * Returns the HTTP method to be used for this service.
     * 
     * @return the httpRequestMethod
     */
    public HTTPRequestMethod getHttpRequestMethod() {
        return httpRequestMethod;
    }

    /**
     * Sets the HTTP mehtod.
     * 
     * @param httpRequestMethod the httpRequestMethod to set
     */
    public void setHttpRequestMethod(HTTPRequestMethod httpRequestMethod) {
        this.httpRequestMethod = httpRequestMethod;
    }

    /**
     * Returns true if generation should not overwrite the existing
     * customization files.
     * 
     * @return True if generation should not overwrite the existing
     *         customization files.
     */
    public boolean isNoOverwriteCustomizationFiles() {
        return noOverwriteCustomizationFiles;
    }

    /**
     * Sets if generation should not overwrite existing customization files.
     * 
     * @param noOverwriteCustomizationFiles
     */
    public void setNoOverwriteCustomizationFiles(
            boolean noOverwriteCustomizationFiles) {
        this.noOverwriteCustomizationFiles = noOverwriteCustomizationFiles;
    }

    /**
     * Returns true if generation should skip our internal generated
     * customization files.
     * 
     * @return True if generation should skip out internal generate
     *  customization files.
     */
    public boolean isSkipInternalCustomization() {
        return skipInternalCustomization;
    }

    /**
     * Sets if generation should skip our generated customization files.
     * 
     * @param skipInternalCustomization
     */
    public void setSkipInternalCustomization(boolean skipInternalCustomization) {
        this.skipInternalCustomization = skipInternalCustomization;
    }

    /**
     * Returns additional JAXB customization files.  These files are addition to
     * our own internal JAXB customization files.
     * 
     * @return The additional JAXB customization files.
     */
    public List<File> getJaxbCustomizationFiles() {
        return jaxbCustomizationFiles;
    }

    /**
     * Sets the additional JAXB customization files.
     * 
     * @param jaxbCustomizationFiles The additional JAXB customization files.
     */
    public void setJaxbCustomizationFiles(List<File> jaxbCustomizationFiles) {
        this.jaxbCustomizationFiles = jaxbCustomizationFiles;
    }

    /**
     * Returns additional JAXWS customization files.  These files are addition
     * to our own internal JAXWS customization files.
     * 
     * @return The additional JAXWS customization files.
     */
    public List<File> getJaxwsCustomizationFiles() {
        return jaxwsCustomizationFiles;
    }

    /**
     * Sets the additional JAXWS customization files.
     * 
     * @param jaxwsCustomizationFiles The additional JAXWS customization files.
     */
    public void setJaxwsCustomizationFiles(List<File> jaxwsCustomizationFiles) {
        this.jaxwsCustomizationFiles = jaxwsCustomizationFiles;
    }

    /**
     * Returns a list of interceptors which would be used to do additional
     * processing of the inbound and outbound messages.
     * 
     * @return A list of class names.
     */
    public List<String> getInterceptorClassNames() {
        return interceptorClassNames;
    }

    /**
     * Sets the class names to be used for performing additional processing of
     * the inbound and outbound messages.
     * 
     * @param classNames
     *            A list of class names.
     */
    public void setInterceptorClassNames(List<String> classNames) {
        interceptorClassNames = classNames;
    }

    /**
     * Adds the class name to the interceptor list.
     * 
     * @param className
     *            The class name representing the interceptor.
     */
    public void addInterceptorClassName(String className) {
        interceptorClassNames.add(className);
    }

    public List<String> getOperationNames() {
        return new ArrayList<String>(operationMap.keySet());
    }

    /**
     * Returns the specifed operation.
     * 
     * @param name
     *            The name of the desired operation.
     * @return The operation.
     */
    public Operation getOperation(String name) {
        return operationMap.get(name);
    }

    public void setOperationsMap(Map<String, Operation> operationMap) {
        this.operationMap = operationMap;
    }

    public List<ElementType> getInputTypes(String operationName) {
        return getInputTypes(operationName, false);
    }

    public ElementType getOutputType(String operationName) {
        return getOutputType(operationName, false);
    }

    /**
     * Returns the input types for the specified operation.
     * 
     * @param operationName
     *            The name of the desired operation.
     * @param unWrapped
     *            True if unwrapped input types should be returned.
     * @return A list of input types.
     */
    public List<ElementType> getInputTypes(String operationName,
            boolean unWrapped) {
        List<SchemaElementType> types = null;
        if (unWrapped) {
            types = getUnWrappedInputTypes(operationName);
        } else {
            types = getDefinedInputTypes(operationName);
        }

        if (webServiceType == WebServiceType.SOAP) {
            types.addAll(getSOAPHeaderInputTypes(operationName));
        }

        return CastUtils.cast(types, ElementType.class);
    }

    /**
     * Returns the type for the operation's output.
     * 
     * @param operationName
     *            The name of the desired operation.
     * @param unWrapped
     *            True if unwraped output type should be returned.
     * @return The output type.
     */
    public ElementType getOutputType(String operationName, boolean unWrapped) {
        if (unWrapped) {
            return getUnWrappedOutputType(operationName);
        } else {
            return getDefinedOutputType(operationName);
        }
    }

    /**
     * Returns a list of exception types for the given operation.
     * 
     * @param operationName
     *            The operation name.
     * @return The exception types for the given operation.
     */
    public List<SchemaElementType> getExceptionTypes(String operationName) {
        List<SchemaElementType> elementTypes = new ArrayList<SchemaElementType>();
        if (webServiceType == WebServiceType.SOAP) {
            Operation operation = getOperation(operationName);
            List<Part> faultParts = WSDLUtils.getFaults(definition, operation);
            for (Part faultPart : faultParts) {
                SchemaElementType elementType =
                    constructSchemaElementType(faultPart);
                elementTypes.add(elementType);
            }
        }
        return elementTypes;
    }

    /**
     * Returns the operation's input types for putting in the SOAP header.
     * 
     * @param operationName
     *            The operation name.
     * @return The input types for putting in the SOAP header.
     */
    public List<SchemaElementType> getSOAPHeaderInputTypes(String operationName) {
        List<SchemaElementType> elementTypes = new ArrayList<SchemaElementType>();
        if (webServiceType == WebServiceType.SOAP) {
            Operation operation = getOperation(operationName);
            List<SoapHeader> inputSoapHeaders = WSDLUtils.getInputSoapHeaders(
                    definition, operation);
            for (SoapHeader soapHeader : inputSoapHeaders) {
                Message soapHeaderMessage = definition.getMessage(soapHeader
                        .getMessage());
                String partName = soapHeader.getPart();
                if (partName != null && partName.length() > 0) {
                    Part part = soapHeaderMessage.getPart(partName);
                    elementTypes.add(constructSchemaElementType(part));
                } else {
                    elementTypes.addAll(parseMessageParts(soapHeaderMessage));
                }
            }
        }
        return elementTypes;
    }

    private List<SchemaElementType> parseMessageParts(Message message) {
        List<SchemaElementType> elementTypes = new ArrayList<SchemaElementType>();
        List<Part> parts = CastUtils.cast(message.getOrderedParts(null));
        for (Part part : parts) {
            elementTypes.add(constructSchemaElementType(part));
        }
        return elementTypes;
    }

    private SchemaElementType constructSchemaElementType(Part part) {
        boolean isElement = false;
        QName schemaType = part.getTypeName();
        if (schemaType == null) {
            schemaType = part.getElementName(); // QName is an element
            isElement = true;
        }
        SchemaElementType type = new SchemaElementType(
                getTypeMapper().toPropertyName(part.getName()), schemaType,
                getJavaType(schemaType, isElement));
        type.setProperties(CastUtils.cast(
                getChildTypes(type, MAX_NESTED_CHILD_LEVEL),
                ElementType.class));
        return type;
    }

    /**
     * Returns a list of types for the operation's input. The input types
     * represent what actually defined in the WSDL.
     * 
     * @param operationName
     *            The name of the desired operation.
     * @return A list of input types.
     */
    public List<SchemaElementType> getDefinedInputTypes(String operationName) {
        List<SchemaElementType> elementTypes = new ArrayList<SchemaElementType>();
        Operation operation = getOperation(operationName);
        Input input = operation.getInput();
        if (input != null) {
            Message message = input.getMessage();
            if (message != null) {
                elementTypes.addAll(parseMessageParts(message));
            }
        }
        return elementTypes;
    }

    /**
     * Returns the type for the operation's output. The returned output type
     * represents what actually defined in the WSDL.
     * 
     * @param operationName
     *            The name of the desired operation.
     * @return The output type.
     */
    public SchemaElementType getDefinedOutputType(String operationName) {
        Operation operation = getOperation(operationName);
        Output output = operation.getOutput();
        if (output != null) {
            Message message = output.getMessage();
            if (message != null) {
                List<SchemaElementType> elementTypes = parseMessageParts(message);
                if (elementTypes.size() == 1) {
                    return elementTypes.get(0);
                }
            }
        }
        return null;
    }

    /**
     * Returns a list of types for the operation's input. Unwrapped input types
     * will be returned if appropriated.
     * 
     * @param operationName
     *            The name of the desired operation.
     * @return A list of input types.
     */
    public List<SchemaElementType> getUnWrappedInputTypes(String operationName) {
        List<SchemaElementType> elementTypes = getDefinedInputTypes(operationName);
        if (!isRPC() && elementTypes.size() == 1) {
            List<SchemaElementType> childTypes = getChildTypes(
                    elementTypes.iterator().next(), MAX_NESTED_CHILD_LEVEL);
            return childTypes.isEmpty() ? elementTypes : childTypes;
        } else {
            return elementTypes;
        }
    }

    /**
     * Returns the type for the operation's output. Unwrapped output type will
     * be returned if appropriated.
     * 
     * @param operationName
     *            The name of the desired operation.
     * @return The output type.
     */
    public SchemaElementType getUnWrappedOutputType(String operationName) {
        SchemaElementType elementType = getDefinedOutputType(operationName);
        if (!isRPC() && elementType != null) {
            List<SchemaElementType> childTypes =
                getChildTypes(elementType, MAX_NESTED_CHILD_LEVEL);
            return childTypes.size() == 1 ? childTypes.get(0) : elementType;
        }
        return elementType;
    }

    private List<SchemaElementType> getChildTypes(SchemaElementType rootType,
            int maxLevel) {
        List<XmlSchemaElement> childElements =
            getChildElements(rootType.getSchemaType());
        if (childElements.isEmpty()) {
            return Collections.emptyList();
        } else {
            List <SchemaElementType> childTypes =
                new ArrayList<SchemaElementType>();
            for (XmlSchemaElement childElement : childElements) {
                boolean isElement = false;
                QName t = childElement.getSchemaTypeName();
                if (t == null) {
                    t = childElement.getRefName(); // QName is an element
                    isElement = true;
                }
                if (t != null) {
                    SchemaElementType ctype = new SchemaElementType(
                            getTypeMapper().toPropertyName(childElement.getName()),
                            t,
                            getJavaType(t, isElement),
                            childElement.getMinOccurs(),
                            childElement.getMaxOccurs());
                    // don't proceed anymore if max level is reached
                    // stop processing if the parent type and the child type are the same, to avoid infinite loop.
                    if (maxLevel > 1 && !rootType.getName().equals(ctype.getName())) {
                        ctype.setProperties(CastUtils.cast(
                            getChildTypes(ctype, maxLevel--),
                            ElementType.class));
                    }
                    childTypes.add(ctype);
                }
            }
            return childTypes;
        }
    }

    /**
     * Given a <code>QName</code>, returns a list of child XML schema
     * elements. If no child elements for the
     * <code>QName<code>, eg. the <code>QName</code>
     * is a leaf node, then empty list is returned.
     * 
     * @param qname The qualified name.
     * @return A list of child XML schema elements.
     */
    private List<XmlSchemaElement> getChildElements(QName qname) {
        for (XmlSchema schema : xmlSchemas) {
            XmlSchemaType schemaType = schema.getTypeByName(qname);
            if (schemaType == null) {
                XmlSchemaElement element = schema.getElementByName(qname);
                if (element != null) {
                    schemaType = element.getSchemaType();
                }
            }
            if (schemaType != null) {
                return SchemaUtils.getChildElements(schemaType);
            }
        }
        return Collections.emptyList();
    }

    /**
     * Returns the <code>TypeMapper</code> used for doing Java type and schema
     * type convertions.
     * 
     * @return The <code>TypeMapper</code> object.
     */
    public TypeMapper getTypeMapper() {
        if (typeMapper == null) {
            throw new WMRuntimeException(Resource.WS_MISSING_TYPEMAPPER);
        }
        return this.typeMapper;
    }

    /**
     * Sets the <code>TypeMapper</code> for converting <code>QName</code> to
     * Java type.
     * 
     * @param typeMapper
     *            The <code>TypeMapper</code> object.
     */
    public void setTypeMapper(TypeMapper typeMapper) {
        this.typeMapper = typeMapper;
    }

    /**
     * Returns the Java type for the given <code>QName</code>.  This method uses
     * <code>TypeMapp</code> to get the mappings.
     * 
     * @param qname The qualified name.
     * @param isElement If the <code>QName</code> represents an element; if this
     * is set to <code>false</code>, then means it is a complex type.
     * @return The Java type.
     * @see #setTypeMapper
     */
    private String getJavaType(QName qname, boolean isElement) {
        return getTypeMapper().getJavaType(qname, isElement);
    }

    public String getRuntimeConfiguration() {
        return runtimeConfiguration;
    }
    
    public void setRuntimeConfiguration(String runtimeConfiguration) {
        this.runtimeConfiguration = runtimeConfiguration;
    }

    public void dispose() {
    }

    /**
     * Returns the service's class name omitting the package.
     */
    public String getServiceClassName() {
        return serviceClassName;
    }

    public String getServiceClass() {
        return getPackageName() + "." + getServiceClassName();
    }

    /**
     * Returns a set of auxiliary classes for this service.
     */
    public Set<String> getAuxiliaryClasses() {
        return auxiliaryClasses;
    }

    /**
     * Sets a set of auxiliary classes for this service.
     * 
     * @param auxiliaryClasses A set of fully quailified class names.
     */
    public void setAuxiliaryClasses(Set<String> auxiliaryClasses) {
        this.auxiliaryClasses = auxiliaryClasses;
    }

    public List<ElementType> getTypes() {
        return getTypeMapper().getAllTypes(serviceId);
    }

    public List<String> getEventNotifiers() {
        return new ArrayList<String>();
    }

    public boolean isLiveDataService() {
        return false;
    }
}
