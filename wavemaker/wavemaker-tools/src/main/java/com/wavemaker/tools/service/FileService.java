/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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
import java.io.OutputStream;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.io.Writer;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;

/**
 * Abstraction for reading and writing files. Each FileService handles encoding issues (reading and writing files using
 * its defined encoding), and it also knows about a root (enabling relative path operations).
 * 
 * @author Simon Toens
 * @author Matt Small
 * @author Jeremy Grelle
 */
@Deprecated
public interface FileService {

    /**
     * Return the current encoding for this FileService.
     */
    String getEncoding();

    /**
     * Return the root for this FileService.
     */
    Folder getFileServiceRoot();

    /**
     * Write the specified contents to a relative path.
     * 
     * @param path The relative path (according to the FileService) to write to.
     * @param data The data to write (using the FileService's encoding).
     * @throws IOException
     */
    void writeFile(String path, String data) throws IOException;

    /**
     * Write the specified contents to an absolute path.
     * 
     * @param file The absolute path to write to.
     * @param data The data to write (using the FileService's encoding).
     * @throws IOException
     */
    void writeFile(File file, String data) throws IOException;

    /**
     * Read arbitrary data from a file.
     * 
     * @param path The relative path to read from.
     * @return The data read.
     * @throws IOException
     */
    String readFile(String path) throws IOException;

    /**
     * Read arbitrary data from a file.
     * 
     * @param file The file to read,
     * @return The data read.
     * @throws IOException
     */
    String readFile(File file) throws IOException;

    /**
     * Delete a file at the specified path.
     * 
     * @param path The path to delete.
     * @throws IOException
     */
    void deleteFile(String path) throws IOException;

    /**
     * Delete a specified file
     * 
     * @param file The file to delete.
     * @throws IOException
     */
    void deleteFile(Resource file) throws IOException;

    /**
     * Get a Reader for the specified relative path, using this FileService's encoding.
     * 
     * @throws IOException
     */
    Reader getReader(String path) throws UnsupportedEncodingException, FileNotFoundException, IOException;

    /**
     * Get a Reader for the specified file, using this FileService's encoding.
     * 
     * @throws IOException
     */
    Reader getReader(File file) throws UnsupportedEncodingException, FileNotFoundException, IOException;

    /**
     * Get a Writer for the specified relative path, using this FileService's encoding.
     * 
     * @throws IOException
     */
    Writer getWriter(String path) throws UnsupportedEncodingException, FileNotFoundException, IOException;

    /**
     * Get a Writer for the specified file, using this FileService's encoding.
     */
    Writer getWriter(File file) throws UnsupportedEncodingException, FileNotFoundException;

    /**
     * Returns true if the file exists.
     * 
     * @throws IOException
     */
    boolean fileExists(String path) throws IOException;

    /**
     * Return true if the file exists.
     */
    boolean fileExists(Resource file);

    OutputStream getOutputStream(File resource);
}