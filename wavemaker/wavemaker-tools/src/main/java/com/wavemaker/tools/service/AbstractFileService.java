/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.project.StudioFileSystem;

/**
 * An abstract version of the FileService. Provides default implementations of some methods, as well as a default
 * encoding that matches ServerConstants.DEFAULT_ENCODING (currently, UTF-8).
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
@Deprecated
public abstract class AbstractFileService implements FileService {

    private StudioFileSystem fileSystem;

    protected StudioFileSystem getFileSystem() {
        return this.fileSystem;
    }

    // cftempfix
    public AbstractFileService() {
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
        return readFile(getFileServiceRoot().appendFile(path));
    }

    @Override
    public String readFile(File file) throws IOException {
        return file.getContent().asString();
    }

    @Override
    public void writeFile(String path, String data) throws IOException {
        writeFile(getFileServiceRoot().getFile(path), data);
    }

    @Override
    public void writeFile(File file, String data) throws IOException {
        file.getContent().write(data);
    }

    @Override
    public void deleteFile(String path) throws IOException {
        deleteFile(getFileServiceRoot().getFile(path));
    }

    @Override
    public void deleteFile(Resource file) throws IOException {
        file.delete();
    }

    @Override
    public Reader getReader(File file) throws UnsupportedEncodingException, FileNotFoundException, IOException {
        return new InputStreamReader(file.getContent().asInputStream(), getEncoding());

    }

    @Override
    public Reader getReader(String path) throws UnsupportedEncodingException, FileNotFoundException, IOException {
        return getReader(getFileServiceRoot().getFile(path));
    }

    @Override
    public Writer getWriter(File file) throws UnsupportedEncodingException, FileNotFoundException {
        return new OutputStreamWriter(file.getContent().asOutputStream(), getEncoding());
    }

    @Override
    public Writer getWriter(String path) throws UnsupportedEncodingException, FileNotFoundException, IOException {
        return getWriter(getFileServiceRoot().getFile(path));
    }

    @Override
    public boolean fileExists(String path) throws IOException {
        return getFileServiceRoot().getFile(path).exists();
    }

    @Override
    public boolean fileExists(Resource file) {
        return file.exists();
    }

    @Override
    public OutputStream getOutputStream(File resource) {
        return resource.getContent().asOutputStream();
    }

}