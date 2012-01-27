
package com.wavemaker.tools.cloudfoundry.spinup;

import java.net.MalformedURLException;
import java.util.Collections;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.client.lib.CloudFoundryException;
import org.cloudfoundry.client.lib.archive.ApplicationArchive;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.http.HttpStatus;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.wavemaker.tools.cloudfoundry.spinup.authentication.AuthenticationToken;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.LoginCredentials;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecret;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecretPropagation;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.TransportToken;

/**
 * Default implementation of {@link SpinupService}.
 * 
 * @author Phillip Webb
 */
public class DefaultSpinupService implements SpinupService {

    private final Log logger = LogFactory.getLog(getClass());

    private static final int MAX_ATTEMPTS = 5;

    private String controllerUrl;

    private ApplicationNamingStrategy namingStrategy;

    private ApplicationArchiveFactory archiveFactory;

    private String framework = CloudApplication.SPRING;

    private List<String> serviceNames = null;

    private Integer memory = null;

    private SharedSecretPropagation propagation = new SharedSecretPropagation();

    @Override
    @Deprecated
    public StartedApplication start(SharedSecret secret, LoginCredentials credentials) throws InvalidLoginCredentialsException {
        Assert.notNull(secret, "Secret must not be null");
        Assert.notNull(credentials, "Credentials must not be null");
        if (this.logger.isDebugEnabled()) {
            this.logger.debug("Starting Cloud Foundry application");
        }
        TransportToken transportToken = login(secret, credentials);
        String applicationUrl = start(secret, credentials.getUsername(), transportToken);
        return new DefaultStartedApplication(transportToken, applicationUrl, getDomain());
    }

    @Override
    public String getDomain() {
        String domain = getControllerUrl().toLowerCase();
        domain = stripPrefix(domain, "http://");
        domain = stripPrefix(domain, "http://");
        domain = stripPrefix(domain, "api.");
        domain = "." + domain;
        return domain;
    }

    private String stripPrefix(String s, String prefix) {
        if (s.startsWith(prefix)) {
            return s.substring(prefix.length());
        }
        return s;
    }

    @Override
    public TransportToken login(SharedSecret secret, LoginCredentials credentials) throws InvalidLoginCredentialsException {
        Assert.notNull(secret, "Secret must not be null");
        Assert.notNull(credentials, "Credentials must not be null");
        CloudFoundryClient cloudFoundryClient = getCloudFoundryClient(credentials);
        AuthenticationToken authenticationToken = new AuthenticationToken(login(cloudFoundryClient));
        return secret.encrypt(authenticationToken);
    }

    @Override
    public String start(SharedSecret secret, String username, TransportToken transportToken) {
        Assert.notNull(secret, "Secret must not be null");
        Assert.notNull(transportToken, "TransportToken must not be null");
        AuthenticationToken authenticationToken = secret.decrypt(transportToken);
        CloudFoundryClient cloudFoundryClient = getCloudFoundryClient(authenticationToken);
        return new ApplicationStarter(cloudFoundryClient, username, secret).start();
    }

