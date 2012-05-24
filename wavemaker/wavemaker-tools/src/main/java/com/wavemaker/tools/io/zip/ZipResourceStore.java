
package com.wavemaker.tools.io.zip;

import java.io.InputStream;
import java.io.OutputStream;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.exception.ReadOnlyResourceException;
import com.wavemaker.tools.io.store.FileStore;
import com.wavemaker.tools.io.store.FolderStore;
import com.wavemaker.tools.io.store.ResourceStore;

abstract class ZipResourceStore implements ResourceStore {

    private final Zip zip;

    private final JailedResourcePath path;

    public ZipResourceStore(Zip zip, JailedResourcePath path) {
        this.zip = zip;
        this.path = path;
    }

    protected final Zip getZip() {
        return this.zip;
    }

    @Override
    public JailedResourcePath getPath() {
        return this.path;
    }

    @Override
    public Resource getExisting(JailedResourcePath path) {
        return getZip().getExisting(path);
    }

    @Override
    public Folder getFolder(JailedResourcePath path) {
        return getZip().getFolder(path);
    }

    @Override
    public File getFile(JailedResourcePath path) {
        return getZip().getFile(path);
    }

    @Override
    public boolean exists() {
        return getZip().exists(getPath());
    }

    @Override
    public Resource rename(String name) {
        throw createReadOnlyException();
    }

    @Override
    public void delete() {
        throw createReadOnlyException();
    }

    @Override
    public void create() {
        throw createReadOnlyException();
    }

    /**
     * create a new {@link ReadOnlyResourceException} that should be thrown on any write operations.
     * 
     * @return the ReadOnlyResourceException exception to throw
     */
    protected final ReadOnlyResourceException createReadOnlyException() {
        throw new ReadOnlyResourceException("The Zip File " + getZip() + " is read-only");
    }

    static class ZipFileStore extends ZipResourceStore implements FileStore {

        public ZipFileStore(Zip zip, JailedResourcePath path) {
            super(zip, path);
        }

        @Override
        public InputStream getInputStream() {
            return getZip().getInputStream(getPath());
        }

        @Override
        public OutputStream getOutputStream() {
            throw createReadOnlyException();
        }

        @Override
        public long getSize() {
            return getZip().getSize(getPath());
        }

        @Override
        public long getLastModified() {
            return getZip().getLastModified(getPath());
        }

        @Override
        public void touch() {
            throw createReadOnlyException();
        }
    }

    static class ZipFolderStore extends ZipResourceStore implements FolderStore {

        public ZipFolderStore(File zipFile) {
            this(new Zip(zipFile), new JailedResourcePath());
        }

        public ZipFolderStore(Zip zip, JailedResourcePath path) {
            super(zip, path);
        }

        @Override
        public Iterable<String> list() {
            return getZip().list(getPath());
        }
    }

}
