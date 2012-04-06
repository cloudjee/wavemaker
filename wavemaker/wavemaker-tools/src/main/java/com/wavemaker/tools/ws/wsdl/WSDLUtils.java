/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.wsdl.Binding;
import javax.wsdl.BindingFault;
import javax.wsdl.BindingOperation;
import javax.wsdl.Definition;
import javax.wsdl.Operation;
import javax.wsdl.OperationType;
import javax.wsdl.Part;
import javax.wsdl.Port;
import javax.wsdl.PortType;
import javax.wsdl.Types;
import javax.wsdl.extensions.ExtensibilityElement;
import javax.wsdl.extensions.schema.Schema;
import javax.wsdl.extensions.soap.SOAPAddress;
import javax.wsdl.extensions.soap.SOAPBinding;
import javax.wsdl.extensions.soap.SOAPBody;
import javax.wsdl.extensions.soap.SOAPFault;
import javax.wsdl.extensions.soap.SOAPHeader;
import javax.wsdl.extensions.soap12.SOAP12Address;
import javax.wsdl.extensions.soap12.SOAP12Binding;
import javax.wsdl.extensions.soap12.SOAP12Body;
import javax.wsdl.extensions.soap12.SOAP12Fault;
import javax.wsdl.extensions.soap12.SOAP12Header;
import javax.wsdl.factory.WSDLFactory;
import javax.wsdl.xml.WSDLReader;
import javax.wsdl.xml.WSDLWriter;
import javax.xml.namespace.QName;

import org.w3c.dom.Element;

import com.wavemaker.common.util.CastUtils;
import com.wavemaker.runtime.ws.util.Constants;

/**
 * WSDL related utility methods.
 * 
 * @author Frankie Fu
 */
public class WSDLUtils {

    /**
     * Reads the WSDL definition from the given WSDL URI.
     * 
     * @param wsdlURI A valid URI.
     * @return WSDL definition
     * @throws WSDLException
     */
    public static Definition readDefinition(String wsdlURI) throws WSDLException {
        try {
            WSDLReader reader = WSDLFactory.newInstance().newWSDLReader();
            reader.setFeature("javax.wsdl.importDocuments", true);
            reader.setFeature("javax.wsdl.verbose", false);
            return reader.readWSDL(wsdlURI);
        } catch (javax.wsdl.WSDLException e) {
            throw new WSDLException(e.getMessage(), e);
        }
    }

    /**
     * Writes the specified WSDL definition to the specified file.
     * 
     * @param definition The WSDL definition.
     * @param wsdlFile The file that this definition is going to write to.
     * @throws WSDLException
     */
    public static void writeDefinition(Definition definition, File wsdlFile) throws WSDLException, IOException {
        FileWriter out = null;
        try {
            out = new FileWriter(wsdlFile);
            WSDLWriter writer = WSDLFactory.newInstance().newWSDLWriter();
            writer.writeWSDL(definition, out);
        } catch (javax.wsdl.WSDLException e) {
            throw new WSDLException(e);
        } catch (IOException e) {
            throw new WSDLException(e);
        } finally {
            out.close();
        }
    }

    /**
     * Returns a service name for the WSDL. First check the service element, and if it is not defined, then use portType
     * element.
     * 
     * @param definition WSDL definition
     * @return the first service name
     */
    public static String generateServiceName(Definition definition) {
        Set<QName> qnames = CastUtils.cast(definition.getServices().keySet());
        if (qnames.size() == 0) {
            qnames = CastUtils.cast(definition.getPortTypes().keySet());
        }
        if (qnames.size() > 0) {
            QName qname = qnames.iterator().next();
            return qname.getLocalPart();
        } else {
            return null;
        }

    }

    private static <T extends ExtensibilityElement> T getExtensiblityElement(List<?> list, Class<T> clazz) {
        List<T> elements = getExtensiblityElements(list, clazz);
        return elements.isEmpty() ? null : elements.get(0);
    }

    private static <T extends ExtensibilityElement> List<T> getExtensiblityElements(List<?> list, Class<T> clazz) {
        List<T> result = new ArrayList<T>();

        for (Iterator<T> i = CastUtils.cast(list.iterator()); i.hasNext();) {
            T elm = i.next();
            if (clazz.isAssignableFrom(elm.getClass())) {
                result.add(elm);
            }
        }
        return result;
    }

    public static String getStyle(Binding binding) {
        SOAPBinding soapBinding = getExtensiblityElement(binding.getExtensibilityElements(), SOAPBinding.class);
        if (soapBinding != null) {
            return soapBinding.getStyle();
        }

        SOAP12Binding soap12Binding = getExtensiblityElement(binding.getExtensibilityElements(), SOAP12Binding.class);
        if (soap12Binding != null) {
            return soap12Binding.getStyle();
        }

        return null;
    }

