/*
 * Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSONObject;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.FileUploadResponse;
import com.wavemaker.runtime.server.ParamName;
import com.wavemaker.runtime.server.ServiceResponse;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.deployment.DeploymentInfo;
import com.wavemaker.tools.deployment.DeploymentStatusException;
import com.wavemaker.tools.deployment.DeploymentTargetManager;
import com.wavemaker.tools.deployment.DeploymentType;
import com.wavemaker.tools.deployment.ServiceDeploymentManager;
import com.wavemaker.tools.project.DeploymentManager;

/**
 * Deployment Service used by WaveMaker to manage and deploy projects to various deployment targets.
 * 
 * @author Joel Hare
 * @author Jeremy Grelle
 */
@ExposeToClient
public class DeploymentService {

    private static final String SUCCESS = "SUCCESS";

    private DeploymentManager deploymentManager;

    private DeploymentTargetManager deploymentTargetManager;

    private ServiceDeploymentManager serviceDeploymentManager;

    private ServiceResponse serviceResponse = null;

    public String getRequestId() {
        UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }

    /**
     * Start a 'test run' for the given project. This method should ensure that the current project is compiled,
     * deployed and active.
     * 
     * @return return the URL of the deployed application. URLs can be relative paths (eg. '/Project1') or fully
     *         qualified URLS (eg. 'http://project1.cloudfoundry.com'). returned URLs should not include parameters as
     *         these are always managed by the client.
     */
    public String testRunStart() {
        return this.deploymentManager.testRunStart();
    }

    /**
     * Export the current project to a zip file stored locally with the given name.
     * 
     * @param zipFileName the name of the file, excluding any path.
     * @return the full path of the exported file to be displayed to the user
     */
    public String exportProject(String zipFileName) {
        return this.deploymentManager.exportProject(zipFileName);
    }

    /**
     * Download the last {@link #deploy(DeploymentInfo)} deployed WAR file. This method does not allow the user to
     * specify the file to download as this would be present a security risk, potentially allowing the download of
     * internal wavemaker files. NOTE: The {@link #deploy(DeploymentInfo)} method must be called before calling this
     * method.
     * 
     * @return the download response
     */
    public DownloadResponse downloadProjectWar() {
        return getAsDownloadResponse(this.serviceDeploymentManager.getWarFile());
    }

    /**
     * Download the last {@link #deploy(DeploymentInfo)} deployed EAR file. This method does not allow the user to
     * specify the file to download as this would be present a security risk, potentially allowing the download of
     * internal wavemaker files. NOTE: The {@link #deploy(DeploymentInfo)} method must be called before calling this
     * method.
     * 
     * @return the download response
     */
    public DownloadResponse downloadProjectEar() {
        return getAsDownloadResponse(this.serviceDeploymentManager.getEarFile());
    }

    /**
     * Dowload the current project as a ZIP file.
     * 
     * @return the download response
     */
    public DownloadResponse downloadProjectZip() {
        // FIXME Download of a response has been broken since 6.5. This export functionality had been changed to include
        // a version number but the download always tried to export the file without an extension. We need to re-think
        // the concept of export in the cloud world. Perhaps export should just stream a response, rather than saving
        // it inside the projects folder.
        throw new UnsupportedOperationException();
    }

