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
import java.io.IOException;
import java.util.Collection;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.cloudmgr.CloudAuth;
import com.wavemaker.tools.cloudmgr.CloudContainer;
import com.wavemaker.tools.cloudmgr.CloudFile;
import com.wavemaker.tools.cloudmgr.CloudStorageMgrBeans;
import com.wavemaker.tools.deployment.ServiceDeploymentManager;

/**
 * @author slee
 * @author Jeremy Grelle
 * 
 */
@ExposeToClient
public class CloudStorageService {

    private CloudStorageMgrBeans cloudStorageMgrBeans;

    private ServiceDeploymentManager serviceDeploymentManager;

    public Collection<CloudContainer> createContainer(String serviceProvider, String containerName, String location, String username,
        String password, String accessKeyId, String seceretAccessKey, String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
        return this.cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).createContainer(containerName, location, auth);
    }

    public Collection<CloudContainer> deleteContainer(String serviceProvider, String containerName, String username, String password,
        String accessKeyId, String seceretAccessKey, String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
        return this.cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).deleteContainer(containerName, auth);

    }

    public Collection<CloudContainer> getContainerList(String serviceProvider, String username, String password, String accessKeyId,
        String seceretAccessKey, String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
        return this.cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).getContainerList(auth);

    }

    public CloudContainer getContainer(String serviceProvider, String containerName, String username, String password, String accessKeyId,
        String seceretAccessKey, String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
        return this.cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).getContainer(containerName, auth);

    }

    public Collection<CloudFile> getCloudFiles(String serviceProvider, String containerName, String username, String password, String accessKeyId,
        String seceretAccessKey, String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
        return this.cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).getCloudFiles(containerName, auth);

    }

    public Collection<CloudFile> copyWarFileToCloudStorage(String serviceProvider, String containerName, String username, String password,
        String accessKeyId, String seceretAccessKey, String serviceURL) {
        try {
            File warFile = this.serviceDeploymentManager.getWarFile().getFile();

            CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
            return this.cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).copyFileToCloudStorage(containerName, warFile, auth);
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    public Collection<CloudFile> copyEarFileToCloudStorage(String serviceProvider, String containerName, String username, String password,
        String accessKeyId, String seceretAccessKey, String serviceURL) {
        try {
            File earFile = this.serviceDeploymentManager.getEarFile().getFile();
            CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
            return this.cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).copyFileToCloudStorage(containerName, earFile, auth);
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    public Collection<CloudFile> deleteFileInCloudStorage(String serviceProvider, String containerName, String fileName, String username,
        String password, String accessKeyId, String seceretAccessKey, String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey, null, serviceURL);
        return this.cloudStorageMgrBeans.getCloudStorageMgr(serviceProvider).deleteFileInCloudStorage(containerName, fileName, auth);
    }

    @HideFromClient
    public void setCloudStorageMgrBeans(CloudStorageMgrBeans cloudStorageMgrBeans) {
        this.cloudStorageMgrBeans = cloudStorageMgrBeans;
    }

    @HideFromClient
    public void setServiceDeploymentManager(ServiceDeploymentManager serviceDeploymentManager) {
        this.serviceDeploymentManager = serviceDeploymentManager;
    }
}
