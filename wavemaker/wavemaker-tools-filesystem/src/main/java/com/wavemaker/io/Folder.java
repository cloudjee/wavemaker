
package com.wavemaker.io;

import java.io.InputStream;

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
public interface Folder extends Resource, Iterable<Resource> {

    @Override
    Folder moveTo(Folder folder);

    @Override
    Folder copyTo(Folder folder);

    @Override
    Folder rename(String name) throws ResourceExistsException;

    /**
     * Return a child from the current folder that refers to an existing {@link File} or {@link Folder}. If the
     * <tt>name</tt> includes '/' characters then the file will be returned from nested folders. Paths are relative
     * unless they begin with '/', in which case they are taken from the topmost {@link #getParent() parent}. Use '..'
     * to refer to a parent folder.
     * 
     * @param name the name of the resource
     * @return a {@link File} or {@link Folder} resource
     * @throws ResourceDoesNotExistException if the resource does not exist
     * @see #hasExisting(String)
     */
    Resource getExisting(String name) throws ResourceDoesNotExistException;

    /**
     * Returns <tt>true</tt> if this folder already contains a resource with the specified name. This method supports
     * the same naming rules as {@link #getExisting(String)}.
     * 
     * @param name the name of the resource
     * @return <tt>true</tt> if the resource is contained in the folder
     * @see #getExisting(String)
     */
    boolean hasExisting(String name);

    /**
     * Get a child folder of the current folder. This method supports the same naming rules as
     * {@link #getExisting(String)}.
     * 
     * @param name the name of the folder to get
     * @return the {@link Folder}.
     */
    Folder getFolder(String name);

    /**
     * Get a child file of the current folder. This method supports the same naming rules as
     * {@link #getExisting(String)}.
     * 
     * @param name the name of the file to get
     * @return the {@link File}
     */
    File getFile(String name);

    /**
     * Get a child file or folder of the current folder. Depending on the <tt>resourceType</tt> {@link #getFile(String)}
     * , {@link #getFolder(String)} or {@link #getExisting(String)} will be called. This method supports the same naming
     * rules as {@link #getExisting(String)}.
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

    /**
     * Unzip the specified zip file into the current folder.
     * 
     * @param file the file to unzip (this must reference a zip file)
     * @see #unzip(InputStream)
     */
    void unzip(File file);

    /**
     * Unzip the specified input stream into the current folder.
     * 
     * @param inputStream the input stream to unzip (this must contain zip contents)
     * @see #unzip(File)
     */
    void unzip(InputStream inputStream);
}
