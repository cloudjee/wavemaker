/*
 * Copyright (C) 2007-2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
package com.wavemaker.studio.data;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectEventListener;
import com.wavemaker.tools.data.DataModelManager;

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

    public void closeProject(Project p) {
        dataModelManager.dispose(p.getProjectName());
    }

    public void openProject(Project p) {
    }
}