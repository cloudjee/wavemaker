
package com.wavemaker.io.exception;

import com.wavemaker.io.Resource;

/**
 * {@link RuntimeException} used to wrap {@link Resource} {@link Exception}s.
 * 
 * @author Phillip Webb
 */
public class ResourceException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ResourceException() {
    }

    public ResourceException(Exception source) {
        super(source);
    }

    public ResourceException(String message) {
        super(message);
    }

    public ResourceException(String message, Throwable cause) {
        super(message, cause);
    }

}
