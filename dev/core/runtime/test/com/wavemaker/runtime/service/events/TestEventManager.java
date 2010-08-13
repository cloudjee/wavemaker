/*
 *  Copyright (C) 2008-2009 WaveMaker Software, Inc.
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

import java.util.List;
import java.util.Map;

import com.wavemaker.infra.TestSpringContextTestCase;
import com.wavemaker.runtime.server.testspring.ServiceEventBeanListener;
import com.wavemaker.runtime.service.ServiceWire;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestEventManager extends TestSpringContextTestCase {

    public void testListEvents() throws Exception {
        
        EventManager em = (EventManager) getBean("eventManager");
        assertNotNull(em);
        
        assertFalse(em.getEventWires().isEmpty());
        
        Map<Object, List<ServiceWire>> eventMap =
            em.getEventListeners(ServiceEventBeanListener.class);
        
        boolean gotTwo = false;
        for (List<ServiceWire> value: eventMap.values()) {
            if (2==value.size()) {
                gotTwo = true;
                assertNotSame(value.get(0), value.get(1));
            }
        }
        assertTrue(gotTwo);
    }
    
    public void testEventsWithoutABean() throws Exception {

        EventManager em = (EventManager) getBean("eventManager");
        assertNotNull(em);
        
        Map<Object, List<ServiceWire>> eventMap =
            em.getEventListeners(ServiceEventBeanListener.class);
        
        boolean gotNull = false;
        for (List<ServiceWire> value: eventMap.values()) {
            assertEquals(2, value.size());
            if (value.contains(null) && gotNull) {
                fail("got 2 nulls?");
            } else if (value.contains(null)) {
                gotNull = true;
            }
        }
        assertTrue(gotNull);
    }
}