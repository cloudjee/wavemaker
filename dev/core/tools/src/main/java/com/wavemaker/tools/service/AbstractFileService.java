/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.io.Writer;

import org.springframework.core.io.Resource;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;

import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.tools.project.StudioFileSystem;

/**
 * An abstract version of the FileService. Provides default implementations of some methods, as well as a default
 * encoding that matches ServerConstants.DEFAULT_ENCODING (currently, UTF-8).
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public abstract class AbstractFileService implements FileService {

    private StudioFileSystem fileSystem;

    protected final StudioFileSystem getFileSystem() {
        return this.fileSystem;
    }

    public AbstractFileService(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    @Override
    public String getEncoding() {
        return ServerConstants.DEFAULT_ENCODING;
    }

    @Override
    public String readFile(String path) throws IOException {
        return readFile(getFileServiceRoot().createRelative(path));
    }

    @Override
    public String readFile(Resource file) throws IOException {
        return FileCopyUtils.copyToString(getReader(file));
    }

    @Override
    public void writeFile(String path, String data) throws IOException {
        writeFile(getFileServiceRoot().createRelative(path), data);
    }

    @Override
    public void writeFile(Resource file, String data) throws IOException {
        FileCopyUtils.copy(data, getWriter(file));
    }

    @Override
    public boolean deleteFile(String path) throws IOException {
        return deleteFile(getFileServiceRoot().createRelative(path));
    }

    @Override
    public boolean deleteFile(Resource file) throws IOException {
        Assert.notNull(this.fileSystem, "StudioFileSystem is required.");
        return this.fileSystem.deleteFile(file);
    }

    @Override
    public Reader getReader(Resource file) throws UnsupportedEncodingException, FileNotFoundException, IOException {
        return new InputStreamReader(file.getInputStream(), getEncoding());
    }

    @Override
    public Reader getReader(String path) throws UnsupportedEncodingException, FileNotFoundException, IOException {
        return getReader(getFileServiceRoot().createRelative(path));
    }

    @Override
    public Writer getWriter(Resource file) throws UnsupportedEncodingException, FileNotFoundException {
        Assert.notNull(this.fileSystem, "StudioFileSystem is required.");
        return new OutputStreamWriter(this.fileSystem.getOutputStream(file), getEncoding());
    }

    @Override
    public Writer getWriter(String path) throws UnsupportedEncodingException, FileNotFoundException, IOException {
        return getWriter(getFileServiceRoot().createRelative(path));
    }

    @Override
    public boolean fileExists(String path) throws IOException {
        return getFileServiceRoot().createRelative(path).exists();
    }

    @Override
    public boolean fileExists(Resource file) {
        return file.exists();
    }

    @Override
    public OutputStream getOutputStream(Resource resource) {
        return this.fileSystem.getOutputStream(resource);
    }

}