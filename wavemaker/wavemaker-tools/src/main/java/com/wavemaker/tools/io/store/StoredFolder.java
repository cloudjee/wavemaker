
package com.wavemaker.tools.io.store;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.springframework.core.GenericTypeResolver;
import org.springframework.util.Assert;

import com.wavemaker.tools.io.AbstractResources;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.FilteredResources;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Including;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.NoCloseInputStream;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourceIncludeFilter;
import com.wavemaker.tools.io.ResourceOperation;
import com.wavemaker.tools.io.ResourcePath;
import com.wavemaker.tools.io.ResourceStringFormat;
import com.wavemaker.tools.io.Resources;
import com.wavemaker.tools.io.ResourcesCollection;
import com.wavemaker.tools.io.exception.ResourceDoesNotExistException;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.io.exception.ResourceExistsException;
import com.wavemaker.tools.io.exception.ResourceTypeMismatchException;

public abstract class StoredFolder extends StoredResource implements Folder {

    @Override
    protected abstract FolderStore getStore();

    @Override
    public Resource getExisting(String name) throws ResourceDoesNotExistException {
        Assert.hasLength(name, "Name must not be empty");
        JailedResourcePath resourcePath = getPath().get(name);
        Resource resource = getStore().getExisting(resourcePath);
        if (resource == null) {
            throw new ResourceDoesNotExistException(this, name);
        }
        return resource;
    }

    @Override
    public boolean hasExisting(String name) {
        Assert.hasLength(name, "Name must not be empty");
        JailedResourcePath resourcePath = getPath().get(name);
        Resource existing = getStore().getExisting(resourcePath);
        return existing != null;
    }

    @Override
    public Folder getFolder(String name) {
        Assert.hasLength(name, "Name must not be empty");
        JailedResourcePath folderPath = getPath().get(name);
        return getStore().getFolder(folderPath);
    }

    @Override
    public Folder appendFolder(String name) throws ResourceTypeMismatchException {
        throw new UnsupportedOperationException();
    }

    @Override
    public File getFile(String name) {
        Assert.hasLength(name, "Name must not be empty");
        JailedResourcePath filePath = getPath().get(name);
        return getStore().getFile(filePath);
    }

    @Override
    public File appendFile(String name) throws ResourceTypeMismatchException {
        throw new UnsupportedOperationException();
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
        return list(Including.all());
    }

    @Override
    public <T extends Resource> Resources<T> list(ResourceIncludeFilter<T> includeFilter) {
        Assert.notNull(includeFilter, "Filter must not be null");
        if (!exists()) {
            return ResourcesCollection.emptyResources();
        }
        Iterable<String> list = getStore().list();
        if (list == null) {
            return ResourcesCollection.emptyResources();
        }
        Resources<Resource> resources = new ChildResources(list);
        return FilteredResources.apply(resources, includeFilter);
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
        return copyTo(folder, Including.<File> all());
    }

    @Override
    public Folder copyTo(Folder folder, ResourceIncludeFilter<File> fileIncludeFilter) {
        Assert.notNull(folder, "Folder must not be empty");
        Assert.notNull(fileIncludeFilter, "FileFilter must not be null");
        ensureExists();
        Assert.state(getPath().getParent() != null, "Unable to copy a root folder");
        Folder destination = createDestinationFolder(folder);
        for (Resource child : list()) {
            if (child instanceof Folder) {
                Folder childFolder = (Folder) child;
                childFolder.copyTo(destination, fileIncludeFilter);
            } else {
                File childFile = (File) child;
                if (fileIncludeFilter.include(childFile)) {
                    child.copyTo(destination);
                }
            }
        }
        return destination;
    }

    @Override
    public Resources<Resource> copyContentsTo(Folder folder) {
        return list().copyTo(folder);
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

    @Override
    public Resources<Resource> moveContentsTo(Folder folder) {
        return list().moveTo(folder);
    }

    private Folder createDestinationFolder(Folder folder) {
        Folder destination = folder.getFolder(getName());
        destination.createIfMissing();
        return destination;
    }

    @Override
    public Folder rename(String name) throws ResourceExistsException {
        return (Folder) super.rename(name);
    }

    @Override
    public void delete() {
        if (exists()) {
            for (Resource child : list()) {
                child.delete();
            }
            getStore().delete();
        }
    }

    @Override
    public void createIfMissing() {
        if (!exists()) {
            createParentIfMissing();
            getStore().create();
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
    public Folder jail() {
        JailedResourcePath jailedPath = new JailedResourcePath(getPath().getPath(), new ResourcePath());
        return getStore().getFolder(jailedPath);
    }

    @Override
    public String toString(ResourceStringFormat format) {
        return super.toString(format) + "/";
    }

    protected class ChildResources extends AbstractResources<Resource> {

        private final Iterable<String> list;

        public ChildResources(Iterable<String> list) {
            Assert.notNull(list, "List must not be null");
            this.list = list;
        }

        @Override
        public Iterator<Resource> iterator() {
            final Iterator<String> iterator = this.list.iterator();
            return new Iterator<Resource>() {

                @Override
                public boolean hasNext() {
                    return iterator.hasNext();
                }

                @Override
                public Resource next() {
                    String name = iterator.next();
                    JailedResourcePath path = getPath().get(name);
                    Resource resource = getStore().getExisting(path);
                    if (resource == null) {
                        throw new ResourceDoesNotExistException(StoredFolder.this, name);
                    }
                    return resource;
                }

                @Override
                public void remove() {
                    throw new UnsupportedOperationException();
                }
            };
        }
    }

}
