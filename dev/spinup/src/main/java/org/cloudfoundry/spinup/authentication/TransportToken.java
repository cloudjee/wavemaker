
package org.cloudfoundry.spinup.authentication;

import java.util.Arrays;

import org.springframework.util.Assert;

/**
 * A security token that can be stored and transported between systems. Transport tokens are {@link AuthenticationToken}
 * s encrypted using a {@link SharedSecret}.
 * 
 * @see AuthenticationToken
 * @see SharedKeyAuthentication
 */
public final class TransportToken {

    private byte[] digest;

    private byte[] encryptedToken;

    public TransportToken(byte[] digest, byte[] encryptedToken) {
        Assert.notNull(digest, "Digest must not be null");
        Assert.notNull(encryptedToken, "Encrypted Token must not be null");
        this.digest = digest;
        this.encryptedToken = encryptedToken;
    }

    public byte[] getEncryptedToken() {
        return encryptedToken;
    }

    public boolean isDigestMatch(byte[] digest) {
        if (digest == null) {
            return false;
        }
        return Arrays.equals(this.digest, digest);
    }

    @Override
    public int hashCode() {
        return Arrays.hashCode(digest) + Arrays.hashCode(encryptedToken);
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
        return Arrays.equals(digest, other.digest) && Arrays.equals(encryptedToken, other.encryptedToken);
    }
}
