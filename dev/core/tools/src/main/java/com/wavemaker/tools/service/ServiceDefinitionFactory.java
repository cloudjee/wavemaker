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

package com.wavemaker.tools.service;

import org.springframework.core.io.Resource;

import com.wavemaker.runtime.service.definition.ServiceDefinition;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 */
public interface ServiceDefinitionFactory {

    /**
     * Returns ServiceDefintion instance if this ServiceDefinitionFactory knows how to handle the passed in File.
     * Returns null otherwise.
     * 
     * @param f The file that represents a ServiceDefinition
     * 
     * @return ServiceDefintion or null if file is unknown
     */
    ServiceDefinition getServiceDefinition(Resource f, String serviceId, DesignServiceManager serviceMgr);
}
