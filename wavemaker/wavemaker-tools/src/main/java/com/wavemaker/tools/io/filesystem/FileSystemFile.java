
package com.wavemaker.tools.io.filesystem;

import java.io.InputStream;
import java.io.OutputStream;

import org.springframework.util.Assert;

import com.wavemaker.tools.io.AbstractFileContent;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.FileContent;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.exception.ResourceExistsException;
import com.wavemaker.tools.io.exception.ResourceTypeMismatchException;

/**
 * {@link File} implementation backed by a {@link FileSystem}.
 * 
 * @author Phillip Webb
 */
public class FileSystemFile<K> extends FileSystemResource<K> implements File {

    private final FileContent content = new AbstractFileContent() {

        @Override
        public InputStream asInputStream() {
            createParentIfMissing();
            return getFileSystem().getInputStream(getKey());
        }

        @Override
        public OutputStream asOutputStream() {
            createParentIfMissing();
            return getFileSystem().getOutputStream(getKey());
        }
    };

    FileSystemFile(JailedResourcePath path, FileSystem<K> fileSystem, K key) {
        super(path, fileSystem, key);
        ResourceType resourceType = getFileSystem().getResourceType(key);
        ResourceTypeMismatchException.throwOnMismatch(path.getPath(), resourceType, ResourceType.FILE);
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
        File destination = folder.getFile(getName().toString());
        destination.getContent().write(getContent().asInputStream());
        getFileSystem().delete(getKey());
        return destination;
    }

    @Override
    public File copyTo(Folder folder) {
        Assert.notNull(folder, "Folder must not be null");
        ensureExists();
        File destination = folder.getFile(getName().toString());
        destination.getContent().write(getContent().asInputStream());
        return destination;
    }

    @Override
    public File rename(String name) throws ResourceExistsException {
        K newKey = doRename(name);
        JailedResourcePath newPath = getFileSystem().getPath(newKey);
        return new FileSystemFile<K>(newPath, getFileSystem(), newKey);
    }

    @Override
    public void createIfMissing() {
        if (!exists()) {
            createParentIfMissing();
            getFileSystem().createFile(getKey());
        }
    }
}
