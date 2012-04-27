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

package com.wavemaker.tools.io;

import java.io.InputStream;

import org.springframework.util.Assert;
import org.springframework.util.ClassUtils;
import com.wavemaker.tools.io.filesystem.FileSystem;
import com.wavemaker.tools.io.filesystem.FileSystem.ResourceOrigin;

/**
 * Exposes a class-path resource as a read-only {@link File}.
 * 
 * @author Phillip Webb
 */
public class ClassPathFile extends AbstractReadOnlyFile {

    private final ClassLoader classLoader;

    private final ResourcePath path;

    /**
     * Create a new {@link ClassPathFile} instance.
     * 
     * @param path the path of the resource
     */
    public ClassPathFile(String path) {
        this((ClassLoader) null, path);
    }

    /**
     * Create a new {@link ClassPathFile} instance.
     * 
     * @param classLoader a {@link ClassLoader} or <tt>null</tt> to use the default
     * @param path the path of the resource
     */
    public ClassPathFile(ClassLoader classLoader, String path) {
        this.path = new ResourcePath().get(path);
        this.classLoader = classLoader == null ? ClassUtils.getDefaultClassLoader() : classLoader;
    }

    /**
     * Create a new {@link ClassPathFile} instance.
     * 
     * @param sourceClass the source class used to load the resource
     * @param path the path of the resource (relative to the sourceClass)
     */
    public ClassPathFile(Class<?> sourceClass, String path) {
        Assert.notNull(sourceClass, "SourceClass must not be null");
        Assert.hasLength(path, "Name must not be empty");
        this.classLoader = sourceClass.getClassLoader();
        this.path = new ResourcePath().get(sourceClass.getPackage().getName().replace(".", "/")).get(path);
    }

    @Override
    public String getName() {
        return this.path.getName();
    }

    @Override
    public String toString(ResourceStringFormat format) {
        return this.path.toString();
    }

    @Override
    protected InputStream getInputStream() {
        return this.classLoader.getResourceAsStream(this.path.toString().substring(1));
    }

    @Override
    public ResourceOrigin getResourceOrigin() {
        throw new UnsupportedOperationException();
    }

    @Override
    public Object getOriginalResource() {
        throw new UnsupportedOperationException();
    }

    @Override
    public <T extends Resource> Folder copyTo(Folder folder, ResourceFilter<T> filter) {
        throw new UnsupportedOperationException();
    }
}
