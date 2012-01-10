
package com.wavemaker.tools.filesystem;

import com.wavemaker.tools.filesystem.exception.ResourceDoesNotExistException;

/**
 * Base abstract for {@link File}s and {@link Folder}s that may be stored on a physical disk or using some other
 * mechanism. Subclasses will either implement {@link File} or {@link Folder} (but never both).
 * 
 * @author Phillip Webb
 */
public interface Resource extends ResourceOperations {

    /**
     * Returns the parent folder of the resource or <tt>null</tt> if this is the root folder.
     * 
     * @return the parent folder or <tt>null</tt>
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    Folder getParent() throws ResourceDoesNotExistException;

    /**
     * Returns <tt>true</tt> if the resource exists in the underlying store.
     * 
     * @return <tt>true</tt> if the resource exists.
     */
    boolean exits();

    /**
     * Recursively creates an empty representation of this resource and all {@link #getParent() parent}s.
     */
    void touch();

    /**
     * Returns the name of the resource. This name does not include any path element.
     * 
     * @return the name of the resource
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    String getName() throws ResourceDoesNotExistException;

    /**
     * Perform an operation with the resource accessed as a standard java file. NOTE: This method is designed to support
     * legacy operations ONLY and may cause performance problems. Some virtual file systems will copy content to a
     * temporary location in order to support this method.
     * 
     * @param callable the operation to run.
     * @return the result of the operation
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    <T> T performLegacyOperation(LegacyFileOperation<T> callable) throws ResourceDoesNotExistException;
}
