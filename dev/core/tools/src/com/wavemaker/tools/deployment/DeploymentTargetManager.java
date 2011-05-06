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

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import com.wavemaker.common.Resource;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.tools.common.ConfigurationException;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 *
 */
public class DeploymentTargetManager {

    private Map<String, DeploymentTarget>
        deploymentTargets = new HashMap<String, DeploymentTarget>();


    public Collection<String> getDeploymentTargetNames() {
        return deploymentTargets.keySet();
    }
    
    public DeploymentTarget getDeploymentTarget(String targetServerName) {
        
        if (deploymentTargets == null) {
            SpringUtils.throwSpringNotInitializedError(this.getClass());
        }
        
        if (!deploymentTargets.containsKey(targetServerName)) {
            throw new ConfigurationException(
                Resource.UNKNOWN_DEPLOYMENT_TARGET, targetServerName);
        }
        
        return deploymentTargets.get(targetServerName);
    }

    public void setDeploymentTargets(Map<String, DeploymentTarget> 
                                     deploymentTargets) {
        this.deploymentTargets = deploymentTargets;

    }
    
}
