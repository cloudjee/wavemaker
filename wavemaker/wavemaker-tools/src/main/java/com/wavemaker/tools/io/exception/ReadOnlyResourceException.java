
package com.wavemaker.tools.io.exception;

public class ReadOnlyResourceException extends ResourceException {

    private static final long serialVersionUID = 1L;

    public ReadOnlyResourceException() {
        super();
    }

    public ReadOnlyResourceException(Throwable cause) {
        super(cause);
    }

    public ReadOnlyResourceException(String message, Throwable cause) {
        super(message, cause);
    }

    public ReadOnlyResourceException(String message) {
        super(message);
    }

}
