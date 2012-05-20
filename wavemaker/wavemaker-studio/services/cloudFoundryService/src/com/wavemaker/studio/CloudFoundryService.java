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

package com.wavemaker.studio;

import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.Cookie;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.client.lib.CloudFoundryException;
import org.cloudfoundry.client.lib.CloudService;
import org.springframework.http.HttpStatus;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.util.WebUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.cloudfoundry.CloudFoundryUtils;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.AuthenticationToken;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecret;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecretPropagation;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.TransportToken;
import com.wavemaker.tools.deployment.DeploymentDB;
import com.wavemaker.tools.deployment.cloudfoundry.CloudFoundryDeploymentTarget;

@ExposeToClient
public class CloudFoundryService {

    private static final Set<String> DATABASE_SERVICE_VENDORS = new HashSet<String>(Arrays.asList("postgresql", "mysql"));

    private final SharedSecretPropagation propagation = new SharedSecretPropagation();

    public String login(String username, String password, String target) {
        try {
            return new CloudFoundryClient(username, password, target).login();
        } catch (Throwable ex) {
            throw new WMRuntimeException("CloudFoundry login failed.", ex);
        }
    }

    public List<CloudApplication> listApps(String token, String target) {
        return execute(token, target, "Failed to retrieve CloudFoundry application list.", new CloudFoundryCallable<List<CloudApplication>>() {

            @Override
            public List<CloudApplication> call(CloudFoundryClient client) {
                return client.getApplications();
            }
        });
    }

    public List<CloudService> listServices(String token, String target) {
        return execute(token, target, "Failed to retrieve CloudFoundry service list.", new CloudFoundryCallable<List<CloudService>>() {

            @Override
            public List<CloudService> call(CloudFoundryClient client) {
                return client.getServices();
            }
        });
    }

    public List<CloudService> listDatabaseServices(String token, String target) {
        List<CloudService> databaseServices = new ArrayList<CloudService>();
        for (CloudService cloudService : listServices(token, target)) {
            if (isDatabaseService(cloudService)) {
                databaseServices.add(cloudService);
            }
        }
        return databaseServices;
    }

    private boolean isDatabaseService(CloudService cloudService) {
        return DATABASE_SERVICE_VENDORS.contains(cloudService.getVendor());
    }

    public CloudService getService(String token, String target, final String service) {
        return execute(token, target, "Failed to retrieve CloudFoundry service.", new CloudFoundryCallable<CloudService>() {

            @Override
            public CloudService call(CloudFoundryClient client) {
                return client.getService(service);
            }
        });
    }

    public boolean isServiceBound(String token, String target, String service, String appName) {
        List<String> services = getServicesForApplication(token, target, appName);
        return service != null && services.contains(service);
    }

    public List<String> getServicesForApplication(String token, String target, final String appName) {
        return execute(token, target, "Failed to retrieve CloudFoundry service.", new CloudFoundryCallable<List<String>>() {

            @Override
            public List<String> call(CloudFoundryClient client) {
                CloudApplication app = client.getApplication(appName);
                return app.getServices();
            }
        });
    }

    public void createService(String token, String target, final DeploymentDB db, final String appName) {
        execute(token, target, "Failed to create service in CloudFoundry.", new CloudFoundryRunnable() {

            @Override
            public void run(CloudFoundryClient client) {
                CloudService service = CloudFoundryDeploymentTarget.createPostgresqlService(db);
                client.createService(service);
                client.bindService(appName, service.getName());
            }
        });
    }

    public void createService(String token, String target, final String appName, final String dbName, final String dbVendor) {
        execute(token, target, "Failed to create service in CloudFoundry.", new CloudFoundryRunnable() {

            @Override
            public void run(CloudFoundryClient client) {
                CloudService service;
                if (dbVendor.equals(CloudFoundryDeploymentTarget.MYSQL_SERVICE_VENDOR)) {
                    service = CloudFoundryDeploymentTarget.createMySqlService(dbName);
                } else if (dbVendor.equals(CloudFoundryDeploymentTarget.POSTGRES_SERVICE_VENDOR)) {
                    service = CloudFoundryDeploymentTarget.createPostgresqlService(dbName);
                } else {
                    throw new WMRuntimeException("Error: Database vendor is not supported, vendor = " + dbVendor);
                }
                client.createService(service);
                client.bindService(appName, service.getName());
            }
        });
    }

    public void deleteService(String token, String target, final String service) {
        execute(token, target, "Failed to create service in CloudFoundry.", new CloudFoundryRunnable() {

            @Override
            public void run(CloudFoundryClient client) {
                client.deleteService(service);
            }
        });
    }

    public void bindService(String token, String target, final String service, final String appName) {
        execute(token, target, "Failed to bind service in CloudFoundry.", new CloudFoundryRunnable() {

            @Override
            public void run(CloudFoundryClient client) {
                client.bindService(appName, service);
            }
        });
    }

    private void execute(String token, String target, String errorMessage, final CloudFoundryRunnable runnable) {
        execute(token, target, errorMessage, new CloudFoundryCallable<Object>() {

            @Override
            public Object call(CloudFoundryClient client) {
                runnable.run(client);
                return null;
            }
        });
    }

    @HideFromClient
    private <V> V execute(String token, String target, String errorMessage, CloudFoundryCallable<V> callable) {
        try {
            if (!StringUtils.hasLength(token)) {
                token = getAuthenticationToken();
            }
            if (!StringUtils.hasLength(target)) {
                target = CloudFoundryUtils.getControllerUrl();
            }
            CloudFoundryClient client = new CloudFoundryClient(token, target);
            return callable.call(client);
        } catch (CloudFoundryException ex) {
            if (HttpStatus.FORBIDDEN == ex.getStatusCode()) {
                throw new WMRuntimeException(CloudFoundryDeploymentTarget.TOKEN_EXPIRED_RESULT);
            } else {
                throw new WMRuntimeException(errorMessage, ex);
            }
        } catch (MalformedURLException ex) {
            throw new WMRuntimeException(errorMessage, ex);
        }
    }

    private String getAuthenticationToken() {
        RuntimeAccess runtimeAccess = RuntimeAccess.getInstance();
        Assert.state(runtimeAccess != null, "Unable to access runtime information");
        Cookie cookie = WebUtils.getCookie(runtimeAccess.getRequest(), "wavemaker_authentication_token");
        Assert.state(cookie != null, "Unable to access security cookie");
        Assert.state(StringUtils.hasLength(cookie.getValue()), "Unable to access security cookie value");
        SharedSecret sharedSecret = this.propagation.getForSelf(false);
        Assert.state(sharedSecret != null, "Unable to access security shared secret");
        AuthenticationToken authenticationToken = sharedSecret.decrypt(TransportToken.decode(cookie.getValue()));
        return authenticationToken.toString();
    }

    private static interface CloudFoundryCallable<V> {

        V call(CloudFoundryClient client);
    };

    private static interface CloudFoundryRunnable {

        void run(CloudFoundryClient client);
    };

}
