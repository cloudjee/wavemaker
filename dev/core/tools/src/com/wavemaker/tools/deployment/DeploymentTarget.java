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
     * Deploy an app. 
     *
     * @param webapp  Either exploded or archived webapp to deploy
     * @param contextRoot  Context root to deploy app under
     * @param configuredProperties  Deployment settings, property names with configured values
     * @return status message
     */
    String deploy(File webapp, 
                  String contextRoot, 
                  Map<String, String> configuredProperties);

    /**
     * Undeploy an app.
     *
     * @param contextRoot The context root of the app to undeploy
     * @param configuredProperties  Deployment target specific settings
     * @return status message
     */
    String undeploy(String contextRoot, 
                    Map<String, String> configuredProperties);

    /**
     * Redeploy an already deployed app.
     *
     * @param contextRoot  Context root of app to redeploy
     * @param configuredProperties  Deployment settings, property names with configured values
     * @return status message
     */
    String redeploy(String contextRoot, 
                    Map<String, String> configuredProperties);

    /**
     * @param configuredProperties  Deployment target specific settings 
     * @return  current deployments
     */
    List<AppInfo> listDeploymentNames(Map<String, String> configuredProperties); 

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
