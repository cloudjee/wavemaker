
package org.cloudfoundry.spinup;

import java.net.MalformedURLException;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.spinup.authentication.AuthenticationToken;
import org.cloudfoundry.spinup.authentication.LoginCredentials;
import org.cloudfoundry.spinup.authentication.SharedSecret;
import org.cloudfoundry.spinup.authentication.SharedSecretPropagation;
import org.cloudfoundry.spinup.authentication.TransportToken;
import org.springframework.util.Assert;

/**
 * Default implementation of {@link SpinupService}.
 * 
 * @author Phillip Webb
 */
public class DefaultSpinupService implements SpinupService {

    private final String controllerUrl;

    public DefaultSpinupService(String controllerUrl) {
        Assert.notNull(controllerUrl, "ControllerURL must not be null");
        this.controllerUrl = controllerUrl;
    }

    @Override
    public StartedApplication start(SharedSecret secret, LoginCredentials credentials) {
        CloudFoundryClient cloudFoundryClient = getCloudFoundryClient(credentials);
        AuthenticationToken authenticationToken = new AuthenticationToken(cloudFoundryClient.login());
        return deployAndShareSecret(cloudFoundryClient, authenticationToken, secret);
    }

    private CloudFoundryClient getCloudFoundryClient(LoginCredentials credentials) {
        Assert.notNull(credentials, "Credential must not be null");
        try {
            return new CloudFoundryClient(credentials.getUsername(), credentials.getUsername(), this.controllerUrl);
        } catch (MalformedURLException e) {
            throw new IllegalStateException(e);
        }
    }

    private StartedApplication deployAndShareSecret(CloudFoundryClient cloudFoundryClient, AuthenticationToken authenticationToken,
        SharedSecret secret) {

        CloudApplication application = deployAsRequired();

        TransportToken transportToken = secret.encrypt(authenticationToken);
        SharedSecretPropagation propagation = new SharedSecretPropagation(cloudFoundryClient);
        propagation.sendTo(secret, application);

        String applicationUrl = getApplicationUrl(application);
        return new DefaultStartedApplication(transportToken, applicationUrl);
    }

    private CloudApplication deployAsRequired() {

        // TODO Auto-generated method stub
        return null;
    }

    private String getApplicationUrl(CloudApplication application) {
        // TODO Auto-generated method stub
        return null;
    }
}
