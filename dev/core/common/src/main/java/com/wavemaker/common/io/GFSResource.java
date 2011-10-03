/**
 * Provides a Spring Resource over a GridFSInputFile
 * Path is maintained by GFSResource 
 * @see com.mongodb.gridfs.GridFSInputFile
 */
package com.wavemaker.common.io;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.net.URL;

import org.springframework.core.io.Resource;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSInputFile;

/**
 * @author ecallahan
 * 
 */
public class GFSResource implements Resource {

	//protected String bucket;
	protected GridFS gfs;
	protected GridFSInputFile file;
	protected String path;

	//AbstractResource
	public GFSResource() {
		Assert.notNull(gfs, "GridFS is Null !");
		this.file = this.gfs.createFile();
		this.path = "/";
	}
	
	// FileSystemResource
	public GFSResource(GridFSInputFile file) {
		Assert.notNull(gfs, "File must not be null");
		this.file = file;		
	}

	public GFSResource(GridFS gfs, String path) {
		Assert.notNull(gfs, "File must not be null");
		Assert.notNull(path, "Path must not be null");
		this.file = gfs.createFile();
		this.path = StringUtils.cleanPath(path);
	}
	
	public GFSResource(GridFSInputFile file, String path) {
		Assert.notNull(file, "File must not be null");
		Assert.notNull(path, "Path must not be null");
		this.file = file;
		this.path = StringUtils.cleanPath(path);
	}

	public void save(){
		this.file.save();
	}
	
	/**
	 * Return the path for this resource.
	 */
	public String getPath() {
		return this.path;
	}

	/**
	 * Returns the name of the file.
	 * 
	 * @see com.mongo.gridfs.GridFSInputFile.getFilename()
	 */
	@Override
	public String getFilename() {
		return this.file.getFilename();
	}
	
	/**
	 * Returns the name of the file.
	 * 
	 * @see com.mongo.gridfs.GridFSInputFile.getFilename()
	 */
	public void setFilename(String fn) {
		this.file.setFilename(fn);
	}
	
	/**
	 * Returns true if GridFS is not null
	 */
	public boolean exists() {
		if (this.gfs != null) {
			return true;
		} else
			return false;
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
	 * This module does not return files
	 * download streams to create files
	 */
	public File getFile() throws UnsupportedOperationException {
		throw new UnsupportedOperationException();
	}

	/**
	 * Determine the content length for this resource.
	 * 
	 * @throws IOException
	 *             if the resource cannot be resolved (in the file system or as
	 *             some other known physical resource type)
	 */
	public long contentLength() throws IOException {
		return this.file.getLength();
	}

	/**
	 * Returns the upload date for this resource in unix time.
	 * 
	 * @throws IOException
	 *             if the resource cannot be resolved (in the file system or as
	 *             some other known physical resource type)
	 */
	public long lastModified() throws IOException {
		return this.file.getUploadDate().getTime();
	}

	/**
	 * Create a resource relative to this resource.
	 * 
	 * @param relativePath
	 *            the relative path (relative to this resource)
	 * @return the resource handle for the relative resource
	 * @throws IOException
	 *             if the relative resource cannot be determined
	 */
	public GFSResource createRelative(GridFS gfs, String relativePath) throws IOException {
		return new GFSResource(gfs, this.path + relativePath);
	}

	public GFSResource createRelative(String relativePath) throws IOException {
		throw new UnsupportedOperationException();
	}

	/**
	 * Return the MD5 for this resource
	 */
	public String getMD5() {
		return this.file.getMD5();
	}

	/**
	 * Return the contentType * @see
	 * com.mongodb.gridfs.GridFSFile#getContentType()
	 */
	public String getDescription() {
		return this.file.getContentType();
	}
	
	/**
	 *  After retrieving this OutputStream, this object will be capable of accepting successively written data to the output stream.
	 *  @see com.mongodb.gridfs.GridFSInputFile#getOutputSream()
	 */
	
	public OutputStream getOutputStream(){
		return this.file.getOutputStream();
	}
	/**
	 * This operation is not supported
	 */
	@Override
	public InputStream getInputStream() throws IOException {
		throw new UnsupportedOperationException();
	}

}
