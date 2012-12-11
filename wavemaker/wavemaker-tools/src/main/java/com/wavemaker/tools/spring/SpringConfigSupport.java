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

package com.wavemaker.tools.spring;

import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.io.Writer;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.spring.beans.Beans;

/**
 * @author Frankie Fu
 * @author Jeremy Grelle
 * @author Edward Callahan
 */
public class SpringConfigSupport {

    public static final String SPRING_SCHEMA_LOCATION = "http://schema.cloudfoundry.org/spring http://schema.cloudfoundry.org/spring/cloudfoundry-spring-0.8.xsd http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd";

    public static final String SPRING_SECURITY_LOCATION = "http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security-3.1.xsd>";

    public static final String SECURITY_PACKAGE = "com.wavemaker.tools.spring.beans:com.wavemaker.tools.security.schema";

    public static final String SPRING_BEANS_PACKAGE = "com.wavemaker.tools.spring.beans";

    private static JAXBContext jaxbContext;
    
    private static JAXBContext jaxbSecurityContext;

    public static synchronized JAXBContext getJAXBContext() throws JAXBException {
        if (jaxbContext == null) {
            jaxbContext = JAXBContext.newInstance(SPRING_BEANS_PACKAGE);
        }
        return jaxbContext;
    }

    public static synchronized JAXBContext getJAXBSecurityContext() throws JAXBException {
        if (jaxbSecurityContext == null) {
        	jaxbSecurityContext = JAXBContext.newInstance(SECURITY_PACKAGE);
        }
        return jaxbSecurityContext;
    }
    
    public static Beans readBeans(String configFile) throws JAXBException, IOException {
        Reader reader = new StringReader(configFile);
        Beans ret = readBeans(new StringReader(configFile));
        reader.close();
        return ret;
    }

    public static Beans readSecurityBeans(String configFile) throws JAXBException, IOException {
        Reader reader = new StringReader(configFile);
        Beans ret = readSecurityBeans(new StringReader(configFile));
        reader.close();
        return ret;
    }
    
    public static Beans readBeans(File configFile) throws JAXBException, IOException {
        Reader reader = configFile.getContent().asReader();
        try {
            return readBeans(reader);
        } finally {
            reader.close();
        }
    }

    public static Beans readSecurityBeans(File secXmlFile) throws JAXBException, IOException {
    	Reader reader = secXmlFile.getContent().asReader();
        try {
            return readSecurityBeans(reader);
        } finally {
            try {
                reader.close();
            } catch (Exception ignore) {
            }
        }
    }
    
    public static Beans readBeans(Reader reader) throws JAXBException {
        Unmarshaller unmarshaller = getJAXBContext().createUnmarshaller();
        return (Beans) unmarshaller.unmarshal(reader);
    }

    public static Beans readSecurityBeans(Reader reader) throws JAXBException {
        Unmarshaller unmarshaller = getJAXBSecurityContext().createUnmarshaller();
        return (Beans) unmarshaller.unmarshal(reader);
    }
    
    public static void writeBeans(Beans beans, File file) throws JAXBException, IOException {
        Writer writer = file.getContent().asWriter();
        try {
            writeBeans(beans, writer);
        } finally {
            writer.close();
        }
    }
    
    public static void writeSecurityBeans(Beans beans, File file) throws JAXBException, IOException {
        Writer writer = file.getContent().asWriter();
        try {
            writeSecurityBeans(beans, writer);
        } finally {
            writer.close();
        }
    }
    
    public static void writeBeans(Beans beans, Writer writer) throws JAXBException, IOException {
        Marshaller marshaller = getJAXBContext().createMarshaller();
        marshaller.setProperty("jaxb.formatted.output", true);
        marshaller.setProperty("jaxb.schemaLocation", SPRING_SCHEMA_LOCATION);
        marshaller.setProperty("com.sun.xml.bind.namespacePrefixMapper", new BeansNamespaceMapper());
        marshaller.marshal(beans, writer);
    }
    
    public static void writeSecurityBeans(Beans beans, Writer writer) throws JAXBException, IOException {
        Marshaller marshaller = getJAXBSecurityContext().createMarshaller();
        marshaller.setProperty("jaxb.formatted.output", true);
        marshaller.setProperty("jaxb.schemaLocation", SPRING_SECURITY_LOCATION);
        marshaller.setProperty("com.sun.xml.bind.namespacePrefixMapper", new BeansNamespaceMapper());
        marshaller.marshal(beans, writer);
    }
}
