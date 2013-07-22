/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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

package com.wavemaker.studio.data;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import com.wavemaker.tools.data.DataModelManager;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectEventListener;

/**
 * @author Simon Toens
 */
public class DataServiceProjectEventListener implements ProjectEventListener, ApplicationContextAware {

    private ApplicationContext applicationContext;

    /**
     * DataModelManager is lazy-init to allow studio to start without hibernate jars, be careful not to break this.
     */
    private DataModelManager dataModelManager = null;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Override
    public void closeProject(Project p) {
        if (this.dataModelManager == null) {
            try {
                this.dataModelManager = this.applicationContext.getBean(DataModelManager.class);
            } catch (Exception e) {
                // Most likely because hibernate jars are missing, abort the listener
                return;
            }
        }
        this.dataModelManager.dispose(p.getProjectName());
    }

    @Override
    public void openProject(Project p) {
    }
}