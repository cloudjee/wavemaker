/*
 * Copyright (C) 2010-2011 VMware, Inc. All rights reserved.
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
import java.util.List;

import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.io.File;
import com.wavemaker.io.Folder;
import com.wavemaker.io.Resource;
import com.wavemaker.io.ResourceFilter;
import com.wavemaker.io.ResourcePath;
import com.wavemaker.io.Resources;
import com.wavemaker.runtime.server.Downloadable;
import com.wavemaker.runtime.server.FileUploadResponse;
import com.wavemaker.runtime.server.ParamName;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.project.DownloadableFile;
import com.wavemaker.tools.project.DownloadableFolder;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioFileSystem;

/**
 * Service to allow filesystem operations to be performed from the WaveMaker client.
 */
@ExposeToClient
public class ResourceFileService {

    private ProjectManager projectManager;

    private StudioFileSystem fileSystem;

    /**
     * List contents of a folder, returning a {@link Hashtable} containing the folder name, type and immediate children.
     * 
     * @param folderName the folder to return
     * @return a {@link Hashtable} of the folder details.
     */
    public Hashtable<String, Object> getFolder(String folderName) {
        Folder folder = getResource(folderName, Folder.class);
        Hashtable<String, Object> hashtable = asHashTable(folder);
        hashtable.put("files", listChildren(folder));
        return hashtable;
    }

    private List<Hashtable<String, Object>> listChildren(Folder folder) {
        Resources<Resource> list = folder.list(ResourceFilter.HIDDEN_RESOURCES);
        List<Hashtable<String, Object>> children = new ArrayList<Hashtable<String, Object>>();
        for (Resource child : list) {
            children.add(asHashTable(child));
        }
        return children;
    }

    private Hashtable<String, Object> asHashTable(Resource resource) {
        Hashtable<String, Object> hashtable = new Hashtable<String, Object>();
        hashtable.put("file", resource.getName());
        hashtable.put("type", resource instanceof Folder ? "folder" : "file");
        return hashtable;
    }

    /**
     * Read the contents of a given file.
     * 
     * @param filePath the file to read
     * @return the contents of the file
     * @throws IOException
     */
    public String readFile(String filePath) throws IOException {
        File file = getResource(filePath, File.class);
        return file.getContent().asString();
    }

    /**
     * Write the contents of the given file.
     * 
     * @param filePath the file to write
     * @param filetext the contexts of the file.
     * @throws IOException
     */
    public void writeFile(String filePath, String filetext) throws IOException {
        File file = getResource(filePath, File.class);
        file.getContent().write(filetext);
    }

    /**
     * Rename a file or folder.
     * 
     * @param from the source to rename, this will be a complete reference to a file or folder
     * @param to the destination name, this will be a complete reference to the new name (including path)
     * @param overwrite <tt>true</tt> if any existing destination should be overwritten. If this parameter is
     *        <tt>false</tt> a unique name should be generated based on <tt>to</tt>.
     * @return the name of the new file (excluding the path)
     */
    public String renameFile(@ParamName(name = "from") String from, @ParamName(name = "to") String to,
        @ParamName(name = "overwrite") boolean overwrite) {

        Resource source = getResource(from, Resource.class);

        ResourcePath destination = new ResourcePath().get(to);
        Folder destinationFolder = getResource(destination.getParent().toString(), Folder.class);
        Assert.state(destinationFolder.exists(), "The destination folder '" + destinationFolder + "' does not exist");

        String destinationName = destination.getName();
        if (destinationFolder.hasExisting(destinationName) && !overwrite) {
            destinationName = generateUniqueNumberedFileName(destinationFolder, destinationName);
        }

        Resource renamed = source;
        if (!destinationFolder.equals(renamed.getParent())) {
            renamed = renamed.moveTo(destinationFolder);
        }
        if (!renamed.getName().equals(destinationName)) {
            renamed = renamed.rename(destinationName);
        }
        return renamed.getName();
    }

    private String generateUniqueNumberedFileName(Folder folder, String name) {
        String ext = "";
        if (name.lastIndexOf(".") != -1) {
            ext = name.substring(name.lastIndexOf("."));
            name = name.substring(0, name.length() - ext.length());
        }
        for (int i = 0; true; i++) {
            String candidate = name + i + ext;
            if (!folder.hasExisting(candidate)) {
                return candidate;
            }
        }
    }

    /**
     * Create a new folder
     * 
     * @param name the full name of the folder to create (including the path)
     * @return <tt>true</tt> if the folder was created
     */
    public boolean createFolder(@ParamName(name = "name") String name) {
        Folder folder = getResource(name, Folder.class);
        folder.touch();
        return folder.exists();
    }

    /**
     * Delete a file or folder
     * 
     * @param name the complete path of the folder or file
     * @return <tt>true<tt> if the file/folder was deleted
     */
    public boolean deleteFile(@ParamName(name = "name") String name) {
        Resource resource = getResource(name, Resource.class);
        resource.delete();
        return !resource.exists();
    }

