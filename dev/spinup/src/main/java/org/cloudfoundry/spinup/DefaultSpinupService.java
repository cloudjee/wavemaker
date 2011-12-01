
package org.cloudfoundry.spinup;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Collections;
import java.util.List;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.client.lib.CloudFoundryException;
import org.cloudfoundry.client.lib.archive.ApplicationArchive;
import org.cloudfoundry.spinup.authentication.AuthenticationToken;
import org.cloudfoundry.spinup.authentication.LoginCredentials;
import org.cloudfoundry.spinup.authentication.SharedSecret;
import org.cloudfoundry.spinup.authentication.SharedSecretPropagation;
import org.cloudfoundry.spinup.authentication.TransportToken;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.http.HttpStatus;
import org.springframework.util.Assert;

/**
 * Default implementation of {@link SpinupService}.
 * 
 * @author Phillip Webb
 */
public class DefaultSpinupService implements SpinupService {

    private static final int MAX_ATTEMPTS = 5;

    // FIXME logging in entire API

    private String controllerUrl;

    private ApplicationNamingStrategy namingStrategy;

    private ApplicationArchive archive;

    private String framework = CloudApplication.SPRING;

    private List<String> serviceNames = null;

    private Integer memory = null;

    private SharedSecretPropagation propagation = new SharedSecretPropagation();

    @Override
    public StartedApplication start(SharedSecret secret, LoginCredentials credentials) throws InvalidLoginCredentialsException {
        CloudFoundryClient cloudFoundryClient = getCloudFoundryClient(credentials);
        AuthenticationToken authenticationToken = new AuthenticationToken(login(cloudFoundryClient));
        return deployAndShareSecret(cloudFoundryClient, authenticationToken, secret);
    }

    private String login(CloudFoundryClient cloudFoundryClient) {
        try {
            return cloudFoundryClient.login();
        } catch (CloudFoundryException e) {
            if (HttpStatus.FORBIDDEN.equals(e.getStatusCode())) {
                throw new InvalidLoginCredentialsException(e);
            }
            throw e;
        }
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
        ApplicationDetails applicationDetails;
        try {
            applicationDetails = deployAsNecessary(cloudFoundryClient, authenticationToken);
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
        TransportToken transportToken = secret.encrypt(authenticationToken);
        this.propagation.sendTo(cloudFoundryClient, secret, applicationDetails.getName());
        return new DefaultStartedApplication(transportToken, applicationDetails.getUrl());
    }

    private ApplicationDetails deployAsNecessary(CloudFoundryClient cloudFoundryClient, AuthenticationToken authenticationToken) throws IOException {

        List<CloudApplication> applications = cloudFoundryClient.getApplications();
        for (CloudApplication application : applications) {
            for (String uri : application.getUris()) {
                ApplicationDetails applicationDetails = new ApplicationDetails(application.getName(), uri);
                if (this.namingStrategy.isMatch(applicationDetails)) {
                    return applicationDetails;
                }
            }
        }

        Integer memory = this.memory;
        if (memory == null) {
            memory = cloudFoundryClient.getDefaultApplicationMemory(this.framework);
        }

        ApplicationDetails applicationDetails = createApplicationWithUniqueUrl(cloudFoundryClient);
        cloudFoundryClient.uploadApplication(applicationDetails.getName(), this.archive);
        return applicationDetails;
    }

    private ApplicationDetails createApplicationWithUniqueUrl(CloudFoundryClient cloudFoundryClient) {
        for (int attempt = 1;; attempt++) {
            try {
                ApplicationDetails applicationDetails = this.namingStrategy.newApplicationDetails(this.controllerUrl);
                List<String> uris = Collections.singletonList(applicationDetails.getUrl());
                cloudFoundryClient.createApplication(applicationDetails.getName(), this.framework, this.memory, uris, this.serviceNames, true);
                return applicationDetails;
            } catch (CloudFoundryException e) {
                if (!HttpStatus.BAD_REQUEST.equals(e.getStatusCode()) || attempt > MAX_ATTEMPTS) {
                    throw e;
                }
            }
        }
    }

    /**
     * Sets the controller URL that should be used to access cloud foundry.
     * 
     * @param controllerUrl the controller URL
     */
    @Required
    public void setControllerUrl(String controllerUrl) {
        this.controllerUrl = controllerUrl;
    }

    /**
     * Set the naming strategy to use.
     * 
     * @param namingStrategy the naming strategy
     */
    @Required
    public void setNamingStrategy(ApplicationNamingStrategy namingStrategy) {
        this.namingStrategy = namingStrategy;
    }

    /**
     * Set the archive that should be deployed.
     * 
     * @param archive the archive
     */
    @Required
    public void setArchive(ApplicationArchive archive) {
        this.archive = archive;
    }

    /**
     * Set the framework of the deployed application. If not specified <tt>Spring</tt> is used.
     * 
     * @param framework the framework
     */
    public void setFramework(String framework) {
        this.framework = framework;
    }

    /**
     * Sets the service names that should be created with the application. Can be <tt>null</tt>.
     * 
     * @param serviceNames the service names
     */
    public void setServiceNames(List<String> serviceNames) {
        this.serviceNames = serviceNames;
    }

    /**
     * Sets the amount of memory to use for the deployed app. If not specified the default is used.
     * 
     * @param memory the amount of memory
     */
    public void setMemory(Integer memory) {
        this.memory = memory;
    }

    /**
     * Sets the {@link SharedSecretPropagation} method used to send shared secrets to the running app.
     * 
     * @param propagation the propagation
     */
    public void setPropagation(SharedSecretPropagation propagation) {
        this.propagation = propagation;
    }
}
