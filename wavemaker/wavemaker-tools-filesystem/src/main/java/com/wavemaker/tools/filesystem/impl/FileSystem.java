
package com.wavemaker.tools.filesystem.impl;

public interface FileSystem<K> {

    K getKey(Path path);

    Path getPath(K key);

    ResourceType getResourceType(K key);

    void deleteFolder(K key);

    void mkDir(K key);

    Iterable<K> list(K key);

}
