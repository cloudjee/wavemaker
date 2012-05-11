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

import org.springframework.util.Assert;
import org.springframework.util.ObjectUtils;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourceStringFormat;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.exception.ResourceDoesNotExistException;
import com.wavemaker.tools.io.exception.ResourceExistsException;
import com.wavemaker.tools.io.filesystem.FileSystem.ResourceOrigin;
import com.wavemaker.tools.io.filesystem.local.LocalFileSystem;
import com.wavemaker.tools.io.filesystem.local.LocalFileSystemKey;
import com.wavemaker.common.WMRuntimeException;

import java.io.IOException;

/**
 * {@link Resource} implementation backed by a {@link FileSystem}.
 * 
 * @see FileSystemResource
 * @see FileSystemFile
 * 
 * @author Phillip Webb
 */
public abstract class FileSystemResource<K> implements Resource {

    private final JailedResourcePath path;

    private final FileSystem<K> fileSystem;

    private final K key;

    FileSystemResource(JailedResourcePath path, FileSystem<K> fileSystem, K key) {
        Assert.notNull(path, "Path must not be null");
        Assert.notNull(fileSystem, "FileSystem must not be null");
        Assert.notNull(key, "Key must not be null");
        this.path = path;
        this.fileSystem = fileSystem;
        this.key = key;
    }

    protected final FileSystem<K> getFileSystem() {
        return this.fileSystem;
    }

    protected final K getKey() {
        return this.key;
    }

    protected final JailedResourcePath getPath() {
        return this.path;
    }

    protected void ensureExists() {
        if (!exists()) {
            throw new ResourceDoesNotExistException(this);
        }
    }

    protected void createParentIfMissing() {
        if (getParent() != null) {
            getParent(true).createIfMissing();
        }
    }

    protected K doRename(String name) {
        Assert.hasLength(name, "Name must not be empty");
        Assert.isTrue(!name.contains("/"), "Name must not contain path elements");
        ensureExists();
        Assert.state(getPath().getPath().getParent() != null, "Root folders cannot be renamed");
        try {
            K newKey = getFileSystem().rename(getKey(), name);
            return newKey;
        } catch (RuntimeException e) {
            throw new ResourceExistsException("Unable to rename '" + toString() + "' to '" + name + "'", e);
        }
    }

    @Override
    public Folder getParent() {
        return getParent(false);
    }

    private Folder getParent(boolean unjailed) {
        JailedResourcePath parentPath = (unjailed ? this.path.unjail() : this.path).getParent();
        if (parentPath == null) {
            return null;
        }
        K parentKey = this.fileSystem.getKey(parentPath);
        return new FileSystemFolder<K>(parentPath, this.fileSystem, parentKey);
    }

    @Override
    public boolean exists() {
        return this.fileSystem.getResourceType(getKey()) != ResourceType.DOES_NOT_EXIST;
    }

    @Override
    public String getName() {
        return this.path.getPath().getName();
    }

    @Override
    public String getLastName() {
        //cftempfix
        if (getResourceOrigin().equals(ResourceOrigin.LOCAL_FILE_SYSTEM)) {
            java.io.File f = (java.io.File)getOriginalResource();
            return f.getName();
        } else {
            return this.path.getUnjailedPath().getName();
        }
    }

    @Override
    public String toString() {
        return toString(ResourceStringFormat.FULL);
    }

    @Override
    public String toString(ResourceStringFormat format) {
        return this.path.toString(format);
    }

    @Override
    public int hashCode() {
        return toString().hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        FileSystemResource<?> other = (FileSystemResource<?>) obj;
        if (!this.fileSystem.equals(other.fileSystem)) {
            return false;
        }
        return ObjectUtils.nullSafeEquals(this.path, other.path);
    }

    @Override
    public ResourceOrigin getResourceOrigin() {
        return this.fileSystem.getResourceOrigin();
    }

    @Override
    public Object getOriginalResource() {
        if (getResourceOrigin().equals(ResourceOrigin.LOCAL_FILE_SYSTEM)) {
            return ((LocalFileSystemKey)this.key).getFile();
        } else {
            throw new UnsupportedOperationException();
        }
    }

    @Override
    public String getCanonicalPath() {
        try {
        if (getResourceOrigin().equals(ResourceOrigin.LOCAL_FILE_SYSTEM)) {
                return ((java.io.File)getOriginalResource()).getCanonicalPath();
            } else {
                throw new UnsupportedOperationException();
            }
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);    
        }
    }

}
