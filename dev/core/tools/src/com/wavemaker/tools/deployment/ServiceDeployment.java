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

package com.wavemaker.tools.deployment;

import java.util.Map;

import com.wavemaker.tools.service.DesignServiceManager;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public interface ServiceDeployment {
    
    /**
     * For a service type implementing this interface, this method is called
     * once with each service instance belonging to the implementing service
     * type.
     * 
     * @param serviceName
     * @param properties
     *                Generic deployment properties that a service type may know
     *                about For example: {jndiname:
     *                "java:comp/env/jdbc/sakiladb"}. Typically these would be
     *                sent from the client to configure various deployment
     *                options They could be prefixed with the service name.
     * @param mgr     DesignServiceManager
     * 
     */
    void prepare(String serviceName, Map<String, String> properties, DesignServiceManager mgr);

}