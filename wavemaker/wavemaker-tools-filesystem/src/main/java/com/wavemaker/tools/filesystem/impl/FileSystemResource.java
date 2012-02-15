
package com.wavemaker.tools.filesystem.impl;

import org.springframework.util.Assert;

import com.wavemaker.tools.filesystem.Folder;
import com.wavemaker.tools.filesystem.Resource;

public abstract class FileSystemResource<R> implements Resource {

    private final FileSystem<R> fileSystem;

    private final R root;

    private final Path path;

    protected FileSystemResource(FileSystem<R> fileSystem, R root, Path path) {
        Assert.notNull(fileSystem, "FileSystem must not be null");
        Assert.notNull(root, "Root must not be null");
        this.fileSystem = fileSystem;
        this.root = root;
        this.path = path;
    }

    protected final FileSystem<R> getFileSystem() {
        return this.fileSystem;
    }

    protected final R getRoot() {
        return this.root;
    }

    protected final Path getPath() {
        return this.path;
    }

    @Override
    public Folder getParent() {
        Path parentPath = this.path.getParent();
        if (parentPath == null) {
            return null;
        }
        return new FileSystemFolder<R>(this.fileSystem, this.root, parentPath);
    }

    @Override
    public boolean exists() {
        return this.fileSystem.exists(getRoot(), getPath());
    }

    @Override
    public String getName() {
        return this.path.getName();
    }

    @Override
    public String toString() {
        return this.path.toString();
    }
}
