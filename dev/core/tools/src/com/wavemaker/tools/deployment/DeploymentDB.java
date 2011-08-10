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

import java.util.HashMap;
import java.util.Map;

import org.springframework.util.StringUtils;

import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.data.DataModelDeploymentConfiguration;
import com.wavemaker.tools.project.ProjectConstants;

/**
 * Deployment-specific database settings to be applied when generating a WAR or EAR for deployment.
 * 
 * @author Jeremy Grelle
 */
public class DeploymentDB {

    private String dataModelId;

    private String dbName;

    private String username;

    private String password;

    private String jndiName;

    private String connectionUrl;

    public String getDataModelId() {
        return dataModelId;
    }

    public void setDataModelId(String dataModelId) {
        this.dataModelId = dataModelId;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getJndiName() {
        return jndiName;
    }

    public void setJndiName(String jndiName) {
        this.jndiName = jndiName;
    }

    public String getConnectionUrl() {
        return connectionUrl;
    }

    public void setConnectionUrl(String connectionUrl) {
        this.connectionUrl = connectionUrl;
    }

    public Map<String, String> asProperties() {
        String prefix = this.dataModelId;
        Map<String, String> props = new HashMap<String, String>();
        if (StringUtils.hasText(jndiName)) {
            props.put(prefix + ProjectConstants.PROP_SEP + DataModelDeploymentConfiguration.JNDI_NAME_PROPERTY, jndiName);
        } else {
            if (StringUtils.hasText(username))
                props.put(prefix + DataServiceConstants.DB_USERNAME, username);
            if (StringUtils.hasText(password))
                props.put(prefix + DataServiceConstants.DB_PASS, password);
            if (StringUtils.hasText(connectionUrl))
                props.put(prefix + DataServiceConstants.DB_URL, connectionUrl);
            if (StringUtils.hasText(dbName))
                props.put(prefix + ProjectConstants.PROP_SEP + DataModelDeploymentConfiguration.DB_ALIAS_PROPERTY, dbName);
        }
        return props;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((connectionUrl == null) ? 0 : connectionUrl.hashCode());
        result = prime * result + ((dataModelId == null) ? 0 : dataModelId.hashCode());
        result = prime * result + ((dbName == null) ? 0 : dbName.hashCode());
        result = prime * result + ((jndiName == null) ? 0 : jndiName.hashCode());
        result = prime * result + ((password == null) ? 0 : password.hashCode());
        result = prime * result + ((username == null) ? 0 : username.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        DeploymentDB other = (DeploymentDB) obj;
        if (connectionUrl == null) {
            if (other.connectionUrl != null)
                return false;
        } else if (!connectionUrl.equals(other.connectionUrl))
            return false;
        if (dataModelId == null) {
            if (other.dataModelId != null)
                return false;
        } else if (!dataModelId.equals(other.dataModelId))
            return false;
        if (dbName == null) {
            if (other.dbName != null)
                return false;
        } else if (!dbName.equals(other.dbName))
            return false;
        if (jndiName == null) {
            if (other.jndiName != null)
                return false;
        } else if (!jndiName.equals(other.jndiName))
            return false;
        if (password == null) {
            if (other.password != null)
                return false;
        } else if (!password.equals(other.password))
            return false;
        if (username == null) {
            if (other.username != null)
                return false;
        } else if (!username.equals(other.username))
            return false;
        return true;
    }

}