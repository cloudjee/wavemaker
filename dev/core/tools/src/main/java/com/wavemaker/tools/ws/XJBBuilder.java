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
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import org.apache.tools.ant.BuildException;
import org.springframework.core.io.ClassPathResource;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.XMLUtils;
import com.wavemaker.common.util.XMLWriter;
import com.wavemaker.runtime.ws.util.Constants;
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

    public List<File> generate(File baseDir, boolean useDifferentPackage) throws GenerationException {
        List<File> jaxbBindingFiles = new ArrayList<File>();

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

    private List<File> generateSchemaBindingFiles(File baseDir, boolean useDifferentPackage) {
        List<File> jaxbBindingFiles = new ArrayList<File>();

        int schemaCount = 1;
        for (String schemaLocation : this.wsdl.getSchemas().keySet()) {
            jaxbBindingFiles.add(generateSchemaBindingFile(schemaLocation, schemaCount++, baseDir, useDifferentPackage));
        }

        return jaxbBindingFiles;
    }

    private File generateSchemaBindingFile(String schemaLocation, int schemaCount, File baseDir, boolean useDifferentPackage) {
        File bindingFile = new File(CodeGenUtils.getPackageDir(baseDir, this.wsdl.getPackageName()), this.wsdl.getServiceId() + schemaCount
            + Constants.JAXB_BINDING_FILE_EXT);

        if (this.wsdl.isNoOverwriteCustomizationFiles() && bindingFile.exists()) {
            return bindingFile;
        }

        PrintWriter pw = null;
        try {
            pw = new PrintWriter(new FileWriter(bindingFile));
        } catch (IOException ex) {
            throw new BuildException(ex);
        }

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

    private File generateGlobalBindingFile(File baseDir) {
        File globalBindingFile = new File(CodeGenUtils.getPackageDir(baseDir, this.wsdl.getPackageName()), Constants.JAXB_GLOBAL_BINDING_FILE);

        if (this.wsdl.isNoOverwriteCustomizationFiles() && globalBindingFile.exists()) {
            return globalBindingFile;
        }

        PrintWriter pw = null;
        try {
            globalBindingFile.getParentFile().mkdirs();
            pw = new PrintWriter(new FileWriter(globalBindingFile));
        } catch (IOException ex) {
            throw new BuildException(ex);
        }

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

    private File getSoapEncSchemaFile(File baseDir) throws GenerationException {
        try {
            File schemaFile = new File(CodeGenUtils.getPackageDir(baseDir, this.wsdl.getPackageName()), Constants.SOAP_ENCODING_SCHEMA_FILE);
            InputStream is = new ClassPathResource(SOAPENC_FILE_CLASSPATH).getInputStream();
            OutputStream os = new FileOutputStream(schemaFile);
            IOUtils.copy(is, os);
            return schemaFile;
        } catch (IOException e) {
            throw new GenerationException(e);
        }
    }
}
