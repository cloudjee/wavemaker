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

package com.wavemaker.tools.project;

import java.util.List;
import java.util.Map;

import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.events.EventNotifier;

/**
 * EventNotifier for Project events.
 * 
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class ProjectEventNotifier extends EventNotifier {

    public void executeCloseProject(Project p) {

        Map<ProjectEventListener, List<ServiceWire>> listenersO = getEventManager().getEventListeners(ProjectEventListener.class);
        for (ProjectEventListener listener : listenersO.keySet()) {
            listener.closeProject(p);
        }
    }

    public void executeOpenProject(Project p) {

        Map<ProjectEventListener, List<ServiceWire>> listenersO = getEventManager().getEventListeners(ProjectEventListener.class);
        for (ProjectEventListener listener : listenersO.keySet()) {
            listener.openProject(p);
        }
    }
}