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

package com.wavemaker.tools.project;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.net.URL;

import org.springframework.core.io.WritableResource;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourcePath;
import com.wavemaker.tools.io.exception.ResourceDoesNotExistException;

/**
 * Adapter class that converts a Wavemaker {@link com.wavemaker.tools.io.Resource} to a Spring
 * {@link org.springframework.core.io.Resource}.
 * 
 * @author Phillip Webb
 */
public class ResourceAdapter implements org.springframework.core.io.Resource, WritableResource {

    private final Folder rootFolder;

    private final String path;

    public ResourceAdapter(Folder rootFolder, String path) {
        Assert.notNull(rootFolder, "RootFolder must not be null");
        Assert.notNull(path, "Path must not be null");
        this.rootFolder = rootFolder;
        this.path = path;
        while (path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }
    }

    protected ResourceAdapter newResourceAdapter(Folder rootFolder, String path) {
        return new ResourceAdapter(rootFolder, path);
    }

    @Override
    public InputStream getInputStream() throws IOException {
        if (!exists()) {
            throw new FileNotFoundException(this.path);
        }
        return this.rootFolder.getFile(this.path).getContent().asInputStream();
    }

    @Override
    public OutputStream getOutputStream() throws IOException {
        return this.rootFolder.getFile(this.path).getContent().asOutputStream();
    }

    @Override
    public boolean exists() {
        return this.rootFolder.hasExisting(this.path);
    }

    @Override
    public boolean isReadable() {
        return exists();
    }

    @Override
    public boolean isWritable() {
        return exists();
    }

    @Override
    public boolean isOpen() {
        return false;
    }

    @Override
    public long contentLength() throws IOException {
        Resource resource = this.rootFolder.getExisting(this.path);
        if (resource instanceof File) {
            return ((File) resource).getSize();
        }
        throw new FileNotFoundException(getDescription() + " does not refer to a File");
    }

    @Override
    public long lastModified() throws IOException {
        Resource resource = getExisting();
        if (resource instanceof File) {
            return ((File) resource).getLastModified();
        }
        throw new FileNotFoundException(getDescription() + " cannot be resolved in the file system for resolving its last-modified timestamp");
    }

    @Override
    public org.springframework.core.io.Resource createRelative(String relativePath) throws IOException {
        String pathToUse = StringUtils.applyRelativePath(this.path, relativePath);
        return newResourceAdapter(this.rootFolder, pathToUse);
    }

    @Override
    public String getFilename() {
        return new ResourcePath().get(this.path).getName();
    }

    @Override
    public String getDescription() {
        return this.path;
    }

    @Override
    public URL getURL() throws IOException {
        throw new UnsupportedOperationException();
    }

    @Override
    public URI getURI() throws IOException {
        throw new UnsupportedOperationException();
    }

    @Override
    public java.io.File getFile() throws IOException {
        throw new UnsupportedOperationException();
    }

    @Override
    public String toString() {
        return this.path;
    }

    private Resource getExisting() throws FileNotFoundException {
        try {
            return this.rootFolder.getExisting(this.path);
        } catch (ResourceDoesNotExistException e) {
            throw new FileNotFoundException(getDescription() + " cannot be found");
        }
    }

    String getPath() {
        return this.path;
    }

    Resource getExistingResource(boolean required) {
        try {
            return this.rootFolder.getExisting(this.path);
        } catch (ResourceDoesNotExistException e) {
            if (required) {
                throw e;
            }
            return null;
        }
    }

    <T extends Resource> T getResource(Class<T> resourceType) {
        return this.rootFolder.get(this.path, resourceType);
    }
}
