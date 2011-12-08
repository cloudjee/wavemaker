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

/**
 * The notifier aspect to ServletEventListener. This will interface with EventManager to get the current
 * ServletEventListeners, and their related objects, and it will invoke the specific events.
 * 
 * When an event is triggered, the Notifier should be called.
 * 
 * @author Matt Small
 */
public class ServletEventNotifier extends EventNotifier {

    public void executeEndRequest() {

        Map<ServletEventListener, List<ServiceWire>> listeners = getEventManager().getEventListeners(ServletEventListener.class);
        for (Entry<ServletEventListener, List<ServiceWire>> entry : listeners.entrySet()) {
            List<ServiceWire> objects = entry.getValue();
            ServletEventListener sel = entry.getKey();

            for (ServiceWire serviceWire : objects) {
                sel.endRequest(serviceWire);
            }
        }
    }

    public void executeStartRequest() {

        Map<ServletEventListener, List<ServiceWire>> listeners = getEventManager().getEventListeners(ServletEventListener.class);
        for (Entry<ServletEventListener, List<ServiceWire>> entry : listeners.entrySet()) {
            List<ServiceWire> objects = entry.getValue();
            ServletEventListener sel = entry.getKey();

            for (ServiceWire object : objects) {
                sel.startRequest(object);
            }
        }
    }
}