    public static String getStyle(Definition definition) {
        Collection<QName> bindings = CastUtils.cast(definition.getAllBindings().keySet());
        Iterator<QName> names = bindings.iterator();
        while (names.hasNext()) {
            Binding binding = definition.getBinding(names.next());
            String style = getStyle(binding);
            if (style != null) {
                return style;
            }
        }
        return null;
    }

    public static boolean isInputSOAPEncoded(BindingOperation bindingOperation) {
        SOAPBody soapBody = getExtensiblityElement(bindingOperation.getBindingInput().getExtensibilityElements(), SOAPBody.class);

        if (soapBody != null) {
            return soapBody.getUse() != null && soapBody.getUse().equalsIgnoreCase("encoded")
                && (soapBody.getEncodingStyles() == null || soapBody.getEncodingStyles().contains(Constants.SOAP_ENCODING_NS));
        }

        SOAP12Body soap12Body = getExtensiblityElement(bindingOperation.getBindingInput().getExtensibilityElements(), SOAP12Body.class);

        if (soap12Body != null) {
            return soap12Body.getUse() != null && soap12Body.getUse().equalsIgnoreCase("encoded")
                && (soap12Body.getEncodingStyle() == null || soap12Body.getEncodingStyle().equals(Constants.SOAP_ENCODING_NS));
        }

        return false;
    }

    public static boolean isSOAPEncoded(Definition definition) {
        Binding binding = getBindingForSOAP(definition, null);
        if (binding != null) {
            List<BindingOperation> bindingOperations = CastUtils.cast(binding.getBindingOperations(), BindingOperation.class);
            for (BindingOperation bindingOperation : bindingOperations) {
                if (isInputSOAPEncoded(bindingOperation)) {
                    return true;
                }
            }
        }
        return false;
    }

    public static Binding getBindingForSOAP(Definition definition, Operation operation) {
        Collection<QName> bindings = CastUtils.cast(definition.getAllBindings().keySet());
        Iterator<QName> names = bindings.iterator();
        while (names.hasNext()) {
            Binding binding = definition.getBinding(names.next());
            PortType portType = binding.getPortType();
            if (operation == null || contains(CastUtils.cast(portType.getOperations(), Operation.class), operation)) {
                SOAPBinding soapBinding = getExtensiblityElement(binding.getExtensibilityElements(), SOAPBinding.class);
                if (soapBinding != null) {
                    return binding;
                }
                SOAP12Binding soap12Binding = getExtensiblityElement(binding.getExtensibilityElements(), SOAP12Binding.class);
                if (soap12Binding != null) {
                    return binding;
                }
            }
        }
        return null;
    }

    private static boolean contains(List<Operation> operationList, Operation operation) {
        for (Operation op : operationList) {
            if (op.getName().equals(operation.getName())) {
                return true;
            }
        }
        return false;
    }

    public static Map<String, Element> getSchemaMap(Types types) {
        Map<String, Element> schemaMap = new HashMap<String, Element>();
        Object extensibilityElement;
        if (types != null) {
            for (Iterator<Object> iterator = CastUtils.cast(types.getExtensibilityElements().iterator()); iterator.hasNext();) {
                extensibilityElement = iterator.next();

                if (extensibilityElement instanceof Schema) {
                    Element schemaElement = ((Schema) extensibilityElement).getElement();
                    schemaMap.put(schemaElement.getAttribute(Constants.TARGET_NAMESPACE), schemaElement);
                }
            }
        }
        return schemaMap;
    }

    public interface SoapHeader {

        public QName getMessage();

        public String getPart();
    }

    public static class Soap11Header implements SoapHeader {

        private final SOAPHeader soapHeader;

        public Soap11Header(SOAPHeader soapHeader) {
            this.soapHeader = soapHeader;
        }

        @Override
        public QName getMessage() {
            return this.soapHeader.getMessage();
        }

        @Override
        public String getPart() {
            return this.soapHeader.getPart();
        }
    }

    public static class Soap12Header implements SoapHeader {

        private final SOAP12Header soapHeader;

        public Soap12Header(SOAP12Header soapHeader) {
            this.soapHeader = soapHeader;
        }

        @Override
        public QName getMessage() {
            return this.soapHeader.getMessage();
        }

        @Override
        public String getPart() {
            return this.soapHeader.getPart();
        }
    }

