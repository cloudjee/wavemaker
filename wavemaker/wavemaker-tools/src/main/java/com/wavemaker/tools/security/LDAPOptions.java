/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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
 * @author Frankie Fu
 */
public class LDAPOptions {

    private String ldapUrl;

    private String managerDn;

    private String managerPassword;

    private String userDnPattern;

    private boolean groupSearchDisabled;

    private String groupSearchBase;

    private String groupRoleAttribute;

    private String groupSearchFilter;

    private String roleModel;

    private String roleEntity;

    private String roleTable;

    private String roleUsername;

    private String roleProperty;

    private String roleQuery;

    private String roleProvider;

    public String getLdapUrl() {
        return this.ldapUrl;
    }

    public void setLdapUrl(String ldapUrl) {
        this.ldapUrl = ldapUrl;
    }

    public String getManagerDn() {
        return this.managerDn;
    }

    public void setManagerDn(String managerDn) {
        this.managerDn = managerDn;
    }

    public String getManagerPassword() {
        return this.managerPassword;
    }

    public void setManagerPassword(String managerPassword) {
        this.managerPassword = managerPassword;
    }

    public String getUserDnPattern() {
        return this.userDnPattern;
    }

    public void setUserDnPattern(String userDnPattern) {
        this.userDnPattern = userDnPattern;
    }

    public boolean isGroupSearchDisabled() {
        return this.groupSearchDisabled;
    }

    public void setGroupSearchDisabled(boolean groupSearchDisabled) {
        this.groupSearchDisabled = groupSearchDisabled;
    }

    public String getGroupSearchBase() {
        return this.groupSearchBase;
    }

    public void setGroupSearchBase(String groupSearchBase) {
        this.groupSearchBase = groupSearchBase;
    }

    public String getGroupRoleAttribute() {
        return this.groupRoleAttribute;
    }

    public void setGroupRoleAttribute(String groupRoleAttribute) {
        this.groupRoleAttribute = groupRoleAttribute;
    }

    public String getGroupSearchFilter() {
        return this.groupSearchFilter;
    }

    public void setGroupSearchFilter(String groupSearchFilter) {
        this.groupSearchFilter = groupSearchFilter;
    }

    public String getRoleModel() {
        return this.roleModel;
    }

    public void setRoleModel(String roleModel) {
        this.roleModel = roleModel;
    }

    public String getRoleEntity() {
        return this.roleEntity;
    }

    public void setRoleEntity(String roleEntity) {
        this.roleEntity = roleEntity;
    }

    public String getRoleTable() {
        return this.roleTable;
    }

    public void setRoleTable(String roleTable) {
        this.roleTable = roleTable;
    }

    public String getRoleUsername() {
        return this.roleUsername;
    }

    public void setRoleUsername(String roleUsername) {
        this.roleUsername = roleUsername;
    }

    public String getRoleProperty() {
        return this.roleProperty;
    }

    public void setRoleProperty(String roleProperty) {
        this.roleProperty = roleProperty;
    }

    public String getRoleQuery() {
        return this.roleQuery;
    }

    public void setRoleQuery(String roleQuery) {
        this.roleQuery = roleQuery;
    }

    public String getRoleProvider() {
        return this.roleProvider;
    }

    public void setRoleProvider(String roleProvider) {
        this.roleProvider = roleProvider;
    }

}
