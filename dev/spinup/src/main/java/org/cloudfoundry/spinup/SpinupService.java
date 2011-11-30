
package org.cloudfoundry.spinup;

import org.cloudfoundry.spinup.authentication.LoginCredentials;
import org.cloudfoundry.spinup.authentication.SharedSecret;

/**
 * Service that can be used to deploy, start and transfer a {@link SharedSecret} to a particular cloud foundry
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
     * @throw InvalidLoginCredentialsException if the login credentials are not valid
     */
    StartedApplication start(SharedSecret secret, LoginCredentials credentials) throws InvalidLoginCredentialsException;

}
