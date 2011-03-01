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
package com.wavemaker.runtime.service.events;

import com.wavemaker.runtime.service.ServiceWire;

/**
 * Provides configuration wiring between EventListeners and the ServiceWires
 * they operate on.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public class EventWire {

    private Object eventListener;
    private ServiceWire serviceWire;
    
    public Object getEventListener() {
        return eventListener;
    }
    public void setEventListener(Object eventListener) {
        this.eventListener = eventListener;
    }
    public void setServiceWire(ServiceWire serviceWire) {
        this.serviceWire = serviceWire;
    }
    public ServiceWire getServiceWire() {
        return serviceWire;
    }
}