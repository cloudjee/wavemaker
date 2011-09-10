/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.security;

/**
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class DatabaseOptions {

    private String modelName;

    private String entityName;

    private String tableName;

    private String unamePropertyName;
    
    private String unameColumnName;
    
    private String uidPropertyName;

    private String uidColumnName;

    private String pwPropertyName;

    private String pwColumnName;

    private String rolePropertyName;

    private String roleColumnName;
    
    private boolean useRolesQuery;

    private String rolesByUsernameQuery;

    private String tenantIdField;

    private int defTenantId;

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getUnamePropertyName() {
        return unamePropertyName;
    }

    public void setUnamePropertyName(String unamePropertyName) {
        this.unamePropertyName = unamePropertyName;
    }

    public String getUnameColumnName() {
        return unameColumnName;
    }

    public void setUnameColumnName(String unameColumnName) {
        this.unameColumnName = unameColumnName;
    }

    public String getUidPropertyName() {
        return uidPropertyName;
    }

    public void setUidPropertyName(String uidPropertyName) {
        this.uidPropertyName = uidPropertyName;
    }

    public String getUidColumnName() {
        return uidColumnName;
    }

    public void setUidColumnName(String uidColumnName) {
        this.uidColumnName = uidColumnName;
    }

    public String getPwPropertyName() {
        return pwPropertyName;
    }

    public void setPwPropertyName(String pwPropertyName) {
        this.pwPropertyName = pwPropertyName;
    }

    public String getPwColumnName() {
        return pwColumnName;
    }

    public void setPwColumnName(String pwColumnName) {
        this.pwColumnName = pwColumnName;
    }

    public String getRolePropertyName() {
        return rolePropertyName;
    }

    public void setRolePropertyName(String rolePropertName) {
        this.rolePropertyName = rolePropertName;
    }

    public String getRoleColumnName() {
        return roleColumnName;
    }

    public void setRoleColumnName(String roleColumnName) {
        this.roleColumnName = roleColumnName;
    }

    public boolean isUseRolesQuery() {
        return useRolesQuery;
    }

    public void setUseRolesQuery(boolean useRolesQuery) {
        this.useRolesQuery = useRolesQuery;
    }

    public String getRolesByUsernameQuery() {
        return rolesByUsernameQuery;
    }

    public void setRolesByUsernameQuery(String rolesByUsernameQuery) {
        this.rolesByUsernameQuery = rolesByUsernameQuery;
    }

    public String getTenantIdField() {
        return tenantIdField;
    }

    public void setTenantIdField(String val) {
        tenantIdField = val;
    }

    public int getDefTenantId() {
        return defTenantId;
    }

    public void setDefTenantId(int val) {
        defTenantId = val;
    }

}
