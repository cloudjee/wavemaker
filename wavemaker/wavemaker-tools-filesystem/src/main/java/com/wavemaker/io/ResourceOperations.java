
package com.wavemaker.io;

/**
 * Various operations that can be performed on a {@link Resource} or a {@link Resources}.
 * 
 * @author Phillip Webb
 */
public interface ResourceOperations {

    /**
     * Delete the current resource (and any children). If this resource does not exist then no operation is performed.
     */
    void delete();

    /**
     * Move this resource to the specified folder. Any duplicate {@link File}s will be replaced (existing {@link Folder}
     * resources will be merged). If the resource does not exist no operation is performed.
     * 
     * @param folder the folder to move the resource to
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    void moveTo(Folder folder);

    /**
     * Recursively copy this resource to the specified folder.Any duplicate {@link File}s will be replaced (existing
     * {@link Folder} resources will be merged). If the resource does not exist no operation is performed.
     * 
     * @param folder the folder to copy the resource to
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    void copyTo(Folder folder);

}
