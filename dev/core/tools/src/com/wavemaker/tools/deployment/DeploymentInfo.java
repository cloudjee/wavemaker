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

import java.util.List;

/**
 * Describes a deployment target.
 * 
 * @author slee
 * @author Jeremy Grelle
 * 
 */
public class DeploymentInfo implements Comparable<DeploymentInfo> {

    private String name;

    private DeploymentType deploymentType;

    private List<DeploymentDB> databases;

    private String applicationName;

    private String host;

    private int port;

    private String target;

    private String archiveType;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DeploymentType getDeploymentType() {
        return deploymentType;
    }

    public void setDeploymentType(DeploymentType deploymentType) {
        this.deploymentType = deploymentType;
    }

    public List<DeploymentDB> getDatabases() {
        return databases;
    }

    public void setDatabases(List<DeploymentDB> databases) {
        this.databases = databases;
    }

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public String getArchiveType() {
        return archiveType;
    }

    public void setArchiveType(String archiveType) {
        this.archiveType = archiveType;
    }

    /**
     * {@inheritDoc}
     */
    public int compareTo(DeploymentInfo o) {
        // TODO Auto-generated method stub
        return 0;
    }
}