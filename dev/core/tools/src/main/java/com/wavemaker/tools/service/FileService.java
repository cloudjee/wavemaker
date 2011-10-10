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

package com.wavemaker.tools.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.io.Writer;

import org.springframework.core.io.Resource;

/**
 * Abstraction for reading and writing files. Each FileService handles encoding issues (reading and writing files using
 * its defined encoding), and it also knows about a root (enabling relative path operations).
 * 
 * @author Simon Toens
 * @author Matt Small
 * @author Jeremy Grelle
 */
public interface FileService {

    /**
     * Return the current encoding for this FileService.
     */
    String getEncoding();

    /**
     * Return the root for this FileService.
     */
    Resource getFileServiceRoot();

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
    void writeFile(Resource file, String data) throws IOException;

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
     * @param path The absolute path to read from.
     * @return The data read.
     * @throws IOException
     */
    String readFile(Resource file) throws IOException;

    /**
     * Delete a file at the specified path.
     * 
     * @param path The path to delete.
     * @return True iff the file delete was successful.
     * @throws IOException
     */
    boolean deleteFile(String path) throws IOException;

    /**
     * Delete a specified file
     * 
     * @param file The file to delete.
     * @return True iff the file delete was successful.
     * @throws IOException
     */
    boolean deleteFile(Resource file) throws IOException;

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
    Reader getReader(Resource file) throws UnsupportedEncodingException, FileNotFoundException, IOException;

    /**
     * Get a Writer for the specified relative path, using this FileService's encoding.
     * 
     * @throws IOException
     */
    Writer getWriter(String path) throws UnsupportedEncodingException, FileNotFoundException, IOException;

    /**
     * Get a Writer for the specified file, using this FileService's encoding.
     */
    Writer getWriter(Resource file) throws UnsupportedEncodingException, FileNotFoundException;

    /**
     * Returns true iff the file exists.
     * 
     * @throws IOException
     */
    boolean fileExists(String path) throws IOException;

    /**
     * Return true iff the file exists.
     */
    boolean fileExists(Resource file);

    OutputStream getOutputStream(Resource resource);
}