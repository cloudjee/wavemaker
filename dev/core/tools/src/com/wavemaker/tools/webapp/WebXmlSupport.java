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

package com.wavemaker.tools.webapp;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import com.wavemaker.tools.webapp.schema.ObjectFactory;
import com.wavemaker.tools.webapp.schema.WebAppType;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class WebXmlSupport {

    public static final String WEBAPP_SCHEMA_LOCATION =
        "http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd";

    public static final String WEBAPP_PACKAGE = "com.wavemaker.tools.webapp.schema";

    private static JAXBContext jaxbContext;

    public static synchronized JAXBContext getJAXBContext()
            throws JAXBException {
        if (jaxbContext == null) {
            jaxbContext = JAXBContext.newInstance(WEBAPP_PACKAGE);
        }
        return jaxbContext;
    }

    public static WebAppType readWebXml(String webxmlFile)
            throws JAXBException, IOException {
        return readWebXml(new File(webxmlFile));
    }

    public static WebAppType readWebXml(File webxmlFile)
            throws JAXBException, IOException {
        
        BufferedInputStream bis = null;

        try {
            bis = new BufferedInputStream(new FileInputStream(webxmlFile));
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
    
    public static void writeWebXml(WebAppType webapp, File configFile)
            throws JAXBException, IOException {
        
        BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(configFile));
        try {
            writeWebXml(webapp, bos);
        } finally {
            try {
                bos.close();
            } catch (Exception ignore) {}
        }
        
    }

    public static void writeWebXml(WebAppType webapp, OutputStream os)
            throws JAXBException, IOException {
        
        ObjectFactory of = new ObjectFactory();
        JAXBElement<WebAppType> je = of.createWebApp(webapp);
        
        Marshaller marshaller = getJAXBContext().createMarshaller();
        marshaller.setProperty("jaxb.formatted.output", true);
        marshaller.setProperty("jaxb.schemaLocation", WEBAPP_SCHEMA_LOCATION);
        marshaller.marshal(je, os);
    }
}