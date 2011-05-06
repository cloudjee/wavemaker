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

package com.wavemaker.runtime.service;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

/**
 * Type manager.
 * 
 * Tested by TestServiceManager.
 * 
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TypeManager {
    
    /**
     * Return a list of all types (as java class names) associated with a given
     * service object.
     * 
     * @param service
     * @return
     */
    public List<String> getTypes(String serviceId) {
        
        return getTypes().get(serviceId);
    }
    
    /**
     * Return the service id that corresponds to the given type, or null if no
     * corresponding type was found.
     * 
     * @param type
     * @return
     * @throws TypeNotFoundException 
     */
    public String getServiceIdForType(String type) throws TypeNotFoundException {
        
        String foundServiceId = null;
        entryLoop: for (Entry<String, List<String>> entry: types.entrySet()) {
            for (String serviceType: entry.getValue()) {
                if (serviceType.equals(type)) {
                    foundServiceId = entry.getKey();
                    break entryLoop;
                }
            }
        }
        return foundServiceId;
    }

    /**
     * Return the service object that corresponds to the give type, or null if
     * no corresponding type was found.
     * 
     * @param type
     * @return
     * @throws TypeNotFoundException
     * @deprecated use {@link #getServiceWireForType(String)} instead. This will
     *             be removed in a few versions.
     */
    public Object getServiceForType(String type) throws TypeNotFoundException {
        
        String serviceId = getServiceIdForType(type);
        return getServiceManager().getService(serviceId);
    }
    
    /**
     * Return the service object that corresponds to the give type, or null if
     * no corresponding type was found.
     * 
     * @param type
     * @return
     * @throws TypeNotFoundException
     */
    public ServiceWire getServiceWireForType(String type) throws TypeNotFoundException {

        String serviceId = getServiceIdForType(type);
        return getServiceManager().getServiceWire(serviceId);
    }


    // bean properties below here
    private Map<String, List<String>> types;
    private ServiceManager serviceManager;

    public Map<String, List<String>> getTypes() {
        return types;
    }
    public void setTypes(Map<String, List<String>> types) {
        this.types = types;
    }
    
    public ServiceManager getServiceManager() {
        return serviceManager;
    }
    public void setServiceManager(ServiceManager serviceManager) {
        this.serviceManager = serviceManager;
    }
}