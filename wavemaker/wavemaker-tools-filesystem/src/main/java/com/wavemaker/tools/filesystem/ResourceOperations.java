
package com.wavemaker.tools.filesystem;

import com.wavemaker.tools.filesystem.exception.ResourceDoesNotExistException;

/**
 * Various operations that can be performed on a {@link Resource} or a {@link ResourceList}.
 * 
 * @author Phillip Webb
 */
public interface ResourceOperations {

    /**
     * Move this resource to the specified folder. Any duplicate {@link File}s will be replaced (existing {@link Folder}
     * resources will be merged).
     * 
     * @param folder the folder to move the resource to
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    void moveTo(Folder folder) throws ResourceDoesNotExistException;

    /**
     * Recursively copy this resource to the specified folder.Any duplicate {@link File}s will be replaced (existing
     * {@link Folder} resources will be merged).
     * 
     * @param folder the folder to copy the resource to
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    void copyTo(Folder folder) throws ResourceDoesNotExistException;

    /**
     * Delete the current resource. If this resource does not exist then no operation is performed.
     */
    void delete();

}
