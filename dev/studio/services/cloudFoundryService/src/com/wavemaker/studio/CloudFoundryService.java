
package com.wavemaker.studio;

import java.net.MalformedURLException;
import java.util.List;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.client.lib.CloudFoundryException;
import org.springframework.http.HttpStatus;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.tools.deployment.cloudfoundry.VmcDeploymentTarget;

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
}
