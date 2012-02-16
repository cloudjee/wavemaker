
package com.wavemaker.tools.filesystem.impl;

import java.io.InputStream;
import java.io.OutputStream;

import com.wavemaker.tools.filesystem.File;
import com.wavemaker.tools.filesystem.Folder;

/**
 * Strategy interface used to abstract file system operations from {@link File} and {@link Folder} implementations.
 * 
 * @see FileSystemFolder
 * @see FileSystemFile
 * 
 * @author Phillip Webb
 */
public interface FileSystem<K> {

    /**
     * Return the key that should be used for the specified path.
     * 
     * @param path the path
     * @return a file system specific key
     */
    K getKey(Path path);

    /**
     * Return the path that is represented by the specified key.
     * 
     * @param key the file system key
     * @return the path
     */
    Path getPath(K key);

    /**
     * Return the resource type for the specified key.
     * 
     * @param key
     * @return
     */
    ResourceType getResourceType(K key);

    void deleteFolder(K key);

    void deleteFile(Object key);

    void mkDir(K key);

    Iterable<K> list(K key);

    long getSize(K key);

    long getLastModified(K key);

    byte[] getSha1Digest(K key);

    InputStream getInputStream(K key);

    OutputStream getOutputStream(K key);

    void touch(Object key);

}