    @SuppressWarnings("unchecked")
    private <T extends Resource> T getResource(String name, Class<T> resourceType) {
        Assert.notNull(name, "Name must not be null");
        Assert.notNull(resourceType, "ResourceType must not be null");

        Folder root;
        String resourceName;

        if (name.startsWith("/common")) {
            root = this.fileSystem.getCommon();
            resourceName = name.substring("/common".length());
        } else {
            root = this.projectManager.getCurrentProject().getRoot();
            resourceName = name;
        }

        if (resourceName.length() == 0) {
            Assert.isInstanceOf(resourceType, root);
            return (T) root;
        }

        return root.get(name, resourceType);
    }

    /**
     * @param folderpath The folder
     * @param filename
     * @return
     * @throws IOException
     */
    public Downloadable downloadFile(@ParamName(name = "file") String file) throws IOException {
        Resource resource = getResource(file, Resource.class);
        if (resource instanceof File) {
            return new DownloadableFile((File) resource);
        }
        return new DownloadableFolder((Folder) resource, this.projectManager.getCurrentProject().getProjectName());
    }

    // FIXME here down

    public FileUploadResponse uploadFile(@ParamName(name = "file") MultipartFile file, String path) throws IOException {
        FileUploadResponse ret = new FileUploadResponse();
        try {
            org.springframework.core.io.Resource dir = getRequestedFile(path, true);
            org.springframework.core.io.Resource outputFile = dir.createRelative(file.getOriginalFilename().replaceAll("[^a-zA-Z0-9.\\-_ ]", ""));
            FileCopyUtils.copy(file.getInputStream(), this.fileSystem.getOutputStream(outputFile));
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
     * Unzips a zip file in the tmp folder and moves it to the specified location. NOTE: Will not overwrite an existing
     * folder at that location; instead will rename to avoid collision NOTE:
     * 
     * @see ProjectManager#openProject(String)
     * @return An OpenProjectReturn object containing the current web path, as well as any upgrades that were performed.
     */
    public boolean unzipAndMoveNewFile(@ParamName(name = "file") String path) {
        try {
            org.springframework.core.io.Resource zipfile = getRequestedFile(path, false);
            org.springframework.core.io.Resource zipfolder = com.wavemaker.tools.project.ResourceManager.unzipFile(this.fileSystem, zipfile);
            return zipfolder.exists() && StringUtils.getFilenameExtension(zipfolder.getFilename()) == null;
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    @HideFromClient
    public void setProjectManager(ProjectManager manager) {
        this.projectManager = manager;
    }

    @HideFromClient
    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    @HideFromClient
    private org.springframework.core.io.Resource getProjectDir() {
        return this.projectManager.getCurrentProject().getWebAppRoot();
    }

    private org.springframework.core.io.Resource getRequestedFile(String requestedFile, boolean isFolder) throws IOException {
        return getRequestedFile(requestedFile, isFolder, false);
    }

    private org.springframework.core.io.Resource getRequestedFile(String requestedFile, boolean isFolder, boolean create) throws IOException {
        org.springframework.core.io.Resource root;
        if (requestedFile.startsWith("/common")) {
            try {
                root = this.fileSystem.getCommonDir();
            } catch (IOException e) {
                root = this.projectManager.getCurrentProject().getProjectRoot(); // don't know what to do if exception
                                                                                 // thrown...
            }
            requestedFile = requestedFile.substring(7);
            System.out.println("requestedFile:" + requestedFile);
        } else {
            root = this.projectManager.getCurrentProject().getProjectRoot();
        }
        if (requestedFile != null && requestedFile.length() > 0) {
            if (create) {
                return this.fileSystem.createPath(root, requestedFile + (isFolder ? "/" : ""));
            } else {
                return root.createRelative(requestedFile + (isFolder ? "/" : ""));
            }
        } else {
            return root;
        }
    }

    // FIXME this method is now only used to create the resource folder, we should do this via templates instead

    /**
     * Returns the contents of the resources folder.
     * 
     * @return
     * @throws WMRuntimeException
     */
    public Hashtable<String, Object> getResourceFolder() throws WMRuntimeException {
        org.springframework.core.io.Resource resourceDir = this.getResourcesDir();
        Hashtable<String, Object> rtn = new Hashtable<String, Object>();
        try {
            rtn.put("files", com.wavemaker.tools.project.ResourceManager.getListing(this.fileSystem, resourceDir));
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
        rtn.put("file", resourceDir.getFilename());
        rtn.put("type", "folder");
        return rtn;
    }

    /*
     * Gets the project's resources folder; initializes it if it doesn't yet exist
     */
    @HideFromClient
    private org.springframework.core.io.Resource getResourcesDir() {
        org.springframework.core.io.Resource resources;
        try {
            resources = getProjectDir().createRelative("resources/");
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
        if (!resources.exists()) {
            resources = this.fileSystem.createPath(getProjectDir(), "resources/");
            this.fileSystem.createPath(resources, "images/imagelists/");
            this.fileSystem.createPath(resources, "images/buttons/");
            this.fileSystem.createPath(resources, "images/logos/");
            this.fileSystem.createPath(resources, "javascript/");
            this.fileSystem.createPath(resources, "css/");
            this.fileSystem.createPath(resources, "htmlcontent/");
        }
        return resources;
    }

}
