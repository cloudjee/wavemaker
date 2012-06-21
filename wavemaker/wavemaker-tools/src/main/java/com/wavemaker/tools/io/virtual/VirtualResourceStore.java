
package com.wavemaker.tools.io.virtual;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.output.ByteArrayOutputStream;
import org.springframework.util.Assert;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourcePath;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.io.exception.ResourceTypeMismatchException;
import com.wavemaker.tools.io.store.FileStore;
import com.wavemaker.tools.io.store.FolderStore;
import com.wavemaker.tools.io.store.ResourceStore;

abstract class VirtualResourceStore implements ResourceStore {

    private final VirtualResources resources;

    private final JailedResourcePath path;

    public VirtualResourceStore(VirtualResources resources, JailedResourcePath path) {
        Assert.notNull(resources, "Resources must not be null");
        Assert.notNull(path, "Path must not be null");
        this.resources = resources;
        this.path = path;
    }

    protected final VirtualResources getResources() {
        return this.resources;
    }

    @Override
    public JailedResourcePath getPath() {
        return this.path;
    }

    @Override
    public Resource getExisting(JailedResourcePath path) {
        VirtualResourceStore store = this.resources.get(path);
        if (store == null) {
            return null;
        }
        if (store instanceof VirtualFileStore) {
            return new VirtualFile((VirtualFileStore) store);
        }
        if (store instanceof VirtualFolderStore) {
            return new VirtualFolder((VirtualFolderStore) store);
        }
        throw new IllegalStateException("Unknown store type " + store);
    }

    @Override
    public Folder getFolder(JailedResourcePath path) {
        VirtualResourceStore store = this.resources.get(path);
        if (store == null) {
            store = new VirtualFolderStore(this.resources, path);
        }
        if (!(store instanceof VirtualFolderStore)) {
            throw new ResourceTypeMismatchException(path.getUnjailedPath(), true);
        }
        return new VirtualFolder((VirtualFolderStore) store);
    }

    @Override
    public File getFile(JailedResourcePath path) {
        VirtualResourceStore store = this.resources.get(path);
        if (store == null) {
            store = new VirtualFileStore(this.resources, path);
        }
        if (!(store instanceof VirtualFileStore)) {
            throw new ResourceTypeMismatchException(path.getUnjailedPath(), false);
        }
        return new VirtualFile((VirtualFileStore) store);
    }

    @Override
    public Resource rename(String name) {
        throw new UnsupportedOperationException(); // FIXME
    }

    @Override
    public boolean exists() {
        return this.resources.get(getPath()) != null;
    }

    @Override
    public void delete() {
        this.resources.remove(getPath());
    }

    static class VirtualFileStore extends VirtualResourceStore implements FileStore {

        private File source;

        private byte[] bytes;

        private long lastModified = -1;

        public VirtualFileStore(VirtualResources resources, JailedResourcePath path) {
            super(resources, path);
        }

        public void setSource(File source) {
            this.bytes = null;
            this.source = source;
            this.lastModified = source.getLastModified();
            getResources().add(this, true);
        }

        @Override
        public void create() {
            getResources().add(this, false);
        }

        @Override
        public InputStream getInputStream() {
            if (this.source != null) {
                return this.source.getContent().asInputStream();
            }
            Assert.state(this.bytes != null, "File does not exist");
            return new ByteArrayInputStream(this.bytes);
        }

        @Override
        public OutputStream getOutputStream() {
            return new ByteArrayOutputStream() {

                @Override
                public void close() throws IOException {
                    super.close();
                    VirtualFileStore.this.source = null;
                    VirtualFileStore.this.bytes = toByteArray();
                    VirtualFileStore.this.lastModified = System.currentTimeMillis();
                    getResources().add(VirtualFileStore.this, true);
                }
            };
        }

        @Override
        public long getSize() {
            if (this.source != null) {
                return this.source.getSize();
            }
            return this.bytes == null ? 0L : this.bytes.length;
        }

        @Override
        public long getLastModified() {
            return this.lastModified;
        }

        @Override
        public void touch() {
            VirtualFileStore.this.lastModified = System.currentTimeMillis();
        }
    }

    static class VirtualFolderStore extends VirtualResourceStore implements FolderStore {

        public VirtualFolderStore(VirtualResources resources, JailedResourcePath path) {
            super(resources, path);
        }

        public VirtualFolderStore() {
            super(new VirtualResources(), new JailedResourcePath());
        }

        @Override
        public void create() {
            getResources().add(this, false);
        }

        @Override
        public Iterable<String> list() {
            return new Iterable<String>() {

                @Override
                public Iterator<String> iterator() {
                    final Iterator<VirtualResourceStore> children = getResources().listChildrenOf(getPath()).iterator();
                    return new Iterator<String>() {

                        @Override
                        public void remove() {
                            throw new UnsupportedOperationException();
                        }

                        @Override
                        public boolean hasNext() {
                            return children.hasNext();
                        }

                        @Override
                        public String next() {
                            return children.next().getPath().getUnjailedPath().getName();
                        }

                    };
                }
            };
        }
    }

    private static class VirtualResources {

        private final Map<ResourcePath, VirtualResourceStore> pathToStore = new HashMap<ResourcePath, VirtualResourceStore>();

        private final Map<ResourcePath, List<VirtualResourceStore>> childrenOf = new HashMap<ResourcePath, List<VirtualResourceStore>>();

        public VirtualResourceStore get(JailedResourcePath path) {
            return this.pathToStore.get(path.getUnjailedPath());
        }

        public List<VirtualResourceStore> listChildrenOf(JailedResourcePath path) {
            List<VirtualResourceStore> children = this.childrenOf.get(path.getUnjailedPath());
            return children == null ? Collections.<VirtualResourceStore> emptyList() : children;
        }

        public void add(VirtualResourceStore store, boolean overwrite) {
            ResourcePath key = store.getPath().getUnjailedPath();
            boolean alreadyContained = this.pathToStore.containsKey(key);
            if (alreadyContained && !overwrite) {
                throw new ResourceException("A resource already exists with the path " + key);
            }
            this.pathToStore.put(key, store);
            if (!alreadyContained) {
                ResourcePath parent = store.getPath().getUnjailedPath().getParent();
                List<VirtualResourceStore> children = this.childrenOf.get(parent);
                if (children == null) {
                    children = new LinkedList<VirtualResourceStore>();
                    this.childrenOf.put(parent, children);
                }
                children.add(store);
            }
        }

        public void remove(JailedResourcePath path) {
            this.pathToStore.remove(path.getUnjailedPath());
            List<VirtualResourceStore> list = this.childrenOf.get(path.getParent().getUnjailedPath());
            if (list != null) {
                Iterator<VirtualResourceStore> iterator = list.iterator();
                while (iterator.hasNext()) {
                    if (iterator.next().getPath().getUnjailedPath().equals(path.getUnjailedPath())) {
                        iterator.remove();
                    }
                }
            }
        }
    }
}
