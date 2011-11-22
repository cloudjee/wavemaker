
package org.cloudfoundry.spinup;

import java.net.MalformedURLException;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.spinup.authentication.AuthenticationToken;
import org.cloudfoundry.spinup.authentication.LoginCredentials;
import org.cloudfoundry.spinup.authentication.SharedSecret;
import org.cloudfoundry.spinup.authentication.SharedSecretPropagation;
import org.cloudfoundry.spinup.authentication.TransportToken;
import org.cloudfoundry.spinup.deploy.DeployableApplication;
import org.springframework.util.Assert;

/**
 * Default implementation of {@link SpinupService}.
 * 
 * @author Phillip Webb
 */
public class DefaultSpinupService implements SpinupService {

    private final String controllerUrl;

    private SharedSecretPropagation propagation = new SharedSecretPropagation();

    private final DeployableApplication deployable;

    public DefaultSpinupService(String controllerUrl, DeployableApplication deployable) {
        Assert.notNull(controllerUrl, "ControllerURL must not be null");
        Assert.notNull(deployable, "Deployable must not be null");
        this.controllerUrl = controllerUrl;
        this.deployable = deployable;
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
            return new CloudFoundryClient(credentials.getUsername(), credentials.getPassword(), this.controllerUrl);
        } catch (MalformedURLException e) {
            throw new IllegalStateException(e);
        }
    }

    private StartedApplication deployAndShareSecret(CloudFoundryClient cloudFoundryClient, AuthenticationToken authenticationToken,
        SharedSecret secret) {

        CloudApplication application = this.deployable.deploy(cloudFoundryClient);

        TransportToken transportToken = secret.encrypt(authenticationToken);
        this.propagation.sendTo(cloudFoundryClient, secret, application);

        String applicationUrl = getApplicationUrl(application);
        return new DefaultStartedApplication(transportToken, applicationUrl);
    }

    private String getApplicationUrl(CloudApplication application) {
        // TODO Auto-generated method stub
        return "http://pwwmtest.cloudfoundry.com";
    }

    public void setPropagation(SharedSecretPropagation propagation) {
        this.propagation = propagation;
    }
}
