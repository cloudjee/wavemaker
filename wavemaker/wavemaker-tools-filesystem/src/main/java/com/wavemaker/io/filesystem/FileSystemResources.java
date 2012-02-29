
package com.wavemaker.io.filesystem;

import java.util.Iterator;

import org.springframework.util.Assert;

import com.wavemaker.io.AbstractResources;
import com.wavemaker.io.ResourcePath;
import com.wavemaker.io.Resource;
import com.wavemaker.io.Resources;

/**
 * {@link Resources} implementation backed by a {@link FileSystem}.
 * 
 * @author Phillip Webb
 */
public class FileSystemResources<K> extends AbstractResources<Resource> {

    private final FileSystem<K> fileSystem;

    private final ResourcePath parent;

    private final Iterable<String> list;

    public FileSystemResources(FileSystem<K> fileSystem, ResourcePath parent, Iterable<String> list) {
        Assert.notNull(fileSystem, "FileSystem must not be null");
        Assert.notNull(parent, "Parent must not be null");
        Assert.notNull(list, "List must not be null");
        this.fileSystem = fileSystem;
        this.parent = parent;
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
                ResourcePath path = FileSystemResources.this.parent.get(iterator.next());
                K key = FileSystemResources.this.fileSystem.getKey(path);
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
