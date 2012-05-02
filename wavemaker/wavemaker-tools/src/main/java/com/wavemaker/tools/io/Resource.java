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

import com.wavemaker.tools.io.exception.ResourceDoesNotExistException;
import com.wavemaker.tools.io.exception.ResourceExistsException;
import com.wavemaker.tools.io.filesystem.FileSystem.ResourceOrigin;

import java.io.IOException;

/**
 * Base abstract for {@link File}s and {@link Folder}s that may be stored on a physical disk or using some other
 * mechanism. Subclasses will either implement {@link File} or {@link Folder} (but never both).
 * 
 * @see File
 * @see Folder
 * @see ResourceURL
 * 
 * @author Phillip Webb
 */
public interface Resource {

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
     * Delete the current resource (and any children). If this resource does not exist then no operation is performed.
     */
    void delete();

    /**
     * Move this resource to the specified folder. Any duplicate {@link File}s will be replaced (existing {@link Folder}
     * resources will be merged). If the resource does not exist a {@link ResourceDoesNotExistException} is thrown.
     * 
     * @param folder the folder to move the resource to
     * @return a new resource (the current resource will no longer {@link #exists() exist}
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    Resource moveTo(Folder folder);

    /**
     * Recursively copy this resource to the specified folder. Any duplicate {@link File}s will be replaced (existing
     * {@link Folder} resources will be merged). If the resource does not exist a {@link ResourceDoesNotExistException}
     * is thrown.
     * 
     * @param folder the folder to copy the resource to
     * @return a new resource (the current resource will no longer {@link #exists() exist}
     * @throws ResourceDoesNotExistException if this resource no longer exists
     */
    Resource copyTo(Folder folder);

    /**
     * Rename the current resource. The rename operation cannot be used not move the resource to a different folder, use
     * the {@link #moveTo(Folder)} method to move the resource before renaming if required. Root folders cannot be
     * renamed. If the resource does not exist a {@link ResourceDoesNotExistException} is thrown.
     * 
     * @param name the new name of the resource (this must not include any path elements)
     * @return a new resource (the current resource will no longer {@link #exists() exist}
     * @throws ResourceExistsException if a resource already exists with the specified name
     */
    Resource rename(String name) throws ResourceExistsException;

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
    void createIfMissing();

    /**
     * Returns the complete name of the resource. This name includes path elements. Folders always end in '/'.
     * 
     * @return the full name of the resource, for example <tt>"/folder/file.txt"</tt> or <tt>"/folder/"</tt>
     * @see #getName()
     * @see #toString(ResourceStringFormat)
     */
    @Override
    public String toString();

    /**
     * Returns the name of the resource in the specified format.
     * 
     * @param format the format used for the name
     * @return the name
     */
    public String toString(ResourceStringFormat format);

    /**
     * Determines if this resource is equal to another object. Any resources that have the same type, path and are
     * stored in the same underlying system are considered equal.
     * 
     * @param obj the object to compare to
     * @return <tt>true</tt> if the resource is equal to the specified object.
     */
    @Override
    public boolean equals(Object obj);

    /**
     * Returns an enum value that indicates the origin of the resource (eg. os file system or mongo db)
     * 
     * @return the origin of the resource
     */
    ResourceOrigin getResourceOrigin();

    /**
     * Returns the original resource object that can be casted to the appropriate rsource origin
     * 
     * @return the original resource object
     */
    Object getOriginalResource();

    /**
     * Returns the cannonical pathname string for the original resource
     *
     * @return the original resource object
     */
    String getCanonicalPath();

}
