
package com.wavemaker.tools.cloudfoundry;

/**
 * Exception thrown in the case of invalid login credentials.
 * 
 * @author Phillip Webb
 */
public class InvalidLoginCredentialsException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public InvalidLoginCredentialsException(Exception cause) {
        super(cause);
    }
}
