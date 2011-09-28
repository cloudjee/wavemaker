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
 * An abstract version of the FileService. Provides default implementations of
 * some methods, as well as a default encoding that matches
 * ServerConstants.DEFAULT_ENCODING (currently, UTF-8).
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
	public String getEncoding() {
		return ServerConstants.DEFAULT_ENCODING;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.runtime.service.FileService#readFile(java.lang.String)
	 */
	public String readFile(String path) throws IOException {
		return readFile(getFileServiceRoot().createRelative(path));
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.runtime.service.FileService#readFile(java.io.File)
	 */
	public String readFile(Resource file) throws IOException {
		return FileCopyUtils.copyToString(getReader(file));
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.wavemaker.runtime.service.FileService#writeFile(java.lang.String,
	 * java.lang.String)
	 */
	public void writeFile(String path, String data) throws IOException {
		writeFile(getFileServiceRoot().createRelative(path), data);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.runtime.service.FileService#writeFile(java.io.File,
	 * java.lang.String)
	 */
	public void writeFile(Resource file, String data) throws IOException {
		FileCopyUtils.copy(data, getWriter(file));
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.wavemaker.runtime.service.FileService#deleteFile(java.lang.String)
	 */
	public boolean deleteFile(String path) throws IOException{
		return deleteFile(getFileServiceRoot().createRelative(path));
	}

	/*
	 * (non-Javadoc)
	 * @see com.wavemaker.tools.service.FileService#deleteFile(org.springframework.core.io.Resource)
	 */
	public boolean deleteFile(Resource file) throws IOException {
		Assert.notNull(studioConfiguration, "Studio Configuration is required.");
		return studioConfiguration.deleteFile(file);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.runtime.service.FileService#getReader(java.io.File)
	 */
	public Reader getReader(Resource file) throws UnsupportedEncodingException,
			FileNotFoundException, IOException {
		return new InputStreamReader(file.getInputStream(), getEncoding());
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.wavemaker.runtime.service.FileService#getReader(java.lang.String)
	 */
	public Reader getReader(String path) throws UnsupportedEncodingException,
			FileNotFoundException, IOException {
		return getReader(getFileServiceRoot().createRelative(path));
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.runtime.service.FileService#getWriter(java.io.File)
	 */
	public Writer getWriter(Resource file) throws UnsupportedEncodingException,
			FileNotFoundException {
		Assert.notNull(studioConfiguration, "Studio Configuration is required.");
		return new OutputStreamWriter(studioConfiguration.getOutputStream(file), getEncoding());
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.wavemaker.runtime.service.FileService#getWriter(java.lang.String)
	 */
	public Writer getWriter(String path) throws UnsupportedEncodingException,
			FileNotFoundException, IOException {
		return getWriter(getFileServiceRoot().createRelative(path));
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.tools.service.FileService#exists(java.lang.String)
	 */
	public boolean fileExists(String path) throws IOException {
		return getFileServiceRoot().createRelative(path).exists();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.wavemaker.tools.service.FileService#exists(java.io.File)
	 */
	public boolean fileExists(Resource file) {
		return file.exists();
	}
}