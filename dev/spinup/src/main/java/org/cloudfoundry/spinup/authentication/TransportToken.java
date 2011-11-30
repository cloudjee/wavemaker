
package org.cloudfoundry.spinup.authentication;

import java.util.Arrays;

import org.cloudfoundry.spinup.util.HexString;
import org.springframework.util.Assert;

/**
 * A security token that can be stored and transported between systems. Transport tokens are {@link AuthenticationToken
 * AuthenticationTokens} encrypted using a {@link SharedSecret}.
 * 
 * @see AuthenticationToken
 */
public final class TransportToken {

    private final byte[] digest;

    private final byte[] encryptedToken;

    public TransportToken(byte[] digest, byte[] encryptedToken) {
        Assert.notNull(digest, "Digest must not be null");
        Assert.notNull(encryptedToken, "Encrypted Token must not be null");
        this.digest = digest;
        this.encryptedToken = encryptedToken;
    }

    public byte[] getEncryptedToken() {
        return this.encryptedToken;
    }

    public boolean isDigestMatch(byte[] digest) {
        if (digest == null) {
            return false;
        }
        return Arrays.equals(this.digest, digest);
    }

    @Override
    public int hashCode() {
        return Arrays.hashCode(this.digest) + Arrays.hashCode(this.encryptedToken);
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        TransportToken other = (TransportToken) obj;
        return Arrays.equals(this.digest, other.digest) && Arrays.equals(this.encryptedToken, other.encryptedToken);
    }

    public String encode() {
        return HexString.toString(this.digest) + "." + HexString.toString(this.encryptedToken);
    }

}
