
package org.cloudfoundry.spinup.deploy;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.springframework.util.Assert;

public class DefaultDeployableApplication implements DeployableApplication {

    private ApplicationNamer namer;

    private final File file;

    public DefaultDeployableApplication(File file, ApplicationNamer namer) {
        this.file = file;
        this.namer = namer;
    }

    @Override
    public CloudApplication deploy(CloudFoundryClient client) {
        CloudApplication deployed = findDeployed(client);
        if (deployed == null) {
            String name = this.namer.createNew();
            deployed = deployNew(client, name);
        }
        if (deployed.getRunningInstances() <= 0) {
            client.startApplication(deployed.getName());
        }
        return deployed;
    }

    private CloudApplication findDeployed(CloudFoundryClient client) {
        List<CloudApplication> applications = client.getApplications();
        for (CloudApplication application : applications) {
            if (this.namer.isMatch(application.getName())) {
                return application;
            }
        }
        return null;
    }

    private CloudApplication deployNew(CloudFoundryClient client, String name) {
        try {
            Assert.state(this.file.exists(), "Unable to find file " + this.file.getName());
            List<String> uris = Collections.singletonList(name + ".cloudfoundry.com");
            client.createApplication(name, CloudApplication.SPRING, client.getDefaultApplicationMemory(CloudApplication.SPRING), uris, null, true);
            client.uploadApplication(name, this.file);
            return client.getApplication(name);
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }
}
