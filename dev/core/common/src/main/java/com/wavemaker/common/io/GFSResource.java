/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

/**
 * Provides a Spring Resource over a GridFSInputFile
 * Path and filename are members of GFSResource for both files and dirs
 * Files also store path in metadata for retrieval without Resource 
 * @see com.mongodb.gridfs.GridFSInputFile
 */

package com.wavemaker.common.io;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;
import com.wavemaker.common.WMRuntimeException;

/**
 * @author Ed Callahan
 * 
 */
public class GFSResource implements Resource {

    private static final String METADATA_PATH_KEY = "Path";

    private final GridFS gfs;

    private GridFSDBFile file;

    protected final String path;

    protected String filename;

    protected final Boolean isDir;

    protected final DBObject dirsDoc;

    /**
     * Creates a Resource from a GridFS and a String If path does not end in a filename extension, it will be considered
     * a directory. Directory paths must always end in "/". Must call save() OR close() on outputStream to save data
     * 
     * @see com.mongodb.gridfs.GridFS.html#createFile(java.io.InputStream, java.lang.String)
     */
    public GFSResource(GridFS gfs, DBObject dirsDoc, String path) {
        Assert.notNull(gfs, "GridFS must not be null");
        Assert.notNull(path, "Path must not be null");
        this.isDir = null != StringUtils.getFilenameExtension(path) ? false : true;
        this.gfs = gfs;
        this.dirsDoc = dirsDoc;
        this.path = StringUtils.cleanPath(path);
        this.filename = StringUtils.getFilename(StringUtils.trimTrailingCharacter(path, '/'));
    }

    /**
     * Return the path for this resource.
     */
    public String getPath() {
        return this.path;
    }

    /**
     * Returns the parent path string or null if none
     */
    public String getParent() {
        String ret = this.path;
        if (this.path.lastIndexOf("/") == 0) {
            return null;
        }
        if (isDirectory()) {
            ret = ret.substring(0, ret.lastIndexOf("/"));
        }
        return ret.substring(0, ret.lastIndexOf("/"));
    }

    /**
     * Returns the name of the file.
     * 
     * @see com.mongo.gridfs.GridFSInputFile.getFilename()
     */
    @Override
    public String getFilename() {
        return this.filename;
    }

    /**
     * Queries the GridFS for files with matching Path metadata
     * 
     * @return array of GridFSDBFile
     */
    public List<GridFSDBFile> listFiles() {
        Assert.isTrue(isDirectory(), "Can only list files of a directory");
        return this.gfs.find(new BasicDBObject(METADATA_PATH_KEY, this.path));
    }

    /**
     * Returns true if the file exists in GridFS
     */
    @Override
    public boolean exists() {
        if (isDirectory()) {
            return this.dirsDoc.containsField(this.path);
        }
        if (this.file == null) {
            this.file = this.gfs.findOne(this.path);
        }
        return this.file != null;
    }

    /**
     * Delete the file
     * 
     */
    public void deleteFile() {
        Assert.notNull(getFilename(), "Can't delete without a filename");
        this.gfs.remove(getFilename());
    }

    /**
     * Returns true if exists
     */
    @Override
    public boolean isReadable() {
        return this.exists();
    }

    /**
     * This implementation always returns <code>false</code>.
     */
    @Override
    public boolean isOpen() {
        return false;
    }

    /**
     * Returns false if there is a file, else returns true;
     */
    public boolean isDirectory() {
        return this.isDir;
    }

    /**
     * Returns false if there is a file, else returns true;
     */
    public boolean isFile() {
        return !this.isDir;
    }

    /**
     * Determine the content length for this resource.
     * 
     * @throws IOException if the resource cannot be resolved (in the file system or as some other known physical
     *         resource type)
     */
    @Override
    public long contentLength() throws IOException {
        return this.file.getLength();
    }

    /**
     * Returns the upload date for this resource in unix time.
     * 
     * @throws IOException if the resource cannot be resolved (in the file system or as some other known physical
     *         resource type)
     */
    @Override
    public long lastModified() throws IOException {
        return this.file.getUploadDate().getTime();
    }

    @Override
    public GFSResource createRelative(String relativePath) throws IOException {
        String pathToUse = StringUtils.applyRelativePath(this.path, relativePath);
        return new GFSResource(this.gfs, this.dirsDoc, pathToUse);
    }

    /**
     * Return the MD5 for this resource
     */
    public String getMD5() {
        return this.file.getMD5();
    }

    /**
     * Return the contentType
     * 
     * @see com.mongodb.gridfs.GridFSFile#getContentType()
     */
    @Override
    public String getDescription() {
        return this.file.getContentType();
    }

    /**
     * Returns the inputStream for the file
     */
    @Override
    public InputStream getInputStream() throws IOException {
        if (!this.exists()) {
            throw new IOException("File does not exist at path: " + this.path);
        }
        return this.file.getInputStream();
    }

    /**
     * Returns the outputStream for the file
     */
    public OutputStream getOutputStream() throws IOException {
        if (this.exists()) {
            // TODO - delete the old version
        }
        GridFSInputFile gfsFile = this.gfs.createFile(this.path);
        String parentDir = this.path.substring(0, this.path.lastIndexOf(this.filename));
        gfsFile.put(METADATA_PATH_KEY, parentDir);
        return gfsFile.getOutputStream();
    }

    /**
     * This operation is not supported
     */
    @Override
    public URL getURL() {
        throw new UnsupportedOperationException();
    }

    /**
     * 
     * {@inheritDoc}
     */
    @Override
    public URI getURI() {
        try {
            return new URI("gfs://" + this.path);
        } catch (URISyntaxException e) {
            throw new WMRuntimeException(e);
        }
    }

    /**
     * This operation is not supported This module does not return files
     */
    @Override
    public File getFile() {
        throw new UnsupportedOperationException();
    }

}
