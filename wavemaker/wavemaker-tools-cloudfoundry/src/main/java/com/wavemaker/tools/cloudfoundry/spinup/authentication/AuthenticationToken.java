
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
