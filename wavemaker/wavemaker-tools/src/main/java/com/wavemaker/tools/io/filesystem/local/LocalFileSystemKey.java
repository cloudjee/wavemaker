
package com.wavemaker.tools.io.filesystem.local;

import java.io.File;

import com.wavemaker.tools.io.ResourcePath;

/**
 * Key used with {@link LocalFileSystem}.
 * 
 * @author Phillip Webb
 */
public class LocalFileSystemKey {

    private final ResourcePath path;

    private final File file;

    public LocalFileSystemKey(File root, ResourcePath path) {
        this.path = path;
        this.file = new File(root, path.toString());
    }

    public ResourcePath getPath() {
        return this.path;
    }

    public File getFile() {
        return this.file;
    }

    @Override
    public String toString() {
        return this.file.toString();
    }
}
