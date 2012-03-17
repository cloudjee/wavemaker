
package com.wavemaker.tools.io;

/**
 * An operation that can be performed on a {@link Resource}s.
 * 
 * @see Folder#doRecursively(ResourceOperation)
 * 
 * @author Phillip Webb
 */
public interface ResourceOperation<T extends Resource> {

    /**
     * Perform the given operation on the resource.
     * 
     * @param resource the resource
     */
    void perform(T resource);

}
