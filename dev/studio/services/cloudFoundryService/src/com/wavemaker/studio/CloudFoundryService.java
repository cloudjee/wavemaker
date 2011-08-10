package com.wavemaker.studio;

import java.util.List;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;

import com.wavemaker.common.WMRuntimeException;

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
        } catch (Throwable ex) {
            throw new WMRuntimeException("Failed to retrieve CloudFoundry application list.", ex);
        }
    }
    
}
