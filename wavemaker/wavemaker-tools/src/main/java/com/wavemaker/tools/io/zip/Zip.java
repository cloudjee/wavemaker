
package com.wavemaker.tools.io.zip;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.NoCloseInputStream;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourcePath;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.io.store.FileStore;
import com.wavemaker.tools.io.store.FolderStore;
import com.wavemaker.tools.io.store.StoredFile;
import com.wavemaker.tools.io.store.StoredFolder;
import com.wavemaker.tools.io.zip.ZipResourceStore.ZipFileStore;
import com.wavemaker.tools.io.zip.ZipResourceStore.ZipFolderStore;

/**
 * Internal class used by {@link ZipResourceStore} to manage Zip files
 * 
 * @author Phillip Webb
 */
class Zip {

    private final File zipFile;

    private final Map<ResourcePath, ZipFileDetailsEntry> entries = new HashMap<ResourcePath, ZipFileDetailsEntry>();

    private boolean loadedAtLeastOnce;

    private long size;

    private long lastModified;

    public Zip(File zipFile) {
        Assert.notNull(zipFile, "ZipFile must not be null");
        Assert.isTrue(zipFile.exists(), "ZipFile must exist");
        this.zipFile = zipFile;
    }

    public Resource getExisting(JailedResourcePath path) {
        return getEntry(path).isFolder() ? getFolder(path) : getFile(path);
    }

    public Folder getFolder(JailedResourcePath path) {
        final ZipFolderStore store = new ZipFolderStore(this, path);
        return new StoredFolder() {

            @Override
            protected FolderStore getStore() {
                return store;
            }
        };
    }

    public File getFile(JailedResourcePath path) {
        final ZipFileStore store = new ZipFileStore(this, path);
        return new StoredFile() {

            @Override
            protected FileStore getStore() {
                return store;
            }
        };
    }

    public boolean exists(JailedResourcePath path) {
        return getEntry(path, false) != null;
    }

    public InputStream getInputStream(JailedResourcePath path) {
        try {
            return getEntry(path).getInputStream();
        } catch (IOException e) {
            throw new ResourceException(e);
        }
    }

    public long getSize(JailedResourcePath path) {
        return getEntry(path).getSize();
    }

    public long getLastModified(JailedResourcePath path) {
        return this.zipFile.getLastModified();
    }

    public Iterable<String> list(JailedResourcePath path) {
        return getEntry(path).list();
    }

    /**
     * Get {@link ZipFileDetailsEntry} for the specified key. This method will never return null.
     * 
     * @param path the path to find
     * @return the {@link ZipFileDetailsEntry}
     * @throws IOException
     */
    private ZipFileDetailsEntry getEntry(JailedResourcePath path) {
        return getEntry(path, true);
    }

    /**
     * Get {@link ZipFileDetailsEntry} for the specified key if it exists.
     * 
     * @param path the path to find
     * @param required if the entry must exist
     * @return the {@link ZipFileDetailsEntry}
     * @throws IOException
     */
    private ZipFileDetailsEntry getEntry(JailedResourcePath path, boolean required) {
        if (isUnderlyingZipFileChanged()) {
            try {
                reloadZipFile();
            } catch (IOException e) {
                throw new ResourceException(e);
            }
        }
        ResourcePath unjailedPath = path.getUnjailedPath();
        ZipFileDetailsEntry entry = this.entries.get(unjailedPath);
        if (entry == null && required) {
            return new MissingZipFileDetailsEntry(unjailedPath);
        }
        return entry;
    }

    /**
     * Determine if the underlying zip file has changed.
     * 
     * @return if the underlying file has changed.
     */
    private boolean isUnderlyingZipFileChanged() {
        return !this.loadedAtLeastOnce || this.size != this.zipFile.getSize() || this.lastModified != this.zipFile.getLastModified();
    }

    private void reloadZipFile() throws IOException {
        addZipEntries();
        createMissingFolderEntries();
        this.size = this.zipFile.getSize();
        this.lastModified = this.zipFile.getLastModified();
        this.loadedAtLeastOnce = true;
    }

    protected final ZipInputStream openZipInputStream() {
        return new ZipInputStream(new BufferedInputStream(this.zipFile.getContent().asInputStream()));
    }

