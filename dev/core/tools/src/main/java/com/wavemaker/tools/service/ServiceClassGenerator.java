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

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.definition.DeprecatedServiceDefinition;
import com.wavemaker.tools.common.ConfigurationException;
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

    private final List<Resource> services = new ArrayList<Resource>();

    // map service file to its service id
    private final Map<Resource, String> serviceToServiceId = new HashMap<Resource, String>();

    private Resource outputDirectory = null;

    private DesignServiceManager serviceManager = null;

    public void setDesignServiceManager(DesignServiceManager serviceManager) {
        this.serviceManager = serviceManager;
    }

    public void setOutputDirectory(Resource outputDirectory) {
        this.outputDirectory = outputDirectory;
    }

    public void addService(List<Resource> serviceFiles) {
        addService(serviceFiles, null);
    }

    public void addService(List<Resource> serviceFiles, String serviceId) {
        for (Resource f : serviceFiles) {
            addService(f, serviceId);
        }
    }

    /**
     * @deprecated - use {@link #addService(List, String) addService} instead
     */
    @Deprecated
    public void addServiceFiles(List<File> serviceFiles, String serviceId) {
        for (File f : serviceFiles) {
            addService(new FileSystemResource(f), serviceId);
        }
    }

    public void addService(Resource f) {
        addService(f, null);
    }

    public void addService(Resource f, String serviceId) {
        this.services.add(f);
        if (serviceId != null) {
            this.serviceToServiceId.put(f, serviceId);
        }
    }

    public void run() {

        if (this.serviceManager == null) {
            throw new ConfigurationException("serviceMgr cannot be null");
        }

        for (Resource f : this.services) {

            String serviceId = this.serviceToServiceId.get(f);

            DeprecatedServiceDefinition def = ServiceUtils.getServiceDefinition(f, serviceId, this.serviceManager);

            if (null == def) {
                continue;
            }

            GenerationConfiguration cfg = new GenerationConfiguration(def, this.outputDirectory);

            ServiceGenerator generator = ServiceUtils.getServiceGenerator(cfg);

            Resource rtdir = this.serviceManager.getServiceRuntimeDirectory(serviceId);
            long l;
            try {
                l = rtdir.lastModified();
            } catch (IOException ex) {
                throw new WMRuntimeException(ex);
            }
            if (generator.isUpToDate(l)) {
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
                Resource smdFile = ConfigurationCompiler.getSmdFile(project, serviceId);
                String smdContent = project.readFile(smdFile);
                generator.setSmdContent(smdContent);
                generator.generate();
            } catch (GenerationException ex) {
                throw new WMRuntimeException(ex);
            } catch (IOException ex) {
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
