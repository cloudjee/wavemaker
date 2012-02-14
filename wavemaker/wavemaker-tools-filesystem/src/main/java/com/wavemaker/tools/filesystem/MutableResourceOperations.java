
package com.wavemaker.tools.filesystem;

/**
 * Various operations that can be performed on a {@link Resource} or a {@link Resources}.
 * 
 * @author Phillip Webb
 */
public interface MutableResourceOperations {

    /**
     * Move this resource to the specified folder. Any duplicate {@link File}s will be replaced (existing {@link Folder}
     * resources will be merged).
     * 
     * @param folder the folder to move the resource to
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    void moveTo(MutableFolder folder);

    /**
     * Recursively copy this resource to the specified folder.Any duplicate {@link File}s will be replaced (existing
     * {@link Folder} resources will be merged).
     * 
     * @param folder the folder to copy the resource to
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    void copyTo(MutableFolder folder);

    /**
     * Delete the current resource. If this resource does not exist then no operation is performed.
     */
    void delete();

}
