
package com.wavemaker.io.filesystem;

import org.springframework.util.Assert;

import com.wavemaker.io.File;
import com.wavemaker.io.FilteredResources;
import com.wavemaker.io.Folder;
import com.wavemaker.io.Resource;
import com.wavemaker.io.ResourceFilter;
import com.wavemaker.io.ResourcePath;
import com.wavemaker.io.Resources;
import com.wavemaker.io.ResourcesCollection;
import com.wavemaker.io.exception.ResourceDoesNotExistException;
import com.wavemaker.io.exception.ResourceExistsException;

/**
 * {@link Folder} implementation backed by a {@link FileSystem}.
 * 
 * @author Phillip Webb
 */
public class FileSystemFolder<K> extends FileSystemResource<K> implements Folder {

    FileSystemFolder(ResourcePath path, FileSystem<K> fileSystem, K key) {
        super(path, fileSystem, key);
        ResourceType resourceType = getFileSystem().getResourceType(key);
        Assert.state(resourceType != ResourceType.FILE, "Unable to access existing file '" + super.toString() + "' as a folder");
    }

    @Override
    public FileSystemFolder<K> getFolder(String name) {
        Assert.hasLength(name, "Name must not be empty");
        ResourcePath folderPath = getPath().get(name);
        K folderKey = getFileSystem().getKey(folderPath);
        return new FileSystemFolder<K>(folderPath, getFileSystem(), folderKey);
    }

    @Override
    public FileSystemFile<K> getFile(String name) {
        Assert.hasLength(name, "Name must not be empty");
        ResourcePath filePath = getPath().get(name);
        K fileKey = getFileSystem().getKey(filePath);
        return new FileSystemFile<K>(filePath, getFileSystem(), fileKey);
    }

    @Override
    public Resource getExisting(String name) throws ResourceDoesNotExistException {
        Assert.hasLength(name, "Name must not be empty");
        ResourcePath resourcePath = getPath().get(name);
        K resourceKey = getFileSystem().getKey(resourcePath);
        ResourceType resourceType = getFileSystem().getResourceType(resourceKey);
        switch (resourceType) {
            case FILE:
                return new FileSystemFile<K>(resourcePath, getFileSystem(), resourceKey);
            case FOLDER:
                return new FileSystemFolder<K>(resourcePath, getFileSystem(), resourceKey);
        }
        throw new ResourceDoesNotExistException(this, name);
    }

    @SuppressWarnings("unchecked")
    @Override
    public <T extends Resource> T get(String name, Class<T> resourceType) {
        Assert.hasLength(name, "Name must not be empty");
        Assert.notNull(resourceType, "ResourceType must not be null");
        if (resourceType.equals(Folder.class)) {
            return (T) getFolder(name);
        }
        if (resourceType.equals(File.class)) {
            return (T) getFile(name);
        }
        return (T) getExisting(name);
    }

    @Override
    public Resources<Resource> list() {
        return list(ResourceFilter.NONE);
    }

    @Override
    public <T extends Resource> Resources<T> list(ResourceFilter<T> filter) {
        Assert.notNull(filter, "Filter must not be null");
        if (!exists()) {
            return ResourcesCollection.emptyResources();
        }
        Iterable<String> list = getFileSystem().list(getKey());
        if (list == null) {
            return ResourcesCollection.emptyResources();
        }
        Resources<Resource> resources = new FileSystemResources<K>(getFileSystem(), getPath(), list);
        return FilteredResources.apply(resources, filter);
    }

    @Override
    public Folder copyTo(Folder folder) {
        Assert.notNull(folder, "Folder must not be empty");
        ensureExists();
        Assert.state(getPath().getParent() != null, "Unable to copy a root folder");
        Folder destination = createDestinationFolder(folder);
        for (Resource child : list()) {
            child.copyTo(destination);
        }
        return destination;
    }

    @Override
    public Folder moveTo(Folder folder) {
        Assert.notNull(folder, "Folder must not be empty");
        ensureExists();
        Assert.state(getPath().getParent() != null, "Unable to move a root folder");
        Folder destination = createDestinationFolder(folder);
        for (Resource child : list()) {
            child.moveTo(destination);
        }
        return destination;
    }

    private Folder createDestinationFolder(Folder folder) {
        Folder destination = folder.getFolder(getName());
        destination.touch();
        return destination;
    }

    @Override
    public Folder rename(String name) throws ResourceExistsException {
        K newKey = doRename(name);
        return new FileSystemFolder<K>(getFileSystem().getPath(newKey), getFileSystem(), newKey);
    }

    @Override
    public void delete() {
        if (exists()) {
            for (Resource child : list()) {
                child.delete();
            }
            getFileSystem().delete(getKey());
        }
    }

    @Override
    public void touch() {
        if (!exists()) {
            touchParent();
            getFileSystem().createFolder(getKey());
        }
    }

    @Override
    public String toString() {
        return super.toString() + "/";
    }
}
