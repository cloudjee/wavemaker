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
import java.net.URI;
import java.net.URL;
import java.util.ArrayList;

import org.bson.types.ObjectId;
import org.springframework.core.io.Resource;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCursor;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSInputFile;

/**
 * @author Ed Callahan
 * 
 */
public class GFSResource implements Resource {

    private static final String METADATA_PATH_KEY = "Path";

    private final GridFS gfs;

    private GridFSInputFile file;

    private final String path;

    private String filename;

    private final Boolean isDir;

    /*
     * Creates a Resource from a GridFS and a String If path does not end in a filename extension, it will be considered
     * a directory. Directory paths must always end in "/"
     */
    public GFSResource(GridFS gfs, String path) {
        Assert.notNull(gfs, "GridFS must not be null");
        Assert.notNull(path, "Path must not be null");
        this.isDir = null != StringUtils.getFilenameExtension(path) ? false : true;
        this.gfs = gfs;
        this.path = StringUtils.cleanPath(path);
        this.filename = StringUtils.getFilename(path);
        if (!this.isDir) {
            this.file = gfs.createFile();
            this.file.setMetaData(new BasicDBObject(METADATA_PATH_KEY, this.path));
            this.setFilename(this.filename);
            this.file.save();
        }
    }

    /*
     * Creates a Resource from an input stream. Always a file
     */
    public GFSResource(GridFS gfs, InputStream in, String filename, String path) {
        Assert.notNull(gfs, "GFS must not be null");
        Assert.notNull(in, "InputStream must not be null");
        Assert.notNull(filename, "FileName must not be null");
        Assert.notNull(path, "Path must not be null");
        this.isDir = false;
        this.filename = filename;
        this.gfs = gfs;
        this.path = StringUtils.cleanPath(path);
        this.file = gfs.createFile(in);
        this.file.setMetaData(new BasicDBObject(METADATA_PATH_KEY, this.path));
        this.setFilename(StringUtils.getFilename(path));
        this.file.save();
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
     * Returns the GridFSInputFile.
     * 
     * @see com.mongo.gridfs.GridFSInputFile.getFilename()
     */
    public GridFSInputFile getGridFSInputFile() {
        Assert.notNull(this.file);
        return this.file;
    }

    /**
     * Returns the name of the file.
     * 
     * @see com.mongo.gridfs.GridFSInputFile.getFilename()
     */
    public void setGridFSInputFile(GridFSInputFile file) {
        Assert.notNull(file);
        this.file = file;
    }

    /**
     * Returns the name of the file.
     * 
     * @see com.mongo.gridfs.GridFSInputFile.getFilename()
     */
    public String getFilename() {
        return this.filename;
    }

    /**
     * Sets the name of the file.
     * 
     * @see com.mongo.gridfs.GridFSInputFile.getFilename()
     */
    public void setFilename(String fn) {
        this.filename = fn;
        if (this.file != null) {
            this.file.setFilename(fn);
        }
    }

    /**
     * Queries the GridFS for files with matching Path metadata
     * 
     * @return array of GridFSInputFiles
     */
    public GridFSInputFile[] listFiles() {
        Assert.isTrue(isDirectory(), "Can only list files of a directory");
        ArrayList<GridFSInputFile> ret = new ArrayList<GridFSInputFile>();

        DBCursor dbc = this.gfs.getFileList(new BasicDBObject(METADATA_PATH_KEY, this.path));
        while (dbc.hasNext()) {
            ret.add((GridFSInputFile) dbc.next());
        }
        GridFSInputFile[] result = new GridFSInputFile[ret.size()];
        return ret.toArray(result);
    }

    /**
     * Returns true unless path is null
     */
    public boolean exists() {
        return this.path != null ? true : false;
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
    public boolean isReadable() {
        return this.exists();
    }

    /**
     * This implementation always returns <code>false</code>.
     */
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
    public long contentLength() throws IOException {
        return this.file.getLength();
    }

    /**
     * Returns the upload date for this resource in unix time.
     * 
     * @throws IOException if the resource cannot be resolved (in the file system or as some other known physical
     *         resource type)
     */
    public long lastModified() throws IOException {
        return this.file.getUploadDate().getTime();
    }

    /**
     * Create a resource relative to this resource.
     * 
     * @param relativePath the relative path (relative to this resource)
     * @return the resource handle for the relative resource
     * @throws IOException if the relative resource cannot be determined
     */
    public GFSResource createRelative(GridFS gfs, String relativePath) throws IOException {
        String pathToUse = StringUtils.applyRelativePath(this.path, relativePath);
        return new GFSResource(gfs, pathToUse);
    }

    public GFSResource createRelative(String relativePath) throws IOException {
        return createRelative(this.gfs, relativePath);
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
    public String getDescription() {
        return this.file.getContentType();
    }

    /**
     * Returns the inputStream for the file
     */
    public InputStream getInputStream() throws IOException {
        Assert.notNull(this.file, "File can not be null for inputStream");
        return this.gfs.findOne((ObjectId) this.file.getId()).getInputStream();
    }

    /**
     * This operation is not supported
     */
    public URL getURL() throws UnsupportedOperationException {
        throw new UnsupportedOperationException();
    }

    /**
     * This operation is not supported
     */
    public URI getURI() throws UnsupportedOperationException {
        throw new UnsupportedOperationException();
    }

    /**
     * This operation is not supported This module does not return files
     */
    public File getFile() throws UnsupportedOperationException {
        throw new UnsupportedOperationException();
    }

}
