
package com.wavemaker.tools.filesystem.impl;

import org.springframework.util.Assert;

import com.wavemaker.tools.filesystem.Folder;
import com.wavemaker.tools.filesystem.Resource;

public abstract class FileSystemResource<K> implements Resource {

    private final FileSystem<K> fileSystem;

    private final K key;

    private final Path path;

    FileSystemResource(Path path, FileSystem<K> fileSystem, K key) {
        Assert.notNull(path, "Path must not be null");
        Assert.notNull(fileSystem, "FileSystem must not be null");
        Assert.notNull(key, "Key must not be null");
        this.fileSystem = fileSystem;
        this.key = key;
        this.path = path;
    }

    protected final FileSystem<K> getFileSystem() {
        return this.fileSystem;
    }

    protected final K getKey() {
        return this.key;
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
        K parentKey = this.fileSystem.getKey(parentPath);
        return new FileSystemFolder<K>(parentPath, this.fileSystem, parentKey);
    }

    @Override
    public boolean exists() {
        return this.fileSystem.getResourceType(getKey()) != ResourceType.UNKNOWN;
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
