
package com.wavemaker.io.filesystem;

import java.io.InputStream;
import java.io.OutputStream;

import org.springframework.util.Assert;

import com.wavemaker.io.AbstractFileContent;
import com.wavemaker.io.File;
import com.wavemaker.io.FileContent;
import com.wavemaker.io.Folder;
import com.wavemaker.io.ResourcePath;
import com.wavemaker.io.exception.ResourceExistsException;

/**
 * {@link File} implementation backed by a {@link FileSystem}.
 * 
 * @author Phillip Webb
 */
public class FileSystemFile<K> extends FileSystemResource<K> implements File {

    private final FileContent content = new AbstractFileContent() {

        @Override
        public InputStream asInputStream() {
            touchParent();
            return getFileSystem().getInputStream(getKey());
        }

        @Override
        public OutputStream asOutputStream() {
            touchParent();
            return getFileSystem().getOutputStream(getKey());
        }
    };

    FileSystemFile(ResourcePath path, FileSystem<K> fileSystem, K key) {
        super(path, fileSystem, key);
        ResourceType resourceType = getFileSystem().getResourceType(key);
        Assert.state(resourceType != ResourceType.FOLDER, "Unable to access existing folder '" + super.toString() + "' as a file");
    }

    @Override
    public long getSize() {
        return getFileSystem().getSize(getKey());
    }

    @Override
    public long getLastModified() {
        return getFileSystem().getLastModified(getKey());
    }

    @Override
    public byte[] getSha1Digest() {
        return getFileSystem().getSha1Digest(getKey());
    }

    @Override
    public FileContent getContent() {
        return this.content;
    }

    @Override
    public void delete() {
        if (exists()) {
            getFileSystem().delete(getKey());
        }
    }

    @Override
    public File moveTo(Folder folder) {
        Assert.notNull(folder, "Folder must not be null");
        ensureExists();
        File destination = folder.getFile(getName());
        destination.getContent().write(getContent().asInputStream());
        getFileSystem().delete(getKey());
        return destination;
    }

    @Override
    public File copyTo(Folder folder) {
        Assert.notNull(folder, "Folder must not be null");
        ensureExists();
        File destination = folder.getFile(getName());
        destination.getContent().write(getContent().asInputStream());
        return destination;
    }

    @Override
    public File rename(String name) throws ResourceExistsException {
        K newKey = doRename(name);
        return new FileSystemFile<K>(getFileSystem().getPath(newKey), getFileSystem(), newKey);
    }

    @Override
    public void touch() {
        if (!exists()) {
            touchParent();
            getFileSystem().createFile(getKey());
        }
    }
}
