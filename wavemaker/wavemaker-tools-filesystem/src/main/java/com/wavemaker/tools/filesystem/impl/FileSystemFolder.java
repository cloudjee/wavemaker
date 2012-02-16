
package com.wavemaker.tools.filesystem.impl;

import org.springframework.util.Assert;

import com.wavemaker.tools.filesystem.Folder;
import com.wavemaker.tools.filesystem.Resource;
import com.wavemaker.tools.filesystem.ResourceFilter;
import com.wavemaker.tools.filesystem.Resources;

/**
 * {@link Folder} implementation backed by a {@link FileSystem}.
 * 
 * @author Phillip Webb
 */
public class FileSystemFolder<K> extends FileSystemResource<K> implements Folder {

    FileSystemFolder(Path path, FileSystem<K> fileSystem, K key) {
        super(path, fileSystem, key);
    }

    @Override
    public FileSystemFolder<K> getFolder(String name) {
        Path folderPath = getPath().get(name);
        K folderKey = getFileSystem().getKey(folderPath);
        return new FileSystemFolder<K>(folderPath, getFileSystem(), folderKey);
    }

    @Override
    public FileSystemFile<K> getFile(String name) {
        Path filePath = getPath().get(name);
        K fileKey = getFileSystem().getKey(filePath);
        return new FileSystemFile<K>(filePath, getFileSystem(), fileKey);
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
        Iterable<K> keys = getFileSystem().list(getKey());
        if (keys == null) {
            return AbstractResources.empty();
        }
        Resources<Resource> resources = new FileSystemResources<K>(getFileSystem(), keys);
        return FilteredResources.apply(resources, filter);
    }

    @Override
    public void copyTo(Folder folder) {
        if (exists()) {
            Assert.state(getPath().getParent() != null, "Unable to copy a root folder");
            Folder destination = createDestinationFolder(folder);
            for (Resource child : list()) {
                child.copyTo(destination);
            }
        }
    }

    @Override
    public void moveTo(Folder folder) {
        if (exists()) {
            Assert.state(getPath().getParent() != null, "Unable to move a root folder");
            Folder destination = createDestinationFolder(folder);
            for (Resource child : list()) {
                child.moveTo(destination);
            }
        }
    }

    private Folder createDestinationFolder(Folder folder) {
        Folder destination = folder.getFolder(getName());
        destination.touch();
        return destination;
    }

    @Override
    public void delete() {
        if (exists()) {
            getFileSystem().deleteFolder(getKey());
        }
    }

    @Override
    public void touch() {
        if (!exists()) {
            getFileSystem().mkDir(getKey());
        }
    }

    @Override
    public String toString() {
        return super.toString() + "/";
    }
}
