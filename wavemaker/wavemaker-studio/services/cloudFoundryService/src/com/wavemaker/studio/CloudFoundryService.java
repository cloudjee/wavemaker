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
import java.util.List;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.client.lib.CloudFoundryException;
import org.cloudfoundry.client.lib.CloudService;
import org.springframework.http.HttpStatus;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.tools.deployment.DeploymentDB;
import com.wavemaker.tools.deployment.cloudfoundry.CloudFoundryDeploymentTarget;

@ExposeToClient
public class CloudFoundryService {

    public String login(String username, String password, String target) {
        try {
            return new CloudFoundryClient(username, password, target).login();
        } catch (Throwable ex) {
            throw new WMRuntimeException("CloudFoundry login failed.", ex);
        }
    }

    public List<CloudApplication> listApps(String token, String target) {
        try {
            return new CloudFoundryClient(token, target).getApplications();
        } catch (CloudFoundryException ex) {
            if (HttpStatus.FORBIDDEN == ex.getStatusCode()) {
                throw new WMRuntimeException(CloudFoundryDeploymentTarget.TOKEN_EXPIRED_RESULT);
            } else {
                throw new WMRuntimeException("Failed to retrieve CloudFoundry application list.", ex);
            }
        } catch (MalformedURLException ex) {
            throw new WMRuntimeException("Failed to retrieve CloudFoundry application list.", ex);
        }
    }

    public List<CloudService> listServices(String token, String target) {
        try {
            return new CloudFoundryClient(token, target).getServices();
        } catch (CloudFoundryException ex) {
            if (HttpStatus.FORBIDDEN == ex.getStatusCode()) {
                throw new WMRuntimeException(CloudFoundryDeploymentTarget.TOKEN_EXPIRED_RESULT);
            } else {
                throw new WMRuntimeException("Failed to retrieve CloudFoundry service list.", ex);
            }
        } catch (MalformedURLException ex) {
            throw new WMRuntimeException("Failed to retrieve CloudFoundry service list.", ex);
        }
    }

    public CloudService getService(String token, String target, String service) {
        try {
            return new CloudFoundryClient(token, target).getService(service);
        } catch (CloudFoundryException ex) {
            if (HttpStatus.FORBIDDEN == ex.getStatusCode()) {
                throw new WMRuntimeException(CloudFoundryDeploymentTarget.TOKEN_EXPIRED_RESULT);
            } else if (HttpStatus.NOT_FOUND == ex.getStatusCode()) {
                return null;
            } else {
                throw new WMRuntimeException("Failed to retrieve CloudFoundry service.", ex);
            }
        } catch (MalformedURLException ex) {
            throw new WMRuntimeException("Failed to retrieve CloudFoundry service.", ex);
        }
    }

    public void createService(String token, String target, DeploymentDB db, String appName) {
        try {
            CloudFoundryClient client = new CloudFoundryClient(token, target);
            CloudService service = CloudFoundryDeploymentTarget.createPostgresqlService(db);
            client.createService(service);
            client.bindService(appName, service.getName());

        } catch (CloudFoundryException ex) {
            if (HttpStatus.FORBIDDEN == ex.getStatusCode()) {
                throw new WMRuntimeException(CloudFoundryDeploymentTarget.TOKEN_EXPIRED_RESULT);
            } else {
                throw new WMRuntimeException("Failed to create service in CloudFoundry.", ex);
            }
        } catch (MalformedURLException ex) {
            throw new WMRuntimeException("Failed to create service in CloudFoundry.", ex);
        }
    }

    public void deleteService(String token, String target, String service) {
        try {
            CloudFoundryClient client = new CloudFoundryClient(token, target);
            client.deleteService(service);
        } catch (CloudFoundryException ex) {
            if (HttpStatus.FORBIDDEN == ex.getStatusCode()) {
                throw new WMRuntimeException(CloudFoundryDeploymentTarget.TOKEN_EXPIRED_RESULT);
            } else {
                throw new WMRuntimeException("Failed to delete service in CloudFoundry.", ex);
            }
        } catch (MalformedURLException ex) {
            throw new WMRuntimeException("Failed to delete service in CloudFoundry.", ex);
        }
    }
}
