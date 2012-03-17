
package com.wavemaker.tools.io;

import java.util.List;

import com.wavemaker.tools.io.exception.ResourceDoesNotExistException;

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

    /**
     * Perform the given operation with each {@link Resource} in this collection.
     * 
     * @param operation the operation to perform
     */
    void performOperation(ResourceOperation<T> operation);

    /**
     * Fetch all {@link Resource}s from this collection and return the result as a {@link List}. This will trigger
     * {@link #iterator() iteration} over each element.
     * 
     * @return a {@link List} of all {@link Resource}s in this collection.
     */
    List<T> fetchAll();
}
