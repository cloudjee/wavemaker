/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

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
