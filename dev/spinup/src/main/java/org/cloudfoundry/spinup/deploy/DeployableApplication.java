
package org.cloudfoundry.spinup.deploy;

import org.cloudfoundry.client.lib.CloudApplication;
import org.cloudfoundry.client.lib.CloudFoundryClient;

public interface DeployableApplication {

    CloudApplication deploy(CloudFoundryClient cloudFoundryClient);

}
