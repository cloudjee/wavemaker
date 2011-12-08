/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.acegisecurity.Authentication;
import org.acegisecurity.AuthenticationException;
import org.acegisecurity.AuthenticationManager;
import org.acegisecurity.BadCredentialsException;
import org.acegisecurity.GrantedAuthority;
import org.acegisecurity.context.SecurityContextHolder;
import org.acegisecurity.providers.UsernamePasswordAuthenticationToken;
import org.acegisecurity.providers.anonymous.AnonymousAuthenticationToken;
import org.apache.log4j.Logger;

import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;

/**
 * The Security Service provides interfaces to access authentication and authorization information in the system.
 * 
 * @author Frankie Fu
 */
@HideFromClient
public class SecurityService {

    static final Logger logger = Logger.getLogger(SecurityService.class);

    private AuthenticationManager authenticationManager;

    private String rolePrefix;

    private String noRolesMarkerRole;

    private List<String> roles;

    private Map<String, List<Rule>> roleMap;

    /**
     * Provides a simple username/password authentication. It uses the authentication provider(s) specified in the
     * security spring config file. Upon successful authentication, the Authentication object would be set into
     * SecurityContext and could be accessible thru SecurityContext.getAuthentication() later on.
     * 
     * @param username The user name.
     * @param password The user password.
     * @throws InvalidCredentialsException If the supplied credentials are invalid.
     * @throws SecurityException if authentication failed for some reasons other than invalid credentials.
     */
    public void authenticate(String username, String password) throws InvalidCredentialsException, SecurityException {
        Authentication auth = null;
        try {
            auth = this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException(e);
        } catch (AuthenticationException e) {
            throw new SecurityException(e);
        }
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    /**
     * Logs the current principal out. The principal is the one in the security context.
     * 
     */
    @ExposeToClient
    public void logout() {
        SecurityContextHolder.getContext().setAuthentication(null);
    }

    private Authentication getAuthenticatedAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication instanceof AnonymousAuthenticationToken ? null : authentication;
    }

    /**
     * Checks whether the user has been authenticated.
     * 
     * @return true if the user was authenticated; otherwise, false.
     */
    @ExposeToClient
    public boolean isAuthenticated() {
        return getAuthenticatedAuthentication() != null;
    }

    /**
     * Returns the user name of the principal in the current security context.
     * 
     * @return The user name.
     */
    @ExposeToClient
    public String getUserName() {
        WMAppContext wmApp = WMAppContext.getInstance();
        return wmApp.getUserNameForUserID(this.getUserId());
    }

    /**
     * Returns the user id of the principal in the current security context.
     * 
     * @return The user id.
     */
    @ExposeToClient
    public String getUserId() {
        Authentication authentication = getAuthenticatedAuthentication();
        if (authentication != null) {
            return authentication.getName();
        }
        return null;
    }

    /**
     * Returns the user roles of the principal in the current security context.
     * 
     * @return The user roles.
     */
    @ExposeToClient
    public String[] getUserRoles() {
        Authentication authentication = getAuthenticatedAuthentication();
        if (authentication == null) {
            return new String[0];
        }
        GrantedAuthority[] authorities = authentication.getAuthorities();
        List<String> roleNames = new ArrayList<String>();
        for (GrantedAuthority authority : authorities) {
            String roleName = authority.getAuthority();
            String realRoleName = null;
            if (this.rolePrefix == null) {
                realRoleName = roleName;
            } else {
                if (roleName.startsWith(this.rolePrefix)) {
                    // take out the prefix and get the actual role name
                    realRoleName = roleName.substring(this.rolePrefix.length());

                } else {
                    logger.warn("Skipping Role " + roleName + ". It should be prefix with " + this.rolePrefix + ". Something is wrong!");
                }
            }
            // make sure the role is not the maker for no roles
            if (realRoleName != null && !realRoleName.equals(this.noRolesMarkerRole)) {
                roleNames.add(realRoleName);
            }
        }

        WMAppContext wmApp = WMAppContext.getInstance();
        if (wmApp != null && wmApp.isMultiTenant()) {
            Integer tid = wmApp.getTenantIdForUser(getUserName());
            RuntimeAccess.getInstance().setTenantId(tid);
        }

        return roleNames.toArray(new String[0]);
    }

    /**
     * Checks if the Principal is allowed to perform the specified action on the specified resources. The Principal is
     * obtained from the SecurityContext in the current execution thread.
     * 
     * @param resources A set of resources.
     * @param action The action to be checked.
     * @return True if the Principal is allowed to perform such action; false otherwise.
     */
    public boolean isAllowed(Set<Resource> resources, String action) {
        String[] roleNames = getUserRoles();
        for (String roleName : roleNames) {
            if (!isAllowed(roleName, resources, action)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if the specified role has permission to perform the specified action on the specified resources.
     * 
     * @param roleName The name of the role to be checked for permission.
     * @param resources A set of resources.
     * @param action The action to be checked.
     * @return True if the role is allowed to perform such action; false otherwise.
     */
    public boolean isAllowed(String roleName, Set<Resource> resources, String action) {
        List<Rule> rules = this.roleMap.get(roleName);
        if (rules != null) {
            for (Rule rule : rules) {
                if (action.equals(rule.getAction())) {
                    for (Resource ruleResource : rule.getResources()) {
                        for (Resource queryResource : resources) {
                            if (queryResource.matchResource(ruleResource)) {
                                if (!rule.isAllowed()) {
                                    // deny wins, so simply returns false
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
        return true;
    }

    public AuthenticationManager getAuthenticationManager() {
        return this.authenticationManager;
    }

    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public String getRolePrefix() {
        return this.rolePrefix;
    }

    public void setRolePrefix(String rolePrefix) {
        this.rolePrefix = rolePrefix;
    }

    public String getNoRolesMarkerRole() {
        return this.noRolesMarkerRole;
    }

    public void setNoRolesMarkerRole(String noRolesMarkerRole) {
        this.noRolesMarkerRole = noRolesMarkerRole;
    }

    public List<String> getRoles() {
        return this.roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public Map<String, List<Rule>> getRoleMap() {
        return this.roleMap;
    }

    public void setRoleMap(Map<String, List<Rule>> roleMap) {
        this.roleMap = roleMap;
    }

}
