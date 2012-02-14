
package com.wavemaker.tools.filesystem;

/**
 * A {@link Resource} that represents a folder that may be stored on a physical disk or using some other mechanism.This
 * interface provides read-only access to folders, for a mutable variant see {@link MutableFolder}.
 * 
 * @see File
 * @see MutableFolder
 * 
 * @author Phillip Webb
 */
public interface Folder extends Resource {

    /**
     * Get a child folder of the current folder. If the <tt>name</tt> includes '/' characters then nested folders will
     * be returned. Paths are relative unless they begin with '/', in which case they are taken from the topmost
     * {@link #getParent() parent}.
     * 
     * @param name the name of the folder to get
     * @return the {@link Folder}.
     */
    Folder getFolder(String name);

    /**
     * Get a child file of the current folder. If the <tt>name</tt> includes '/' characters then the file will be
     * returned from nested folders. Paths are relative unless they begin with '/', in which case they are taken from
     * the topmost {@link #getParent() parent}.
     * 
     * @param name the name of the file to get
     * @return the {@link File}
     */
    File getFile(String name);

    // FIXME do we need getExistingResource(name), my preference is not

    /**
     * List all immediate child resources of this folder.
     * 
     * @return a list of all immediate child resources
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    Resources<Resource> list();

    /**
     * List immediate child resource of this folder, filtering results as necessary.
     * 
     * @param filter a filter used to restrict results.
     * @return a list of immediate child resources that match the filter
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    <T extends Resource> Resources<T> list(ResourceFilter<T> filter);

    // FIXME do we need recursive versions of the list() methods.

}
