/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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


/**
 * An individual studio upgrade task.
 * 
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public interface StudioUpgradeTask {

    /**
     * Perform a single upgrade action on the studio. This should only do a
     * single task.
     * 
     * @param upgradeInfo
     *                Contains information about the upgrade in progress.
     */
    public void doUpgrade(UpgradeInfo upgradeInfo);
}