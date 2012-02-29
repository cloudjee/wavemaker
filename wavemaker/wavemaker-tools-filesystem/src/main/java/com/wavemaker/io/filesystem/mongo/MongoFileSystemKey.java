
package com.wavemaker.io.filesystem.mongo;

import com.wavemaker.io.ResourcePath;

/**
 * Key used with {@link MongoFileSystem}.
 * 
 * @author Phillip Webb
 */
public class MongoFileSystemKey {

    private final ResourcePath path;

    public MongoFileSystemKey(ResourcePath path) {
        this.path = path;
    }

    public ResourcePath getPath() {
        return this.path;
    }

    @Override
    public String toString() {
        return this.path.toString();
    }
}
