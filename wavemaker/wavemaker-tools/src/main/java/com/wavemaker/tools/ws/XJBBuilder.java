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

package com.wavemaker.tools.ws;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.ClassPathResource;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.XMLUtils;
import com.wavemaker.common.util.XMLWriter;
import com.wavemaker.runtime.ws.util.Constants;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.ws.wsdl.WSDL;

/**
 * Generates JAXB binding customization files.
 * 
 * @author Frankie Fu
 */
public class XJBBuilder {

    private static final String[] XML_DATE_TYPES = new String[] { "xs:date", "xs:dateTime", "xs:time" };

    private static final String SOAPENC_FILE_CLASSPATH = "com/wavemaker/tools/ws/soapenc.xsd";

    private final WSDL wsdl;

    public XJBBuilder(WSDL wsdl) {
        this.wsdl = wsdl;
    }

    public List<com.wavemaker.tools.io.File> generate(Folder baseDir, boolean useDifferentPackage) throws GenerationException {
        List<com.wavemaker.tools.io.File> jaxbBindingFiles = new ArrayList<com.wavemaker.tools.io.File>();

        jaxbBindingFiles.add(generateGlobalBindingFile(baseDir));
        jaxbBindingFiles.addAll(generateSchemaBindingFiles(baseDir, useDifferentPackage));

        // if one of the schema imports SOAP Encoding (http://schemas.xmlsoap.org/soap/encoding/),
        // usually using it as type soapenc:Array, then we have tell the XJC where
        // to locate the SOAP encoding schema.
        if (this.wsdl.getImportedNoRefSchemas().contains(Constants.SOAP_ENCODING_NS)) {
            jaxbBindingFiles.add(getSoapEncSchemaFile(baseDir));
        }

        return jaxbBindingFiles;
    }

    private List<com.wavemaker.tools.io.File> generateSchemaBindingFiles(Folder baseDir, boolean useDifferentPackage) {
        List<com.wavemaker.tools.io.File> jaxbBindingFiles = new ArrayList<com.wavemaker.tools.io.File>();

        int schemaCount = 1;
        for (String schemaLocation : this.wsdl.getSchemas().keySet()) {
            jaxbBindingFiles.add(generateSchemaBindingFile(schemaLocation, schemaCount++, baseDir, useDifferentPackage));
        }

        return jaxbBindingFiles;
    }

    private com.wavemaker.tools.io.File generateSchemaBindingFile(String schemaLocation, int schemaCount, Folder baseDir, boolean useDifferentPackage) {
        com.wavemaker.tools.io.File bindingFile = CodeGenUtils.getPackageFolder(baseDir, this.wsdl.getPackageName()).getFile(
            this.wsdl.getServiceId() + schemaCount + Constants.JAXB_BINDING_FILE_EXT);

        if (this.wsdl.isNoOverwriteCustomizationFiles() && bindingFile.exists()) {
            return bindingFile;
        }

        PrintWriter pw = new PrintWriter(bindingFile.getContent().asOutputStream());

        XMLWriter xw = XMLUtils.newXMLWriter(pw);
        xw.addVersion();
        xw.addNamespace("xsd", Constants.XSD_NS);
        xw.addNamespace("jaxb", Constants.JAXB_NS);

        // root bindings element
        xw.setCurrentShortNS("jaxb");
        xw.addElement("bindings");
        xw.addAttribute("version", "2.0");
        xw.addElement("bindings");
        xw.addAttribute("schemaLocation", schemaLocation);
        xw.addAttribute("node", "//xsd:schema[1]");

        xw.addElement("schemaBindings");

        // specify Java package name to be used for this schema
        xw.addElement("package");
        String pkgName = this.wsdl.getPackageName();
        if (useDifferentPackage && schemaCount > 1) {
            pkgName = pkgName + "." + "schema" + schemaCount;
        }
        xw.addAttribute("name", pkgName);
        xw.closeElement();

        // appending a suffix "Type" to all ComplexType Java class. This is
        // to avoid name conflicts between named type definitions and global
        // element declarations.
        xw.addElement("nameXmlTransform");
        xw.addElement("typeName");
        xw.addAttribute("suffix", "Type");

        xw.finish();
        pw.close();

        return bindingFile;
    }

    private com.wavemaker.tools.io.File generateGlobalBindingFile(Folder baseDir) {
        com.wavemaker.tools.io.File globalBindingFile = CodeGenUtils.getPackageFolder(baseDir, this.wsdl.getPackageName()).getFile(
            Constants.JAXB_GLOBAL_BINDING_FILE);

        if (this.wsdl.isNoOverwriteCustomizationFiles() && globalBindingFile.exists()) {
            return globalBindingFile;
        }

        globalBindingFile.getParent().createIfMissing();
        PrintWriter pw = new PrintWriter(globalBindingFile.getContent().asOutputStream());

        XMLWriter xw = XMLUtils.newXMLWriter(pw);
        xw.addVersion();
        xw.addNamespace("jaxb", Constants.JAXB_NS);
        xw.addNamespace("xjc", Constants.XJC_NS);
        xw.addNamespace("xs", Constants.XSD_NS);

        // root bindings element
        xw.setCurrentShortNS("jaxb");
        xw.addElement("bindings");
        xw.addAttribute("jaxb:version", "2.0");
        xw.addAttribute("jaxb:extensionBindingPrefixes", "xjc");

        // globalBindings element
        xw.addElement("globalBindings");

        // generate an alternate developer friendly but lossy binding; JAXB
        // will try to eliminate the generation of JAXBElement, but can't
        // eliminate JAXBElement completely. There are still certain situations
        // where it cannot be removed.
        xw.addAttribute("generateElementProperty", "false");

        // provide the simpler and better binding mode.
        // http://weblogs.java.net/blog/kohsuke/archive/2006/03/simple_and_bett.html
        xw.setCurrentShortNS("xjc");
        xw.addElement("simple");
        xw.closeElement();

        // use java.util.Date instead of the default XMLGregorianCalendar for
        // xs:date, xs:dateTime and xs:time
        xw.setCurrentShortNS("xjc");
        for (String xmlType : XML_DATE_TYPES) {
            xw.addElement("javaType");
            xw.addAttribute("name", "java.util.Date");
            xw.addAttribute("xmlType", xmlType);
            xw.addAttribute("adapter", "com.wavemaker.runtime.ws.jaxb.DateXmlAdapter");
            xw.closeElement();
        }

        xw.finish();
        pw.close();

        return globalBindingFile;
    }

    private com.wavemaker.tools.io.File getSoapEncSchemaFile(Folder baseDir) throws GenerationException {
        try {
            com.wavemaker.tools.io.File schemaFile = CodeGenUtils.getPackageFolder(baseDir, this.wsdl.getPackageName()).getFile(
                Constants.SOAP_ENCODING_SCHEMA_FILE);
            InputStream is = new ClassPathResource(SOAPENC_FILE_CLASSPATH).getInputStream();
            OutputStream os = schemaFile.getContent().asOutputStream();
            IOUtils.copy(is, os);
            return schemaFile;
        } catch (IOException e) {
            throw new GenerationException(e);
        }
    }
}
