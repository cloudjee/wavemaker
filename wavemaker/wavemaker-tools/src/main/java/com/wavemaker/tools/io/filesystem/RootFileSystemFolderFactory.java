
package com.wavemaker.tools.io.filesystem;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.ResourcePath;

public class RootFileSystemFolderFactory {

    // FIXME think more about this

    public static <K> Folder getRoot(FileSystem<K> fileSystem) {
        ResourcePath path = new ResourcePath();
        K key = fileSystem.getKey(path);
        return new FileSystemFolder<K>(path, fileSystem, key);
    }

}
