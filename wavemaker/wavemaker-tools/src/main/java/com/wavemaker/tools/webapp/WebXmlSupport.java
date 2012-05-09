/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.webapp;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.springframework.core.io.Resource;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.webapp.schema.ObjectFactory;
import com.wavemaker.tools.webapp.schema.WebAppType;
import com.wavemaker.tools.io.File;

/**
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class WebXmlSupport {

    public static final String WEBAPP_SCHEMA_LOCATION = "http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd";

    public static final String WEBAPP_PACKAGE = "com.wavemaker.tools.webapp.schema";

    private static JAXBContext jaxbContext;

    public static synchronized JAXBContext getJAXBContext() throws JAXBException {
        if (jaxbContext == null) {
            jaxbContext = JAXBContext.newInstance(WEBAPP_PACKAGE);
        }
        return jaxbContext;
    }

    public static WebAppType readWebXml(Resource webxmlFile) throws JAXBException, IOException {

        BufferedInputStream bis = null;

        try {
            bis = new BufferedInputStream(webxmlFile.getInputStream());
            return readWebXml(bis);
        } finally {
            try {
                bis.close();
            } catch (Exception ignore) {
            }
        }
    }

    public static WebAppType readWebXml(InputStream is) throws JAXBException {
        Unmarshaller unmarshaller = getJAXBContext().createUnmarshaller();
        JAXBElement<?> je = (JAXBElement<?>) unmarshaller.unmarshal(is);
        WebAppType wat = (WebAppType) je.getValue();
        return wat;
    }

    @Deprecated
    public static void writeWebXml(Project project, WebAppType webapp, File configFile) throws JAXBException, IOException {
        writeWebXml(webapp, project.getWriter(configFile));
    }

    public static void writeWebXml(WebAppType webapp, Writer os) throws JAXBException, IOException {

        ObjectFactory of = new ObjectFactory();
        JAXBElement<WebAppType> je = of.createWebApp(webapp);

        Marshaller marshaller = getJAXBContext().createMarshaller();
        marshaller.setProperty("jaxb.formatted.output", true);
        marshaller.setProperty("jaxb.schemaLocation", WEBAPP_SCHEMA_LOCATION);
        marshaller.marshal(je, os);
    }
}