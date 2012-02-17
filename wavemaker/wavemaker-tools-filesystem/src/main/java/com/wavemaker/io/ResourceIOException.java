
package com.wavemaker.io;

import java.io.IOException;

/**
 * {@link RuntimeException} used to wrap {@link Resource} {@link IOException}s.
 * 
 * @author Phillip Webb
 */
public class ResourceIOException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ResourceIOException(IOException source) {
        super(source);
    }

}
