
package com.wavemaker.io;

/**
 * Base abstract for {@link File}s and {@link Folder}s that may be stored on a physical disk or using some other
 * mechanism. Subclasses will either implement {@link File} or {@link Folder} (but never both).
 * 
 * @see File
 * @see Folder
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
    Folder getParent();

    /**
     * Returns the name of the resource. This name does not include any path element. Root folders will have an empty
     * string name.
     * 
     * @return the name of the resource, for example <tt>"file.txt"</tt>
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    String getName();

    /**
     * Returns the complete name of the resource. This name includes path elements. Folders always end in '/'.
     * 
     * @return the full name of the resource, for example <tt>"/folder/file.txt"</tt> or <tt>"/folder/"</tt>
     */
    @Override
    public String toString();

    /**
     * Returns <tt>true</tt> if the resource exists in the underlying store.
     * 
     * @return <tt>true</tt> if the resource exists.
     */
    boolean exists();

    /**
     * Recursively creates an empty representation of this resource and all {@link #getParent() parent}s. Calling this
     * method on an existing resource has not effect.
     */
    void touch();
}
