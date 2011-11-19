
package org.cloudfoundry.spinup;

import java.net.MalformedURLException;

import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.spinup.authentication.AuthenticationToken;
import org.cloudfoundry.spinup.authentication.LoginCredentials;
import org.cloudfoundry.spinup.authentication.SharedSecret;
import org.springframework.util.Assert;

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
        String redirectUrl = deployAndShareSecret(cloudFoundryClient, secret);

        return null;
    }

    private CloudFoundryClient getCloudFoundryClient(LoginCredentials credentials) {
        Assert.notNull(credentials, "Credential must not be null");
        try {
            return new CloudFoundryClient(credentials.getUsername(), credentials.getUsername(), this.controllerUrl);
        } catch (MalformedURLException e) {
            throw new IllegalStateException(e);
        }
    }

    private String deployAndShareSecret(CloudFoundryClient cloudFoundryClient, SharedSecret secret) {
        // TODO Auto-generated method stub

        // get applications
        cloudFoundryClient.getApplications();

        // See if an application matches the name we want

        // if not deploy the application

        // encrypt token

        // transfer the token

        // return a new result
        return null;
    }

}
