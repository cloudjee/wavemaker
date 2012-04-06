/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.cloudfoundry.spinup.authentication;

import java.util.Arrays;

import org.springframework.util.Assert;

/**
 * Authentication token returned used to ensure a user has rights to use a system. The authentication token is
 * considered sensitive and should not be stored or transported between systems.
 * 
 * @see TransportToken
 * @author Phillip Webb
 */
public final class AuthenticationToken {

    private final byte[] bytes;

    public AuthenticationToken(String token) {
        Assert.notNull(token, "Token must not be null");
        this.bytes = token.getBytes();
    }

    public AuthenticationToken(byte[] token) {
        Assert.notNull(token, "Token must not be null");
        this.bytes = token;
    }

    public byte[] getBytes() {
        return this.bytes;
    }

    @Override
    public String toString() {
        return new String(this.bytes);
    }

    @Override
    public int hashCode() {
        return Arrays.hashCode(this.bytes);
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (obj == this) {
            return true;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        AuthenticationToken other = (AuthenticationToken) obj;
        return Arrays.equals(this.bytes, other.bytes);
    }

}
