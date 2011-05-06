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

package com.wavemaker.tools.ws;

import java.io.File;
import java.io.IOException;

import javax.xml.bind.JAXBException;

import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.FileService;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.Property;

/**
 * Utility methods for managing web service spring file.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 * 
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
     */
    public static BindingProperties getBindingProperties(FileService fileService,
            DesignServiceManager designServiceMgr, String serviceId)
            throws JAXBException, IOException {
        File serviceRuntimeDirectory = designServiceMgr
                .getServiceRuntimeDirectory(serviceId);
        Service service = designServiceMgr.getService(serviceId);
        File springFile = new File(serviceRuntimeDirectory, service
                .getSpringFile());
        if (springFile.exists()) {
            Beans beans = SpringConfigSupport.readBeans(springFile, fileService);
            Bean bean = beans.getBeanById(serviceId);
            Property property = bean
                    .getProperty(BINDING_PROPERTIES_PROPERTY_NAME);

            BindingProperties bindingProperties = new BindingProperties();
            if (property != null) {
                Bean bindingPropsBean = property.getBean();
                Property prop1 = bindingPropsBean
                        .getProperty(HTTP_BASIC_AUTH_USERNAME_PROPERTY_NAME);
                if (prop1 != null) {
                    bindingProperties
                            .setHttpBasicAuthUsername(prop1.getValue());
                    Property prop2 = bindingPropsBean
                            .getProperty(HTTP_BASIC_AUTH_PASSWORD_PROPERTY_NAME);
                    if (prop2 != null) {
                        bindingProperties.setHttpBasicAuthPassword(prop2
                                .getValue());
                    }
                }
                Property prop3 = bindingPropsBean
                        .getProperty(CONNECTION_TIMEOUT_PROPERTY_NAME);
                if (prop3 != null) {
                    bindingProperties.setConnectionTimeout(Integer
                            .parseInt(prop3.getValue()));
                }
                Property prop4 = bindingPropsBean
                        .getProperty(REQUEST_TIMEOUT_PROPERTY_NAME);
                if (prop4 != null) {
                    bindingProperties.setRequestTimeout(Integer
                            .parseInt(prop4.getValue()));
                }
            }
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
    public static void setBindingProperties(FileService fileService,
            DesignServiceManager designServiceMgr, String serviceId,
            BindingProperties bindingProperties) throws JAXBException,
            IOException {
        if (bindingProperties != null) {
            File serviceRuntimeDirectory = designServiceMgr
                    .getServiceRuntimeDirectory(serviceId);
            Service service = designServiceMgr.getService(serviceId);
            File springFile = new File(serviceRuntimeDirectory, service
                    .getSpringFile());

            Beans beans = SpringConfigSupport.readBeans(springFile, fileService);
            Bean bean = beans.getBeanById(serviceId);
            Property property = bean
                    .getProperty(BINDING_PROPERTIES_PROPERTY_NAME);
            if (property == null) {
                property = new Property();
                property.setName(BINDING_PROPERTIES_PROPERTY_NAME);
                bean.addProperty(property);
            }

            Bean bindingPropsBean = new Bean();
            bindingPropsBean
                    .setClazz(com.wavemaker.runtime.ws.BindingProperties.class
                            .getName());

            String authUsername = bindingProperties.getHttpBasicAuthUsername();
            if (authUsername != null && authUsername.length() > 0) {
                String authPassword = bindingProperties
                        .getHttpBasicAuthPassword();

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

            SpringConfigSupport.writeBeans(beans, springFile, fileService);
        }
    }
}
