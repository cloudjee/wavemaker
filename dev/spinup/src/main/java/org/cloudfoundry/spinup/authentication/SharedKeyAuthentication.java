
package org.cloudfoundry.spinup.authentication;

import org.springframework.util.Assert;

/**
 * Authenticaton scheme that can be used to propagate credentials between a client and a server. Both the client and
 * server must share a secret key that cannot be intercepted.
 * 
 * @author Phillip Webb
 */
public class SharedKeyAuthentication {

    private final SharedSecret sharedSecret;

    public SharedKeyAuthentication(SharedSecret sharedSecret) {
        Assert.notNull(sharedSecret, "SharedSecret must not be null");
        this.sharedSecret = sharedSecret;
    }

    public TransportToken getTransportToken(AuthenticationToken authenticationToken) {
        Assert.notNull(authenticationToken, "Authentication Token must not be null");
        return this.sharedSecret.encrypt(authenticationToken);
    }

    public AuthenticationToken getAuthenticationToken(TransportToken transportToken) {
        Assert.notNull(transportToken, "TransportToken must not be null");
        return this.sharedSecret.decrypt(transportToken);
    }
}
