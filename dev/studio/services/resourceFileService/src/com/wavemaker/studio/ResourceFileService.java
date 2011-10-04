/*
 * Copyright (C) 2010-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.studio;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Hashtable;

import org.apache.log4j.Logger;
import org.springframework.core.io.Resource;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.FileUploadResponse;
import com.wavemaker.runtime.server.ParamName;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioConfiguration;

/**
 * This is a client-facing service class. All public methods will be exposed to
 * the client. Their return values and parameters will be passed to the client
 * or taken from the client, respectively. This will be a singleton instance,
 * shared between all requests.
 */
public class ResourceFileService {
	protected final Logger logger = Logger.getLogger(getClass());

	private ProjectManager projectManager;

	private StudioConfiguration studioConfiguration;

	// Used by spring
	@HideFromClient
	public void setProjectManager(ProjectManager manager) {
		this.projectManager = manager;
	}
	
	@HideFromClient
	public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
		this.studioConfiguration = studioConfiguration;
	}

	@HideFromClient
	protected Resource getProjectDir() {
		return this.projectManager.getCurrentProject().getWebAppRoot();
	}

	/*
	 * Gets the project's resources folder; initializes it if it doesn't yet
	 * exist
	 */
	@HideFromClient
	private Resource getResourcesDir() {
		Resource resources;
		try {
			resources = getProjectDir().createRelative("resources/");
		} catch (IOException e) {
			throw new WMRuntimeException(e);
		}
		if (!resources.exists()) {
			resources = studioConfiguration.createPath(getProjectDir(),
					"resources/");
			studioConfiguration.createPath(resources, "images/imagelists/");
			studioConfiguration.createPath(resources, "images/buttons/");
			studioConfiguration.createPath(resources, "images/logos/");
			studioConfiguration.createPath(resources, "javascript/");
			studioConfiguration.createPath(resources, "css/");
			studioConfiguration.createPath(resources, "htmlcontent/");
		}
		return resources;
	}

	/* Respond's to user request to download a resource file */
	public DownloadResponse downloadFile(
			@ParamName(name = "folder") String folderpath,
			@ParamName(name = "filename") String filename) throws IOException {
		boolean isZip = false;
		Resource resourceDir = this.getResourcesDir();
		Resource parentDir = resourceDir.createRelative(folderpath + "/");		
		Resource localFile = parentDir.createRelative(filename + (filename.indexOf(".") == -1 ? "/" : ""));
		if (StringUtils.getFilenameExtension(filename) == null) {
			localFile = com.wavemaker.tools.project.ResourceManager
					.createZipFile(studioConfiguration, localFile,
							projectManager.getTmpDir());
			if (localFile == null)
				return (DownloadResponse) null;
			isZip = true;
			filename = localFile.getFilename();
		}

		return com.wavemaker.tools.project.ResourceManager.downloadFile(
				localFile, filename, isZip);

	}

	/*
	 * Respond's to user's request to rename/move a file. Will append a number
	 * to the name if there is already a file with the requested name
	 */
	public String renameFile(@ParamName(name = "from") String from,
			@ParamName(name = "to") String to,
			@ParamName(name = "overwrite") boolean overwrite) {
		Resource resourceDir = this.getResourcesDir();

		try {

			Resource dest = resourceDir.createRelative(to);
			if (!overwrite) {
				int lastIndexOfPeriod = to.lastIndexOf(".");
				String to1 = (lastIndexOfPeriod != -1) ? to.substring(0,
						to.lastIndexOf(".")) : to;
				String to_ext = (lastIndexOfPeriod != -1) ? to.substring(to
						.lastIndexOf(".") + 1) : "";
				for (int i = 0; i < 1000 && dest.exists(); i++) {
					dest = resourceDir.createRelative(to1 + i
							+ ((lastIndexOfPeriod != -1) ? "." : "") + to_ext);
				}
			}
			Resource f = resourceDir.createRelative(from);
			studioConfiguration.rename(f, dest);
			return dest.getFilename();
		} catch (Exception e) {
			throw new WMRuntimeException(e);
		}
	}

	/*
	 * Moves a file that was uploaded to the tmp folder to the requested
	 * destination. All uploads go to tmp folder
	 */
	public String moveNewFile(@ParamName(name = "from") String from,
			@ParamName(name = "to") String to,
			@ParamName(name = "overwrite") boolean overwrite) {
		Resource resourceDir = this.getResourcesDir();

		try {
			Resource dest = resourceDir.createRelative(to);

			if (!overwrite) {
				String to1 = (to.lastIndexOf(".") != -1) ? to.substring(0,
						to.lastIndexOf(".")) : to;
				String to_ext = (to.lastIndexOf(".") != -1) ? to.substring(to
						.lastIndexOf(".") + 1) : "";
				for (int i = 0; i < 1000 && dest.exists(); i++) {
					dest = resourceDir.createRelative(to1 + i + "." + to_ext);
				}
			}

			Resource f = projectManager.getTmpDir().createRelative(from);
			studioConfiguration.rename(f, dest);
			return dest.getFilename();
		} catch (Exception e) {
			throw new WMRuntimeException(e);
		}
	}

	/*
	 * Create a folder; name should have the full relative path within the
	 * resources folder
	 */
	public boolean createFolder(@ParamName(name = "name") String name) {
		name = name.endsWith("/") ? name : name + "/";
		Resource newFolder = studioConfiguration.createPath(getResourcesDir(),
				name);
		return newFolder.exists();
	}

	/*
	 * Delete the file; name should be the full relative path within resources
	 * folder
	 */
	public boolean deleteFile(@ParamName(name = "name") String name) {
		Resource resourceDir = this.getResourcesDir();
		try {
			Resource f = resourceDir.createRelative(name);
			studioConfiguration.deleteFile(f);
			return !f.exists();
		} catch (Exception e) {
			throw new WMRuntimeException(e);
		}
	}

	/*
	 * Send the client a datastruct listing all contents of the resources
	 * folder. WARNING: At some point we may want to support larger projects by
	 * NOT sending it all at once
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Hashtable getResourceFolder() {
		Resource resourceDir = this.getResourcesDir();
		Hashtable P = new Hashtable();
		try {
			P.put("files", com.wavemaker.tools.project.ResourceManager
					.getListing(studioConfiguration, resourceDir,
							resourceDir.createRelative(".includeJars")));
		} catch (IOException e) {
			throw new WMRuntimeException(e);
		}
		P.put("file", resourceDir.getFilename());
		P.put("type", "folder");
		return P;
	}

	public FileUploadResponse uploadFile(
			@ParamName(name = "file") MultipartFile file, String path)
			throws IOException {
		FileUploadResponse ret = new FileUploadResponse();
		try {
			path = path.endsWith("/") ? path : path + "/";
			Resource dir = getResourcesDir().createRelative(path);
			Resource outputFile = dir.createRelative(file.getOriginalFilename()
					.replaceAll("[^a-zA-Z0-9.-_ ]", ""));
			FileCopyUtils.copy(file.getInputStream(),
					studioConfiguration.getOutputStream(outputFile));
			ret.setPath(outputFile.getDescription());
			ret.setError("");
			ret.setWidth("");
			ret.setHeight("");

		} catch (Exception e) {
			ret.setError(e.getMessage());
		}
		return ret;
	}

	/**
	 * Unzips a zip file in the tmp folder and moves it to the specified
	 * location. NOTE: Will not overwrite an existing folder at that location;
	 * instead will rename to avoid collision NOTE:
	 * 
	 * @see ProjectManager#openProject(String)
	 * @return An OpenProjectReturn object containing the current web path, as
	 *         well as any upgrades that were performed.
	 */
	public boolean unzipAndMoveNewFile(@ParamName(name = "file") String path) {
		try {
			Resource zipfile = getResourcesDir().createRelative(path);
			Resource zipfolder = com.wavemaker.tools.project.ResourceManager
					.unzipFile(studioConfiguration, zipfile);
			return zipfolder.exists()
					&& StringUtils
							.getFilenameExtension(zipfolder.getFilename()) == null;
		} catch (IOException e) {
			throw new WMRuntimeException(e);
		}
	}

	public boolean changeClassPath(String inPath, boolean isInClassPath) {
		try {
			if (inPath.indexOf("/") == 0)
				inPath = inPath.substring(1);
			String inFileName = inPath
					.substring(inPath.lastIndexOf("/") != -1 ? inPath
							.lastIndexOf("/") + 1 : 0);
			Resource f = getResourcesDir().createRelative(".includeJars");
			String fileContents;
			StringBuffer newFile = new StringBuffer("");
			String[] fileList;

			if (f.exists())
				fileContents = projectManager.getCurrentProject().readFile(f);
			else
				fileContents = "";
			fileList = fileContents.split("\n");

			boolean found = false;
			for (int i = 0; i < fileList.length; i++) {
				boolean addFile = true;
				if (inPath.equals(fileList[i])) {
					if (isInClassPath) {
						found = true;
					} else {
						addFile = false;
					}
				}
				if (addFile) {
					if (newFile.length() > 0)
						newFile.append("\n");
					newFile.append(fileList[i]);
				}

			}

			Resource destFile = projectManager.getCurrentProject()
					.getProjectRoot().createRelative("lib/" + inFileName);
			if (isInClassPath && !found) {
				if (newFile.length() > 0)
					newFile.append("\n");
				newFile.append(inPath);
				Resource sourceFile = getResourcesDir().createRelative(inPath);
				studioConfiguration.copyRecursive(sourceFile, destFile,
						new ArrayList<String>());
			} else if (!isInClassPath) {
				studioConfiguration.deleteFile(destFile);
			}
			projectManager.getCurrentProject().writeFile(f, newFile.toString());
			return true;
		} catch (Exception e) {
			throw new WMRuntimeException(e);
		}
	}

}
