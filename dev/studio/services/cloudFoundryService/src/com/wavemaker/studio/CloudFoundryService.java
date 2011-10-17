
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
import com.wavemaker.tools.deployment.cloudfoundry.VmcDeploymentTarget;
import com.wavemaker.tools.deployment.DeploymentDB;

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
                throw new WMRuntimeException(VmcDeploymentTarget.TOKEN_EXPIRED_RESULT);
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
                throw new WMRuntimeException(VmcDeploymentTarget.TOKEN_EXPIRED_RESULT);
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
                throw new WMRuntimeException(VmcDeploymentTarget.TOKEN_EXPIRED_RESULT);
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
            CloudService service = VmcDeploymentTarget.createPostgresqlService(db);
            client.createService(service);
            client.bindService(appName, service.getName());

        } catch (CloudFoundryException ex) {
            if (HttpStatus.FORBIDDEN == ex.getStatusCode()) {
                throw new WMRuntimeException(VmcDeploymentTarget.TOKEN_EXPIRED_RESULT);
            } else {
                throw new WMRuntimeException("Failed to create service in CloudFoundry.", ex);
            }
        } catch (MalformedURLException ex) {
            throw new WMRuntimeException("Failed to create service in CloudFoundry.", ex);
        }
    }

    public void deleteService(String token, String target, DeploymentDB db) {
        try {
            CloudFoundryClient client = new CloudFoundryClient(token, target);
            client.deleteService(db.getDbName());
        } catch (CloudFoundryException ex) {
            if (HttpStatus.FORBIDDEN == ex.getStatusCode()) {
                throw new WMRuntimeException(VmcDeploymentTarget.TOKEN_EXPIRED_RESULT);
            } else {
                throw new WMRuntimeException("Failed to delete service in CloudFoundry.", ex);
            }
        } catch (MalformedURLException ex) {
            throw new WMRuntimeException("Failed to delete service in CloudFoundry.", ex);
        }
    }
}
