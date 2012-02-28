
package com.wavemaker.tools.cloudfoundry.spinup;

import com.wavemaker.tools.cloudfoundry.spinup.authentication.LoginCredentials;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecret;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.TransportToken;

/**
 * Service that can be used to deploy, start and transfer a {@link SharedSecret} to a particular cloud foundry
 * application. This service is split into two distinct methods to help guard against cloud foundry timeouts.
 * {@link #login(SharedSecret, LoginCredentials)} is a short running operation used to provide access.
 * {@link #start(SharedSecret, String, TransportToken)} is a potentially long running operation that will deploy and
 * start the spun up application.
 * 
 * @see DefaultSpinupService
 * @author Phillip Webb
 */
public interface SpinupService {

    /**
     * Returns the domain that the service is working against. This value can be written in cookies.
     * 
     * @return the domain
     */
    String getDomain();

    /**
     * Login the user to cloud foundry and return a transport token for storage. This method should return quick enough
     * not to cause any cloud foundry timeout issues.
     * 
     * @param secret the shared secret
     * @param credentials the login credentials of the user
     * @return a transport token
     * @throw InvalidLoginCredentialsException if the login credentials are not valid
     */
    TransportToken login(SharedSecret secret, LoginCredentials credentials) throws InvalidLoginCredentialsException;

    /**
     * Start and transfer the {@link SharedSecret} to to a particular cloud foundry application. This method may be long
     * running and care should be taken to guard against cloud foundry timeouts.
     * 
     * @param secret the shared secret
     * @param username the username of the person performing the operation
     * @param transportToken the transport token used for authentication
     * @return the URL of the started application
     */
    String start(SharedSecret secret, String username, TransportToken transportToken);

}
