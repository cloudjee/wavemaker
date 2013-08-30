/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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

package com.wavemaker.tools.project;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.wavemaker.tools.deployment.cloudjee.CloudJeeDeploymentTarget;
import org.cloudfoundry.client.lib.CloudFoundryException;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.ant.ServiceCompilerTask;
import com.wavemaker.tools.deployment.DeploymentTarget;
import com.wavemaker.tools.deployment.DeploymentTargetManager;
import com.wavemaker.tools.deployment.cloudjee.CloudJeeDeploymentTarget;
import com.wavemaker.tools.deployment.DeploymentType;
import com.wavemaker.tools.deployment.cloudfoundry.CloudFoundryDeploymentTarget;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.local.LocalFolder;
import com.wavemaker.tools.service.DesignServiceManager;

public class CloudJeeDeploymentManager extends StageDeploymentManager {

    private DeploymentTargetManager deploymentTargetManager;

    private DesignServiceManager designServiceManager;

    @Override
    public String testRunStart() {
        ServiceCompilerTask task = new ServiceCompilerTask();
        task.setDesignServiceManager(this.designServiceManager);
        task.doExecute();
        compile();
        CloudJeeDeploymentTarget cloudJeeDeploymentTarget = getCloudJeeDeploymentTarget();
        return cloudJeeDeploymentTarget.testRunStart(this.projectManager.getCurrentProject());
    }

    @Override
    public String compile() {
        return this.projectCompiler.compile();
    }

    @Override
    public String cleanCompile() {
        clean();
        return compile();
    }

    private void clean() {
        Project project = this.projectManager.getCurrentProject();
        List<Resource> classFiles = getFileSystem().listChildren(project.getWebInfClasses(), new ResourceFilter() {

            @Override
            public boolean accept(Resource resource) {
                return "class".equals(StringUtils.getFilenameExtension(resource.getFilename()));
            }
        });
        for (Resource classFile : classFiles) {
            getFileSystem().deleteFile(classFile);
        }
    }

    @Override
    public String build() {
        return compile();
    }

    @Override
    public String generateRuntime() {
        return compile();
    }

    @Override
    public String cleanBuild() {
        return cleanCompile();
    }

    @Override
    public com.wavemaker.tools.io.File buildWar(com.wavemaker.tools.io.File warFile, java.io.File tempWebAppRoot, boolean includeEar)
        throws IOException {
        LocalFolder buildDir = new LocalFolder(tempWebAppRoot);
        Folder dist = warFile.getParent();
        dist.createIfMissing();
        buildWar(getProjectDir(), buildDir, warFile, includeEar, this.projectManager.getFileSystem());
        return warFile;
    }

    @Override
    public void testRunClean() {
        try {
            undeploy();
        } catch (CloudFoundryException ex) {
            if (HttpStatus.NOT_FOUND != ex.getStatusCode()) {
                throw ex;
            }
        }
    }

    @Override
    public void testRunClean(Project project) {
        CloudJeeDeploymentTarget target = getCloudJeeDeploymentTarget();
        target.undeploy(project);
    }

    @Override
    public void undeploy() {
        Project project = this.projectManager.getCurrentProject();
        CloudJeeDeploymentTarget target = getCloudJeeDeploymentTarget();
        target.undeploy(project);
    }

    @Override
    protected Map<String, Object> addMoreProperties(LocalFolder projectDir, String deployName, Map<String, Object> properties) {

        StudioFileSystem fileSystem = this.projectManager.getFileSystem();
        Map<String, Object> newProperties = new HashMap<String, Object>();

        if (getProjectManager() != null && getProjectManager().getCurrentProject() != null) {
            newProperties.put(PROJECT_ENCODING_PROPERTY, getProjectManager().getCurrentProject().getEncoding());
        }

        newProperties.putAll(properties);

        try {
            newProperties.put(STUDIO_WEBAPPROOT_PROPERTY, new LocalFolder(fileSystem.getStudioWebAppRoot().getFile()));
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

        newProperties.put(PROJECT_DIR_PROPERTY, projectDir);

        Resource projectDirFile = fileSystem.getResourceForURI(projectDir.getLocalFile().getAbsolutePath());
        String projectName = projectDirFile.getFilename();
        newProperties.put(PROJECT_NAME_PROPERTY, projectName);

        if (deployName != null) {
            newProperties.put(DEPLOY_NAME_PROPERTY, deployName);
            System.setProperty("wm.proj." + DEPLOY_NAME_PROPERTY, deployName);
        }

        return newProperties;
    }

    private CloudJeeDeploymentTarget getCloudJeeDeploymentTarget() {
        DeploymentTarget deploymentTarget = this.deploymentTargetManager.getDeploymentTarget(DeploymentType.CLOUD_JEE);
        Assert.isInstanceOf(CloudJeeDeploymentTarget.class, deploymentTarget);
        return (CloudJeeDeploymentTarget) deploymentTarget;
    }

    public void setDeploymentTargetManager(DeploymentTargetManager deploymentTargetManager) {
        this.deploymentTargetManager = deploymentTargetManager;
    }

    public void setDesignServiceManager(DesignServiceManager designServiceManager) {
        this.designServiceManager = designServiceManager;
    }

}
