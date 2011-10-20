/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.compiler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.Writer;
import java.net.URI;

import javax.tools.FileObject;

import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.Project;

/**
 * {@link FileObject} implementation meant to work with any generic {@link Resource}.
 * 
 * @author Jeremy Grelle
 */
public class GenericResourceFileObject implements FileObject {

    protected Project project;

    protected Resource resource;

    protected GenericResourceFileObject(Project project, Resource resource) throws IOException {
        this.project = project;
        this.resource = resource;
    }

    /**
     * Returns the source text content of the Java resource.
     */
    @Override
    public CharSequence getCharContent(boolean ignoreEncodingErrors) {
        try {
            return this.project.readFile(this.resource);
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    @Override
    public boolean delete() {
        try {
            return this.project.deleteFile(this.resource);
        } catch (IOException e) {
            return false;
        }
    }

    @Override
    public long getLastModified() {
        try {
            return this.resource.lastModified();
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    @Override
    public InputStream openInputStream() throws IOException {
        return this.resource.getInputStream();
    }

    @Override
    public OutputStream openOutputStream() throws IOException {
        return this.project.getOutputStream(this.resource);
    }

    @Override
    public Reader openReader(boolean ignoreEncodingErrors) throws IOException {
        return this.project.getReader(this.resource);
    }

    @Override
    public Writer openWriter() throws IOException {
        return this.project.getWriter(this.resource);
    }

    @Override
    public URI toUri() {
        try {
            return this.resource.getURI();
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    @Override
    public String getName() {
        return this.resource.getDescription();
    }

    public String getFilename() {
        return this.resource.getFilename();
    }

    @Override
    public String toString() {
        return getClass().getName() + "[" + this.resource.getDescription() + "]";
    }
}
