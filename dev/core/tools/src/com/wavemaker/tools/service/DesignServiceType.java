/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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

import com.wavemaker.runtime.service.ServiceWire;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public interface DesignServiceType {

    /**
     * The associated serviceType.
     * 
     * @return The bean name of the associated ServiceType.
     */
    public String getServiceType();
    
    /**
     * The ServiceWire for use with this ServiceType.  This will be used to add
     * the correct configuration to the service spring files.
     * 
     * @return The associated ServiceWire class.
     */
    public Class<? extends ServiceWire> getServiceWire();
}