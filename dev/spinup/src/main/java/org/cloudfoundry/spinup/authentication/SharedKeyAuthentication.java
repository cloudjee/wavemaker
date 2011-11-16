
package org.cloudfoundry.spinup.authentication;

import org.springframework.util.Assert;

/**
 * Authenticaton scheme that can be used to propagate credentials between a client and a server. Both the client and
 * server must share a secret key that cannot be intercepted.
 * 
 * @author Phillip Webb
 */
public class SharedKeyAuthentication {

    private SharedSecret sharedSecret;

    private LoginManager loginManager;

    public SharedKeyAuthentication(SharedSecret sharedSecret, LoginManager loginManager) {
        Assert.notNull(sharedSecret, "SharedSecret must not be null");
        Assert.notNull(loginManager, "LoginManager must not be null");
        this.sharedSecret = sharedSecret;
        this.loginManager = loginManager;
    }

    public TransportToken getTransportToken(LoginCredentials credentials) {
        Assert.notNull(credentials, "Credentials must not be null");
        AuthenticationToken authenticationToken = loginManager.login(credentials);
        return sharedSecret.encrypt(authenticationToken);
    }

    public AuthenticationToken getAuthenticationToken(TransportToken transportToken) {
        Assert.notNull(transportToken, "TransportToken must not be null");
        return sharedSecret.decrypt(transportToken);
    }
}
