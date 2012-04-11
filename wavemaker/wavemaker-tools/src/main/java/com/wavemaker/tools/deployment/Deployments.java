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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.SystemUtils;

/**
 * TODO Document Deployments
 * <p />
 * 
 * @author Jeremy Grelle
 */
public class Deployments {

    private Map<String, List<DeploymentInfo>> projectDeployments = new HashMap<String, List<DeploymentInfo>>();

    public Map<String, List<DeploymentInfo>> getProjectDeployments() {
        return this.projectDeployments;
    }

    public void setProjectDeployments(Map<String, List<DeploymentInfo>> projectDeployments) {
        this.projectDeployments = projectDeployments;
    }

    public List<DeploymentInfo> forProject(String projectName) {
        if (this.projectDeployments.containsKey(projectName)) {
            return this.projectDeployments.get(projectName);
        } else {
            List<DeploymentInfo> deployments = new ArrayList<DeploymentInfo>();
            this.projectDeployments.put(projectName, deployments);
            return deployments;
        }
    }

    public DeploymentInfo forId(String projectName, String deploymentId) {
        List<DeploymentInfo> deployments = forProject(projectName);
        for (DeploymentInfo deployment : deployments) {
            if (deployment.getDeploymentId().equals(deploymentId)) {
                return deployment;
            }
        }
        return null;
    }

    public void save(String projectName, DeploymentInfo deployment) {
        if (!SystemUtils.isEncrypted(deployment.getPassword())) {
            deployment.setPassword(SystemUtils.encrypt(deployment.getPassword()));
        }
        if (!CollectionUtils.isEmpty(deployment.getDatabases())) {
            for (DeploymentDB db : deployment.getDatabases()) {
                if (!SystemUtils.isEncrypted(db.getPassword())) {
                    db.setPassword(SystemUtils.encrypt(db.getPassword()));
                }
            }
        }
        List<DeploymentInfo> deployments = forProject(projectName);
        if (!StringUtils.hasText(deployment.getDeploymentId())) {
            deployment.setDeploymentId(projectName + deployments.size());
            deployments.add(deployment);
        } else {
            DeploymentInfo existing = forId(projectName, deployment.getDeploymentId());
            if (existing != null) {
                deployments.set(deployments.indexOf(existing), deployment);
            } else {
                throw new WMRuntimeException("/common/deployments.js is in an unexpected state.");
            }
        }
    }

    /**
     * @param projectName
     * @param deploymentInfo
     */
    public DeploymentInfo remove(String projectName, String deploymentId) {
        List<DeploymentInfo> deployments = forProject(projectName);
        for (int i = 0; i < deployments.size(); i++) {
            if (deployments.get(i).getDeploymentId().equals(deploymentId)) {
                return deployments.remove(i);
            }
        }
        throw new WMRuntimeException("/common/deployments.js is in an unexpected state.");

    }
}
