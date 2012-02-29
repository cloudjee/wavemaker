
package com.wavemaker.io;

import com.wavemaker.io.exception.ResourceDoesNotExistException;
import com.wavemaker.io.exception.ResourceExistsException;

/**
 * A folder {@link Resource} that may be stored on a physical disk or using some other mechanism.
 * 
 * @see File
 * @see MutableFolder
 * 
 * @author Phillip Webb
 */
public interface Folder extends Resource {

    @Override
    Folder moveTo(Folder folder);

    @Override
    Folder copyTo(Folder folder);

    @Override
    Folder rename(String name) throws ResourceExistsException;

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

    /**
     * Return a child from the current folder that refers to an existing {@link File} or {@link Folder}. If the
     * <tt>name</tt> includes '/' characters then the file will be returned from nested folders. Paths are relative
     * unless they begin with '/', in which case they are taken from the topmost {@link #getParent() parent}. Use '..'
     * to refer to a parent folder.
     * 
     * @param name the name of the resource
     * @return a {@link File} or {@link Folder} resource.
     * @throws ResourceDoesNotExistException if the resource does not exist.
     */
    Resource getExisting(String name) throws ResourceDoesNotExistException;

    /**
     * Get a child file or folder of the current folder. Depending on the <tt>resourceType</tt> {@link #getFile(String)}
     * , {@link #getFolder(String)} or {@link #getExisting(String)} will be called.
     * 
     * @param name the name of the resource to get
     * @param resourceType the resource type
     * @return the resource.
     */
    <T extends Resource> T get(String name, Class<T> resourceType);

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
}
