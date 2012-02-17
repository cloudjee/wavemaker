
package com.wavemaker.io.filesystem;

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

    /**
     * Return the key that should be used for the specified path.
     * 
     * @param path the path
     * @return a file system specific key
     */
    K getKey(FileSystemPath path);

    /**
     * Return the path that is represented by the specified key.
     * 
     * @param key the file system key
     * @return the path
     */
    FileSystemPath getPath(K key);

    /**
     * Return the resource type for the specified key.
     * 
     * @param key
     * @return
     */
    ResourceType getResourceType(K key);

    void deleteFolder(K key);

    void deleteFile(K key);

    void mkDir(K key);

    Iterable<K> list(K key);

    long getSize(K key);

    long getLastModified(K key);

    byte[] getSha1Digest(K key);

    InputStream getInputStream(K key);

    OutputStream getOutputStream(K key);

    void touch(Object key);

}
