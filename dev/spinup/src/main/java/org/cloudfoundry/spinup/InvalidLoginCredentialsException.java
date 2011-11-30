
package org.cloudfoundry.spinup;

public class InvalidLoginCredentialsException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public InvalidLoginCredentialsException(Exception cause) {
        super(cause);
    }
}
