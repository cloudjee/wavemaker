/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.service.definition.DeprecatedServiceDefinition;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.service.codegen.ServiceGenerator;

/**
 * Generic logic for generating Service Classes from Service Definitions.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 */
public class ServiceClassGenerator {

    private Log logger = LogFactory.getLog(ServiceClassGenerator.class);

    private List<File> services = new ArrayList<File>();

    // map service file to its service id
    private Map<File, String> serviceToServiceId = new HashMap<File, String>();

    private File outputDirectory = null;

    private DesignServiceManager serviceManager = null;

    public void setDesignServiceManager(DesignServiceManager serviceManager) {
        this.serviceManager = serviceManager;
    }

    public void setOutputDirectory(File outputDirectory) {
        this.outputDirectory = outputDirectory;
    }

    public void addService(List<File> serviceFiles) {
        addService(serviceFiles, null);
    }

    public void addService(List<File> serviceFiles, String serviceId) {
        for (File f : serviceFiles) {
            addService(f, serviceId);
        }
    }

    public void addService(File f) {
        addService(f, null);
    }

    public void addService(File f, String serviceId) {
        services.add(f);
        if (serviceId != null) {
            serviceToServiceId.put(f, serviceId);
        }
    }

    public void run() {

        if (serviceManager == null) {
            throw new ConfigurationException("serviceMgr cannot be null");
        }

        for (File f : services) {

            String serviceId = serviceToServiceId.get(f);
            
            DeprecatedServiceDefinition def = ServiceUtils.getServiceDefinition(f,
                    serviceId, serviceManager);
            
            if (null == def) {
                continue;
            }

            GenerationConfiguration cfg = new GenerationConfiguration(def,
                    outputDirectory);
            
            ServiceGenerator generator = ServiceUtils.getServiceGenerator(cfg);

            File rtdir = serviceManager.getServiceRuntimeDirectory(serviceId);
            long l = IOUtils.getMostRecentModificationTime(rtdir);
            if (generator.isUpToDate(l)) {
                if (logger.isInfoEnabled()) {
                    logger.info("service " + def.getServiceId()
                            + " is up to date");
                }
                continue;
            } else {
                if (logger.isInfoEnabled()) {
                    logger.info("service " + def.getServiceId()
                            + " needs to be re-generated");
                }
            }

            try {
                generator.generate();
            } catch (GenerationException ex) {
                throw new WMRuntimeException(ex);
            } finally {
                try {
                    def.dispose();
                } catch (RuntimeException ex) {
                    logger.warn("Error while cleaning up", ex);
                }
            }
        }
    }
}
