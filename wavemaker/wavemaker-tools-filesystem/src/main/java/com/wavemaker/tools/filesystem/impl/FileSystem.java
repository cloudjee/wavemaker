
package com.wavemaker.tools.filesystem.impl;

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

    K getKey(Path path);

    Path getPath(K key);

    ResourceType getResourceType(K key);

    void deleteFolder(K key);

    void mkDir(K key);

    Iterable<K> list(K key);

}
