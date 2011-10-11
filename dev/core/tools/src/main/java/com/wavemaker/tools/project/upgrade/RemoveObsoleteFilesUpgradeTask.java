/*
 *  Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.project.upgrade;

import java.io.IOException;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.Project;

/**
 * This task removes old & obsolete files (according to a list set via spring). All files to remove are relative to the
 * project root.
 * 
 * @author small
 * @author Jeremy Grelle
 */
public class RemoveObsoleteFilesUpgradeTask implements UpgradeTask {

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project,
     * com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        for (String file : this.files) {
            try {
                project.deleteFile(file);
            } catch (IOException ex) {
                throw new WMRuntimeException(ex);
            }
        }

        upgradeInfo.addMessage("Removed obsolete files: " + StringUtils.join(this.files, ", "));
    }

    // bean properties
    private List<String> files;

    public void setFiles(List<String> files) {
        this.files = files;
    }

    public List<String> getFiles() {
        return this.files;
    }
}