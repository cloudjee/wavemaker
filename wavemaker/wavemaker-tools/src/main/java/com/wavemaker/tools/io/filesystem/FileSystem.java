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

package com.wavemaker.tools.io.filesystem;

import java.io.InputStream;
import java.io.OutputStream;

/**
 * Strategy interface used to abstract file system operations from {@link FileSystemFile} and {@link FileSystemFolder}
 * implementations.
 * 
 * @see FileSystemFolder
 * @see FileSystemFile
 * 
 * @author Phillip Webb
 */
public interface FileSystem<K> {

    public enum ResourceOrigin {
        LOCAL_FILE_SYSTEM, MONGO_DB
    }

    /**
     * Return the key that should be used for the specified path.
     * 
     * @param path the path
     * @return a file system specific key
     */
    K getKey(JailedResourcePath path);

    /**
     * Return the path that is represented by the specified key.
     * 
     * @param key the file system key
     * @return the path
     */
    JailedResourcePath getPath(K key);

    /**
     * Return the resource type for the specified key.
     * 
     * @param key the file system key
     * @return the resource type
     */
    ResourceType getResourceType(K key);

    /**
     * Create a new file for the specified key.
     * 
     * @param key the file system key
     */
    void createFile(K key);

    /**
     * Create a new folder for the specified key.
     * 
     * @param key the file system key
     */
    void createFolder(K key);

    /**
     * List the contents of a folder
     * 
     * @param key the file system key
     */
    Iterable<String> list(K key);

    /**
     * Get the size of a file
     * 
     * @param key the file system key
     * @return the size
     */
    long getSize(K key);

    /**
     * Get the last modified date/time of a file.
     * 
     * @param key the file system key
     * @return the last modified time
     */
    long getLastModified(K key);

    /**
     * Get the file contents as an input stream for reading.
     * 
     * @param key the file system key
     * @return the input stream
     */
    InputStream getInputStream(K key);

    /**
     * Get the file contents as an output stream for writing.
     * 
     * @param key the file system key
     * @return the output stream
     */
    OutputStream getOutputStream(K key);

    /**
     * Delete the file or folder for the specified key. The key can refer to a file or folder resource, in the case of
     * folder all children will have previously been deleted.
     * 
     * @param key the key to delete.
     */
    void delete(K key);

    /**
     * Rename the file of folder for the specified key. The key can refer to a file or folder resource.
     * 
     * @param key the key to rename
     * @param name the new name (this does not include path elements)
     * @return the new renamed key
     */
    K rename(K key, String name);

    /**
     * Returns an enum value that indicates the origin of the resource (eg. os file system or mongo db)
     * 
     * @return the origin of the resource
     */
    ResourceOrigin getResourceOrigin();

    /**
     * Touch the underlying file.
     * 
     * @param key the key to touch
     */
    void touch(K key);
}
