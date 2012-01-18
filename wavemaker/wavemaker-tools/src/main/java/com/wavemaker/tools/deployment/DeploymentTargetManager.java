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

package com.wavemaker.tools.deployment;

import java.util.HashMap;
import java.util.Map;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.tools.common.ConfigurationException;

/**
 * Manager for the various deployment targets supported by WaveMaker.
 * 
 * @author Simon Toens
 */
public class DeploymentTargetManager {

    private Map<DeploymentType, DeploymentTarget> deploymentTargets = new HashMap<DeploymentType, DeploymentTarget>();

    /**
     * Return a {@link DeploymentTarget} for the specified {@link DeploymentType}.
     * 
     * @param deploymentType the deployment type
     * @return the {@link DeploymentTarget} that can be used to manage deployements.
     */
    public DeploymentTarget getDeploymentTarget(DeploymentType deploymentType) {
        if (this.deploymentTargets == null || this.deploymentTargets.isEmpty()) {
            SpringUtils.throwSpringNotInitializedError(this.getClass());
        }

        if (!this.deploymentTargets.containsKey(deploymentType)) {
            throw new ConfigurationException(MessageResource.UNKNOWN_DEPLOYMENT_TARGET, deploymentType);
        }

        return this.deploymentTargets.get(deploymentType);
    }

    public void setDeploymentTargets(Map<DeploymentType, DeploymentTarget> deploymentTargets) {
        this.deploymentTargets = deploymentTargets;

    }
}
