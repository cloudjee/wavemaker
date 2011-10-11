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
import com.wavemaker.tools.project.StudioConfiguration;

/**
 * An abstract version of the FileService. Provides default implementations of some methods, as well as a default
 * encoding that matches ServerConstants.DEFAULT_ENCODING (currently, UTF-8).
 * 
 * @author small
 * @author Jeremy Grelle
 * 
 */
public abstract class AbstractFileService implements FileService {

    protected StudioConfiguration studioConfiguration;

    public AbstractFileService(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }

    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.FileService#getEncoding()
     */
    @Override
    public String getEncoding() {
        return ServerConstants.DEFAULT_ENCODING;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.FileService#readFile(java.lang.String)
     */
    @Override
    public String readFile(String path) throws IOException {
        return readFile(getFileServiceRoot().createRelative(path));
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.FileService#readFile(java.io.File)
     */
    @Override
    public String readFile(Resource file) throws IOException {
        return FileCopyUtils.copyToString(getReader(file));
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.FileService#writeFile(java.lang.String, java.lang.String)
     */
    @Override
    public void writeFile(String path, String data) throws IOException {
        writeFile(getFileServiceRoot().createRelative(path), data);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.FileService#writeFile(java.io.File, java.lang.String)
     */
    @Override
    public void writeFile(Resource file, String data) throws IOException {
        FileCopyUtils.copy(data, getWriter(file));
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.FileService#deleteFile(java.lang.String)
     */
    @Override
    public boolean deleteFile(String path) throws IOException {
        return deleteFile(getFileServiceRoot().createRelative(path));
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.service.FileService#deleteFile(org.springframework.core.io.Resource)
     */
    @Override
    public boolean deleteFile(Resource file) throws IOException {
        Assert.notNull(this.studioConfiguration, "Studio Configuration is required.");
        return this.studioConfiguration.deleteFile(file);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.FileService#getReader(java.io.File)
     */
    @Override
    public Reader getReader(Resource file) throws UnsupportedEncodingException, FileNotFoundException, IOException {
        return new InputStreamReader(file.getInputStream(), getEncoding());
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.FileService#getReader(java.lang.String)
     */
    @Override
    public Reader getReader(String path) throws UnsupportedEncodingException, FileNotFoundException, IOException {
        return getReader(getFileServiceRoot().createRelative(path));
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.FileService#getWriter(java.io.File)
     */
    @Override
    public Writer getWriter(Resource file) throws UnsupportedEncodingException, FileNotFoundException {
        Assert.notNull(this.studioConfiguration, "Studio Configuration is required.");
        return new OutputStreamWriter(this.studioConfiguration.getOutputStream(file), getEncoding());
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.FileService#getWriter(java.lang.String)
     */
    @Override
    public Writer getWriter(String path) throws UnsupportedEncodingException, FileNotFoundException, IOException {
        return getWriter(getFileServiceRoot().createRelative(path));
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.service.FileService#exists(java.lang.String)
     */
    @Override
    public boolean fileExists(String path) throws IOException {
        return getFileServiceRoot().createRelative(path).exists();
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.service.FileService#exists(java.io.File)
     */
    @Override
    public boolean fileExists(Resource file) {
        return file.exists();
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.service.FileService#getOutputStream(org.springframework.core.io.Resource)
     */
    @Override
    public OutputStream getOutputStream(Resource resource) {
        return this.studioConfiguration.getOutputStream(resource);
    }

}