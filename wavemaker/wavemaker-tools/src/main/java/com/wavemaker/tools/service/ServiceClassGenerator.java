/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.io.Resource;
import org.springframework.util.Assert;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.definition.DeprecatedServiceDefinition;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.service.codegen.ServiceGenerator;

/**
 * Generic logic for generating Service Classes from Service Definitions.
 * 
 * @author Simon Toens
 * @author Jeremy Grelle
 */
public class ServiceClassGenerator {

    private final Log logger = LogFactory.getLog(ServiceClassGenerator.class);

    private final List<ServiceDetail> serviceDetails = new ArrayList<ServiceDetail>();

    private Resource outputDirectory = null;

    private DesignServiceManager serviceManager = null;

    public void setDesignServiceManager(DesignServiceManager serviceManager) {
        this.serviceManager = serviceManager;
    }

    public void setOutputDirectory(Resource outputDirectory) {
        this.outputDirectory = outputDirectory;
    }

    public void addServiceFiles(List<ServiceFile> serviceFiles, String serviceId) {
        for (ServiceFile f : serviceFiles) {
            addService(f, serviceId);
        }
    }

    private void addService(ServiceFile serviceFile, String serviceId) {
        Assert.notNull(serviceId, "ServiceId must not be null");
        this.serviceDetails.add(new ServiceDetail(serviceFile, serviceId));
    }

    public void run() {
        if (this.serviceManager == null) {
            throw new ConfigurationException("serviceManager cannot be null");
        }

        for (ServiceDetail serviceDetail : this.serviceDetails) {
            String serviceId = serviceDetail.getServiceId();
            ServiceFile serviceFile = serviceDetail.getServiceFile();

            DeprecatedServiceDefinition def = ServiceUtils.getServiceDefinition(serviceFile, serviceId, this.serviceManager);

            if (def != null) {
                GenerationConfiguration cfg = new GenerationConfiguration(def, this.outputDirectory);
                ServiceGenerator generator = ServiceUtils.getServiceGenerator(cfg);

                Resource serviceRuntimeDirectory = this.serviceManager.getServiceRuntimeDirectory(serviceId);
                long lastModified;
                try {
                    lastModified = serviceRuntimeDirectory.lastModified();
                } catch (IOException ex) {
                    throw new WMRuntimeException(ex);
                }
                if (generator.isUpToDate(lastModified)) {
                    if (this.logger.isInfoEnabled()) {
                        this.logger.info("service " + def.getServiceId() + " is up to date");
                    }
                    continue;
                } else {
                    if (this.logger.isInfoEnabled()) {
                        this.logger.info("service " + def.getServiceId() + " needs to be re-generated");
                    }
                }

                try {
                    Project project = this.serviceManager.getProjectManager().getCurrentProject();
                    File smdFile = ConfigurationCompiler.getSmdFile(project, serviceId);
                    String smdContent = smdFile.getContent().asString();
                    generator.setSmdContent(smdContent);
                    generator.generate();
                } catch (GenerationException ex) {
                    throw new WMRuntimeException(ex);
                } finally {
                    try {
                        def.dispose();
                    } catch (RuntimeException ex) {
                        this.logger.warn("Error while cleaning up", ex);
                    }
                }
            }
        }
    }

    private static class ServiceDetail {

        private final ServiceFile serviceFile;

        private final String serviceId;

        public ServiceDetail(ServiceFile serviceFile, String serviceId) {
            super();
            this.serviceFile = serviceFile;
            this.serviceId = serviceId;
        }

        public ServiceFile getServiceFile() {
            return this.serviceFile;
        }

        public String getServiceId() {
            return this.serviceId;
        }
    }
}
