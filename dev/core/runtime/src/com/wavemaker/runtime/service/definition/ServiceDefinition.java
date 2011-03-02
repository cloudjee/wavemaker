/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.service.definition;

import java.util.List;

import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.runtime.service.ServiceType;
import com.wavemaker.runtime.service.events.EventWire;

/**
 * Represents a service definition.
 * 
 * @author Frankie Fu
 * @version $Rev$ - $Date$
 */
public interface ServiceDefinition {
    
    /**
     * Returns the unique ID that can be used to identify the service.
     * 
     * @return The unique ID.
     */
    public String getServiceId();
     
    /**
     * Return the service type.
     * 
     * @return The service type.
     */
    public ServiceType getServiceType();

    /**
     * Get a list of all the service operations.
     * 
     * @return The list of all service operations
     */
    public List<ServiceOperation> getServiceOperations();

    /**
     * Get all types associated with this service (instead of referenced in
     * other services).
     * 
     * @return The list of types contained within this service.
     */
    public List<TypeDefinition> getLocalTypes();

    /**
     * Get all types associated with this service (instead of referenced in
     * other services).
     * @param username The user name for SalesForce account
     * @param password The password for SalesForce account
     * 
     * @return The list of types contained within this service.
     */
    public List<TypeDefinition> getLocalTypes(String username, String password);

    /**
     * Return this service's runtime configuration, typically a Spring file,
     * or null if this service does not have its own runtime file.
     *
     * The path has to be loadable from the ClassPath.
     * 
     * @return The service's entry point runtime configuration as a classpath
     *         resource.
     */
    public String getRuntimeConfiguration();

    /**
     * Return a list of all event notifier classes.
     * 
     * The return values of this are now ignored; configure {@link EventWire}
     * elements in the bean files for events.
     * 
     * @deprecated This has been deprecated in favor of {@link EventWire}
     *             entries places into the Spring file. This will be removed in
     *             the next release.
     * 
     * @return
     */
    @Deprecated
    public List<String> getEventNotifiers();
    
    /**
     * Indicates if this service supports LiveDataService access, by implementing
     * com.wavemaker.runtime.service.LiveDataService.
     * @return
     */
    public boolean isLiveDataService();
}