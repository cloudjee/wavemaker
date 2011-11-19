
package org.cloudfoundry.spinup;

import org.cloudfoundry.spinup.authentication.LoginCredentials;
import org.cloudfoundry.spinup.authentication.SharedSecret;

/**
 * Service that can be used to deploy, start and transfer a {@link SharedSecret} to a particular cloudfoundry
 * application.
 * 
 * @see DefaultSpinupService
 * @author Phillip Webb
 */
public interface SpinupService {

    /**
     * Deploy and start the application managed by this service. The application will be deployed as necessary and the
     * given {@link SharedSecret} will be transferred.
     * 
     * @param secret the shared secret
     * @param credentials the login credentials of the user
     * @return the started application
     */
    StartedApplication start(SharedSecret secret, LoginCredentials credentials);

}
