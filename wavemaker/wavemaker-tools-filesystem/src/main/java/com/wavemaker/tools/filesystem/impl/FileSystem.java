
package com.wavemaker.tools.filesystem.impl;

public interface FileSystem<K> {

    K getKey(Path path);

    boolean exists(K key);

    void deleteFolder(K key);

    void mkDirs(K key);
}
