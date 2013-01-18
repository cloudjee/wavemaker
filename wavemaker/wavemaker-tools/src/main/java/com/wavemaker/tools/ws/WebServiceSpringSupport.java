/*
 *  Copyright (C) 2007-2013 VMware, Inc. All rights reserved.
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

import java.io.IOException;
import java.util.List;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

import javax.xml.bind.JAXBException;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.ParserConfigurationException;

import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.FilterOn;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.Property;
import com.wavemaker.common.util.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.NamedNodeMap;
import org.xml.sax.SAXException;

/**
 * Utility methods for managing web service spring file.
 * 
 * @author Frankie Fu
 * @author Jeremy Grelle
 */
public class WebServiceSpringSupport {

    private static final String BINDING_PROPERTIES_PROPERTY_NAME = "bindingProperties";

    private static final String HTTP_BASIC_AUTH_USERNAME_PROPERTY_NAME = "httpBasicAuthUsername";

    private static final String HTTP_BASIC_AUTH_PASSWORD_PROPERTY_NAME = "httpBasicAuthPassword";

    private static final String CONNECTION_TIMEOUT_PROPERTY_NAME = "connectionTimeout";

    private static final String REQUEST_TIMEOUT_PROPERTY_NAME = "requestTimeout";

    /**
     * Returns the binding properties for the given service.
     * 
     * @param designServiceMgr The <code>DesignServiceManager</code>.
     * @param serviceId The service ID for the service.
     * @return The binding properties.
     * @throws JAXBException
     * @throws IOException
     * @throws ParserConfigurationException
     */
    public static BindingProperties getBindingProperties(DesignServiceManager designServiceMgr, String serviceId)
            throws JAXBException, IOException, ParserConfigurationException, SAXException {
        Folder serviceRuntimeDirectory = designServiceMgr.getServiceRuntimeFolder(serviceId);
        Service service = designServiceMgr.getService(serviceId);
        com.wavemaker.tools.io.File springFile = serviceRuntimeDirectory.getFile(service.getSpringFile());
        if (springFile.exists()) {
            Beans beans = SpringConfigSupport.readBeans(springFile);
            Bean bean = beans.getBeanById(serviceId);
            Property property = bean.getProperty(BINDING_PROPERTIES_PROPERTY_NAME);

            BindingProperties bindingProperties = new BindingProperties();
            if (property != null) {
                Bean bindingPropsBean = property.getBean();
                Property prop1 = bindingPropsBean.getProperty(HTTP_BASIC_AUTH_USERNAME_PROPERTY_NAME);
                if (prop1 != null) {
                    bindingProperties.setHttpBasicAuthUsername(prop1.getValue());
                    Property prop2 = bindingPropsBean.getProperty(HTTP_BASIC_AUTH_PASSWORD_PROPERTY_NAME);
                    if (prop2 != null) {
                        bindingProperties.setHttpBasicAuthPassword(prop2.getValue());
                    }
                }
                Property prop3 = bindingPropsBean.getProperty(CONNECTION_TIMEOUT_PROPERTY_NAME);
                if (prop3 != null) {
                    bindingProperties.setConnectionTimeout(Integer.parseInt(prop3.getValue()));
                }
                Property prop4 = bindingPropsBean.getProperty(REQUEST_TIMEOUT_PROPERTY_NAME);
                if (prop4 != null) {
                    bindingProperties.setRequestTimeout(Integer.parseInt(prop4.getValue()));
                }
            }
            bindingProperties.setEndpointAddress(getEndpointAddress(serviceRuntimeDirectory, bean));

            return bindingProperties;
        }
        return null;
    }

    /**
     * Sets the binding properties for the given service.
     * 
     * @param designServiceMgr The <code>DesignServiceManager</code>.
     * @param serviceId The service ID.
     * @param bindingProperties The binding properties to be set.
     * @throws JAXBException
     * @throws IOException
     */
    public static void setBindingProperties(DesignServiceManager designServiceMgr, String serviceId, BindingProperties bindingProperties)
        throws JAXBException, IOException, SAXException, ParserConfigurationException {
        if (bindingProperties != null) {
            Folder serviceRuntimeDirectory = designServiceMgr.getServiceRuntimeFolder(serviceId);
            Service service = designServiceMgr.getService(serviceId);
            com.wavemaker.tools.io.File springFile = serviceRuntimeDirectory.getFile(service.getSpringFile());

            Beans beans = SpringConfigSupport.readBeans(springFile);
            Bean bean = beans.getBeanById(serviceId);
            Property property = bean.getProperty(BINDING_PROPERTIES_PROPERTY_NAME);
            if (property == null) {
                property = new Property();
                property.setName(BINDING_PROPERTIES_PROPERTY_NAME);
                bean.addProperty(property);
            }

            Bean bindingPropsBean = new Bean();
            bindingPropsBean.setClazz(com.wavemaker.runtime.ws.BindingProperties.class.getName());

            String authUsername = bindingProperties.getHttpBasicAuthUsername();
            if (authUsername != null && authUsername.length() > 0) {
                String authPassword = bindingProperties.getHttpBasicAuthPassword();

                Property prop1 = new Property();
                prop1.setName(HTTP_BASIC_AUTH_USERNAME_PROPERTY_NAME);
                prop1.setValue(authUsername);

                Property prop2 = new Property();
                prop2.setName(HTTP_BASIC_AUTH_PASSWORD_PROPERTY_NAME);
                prop2.setValue(authPassword);

                bindingPropsBean.addProperty(prop1);
                bindingPropsBean.addProperty(prop2);
            }

            int connectionTimeout = bindingProperties.getConnectionTimeout();
            Property prop3 = new Property();
            prop3.setName(CONNECTION_TIMEOUT_PROPERTY_NAME);
            prop3.setValue(Integer.toString(connectionTimeout));
            bindingPropsBean.addProperty(prop3);

            int requestTimeout = bindingProperties.getRequestTimeout();
            Property prop4 = new Property();
            prop4.setName(REQUEST_TIMEOUT_PROPERTY_NAME);
            prop4.setValue(Integer.toString(requestTimeout));
            bindingPropsBean.addProperty(prop4);

            property.setBean(bindingPropsBean);

            SpringConfigSupport.writeBeans(beans, springFile);

            updateEndpointAddress(bindingProperties, serviceRuntimeDirectory, bean);
        }
    }

