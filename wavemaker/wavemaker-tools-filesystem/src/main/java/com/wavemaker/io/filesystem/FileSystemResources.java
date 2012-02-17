
package com.wavemaker.io.filesystem;

import java.util.Iterator;

import org.springframework.util.Assert;

import com.wavemaker.io.AbstractResources;
import com.wavemaker.io.Resource;

/**
 * {@link Resources} implementation backed by a {@link FileSystem}.
 * 
 * @author Phillip Webb
 */
public class FileSystemResources<K> extends AbstractResources<Resource> {

    private final FileSystem<K> fileSystem;

    private final Iterable<K> keys;

    public FileSystemResources(FileSystem<K> fileSystem, Iterable<K> keys) {
        Assert.notNull(fileSystem, "FileSystem must not be null");
        Assert.notNull(keys, "Keys must not be null");
        this.fileSystem = fileSystem;
        this.keys = keys;
    }

    @Override
    public Iterator<Resource> iterator() {
        final Iterator<K> iterator = this.keys.iterator();
        return new Iterator<Resource>() {

            @Override
            public boolean hasNext() {
                return iterator.hasNext();
            }

            @Override
            public Resource next() {
                K key = iterator.next();
                FileSystemPath path = FileSystemResources.this.fileSystem.getPath(key);
                ResourceType resourceType = FileSystemResources.this.fileSystem.getResourceType(key);
                Assert.state(resourceType != null, "No resource type found");
                switch (resourceType) {
                    case FILE:
                        return new FileSystemFile<K>(path, FileSystemResources.this.fileSystem, key);
                    case FOLDER:
                        return new FileSystemFolder<K>(path, FileSystemResources.this.fileSystem, key);
                }
                throw new IllegalStateException("Unknown resource type");
            }

            @Override
            public void remove() {
                throw new UnsupportedOperationException();
            }
        };
    }
}
