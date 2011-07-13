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
        return ldapUrl;
    }

    public void setLdapUrl(String ldapUrl) {
        this.ldapUrl = ldapUrl;
    }

    public String getManagerDn() {
        return managerDn;
    }

    public void setManagerDn(String managerDn) {
        this.managerDn = managerDn;
    }

    public String getManagerPassword() {
        return managerPassword;
    }

    public void setManagerPassword(String managerPassword) {
        this.managerPassword = managerPassword;
    }

    public String getUserDnPattern() {
        return userDnPattern;
    }

    public void setUserDnPattern(String userDnPattern) {
        this.userDnPattern = userDnPattern;
    }
    
    public boolean isGroupSearchDisabled() {
        return groupSearchDisabled;
    }

    public void setGroupSearchDisabled(boolean groupSearchDisabled) {
        this.groupSearchDisabled = groupSearchDisabled;
    }

    public String getGroupSearchBase() {
        return groupSearchBase;
    }

    public void setGroupSearchBase(String groupSearchBase) {
        this.groupSearchBase = groupSearchBase;
    }

    public String getGroupRoleAttribute() {
        return groupRoleAttribute;
    }

    public void setGroupRoleAttribute(String groupRoleAttribute) {
        this.groupRoleAttribute = groupRoleAttribute;
    }

    public String getGroupSearchFilter() {
        return groupSearchFilter;
    }

    public void setGroupSearchFilter(String groupSearchFilter) {
        this.groupSearchFilter = groupSearchFilter;
    }

	public String getRoleModel() {
		return roleModel;
	}

	public void setRoleModel(String roleModel) {
		this.roleModel = roleModel;
	}

	public String getRoleEntity() {
		return roleEntity;
	}

	public void setRoleEntity(String roleEntity) {
		this.roleEntity = roleEntity;
	}
	
	public String getRoleTable() {
		return roleTable;
	}

	public void setRoleTable(String roleTable) {
		this.roleTable = roleTable;
	}

	public String getRoleUsername() {
		return roleUsername;
	}

	public void setRoleUsername(String roleUsername) {
		this.roleUsername = roleUsername;
	}

	public String getRoleProperty() {
		return roleProperty;
	}

	public void setRoleProperty(String roleProperty) {
		this.roleProperty = roleProperty;
	}
	
	public String getRoleQuery() {
		return roleQuery;
	}

	public void setRoleQuery(String roleQuery) {
		this.roleQuery = roleQuery;
	}

	public String getRoleProvider() {
		return roleProvider;
	}

	public void setRoleProvider(String roleProvider) {
		this.roleProvider = roleProvider;
	}
    
}
