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

import java.util.HashSet;
import java.util.Set;

import org.acegisecurity.ldap.InitialDirContextFactory;
import org.acegisecurity.providers.ldap.populator.DefaultLdapAuthoritiesPopulator;

/**
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class LdapAuthoritiesPopulator extends DefaultLdapAuthoritiesPopulator {

    private boolean groupSearchDisabled;

    public LdapAuthoritiesPopulator(
            InitialDirContextFactory initialDirContextFactory,
            String groupSearchBase) {
        super(initialDirContextFactory, groupSearchBase);
    }

    @SuppressWarnings("unchecked")
    public Set getGroupMembershipRoles(String userDn, String username) {
        if (isGroupSearchDisabled()) {
            return new HashSet();
        }
        return super.getGroupMembershipRoles(userDn, username);
        
    }

    public boolean isGroupSearchDisabled() {
        return groupSearchDisabled;
    }

    public void setGroupSearchDisabled(boolean groupSearchDisabled) {
        this.groupSearchDisabled = groupSearchDisabled;
    }
}
