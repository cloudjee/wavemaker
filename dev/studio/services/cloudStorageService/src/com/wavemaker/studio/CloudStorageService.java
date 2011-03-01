/*
 * Copyright (C) 2007-2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
package com.wavemaker.studio;

import java.util.Collection;
import java.io.File;

import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.cloudmgr.*;
import com.wavemaker.tools.deployment.ServiceDeploymentManager;

/**
 * @author slee
 *
 */
public class CloudStorageService {

    private CloudStorageMgrBeans cloudStorageMgrBeans;
    private ServiceDeploymentManager serviceDeploymentManager;

    public Collection<CloudContainer> createContainer(String serviceProvider,
                            String containerName,
                            String location,
                            String username,
                            String password,
                            String accessKeyId,
                            String seceretAccessKey,
                            String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
        return cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).
                createContainer(containerName, location, auth);
    }

    public Collection<CloudContainer> deleteContainer(String serviceProvider,
                            String containerName,
                            String username,
                            String password,
                            String accessKeyId,
                            String seceretAccessKey,
                            String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
        return cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).deleteContainer(containerName, auth);

    }

    public Collection<CloudContainer> getContainerList(String serviceProvider,
                            String username,
                            String password,
                            String accessKeyId,
                            String seceretAccessKey,
                            String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
        return cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).getContainerList(auth);

    }

    public CloudContainer getContainer(String serviceProvider,
                                String containerName,
                                String username,
                                String password,
                                String accessKeyId,
                                String seceretAccessKey,
                                String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
        return cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).getContainer(containerName, auth);

    }

    public Collection<CloudFile> getCloudFiles(String serviceProvider,
                                String containerName,
                                String username,
                                String password,
                                String accessKeyId,
                                String seceretAccessKey,
                                String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
        return cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).getCloudFiles(containerName, auth);

    }

    public Collection<CloudFile> copyWarFileToCloudStorage(String serviceProvider,
                                String containerName,
                                String username,
                                String password,
                                String accessKeyId,
                                String seceretAccessKey,
                                String serviceURL) {
        File warFile = serviceDeploymentManager.getWarFile();
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
        return cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).
                copyFileToCloudStorage(containerName, warFile, auth);     
    }

    public Collection<CloudFile> copyEarFileToCloudStorage(String serviceProvider,
                                String containerName,
                                String username,
                                String password,
                                String accessKeyId,
                                String seceretAccessKey,
                                String serviceURL) {
        File earFile = serviceDeploymentManager.getEarFile();
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
        return cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).
                copyFileToCloudStorage(containerName, earFile, auth);     
    }

    public Collection<CloudFile> deleteFileInCloudStorage(String serviceProvider,
                                String containerName,
                                String fileName,
                                String username,
                                String password,
                                String accessKeyId,
                                String seceretAccessKey,
                                String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
        return cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).
                deleteFileInCloudStorage(containerName, fileName, auth);
    }

    @HideFromClient
    public void setCloudStorageMgrBeans(
            CloudStorageMgrBeans cloudStorageMgrBeans) {
        this.cloudStorageMgrBeans = cloudStorageMgrBeans;
    }

    @HideFromClient
    public void setServiceDeploymentManager(
            ServiceDeploymentManager serviceDeploymentManager) {
        this.serviceDeploymentManager = serviceDeploymentManager;
    }
}
