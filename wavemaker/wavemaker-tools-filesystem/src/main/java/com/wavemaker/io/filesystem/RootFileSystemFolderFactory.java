
package com.wavemaker.io.filesystem;

import com.wavemaker.io.Folder;

public class RootFileSystemFolderFactory {

    // FIXME think more about this

    public static <K> Folder getRoot(FileSystem<K> fileSystem) {
        FileSystemPath path = new FileSystemPath();
        K key = fileSystem.getKey(path);
        return new FileSystemFolder<K>(path, fileSystem, key);
    }

}