    private static List<SoapHeader> getSoapHeaders(List<?> list) {
        List<SoapHeader> result = new ArrayList<SoapHeader>();

        List<SOAPHeader> soapHeaders = getExtensiblityElements(list, SOAPHeader.class);
        if (soapHeaders != null && !soapHeaders.isEmpty()) {
            for (SOAPHeader header : soapHeaders) {
                result.add(new Soap11Header(header));
            }
        } else {
            List<SOAP12Header> soap12Headers = getExtensiblityElements(list, SOAP12Header.class);
            if (soap12Headers != null && !soap12Headers.isEmpty()) {
                for (SOAP12Header header : soap12Headers) {
                    result.add(new Soap12Header(header));
                }
            }
        }

        return result;
    }

    public static List<SoapHeader> getInputSoapHeaders(Definition definition, Operation operation) {
        Binding binding = getBindingForSOAP(definition, operation);
        BindingOperation bindingOperation;
        if (operation.getStyle().equals(OperationType.ONE_WAY)) {
            bindingOperation = binding.getBindingOperation(operation.getName(), operation.getInput().getName(), null);
        } else {
            bindingOperation = binding.getBindingOperation(operation.getName(), operation.getInput().getName(), operation.getOutput().getName());
        }
        if (bindingOperation == null) {
            // try to get the operation binding by using only the operation name
            bindingOperation = binding.getBindingOperation(operation.getName(), null, null);
        }
        return getSoapHeaders(bindingOperation.getBindingInput().getExtensibilityElements());
    }

    private static List<Part> getFaultParts(BindingOperation bindingOperation, String faultName) {
        List<Part> result = new ArrayList<Part>();

        BindingFault bindingFault = bindingOperation.getBindingFault(faultName);
        SOAPFault soapFault = getExtensiblityElement(bindingFault.getExtensibilityElements(), SOAPFault.class);

        if (soapFault != null && soapFault.getName() != null) {
            List<Part> plist = CastUtils.cast(bindingOperation.getOperation().getFault(soapFault.getName()).getMessage().getOrderedParts(null));
            result.addAll(plist);
        } else {
            SOAP12Fault soap12Fault = getExtensiblityElement(bindingFault.getExtensibilityElements(), SOAP12Fault.class);

            if (soap12Fault != null && soap12Fault.getName() != null) {
                List<Part> plist = CastUtils.cast(bindingOperation.getOperation().getFault(soap12Fault.getName()).getMessage().getOrderedParts(null));
                result.addAll(plist);
            } else {
                List<Part> plist = CastUtils.cast(bindingOperation.getOperation().getFault(faultName).getMessage().getOrderedParts(null));
                result.addAll(plist);
            }
        }

        return result;
    }

    public static List<Part> getFaults(Definition definition, Operation operation) {
        Binding binding = getBindingForSOAP(definition, operation);
        BindingOperation bindingOperation;
        if (operation.getStyle().equals(OperationType.ONE_WAY)) {
            bindingOperation = binding.getBindingOperation(operation.getName(), operation.getInput().getName(), null);
        } else {
            bindingOperation = binding.getBindingOperation(operation.getName(), operation.getInput().getName(), operation.getOutput().getName());
        }
        if (bindingOperation == null) {
            // try to get the operation binding by using only the operation name
            bindingOperation = binding.getBindingOperation(operation.getName(), null, null);
        }
        Iterator<String> iter = CastUtils.cast(bindingOperation.getBindingFaults().keySet().iterator());
        List<Part> results = new ArrayList<Part>();
        while (iter.hasNext()) {
            List<Part> faultParts = getFaultParts(bindingOperation, iter.next());
            results.addAll(faultParts);
        }
        return results;
    }

    public interface SoapAddress {

        public String getLocationURI();
    }

    public static class Soap11Address implements SoapAddress {

        private final SOAPAddress soapAddress;

        public Soap11Address(SOAPAddress soapAddress) {
            this.soapAddress = soapAddress;
        }

        @Override
        public String getLocationURI() {
            return this.soapAddress.getLocationURI();
        }
    }

    public static class Soap12Address implements SoapAddress {

        private final SOAP12Address soap12Address;

        public Soap12Address(SOAP12Address soap12Address) {
            this.soap12Address = soap12Address;
        }

        @Override
        public String getLocationURI() {
            return this.soap12Address.getLocationURI();
        }
    }

    public static SoapAddress getSoapAddress(Port port) {
        SOAPAddress soapAddress = getExtensiblityElement(port.getExtensibilityElements(), SOAPAddress.class);
        if (soapAddress != null) {
            return new Soap11Address(soapAddress);
        }
        SOAP12Address soap12Address = getExtensiblityElement(port.getExtensibilityElements(), SOAP12Address.class);
        if (soap12Address != null) {
            return new Soap12Address(soap12Address);
        }
        return null;
    }

}
