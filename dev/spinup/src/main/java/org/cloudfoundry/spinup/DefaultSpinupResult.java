
package org.cloudfoundry.spinup;

import org.cloudfoundry.spinup.authentication.TransportToken;
import org.springframework.util.Assert;

/**
 * Default implementation of {@link StartedApplication}.
 * 
 * @author Phillip Webb
 */
public class DefaultSpinupResult implements StartedApplication {

    private final TransportToken transportToken;

    private final String redirectUrl;

    /**
     * Create a new {@link DefaultSpinupResult} implementation.
     * 
     * @param transportToken the transport token
     * @param redirectUrl the redirect url
     */
    public DefaultSpinupResult(TransportToken transportToken, String redirectUrl) {
        Assert.notNull(transportToken, "TransportToken must not be null");
        Assert.notNull(redirectUrl, "RedirectToken must not be null");
        this.transportToken = transportToken;
        this.redirectUrl = redirectUrl;
    }

    @Override
    public TransportToken getTransportToken() {
        return this.transportToken;
    }

    @Override
    public String getApplicationUrl() {
        return this.redirectUrl;
    }
}
