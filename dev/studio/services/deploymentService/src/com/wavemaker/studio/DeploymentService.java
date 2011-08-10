/*
 * Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.FileUploadResponse;
import com.wavemaker.runtime.server.ParamName;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.deployment.DeploymentInfo;
import com.wavemaker.tools.deployment.DeploymentTargetManager;
import com.wavemaker.tools.deployment.DeploymentType;
import com.wavemaker.tools.deployment.ServiceDeploymentManager;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.ProjectManager;

/**
 * @author Joel Hare
 * @author Jeremy Grelle
 */
public class DeploymentService {

    private DeploymentManager deploymentManager;

    private DeploymentTargetManager deploymentTargetManager;

    private ServiceDeploymentManager serviceDeploymentManager;

    public void testRunStart() {
        deploymentManager.testRunStart();
    }

    public void testRunClean() {
        deploymentManager.testRunClean();
    }

    public String buildWar(Map<String, String> properties) {
        File war = serviceDeploymentManager.generateWebapp(properties);
        return war.getAbsolutePath();
    }

    public java.util.Date getWarDate() {
        File warFile = serviceDeploymentManager.getWarFile();
        if (!warFile.exists())
            return null;
        long wartime = warFile.lastModified();
        return new java.util.Date(wartime);
    }

    public boolean isWarUpToDate() {
        File warFile = serviceDeploymentManager.getWarFile();
        if (!warFile.exists())
            return false;
        long wartime = warFile.lastModified();
        ProjectManager projectMgr = serviceDeploymentManager.getProjectManager();
        long lastModTime = com.wavemaker.common.util.IOUtils.getMostRecentModificationTime(projectMgr.getCurrentProject().getProjectRoot());
        // System.out.println("WAR TIME: " + wartime);
        // System.out.println("LAS TIME: " + lastModTime);
        return wartime >= lastModTime;
    }

    public String exportProject() {
        String result = deploymentManager.exportProject();
        return (DeploymentManager.isCloud()) ? "" : result;
    }

    /*
     * THIS ASSUMES exportProject has already been called, and the war file is already prepared. Why don't we just let
     * the client pass in a path to the file they want? Because we're dealing with files internal to the studio where
     * they should not be able to just download anything they want to pass as a parameter.
     */
    public DownloadResponse downloadProjectWar() {
        File localFile = serviceDeploymentManager.getWarFile();
        String filename = localFile.getAbsolutePath();
        try {
            DownloadResponse ret = new DownloadResponse();

            FileInputStream fis = new FileInputStream(localFile);

            ret.setContents(fis);
            ret.setContentType("application/unknown");
            ret.setFileName(filename.substring(filename.lastIndexOf(File.separator) + 1));
            return ret;
        } catch (IOException e) {

        }
        return (DownloadResponse) null;
    }

    /*
     * THIS ASSUMES exportProject has already been called, and the war file is already prepared. Why don't we just let
     * the client pass in a path to the file they want? Because we're dealing with files internal to the studio where
     * they should not be able to just download anything they want to pass as a parameter.
     */
    public DownloadResponse downloadProjectEar() {
        File localFile = serviceDeploymentManager.getEarFile();
        String filename = localFile.getAbsolutePath();
        try {
            DownloadResponse ret = new DownloadResponse();

            FileInputStream fis = new FileInputStream(localFile);

            ret.setContents(fis);
            ret.setContentType("application/unknown");
            ret.setFileName(filename.substring(filename.lastIndexOf(File.separator) + 1));
            return ret;
        } catch (IOException e) {

        }
        return (DownloadResponse) null;
    }

    /* THIS ASSUMES exportProject has already been called, and the zip file is already prepared */
    public DownloadResponse downloadProjectZip() {

        String filename = deploymentManager.getExportPath();

        try {
            DownloadResponse ret = new DownloadResponse();

            File localFile = new File(filename);
            FileInputStream fis = new FileInputStream(localFile);

            ret.setContents(fis);
            filename = filename.substring(filename.lastIndexOf(File.separator) + 1);
            ret.setContentType("application/zip");
            ret.setFileName(filename);
            return ret;
        } catch (IOException e) {

        }
        return (DownloadResponse) null;
    }