    /**
     * Adapter method that can be used to convert a {@link Resource} to a {@link DownloadResponse}.
     * 
     * @param resource the resource
     * @return the download response
     */
    private DownloadResponse getAsDownloadResponse(Resource resource) {
        try {
            File localFile = resource.getFile();
            String filename = localFile.getAbsolutePath();
            DownloadResponse ret = new DownloadResponse();

            FileInputStream fis = new FileInputStream(localFile);

            ret.setContents(fis);
            ret.setContentType("application/unknown");
            ret.setFileName(filename.substring(filename.lastIndexOf(File.separator) + 1));
            return ret;
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    /**
     * Upload, unpack and import an wavemaker project ZIP file into the projects directory.
     * 
     * @param file the project zip file to upload
     * @return the {@link FileUploadResponse}
     * @throws IOException
     */
    public FileUploadResponse uploadProjectZipFile(@ParamName(name = "file") MultipartFile file) throws IOException {
        return this.deploymentManager.importFromZip(file);
    }

    // FIXME save the deployment info
    /**
     * Add a {@link DeploymentInfo} so that it can be {@link #getDeploymentInfo() used} in future deployments.
     * 
     * @param deploymentInfo the deployment info to save
     * @return The {@link DeploymentInfo#getDeploymentId() deployment ID}
     */
    public String save(DeploymentInfo deploymentInfo) {
        return this.deploymentManager.saveDeploymentInfo(deploymentInfo);
    }

    /**
     * Lists previously saved deployments allowing a user to quickly {@link #deploy(DeploymentInfo) re-deploy}. This
     * method is used to popiulate the deployment menu.
     * 
     * @return a list of {@link DeploymentInfo}s.
     */
    public List<DeploymentInfo> getDeploymentInfo() {
        return this.deploymentManager.getDeploymentInfo();
    }

    /**
     * Delete a previously {@link #save(DeploymentInfo) saved} deployment.
     * 
     * @param deploymentId the deployment to delete
     * @return the status of the delete.
     */
    public String delete(String deploymentId) {
        this.deploymentManager.deleteDeploymentInfo(deploymentId);
        // FIXME this may was well return void
        return SUCCESS;
    }

    /**
     * Deploy the current project to a specific target (identified by the {@link DeploymentInfo} parameter.
     * 
     * @param deploymentInfo information about the deployment.
     * @return the result of the deployment. The message "SUCCESS" or any message starting "OK" are considered
     *         successful. Other results are considered failures and will be displayed to the user.
     * @throws IOException
     */
    public String deploy(DeploymentInfo deploymentInfo) throws IOException {
        try {
            if (deploymentInfo.getDeploymentType() != DeploymentType.FILE && deploymentInfo.getDeploymentType() != DeploymentType.CLOUD_FOUNDRY) {
                this.deploymentTargetManager.getDeploymentTarget(deploymentInfo.getDeploymentType()).validateDeployment(deploymentInfo);
            }
            if (deploymentInfo.getDeploymentType() != DeploymentType.CLOUD_FOUNDRY) {
                File f = this.serviceDeploymentManager.generateWebapp(deploymentInfo).getFile();
                if (!f.exists()) {
                    throw new AssertionError("Application archive file doesn't exist at " + f.getAbsolutePath());
                }
                if (deploymentInfo.getDeploymentType() == DeploymentType.FILE) {
                    return SUCCESS;
                }
            }
            this.deploymentTargetManager.getDeploymentTarget(deploymentInfo.getDeploymentType()).deploy(
                this.serviceDeploymentManager.getProjectManager().getCurrentProject(), deploymentInfo);
            return SUCCESS;
        } catch (DeploymentStatusException e) {
            return e.getStatusMessage();
        }
    }

    /**
     * Undeploy a previously {@link #deploy(DeploymentInfo) deployed} application
     * 
     * @param deploymentInfo The deployment information to remove
     * @param deleteServices if any services should also be removed during un-deployment. This flag will be ignored for
     *        targets such as Tomcat that do not support services.
     * @return the result of the deployment. The message "SUCCESS" is used to indicate success,
     */
    public String undeploy(DeploymentInfo deploymentInfo, boolean deleteServices) {
        if (deploymentInfo.getDeploymentType() != DeploymentType.FILE) {
            try {
                this.deploymentTargetManager.getDeploymentTarget(deploymentInfo.getDeploymentType()).undeploy(deploymentInfo, deleteServices);
            } catch (DeploymentStatusException e) {
                // FIXME Before this exception existed the string return was ignored, we continue to do so but this
                // should be reviewed.
            }
        }
        return SUCCESS;
    }

    /**
     * Allows the deployment of custom composite components in WaveMaker.
     * 
     * @param className the name of the javascript class being creating. This also acts as the name of the file that is
     *        written.
     * @param folder The name of the folder (relative to the common folder) where the resource is written
     * @param data contents of the file
     * @throws IOException
     */
    public void deployClientComponent(String className, String folder, String data) throws IOException {
        this.deploymentManager.deployClientComponent(className, folder, data);
    }

    /**
     * Undeploy a previously {@link #deploy(DeploymentInfo) deployed} composite component
     * 
     * @param className the name of the javascript class being deleted. This also acts as the name of the file that is
     *        removed.
     * @param folder The name of the folder (relative to the common folder) where the resource exists
     * @param removeSource <tt>true</tt> if the source and JS Libraries should be removed, <tt>false</tt> if the JS
     *        Library should be removed but the source should remain.
     * @return <tt>true</tt> if the undeployment was successful or <tt>false</tt> if the undeploy failed.
     * @throws IOException
     */
    public boolean undeployClientComponent(String className, String folder, boolean removeSource) throws IOException {
        // FIXME remove the boolean return and rely on exceptions only
        return this.deploymentManager.undeployClientComponent(className, folder, removeSource);
    }

    // FIXME theme management should extracted to a new service

    // FIXME DocComment the remaining methods.

    public void deployTheme(String themename, String filename, String data) throws IOException {
        this.deploymentManager.deployTheme(themename, filename, data);
    }

    public String[] listThemes() throws IOException {
        return this.deploymentManager.listThemes();
    }

    public void copyTheme(String oldName, String newName) throws IOException {
        this.deploymentManager.copyTheme(oldName, newName);
    }

    public void deleteTheme(String name) throws IOException {
        this.deploymentManager.deleteTheme(name);
    }

    public String[] listThemeImages(String themename) throws IOException {
        return this.deploymentManager.listThemeImages(themename);
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
