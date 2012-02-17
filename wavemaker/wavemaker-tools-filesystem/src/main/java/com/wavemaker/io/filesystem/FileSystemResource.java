
package com.wavemaker.io.filesystem;

import org.springframework.util.Assert;

import com.wavemaker.io.Folder;
import com.wavemaker.io.Resource;

/**
 * {@link Resource} implementation backed by a {@link FileSystem}.
 * 
 * @see FileSystemResource
 * @see FileSystemFile
 * 
 * @author Phillip Webb
 */
public abstract class FileSystemResource<K> implements Resource {

    private final FileSystem<K> fileSystem;

    private final K key;

    private final FileSystemPath path;

    FileSystemResource(FileSystemPath path, FileSystem<K> fileSystem, K key) {
        Assert.notNull(path, "Path must not be null");
        Assert.notNull(fileSystem, "FileSystem must not be null");
        Assert.notNull(key, "Key must not be null");
        this.fileSystem = fileSystem;
        this.key = key;
        this.path = path;
    }

    // FIXME check type if exists?

    protected final FileSystem<K> getFileSystem() {
        return this.fileSystem;
    }

    protected final K getKey() {
        return this.key;
    }

    protected final FileSystemPath getPath() {
        return this.path;
    }

    protected void touchParent() {
        if (getParent() != null) {
            getParent().touch();
        }
    }

    @Override
    public Folder getParent() {
        FileSystemPath parentPath = this.path.getParent();
        if (parentPath == null) {
            return null;
        }
        K parentKey = this.fileSystem.getKey(parentPath);
        return new FileSystemFolder<K>(parentPath, this.fileSystem, parentKey);
    }

    @Override
    public boolean exists() {
        return this.fileSystem.getResourceType(getKey()) != ResourceType.DOES_NOT_EXIST;
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
