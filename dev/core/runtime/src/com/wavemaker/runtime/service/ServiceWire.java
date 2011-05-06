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

package com.wavemaker.runtime.service;


/**
 * ServiceWire binds service objects into the ServiceManager.  Different
 * implementations may have different requirements, but the ServiceType and
 * serviceId are always required.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public interface ServiceWire {

    /**
     * Sets the ServiceType.
     * 
     * @param serviceType
     *            The ServiceType to set.
     */
    public void setServiceType(ServiceType serviceType);

    /**
     * Gets the ServiceType.
     * 
     * @return The current ServiceType (or null if none has been set).
     */
    public ServiceType getServiceType();

    /**
     * Sets the unique service ID for this service.
     * 
     * @param serviceId
     *            The unique service ID.
     */
    public void setServiceId(String serviceId);

    /**
     * Gets the current unique service ID for this service.
     * 
     * @return The unique service ID (or null if none has been set).
     */
    public String getServiceId();
    
    /**
     * Returns true iff this service is a LiveDataService.
     * @return True iff this is a LiveDataService.
     */
    public boolean isLiveDataService();
}