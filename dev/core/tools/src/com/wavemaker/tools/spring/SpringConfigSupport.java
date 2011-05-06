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

package com.wavemaker.tools.spring;

import java.io.File;
import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.io.Writer;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import com.wavemaker.tools.service.FileService;
import com.wavemaker.tools.spring.beans.Beans;

/**
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class SpringConfigSupport {

    public static final String SPRING_SCHEMA_LOCATION = "http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-2.0.xsd";

    public static final String SPRING_BEANS_PACKAGE = "com.wavemaker.tools.spring.beans";

    private static JAXBContext jaxbContext;

    public static synchronized JAXBContext getJAXBContext()
            throws JAXBException {
        if (jaxbContext == null) {
            jaxbContext = JAXBContext.newInstance(SPRING_BEANS_PACKAGE);
        }
        return jaxbContext;
    }

    public static Beans readBeans(String configFile) throws JAXBException, IOException {
        Reader reader = new StringReader(configFile);
        Beans ret = readBeans(new StringReader(configFile));
        reader.close();
        return ret;
    }
    
    public static Beans readBeans(File configFile, FileService fileService)
            throws JAXBException, IOException {
        Reader reader = fileService.getReader(configFile);
        Beans ret = readBeans(reader);
        reader.close();
        return ret;
    }
    
    public static Beans readBeans(Reader reader) throws JAXBException {
        Unmarshaller unmarshaller = getJAXBContext().createUnmarshaller();
        return (Beans) unmarshaller.unmarshal(reader);
    }

    public static void writeBeans(Beans beans, File configFile,
            FileService fileService) throws JAXBException, IOException {
        Writer writer = fileService.getWriter(configFile);
        writeBeans(beans, writer);
        writer.close();
    }
    
    /**
     * This writer should be initialized with an appropriate encoding, ideally
     * through a FileService.
     */
    public static void writeBeans(Beans beans, Writer writer)
            throws JAXBException, IOException {
        Marshaller marshaller = getJAXBContext().createMarshaller();
        marshaller.setProperty("jaxb.formatted.output", true);
        marshaller.setProperty("jaxb.schemaLocation", SPRING_SCHEMA_LOCATION);
        marshaller.setProperty("com.sun.xml.bind.namespacePrefixMapper",
                new BeansNamespaceMapper());
        marshaller.marshal(beans, writer);
    }
}
