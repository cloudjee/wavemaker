/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.runtime.security;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import javax.sql.DataSource;

import org.acegisecurity.GrantedAuthority;
import org.acegisecurity.GrantedAuthorityImpl;
import org.acegisecurity.userdetails.User;
import org.acegisecurity.userdetails.UserDetails;
import org.acegisecurity.userdetails.jdbc.JdbcDaoImpl;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.object.MappingSqlQuery;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.common.WMRuntimeInitException;

/**
 * In the default <code>org.acegisecurity.userdetails.jdbc.JdbcDaoImpl</code>
 * the SQL parameter type for authoritiesByUsernameQuery is hardcoded to
 * <code>Types.VARCHAR</code>.  This doesn't work well if the actual type for
 * the parameter is something else like <code>Types.INTEGER</code>.  This seems
 * to be a problem only in PostgreSQL, other databases like MySQL seems to will
 * just covert the parameter value to the right type.
 *  
 * @author ffu
 * @version $Rev$ - $Date$
 *
 */
public class EnhancedJdbcDaoImpl extends JdbcDaoImpl {

    private String authoritiesByUsernameQueryParamType;
    
    protected void initMappingSqlQueries() {
        String qryStr = getUsersByUsernameQuery();
        try {
            WMAppContext wmApp = WMAppContext.getInstance();
            if (wmApp != null && WMAppContext.getInstance().isMultiTenant())
                qryStr = insertTenantIdField(getUsersByUsernameQuery(), wmApp.getTenantColumnName());
        //} catch (WMRuntimeInitException ex) {}
        } catch (Exception ex) {}

        this.usersByUsernameMapping = new UsersByUsernameMapping(getDataSource(), qryStr);
        this.authoritiesByUsernameMapping = new AuthoritiesByUsernameMapping(getDataSource());
    }

    private String insertTenantIdField(String str, String colName) {
        StringBuffer sb = new StringBuffer(str);

        int indx = sb.lastIndexOf("FROM");
        if (indx < 0) indx = sb.lastIndexOf("from");
        if (indx < 0) return str;
        
        sb.insert(indx, ", " + colName + " ");

        return sb.toString();
    }
    
    /**
     * Query object to look up a user's authorities.
     */
    protected class AuthoritiesByUsernameMapping extends MappingSqlQuery {
        protected AuthoritiesByUsernameMapping(DataSource ds) {
            super(ds, getAuthoritiesByUsernameQuery());
            int type = Types.VARCHAR;
            String sType = getAuthoritiesByUsernameQueryParamType();
            // TODO: need to support other SQL types
            if (sType != null && sType.equals("integer")) {
                type = Types.INTEGER;
            }
            declareParameter(new SqlParameter(type));
            compile();
        }

        protected Object mapRow(ResultSet rs, int rownum)
            throws SQLException {
            String roleName = getRolePrefix() + rs.getString(2);
            GrantedAuthorityImpl authority = new GrantedAuthorityImpl(roleName);

            return authority;
        }
    }

    /**
     * Query object to look up a user.
     */
    protected class UsersByUsernameMapping extends MappingSqlQuery {
        protected UsersByUsernameMapping(DataSource ds, String str) {
            //super(ds, getUsersByUsernameQuery());
            super(ds, str);
            declareParameter(new SqlParameter(Types.VARCHAR));
            compile();
        }

        protected Object mapRow(ResultSet rs, int rownum)
            throws SQLException {

            String userid   = rs.getString(1);
            String password = rs.getString(2);
            boolean enabled = rs.getBoolean(3);
            String username = null;
            try {
                username = rs.getString(4);
            } catch (SQLException e) {}

            try {
                int tenantId = -1;
                WMAppContext wmApp = WMAppContext.getInstance();
                if (wmApp != null && wmApp.isMultiTenant()) {
                    tenantId = rs.getInt(5);
                    wmApp.setTenantIdForUser(username, tenantId);
                }
            //} catch (WMRuntimeInitException ex) {}
            } catch (Exception ex) {}

            WMAppContext.getInstance().setUserNameForUserID(userid, username);

            UserDetails user = new User(userid, password, enabled, true, true, true,
                    new GrantedAuthority[] {new GrantedAuthorityImpl("HOLDER")});
            return user;
        }
    }

    public String getAuthoritiesByUsernameQueryParamType() {
        return authoritiesByUsernameQueryParamType;
    }

    public void setAuthoritiesByUsernameQueryParamType(
            String authoritiesByUsernameQueryParamType) {
        this.authoritiesByUsernameQueryParamType = authoritiesByUsernameQueryParamType;
    }
}
