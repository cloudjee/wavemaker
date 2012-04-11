/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

import com.wavemaker.tools.project.Project;

/**
 * An individual upgrade task.
 * 
 * @author Matt Small
 */
public interface UpgradeTask {

    /**
     * Perform a single upgrade action on a project. This should only do a single task.
     * 
     * @param project The project to upgrade. This will be the current project in the available ProjectManager
     *        (available through bean properties).
     * @param upgradeInfo Contains information about the upgrade in progress.
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo);
}