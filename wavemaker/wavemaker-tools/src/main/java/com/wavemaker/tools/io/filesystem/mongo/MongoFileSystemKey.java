
package com.wavemaker.tools.io.filesystem.mongo;

import com.wavemaker.tools.io.filesystem.JailedResourcePath;

/**
 * Key used with {@link MongoFileSystem}.
 * 
 * @author Phillip Webb
 */
public class MongoFileSystemKey {

    private final JailedResourcePath path;

    public MongoFileSystemKey(JailedResourcePath path) {
        this.path = path;
    }

    public JailedResourcePath getPath() {
        return this.path;
    }

    @Override
    public String toString() {
        return this.path.toString();
    }
}
