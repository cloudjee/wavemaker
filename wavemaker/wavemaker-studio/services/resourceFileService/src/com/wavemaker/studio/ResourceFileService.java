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
import org.springframework.web.multipart.MultipartFile;

import com.wavemaker.runtime.server.Downloadable;
import com.wavemaker.runtime.server.FileUploadResponse;
import com.wavemaker.runtime.server.ParamName;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourceFilter;
import com.wavemaker.tools.io.ResourcePath;
import com.wavemaker.tools.io.Resources;
import com.wavemaker.tools.io.exception.ResourceTypeMismatchException;
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
     */
    public void writeFile(String filePath, String filetext) {
        File file = getResource(filePath, File.class);
        file.getContent().write(filetext);
    }

    /**
     * Write the contents of the given file only if the file does not already exist
     * 
     * @param filePath the file to write
     * @param filetext the contents of the file
     */
    public void writeFileIfDoesNotExist(String filePath, String filetext) {
        try {
            File file = getResource(filePath, File.class);
            if (!file.exists()) {
                file.getContent().write(filetext);
            }
        } catch (ResourceTypeMismatchException e) {
            // File exists but is of the wrong type, ignore
        }
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
    @HideFromClient
    private <T extends Resource> T getResource(String name, Class<T> resourceType) {
        Assert.notNull(name, "Name must not be null");
        Assert.notNull(resourceType, "ResourceType must not be null");

        Folder root;
        String resourceName;
        if (name.equals("/common")) {
            root = this.fileSystem.getCommonFolder();
            resourceName = "";
        } else if (name.startsWith("/common/")) {
            root = this.fileSystem.getCommonFolder();
            resourceName = name.substring("/common/".length());
        } else {
            root = this.projectManager.getCurrentProject().getRootFolder();
            resourceName = name;
        }

        if (resourceName.length() == 0) {
            Assert.isInstanceOf(resourceType, root);
            return (T) root;
        }

        return root.get(resourceName, resourceType);
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

    /**
     * Uploads a file to the given path
     * 
     * @param file the file contents being uploaded
     * @param path the path where the file should be uploaded
     * @return an upload response
     * @throws IOException
     * @see {@link #unzipAndMoveNewFile(String)}
     */
    public FileUploadResponse uploadFile(@ParamName(name = "file") MultipartFile file, String path) throws IOException {
        FileUploadResponse response = new FileUploadResponse();
        try {
            Folder folder = getResource(path, Folder.class);
            String filename = getSafeFilename(file.getOriginalFilename());
            folder.getFile(filename).getContent().write(file.getInputStream());
        } catch (Exception e) {
            response.setError(e.getMessage());
        }
        return response;
    }

    private String getSafeFilename(String filename) {
        return filename.replaceAll("[^a-zA-Z0-9.\\-_ ]", "");
    }

    /**
     * Unzips the specifed file. The file will be unzip into a folder with the same name as the file. The zip file will
     * be deleted after unzip.
     * 
     * @see #uploadFile(MultipartFile, String)
     * @return <tt>true</tt> if the file was unzipped.
     */
    public boolean unzipAndMoveNewFile(@ParamName(name = "file") String path) {
        File zipFile = getResource(path, File.class);
        String unpackName = zipFile.getName();
        if (unpackName.indexOf(".") != -1) {
            unpackName = unpackName.substring(0, unpackName.lastIndexOf("."));
        }
        if (zipFile.getParent().hasExisting(unpackName)) {
            unpackName = generateUniqueNumberedFileName(zipFile.getParent(), unpackName);
        }
        Folder unpackFolder = zipFile.getParent().getFolder(unpackName);
        unpackFolder.unzip(zipFile);
        zipFile.delete();
        return unpackFolder.exists();
    }

    @HideFromClient
    public void setProjectManager(ProjectManager manager) {
        this.projectManager = manager;
    }

    @HideFromClient
    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }
}
