
package com.wavemaker.io;

import com.wavemaker.io.exception.ResourceDoesNotExistException;

/**
 * An {@link Iterable} collections of {@link Resource}s that also support various {@link ResourceOperations operations}.
 * 
 * @author Phillip Webb
 */
public interface Resources<T extends Resource> extends Iterable<T> {

    /**
     * Delete the current resource (and any children). If this resource does not exist then no operation is performed.
     */
    void delete();

    /**
     * Move this resource to the specified folder. Any duplicate {@link File}s will be replaced (existing {@link Folder}
     * resources will be merged). If the resource does not exist no operation is performed.
     * 
     * @param folder the folder to move the resource to
     * @return a resource collection containing the new destination resources
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    Resources<T> moveTo(Folder folder);

    /**
     * Recursively copy this resource to the specified folder.Any duplicate {@link File}s will be replaced (existing
     * {@link Folder} resources will be merged). If the resource does not exist no operation is performed.
     * 
     * @param folder the folder to copy the resource to
     * @return a resource collection containing the new destination resources
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    Resources<T> copyTo(Folder folder);
}
