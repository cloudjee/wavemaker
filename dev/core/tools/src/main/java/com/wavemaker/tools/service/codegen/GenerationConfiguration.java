/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.service.codegen;

import org.springframework.core.io.Resource;

import com.wavemaker.runtime.service.definition.DeprecatedServiceDefinition;

/**
 * Contains generic configurations used by <code>ServiceGenerator</code> to
 * generate service stubs.
 * 
 * @author Frankie Fu
 * @author Jeremy Grelle
 */
public class GenerationConfiguration {

    private DeprecatedServiceDefinition serviceDefinition;

    private Resource outputDirectory;

    private String partnerName;

    public GenerationConfiguration(DeprecatedServiceDefinition serviceDefinition,
            Resource outputDirectory) {
        this.serviceDefinition = serviceDefinition;
        this.outputDirectory = outputDirectory;
    }

    public DeprecatedServiceDefinition getServiceDefinition() {
        return serviceDefinition;
    }

    public void setServiceDefinition(DeprecatedServiceDefinition serviceDefinition) {
        this.serviceDefinition = serviceDefinition;
    }

    public Resource getOutputDirectory() {
        return outputDirectory;
    }

    public void setOuputDirectory(Resource outputDirectory) {
        this.outputDirectory = outputDirectory;
    }

    public String getPartnerName() {
        return partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

}
