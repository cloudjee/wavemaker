
package com.wavemaker.tools.io.filesystem;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.springframework.util.Assert;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.FilteredResources;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.NoCloseInputStream;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourceFilter;
import com.wavemaker.tools.io.ResourcePath;
import com.wavemaker.tools.io.Resources;
import com.wavemaker.tools.io.ResourcesCollection;
import com.wavemaker.tools.io.exception.ResourceDoesNotExistException;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.io.exception.ResourceExistsException;
import com.wavemaker.tools.io.exception.ResourceTypeMismatchException;

/**
 * {@link Folder} implementation backed by a {@link FileSystem}.
 * 
 * @author Phillip Webb
 */
public class FileSystemFolder<K> extends FileSystemResource<K> implements Folder {

    FileSystemFolder(ResourcePath path, FileSystem<K> fileSystem, K key) {
        super(path, fileSystem, key);
        ResourceType resourceType = getFileSystem().getResourceType(key);
        ResourceTypeMismatchException.throwOnMismatch(path, resourceType, ResourceType.FOLDER);
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

    @Override
    public boolean hasExisting(String name) {
        Assert.hasLength(name, "Name must not be empty");
        ResourcePath resourcePath = getPath().get(name);
        K resourceKey = getFileSystem().getKey(resourcePath);
        return getFileSystem().getResourceType(resourceKey) != ResourceType.DOES_NOT_EXIST;
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
    public Iterator<Resource> iterator() {
        return list().iterator();
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
    public void unzip(File file) {
        Assert.notNull(file, "File must not be null");
        unzip(file.getContent().asInputStream());
    }

    @Override
    public void unzip(InputStream inputStream) {
        Assert.notNull(inputStream, "InputStream must not be null");
        touch();
        ZipInputStream zip = new ZipInputStream(new BufferedInputStream(inputStream));
        try {
            InputStream noCloseZip = new NoCloseInputStream(zip);
            ZipEntry entry = zip.getNextEntry();
            while (entry != null) {
                if (entry.isDirectory()) {
                    getFolder(entry.getName()).touch();
                } else {
                    getFile(entry.getName()).getContent().write(noCloseZip);
                }
                entry = zip.getNextEntry();
            }
        } catch (IOException e) {
            throw new ResourceException(e);
        } finally {
            try {
                zip.close();
            } catch (IOException e) {
            }
        }
    }

    @Override
    public String toString() {
        return super.toString() + "/";
    }
}
