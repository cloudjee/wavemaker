/*
 *  Copyright (C) 2007-2013 VMware, Inc. All rights reserved.
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
import java.util.Collection;

import org.springframework.security.cas.authentication.CasAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
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

    private String rolePrefix;

    private String noRolesMarkerRole;

    private List<String> roles;

    private Map<String, List<Rule>> roleMap;

    public SecurityService() {
    }


    /**
     * Logs the current principal out. The principal is the one in the security context.
     * 
     */
    @ExposeToClient
    public void logout() {
        SecurityContextHolder.getContext().setAuthentication(null);
    }

    private static Authentication getAuthenticatedAuthentication() {
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
        Authentication authentication = getAuthenticatedAuthentication();
        if (authentication != null) {
            WMUserDetails principal = (WMUserDetails) authentication.getPrincipal();
            return principal.getUserLongName();
        }
        return null;
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
        Collection<? extends GrantedAuthority>  authorities = authentication.getAuthorities(); 
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
                    logger.warn("Role " + roleName + " does not use the prefix " + this.rolePrefix + ". This may cause problems");
                    realRoleName = roleName;
                }
            }
            // make sure the role is not the maker for no roles
            if (realRoleName != null && !realRoleName.equals(this.noRolesMarkerRole)) {
                roleNames.add(realRoleName);
            }
        }

        return roleNames.toArray(new String[0]);
    }

    /**
     * Returns the tenant Id for the logged in user.
     *
     * @return The tenant Id.
     */
    @ExposeToClient
    public static int getTenantId() {
        Authentication authentication = getAuthenticatedAuthentication();
        if (authentication != null) {
            WMUserDetails principal = (WMUserDetails) authentication.getPrincipal();
            return principal.getTenantId();
        }
        return -1;
    }

    /**
     * This method returns a proxy ticket to the caller. The serviceUrl must be the EXACT url of the service that you
     * are using the ticket to call.
     *
     * @param serviceUrl The url of the service, protected by CAS, that you want to call.
     * @return A 'use once' proxy service ticket, or null if a ticket cannot be retrieved.
     */
    @ExposeToClient
    public static String getCASProxyTicket(String serviceUrl) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String ticket = null;
        try {
            if (auth instanceof CasAuthenticationToken) {
                ticket = ((CasAuthenticationToken) auth).getAssertion().getPrincipal().getProxyTicketFor(serviceUrl);
            }
        } catch (Exception e) {
            logger.error("The CASSecurityService.getServiceTicket() has failed", e);
        }
        return ticket;
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
