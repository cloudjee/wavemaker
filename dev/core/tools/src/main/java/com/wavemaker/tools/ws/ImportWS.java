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
import java.util.ArrayList;
import java.util.List;

import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.service.codegen.ServiceGenerator;
import com.wavemaker.tools.ws.wsdl.WSDL;
import com.wavemaker.tools.ws.wsdl.WSDLException;
import com.wavemaker.tools.ws.wsdl.WSDLManager;

/**
 * Import Web Service.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class ImportWS {

    private File destDir;
    
    private String packageName;

    private boolean noOverwriteCustomizationFiles;

    private boolean skipInternalCustomization;

    private List<File> jaxbCustomizationFiles = new ArrayList<File>();

    private List<File> jaxwsCustomizationFiles = new ArrayList<File>();

    private String wsdlUri;
    
    private String serviceId;

    private String partnerName;

    public ImportWS() {
    }

    public File getDestdir() {
        return destDir;
    }

    public void setDestdir(File destdir) {
        this.destDir = destdir;
    }
    
    public String getPackageName() {
        return packageName;
    }
    
    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public boolean isNoOverwriteCustomizationFiles() {
        return noOverwriteCustomizationFiles;
    }

    public void setNoOverwriteCustomizationFiles(boolean noOverwriteCustomizationFiles) {
        this.noOverwriteCustomizationFiles = noOverwriteCustomizationFiles;
    }

    public boolean isSkipInternalCustomization() {
        return skipInternalCustomization;
    }

    public void setSkipInternalCustomization(boolean skipInternalCustomization) {
        this.skipInternalCustomization = skipInternalCustomization;
    }

    public List<File> getJaxbCustomizationFiles() {
        return jaxbCustomizationFiles;
    }

    public void addJaxbCustomizationFile(File jaxbCustomizationFile) {
        this.jaxbCustomizationFiles.add(jaxbCustomizationFile);
    }

    public void setJaxbCustomizationFiles(List<File> jaxbCustomizationFiles) {
        this.jaxbCustomizationFiles = jaxbCustomizationFiles;
    }

    public List<File> getJaxwsCustomizationFiles() {
        return jaxwsCustomizationFiles;
    }

    public void addJaxwsCustomizationFile(File jaxwsCustomizationFile) {
        this.jaxwsCustomizationFiles.add(jaxwsCustomizationFile);
    }

    public void setJaxwsCustomizationFiles(List<File> jaxwsCustomizationFiles) {
        this.jaxwsCustomizationFiles = jaxwsCustomizationFiles;
    }

    public String getWsdlUri() {
        return wsdlUri;
    }

    public void setWsdlUri(String wsdlUri) {
        this.wsdlUri = wsdlUri;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

     public String getPartnerName() {
        return partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

    public void parseArguments(String[] args) {
        for (int i = 0; i < args.length; i++) {
            if (args[i].length() == 0) {
                throw new ConfigurationException("Empty argument.");
            }
            if (args[i].charAt(0) == '-') {
                int j = parseArguments(args, i);
                if (j == 0) {
                    throw new ConfigurationException(
                            "Unrecognized argument " + args[i]);
                }
                i += (j-1);
            } else {
                File wsdlFile = new File(args[i]);
                if (!wsdlFile.exists()) {
                    throw new ConfigurationException("This file was not found: "
                            + wsdlFile.toString());
                }
                setWsdlUri(wsdlFile.toURI().toString());
            }
        }
    }
    
    protected int parseArguments(String[] args, int i) {
        if (args[i].equals("-d")) {
            destDir = new File(requireArgument("-d", args, ++i));
            return 2;
        } else if (args[i].equals("-p")) {
            packageName = requireArgument("-p", args, ++i);
            return 2;
        } else if (args[i].equals("-noOverwriteCustomization")) {
            noOverwriteCustomizationFiles = true;
            return 2;
        } else if (args[i].equals("-skipInternalCustomization")) {
            skipInternalCustomization = true;
            return 2;
        } else if (args[i].equals("-jaxb")) {
            this.addJaxbCustomizationFile(new File(requireArgument("-jaxb", args, ++i)));
            return 2;
        } else if (args[i].equals("-jaxws")) {
            this.addJaxwsCustomizationFile(new File(requireArgument("-jaxws", args, ++i)));
            return 2;
        }
        if (destDir == null) {
            destDir = new File(".");
        }
        return 0;
    }
    
    public String requireArgument(String optionName, String[] args, int i) {
        if (args[i].startsWith("-")) {
            throw new ConfigurationException(
                    "Missing option argument " + args[i]);
        }
        return args[i];
    }
    
    /**
     * Generates Java service class and beans for the specified WSDL files.
     * 
     * @return WSDL object.
     */
    public WSDL generateServiceClass() {
        WSDL wsdl = null;
        try {
            wsdl = WSDLManager.processWSDL(wsdlUri, serviceId);
            if (packageName != null) {
                wsdl.setPackageName(packageName);
            }
        } catch (WSDLException e) {
            throw new ConfigurationException(e);
        }
        
        wsdl.setSkipInternalCustomization(skipInternalCustomization);
        wsdl.setJaxbCustomizationFiles(jaxbCustomizationFiles);
        wsdl.setJaxwsCustomizationFiles(jaxwsCustomizationFiles);

        GenerationConfiguration genConfig = new GenerationConfiguration(wsdl,
                destDir);
        genConfig.setPartnerName(partnerName);
        ServiceGenerator generator = (new WebServiceFactory())
                .getServiceGenerator(genConfig);

        try {
            generator.generate();
            return wsdl;
        } catch (GenerationException e) {
            throw new ConfigurationException(e);
        }
    }
    
    public void run(String[] args) {
        parseArguments(args);
        generateServiceClass();
    }
    
    public static void usage(Class<?> mainClazz) {
        System.out.println("");
        System.out.println("Usage: " + mainClazz.getSimpleName() + " [options] <WSDL URI>");
        System.out.println("where [options] include:");
        System.out.println("-d <directory>            Specify where to place generated output files. Default is the current directory.");
        System.out.println("-p <pkg>                  Specifies the target package. This will override the default package name algorithm based on the namesapce.");
    }

}
