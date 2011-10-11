/*
 * Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

import com.wavemaker.tools.data.DataModelManager;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectEventListener;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public class DataServiceProjectEventListener implements ProjectEventListener {

    private DataModelManager dataModelManager = null;

    public void setDataModelManager(DataModelManager dataModelManager) {
        this.dataModelManager = dataModelManager;
    }

    @Override
    public void closeProject(Project p) {
        this.dataModelManager.dispose(p.getProjectName());
    }

    @Override
    public void openProject(Project p) {
    }
}