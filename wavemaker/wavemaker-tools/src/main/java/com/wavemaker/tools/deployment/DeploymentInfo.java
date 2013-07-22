/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
import java.util.List;

import org.springframework.util.ObjectUtils;

/**
 * Describes a deployment.
 * 
 * @author Jeremy Grelle
 * 
 */
public class DeploymentInfo {

    private String deploymentId;

    private String name;

    private String username;

    private String password;

    private String token;

    private DeploymentType deploymentType;

    private List<DeploymentDB> databases = new ArrayList<DeploymentDB>();

    private String applicationName;

    private String host;

    private int port;

    private String target;

    private String deploymentUrl;

    private ArchiveType archiveType = ArchiveType.WAR;

    private Boolean destroyAllData;

    private int httpPort;

    private int httpsPort;

    public String getDeploymentId() {
        return this.deploymentId;
    }

    public void setDeploymentId(String deploymentId) {
        this.deploymentId = deploymentId;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public DeploymentType getDeploymentType() {
        return this.deploymentType;
    }

    public void setDeploymentType(DeploymentType deploymentType) {
        this.deploymentType = deploymentType;
    }

    public List<DeploymentDB> getDatabases() {
        return this.databases;
    }

    public void setDatabases(List<DeploymentDB> databases) {
        this.databases = databases;
    }

    public String getApplicationName() {
        return this.applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public String getHost() {
        return this.host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return this.port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public int getHttpPort() {
        return this.httpPort;
    }

    public void setHttpPort(int httpPort) {
        this.httpPort = httpPort;
    }

    public int getHttpsPort() {
        return this.httpsPort;
    }

    public void setHttpsPort(int httpsPort) {
        this.httpsPort = httpsPort;
    }

    public String getTarget() {
        return this.target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public ArchiveType getArchiveType() {
        return this.archiveType;
    }

    public void setArchiveType(ArchiveType archiveType) {
        this.archiveType = archiveType;
    }

    public String getDeploymentUrl() {
        return this.deploymentUrl;
    }

    public void setDeploymentUrl(String deploymentUrl) {
        this.deploymentUrl = deploymentUrl;
    }

    public Boolean getDestroyAllData() {
        return this.destroyAllData;
    }

    public void setDestroyAllData(Boolean destroyAllData) {
        this.destroyAllData = destroyAllData;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + (this.applicationName == null ? 0 : this.applicationName.hashCode());
        result = prime * result + (this.archiveType == null ? 0 : this.archiveType.hashCode());
        result = prime * result + (this.databases == null ? 0 : this.databases.hashCode());
        result = prime * result + (this.deploymentType == null ? 0 : this.deploymentType.hashCode());
        result = prime * result + (this.host == null ? 0 : this.host.hashCode());
        result = prime * result + (this.name == null ? 0 : this.name.hashCode());
        result = prime * result + (this.password == null ? 0 : this.password.hashCode());
        result = prime * result + this.port;
        result = prime * result + (this.target == null ? 0 : this.target.hashCode());
        result = prime * result + (this.token == null ? 0 : this.token.hashCode());
        result = prime * result + (this.username == null ? 0 : this.username.hashCode());
        result = prime * result + (this.destroyAllData == null ? 0 : this.destroyAllData.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        DeploymentInfo other = (DeploymentInfo) obj;
        Boolean rtn = true;
        rtn &= ObjectUtils.nullSafeEquals(this.applicationName, other.applicationName);
        rtn &= ObjectUtils.nullSafeEquals(this.archiveType, other.archiveType);
        rtn &= ObjectUtils.nullSafeEquals(this.databases, other.databases);
        rtn &= ObjectUtils.nullSafeEquals(this.deploymentType, other.deploymentType);
        rtn &= ObjectUtils.nullSafeEquals(this.host, other.host);
        rtn &= ObjectUtils.nullSafeEquals(this.name, other.name);
        rtn &= ObjectUtils.nullSafeEquals(this.password, other.password);
        rtn &= ObjectUtils.nullSafeEquals(this.port, other.port);
        rtn &= ObjectUtils.nullSafeEquals(this.target, other.target);
        rtn &= ObjectUtils.nullSafeEquals(this.token, other.token);
        rtn &= ObjectUtils.nullSafeEquals(this.username, other.username);
        rtn &= ObjectUtils.nullSafeEquals(this.destroyAllData, other.destroyAllData);
        return rtn;
    }

}