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

package com.wavemaker.runtime.service.events;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.wavemaker.runtime.service.ServiceWire;

/**
 * @author Matt Small
 */
public class EventManager {

    /** Logger for this class and subclasses */
    protected final Logger logger = Logger.getLogger(getClass());

    private final List<EventWire> eventWires = new ArrayList<EventWire>();

    /**
     * Return a map from EventListener to a List of the beans to be triggered by that EventListener.
     * 
     * @param listenerClass
     * @return
     */
    @SuppressWarnings("unchecked")
    public <T> Map<T, List<ServiceWire>> getEventListeners(Class<?> T) {

        Map<T, List<ServiceWire>> ret = new HashMap<T, List<ServiceWire>>();

        if (null != this.eventWires && !this.eventWires.isEmpty()) {
            for (EventWire wire : this.eventWires) {
                if (T.isAssignableFrom(wire.getEventListener().getClass())) {
                    if (!ret.containsKey(wire.getEventListener())) {
                        ret.put((T) wire.getEventListener(), new ArrayList<ServiceWire>());
                    }
                    ret.get(wire.getEventListener()).add(wire.getServiceWire());
                }
            }
        }

        return ret;
    }

    public void addEvent(Object eventListener, ServiceWire serviceWire) {

        EventWire wire = new EventWire();
        wire.setServiceWire(serviceWire);
        wire.setEventListener(eventListener);
        this.eventWires.add(wire);
    }

    /**
     * Add an EventWire to the eventWire list.
     * 
     * @param eventWire The EventWire to add.
     */
    public void addEventWire(EventWire eventWire) {

        this.logger.info("Adding EventWire " + eventWire);
        getEventWires().add(eventWire);
    }

    protected List<EventWire> getEventWires() {
        return this.eventWires;
    }
}