    private static void updateEndpointAddress(BindingProperties bindingProperties, Folder serviceFolder, Bean bean)
         throws SAXException, IOException, ParserConfigurationException{
        ServiceHelper svcHelper = new ServiceHelper(serviceFolder, bean);
        String endpointAddress = bindingProperties.getEndpointAddress();
        if (!org.springframework.util.StringUtils.hasText(endpointAddress)) {
            return;
        }

        String str;

        File serviceClass = svcHelper.getServiceClass();
        str = serviceClass.getContent().asString();
        String oldEndpointAddress = getEndpointAddress(svcHelper);
        str = str.replaceAll(oldEndpointAddress, endpointAddress);
        serviceClass.getContent().write(str);

        if (svcHelper.wsdlExists()) {
            File wadl = svcHelper.getWsdl();
            str = wadl.getContent().asString();
            str = str.replaceAll(oldEndpointAddress, endpointAddress);
            wadl.getContent().write(str);
        }
    }

    private static String getEndpointAddress(Folder serviceFolder, Bean bean)
        throws SAXException, IOException, ParserConfigurationException {
        ServiceHelper svcHelper = new ServiceHelper(serviceFolder, bean);
        return getEndpointAddress(svcHelper);
    }

    private static String getEndpointAddress(ServiceHelper svcHelper)
            throws SAXException, IOException, ParserConfigurationException {
        String address;
        String str;

        if (svcHelper.isRest()) {
            str = svcHelper.getServiceClass().getContent().asString();
            Pattern p = Pattern.compile("\\bnew\\b\\s\\s*QName\\s*\\(\\s*\"");
            Matcher m = p.matcher(str);
            if (m.find()) {
                str = str.substring(m.end());
            } else {
                return null;
            }
            p = Pattern.compile("\"");
            m = p.matcher(str);
            if (m.find()) {
                address = str.substring(0, m.end()-1);
            } else {
                return null;
            }

            return address;
        }

        //SOAP service from here

        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setNamespaceAware(true);
        DocumentBuilder docBuilder = dbf.newDocumentBuilder();
        Document doc = docBuilder.parse(svcHelper.getWsdl().getContent().asInputStream());
        String nodeName;

        NodeList listRoot = doc.getElementsByTagNameNS("*", "service");

        if (listRoot == null || listRoot.getLength() == 0) {
            return null;
        }

        Node nodeSvc = listRoot.item(0); // assumes there is only once service
                                         // name defined in a WSDL

        NodeList listSvc = nodeSvc.getChildNodes();
        if (listSvc == null || listSvc.getLength() == 0) {
            return null;
        }

        Node nodePort = null, node;
        for (int i=0; i<listSvc.getLength(); i++) {
            node = listSvc.item(i);
            nodeName = listSvc.item(i).getNodeName();
            if (nodeName.equals("port") || nodeName.endsWith(":port")) {
                nodePort = node;
                break;
            }
        }

        if (nodePort == null) {
            return null;
        }

        Node nodeAddress = null;
        NodeList listPort = nodePort.getChildNodes();
        if (listPort == null || listPort.getLength() == 0) {
            return null;
        }
        for (int j=0; j<listPort.getLength(); j++) {
            node = listPort.item(j);
            nodeName = node.getNodeName();
            if (nodeName.equals("address") || nodeName.endsWith(":address")) {
                nodeAddress = node;
                break;
            }
        }

        if (nodeAddress == null) {
            return null;
        }

        NamedNodeMap nMap = nodeAddress.getAttributes();

        if (nMap == null || nMap.getLength() == 0) {
            return null;
        }

        Node attrLocation = null;
        for (int k=0; k<nMap.getLength(); k++) {
            Node attr = nMap.item(k);
            if (attr.getNodeName().equals("location")) {
                attrLocation = attr;
                break;
            }
        }

        if (attrLocation == null) {
            return null;
        }

        return attrLocation.getNodeValue();
    }

    private static class ServiceHelper {
        private Folder serviceFolder;
        private Bean bean;
        private boolean isRest;
        private File wsdl = null;
        private boolean wsdlExists;
        private File serviceClass;

        public ServiceHelper(Folder serviceFolder, Bean bean) {
            this.serviceFolder = serviceFolder;
            this.bean = bean;

            this.serviceClass = this.serviceFolder.getFile(StringUtils.classNameToSrcFilePath(this.bean.getClazz()));
            Folder classFolder = serviceClass.getParent();
            List<Resource> wsdls = classFolder.list().include(FilterOn.names().ending(".wsdl")).fetchAll();
            this.wsdlExists = !(wsdls == null || wsdls.size() == 0);
            if (wsdlExists) {
                this.wsdl = (File)wsdls.get(0);
                this.isRest = !(wsdl.getContent().asString().contains("soapAction"));
            } else {
                this.isRest = true;
            }
        }

        public boolean isRest() {
            return isRest;
        }

        public boolean wsdlExists() {
            return this.wsdlExists;
        }

        public File getWsdl() {
            return this.wsdl;
        }

        public File getServiceClass() {
            return this.serviceClass;
        }
    }
}
