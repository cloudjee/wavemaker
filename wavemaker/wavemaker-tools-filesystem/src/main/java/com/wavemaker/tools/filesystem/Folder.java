
package com.wavemaker.tools.filesystem;

/**
 * A folder {@link Resource} that may be stored on a physical disk or using some other mechanism. This interface
 * provides read-only access to folders, for a mutable variant see {@link MutableFolder}.
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
     * {@link #getParent() parent}. Use '..' to refer to a parent folder.
     * 
     * @param name the name of the folder to get
     * @return the {@link Folder}.
     */
    Folder getFolder(String name);

    /**
     * Get a child file of the current folder. If the <tt>name</tt> includes '/' characters then the file will be
     * returned from nested folders. Paths are relative unless they begin with '/', in which case they are taken from
     * the topmost {@link #getParent() parent}. Use '..' to refer to a parent folder.
     * 
     * @param name the name of the file to get
     * @return the {@link File}
     */
    File getFile(String name);

    // FIXME do we need getExistingResource(name), my preference is not

    /**
     * List all immediate child resources of this folder. If this resource does not exist empty resources are returned.
     * 
     * @return a list of all immediate child resources
     */
    <T extends Resource> Resources<T> list();

    /**
     * List immediate child resource of this folder, filtering results as necessary. If this resource does not exist
     * empty resources are returned.
     * 
     * @param filter a filter used to restrict results (must not be <tt>null</tt>).
     * @return a list of immediate child resources that match the filter
     */
    <T extends Resource> Resources<T> list(ResourceFilter<T> filter);

    // FIXME do we need recursive versions of the list() methods.

}
