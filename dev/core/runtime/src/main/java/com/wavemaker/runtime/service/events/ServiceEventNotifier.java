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

package com.wavemaker.runtime.service.events;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.TypedServiceReturn;

/**
 * The notifier aspect to ServiceEventListener. This will interface with EventManager to get the current
 * ServletEventListeners, and their related objects, and it will invoke the specific events.
 * 
 * @author Matt Small
 */
public class ServiceEventNotifier extends EventNotifier {

    public Object[] executePreOperation(ServiceWire serviceWire, String operationName, Object[] params) {

        Map<ServiceEventListener, List<ServiceWire>> listeners = getEventManager().getEventListeners(ServiceEventListener.class);
        for (Entry<ServiceEventListener, List<ServiceWire>> entry : listeners.entrySet()) {
            List<ServiceWire> serviceWires = entry.getValue();
            ServiceEventListener sel = entry.getKey();

            for (ServiceWire sw : serviceWires) {
                if (serviceWire == sw) {
                    params = sel.preOperation(sw, operationName, params);
                }
            }
        }

        return params;
    }

    public TypedServiceReturn executePostOperation(ServiceWire serviceWire, String operationName, TypedServiceReturn result, Throwable exception)
        throws Throwable {

        Map<ServiceEventListener, List<ServiceWire>> listeners = getEventManager().getEventListeners(ServiceEventListener.class);
        for (Entry<ServiceEventListener, List<ServiceWire>> entry : listeners.entrySet()) {
            List<ServiceWire> serviceWires = entry.getValue();
            ServiceEventListener sel = entry.getKey();

            for (ServiceWire sw : serviceWires) {
                if (serviceWire == sw) {
                    result = sel.postOperation(sw, operationName, result, exception);
                    exception = null;
                }
            }
        }

        // if the exception hasn't been corrected, throw it out
        if (exception != null) {
            throw exception;
        }

        return result;
    }
}