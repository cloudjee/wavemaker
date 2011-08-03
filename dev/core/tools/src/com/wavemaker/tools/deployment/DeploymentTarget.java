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

package com.wavemaker.tools.deployment;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 *
 */
public interface DeploymentTarget {
    
    /**
     * Validate the deployment info prior to WAR generation 
     * @param deploymentInfo
     * @return status message
     */
    String validateDeployment(DeploymentInfo deploymentInfo);
    
    /**
     * Deploy an app. 
     *
     * @param webapp  Either exploded or archived webapp to deploy
     * @param deploymentInfo
     * @return status message
     */
    String deploy(File webapp, 
                  DeploymentInfo deploymentInfo);

    /**
     * Undeploy an app.
     * @param deploymentInfo
     *
     * @return status message
     */
    String undeploy(DeploymentInfo deploymentInfo);

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

    /**
     * @param deploymentInfo 
     * @return  current deployments
     */
    List<AppInfo> listDeploymentNames(DeploymentInfo deploymentInfo); 

    /**
     * @return Properties that can be configured for this DeploymentTarget,
     * optionally with default values.
     * for example:
     * <ul>
     * <li> hostname </li>
     * <li> port </li>
     * <li> etc </li>
     * </ul>
     * The property values are passed into the deployment methods.
     */
    Map<String, String> getConfigurableProperties();
}
