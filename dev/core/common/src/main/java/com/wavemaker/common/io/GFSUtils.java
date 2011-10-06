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
 *  GridFS specific helper utils
 * 
 */
package com.wavemaker.common.io;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.bson.types.ObjectId;

import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSInputFile;

import com.wavemaker.common.io.GFSResource;
import com.wavemaker.common.WMRuntimeException;

/**
 * @author ecallahan
 * 
 */
public class GFSUtils {

	/**
	 * List of our default exclusion directory names. This is used both by
	 */
	public static final List<String> DEFAULT_EXCLUSION = Collections
			.unmodifiableList(Arrays.asList(new String[] { ".svn" }));

	/**
	 * Copy from: file to file, directory to directory, file to directory.
	 * 
	 * @param source
	 *            Resource object representing a file or directory to copy from.
	 * @param destination
	 *            Resource object representing the target; can only represent a
	 *            file if the source is a file.
	 * @param excludes
	 *            A list of exclusion filenames.
	 * @throws IOException
	 */
	public static void copy(GridFS gfs, GFSResource source,
			GFSResource destination, List<String> excludes) throws IOException {

		try {
			if (!source.exists()) {
				throw new IOException("Can't copy from non-existent file: "
						+ source.getPath() + source.getFilename());
			} else if (excludes.contains(source.getFilename())) {
				return;
			}

			if (source.isDirectory()) {
				if (!destination.exists()) {
					new GFSResource(gfs, destination.getPath());
				}
				if (!destination.isDirectory()) {
					throw new IOException("Can't copy directory ("
							+ source.getPath() + ") to non-directory: "
							+ destination.getPath());
				}

				GridFSInputFile files[] = source.listFiles();
				for (int i = 0; i < files.length; i++) {
					//Find the GridFSDBFile for the source, get its input stream and create new file resource
					new GFSResource(gfs,gfs.findOne((ObjectId)files[i].getId()).getInputStream(),files[i].getFilename(),destination.getPath());
					}
			} else if (source.isFile()) {
				if (destination.isDirectory()) { 
					new GFSResource(gfs, source.getInputStream(), source.getFilename(),destination.getPath());
				}
				else{
					new GFSResource(gfs,source.getInputStream(),destination.getFilename(),destination.getPath());
				}
			} else {
				throw new IOException("Don't know how to copy "
						+ ((GFSResource) source).getPath()
						+ "; it's neither a directory nor a file");
			}
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	/**
	 *  Delete a file or the files of a directory
	 */
	public static void forceDelete(GridFS gfs, GFSResource file) {
		if(file.isDirectory()){
			GridFSInputFile files[] = file.listFiles();
			for (int i = 0; i < files.length; i++) {
				gfs.remove(files[i].getFilename());
			}
		}
		else {
			file.deleteFile();
		}
	}
}
