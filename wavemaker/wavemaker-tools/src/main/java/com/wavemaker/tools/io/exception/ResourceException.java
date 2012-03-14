
package com.wavemaker.tools.io.exception;

/**
 * {@link RuntimeException} used to wrap {@link Resource} {@link Exception}s.
 * 
 * @author Phillip Webb
 */
public class ResourceException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ResourceException() {
    }

    public ResourceException(Throwable cause) {
        super(cause);
    }

    public ResourceException(String message) {
        super(message);
    }

    public ResourceException(String message, Throwable cause) {
        super(message, cause);
    }

}