    public String exportProject(String zipFileName) {
        System.out.println("ZIP FILE NAME SERVCIE:" + zipFileName);
        File f = new File(deploymentManager.getExportPath());
        f = new File(f.getParentFile(), zipFileName);
        String path = f.getAbsolutePath();
        deploymentManager.exportProject(path);
        return path;
    }

    public FileUploadResponse uploadProjectZipFile(@ParamName(name = "file") MultipartFile file) throws IOException {
        return deploymentManager.importFromZip(file);
    }

    public List<DeploymentInfo> getDeploymentInfo() {
        return serviceDeploymentManager.getDeploymentInfo();
    }
    
    public String deploy(DeploymentInfo deploymentInfo) throws IOException {
        if(deploymentInfo.getDeploymentType() != DeploymentType.FILE) {
            String validateResult = deploymentTargetManager.getDeploymentTarget(deploymentInfo.getDeploymentType()).validateDeployment(deploymentInfo);
            if (!validateResult.equals("SUCCESS")) {
                return validateResult;
            }
        }
        File f = serviceDeploymentManager.generateWebapp(deploymentInfo);
        if (!f.exists()) {
            throw new AssertionError("Application archive file doesn't exist at " + f.getAbsolutePath());
        }
        if (deploymentInfo.getDeploymentType() == DeploymentType.FILE) {
            return "SUCCESS";
        }
        return deploymentTargetManager.getDeploymentTarget(deploymentInfo.getDeploymentType()).deploy(f, deploymentInfo);
    }
    
    public String undeploy(DeploymentInfo deploymentInfo) {
        if(deploymentInfo.getDeploymentType() != DeploymentType.FILE) {
            deploymentTargetManager.getDeploymentTarget(deploymentInfo.getDeploymentType()).undeploy(deploymentInfo);
        }
        return "SUCCESS";
    }
    
    public String save(DeploymentInfo deploymentInfo) {
        return serviceDeploymentManager.saveDeploymentInfo(deploymentInfo);
    }
    
    public String delete(String deploymentId) {
        serviceDeploymentManager.deleteDeploymentInfo(deploymentId);
        return "SUCCESS";
    }
    
    public void deployClientComponent(String className, String folder, String data) throws IOException {
        deploymentManager.deployClientComponent(className, folder, data);
    }

    public boolean undeployClientComponent(String className, String folder, boolean removeSource) throws IOException {
        return deploymentManager.undeployClientComponent(className, folder, removeSource);
    }

    public void deployTheme(String themename, String filename, String data) throws IOException {
        deploymentManager.deployTheme(themename, filename, data);
    }

    public boolean undeployTheme(String themename) throws IOException {
        return deploymentManager.undeployTheme(themename);
    }

    public String[] listThemes() throws IOException {
        return deploymentManager.listThemes();
    }

    public void copyTheme(String oldName, String newName) throws IOException {
        deploymentManager.copyTheme(oldName, newName);
    }

    public void deleteTheme(String name) throws IOException {
        deploymentManager.deleteTheme(name);
    }

    public String[] listThemeImages(String themename) throws IOException {
        return deploymentManager.listThemeImages(themename);
    }

    @HideFromClient
    public void setDeploymentManager(DeploymentManager deploymentManager) {
        this.deploymentManager = deploymentManager;
    }

    @HideFromClient
    public void setServiceDeploymentManager(ServiceDeploymentManager serviceDeploymentManager) {
        this.serviceDeploymentManager = serviceDeploymentManager;
    }

    @HideFromClient
    public void setDeploymentTargetManager(DeploymentTargetManager deploymentTargetManager) {
        this.deploymentTargetManager = deploymentTargetManager;
    }
}
