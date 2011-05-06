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

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.io.Writer;

import org.apache.commons.io.FileUtils;

import com.wavemaker.runtime.server.ServerConstants;

/**
 * An abstract version of the FileService.  Provides default implementations of
 * some methods, as well as a default encoding that matches
 * ServerConstants.DEFAULT_ENCODING (currently, UTF-8).
 * 
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public abstract class AbstractFileService implements FileService {

    /* (non-Javadoc)
     * @see com.wavemaker.runtime.service.FileService#getEncoding()
     */
    public String getEncoding() {
        return ServerConstants.DEFAULT_ENCODING;
    }

    /* (non-Javadoc)
     * @see com.wavemaker.runtime.service.FileService#readFile(java.lang.String)
     */
    public String readFile(String path) throws IOException {
        
        return readFile(new File(getFileServiceRoot(), path));
    }

    /* (non-Javadoc)
     * @see com.wavemaker.runtime.service.FileService#readFile(java.io.File)
     */
    public String readFile(File file) throws IOException {
        
        return FileUtils.readFileToString(file, getEncoding());
    }

    /* (non-Javadoc)
     * @see com.wavemaker.runtime.service.FileService#writeFile(java.lang.String, java.lang.String)
     */
    public void writeFile(String path, String data) throws IOException {
        
        writeFile(new File(getFileServiceRoot(), path), data);
    }

    /* (non-Javadoc)
     * @see com.wavemaker.runtime.service.FileService#writeFile(java.io.File, java.lang.String)
     */
    public void writeFile(File file, String data) throws IOException {
        FileUtils.writeStringToFile(file, data, getEncoding());
    }

    /* (non-Javadoc)
     * @see com.wavemaker.runtime.service.FileService#deleteFile(java.lang.String)
     */
    public boolean deleteFile(String path) {
        return (new File(getFileServiceRoot(), path)).delete();
    }

    /* (non-Javadoc)
     * @see com.wavemaker.runtime.service.FileService#getReader(java.io.File)
     */
    public Reader getReader(File file)
            throws UnsupportedEncodingException, FileNotFoundException {
        return new InputStreamReader(new FileInputStream(file), getEncoding());
    }

    /* (non-Javadoc)
     * @see com.wavemaker.runtime.service.FileService#getReader(java.lang.String)
     */
    public Reader getReader(String path)
            throws UnsupportedEncodingException, FileNotFoundException {
        return getReader(new File(getFileServiceRoot(), path));
    }

    /* (non-Javadoc)
     * @see com.wavemaker.runtime.service.FileService#getWriter(java.io.File)
     */
    public Writer getWriter(File file)
            throws UnsupportedEncodingException, FileNotFoundException {
        return new OutputStreamWriter(new FileOutputStream(file), getEncoding());
    }

    /* (non-Javadoc)
     * @see com.wavemaker.runtime.service.FileService#getWriter(java.lang.String)
     */
    public Writer getWriter(String path)
            throws UnsupportedEncodingException, FileNotFoundException {
        return getWriter(new File(getFileServiceRoot(), path));
    }

    /* (non-Javadoc)
     * @see com.wavemaker.tools.service.FileService#exists(java.lang.String)
     */
    public boolean fileExists(String path) {
        return (new File(getFileServiceRoot(), path)).exists();
    }

    /* (non-Javadoc)
     * @see com.wavemaker.tools.service.FileService#exists(java.io.File)
     */
    public boolean fileExists(File file) {
        return file.exists();
    }
}