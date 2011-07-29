/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;

import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONMarshaller;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONState;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.runtime.data.DataServiceType;
import com.wavemaker.runtime.server.json.JSONUtils;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.data.DataModelDeploymentConfiguration;
import com.wavemaker.tools.deployment.xmlhandlers.Targets;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.util.DesignTimeUtils;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class ServiceDeploymentManager {

    private static final String DEPLOYMENTS_FILE = "/deployments.js";

    private List<ServiceDeployment> serviceDeployments = new ArrayList<ServiceDeployment>(1);

    private StudioConfiguration studioConfiguration = null;

    private ProjectManager projectMgr = null;

    public ServiceDeploymentManager() {
        // hack: these should be managed by Spring
        serviceDeployments.add(new DataModelDeploymentConfiguration());
    }

    public File generateWebapp(DeploymentInfo info) {
        Map<String, String> allDbProps = new HashMap<String, String>();
        for (DeploymentDB db : info.getDatabases()) {
            allDbProps.putAll(db.asProperties());
        }
        return generateWebapp(getProjectRoot(), allDbProps, info.getArchiveType().equals(ArchiveType.EAR));
    }

    public File generateWebapp(Map<String, String> properties) {
        return generateWebapp(getProjectRoot(), properties, false);
    }

    public File generateWebapp(File projectRoot, Map<String, String> properties, boolean includeEar) {
        File stagingProjectDir = null;

        try {
            stagingProjectDir = IOUtils.createTempDirectory("dplstaging", "dir");
            IOUtils.copy(projectRoot, stagingProjectDir);
            DesignServiceManager mgr = DesignTimeUtils.getDSMForProjectRoot(stagingProjectDir);
            prepareForDeployment(mgr, properties);
            return buildWar(mgr.getProjectManager(), getWarFile(), includeEar);
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        } finally {
            try {
                IOUtils.deleteRecursive(stagingProjectDir);
            } catch (Exception ignore) {
            }
        }
    }

    public File getWarFile() {
        File projectRoot = getProjectRoot();
        File destDir = new File(projectRoot, DeploymentManager.DIST_DIR_DEFAULT);

        // Let's drop the user account info if it is embedded in the war file name
        String warFileName = projectRoot.getName();
        String acctInfo = projectMgr.getUserProjectPrefix();
        if (warFileName.contains(acctInfo)) {
            int len = acctInfo.length();
            warFileName = warFileName.substring(len);
        }

        // return new File(destDir, projectRoot.getName()
        return new File(destDir, warFileName + DeploymentManager.WAR_EXTENSION);
    }

    public File getEarFile() {
        File projectRoot = getProjectRoot();
        File destDir = new File(projectRoot, DeploymentManager.DIST_DIR_DEFAULT);

        // Let's drop the user account info if it is embedded in the war file name
        String earFileName = projectRoot.getName();
        String acctInfo = projectMgr.getUserProjectPrefix();
        if (earFileName.contains(acctInfo)) {
            int len = acctInfo.length();
            earFileName = earFileName.substring(len);
        }

        return new File(destDir, earFileName + DeploymentManager.EAR_EXTENSION);
    }

    public void setServiceDeployments(List<ServiceDeployment> serviceDeployments) {
        this.serviceDeployments = serviceDeployments;
    }

    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }

    public void setProjectManager(ProjectManager projectMgr) {
        this.projectMgr = projectMgr;
    }

    public ProjectManager getProjectManager() {
        return this.projectMgr;
    }

    public List<DeploymentInfo> getDeploymentInfo() {
        Deployments deployments = readDeployments();
        return deployments.forProject(projectMgr.getCurrentProject().getProjectName());
    }

    /**
     * @return List of available deployment target information for users to select. for example:
     *         <ul>
     *         <li>web server</li>
     *         <li>cloud service provider</li>
     *         <li>port</li>
     *         <li>etc</li>
     *         </ul>
     *         The property values are passed into the deployment methods.
     */
    public Map<String, Targets.Target> getDeploymentTargetList() {
        File file = new File(StudioConfiguration.staticGetWaveMakerHome().getAbsolutePath(), CommonConstants.DEPLOYMENT_TARGETS_XML);
        Targets targets;
        List<Targets.Target> tlist;
        Map<String, Targets.Target> rtn = new HashMap<String, Targets.Target>();
        try {
            FileInputStream inputStream = new FileInputStream(file);

            JAXBContext respContext = JAXBContext.newInstance(Targets.class);
            Unmarshaller unmarshaller = respContext.createUnmarshaller();

            Object object = unmarshaller.unmarshal(inputStream);
            targets = Targets.class.cast(object);
            tlist = targets.getTarget();

            for (Targets.Target target : tlist) {
                String key = target.getName();
                rtn.put(key, target);
            }

            inputStream.close();
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }

        return rtn;
    }

    /**
     * @return Get deployment target information for a given target name for example:
     *         <ul>
     *         <li>web server</li>
     *         <li>cloud service provider</li>
     *         <li>port</li>
     *         <li>etc</li>
     *         </ul>
     */
    public Targets.Target getDeploymentTarget(String targetName) {
        Map<String, Targets.Target> targets = getDeploymentTargetList();
        return targets.get(targetName);
    }

    public String updateDeploymentTarget(Targets.Target newTarget, boolean override) {
        File file = new File(StudioConfiguration.staticGetWaveMakerHome().getAbsolutePath(), CommonConstants.DEPLOYMENT_TARGETS_XML);
        Targets targets;
        List<Targets.Target> tlist;
        boolean exists = false;

        try {
            FileInputStream inputStream = new FileInputStream(file);

            JAXBContext respContext = JAXBContext.newInstance(Targets.class);
            Unmarshaller unmarshaller = respContext.createUnmarshaller();

            Object object = unmarshaller.unmarshal(inputStream);
            targets = Targets.class.cast(object);
            tlist = targets.getTarget();

            inputStream.close();

            Targets.Target targetFound = null;
            for (Targets.Target target : tlist) {
                String key = target.getName();
                if (newTarget.getName().equals(key)) {
                    exists = true;
                    targetFound = target;
                    break;
                }
            }

            if (exists) {
                if (!override) {
                    return "WARNING: Deployment target " + newTarget.getName() + " already exists. No update is done.";
                }
                targetFound.setName(newTarget.getName());
                targetFound.setDescription(newTarget.getDescription());
                targetFound.setDestType(newTarget.getDestType());
                targetFound.setServiceProvider(newTarget.getServiceProvider());
                targetFound.setServer(newTarget.getServer());
                targetFound.setContainer(newTarget.getContainer());
                targetFound.setDnsHost(newTarget.getDnsHost());
                targetFound.setPublicIp(newTarget.getPublicIp());
                targetFound.setPrivateIp(newTarget.getPrivateIp());
                targetFound.setPort(newTarget.getPort());
                targetFound.setUser(newTarget.getUser());
                targetFound.setPassword(newTarget.getPassword());
            } else {
                tlist.add(newTarget);
            }

            Marshaller marshaller = respContext.createMarshaller();

            FileOutputStream outputStream = new FileOutputStream(file);

            marshaller.marshal(targets, outputStream);

            outputStream.close();
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }

        String msg = "";

        if (exists)
            msg = "Deployment target " + newTarget.getName() + " has been successfully updated.";
        else
            msg = "New deployment target " + newTarget.getName() + " has been successfully added.";

        return msg;
    }

    public void deleteDeploymentTarget(String targetName) {
        File file = new File(StudioConfiguration.staticGetWaveMakerHome().getAbsolutePath(), CommonConstants.DEPLOYMENT_TARGETS_XML);
        Targets targets;
        List<Targets.Target> tlist;
        boolean deleted = false;

        try {
            FileInputStream inputStream = new FileInputStream(file);

            JAXBContext respContext = JAXBContext.newInstance(Targets.class);
            Unmarshaller unmarshaller = respContext.createUnmarshaller();

            Object object = unmarshaller.unmarshal(inputStream);
            targets = Targets.class.cast(object);
            tlist = targets.getTarget();

            inputStream.close();

            for (Targets.Target target : tlist) {
                String key = target.getName();
                if (targetName.equals(key)) {
                    tlist.remove(target);
                    deleted = true;
                    break;
                }
            }

            if (deleted) {
                Marshaller marshaller = respContext.createMarshaller();
                FileOutputStream outputStream = new FileOutputStream(file);
                marshaller.marshal(targets, outputStream);
                outputStream.close();
            }
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
    }

    private File getProjectRoot() {
        return projectMgr.getCurrentProject().getProjectRoot();
    }

    private File buildWar(ProjectManager projectMgr, File warFile, boolean includeEar) throws IOException {
        // call into existing deployment code to generate war
        // would be super nice to refactor this
        DeploymentManager deploymentMgr = new DeploymentManager();
        deploymentMgr.setProjectManager(projectMgr);
        deploymentMgr.setStudioConfiguration(studioConfiguration);
        String war = deploymentMgr.buildWar(warFile, includeEar);
        return new File(war);
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
            for (ServiceDeployment sd : serviceDeployments) {
                indx++;
                sd.prepare(service.getId(), m, mgr, indx);
            }
        }
    }

    private void storeProperties(Map<String, String> properties) {
        Project p = projectMgr.getCurrentProject();
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

    /**
     * @param deploymentInfo
     * @return
     */
    public String saveDeploymentInfo(DeploymentInfo deploymentInfo) {
        Resource deploymentsResource;
        Writer writer = null;
        try {
            Deployments deployments = readDeployments();
            deployments.save(projectMgr.getCurrentProject().getProjectName(), deploymentInfo);

            deploymentsResource = new FileSystemResource(studioConfiguration.getCommonDir().getPath() + "/").createRelative(DEPLOYMENTS_FILE);
            writer = new FileWriter(deploymentsResource.getFile(), false);
            JSONMarshaller.marshal(writer, deployments, new JSONState(), false, true);
            writer.flush();
        } catch (IOException e) {
            throw new WMRuntimeException("An error occurred while trying to save deployment.", e);
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return deploymentInfo.getDeploymentId();
    }

    private Deployments readDeployments() {
        Resource deploymentsResource;
        try {
            deploymentsResource = new FileSystemResource(studioConfiguration.getCommonDir().getPath() + "/").createRelative(DEPLOYMENTS_FILE);
            if (!deploymentsResource.exists()) {
                deploymentsResource.getFile().createNewFile();
                return new Deployments();
            } else {
                String s = FileCopyUtils.copyToString(new FileReader(deploymentsResource.getFile()));
                if (s.length() > 0) {
                    JSON result = JSONUnmarshaller.unmarshal(s);
                    Assert.isTrue(result instanceof JSONObject, deploymentsResource.getFile().getAbsolutePath() + " is in an unexpected format.");
                    return (Deployments) JSONUtils.toBean((JSONObject) result, Deployments.class);
                } else {
                    return new Deployments();
                }
            }
        } catch (IOException e) {
            throw new WMRuntimeException("Failed to read stored deployments configuration.");
        }
    }

}
