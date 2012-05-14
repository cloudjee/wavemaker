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

package com.wavemaker.tools.ws.jaxws;

import java.io.File;
import java.io.PrintWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.tools.ant.Project;
import org.apache.tools.ant.types.FileSet;

import com.sun.tools.ws.ant.WsImport2;
import com.sun.xml.bind.api.JAXBRIContext;
import com.sun.xml.bind.api.impl.NameConverter;
import com.wavemaker.common.util.XMLUtils;
import com.wavemaker.common.util.XMLWriter;
import com.wavemaker.runtime.ws.util.Constants;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.ws.CodeGenUtils;
import com.wavemaker.tools.ws.wsdl.PortTypeInfo;
import com.wavemaker.tools.ws.wsdl.ServiceInfo;
import com.wavemaker.tools.ws.wsdl.WSDL;

/**
 * Generates service client files.
 * 
 * @author Frankie Fu
 */
public class JAXWSBuilder {

    private final static String SEI_CLASS_NAME_SUFFIX = "Soap";

    private final WSDL wsdl;

    protected final Folder outputSrcDir;

    protected final Folder outputClassDir;

    private final List<JAXWSServiceInfo> serviceInfoList = new ArrayList<JAXWSServiceInfo>();

    protected File tempOutputSrcDir;

    protected File tempOutputClassDir;

    protected File tempjaxwsDir;

    public JAXWSBuilder(WSDL wsdl, Folder outputSrcDir, Folder outputClassDir) {
        this.wsdl = wsdl;
        this.outputSrcDir = outputSrcDir;
        this.outputClassDir = outputClassDir;

        for (ServiceInfo sInfo : wsdl.getServiceInfoList()) {
            this.serviceInfoList.add(generateJAXWSServiceInfo(sInfo, wsdl));
        }

        createTempOutputDirs();
    }

    public List<JAXWSServiceInfo> getServiceInfoList() {
        return this.serviceInfoList;
    }

    /**
     * Generates necessary client files for SOAP service. This will generate JAXWS binding file and service client Java
     * files, including JAXB Java files.
     * 
     * @param jaxbBindingFiles A list of JAXB binding files to be used for code generation.
     * @throws GenerationException
     */
    public void generate(List<com.wavemaker.tools.io.File> jaxbBindingFiles) throws GenerationException {
        com.wavemaker.tools.io.File jaxwsBindingFile = generateJAXWSBindingFile();
        generate(jaxwsBindingFile, jaxbBindingFiles);
    }

    private void generate(com.wavemaker.tools.io.File jaxwsBindingFile, List<com.wavemaker.tools.io.File> jaxbBindingFiles)
        throws GenerationException {
        String wsdlUri = this.wsdl.getURI();

        WsImport2 wsImport = new WsImport2();
        wsImport.setProject(new Project());
        setOutputDir(wsImport);
        wsImport.createXjcarg().setValue("-Xcollection-setter-injector"); // generate setter methods for Collection
                                                                          // based properties
        wsImport.createXjcarg().setValue("-Xboolean-getter"); // replace isXXX with getXXX for Boolean type properties
        wsImport.createXjcarg().setValue("-npa"); // suppress generation of package level annotations
        wsImport.setKeep(true);
        wsImport.setQuiet(true);
        wsImport.setXnocompile(true);

        // set wsdlLocation only if the WSDL's URI is a file and the WSDL file
        // is in the direcotry relative to the output package directory
        String wsdlFileName = getFileNameFromURI(wsdlUri);
        if (wsdlFileName != null) {
            com.wavemaker.tools.io.File f = CodeGenUtils.getPackageFolder(this.outputSrcDir, this.wsdl.getPackageName()).getFile(wsdlFileName);
            if (f.exists()) {
                wsImport.setWsdllocation(wsdlFileName);
            }
        }

        setConfigBinding(wsImport, jaxwsBindingFile, jaxbBindingFiles);

        // set WSDL file to be used to generate client-side artifacts
        wsImport.setWsdl(wsdlUri);

        try {
            wsImport.execute();
        } catch (Exception e) {
            throw new GenerationException(e);
        }

        copyToFinalDest();
    }

