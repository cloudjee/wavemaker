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
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.FileInputStream;
import java.util.*;


import org.apache.commons.io.IOUtils;
import org.springframework.web.multipart.MultipartFile;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.CommonConstants;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.deployment.AppInfo;
import com.wavemaker.tools.deployment.DeploymentTargetManager;
import com.wavemaker.tools.deployment.ServiceDeploymentManager;
import com.wavemaker.tools.deployment.TargetInfo;
import com.wavemaker.tools.deployment.xmlhandlers.Targets;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.ParamName;

import com.wavemaker.runtime.server.FileUploadResponse;

/**
 * @author Joel Hare
 * @version $Rev$ - $Date$
 *
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
	if (!warFile.exists()) return null;
	long wartime = warFile.lastModified();
	return new java.util.Date(wartime);
    }

    public boolean isWarUpToDate() {
        File warFile = serviceDeploymentManager.getWarFile();
	if (!warFile.exists()) return false;
	long wartime = warFile.lastModified();
        ProjectManager projectMgr = serviceDeploymentManager.getProjectManager();
	long lastModTime = com.wavemaker.common.util.IOUtils.getMostRecentModificationTime(projectMgr.getCurrentProject().getProjectRoot());
	//System.out.println("WAR TIME: " + wartime);
	//System.out.println("LAS TIME: " + lastModTime);
	return wartime >= lastModTime;
    }

    public String exportProject() {
	   String result = deploymentManager.exportProject();
	   return (deploymentManager.isCloud()) ? "" :  result;
    }

      /* THIS ASSUMES exportProject has already been called, and the war file is already prepared.
	 Why don't we just let the client pass in a path to the file they want?  Because we're dealing with files internal
	 to the studio where they should not be able to just download anything they want to pass as a parameter. */
    public DownloadResponse downloadProjectWar() {
	  File localFile = serviceDeploymentManager.getWarFile();
	  String filename = localFile.getAbsolutePath();
	try {
	      DownloadResponse ret = new DownloadResponse();

	      FileInputStream fis = new FileInputStream(localFile);

	      ret.setContents(fis);
	      ret.setContentType("application/unknown");
	      ret.setFileName(filename.substring(filename.lastIndexOf(File.separator)+1));
	      return ret;
	} catch(IOException e) {

	}
	return (DownloadResponse)null;
    }

     /* THIS ASSUMES exportProject has already been called, and the war file is already prepared.
	 Why don't we just let the client pass in a path to the file they want?  Because we're dealing with files internal
	 to the studio where they should not be able to just download anything they want to pass as a parameter. */
    public DownloadResponse downloadProjectEar() {
	  File localFile = serviceDeploymentManager.getEarFile();
	  String filename = localFile.getAbsolutePath();
        try {
              DownloadResponse ret = new DownloadResponse();

              FileInputStream fis = new FileInputStream(localFile);

              ret.setContents(fis);
              ret.setContentType("application/unknown");
              ret.setFileName(filename.substring(filename.lastIndexOf(File.separator)+1));
              return ret;
        } catch(IOException e) {

        }
	    return (DownloadResponse)null;
    }

    /* THIS ASSUMES exportProject has already been called, and the zip file is already prepared */
    public DownloadResponse downloadProjectZip() {

	  String filename = deploymentManager.getExportPath();

	  try {
	      DownloadResponse ret = new DownloadResponse(); 
	      
	      File localFile = new File(filename); 
	      FileInputStream fis = new FileInputStream(localFile); 
	      
	      ret.setContents(fis); 
	      filename = filename.substring(filename.lastIndexOf(File.separator)+1);					
	      ret.setContentType("application/zip");
	      ret.setFileName(filename);
	      return ret; 
	  } catch(IOException e) {
	      
	  }
	  return (DownloadResponse)null;
    }
    /*
    public void exportAndDownloadProject() {
        String filename = deploymentManager.exportProject();
	}
    */

    public void exportProject(String zipFileName) {
        deploymentManager.exportProject(zipFileName);
    }
    public FileUploadResponse uploadProjectZipFile(
            @ParamName(name="file") MultipartFile file) throws IOException {
    	return deploymentManager.importFromZip(file);
    }

    public Collection<String> getDeploymentTargetNames() {
        return deploymentTargetManager.getDeploymentTargetNames();
    }

    public Map<String, String> getConfigurableProperties(String targetServerType)
    {

        return deploymentTargetManager.getDeploymentTarget(targetServerType)
            .getConfigurableProperties();
    }

    public Collection<TargetInfo> getDeploymentTargetList() {
        Map<String, Targets.Target> targets = serviceDeploymentManager.getDeploymentTargetList();
        return constructTargetData(targets);
    }

    public synchronized String updateDeploymentTarget(String name, String description, String destType,
        String servicProvider, String container, String server, String dnsHost, String publicIp, String privateIp,
        String port, String user, String password, boolean override) {

        Targets.Target target = new Targets.Target();

        target.setName(name);
        target.setDescription(description);
        target.setDestType(destType);
        target.setServiceProvider(servicProvider);
        target.setServer(server);
        target.setContainer(container);
        target.setDnsHost(dnsHost);
        target.setPublicIp(publicIp);
        target.setPrivateIp(privateIp);
        target.setPort(port);
        target.setUser(user);
        target.setPassword(password);

        return serviceDeploymentManager.updateDeploymentTarget(target, override);
    }

    public synchronized Collection<TargetInfo> deleteDeploymentTarget(String targetName) {
        serviceDeploymentManager.deleteDeploymentTarget(targetName);
        return this.getDeploymentTargetList();
    }

    public Collection<AppInfo> listDeploymentNames(String targetServerType,
                                                   Map<String, String> props) 
    {
        return deploymentTargetManager.getDeploymentTarget(targetServerType)
            .listDeploymentNames(props);        
    }

    public String deploy(String targetServerType, String contextRoot,
                         Map<String, String> props) throws IOException 
    {
        //deploymentManager.buildWar();
        File f;
        if (targetServerType.equals(CommonConstants.SERVER_TYPE_WEBSPHERE))
            f = serviceDeploymentManager.getEarFile();
        else
            f = serviceDeploymentManager.getWarFile();
        if (!f.exists()) {
            throw new AssertionError("Application archive file doesn't exist at " +
                                     f.getAbsolutePath());
        }
        return deploymentTargetManager.getDeploymentTarget(targetServerType)
            .deploy(f, contextRoot, props);        
    }

    public String undeploy(String targetServerType, String contextRoot,
                           Map<String, String> props) 
    {
        return deploymentTargetManager.getDeploymentTarget(targetServerType)
            .undeploy(contextRoot, props);        
    }

	public String redeploy(String targetServerType, String contextRoot,
			Map<String, String> props) throws IOException {
		try {
			if (!targetServerType.equals(CommonConstants.SERVER_TYPE_CLOUDFOUNDRY)) {
				undeploy(targetServerType, contextRoot, props);
			}
		} catch (Exception e) {
			//no-op
		}
		return deploy(targetServerType, contextRoot, props);
	}

    public void deployClientComponent(String className, String folder,
            String data) throws IOException {
        deploymentManager.deployClientComponent(className, folder, data);
    }

    public boolean undeployClientComponent(String className, String folder,
            boolean removeSource) throws IOException {
        return deploymentManager.undeployClientComponent(className, folder,
                removeSource);
    }

    public void deployTheme( String themename, String filename,
            String data) throws IOException {
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
    public void setServiceDeploymentManager(
            ServiceDeploymentManager serviceDeploymentManager) {
        this.serviceDeploymentManager = serviceDeploymentManager;
    }

    @HideFromClient
    public void setDeploymentTargetManager(
            DeploymentTargetManager deploymentTargetManager) {
        this.deploymentTargetManager = deploymentTargetManager;
    }

    private Collection<TargetInfo> constructTargetData(Map<String, Targets.Target> targets) {
        if (targets == null || targets.size() == 0) return null;

        List<TargetInfo> rtn = new ArrayList<TargetInfo>();

        for (Targets.Target target: targets.values()) {
            TargetInfo ti = new TargetInfo(target);
            rtn.add(ti);
        }

        Collections.sort(rtn);

        return rtn;
    }
}
