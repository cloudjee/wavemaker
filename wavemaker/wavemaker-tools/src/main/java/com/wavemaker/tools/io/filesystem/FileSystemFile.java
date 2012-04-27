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

import java.io.InputStream;
import java.io.OutputStream;

import org.springframework.util.Assert;

import com.wavemaker.tools.io.*;
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
    public <T extends Resource> Folder copyTo(Folder folder, ResourceFilter<T> filter) {
        throw new UnsupportedOperationException();
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
