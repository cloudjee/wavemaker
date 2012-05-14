/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this Resource except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.ws;

import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.Resource;

import com.wavemaker.runtime.ws.RESTInputParam;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.service.codegen.ServiceGenerator;
import com.wavemaker.tools.ws.wsdl.WSDL;
import com.wavemaker.tools.ws.wsdl.WSDLException;
import com.wavemaker.tools.ws.wsdl.WSDLManager;
import com.wavemaker.tools.io.Folder;

/**
 * Import Web Service.
 * 
 * @author Frankie Fu
 * @author Jeremy Grelle
 */
public class ImportWS {

    private Folder destDir;

    private String packageName;

    private boolean noOverwriteCustomizationFiles;

    private boolean skipInternalCustomization;

    private List<Resource> jaxbCustomizationFiles = new ArrayList<Resource>();

    private List<Resource> jaxwsCustomizationFiles = new ArrayList<Resource>();

    private String wsdlUri;

    private String serviceId;

    private String partnerName;

    public Folder getDestdir() {
        return this.destDir;
    }

    public void setDestdir(Folder destdir) {
        this.destDir = destdir;
    }

    public String getPackageName() {
        return this.packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public boolean isNoOverwriteCustomizationFiles() {
        return this.noOverwriteCustomizationFiles;
    }

    public void setNoOverwriteCustomizationFiles(boolean noOverwriteCustomizationFiles) {
        this.noOverwriteCustomizationFiles = noOverwriteCustomizationFiles;
    }

    public boolean isSkipInternalCustomization() {
        return this.skipInternalCustomization;
    }

    public void setSkipInternalCustomization(boolean skipInternalCustomization) {
        this.skipInternalCustomization = skipInternalCustomization;
    }

    public List<Resource> getJaxbCustomizationFiles() {
        return this.jaxbCustomizationFiles;
    }

    public void addJaxbCustomizationFile(Resource jaxbCustomizationFile) {
        this.jaxbCustomizationFiles.add(jaxbCustomizationFile);
    }

    public void setJaxbCustomizationFiles(List<Resource> jaxbCustomizationFiles) {
        this.jaxbCustomizationFiles = jaxbCustomizationFiles;
    }

    public List<Resource> getJaxwsCustomizationFiles() {
        return this.jaxwsCustomizationFiles;
    }

    public void addJaxwsCustomizationFile(Resource jaxwsCustomizationFile) {
        this.jaxwsCustomizationFiles.add(jaxwsCustomizationFile);
    }

    public void setJaxwsCustomizationFiles(List<Resource> jaxwsCustomizationFiles) {
        this.jaxwsCustomizationFiles = jaxwsCustomizationFiles;
    }

    public String getWsdlUri() {
        return this.wsdlUri;
    }

    public void setWsdlUri(String wsdlUri) {
        this.wsdlUri = wsdlUri;
    }

    public String getServiceId() {
        return this.serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getPartnerName() {
        return this.partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

    public WSDL generateServiceClass() {
        return generateServiceClass(null, null, null);
    }

    /**
     * Generates Java service class and beans for the specified WSDL files.
     * 
     * @param serviceAlias the alias of the service id
     * @return WSDL object.
     */
    public WSDL generateServiceClass(String serviceAlias, List<String> operationName_list, List<List<RESTInputParam>> inputs_list) {
        WSDL wsdl = null;
        try {
            wsdl = WSDLManager.processWSDL(this.wsdlUri, this.serviceId, operationName_list, inputs_list);
            if (this.packageName != null) {
                wsdl.setPackageName(this.packageName);
            }
        } catch (WSDLException e) {
            throw new ConfigurationException(e);
        }

        wsdl.setSkipInternalCustomization(this.skipInternalCustomization);
        wsdl.setJaxbCustomizationFiles(this.jaxbCustomizationFiles);
        wsdl.setJaxwsCustomizationFiles(this.jaxwsCustomizationFiles);
        wsdl.setServiceAlias(serviceAlias);

        GenerationConfiguration genConfig = new GenerationConfiguration(wsdl, this.destDir);
        genConfig.setPartnerName(this.partnerName);
        ServiceGenerator generator = new WebServiceFactory().getServiceGenerator(genConfig);

        try {
            generator.generate();
            return wsdl;
        } catch (GenerationException e) {
            throw new ConfigurationException(e);
        }
    }
}
