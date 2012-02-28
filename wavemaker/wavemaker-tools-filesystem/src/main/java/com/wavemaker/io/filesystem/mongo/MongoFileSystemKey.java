
package com.wavemaker.io.filesystem.mongo;

import com.wavemaker.io.filesystem.FileSystemPath;

/**
 * Key used with {@link MongoFileSystem}.
 * 
 * @author Phillip Webb
 */
public class MongoFileSystemKey {

    private final FileSystemPath path;

    public MongoFileSystemKey(FileSystemPath path) {
        this.path = path;
    }

    public FileSystemPath getPath() {
        return this.path;
    }

    @Override
    public String toString() {
        return this.path.toString();
    }
}
