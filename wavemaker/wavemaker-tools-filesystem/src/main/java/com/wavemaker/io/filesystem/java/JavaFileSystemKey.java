
package com.wavemaker.io.filesystem.java;

import java.io.File;

import com.wavemaker.io.ResourcePath;

/**
 * Key used with {@link JavaFileSystem}.
 * 
 * @author Phillip Webb
 */
public class JavaFileSystemKey {

    private final ResourcePath path;

    private final File file;

    public JavaFileSystemKey(File root, ResourcePath path) {
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
