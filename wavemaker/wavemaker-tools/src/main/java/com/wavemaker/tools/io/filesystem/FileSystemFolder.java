
package com.wavemaker.tools.io.filesystem;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.springframework.core.GenericTypeResolver;
import org.springframework.util.Assert;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.FilteredResources;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.NoCloseInputStream;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourceFilter;
import com.wavemaker.tools.io.ResourceFiltering;
import com.wavemaker.tools.io.ResourceOperation;
import com.wavemaker.tools.io.ResourcePath;
import com.wavemaker.tools.io.ResourceStringFormat;
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

    FileSystemFolder(JailedResourcePath path, FileSystem<K> fileSystem, K key) {
        super(path, fileSystem, key);
        ResourceType resourceType = getFileSystem().getResourceType(key);
        ResourceTypeMismatchException.throwOnMismatch(path.getPath(), resourceType, ResourceType.FOLDER);
    }

    @Override
    public Resource getExisting(String name) throws ResourceDoesNotExistException {
        Assert.hasLength(name, "Name must not be empty");
        JailedResourcePath resourcePath = getPath().get(name);
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
        JailedResourcePath resourcePath = getPath().get(name);
        K resourceKey = getFileSystem().getKey(resourcePath);
        return getFileSystem().getResourceType(resourceKey) != ResourceType.DOES_NOT_EXIST;
    }

    @Override
    public FileSystemFolder<K> getFolder(String name) {
        Assert.hasLength(name, "Name must not be empty");
        JailedResourcePath folderPath = getPath().get(name);
        K folderKey = getFileSystem().getKey(folderPath);
        return new FileSystemFolder<K>(folderPath, getFileSystem(), folderKey);
    }

    @Override
    public FileSystemFile<K> getFile(String name) {
        Assert.hasLength(name, "Name must not be empty");
        JailedResourcePath filePath = getPath().get(name);
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
        return list(ResourceFiltering.none());
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
        Resources<Resource> resources = new FileSystemResources<K>(getPath(), getFileSystem(), list);
        return FilteredResources.apply(resources, filter);
    }

    @Override
    @SuppressWarnings("unchecked")
    public <T extends Resource> void performOperationRecursively(ResourceOperation<T> operation) {
        Class<?> supportedType = GenericTypeResolver.resolveTypeArgument(operation.getClass(), ResourceOperation.class);
        for (Resource child : list()) {
            if (supportedType.isInstance(child)) {
                operation.perform((T) child);
            }
            if (child instanceof Folder) {
                ((Folder) child).performOperationRecursively(operation);
            }
        }
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
        destination.createIfMissing();
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
    public void createIfMissing() {
        if (!exists()) {
            createParentIfMissing();
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
        createIfMissing();
        ZipInputStream zip = new ZipInputStream(new BufferedInputStream(inputStream));
        try {
            InputStream noCloseZip = new NoCloseInputStream(zip);
            ZipEntry entry = zip.getNextEntry();
            while (entry != null) {
                if (entry.isDirectory()) {
                    getFolder(entry.getName()).createIfMissing();
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
    public FileSystemFolder<K> jail() {
        JailedResourcePath jailedPath = new JailedResourcePath(getPath().getPath(), new ResourcePath());
        K jailedKey = getFileSystem().getKey(jailedPath);
        return new FileSystemFolder<K>(jailedPath, getFileSystem(), jailedKey);
    }

    @Override
    public String toString(ResourceStringFormat format) {
        return super.toString(format) + "/";
    }

    /**
     * Factory method that can be used to get the root {@link Folder} for a given {@link FileSystem}.
     * 
     * @param fileSystem the file system
     * @return the root folder
     */
    public static <K> Folder getRoot(FileSystem<K> fileSystem) {
        JailedResourcePath path = new JailedResourcePath();
        K key = fileSystem.getKey(path);
        return new FileSystemFolder<K>(path, fileSystem, key);
    }
}
