
package com.wavemaker.tools.filesystem.impl;

import org.springframework.util.Assert;

import com.wavemaker.tools.filesystem.Folder;
import com.wavemaker.tools.filesystem.Resource;
import com.wavemaker.tools.filesystem.ResourceFilter;
import com.wavemaker.tools.filesystem.Resources;

public class FileSystemFolder<R> extends FileSystemResource<R> implements Folder {

    protected FileSystemFolder(FileSystem<R> fileSystem, R root, Path path) {
        super(fileSystem, root, path);
    }

    @Override
    public FileSystemFolder<R> getFolder(String name) {
        Path folderPath = getPath().get(name);
        return new FileSystemFolder<R>(getFileSystem(), getRoot(), folderPath);
    }

    @Override
    public FileSystemFile<R> getFile(String name) {
        Path filePath = getPath().get(name);
        return new FileSystemFile<R>(getFileSystem(), getRoot(), filePath);
    }

    @Override
    public Resources<Resource> list() {
        return list(ResourceFilter.NONE);
    }

    @Override
    public <T extends Resource> Resources<T> list(ResourceFilter<T> filter) {
        Assert.notNull(filter, "Filter must not be null");
        if (!exists()) {
            return AbstractResources.empty();
        }
        return null;
    }

    @Override
    public void copyTo(Folder folder) {
        // TODO Auto-generated method stub

    }

    @Override
    public void moveTo(Folder folder) {
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
