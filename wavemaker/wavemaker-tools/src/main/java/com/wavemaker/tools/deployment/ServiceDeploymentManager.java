/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.deployment;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.data.DataServiceType;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.data.DataModelDeploymentConfiguration;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.local.LocalFolder;
import com.wavemaker.tools.project.*;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.util.DesignTimeUtils;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 */
public class ServiceDeploymentManager {

    private List<ServiceDeployment> serviceDeployments = new ArrayList<ServiceDeployment>(1);

    private ProjectManager projectMgr;

    private StudioFileSystem fileSystem;

    private StudioConfiguration studioConfiguration;

    public ServiceDeploymentManager() {
        // hack: these should be managed by Spring
        this.serviceDeployments.add(new DataModelDeploymentConfiguration());
    }

    public com.wavemaker.tools.io.File generateWebapp(DeploymentInfo info, java.io.File tempWebAppRoot) {
        Map<String, String> allDbProps = new HashMap<String, String>();
        for (DeploymentDB db : info.getDatabases()) {
            allDbProps.putAll(db.asProperties());
        }
        return generateWebapp(getProjectRoot(), allDbProps, tempWebAppRoot, info.getArchiveType().equals(ArchiveType.EAR));
    }

    /*
     * public Resource generateWebapp(Resource projectRoot, Map<String, String> properties, boolean includeEar) { Folder
     * stagingProjectDir = null; try { stagingProjectDir = this.fileSystem.createTempDir();
     * this.fileSystem.copyRecursive(projectRoot, stagingProjectDir, new ArrayList<String>()); DesignServiceManager mgr
     * = DesignTimeUtils.getDSMForProjectRoot(stagingProjectDir); prepareForDeployment(mgr, properties); return
     * buildWar(mgr.getProjectManager(), getWarFile(), includeEar); } catch (IOException ex) { throw new
     * ConfigurationException(ex); } finally { try { this.fileSystem.deleteFile(stagingProjectDir); } catch (Exception
     * ignore) { } } }
     */

    private com.wavemaker.tools.io.File generateWebapp(Folder projectRoot, Map<String, String> properties,
                                                       java.io.File tempWebAppRoot, boolean includeEar) {
        File stagingProjectDir = null;

        try {
            stagingProjectDir = IOUtils.createTempDirectory("dplstaging", "dir");
            Folder stagingProjectDirFolder = new LocalFolder(stagingProjectDir);
            projectRoot.copyContentsTo(stagingProjectDirFolder);
            DesignServiceManager mgr = DesignTimeUtils.getDSMForProjectRoot(stagingProjectDirFolder);
            prepareForDeployment(mgr, properties);
            return buildWar(mgr.getProjectManager(), getWarFile(), tempWebAppRoot, includeEar);
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        } finally {
            try {
                IOUtils.deleteRecursive(stagingProjectDir);
            } catch (Exception ignore) {
            }
        }
    }

    public com.wavemaker.tools.io.File getWarFile() {
        Folder projectRoot = getProjectRoot();
        Folder destDir = projectRoot.getFolder(DeploymentManager.DIST_DIR_DEFAULT);
        String warFileName = this.projectMgr.getCurrentProject().getProjectName();
        return destDir.getFile(warFileName + ".war");
    }

    public com.wavemaker.tools.io.File getEarFile() {
        Folder projectRoot = getProjectRoot();
        Folder destDir;
        destDir = projectRoot.getFolder(DeploymentManager.DIST_DIR_DEFAULT);
        String earFileName = projectRoot.getName();
        return destDir.getFile(earFileName + ".ear");
    }

    public void setServiceDeployments(List<ServiceDeployment> serviceDeployments) {
        this.serviceDeployments = serviceDeployments;
    }

    public void setProjectManager(ProjectManager projectMgr) {
        this.projectMgr = projectMgr;
    }

    public ProjectManager getProjectManager() {
        return this.projectMgr;
    }

    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    private Folder getProjectRoot() {
        return this.projectMgr.getCurrentProject().getRootFolder();
    }

    private com.wavemaker.tools.io.File buildWar(ProjectManager projectMgr, com.wavemaker.tools.io.File warFile,
                                                 java.io.File tempWebAppRoot, boolean includeEar) throws IOException {
        // call into existing deployment code to generate war
        // would be super nice to refactor this
        DeploymentManager deploymentMgr;
        if (WMAppContext.getInstance().isCloudFoundry()) {
            deploymentMgr = new CloudFoundryDeploymentManager();
        } else {
            deploymentMgr = new LocalDeploymentManager();
        }
        deploymentMgr.setProjectManager(projectMgr);
        deploymentMgr.setStudioConfiguration(this.studioConfiguration);
        deploymentMgr.setFileSystem(this.fileSystem);
        com.wavemaker.tools.io.File war = deploymentMgr.buildWar(warFile, tempWebAppRoot, includeEar);
        return war;
    }

    private void prepareForDeployment(DesignServiceManager mgr, Map<String, String> properties) {

        for (Service service : mgr.getServices()) {
            // hack: only run for dataservices for now
            if (!service.getType().equals(DataServiceType.TYPE_NAME)) {
                continue;
            }

            storeProperties(properties);

            Map<String, String> m = getServiceProperties(properties, service.getId());

            int indx = 0;
            for (ServiceDeployment sd : this.serviceDeployments) {
                indx++;
                sd.prepare(service.getId(), m, mgr, indx);
            }
        }
    }

    private void storeProperties(Map<String, String> properties) {
        Project p = this.projectMgr.getCurrentProject();
        p.clearProperties(ServiceDeploymentManager.class);
        for (Map.Entry<String, String> e : properties.entrySet()) {
            p.setProperty(ServiceDeploymentManager.class, e.getKey(), e.getValue());
        }
    }

    private Map<String, String> getServiceProperties(Map<String, String> properties, String serviceName) {
        Map<String, String> rtn = new HashMap<String, String>();
        String s = serviceName + ProjectConstants.PROP_SEP;
        for (Map.Entry<String, String> e : properties.entrySet()) {
            if (e.getKey().startsWith(s)) {
                rtn.put(e.getKey().substring(s.length()), e.getValue());
            }
        }
        return rtn;
    }
}