    /**
     * Add entries from the zip file.
     * 
     * @throws IOException
     */
    private void addZipEntries() throws IOException {
        ZipInputStream zipInputStream = openZipInputStream();
        try {
            ZipEntry entry = zipInputStream.getNextEntry();
            while (entry != null) {
                ResourcePath path = new ResourcePath().get(entry.getName());
                this.entries.put(path, new ZipEntryZipFileDetailsEntry(path, entry));
                entry = zipInputStream.getNextEntry();
            }
        } finally {
            zipInputStream.close();
        }
    }

    /**
     * Create any missing folder entries. This can occur if a zip file does include entries for parent folders.
     */
    private void createMissingFolderEntries() {
        List<MissingZipFileDetailsEntry> missingEntries = new ArrayList<MissingZipFileDetailsEntry>();
        Set<ResourcePath> paths = this.entries.keySet();
        for (ResourcePath path : paths) {
            path = path.getParent();
            while (path != null) {
                if (!this.entries.containsKey(path)) {
                    missingEntries.add(new MissingZipFileDetailsEntry(path));
                }
                path = path.getParent();
            }
        }
        for (MissingZipFileDetailsEntry missingEntry : missingEntries) {
            this.entries.put(missingEntry.getPath(), missingEntry);
        }
    }

    @Override
    public String toString() {
        return this.zipFile.toString();
    }

    /**
     * Details for a single entry from the {@link Zip}.
     */
    private abstract class ZipFileDetailsEntry {

        private List<String> list;

        private final ResourcePath path;

        public ZipFileDetailsEntry(ResourcePath path) {
            this.path = path;
        }

        public abstract boolean isFolder();

        public abstract InputStream getInputStream() throws IOException;

        public abstract long getSize();

        public Iterable<String> list() {
            if (this.list == null) {
                this.list = new ArrayList<String>();
                if (isFolder()) {
                    for (ResourcePath entryPath : Zip.this.entries.keySet()) {
                        if (isParent(entryPath)) {
                            this.list.add(entryPath.getName());
                        }
                    }
                }
            }
            return this.list;
        }

        private boolean isParent(ResourcePath path) {
            return path != null && this.path.equals(path.getParent());
        }

        public ResourcePath getPath() {
            return this.path;
        }
    }

    private class MissingZipFileDetailsEntry extends ZipFileDetailsEntry {

        public MissingZipFileDetailsEntry(ResourcePath path) {
            super(path);
        }

        @Override
        public boolean isFolder() {
            return true;
        }

        @Override
        public InputStream getInputStream() {
            return null;
        }

        @Override
        public long getSize() {
            return 0;
        }
    }

    private class ZipEntryZipFileDetailsEntry extends ZipFileDetailsEntry {

        private final ZipEntry entry;

        private WeakReference<byte[]> contents;

        public ZipEntryZipFileDetailsEntry(ResourcePath path, ZipEntry entry) {
            super(path);
            this.entry = entry;
        }

        @Override
        public boolean isFolder() {
            return this.entry.isDirectory();
        }

        @Override
        public InputStream getInputStream() throws IOException {
            byte[] bytes = this.contents == null ? null : this.contents.get();
            try {
                if (bytes == null) {
                    bytes = getZipEntryBytes();
                    this.contents = new WeakReference<byte[]>(bytes);
                }
                return new ByteArrayInputStream(bytes);
            } finally {
                this.contents = null;
            }
        }

        private byte[] getZipEntryBytes() throws IOException {
            ZipInputStream zipInputStream = openZipInputStream();
            try {
                ZipEntry zipEntry = zipInputStream.getNextEntry();
                while (zipEntry != null) {
                    if (!zipEntry.isDirectory()) {
                        ResourcePath path = new ResourcePath().get(zipEntry.getName());
                        if (getPath().equals(path)) {
                            return FileCopyUtils.copyToByteArray(new NoCloseInputStream(zipInputStream));
                        }
                    }
                    zipEntry = zipInputStream.getNextEntry();
                }
                throw new IllegalStateException("Unable to find ZipEntry for " + getPath());
            } finally {
                zipInputStream.close();
            }
        }

        @Override
        public long getSize() {
            return this.entry.getSize();
        }
    }
}
