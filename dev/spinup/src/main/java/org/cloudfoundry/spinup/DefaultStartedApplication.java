
package org.cloudfoundry.spinup;

import org.cloudfoundry.spinup.authentication.TransportToken;
import org.springframework.util.Assert;

/**
 * Default implementation of {@link StartedApplication}.
 * 
 * @author Phillip Webb
 */
public class DefaultStartedApplication implements StartedApplication {

    private final TransportToken transportToken;

    private final String applicationUrl;

    /**
     * Create a new {@link DefaultStartedApplication} implementation.
     * 
     * @param transportToken the transport token
     * @param applicationUrl the redirect URL
     */
    public DefaultStartedApplication(TransportToken transportToken, String applicationUrl) {
        Assert.notNull(transportToken, "TransportToken must not be null");
        Assert.notNull(applicationUrl, "ApplicationUrl must not be null");
        this.transportToken = transportToken;
        this.applicationUrl = applicationUrl;
    }

    @Override
    public TransportToken getTransportToken() {
        return this.transportToken;
    }

    @Override
    public String getApplicationUrl() {
        return this.applicationUrl;
    }
}
