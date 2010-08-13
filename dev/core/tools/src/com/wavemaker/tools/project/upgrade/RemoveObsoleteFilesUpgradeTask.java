/*
 *  Copyright (C) 2009-2010 WaveMaker Software, Inc.
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
package com.wavemaker.tools.project.upgrade;

import java.io.File;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.wavemaker.tools.project.Project;

/**
 * This task removes old & obsolete files (according to a list set via spring).
 * All files to remove are relative to the project root.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public class RemoveObsoleteFilesUpgradeTask implements UpgradeTask {

    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        for (String file: files) {
            File f = new File(project.getProjectRoot(), file);
            f.delete();
        }
        
        upgradeInfo.addMessage("Removed obsolete files: "+
                StringUtils.join(files, ", "));
    }
    

    // bean properties
    private List<String> files;
    
    public void setFiles(List<String> files) {
        this.files = files;
    }
    public List<String> getFiles() {
        return files;
    }
}