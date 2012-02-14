
package com.wavemaker.tools.filesystem.impl;

import org.springframework.util.Assert;

import com.wavemaker.tools.filesystem.MutableFolder;
import com.wavemaker.tools.filesystem.MutableResource;
import com.wavemaker.tools.filesystem.MutableResources;
import com.wavemaker.tools.filesystem.ResourceFilter;

public class FileSystemMutableFolder<R> extends FileSystemMutableResource<R> implements MutableFolder {

    protected FileSystemMutableFolder(FileSystem<R> fileSystem, R root, Path path) {
        super(fileSystem, root, path);
    }

    @Override
    public FileSystemMutableFolder<R> getFolder(String name) {
        Path folderPath = getPath().get(name);
        return new FileSystemMutableFolder<R>(getFileSystem(), getRoot(), folderPath);
    }

    @Override
    public FileSystemMutableFile<R> getFile(String name) {
        Path filePath = getPath().get(name);
        return new FileSystemMutableFile<R>(getFileSystem(), getRoot(), filePath);
    }

    @Override
    public MutableResources<MutableResource> list() {
        return list(ResourceFilter.NONE);
    }

    @Override
    public <T extends MutableResource> MutableResources<T> list(ResourceFilter<T> filter) {
        Assert.notNull(filter, "Filter must not be null");
        if (!exists()) {
            return AbstractMutableResources.empty();
        }
        return null;
    }

    @Override
    public void copyTo(MutableFolder folder) {
        // TODO Auto-generated method stub

    }

    @Override
    public void moveTo(MutableFolder folder) {
        // TODO Auto-generated method stub

    }

    @Override
    public void delete() {
        if (exists()) {
            getFileSystem().deleteFolder(getRoot(), getPath());
        }
    }

    @Override
    public void touch() {
        if (!exists()) {
            getFileSystem().mkDirs(getRoot(), getPath());
        }
    }

    @Override
    public String toString() {
        return super.toString() + "/";
    }
}
