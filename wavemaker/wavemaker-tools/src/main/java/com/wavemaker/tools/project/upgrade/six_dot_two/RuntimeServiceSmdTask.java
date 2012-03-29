/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.project.upgrade.six_dot_two;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * Delete runtimeService.smd so that it can be re-created reflecting changes (if any) in Runtime Service.
 * 
 * @author Seung Lee
 * @author Jeremy Grelle
 */
public class RuntimeServiceSmdTask implements UpgradeTask {

    private StudioFileSystem fileSystem;

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        File runtimeServiceFile = project.getWebAppRootFolder().getFile("services/runtimeService.smd");
        runtimeServiceFile.delete();
        File webxml = project.getWebXmlFile();
        webxml.delete();
    }

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }
}
