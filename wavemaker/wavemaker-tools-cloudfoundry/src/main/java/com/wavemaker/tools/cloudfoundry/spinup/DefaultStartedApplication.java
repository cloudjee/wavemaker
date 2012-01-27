
package com.wavemaker.tools.cloudfoundry.spinup;

import org.springframework.util.Assert;

import com.wavemaker.tools.cloudfoundry.spinup.authentication.TransportToken;

/**
 * Default implementation of {@link StartedApplication}.
 * 
 * @author Phillip Webb
 */
public class DefaultStartedApplication implements StartedApplication {

    private final TransportToken transportToken;

    private final String applicationUrl;

    private final String domain;

    /**
     * Create a new {@link DefaultStartedApplication} implementation.
     * 
     * @param transportToken the transport token
     * @param applicationUrl the redirect URL
     */
    public DefaultStartedApplication(TransportToken transportToken, String applicationUrl, String domain) {
        Assert.notNull(transportToken, "TransportToken must not be null");
        Assert.notNull(applicationUrl, "ApplicationUrl must not be null");
        this.transportToken = transportToken;
        this.applicationUrl = applicationUrl;
        this.domain = domain;
    }

    @Override
    public TransportToken getTransportToken() {
        return this.transportToken;
    }

    @Override
    public String getApplicationUrl() {
        return this.applicationUrl;
    }

    @Override
    public String getDomain() {
        return this.domain;
    }
}
