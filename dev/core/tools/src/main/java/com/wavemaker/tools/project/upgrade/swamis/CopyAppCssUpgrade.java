/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.project.upgrade.swamis;

import java.io.IOException;

import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * Copies a template app.css into the project.
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class CopyAppCssUpgrade implements UpgradeTask {

    private StudioFileSystem fileSystem;

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        try {
            Resource appCssTemplate = this.fileSystem.getStudioWebAppRoot().createRelative("app/templates/project/app.css");
            Resource destCss = project.getWebAppRoot().createRelative("app.css");

            if (!destCss.exists()) {
                project.writeFile(destCss, project.readFile(appCssTemplate));
            }
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }
}