
package com.wavemaker.io.exception;

/**
 * {@link ResourceException} thrown when a resource already exists.
 * 
 * @author Phillip Webb
 */
public class ResourceExistsException extends ResourceException {

    private static final long serialVersionUID = 1L;

    public ResourceExistsException(String message) {
        super(message);
    }

    public ResourceExistsException(String message, Throwable cause) {
        super(message, cause);
    }

}
