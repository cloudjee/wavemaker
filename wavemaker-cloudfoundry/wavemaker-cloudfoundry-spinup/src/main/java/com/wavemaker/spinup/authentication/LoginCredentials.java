
package com.wavemaker.spinup.authentication;

/**
 * Login credentials (username and password).
 * 
 * @author Phillip Webb
 */
public interface LoginCredentials {

    /**
     * Returns the username.
     * 
     * @return The username
     */
    String getUsername();

    /**
     * Returns the password.
     * 
     * @return the password.
     */
    String getPassword();
}
