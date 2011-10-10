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

package com.wavemaker.runtime.security;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.Set;

import javax.sql.DataSource;

import org.acegisecurity.GrantedAuthorityImpl;
import org.acegisecurity.ldap.InitialDirContextFactory;
import org.acegisecurity.providers.ldap.populator.DefaultLdapAuthoritiesPopulator;

/**
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class LdapAuthoritiesPopulator extends DefaultLdapAuthoritiesPopulator {

    private boolean groupSearchDisabled;

    // Added by Girish
    private String roleModel;

    private String roleEntity;

    private String roleTable;

    private String roleProperty;

    private String roleProvider;

    private String roleUsername;

    private String roleQuery;

    private DataSource dataSource;

    public LdapAuthoritiesPopulator(InitialDirContextFactory initialDirContextFactory, String groupSearchBase) {
        super(initialDirContextFactory, groupSearchBase);
    }

    @Override
    @SuppressWarnings("unchecked")
    public Set getGroupMembershipRoles(String userDn, String username) {
        // GD: Adding in an extra check to determine whether we are getting roles from LDAP or DB
        if (isGroupSearchDisabled()) {
            return new HashSet();
        } else if (this.roleProvider != null && this.roleProvider.equals("Database")) {
            try {
                HashSet roles = new HashSet();
                Connection con = getDataSource().getConnection();
                String sqlStatement = "";
                if (this.roleQuery != null && !this.roleQuery.equals("")) {
                    sqlStatement = this.roleQuery;
                } else {
                    sqlStatement = "SELECT " + this.roleProperty.toLowerCase() + " FROM " + this.roleTable + " WHERE " + this.roleUsername + " = ?";
                }

                PreparedStatement ps = con.prepareStatement(sqlStatement);
                ps.setString(1, username);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    GrantedAuthorityImpl grantedAuthorityImp = new GrantedAuthorityImpl("ROLE_" + rs.getString(1));
                    roles.add(grantedAuthorityImp);
                }
                return roles;
            } catch (SQLException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            return new HashSet();
        } else {
            return super.getGroupMembershipRoles(userDn, username);
        }
    }

    public boolean isGroupSearchDisabled() {
        return this.groupSearchDisabled;
    }

    public void setGroupSearchDisabled(boolean groupSearchDisabled) {
        this.groupSearchDisabled = groupSearchDisabled;
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

    public String getRoleProperty() {
        return this.roleProperty;
    }

    public void setRoleProperty(String roleProperty) {
        this.roleProperty = roleProperty;
    }

    public String getRoleProvider() {
        return this.roleProvider;
    }

    public void setRoleProvider(String roleProvider) {
        this.roleProvider = roleProvider;
    }

    public String getRoleUsername() {
        return this.roleUsername;
    }

    public String getRoleQuery() {
        return this.roleQuery;
    }

    public void setRoleQuery(String roleQuery) {
        this.roleQuery = roleQuery;
    }

    public void setRoleUsername(String roleUsername) {
        this.roleUsername = roleUsername;
    }

    public DataSource getDataSource() {
        return this.dataSource;
    }

    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }

}
