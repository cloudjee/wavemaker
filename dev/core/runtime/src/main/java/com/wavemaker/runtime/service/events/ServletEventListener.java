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

import com.wavemaker.runtime.service.ServiceWire;

/**
 * ServletEventListener provides an interface for EventListeners that want to be concerned with Servlet-level events
 * (such as start/end request, start/end session, etc).
 * 
 * EventListener provides a base interface for services (or groups of services) to handle system events. The
 * EventListener defines a series of callback functions; each callback is called when the system enters that state, with
 * the associated Service as the only parameter.
 * 
 * Each EventListener can listen for multiple events, and multiple types of services. When a request changes state, all
 * registered EventListeners are called with each of their services, in order.
 * 
 * It is also possible for an individual Service to be registered with multiple EventListeners, although the order
 * they'll be called in is not guaranteed.
 * 
 * @author Matt Small
 */
public interface ServletEventListener {

    /**
     * Callback for when a request is ending.
     * 
     * @param serviceWire A ServiceWire associated with this listener & request.
     */
    public void endRequest(ServiceWire serviceWire);

    /**
     * Callback for when a request is starting.
     * 
     * @param serviceWire A ServiceWire associated with this listener & request.
     */
    public void startRequest(ServiceWire service);
}