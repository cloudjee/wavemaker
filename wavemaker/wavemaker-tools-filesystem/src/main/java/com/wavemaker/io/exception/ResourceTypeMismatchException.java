
package com.wavemaker.io.exception;

import com.wavemaker.io.Resource;
import com.wavemaker.io.ResourcePath;
import com.wavemaker.io.filesystem.ResourceType;

/**
 * Exception thrown when a {@link Resource} is requested as a particular type but an existing resource of another type
 * already exists.
 * 
 * @author Phillip Webb
 */
public class ResourceTypeMismatchException extends ResourceException {

    private static final long serialVersionUID = 1L;

    private final ResourcePath path;

    private final ResourceType actual;

    private final ResourceType expected;

    /**
     * Create a new {@link ResourceTypeMismatchException} instance.
     * 
     * @param path the path begin accessed
     * @param actual the actual type
     * @param expected the expected type
     */
    public ResourceTypeMismatchException(ResourcePath path, ResourceType actual, ResourceType expected) {
        super("Unable to access resource '" + path + "' as " + expected + " due to existing " + actual);
        this.path = path;
        this.actual = actual;
        this.expected = expected;
    }

    public ResourcePath getPath() {
        return this.path;
    }

    public ResourceType getActual() {
        return this.actual;
    }

    public ResourceType getExpected() {
        return this.expected;
    }

    /**
     * Throws a new {@link ResourceTypeMismatchException} if the actual type exists but does not match the expected type
     * 
     * @param path the path
     * @param actual the actual type
     * @param expected the expected type
     */
    public static void throwOnMismatch(ResourcePath path, ResourceType actual, ResourceType expected) {
        if (actual != null && actual != ResourceType.DOES_NOT_EXIST) {
            if (!(actual == expected)) {
                throw new ResourceTypeMismatchException(path, actual, expected);
            }
        }
    }

}
