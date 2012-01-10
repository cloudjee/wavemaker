
package com.wavemaker.tools.filesystem;

import java.util.zip.ZipInputStream;

import com.wavemaker.tools.filesystem.exception.ResourceDoesNotExistException;
import com.wavemaker.tools.filesystem.exception.ResourceTypeMissmatchException;

/**
 * A {@link Resource} that represents a folder that may be stored on a physical disk or using some other mechanism
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
    Folder getFolder(String name) throws ResourceTypeMissmatchException;

    /**
     * Get a child file of the current folder. If the <tt>name</tt> includes '/' characters then the file will be
     * returned from nested folders. Paths are relative unless they begin with '/', in which case they are taken from
     * the topmost {@link #getParent() parent}.
     * 
     * @param name the name of the file to get
     * @return the {@link File}
     */
    File getFile(String name);

    /**
     * List all child resource of this folder.
     * 
     * @return a list of all immediate child resources
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    ResourceList<Resource> list() throws ResourceDoesNotExistException;

    /**
     * List child resource of this folder, filtering results as necessary.
     * 
     * @param filter a filter used to restrict results.
     * @return a list of immediate child resources that match the filter
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    <T extends Resource> ResourceList<T> list(ResourceFilter<T> filter) throws ResourceDoesNotExistException;

    /**
     * Unpack the specified {@link ZipInputStream} into the current folder.
     * 
     * @param zipInputStream the zip input stream to unpack
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    void unpack(ZipInputStream zipInputStream) throws ResourceDoesNotExistException;

}
