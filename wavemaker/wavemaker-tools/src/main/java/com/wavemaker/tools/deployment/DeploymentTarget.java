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

package com.wavemaker.tools.deployment;

import com.wavemaker.tools.project.Project;

/**
 * @author Simon Toens
 */
public interface DeploymentTarget {

    /**
     * Validate the deployment info prior to WAR generation
     * 
     * @param deploymentInfo
     * @return status message
     */
    void validateDeployment(DeploymentInfo deploymentInfo) throws DeploymentStatusException;

    // FIXME deprecate validateDeployment

    /**
     * Deploy a project.
     * 
     * @param project Project to deploy
     * @param deploymentInfo
     * @return status message
     */
    String deploy(Project project, DeploymentInfo deploymentInfo) throws DeploymentStatusException;

    /**
     * Undeploy an app.
     * 
     * @param deploymentInfo
     * @param deleteServices
     * 
     * @return status message
     */
    void undeploy(DeploymentInfo deploymentInfo, boolean deleteServices) throws DeploymentStatusException;

     /**
     * Redeploy an already deployed app.
     * @param deploymentInfo
     *
     * @return status message
     */
    String redeploy(DeploymentInfo deploymentInfo);

    /**
     * start a deployed app.
     * @param deploymentInfo
     *
     * @return status message
     */
    String start(DeploymentInfo deploymentInfo);

    /**
     * stop a deployed app.
     * @param deploymentInfo
     *
     * @return status message
     */
    String stop(DeploymentInfo deploymentInfo);
}
