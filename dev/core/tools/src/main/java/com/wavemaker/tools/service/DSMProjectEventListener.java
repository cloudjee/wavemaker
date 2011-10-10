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

package com.wavemaker.tools.service;

import java.util.Map;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectEventListener;
import com.wavemaker.tools.service.definitions.Service;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class DSMProjectEventListener implements ProjectEventListener {

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.project.ProjectEventListener#closeProject(com.wavemaker.tools.project.Project)
     */
    public void closeProject(Project p) {

        Map<Project, Map<String, Service>> serviceDefinitions = this.designServiceManager.getAllServiceDefinitions();
        serviceDefinitions.remove(p);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.project.ProjectEventListener#openProject(com.wavemaker.tools.project.Project)
     */
    public void openProject(Project p) {
        // do nothing
    }

    // bean properties
    private DesignServiceManager designServiceManager;

    public DesignServiceManager getDesignServiceManager() {
        return this.designServiceManager;
    }

    public void setDesignServiceManager(DesignServiceManager designServiceManager) {
        this.designServiceManager = designServiceManager;
    }
}