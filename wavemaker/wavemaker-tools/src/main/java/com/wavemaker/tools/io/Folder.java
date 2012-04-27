/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.io;

import java.io.InputStream;

import com.wavemaker.tools.io.exception.ResourceDoesNotExistException;
import com.wavemaker.tools.io.exception.ResourceExistsException;
import com.wavemaker.tools.io.exception.ResourceTypeMismatchException;

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

    /**
     * Convenience methods to move the contents of the folder. Equivalent to {@link #list()}.
     * {@link Resources#moveTo(Folder) moveTo(folder)}.
     * 
     * @param folder the folder to move the resource to
     * @return a resource collection containing the new destination resources
     * @see Resources#moveTo(Folder)
     */
    Resources<Resource> moveContentsTo(Folder folder);

    @Override
    Folder copyTo(Folder folder);

    @Override
    <T extends Resource> Resource copyTo(Folder folder, ResourceFilter<T> filter);

    /**
     * Convenience methods to move the contents of the folder. Equivalent to {@link #list()}.
     * {@link Resources#copyTo(Folder) copyTo(folder)}.
     * 
     * @param folder the folder to copy the resource to
     * @return a resource collection containing the new destination resources
     * @see Resources#copyTo(Folder)
     */
    Resources<Resource> copyContentsTo(Folder folder);

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
     * @return the {@link Folder}
     * @throws ResourceTypeMismatchException if the an existing resource exits that is not a folder
     */
    Folder getFolder(String name) throws ResourceTypeMismatchException;

    /**
     * Get a child file of the current folder. This method supports the same naming rules as
     * {@link #getExisting(String)}.
     * 
     * @param name the name of the file to get
     * @return the {@link File}
     * @throws ResourceTypeMismatchException if the an existing resource exits that is not a file
     */
    File getFile(String name) throws ResourceTypeMismatchException;

    /**
     * Get a child file or folder of the current folder. Depending on the <tt>resourceType</tt> {@link #getFile(String)}
     * , {@link #getFolder(String)} or {@link #getExisting(String)} will be called. This method supports the same naming
     * rules as {@link #getExisting(String)}.
     * 
     * @param name the name of the resource to get
     * @param resourceType the resource type
     * @return the resource.
     * @throws ResourceTypeMismatchException if the an existing resource exits that is of the wrong type
     */
    <T extends Resource> T get(String name, Class<T> resourceType) throws ResourceTypeMismatchException;

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
     * Perform the specified operation on all children in folder, recursively processing all nested folders.
     * 
     * @param operation the operation to perform
     */
    <T extends Resource> void performOperationRecursively(ResourceOperation<T> operation);

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

    /**
     * Return a new folder that is jailed at the current location. A jailed folder acts as a root folder at the current
     * location.
     * 
     * @return a new jailed folder
     */
    Folder jail();
}
