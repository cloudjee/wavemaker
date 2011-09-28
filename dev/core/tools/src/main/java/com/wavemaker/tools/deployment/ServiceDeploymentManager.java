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

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONMarshaller;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONState;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.runtime.data.DataServiceType;
import com.wavemaker.runtime.server.json.JSONUtils;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.data.DataModelDeploymentConfiguration;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.util.DesignTimeUtils;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 * 
 */
public class ServiceDeploymentManager {

	private static final String DEPLOYMENTS_FILE = "/deployments.js";

	private List<ServiceDeployment> serviceDeployments = new ArrayList<ServiceDeployment>(
			1);

	private LocalStudioConfiguration studioConfiguration = null;

	private ProjectManager projectMgr = null;

	public ServiceDeploymentManager() {
		// hack: these should be managed by Spring
		serviceDeployments.add(new DataModelDeploymentConfiguration());
	}

	public Resource generateWebapp(DeploymentInfo info) {
		Map<String, String> allDbProps = new HashMap<String, String>();
		for (DeploymentDB db : info.getDatabases()) {
			allDbProps.putAll(db.asProperties());
		}
		return generateWebapp(getProjectRoot(), allDbProps, info
				.getArchiveType().equals(ArchiveType.EAR));
	}

	public Resource generateWebapp(Map<String, String> properties) {
		return generateWebapp(getProjectRoot(), properties, false);
	}

	public Resource generateWebapp(Resource projectRoot,
			Map<String, String> properties, boolean includeEar) {
		Resource stagingProjectDir = null;
		try {
			stagingProjectDir = studioConfiguration.createTempDir();
			studioConfiguration.copyRecursive(projectRoot, stagingProjectDir,
					new ArrayList<String>());
			DesignServiceManager mgr = DesignTimeUtils
					.getDSMForProjectRoot(stagingProjectDir);
			prepareForDeployment(mgr, properties);
			return buildWar(mgr.getProjectManager(), getWarFile(), includeEar);
		} catch (IOException ex) {
			throw new ConfigurationException(ex);
		} finally {
			try {
				studioConfiguration.deleteFile(stagingProjectDir);
			} catch (Exception ignore) {
			}
		}
	}

	public Resource getWarFile() {
		Resource projectRoot = getProjectRoot();
		try {
			Resource destDir = projectRoot
					.createRelative(DeploymentManager.DIST_DIR_DEFAULT);

			// Let's drop the user account info if it is embedded in the war
			// file name
			String warFileName = projectRoot.getFilename();
			String acctInfo = projectMgr.getUserProjectPrefix();
			if (warFileName.contains(acctInfo)) {
				int len = acctInfo.length();
				warFileName = warFileName.substring(len);
			}

			return destDir.createRelative(warFileName
					+ DeploymentManager.WAR_EXTENSION);
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	public Resource getEarFile() {
		Resource projectRoot = getProjectRoot();
		Resource destDir;
		try {
			destDir = projectRoot
					.createRelative(DeploymentManager.DIST_DIR_DEFAULT);

			// Let's drop the user account info if it is embedded in the war
			// file
			// name
			String earFileName = projectRoot.getFilename();
			String acctInfo = projectMgr.getUserProjectPrefix();
			if (earFileName.contains(acctInfo)) {
				int len = acctInfo.length();
				earFileName = earFileName.substring(len);
			}

			return destDir.createRelative(earFileName
					+ DeploymentManager.EAR_EXTENSION);

		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}
	}

	public void setServiceDeployments(List<ServiceDeployment> serviceDeployments) {
		this.serviceDeployments = serviceDeployments;
	}

	public void setStudioConfiguration(
			LocalStudioConfiguration studioConfiguration) {
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
		return deployments.forProject(projectMgr.getCurrentProject()
				.getProjectName());
	}

	private Resource getProjectRoot() {
		return projectMgr.getCurrentProject().getProjectRoot();
	}

	private Resource buildWar(ProjectManager projectMgr, Resource warFile,
			boolean includeEar) throws IOException {
		// call into existing deployment code to generate war
		// would be super nice to refactor this
		DeploymentManager deploymentMgr = new DeploymentManager();
		deploymentMgr.setProjectManager(projectMgr);
		deploymentMgr.setStudioConfiguration(studioConfiguration);
		String war = deploymentMgr.buildWar(warFile, includeEar);
		return studioConfiguration.getResourceForURI(war);
	}

	private void prepareForDeployment(DesignServiceManager mgr,
			Map<String, String> properties) {

		for (Service service : mgr.getServices()) {
			// hack: only run for dataservices for now
			if (!service.getType().equals(DataServiceType.TYPE_NAME)) {
				continue;
			}

			storeProperties(properties);

			Map<String, String> m = getServiceProperties(properties,
					service.getId());

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
			p.setProperty(ServiceDeploymentManager.class, e.getKey(),
					e.getValue());
		}
	}

	private Map<String, String> getServiceProperties(
			Map<String, String> properties, String serviceName) {
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
			deployments.save(projectMgr.getCurrentProject().getProjectName(),
					deploymentInfo);

			deploymentsResource = studioConfiguration.getCommonDir()
					.createRelative(DEPLOYMENTS_FILE);
			writer = new OutputStreamWriter(studioConfiguration.getOutputStream(deploymentsResource));
			JSONMarshaller.marshal(writer, deployments, new JSONState(), false,
					true);
			writer.flush();
		} catch (IOException e) {
			throw new WMRuntimeException(
					"An error occurred while trying to save deployment.", e);
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

	/**
	 * @param deploymentInfo
	 * @return
	 */
	public void deleteDeploymentInfo(String deploymentId) {
		Resource deploymentsResource;
		Writer writer = null;
		try {
			Deployments deployments = readDeployments();
			deployments.remove(projectMgr.getCurrentProject().getProjectName(),
					deploymentId);
			deploymentsResource = studioConfiguration.getCommonDir()
					.createRelative(DEPLOYMENTS_FILE);
			writer = new OutputStreamWriter(studioConfiguration.getOutputStream(deploymentsResource));
			JSONMarshaller.marshal(writer, deployments, new JSONState(), false,
					true);
			writer.flush();
		} catch (IOException e) {
			throw new WMRuntimeException(
					"An error occurred while trying to save deployment.", e);
		} finally {
			if (writer != null) {
				try {
					writer.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	private Deployments readDeployments() {
		Resource deploymentsResource;
		try {
			deploymentsResource = studioConfiguration.getCommonDir()
					.createRelative(DEPLOYMENTS_FILE);
			if (!deploymentsResource.exists()) {
				deploymentsResource.getFile().createNewFile();
				return new Deployments();
			} else {
				String s = FileCopyUtils.copyToString(new InputStreamReader(
						deploymentsResource.getInputStream()));
				if (s.length() > 0) {
					JSON result = JSONUnmarshaller.unmarshal(s);
					Assert.isTrue(result instanceof JSONObject,
							deploymentsResource.getFile().getAbsolutePath()
									+ " is in an unexpected format.");
					return (Deployments) JSONUtils.toBean((JSONObject) result,
							Deployments.class);
				} else {
					return new Deployments();
				}
			}
		} catch (IOException e) {
			throw new WMRuntimeException(
					"Failed to read stored deployments configuration.");
		}
	}
}
