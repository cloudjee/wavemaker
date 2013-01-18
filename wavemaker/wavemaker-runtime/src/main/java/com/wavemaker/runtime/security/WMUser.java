/*
 *  Copyright (C) 2008-2013 VMware, Inc. All rights reserved.
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

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

/**
 *
 * @author Seung Lee
 */
public class WMUser extends User implements WMUserDetails {

    private final String userLongName;
    private final int tenantId;

    public WMUser(String username, String password, String userLongName, int tenantId, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.userLongName = userLongName;
        this.tenantId = tenantId;

    }
    public WMUser(String username, String password, String userLongName, int tenantId, boolean enabled, boolean accountNonExpired,
                boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        this.userLongName = userLongName;
        this.tenantId = tenantId;
    }

    @Override
    public String getUserLongName() {
        return this.userLongName;
    }

    @Override
    public int getTenantId() {
        return this.tenantId;
    }
}
