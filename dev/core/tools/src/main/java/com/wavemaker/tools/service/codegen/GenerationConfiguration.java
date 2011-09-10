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

import java.io.File;

import com.wavemaker.runtime.service.definition.DeprecatedServiceDefinition;

/**
 * Contains generic configurations used by <code>ServiceGenerator</code> to
 * generate service stubs.
 * 
 * @author Frankie Fu
 */
public class GenerationConfiguration {

    private DeprecatedServiceDefinition serviceDefinition;

    private File outputDirectory;

    private String partnerName;

    public GenerationConfiguration(DeprecatedServiceDefinition serviceDefinition,
            File outputDirectory) {
        this.serviceDefinition = serviceDefinition;
        this.outputDirectory = outputDirectory;
    }

    public DeprecatedServiceDefinition getServiceDefinition() {
        return serviceDefinition;
    }

    public void setServiceDefinition(DeprecatedServiceDefinition serviceDefinition) {
        this.serviceDefinition = serviceDefinition;
    }

    public File getOutputDirectory() {
        return outputDirectory;
    }

    public void setOuputDirectory(File outputDirectory) {
        this.outputDirectory = outputDirectory;
    }

    public String getPartnerName() {
        return partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

}