    /**
     * Generates JAXWS binding customization file.
     * 
     * @return The JAXWS binding customization file.
     */
    private com.wavemaker.tools.io.File generateJAXWSBindingFile() {
        com.wavemaker.tools.io.File bindingFile = CodeGenUtils.getPackageFolder(this.outputSrcDir, this.wsdl.getPackageName()).getFile(
            this.wsdl.getServiceId() + Constants.JAXWS_BINDING_FILE_EXT);
        PrintWriter pw = null;
        pw = new PrintWriter(bindingFile.getContent().asOutputStream());

        XMLWriter xw = XMLUtils.newXMLWriter(pw);
        xw.addVersion();
        xw.addNamespace("xsd", Constants.XSD_NS);
        xw.addNamespace("wsdl", Constants.WSDL11_NS);
        xw.addNamespace("jws", Constants.JAVAEE_NS);
        xw.addNamespace("jaxws", Constants.JAXWS_NS);

        // root bindings element
        xw.setCurrentShortNS("jaxws");
        xw.addElement("bindings");
        xw.addAttribute("wsdlLocation", this.wsdl.getURI());

        // specify Java package name to be used for the generated service classes
        xw.addElement("package");
        xw.addAttribute("name", this.wsdl.getPackageName());
        xw.closeElement();

        // disable Wrapper style
        xw.addElement("enableWrapperStyle", "false");

        for (JAXWSServiceInfo serviceInfo : this.serviceInfoList) {
            // change JAXWS generated service client (@WebServiceClient) class name
            xw.addElement("bindings");
            xw.addAttribute("node", "wsdl:definitions/wsdl:service[@name='" + serviceInfo.getName() + "']");
            xw.addElement("class");
            xw.addAttribute("name", serviceInfo.getServiceClientClassName());
            xw.closeElement();
            xw.closeElement();

            for (JAXWSPortTypeInfo portTypeInfo : serviceInfo.getPortTypeInfoList()) {
                // if the JAXWS generated service (@WebService) class name was modified,
                // need to setup additional binding to tell JAXWS to use the new class
                // name during wsimport.
                if (portTypeInfo.isSeiClassNameModified()) {
                    xw.addElement("bindings");
                    xw.addAttribute("node", "wsdl:definitions/wsdl:portType[@name='" + portTypeInfo.getName() + "']");
                    xw.addElement("class");
                    xw.addAttribute("name", portTypeInfo.getSeiClassName());
                    xw.closeElement();
                    xw.closeElement();
                }
            }
        }

        // add handler(s) to do additional processing of the inbound and
        // outbound messages
        List<String> handlerClassNames = this.wsdl.getInterceptorClassNames();
        if (handlerClassNames != null && !handlerClassNames.isEmpty()) {
            xw.addElement("bindings");
            xw.addAttribute("node", "wsdl:definitions");
            xw.setCurrentShortNS("jws");
            xw.addElement("handler-chains");
            xw.addElement("handler-chain");
            for (String handlerClassName : handlerClassNames) {
                xw.addElement("handler");
                xw.addElement("handler-class", handlerClassName);
                xw.closeElement();
                xw.closeElement();
            }
        }

        xw.finish();
        pw.close();

        return bindingFile;
    }

    /**
     * Returns the Java method name for the specific operation name.
     * 
     * @param operationName The operation name to be converted.
     * @return Method name according to JAXWS generated service class format.
     */
    public static String getJavaMethodName(String operationName) {
        return NameConverter.standard.toVariableName(operationName);
    }

    /**
     * Returns the JAXWS generated Java class name. The returned name does not include the package portion.
     * 
     * @param localName The local name.
     * @return The JAXWS generated Java class name.
     */
    public static String getJaxwsGeneratedClassName(String localName) {
        return JAXBRIContext.mangleNameToClassName(localName);
    }

    /**
     * Returns the file name given the URI string. If the given URI's scheme is not "file", then null is returned.
     * 
     * @param uriString The URI string.
     * @return The file name.
     */
    private String getFileNameFromURI(String uriString) {
        try {
            URI uri = new URI(uriString);
            if (uri.getScheme().equals("file")) {
                File f = new File(uri);
                return f.getName();
            }
        } catch (URISyntaxException e1) {
        }
        return null;
    }

    private static JAXWSServiceInfo generateJAXWSServiceInfo(ServiceInfo serviceInfo, WSDL wsdl) {
        List<JAXWSPortTypeInfo> portTypeInfoList = new ArrayList<JAXWSPortTypeInfo>();
        for (PortTypeInfo portTypeInfo : serviceInfo.getPortTypeInfoList()) {
            portTypeInfoList.add(generateJAXWSPortTypeInfo(portTypeInfo, wsdl));
        }
        return new JAXWSServiceInfo(serviceInfo, wsdl.getPackageName(), portTypeInfoList);
    }

    private static JAXWSPortTypeInfo generateJAXWSPortTypeInfo(PortTypeInfo portTypeInfo, WSDL wsdl) {
        String seiClassName = JAXWSBuilder.getJaxwsGeneratedClassName(portTypeInfo.getName());
        boolean isSeiClassNameModified = false;
        // check if there is any class name collision
        if (wsdl.getServiceClassName().equals(seiClassName)) {
            isSeiClassNameModified = true;
            seiClassName = seiClassName + SEI_CLASS_NAME_SUFFIX;
        }

        return new JAXWSPortTypeInfo(portTypeInfo, seiClassName, wsdl.getPackageName(), isSeiClassNameModified);
    }

    public static Set<String> getGeneratedSeiClasses(WSDL wsdl) {
        Set<String> seiClasses = new HashSet<String>();
        for (ServiceInfo sInfo : wsdl.getServiceInfoList()) {
            JAXWSServiceInfo serviceInfo = generateJAXWSServiceInfo(sInfo, wsdl);
            for (JAXWSPortTypeInfo portTypeInfo : serviceInfo.getPortTypeInfoList()) {
                seiClasses.add(portTypeInfo.getSeiFQClassName());
            }
        }
        return seiClasses;
    }

    protected void createTempOutputDirs() {
    }

    protected void setOutputDir(WsImport2 wsImport) throws GenerationException {
        wsImport.setSourcedestdir((File) this.outputSrcDir.getOriginalResource());
        wsImport.setDestdir((File) this.outputClassDir.getOriginalResource());
    }

    protected void setConfigBinding(WsImport2 wsImport, com.wavemaker.tools.io.File jaxwsBindingFile,
        List<com.wavemaker.tools.io.File> jaxbBindingFiles) throws GenerationException {
        FileSet fs = new FileSet();
        fs.setFile((File) jaxwsBindingFile.getOriginalResource());
        wsImport.addConfiguredBinding(fs);

        // set JAXB bindings
        for (com.wavemaker.tools.io.File jaxbBindingFile : jaxbBindingFiles) {
            fs = new FileSet();
            fs.setFile((File) jaxbBindingFile.getOriginalResource());
            wsImport.addConfiguredBinding(fs);
        }
    }

    protected void copyToFinalDest() {
    }
}
