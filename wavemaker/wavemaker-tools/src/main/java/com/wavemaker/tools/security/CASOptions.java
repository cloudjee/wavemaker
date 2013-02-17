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

package com.wavemaker.tools.security;

/**
 * The idea of this class is to provide configuration for CAS authentication and Database or LDAP user details population.
 * Authentication is provided by a CAS service, which in turn uses its own method of user lookup and authentication via
 * a database or LDAP. Once authenticated via CAS, spring security requires that the user details
 * and roles are populated. Here we allow this to be done via the Database or LDAP.
 *
 * @author Lewis Henderson
 */
public class CASOptions {
    // CAS Server url
    private String casUrl;

    // Project URL. We can't get this from anywhere sensible so we have to ask for it.
    private String projectUrl;

    // Type of UserDetailsService to use.
    private String userDetailsProvider;

    // Options for chosen provider.
    private Object options;

    public String getCasUrl() {
        return casUrl;
    }

    public void setCasUrl(String casUrl) {
        this.casUrl = casUrl;
    }

    public String getProjectUrl() {
        return projectUrl;
    }

    public void setProjectUrl(String projectUrl) {
        this.projectUrl = projectUrl;
    }

    public String getUserDetailsProvider() {
        return userDetailsProvider;
    }

    public void setUserDetailsProvider(String userDetailsProvider) {
        this.userDetailsProvider = userDetailsProvider;
        if (userDetailsProvider.equals(SecuritySpringSupport.CAS_USERDETAILS_PROVIDER_DATABASE)) {
            options = new DatabaseOptions();
        } else if (userDetailsProvider.equals(SecuritySpringSupport.CAS_USERDETAILS_PROVIDER_LDAP)) {
            options = new LDAPOptions();
        } else
            options = null;
    }

    public void setOptions(Object options) {
        this.options = options;
    }

    public Object getOptions() {
        return options;
    }
}
