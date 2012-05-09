/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.cloudfoundry.spinup;

import java.net.MalformedURLException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.client.lib.CloudFoundryException;
import org.cloudfoundry.client.lib.CloudService;
import org.cloudfoundry.client.lib.archive.ApplicationArchive;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.http.HttpStatus;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.wavemaker.tools.cloudfoundry.CloudFoundryUtils;
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

    private static final String CLOUD_CONTROLLER_VARIABLE_NAME = "cloudcontroller";

    private final Log logger = LogFactory.getLog(getClass());

    private static final int MAX_NAMING_ATTEMPTS = 5;

    private static final int MAX_UPLOAD_ATTEMPTS = 3;

    private String controllerUrl;

    private ApplicationNamingStrategy namingStrategy;

    private ApplicationArchiveFactory archiveFactory;

    private String framework = CloudApplication.SPRING;

    private List<CloudService> services;

    private List<String> serviceNames = null;

    private Integer memory = null;

    private SharedSecretPropagation propagation = new SharedSecretPropagation();

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
        String systemEnv = System.getenv(CLOUD_CONTROLLER_VARIABLE_NAME);
        if (StringUtils.hasLength(systemEnv)) {
            return systemEnv;
        }
        systemEnv = System.getProperty(CLOUD_CONTROLLER_VARIABLE_NAME);
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
     * Sets the services that should be created (if they don't already exist).
     * 
     * @param services the services to create
     */
    public void setServices(List<CloudService> services) {
        this.services = services;
    }

    /**
     * Sets the service names that should be created with the application. Can be <tt>null</tt>.
     * 
     * @param serviceNames the service names
     * @see
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
            CloudFoundryUtils.restartApplicationAndWaitUntilRunning(this.cloudFoundryClient, applicationDetails.getName());
            return applicationDetails.getUrl();
        }

        private ApplicationDetails deployAsNecessary() {
            boolean upgrading = false;
            List<CloudApplication> applications = this.cloudFoundryClient.getApplications();
            for (CloudApplication application : applications) {
                for (String uri : application.getUris()) {
                    if (!uri.startsWith("http")) {
                        uri = "http://" + uri;
                    }
                    ApplicationDetails applicationDetails = new ApplicationDetails(application.getName(), uri);
                    if (DefaultSpinupService.this.namingStrategy.isMatch(applicationDetails)) {
                        upgrading = DefaultSpinupService.this.namingStrategy.isUpgradeRequired(applicationDetails);
                        if (!upgrading) {
                            if (DefaultSpinupService.this.logger.isDebugEnabled()) {
                                DefaultSpinupService.this.logger.debug("Skipping deployment of already installed up to date application "
                                    + applicationDetails.getName());
                            }
                            return applicationDetails;
                        } else {
                            deleteExistingApplication(applicationDetails);
                        }
                    }
                }
            }
            addMissingServices();
            ApplicationDetails applicationDetails = createApplicationWithUniqueUrl();
            if (DefaultSpinupService.this.logger.isDebugEnabled()) {
                DefaultSpinupService.this.logger.debug("Uploading application " + applicationDetails.getName());
            }
            uploadApplication(applicationDetails.getName());
            CloudApplication application = this.cloudFoundryClient.getApplication(applicationDetails.getName());
            Map<String, String> env = new HashMap<String, String>(application.getEnvAsMap());
            env.put(CLOUD_CONTROLLER_VARIABLE_NAME, getControllerUrl());
            this.cloudFoundryClient.updateApplicationEnv(applicationDetails.getName(), env);
            return applicationDetails;
        }

        private void deleteExistingApplication(ApplicationDetails applicationDetails) {
            this.cloudFoundryClient.deleteApplication(applicationDetails.getName());
        }

        private void uploadApplication(String name) {
            try {
                ApplicationArchive archive = DefaultSpinupService.this.archiveFactory.getArchive();
                try {
                    uploadApplication(name, archive, 1);
                } finally {
                    DefaultSpinupService.this.archiveFactory.closeArchive(archive);
                }
            } catch (Exception e) {
                if (e instanceof RuntimeException) {
                    throw (RuntimeException) e;
                }
                throw new IllegalStateException(e);
            }
        }

        private void uploadApplication(String name, ApplicationArchive archive, int attempt) {
            try {
                this.cloudFoundryClient.uploadApplication(name, archive);
            } catch (Exception e) {
                if (attempt >= MAX_UPLOAD_ATTEMPTS) {
                    throw new IllegalStateException(e);
                } else {
                    try {
                        Thread.sleep(200);
                    } catch (InterruptedException interruptedException) {
                    }
                    uploadApplication(name, archive, attempt + 1);
                }
            }
        }

        private void addMissingServices() {
            if (DefaultSpinupService.this.services != null) {
                Map<String, CloudService> servicesByName = getServicesByName();
                List<CloudService> existingServices = this.cloudFoundryClient.getServices();
                for (CloudService existingService : existingServices) {
                    servicesByName.remove(existingService.getName());
                }
                for (CloudService cloudService : servicesByName.values()) {
                    this.cloudFoundryClient.createService(cloudService);
                }
            }
        }

        private Map<String, CloudService> getServicesByName() {
            Map<String, CloudService> servicesByName = new HashMap<String, CloudService>();
            for (CloudService service : DefaultSpinupService.this.services) {
                servicesByName.put(service.getName(), service);
            }
            return servicesByName;
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
                        DefaultSpinupService.this.serviceNames, false);
                    return applicationDetails;
                } catch (CloudFoundryException e) {
                    if (!HttpStatus.BAD_REQUEST.equals(e.getStatusCode()) || attempt >= MAX_NAMING_ATTEMPTS) {
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
