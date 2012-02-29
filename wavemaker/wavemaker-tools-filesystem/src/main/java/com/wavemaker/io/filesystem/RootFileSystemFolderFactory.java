
package com.wavemaker.io.filesystem;

import com.wavemaker.io.ResourcePath;
import com.wavemaker.io.Folder;

public class RootFileSystemFolderFactory {

    // FIXME think more about this

    public static <K> Folder getRoot(FileSystem<K> fileSystem) {
        ResourcePath path = new ResourcePath();
        K key = fileSystem.getKey(path);
        return new FileSystemFolder<K>(path, fileSystem, key);
    }

}
