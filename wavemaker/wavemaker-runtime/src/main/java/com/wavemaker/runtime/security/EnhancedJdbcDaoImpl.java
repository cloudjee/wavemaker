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

package com.wavemaker.runtime.security;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.jdbc.JdbcDaoImpl;

import com.wavemaker.runtime.WMAppContext;

/**
 * In the default <code>org.acegisecurity.userdetails.jdbc.JdbcDaoImpl</code>
 * the SQL parameter type for authoritiesByUsernameQuery is hardcoded to
 * <code>Types.VARCHAR</code>. This doesn't work well if the actual type for the
 * parameter is something else like <code>Types.INTEGER</code>. This seems to be
 * a problem only in PostgreSQL, other databases like MySQL seems to will just
 * covert the parameter value to the right type.
 * 
 * @author Frankie Fu
 */
public class EnhancedJdbcDaoImpl extends JdbcDaoImpl {

	@Override
	protected void initDao() {
		String qryStr = getUsersByUsernameQuery();
		try {
			WMAppContext wmApp = WMAppContext.getInstance();
			if (wmApp != null && WMAppContext.getInstance().isMultiTenant()) {
				qryStr = insertTenantIdField(getUsersByUsernameQuery(),
						wmApp.getTenantColumnName());
			}
		} catch (Exception ex) {
		}

		
		this.setUsersByUsernameQuery(qryStr);
	}

	private String insertTenantIdField(String str, String colName) {
		StringBuffer sb = new StringBuffer(str);

		int indx = sb.lastIndexOf("FROM");
		if (indx < 0) {
			indx = sb.lastIndexOf("from");
		}
		if (indx < 0) {
			return str;
		}

		sb.insert(indx, ", " + colName + " ");

		return sb.toString();
	}

    @Override
    protected List<UserDetails> loadUsersByUsername(String username) {
        return getJdbcTemplate().query(getUsersByUsernameQuery(), new String[] {username}, new RowMapper<UserDetails>() {
            public UserDetails mapRow(ResultSet rs, int rowNum) throws SQLException {
                String userId = rs.getString(1);
                String password = rs.getString(2);
                boolean enabled = rs.getBoolean(3);
                String userName = rs.getString(4);

                int tenantId = -1;
                try {

                    WMAppContext wmApp = WMAppContext.getInstance();
                    if (wmApp != null && wmApp.isMultiTenant()) {
                        tenantId = rs.getInt(5);
                    }
                } catch (Exception ex) {
                }

                WMUserDetails user = new WMUser(userId, password, userName, tenantId, enabled, true, true,
                        true, AuthorityUtils.NO_AUTHORITIES);

                return user;
            }

        });
    }

    @Override
    protected UserDetails createUserDetails(String username, UserDetails userFromUserQuery,
                                            List<GrantedAuthority> combinedAuthorities) {
        String returnUsername = userFromUserQuery.getUsername();

        if (!isUsernameBasedPrimaryKey()) {
            returnUsername = username;
        }

        WMUserDetails wmUserDetails = (WMUserDetails) userFromUserQuery;
        String userLongName = wmUserDetails.getUserLongName();
        int tenantId = wmUserDetails.getTenantId();

        return new WMUser(returnUsername, userFromUserQuery.getPassword(), userLongName, tenantId, userFromUserQuery.isEnabled(),
                true, true, true, combinedAuthorities);
    }
}
