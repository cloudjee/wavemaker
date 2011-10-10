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

package com.wavemaker.tools.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.Resource;

import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.ServiceGenerator;

/**
 * Manages known ServiceDefinitionFactory instances and ServiceGeneratorFactory instances.
 * 
 * Has convenience methods to get a ServiceDefinition instance given a File, and a ServiceGenerator instance, given a
 * GenerationConfiguration.
 * 
 * Could be instantiated and managed by Spring.
 * 
 * @author Simon Toens
 * @author Jeremy Grelle
 */
public class ServiceFactoryManager {

    public static ServiceFactoryManager getInstance() {
        return instance;
    }

    private static final ServiceFactoryManager instance = new ServiceFactoryManager();

    private final List<ServiceDefinitionFactory> sdf = new ArrayList<ServiceDefinitionFactory>();

    private final List<ServiceGeneratorFactory> sgf = new ArrayList<ServiceGeneratorFactory>();

    private ServiceFactoryManager() {
    }

    public void addServiceDefinitionFactory(ServiceDefinitionFactory f) {
        this.sdf.add(f);
    }

    public void addServiceGeneratorFactory(ServiceGeneratorFactory f) {
        this.sgf.add(f);
    }

    public ServiceDefinition getServiceDefinition(Resource f, String serviceId, DesignServiceManager serviceManager) {
        for (ServiceDefinitionFactory fac : this.sdf) {
            ServiceDefinition rtn = fac.getServiceDefinition(f, serviceId, serviceManager);
            if (rtn != null) {
                return rtn;
            }
        }
        return null;
    }

    public ServiceGenerator getServiceGenerator(GenerationConfiguration cfg) {
        for (ServiceGeneratorFactory fac : this.sgf) {
            ServiceGenerator rtn = fac.getServiceGenerator(cfg);
            if (rtn != null) {
                return rtn;
            }
        }
        return null;
    }

}
