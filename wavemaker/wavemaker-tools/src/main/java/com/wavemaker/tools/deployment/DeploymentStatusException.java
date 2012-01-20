
package com.wavemaker.tools.deployment;

/**
 * Exception thrown to indicate a status failure. Provides a means to return {@link #getStatusMessage() status message}
 * Strings to clients. Ideally this class should be removed and service calls should throw exceptions directly.
 * 
 * @author Phillip Webb
 */
public class DeploymentStatusException extends Exception {

    private static final long serialVersionUID = 1L;

    public DeploymentStatusException(String message) {
        super(message);
    }

    public DeploymentStatusException(String message, Throwable cause) {
        super(message, cause);
    }

    public String getStatusMessage() {
        return getMessage();
    }

}
