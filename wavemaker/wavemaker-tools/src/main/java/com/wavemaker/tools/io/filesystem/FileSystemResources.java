
package com.wavemaker.tools.io.filesystem;

import java.util.Iterator;

import org.springframework.util.Assert;

import com.wavemaker.tools.io.AbstractResources;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.Resources;

/**
 * {@link Resources} implementation backed by a {@link FileSystem}.
 * 
 * @author Phillip Webb
 */
public class FileSystemResources<K> extends AbstractResources<Resource> {

    private final FileSystem<K> fileSystem;

    private final JailedResourcePath parent;

    private final Iterable<String> list;

    public FileSystemResources(JailedResourcePath parent, FileSystem<K> fileSystem, Iterable<String> list) {
        Assert.notNull(parent, "Parent must not be null");
        Assert.notNull(fileSystem, "FileSystem must not be null");
        Assert.notNull(list, "List must not be null");
        this.parent = parent;
        this.fileSystem = fileSystem;
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
                JailedResourcePath path = FileSystemResources.this.parent.get(iterator.next());
                FileSystem<K> fileSystem = FileSystemResources.this.fileSystem;
                K key = fileSystem.getKey(path);
                ResourceType resourceType = fileSystem.getResourceType(key);
                Assert.state(resourceType != null, "No resource type found");
                switch (resourceType) {
                    case FILE:
                        return new FileSystemFile<K>(path, fileSystem, key);
                    case FOLDER:
                        return new FileSystemFolder<K>(path, fileSystem, key);
                }
                throw new IllegalStateException("Unknown resource type for key " + key);
            }

            @Override
            public void remove() {
                throw new UnsupportedOperationException();
            }
        };
    }
}
