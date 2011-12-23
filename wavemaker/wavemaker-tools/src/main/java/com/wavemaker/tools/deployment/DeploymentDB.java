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

    private boolean updateSchema = false;

    public String getDataModelId() {
        return this.dataModelId;
    }

    public void setDataModelId(String dataModelId) {
        this.dataModelId = dataModelId;
    }

    public String getDbName() {
        return this.dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
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

    public String getJndiName() {
        return this.jndiName;
    }

    public void setJndiName(String jndiName) {
        this.jndiName = jndiName;
    }

    public String getConnectionUrl() {
        return this.connectionUrl;
    }

    public void setConnectionUrl(String connectionUrl) {
        this.connectionUrl = connectionUrl;
    }

    public boolean isUpdateSchema() {
        return this.updateSchema;
    }

    public void setUpdateSchema(boolean updateSchema) {
        this.updateSchema = updateSchema;
    }

    public Map<String, String> asProperties() {
        String prefix = this.dataModelId;
        Map<String, String> props = new HashMap<String, String>();
        if (StringUtils.hasText(this.jndiName)) {
            props.put(prefix + ProjectConstants.PROP_SEP + DataModelDeploymentConfiguration.JNDI_NAME_PROPERTY, this.jndiName);
        } else {
            if (StringUtils.hasText(this.username)) {
                props.put(prefix + DataServiceConstants.DB_USERNAME, this.username);
            }
            if (StringUtils.hasText(this.password)) {
                props.put(prefix + DataServiceConstants.DB_PASS, this.password);
            }
            if (StringUtils.hasText(this.connectionUrl)) {
                props.put(prefix + DataServiceConstants.DB_URL, this.connectionUrl);
            }
            if (StringUtils.hasText(this.dbName)) {
                props.put(prefix + ProjectConstants.PROP_SEP + DataModelDeploymentConfiguration.DB_ALIAS_PROPERTY, this.dbName);
            }
            if (this.updateSchema) {
                props.put(prefix + ProjectConstants.PROP_SEP + DataModelDeploymentConfiguration.UPDATE_SCHEMA_PROPERTY, "true");
            }
        }
        return props;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + (this.connectionUrl == null ? 0 : this.connectionUrl.hashCode());
        result = prime * result + (this.dataModelId == null ? 0 : this.dataModelId.hashCode());
        result = prime * result + (this.dbName == null ? 0 : this.dbName.hashCode());
        result = prime * result + (this.jndiName == null ? 0 : this.jndiName.hashCode());
        result = prime * result + (this.password == null ? 0 : this.password.hashCode());
        result = prime * result + (this.username == null ? 0 : this.username.hashCode());
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
        DeploymentDB other = (DeploymentDB) obj;
        if (this.connectionUrl == null) {
            if (other.connectionUrl != null) {
                return false;
            }
        } else if (!this.connectionUrl.equals(other.connectionUrl)) {
            return false;
        }
        if (this.dataModelId == null) {
            if (other.dataModelId != null) {
                return false;
            }
        } else if (!this.dataModelId.equals(other.dataModelId)) {
            return false;
        }
        if (this.dbName == null) {
            if (other.dbName != null) {
                return false;
            }
        } else if (!this.dbName.equals(other.dbName)) {
            return false;
        }
        if (this.jndiName == null) {
            if (other.jndiName != null) {
                return false;
            }
        } else if (!this.jndiName.equals(other.jndiName)) {
            return false;
        }
        if (this.password == null) {
            if (other.password != null) {
                return false;
            }
        } else if (!this.password.equals(other.password)) {
            return false;
        }
        if (this.username == null) {
            if (other.username != null) {
                return false;
            }
        } else if (!this.username.equals(other.username)) {
            return false;
        }
        return true;
    }

}