    protected CloudFoundryClient getCloudFoundryClient(LoginCredentials credentials) {
        try {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("Cloud foundry client for user " + credentials.getUsername() + " at " + getControllerUrl());
            }
            return new CloudFoundryClient(credentials.getUsername(), credentials.getPassword(), getControllerUrl());
        } catch (MalformedURLException e) {
            throw new IllegalStateException(e);
        }
    }

    protected CloudFoundryClient getCloudFoundryClient(AuthenticationToken token) {
        try {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("Cloud foundry client for user authenticated user at " + getControllerUrl());
            }
            return new CloudFoundryClient(token.toString(), getControllerUrl());
        } catch (MalformedURLException e) {
            throw new IllegalStateException(e);
        }
    }

    private String login(CloudFoundryClient cloudFoundryClient) {
        try {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("Logging into cloud foundry");
            }
            return cloudFoundryClient.login();
        } catch (CloudFoundryException e) {
            if (HttpStatus.FORBIDDEN.equals(e.getStatusCode())) {
                if (this.logger.isDebugEnabled()) {
                    this.logger.debug("Login failed, thowing InvalidLoginCredentialsException");
                }
                throw new InvalidLoginCredentialsException(e);
            }
            throw e;
        }
    }

    /**
     * Sets the controller URL that should be used to access cloud foundry. If not specified the controller URL is
     * deduced.
     * 
     * @param controllerUrl the controller URL
     */
    public void setControllerUrl(String controllerUrl) {
        this.controllerUrl = controllerUrl;
    }

    /**
     * @return The actual controller URL to use.
     */
    private String getControllerUrl() {
        if (StringUtils.hasLength(this.controllerUrl)) {
            return this.controllerUrl;
        }
        String systemEnv = System.getenv("spinup_target");
        if (StringUtils.hasLength(systemEnv)) {
            return systemEnv;
        }
        systemEnv = System.getProperty("spinup_target");
        if (StringUtils.hasLength(systemEnv)) {
            return systemEnv;
        }
        return "http://api.cloudfoundry.com";
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
     * Set the factory used to create the archive that should be deployed.
     * 
     * @param archiveFactory the archive factory
     */
    public void setArchiveFactory(ApplicationArchiveFactory archiveFactory) {
        this.archiveFactory = archiveFactory;
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
        // FIXME we may need a way to provision services as well as define the names
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

    private class ApplicationStarter {

        private final CloudFoundryClient cloudFoundryClient;

        private final String username;

        private final SharedSecret secret;

        public ApplicationStarter(CloudFoundryClient cloudFoundryClient, String username, SharedSecret secret) {
            this.cloudFoundryClient = cloudFoundryClient;
            this.username = username;
            this.secret = secret;
        }

        public String start() {
            ApplicationDetails applicationDetails = deployAsNecessary();
            DefaultSpinupService.this.propagation.sendTo(this.cloudFoundryClient, this.secret, applicationDetails.getName());
            if (DefaultSpinupService.this.logger.isDebugEnabled()) {
                DefaultSpinupService.this.logger.debug("Starting application " + applicationDetails.getName());
            }
            this.cloudFoundryClient.startApplication(applicationDetails.getName());
            return applicationDetails.getUrl();
        }

        private ApplicationDetails deployAsNecessary() {
            List<CloudApplication> applications = this.cloudFoundryClient.getApplications();
            for (CloudApplication application : applications) {
                for (String uri : application.getUris()) {
                    if (!uri.startsWith("http")) {
                        uri = "http://" + uri;
                    }
                    ApplicationDetails applicationDetails = new ApplicationDetails(application.getName(), uri);
                    if (DefaultSpinupService.this.namingStrategy.isMatch(applicationDetails)) {
                        if (DefaultSpinupService.this.logger.isDebugEnabled()) {
                            DefaultSpinupService.this.logger.debug("Skipping deployment of already running application "
                                + applicationDetails.getName());
                        }
                        return applicationDetails;
                    }
                }
            }

            ApplicationDetails applicationDetails = createApplicationWithUniqueUrl();
            if (DefaultSpinupService.this.logger.isDebugEnabled()) {
                DefaultSpinupService.this.logger.debug("Uploading application " + applicationDetails.getName());
            }
            uploadApplication(applicationDetails.getName());
            return applicationDetails;
        }

        private void uploadApplication(String name) {
            try {
                ApplicationArchive archive = DefaultSpinupService.this.archiveFactory.getArchive();
                try {
                    this.cloudFoundryClient.uploadApplication(name, archive);
                } finally {
                    DefaultSpinupService.this.archiveFactory.closeArchive(archive);
                }
            } catch (Exception e) {
                throw new IllegalStateException(e);
            }
        }

        private ApplicationDetails createApplicationWithUniqueUrl() {
            Integer memory = DefaultSpinupService.this.memory;
            if (memory == null) {
                memory = this.cloudFoundryClient.getDefaultApplicationMemory(DefaultSpinupService.this.framework);
            }
            for (int attempt = 1;; attempt++) {
                try {
                    ApplicationNamingStrategyContext context = newApplicationNamingStrategyContext(attempt);
                    ApplicationDetails applicationDetails = DefaultSpinupService.this.namingStrategy.newApplicationDetails(context);
                    if (DefaultSpinupService.this.logger.isDebugEnabled()) {
                        DefaultSpinupService.this.logger.debug("Named application " + applicationDetails.getName() + " URL "
                            + applicationDetails.getUrl() + " attempt #" + attempt);
                    }
                    List<String> uris = Collections.singletonList(applicationDetails.getUrl());
                    this.cloudFoundryClient.createApplication(applicationDetails.getName(), DefaultSpinupService.this.framework, memory, uris,
                        DefaultSpinupService.this.serviceNames, true);
                    return applicationDetails;
                } catch (CloudFoundryException e) {
                    if (!HttpStatus.BAD_REQUEST.equals(e.getStatusCode()) || attempt >= MAX_ATTEMPTS) {
                        if (DefaultSpinupService.this.logger.isDebugEnabled()) {
                            DefaultSpinupService.this.logger.debug("Application naming failed due to exception after " + attempt + " attempts");
                        }
                        throw e;
                    }
                }
            }
        }

        private ApplicationNamingStrategyContext newApplicationNamingStrategyContext(final int attempt) {
            return new ApplicationNamingStrategyContext() {

                @Override
                public String getUsername() {
                    return ApplicationStarter.this.username;
                }

                @Override
                public String getControllerUrl() {
                    return DefaultSpinupService.this.getControllerUrl();
                }

                @Override
                public int getAttemptNumber() {
                    return attempt;
                }
            };
        }
    }
}
