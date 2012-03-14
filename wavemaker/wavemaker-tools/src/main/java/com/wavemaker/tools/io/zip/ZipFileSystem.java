
package com.wavemaker.tools.io.zip;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.NoCloseInputStream;
import com.wavemaker.tools.io.ResourcePath;
import com.wavemaker.tools.io.exception.ReadOnlyResourceException;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.io.filesystem.FileSystem;
import com.wavemaker.tools.io.filesystem.JailedResourcePath;
import com.wavemaker.tools.io.filesystem.ResourceType;

/**
 * Read-only {@link FileSystem} implementation backed by ZIP {@link File}s.
 * 
 * @author Phillip Webb
 */
public class ZipFileSystem implements FileSystem<ZipFileSystemKey> {

    private final File zipFile;

    /**
     * Details of the zip file, this is late binding.
     */
    private ZipFileDetails zipFileDetails;

    public ZipFileSystem(File zipFile) {
        Assert.notNull(zipFile, "ZipFile must not be null");
        Assert.isTrue(zipFile.exists(), "ZipFile must exist");
        this.zipFile = zipFile;
    }

    @Override
    public ZipFileSystemKey getKey(JailedResourcePath path) {
        return new ZipFileSystemKey(path);
    }

    @Override
    public JailedResourcePath getPath(ZipFileSystemKey key) {
        return key.getPath();
    }

    @Override
    public ResourceType getResourceType(ZipFileSystemKey key) {
        return getZipFileDetails().getResourceType(key);
    }

    @Override
    public void createFile(ZipFileSystemKey key) {
        throw createReadOnlyException();
    }

    @Override
    public void createFolder(ZipFileSystemKey key) {
        throw createReadOnlyException();
    }

    @Override
    public Iterable<String> list(ZipFileSystemKey key) {
        return getZipFileDetails().list(key);
    }

    @Override
    public long getSize(ZipFileSystemKey key) {
        return getZipFileDetails().getSize(key);
    }

    @Override
    public long getLastModified(ZipFileSystemKey key) {
        return this.zipFile.getLastModified();
    }

    @Override
    public byte[] getSha1Digest(ZipFileSystemKey key) {
        // FIXME
        return null;
    }

    @Override
    public InputStream getInputStream(ZipFileSystemKey key) {
        return getZipFileDetails().getInputStream(key);
    }

    @Override
    public OutputStream getOutputStream(ZipFileSystemKey key) {
        throw createReadOnlyException();
    }

    @Override
    public void delete(ZipFileSystemKey key) {
        throw createReadOnlyException();
    }

    @Override
    public ZipFileSystemKey rename(ZipFileSystemKey key, String name) {
        throw createReadOnlyException();
    }

    /**
     * create a new {@link ReadOnlyResourceException} that should be thrown on any write operations.
     * 
     * @return the ReadOnlyResourceException exception to throw
     */
    private ReadOnlyResourceException createReadOnlyException() {
        throw new ReadOnlyResourceException("The Zip File " + this.zipFile + " is read-only");
    }

    protected final ZipInputStream openZipInputStream() {
        return new ZipInputStream(new BufferedInputStream(this.zipFile.getContent().asInputStream()));
    }

    /**
     * Get the {@link ZipFileDetails}, reloading if the underlying file has changed.
     * 
     * @return {@link ZipFileDetails}.
     */
    private ZipFileDetails getZipFileDetails() {
        try {
            if (this.zipFileDetails == null || this.zipFileDetails.isUnderlyingZipFileChanged()) {
                this.zipFileDetails = new ZipFileDetails();
            }
        } catch (IOException e) {
            throw new ResourceException(e);
        }
        return this.zipFileDetails;
    }

    /**
     * Encapsulates and caches details from underlying zip file.
     */
    private class ZipFileDetails {

        private final Map<ResourcePath, ZipFileDetailsEntry> entries = new HashMap<ResourcePath, ZipFileDetailsEntry>();

        private final long size;

        private final long lastModified;

        public ZipFileDetails() throws IOException {
            addZipEntries();
            createMissingFolderEntries();
            this.size = ZipFileSystem.this.zipFile.getSize();
            this.lastModified = ZipFileSystem.this.zipFile.getLastModified();
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
                        missingEntries.add(new MissingZipFileDetailsEntry(path, ResourceType.FOLDER));
                    }
                    path = path.getParent();
                }
            }
            for (MissingZipFileDetailsEntry missingEntry : missingEntries) {
                this.entries.put(missingEntry.getPath(), missingEntry);
            }
        }

        /**
         * Determine if the underlying zip file has changed.
         * 
         * @return if the underlying file has changed.
         */
        public boolean isUnderlyingZipFileChanged() {
            return this.size != ZipFileSystem.this.zipFile.getSize() || this.lastModified != ZipFileSystem.this.zipFile.getLastModified();
        }

        public ResourceType getResourceType(ZipFileSystemKey key) {
            return getEntry(key).getResourceType();
        }

        public Iterable<String> list(ZipFileSystemKey key) {
            return getEntry(key).list();
        }

        public long getSize(ZipFileSystemKey key) {
            return getEntry(key).getSize();
        }

        public InputStream getInputStream(ZipFileSystemKey key) {
            try {
                return getEntry(key).getInputStream();
            } catch (IOException e) {
                throw new ResourceException(e);
            }
        }

        /**
         * Get {@link ZipFileDetailsEntry} for the specified key. This method will never return null.
         * 
         * @param key they key to find
         * @return the {@link ZipFileDetailsEntry}
         */
        private ZipFileDetailsEntry getEntry(ZipFileSystemKey key) {
            ResourcePath path = key.getPath().getUnjailedPath();
            ZipFileDetailsEntry entry = this.entries.get(path);
            if (entry != null) {
                return entry;
            }
            return new MissingZipFileDetailsEntry(path, ResourceType.DOES_NOT_EXIST);
        }

        /**
         * Details for a single entry from the {@link ZipFileDetails}.
         */
        private abstract class ZipFileDetailsEntry {

            private List<String> list;

            private final ResourcePath path;

            public ZipFileDetailsEntry(ResourcePath path) {
                this.path = path;
            }

            public abstract InputStream getInputStream() throws IOException;

            public abstract long getSize();

            public Iterable<String> list() {
                if (getResourceType() != ResourceType.FOLDER) {
                    return Collections.emptyList();
                }
                if (this.list == null) {
                    this.list = new ArrayList<String>();
                    for (ResourcePath entryPath : ZipFileDetails.this.entries.keySet()) {
                        if (isParent(entryPath)) {
                            this.list.add(entryPath.getName());
                        }
                    }
                }
                return this.list;
            }

            public abstract ResourceType getResourceType();

            private boolean isParent(ResourcePath path) {
                return path != null && this.path.equals(path.getParent());
            }

            public ResourcePath getPath() {
                return this.path;
            }
        }

        private class MissingZipFileDetailsEntry extends ZipFileDetailsEntry {

            private final ResourceType resourceType;

            public MissingZipFileDetailsEntry(ResourcePath path, ResourceType resourceType) {
                super(path);
                this.resourceType = resourceType;
            }

            @Override
            public InputStream getInputStream() {
                return null;
            }

            @Override
            public long getSize() {
                return 0;
            }

            @Override
            public ResourceType getResourceType() {
                return this.resourceType;
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
            public ResourceType getResourceType() {
                return this.entry.isDirectory() ? ResourceType.FOLDER : ResourceType.FILE;
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
}
