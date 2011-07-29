package com.wavemaker.studio;

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
}
