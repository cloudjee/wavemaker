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

import org.apache.log4j.Logger;
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
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.FileUploadResponse;
import com.wavemaker.runtime.server.ParamName;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioFileSystem;

/**
 * Service to allow filesystem operations to be performed from the WaveMaker client.
 */
@ExposeToClient
public class ResourceFileService {

    // FIXME PW filesystem refactor

    protected final Logger logger = Logger.getLogger(getClass());

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

    /*
     * Respond's to user's request to rename/move a file. Will append a number to the name if there is already a file
     * with the requested name
     */
    public String renameFile(@ParamName(name = "from") String from, @ParamName(name = "to") String to,
        @ParamName(name = "overwrite") boolean overwrite) {

        Resource source = getResource(from, Resource.class);

        ResourcePath destination = new ResourcePath().get(to);
        com.wavemaker.io.Folder destinationFolder = getResource(destination.getParent().toString(), Folder.class);
        Assert.state(destinationFolder.exists(), "The destination folder '" + destinationFolder + "' does not exist");

        String destinationName = destination.getName();

        // FIXME if destination name is used and we are not overwriting
        // if(destinationFolder.hasExisting(destinationName) && !overwrite) {
        // destinationName = generateUniqueName();
        // }

        Resource renamed = source;
        if (!destinationFolder.equals(renamed.getParent())) {
            renamed = renamed.moveTo(destinationFolder);
        }
        if (!renamed.getName().equals(destinationName)) {
            renamed = renamed.rename(destinationName);
        }
        return renamed.getName();
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

    // FIXME here down

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

    public DownloadResponse downloadFile(@ParamName(name = "folder") String folderpath, @ParamName(name = "filename") String filename)
        throws IOException {
        boolean isZip = false;
        org.springframework.core.io.Resource parentDir = getRequestedFile(folderpath, true);
        org.springframework.core.io.Resource localFile = parentDir.createRelative(filename + (filename.indexOf(".") == -1 ? "/" : ""));
        if (StringUtils.getFilenameExtension(filename) == null) {
            localFile = com.wavemaker.tools.project.ResourceManager.createZipFile(this.fileSystem, localFile, this.projectManager.getTmpDir());
            if (localFile == null) {
                return null;
            }
            isZip = true;
            filename = localFile.getFilename();
        }

        return com.wavemaker.tools.project.ResourceManager.downloadFile(localFile, filename, isZip);

    }

    /*
     * Respond's to user's request to rename/move a file. Will append a number to the name if there is already a file
     * with the requested name
     */
    public String xrenameFile(@ParamName(name = "from") String from, @ParamName(name = "to") String to,
        @ParamName(name = "overwrite") boolean overwrite) {

        try {
            org.springframework.core.io.Resource dest = getRequestedFile(to, to.indexOf(".") == -1);
            if (!overwrite) {
                int lastIndexOfPeriod = to.lastIndexOf(".");
                String to1 = lastIndexOfPeriod != -1 ? to.substring(0, to.lastIndexOf(".")) : to;
                String to_ext = lastIndexOfPeriod != -1 ? to.substring(to.lastIndexOf(".") + 1) : "";
                for (int i = 0; i < 1000 && dest.exists(); i++) {
                    dest = getRequestedFile(to1 + i + (lastIndexOfPeriod != -1 ? "." : "") + to_ext, to.indexOf(".") == -1);
                }
            }
            org.springframework.core.io.Resource f = getRequestedFile(from, from.indexOf(".") == -1);
            System.out.println("RENAME " + f.getDescription() + " TO " + dest.getDescription());
            this.fileSystem.rename(f, dest);
            return dest.getFilename();
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
    }

    /*
     * Moves a file that was uploaded to the tmp folder to the requested destination. All uploads go to tmp folder
     * 
     * public String moveNewFile(@ParamName(name = "from") String from,
     * 
     * @ParamName(name = "to") String to,
     * 
     * @ParamName(name = "overwrite") boolean overwrite) { Resource resourceDir = this.getResourcesDir();
     * 
     * try { Resource dest = resourceDir.createRelative(to);
     * 
     * if (!overwrite) { String to1 = (to.lastIndexOf(".") != -1) ? to.substring(0, to.lastIndexOf(".")) : to; String
     * to_ext = (to.lastIndexOf(".") != -1) ? to.substring(to .lastIndexOf(".") + 1) : ""; for (int i = 0; i < 1000 &&
     * dest.exists(); i++) { dest = resourceDir.createRelative(to1 + i + "." + to_ext); } }
     * 
     * Resource f = projectManager.getTmpDir().createRelative(from); studioConfiguration.rename(f, dest); return
     * dest.getFilename(); } catch (Exception e) { throw new WMRuntimeException(e); } }
     */
    /*
     * Create a folder; name should have the full relative path within the resources folder
     */
    public boolean createFolder(@ParamName(name = "name") String name) {
        try {
            org.springframework.core.io.Resource newFolder = getRequestedFile(name, true, true);
            return newFolder.exists();
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
    }

    /*
     * Delete the file; name should be the full relative path within resources folder
     */
    public boolean deleteFile(@ParamName(name = "name") String name) {
        try {
            org.springframework.core.io.Resource f = getRequestedFile(name, name.indexOf(".") == -1);
            this.fileSystem.deleteFile(f);
            return !f.exists();
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
    }

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
}
