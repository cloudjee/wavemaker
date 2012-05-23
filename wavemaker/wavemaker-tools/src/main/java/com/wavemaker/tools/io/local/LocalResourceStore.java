
package com.wavemaker.tools.io.local;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.util.Assert;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.io.exception.ResourceTypeMismatchException;
import com.wavemaker.tools.io.store.FileStore;
import com.wavemaker.tools.io.store.FolderStore;
import com.wavemaker.tools.io.store.ResourceStore;

abstract class LocalResourceStore implements ResourceStore {

    private final java.io.File root;

    private final JailedResourcePath path;

    private final java.io.File file;

    public LocalResourceStore(java.io.File root, JailedResourcePath path) {
        Assert.notNull(root, "Root must not be null");
        Assert.notNull(path, "Path must not be null");
        Assert.state(root.exists(), "The root folder '" + root + "' does not exist");
        Assert.state(root.isDirectory(), "The root '" + root + "' is not a directory");
        this.root = root;
        this.path = path;
        this.file = getFileForPath(path);
    }

    protected final java.io.File getRoot() {
        return this.root;
    }

    protected final java.io.File getFile() {
        return this.file;
    }

    protected final java.io.File getFileForPath(JailedResourcePath path) {
        return new java.io.File(getRoot(), path.getUnjailedPath().toString());
    }

    @Override
    public JailedResourcePath getPath() {
        return this.path;
    }

    @Override
    public Resource getExisting(JailedResourcePath path) {
        java.io.File file = getFileForPath(path);
        if (!file.exists()) {
            return null;
        }
        return file.isDirectory() ? getFolder(path) : getFile(path);
    }

    @Override
    public Folder getFolder(JailedResourcePath path) {
        LocalFolderStore store = new LocalFolderStore(getRoot(), path);
        return new LocalFolder(store);
    }

    @Override
    public File getFile(JailedResourcePath path) {
        LocalFileStore store = new LocalFileStore(getRoot(), path);
        return new LocalFile(store);
    }

    @Override
    public Resource rename(String name) {
        java.io.File dest = new java.io.File(getFile().getParent(), name);
        JailedResourcePath destPath = getPath().getParent().get(name);
        if (!getFile().renameTo(dest)) {
            throw new ResourceException("Unable to rename file '" + getFile() + "' to '" + dest + "'");
        }
        return getRenamedResource(destPath);
    }

    protected abstract Resource getRenamedResource(JailedResourcePath path);

    @Override
    public boolean exists() {
        return this.file.exists();
    }

    @Override
    public void delete() {
        if (!this.file.delete()) {
            throw new ResourceException("Unable to delete " + this.file);
        }
    }

    static class LocalFileStore extends LocalResourceStore implements FileStore {

        public LocalFileStore(java.io.File root, JailedResourcePath path) {
            super(root, path);
            if (exists() && !getFile().isFile()) {
                throw new ResourceTypeMismatchException(path.getUnjailedPath(), false);
            }
        }

        @Override
        protected Resource getRenamedResource(JailedResourcePath path) {
            LocalFileStore store = new LocalFileStore(getRoot(), path);
            return new LocalFile(store);
        }

        @Override
        public void create() {
            try {
                if (!getFile().createNewFile()) {
                    throw new ResourceException("Unable to create file " + getFile());
                }
            } catch (IOException e) {
                throw new ResourceException(e);
            }
        }

        @Override
        public InputStream getInputStream() {
            try {
                return new FileInputStream(getFile());
            } catch (FileNotFoundException e) {
                throw new ResourceException(e);
            }
        }

        @Override
        public OutputStream getOutputStream() {
            try {
                return new FileOutputStream(getFile(), false);
            } catch (FileNotFoundException e) {
                throw new ResourceException(e);
            }
        }

        @Override
        public long getSize() {
            return getFile().length();
        }

        @Override
        public long getLastModified() {
            return getFile().lastModified();
        }

        @Override
        public void touch() {
            getFile().setLastModified(System.currentTimeMillis());
        }
    }

    static class LocalFolderStore extends LocalResourceStore implements FolderStore {

        public LocalFolderStore(java.io.File root, JailedResourcePath path) {
            super(root, path);
            if (exists() && !getFile().isDirectory()) {
                throw new ResourceTypeMismatchException(path.getUnjailedPath(), true);
            }
        }

        @Override
        protected Resource getRenamedResource(JailedResourcePath path) {
            return getFolder(path);
        }

        @Override
        public void create() {
            if (!getFile().mkdir()) {
                throw new ResourceException("Unable to create folder " + getFile());
            }
        }

        @Override
        public Iterable<String> list() {
            java.io.File[] files = getFile().listFiles();
            Assert.state(files != null, "Unable to list files for " + getFile());
            List<String> filenames = new ArrayList<String>();
            for (java.io.File file : files) {
                if (file.exists()) {
                    filenames.add(file.getName());
                }
            }
            return Collections.unmodifiableList(filenames);
        }
    }
}
