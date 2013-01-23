/*
 * Copyright (C) 2007-2013 VMware, Inc. All rights reserved.
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
import java.io.InputStream;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.zip.ZipArchive;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.project.StudioFileSystem;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import com.wavemaker.runtime.server.Downloadable;
import com.wavemaker.tools.project.DownloadableFile;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.FileUploadResponse;
import com.wavemaker.runtime.server.ParamName;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.deployment.DeploymentInfo;
import com.wavemaker.tools.deployment.DeploymentStatusException;
import com.wavemaker.tools.deployment.DeploymentTargetManager;
import com.wavemaker.tools.deployment.DeploymentType;
import com.wavemaker.tools.deployment.ServiceDeploymentManager;
import com.wavemaker.tools.project.DeploymentManager;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;

import com.wavemaker.tools.io.FilterOn;
import com.wavemaker.tools.io.FilterOn.AttributeFilter;

/**
 * Deployment Service used by WaveMaker to manage and deploy projects to various deployment targets.
 * 
 * @author Joel Hare
 * @author Jeremy Grelle
 */
@ExposeToClient
public class DeploymentService {

    private static final String SUCCESS = "SUCCESS";

    private static final String CLIENT_COMPONENTS_STAGE = "stage";

    private DeploymentManager deploymentManager;

    private DeploymentTargetManager deploymentTargetManager;

    private ServiceDeploymentManager serviceDeploymentManager;

    private StudioFileSystem fileSystem;

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
     * Adapter method that can be used to convert a {@link Resource} to a {@link DownloadResponse}.
     * 
     * @param resource the resource
     * @return the download response
     */
    private DownloadResponse getAsDownloadResponse(com.wavemaker.tools.io.File resource) {
        DownloadResponse ret = new DownloadResponse();
        InputStream fis = resource.getContent().asInputStream();

        ret.setContents(fis);
        ret.setContentType("application/unknown");
        ret.setFileName(resource.getName());
        return ret;
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

    public FileUploadResponse uploadTemplateZipFile(@ParamName(name = "file") MultipartFile file) throws IOException {
        return this.deploymentManager.importFromZip(file,true);
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
        File tempWebAppRoot = null;
        try {
            if (deploymentInfo.getDeploymentType() != DeploymentType.FILE && deploymentInfo.getDeploymentType() != DeploymentType.CLOUD_FOUNDRY) {
                this.deploymentTargetManager.getDeploymentTarget(deploymentInfo.getDeploymentType()).validateDeployment(deploymentInfo);
            }

            if (!WMAppContext.getInstance().isCloudFoundry() || deploymentInfo.getDeploymentType() == DeploymentType.FILE) {
                tempWebAppRoot = IOUtils.createTempDirectory();
                com.wavemaker.tools.io.File f = this.serviceDeploymentManager.generateWebapp(deploymentInfo, tempWebAppRoot);
                if (!f.exists()) {
                    throw new AssertionError("Application archive file doesn't exist at " + f.toString());
                }
                if (deploymentInfo.getDeploymentType() == DeploymentType.FILE) {
                    return SUCCESS;
                }
            }

            String ret = this.deploymentTargetManager.getDeploymentTarget(deploymentInfo.getDeploymentType()).deploy(
                this.serviceDeploymentManager.getProjectManager().getCurrentProject(), deploymentInfo, tempWebAppRoot);

            return ret;
        } catch (DeploymentStatusException e) {
            return e.getStatusMessage();
        } finally {
            if (tempWebAppRoot != null) {
                try {
                    IOUtils.deleteRecursive(tempWebAppRoot);
                } catch (IOException ex) {
                    try {
                        Thread.sleep(3000);
                        IOUtils.deleteRecursive(tempWebAppRoot);
                    } catch (InterruptedException ex1) {
                        throw new WMRuntimeException(ex1);
                    }
                }
            }
        }
    }

    public String getDeploymentURL(DeploymentInfo deploymentInfo) {
        String ret = this.deploymentTargetManager.getDeploymentTarget(deploymentInfo.getDeploymentType()).getUrl(deploymentInfo);
        return ret;
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
    public void deployClientComponent(String className, String folder, String data, String[] services,String[] images, String[] html) throws IOException {
	deployClientComponent(className,folder,data);

	/* Take care of the services */
	Folder componentFolder = this.fileSystem.getWaveMakerHomeFolder().getFolder("common/packages");
        if (folder != null && folder.length() > 0) {

            String[] folderList = folder.split("\\.");
            for (String f : folderList) {
                componentFolder = componentFolder.getFolder(f);		
            }
        } 

	Folder componentServiceFolder = componentFolder.getFolder("services");
	componentServiceFolder.createIfMissing();
	componentServiceFolder.list().delete(); // delete any old services
	com.wavemaker.tools.io.Folder projectServicesFolder = this.serviceDeploymentManager.getProjectManager().getCurrentProject().getRootFolder().getFolder("services");

	int i;
	for (i = 0; i < services.length; i++) {
	    Folder destFolder = componentServiceFolder.getFolder(services[i]);
	    destFolder.createIfMissing();
	    projectServicesFolder.getFolder(services[i]).copyContentsTo(destFolder);
	}

	com.wavemaker.tools.io.Folder webappFolder = this.serviceDeploymentManager.getProjectManager().getCurrentProject().getRootFolder().getFolder("webapproot");
	Folder compositeImagesFolder = componentFolder.getFolder("images");
	compositeImagesFolder.createIfMissing();
	for (i = 0; i < images.length; i++) {
	    com.wavemaker.tools.io.File sourceFile = webappFolder.getFile(images[i]);
	    sourceFile.copyTo(compositeImagesFolder);
	}

	Folder compositeHtmlFolder = componentFolder.getFolder("html");
	compositeHtmlFolder.createIfMissing();
	for (i = 0; i < html.length; i++) {
	    com.wavemaker.tools.io.File sourceFile = webappFolder.getFile(html[i]); 
	    sourceFile.copyTo(compositeHtmlFolder);
	}
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

    public String listThemes() throws IOException {
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

    /**
     * @param folderpath The folder
     * @param filename
     * @return
     * @throws IOException
     */
    public Downloadable exportTheme(String themename) throws IOException {
	Folder common = this.fileSystem.getCommonFolder();
	Folder themes = common.getFolder("themes");
	Folder f = themes.getFolder(themename);
	Folder themeexports = this.fileSystem.getCommonFolder().getFolder("themeexports");
	themeexports.createIfMissing();
	Folder tmp = themeexports.getFolder("tmp");
	tmp.createIfMissing();
	Folder destF = tmp.getFolder("themes");
	destF.createIfMissing();
	f.copyTo(destF);
        InputStream inputStream = ZipArchive.compress(tmp);
        com.wavemaker.tools.io.File exportFile = themeexports.getFile(themename + ".zip");
        exportFile.getContent().write(inputStream);
	tmp.delete();
	return new DownloadableFile(exportFile);
    }

    public void cleanupImportTmp(String file) throws IOException {
	if (!file.equals("")) {
	    Folder componentStage = this.fileSystem.getWaveMakerHomeFolder().getFolder("tmp").getFolder(file);
	    if (componentStage.exists()) {
		componentStage.delete();
	    }
	}

	/* Delete any old stuff from the tmp folder */
	Folder tmp = this.fileSystem.getWaveMakerHomeFolder().getFolder("tmp");
	for (com.wavemaker.tools.io.Folder f : tmp.list().folders()) {	
	    com.wavemaker.tools.io.File timestamp = f.getFile("timestamp.txt");
	    if (timestamp.exists()) {
		long time = Long.valueOf(timestamp.getContent().asString().trim()).longValue();
		/* If the file has been there for over 12 hours, then its probably gotten lost, and is not just sitting there for 12 hours
		 * uploading and waiting for the user
		 */
		if (time + 1000 * 3600 * 12 < new java.util.Date().getTime()) {
		    f.delete();
		}
	    }
	}
    }

    public FileUploadResponse testMultiFile(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();
        fileName = fileName.substring(0, fileName.lastIndexOf(".zip"));
	Folder common = this.fileSystem.getCommonFolder();
	Folder commonThemes = common.getFolder("themes");
	Folder projectRootFolder = this.fileSystem.getWaveMakerHomeFolder().getFolder("projects");

        FileUploadResponse ret = new FileUploadResponse();
	Folder tmp = this.fileSystem.getWaveMakerHomeFolder().getFolder("tmp");
	tmp.createIfMissing();
	
        Folder componentStage = tmp.getFolder(CLIENT_COMPONENTS_STAGE + new java.util.Date().getTime());
        ZipArchive.unpack(file.getInputStream(), componentStage);

	com.wavemaker.tools.io.File timestamp = componentStage.getFile("timestamp.txt");
	timestamp.getContent().write("" + new java.util.Date().getTime());

	String response = "{'file':'" + componentStage.getName() + "',";

	boolean isOldStyleExport = true;

	Folder themes = componentStage.getFolder("themes");
	if (themes.exists()) {
	    isOldStyleExport = false;
	    boolean first = true;
	    response += "'themes':[";
	    for (com.wavemaker.tools.io.Resource resource : themes.list().folders()) {
		if (!first) response += ",";
		first = false;
		response +="{'name':'" + resource.getName() + "', 'exists':" + commonThemes.getFolder(resource.getName()).exists() + "}";
	    }
	    response += "],";
	}
	
	Folder project = componentStage.getFolder("project");	
	if (project.exists()) {
	    isOldStyleExport = false;
	    for (com.wavemaker.tools.io.Folder resource : project.list().folders()) {
		Folder projectFolder = projectRootFolder.getFolder(resource.getName());
		boolean exists = projectFolder.exists();
		Folder projectFolderAlt = projectRootFolder.getFolder(resource.getName());
		for (int i = 1; i < 1000 && projectFolderAlt.exists(); i++) {
		    projectFolderAlt = projectRootFolder.getFolder(resource.getName() + i);
		}
		response += "'project':{'name':'" + resource.getName() + "', 'exists':" + exists + ",'alt':'" + projectFolderAlt.getName() + "'},";
	       
	    }
	}

	Folder projecttemplate = componentStage.getFolder("projecttemplate");
	if (projecttemplate.exists()) {
	    isOldStyleExport = false;
	    response += "'projecttemplates':[";
	    boolean first = true;
	    for (com.wavemaker.tools.io.Resource resource : projecttemplate.list().folders()) {
		if (!first) response += ",";
		first = false;
		response += "{'name':" + resource.getName() + "', 'exists':" + commonThemes.getFolder(resource.getName()).exists()  + "}";
	    }
	    response += "],";
	}

	Folder componentsFolder = componentStage.getFolder("components");
	if (componentsFolder.exists()) {
	    isOldStyleExport = false;
	    com.wavemaker.tools.io.Resources<com.wavemaker.tools.io.Resource> files = componentsFolder.list();
	    response += "'components':[";
	    boolean first = true;
	    for (com.wavemaker.tools.io.Resource resource : files) {
		String packageName = null;
		com.wavemaker.tools.io.File afile;
		String componentFileName;
		if (resource instanceof com.wavemaker.tools.io.File) {
		    afile = (com.wavemaker.tools.io.File)resource;
		    packageName = getClientComponentPackageString(afile);
		    componentFileName = afile.getName();
		} else {
		    com.wavemaker.tools.io.Folder f = (com.wavemaker.tools.io.Folder)resource;
		    afile = f.getFile(resource.getName() + ".js");
		    if (afile.exists()) {
			packageName = getClientComponentPackageString(afile);
		    }
		    componentFileName = resource.getName();
		}
		/* If we can't find the package name, then we can't import it, but what we pass around is the folder name */
		if (packageName != null) {
		    if (!first) response += ",";
		    first = false;
		    String className = packageName.substring(packageName.lastIndexOf(".") + 1);
		    String packageStr = packageName.substring(0, packageName.lastIndexOf("." + className));
		    Folder componentFolder = this.fileSystem.getWaveMakerHomeFolder().getFolder(StringUtils.packageToSrcFilePath(packageStr));
		    boolean exists =  componentFolder.getFile(className + ".js").exists();
		    response += "{'name':'" + componentFileName + "', 'exists':" + exists + "}";
		}
	    }
	    response += "],";
	}

	if (isOldStyleExport) {
	    com.wavemaker.tools.io.File indexhtml = componentStage.getFile("webapproot/index.html");
	    if (indexhtml.exists()) {
		String indexstring = indexhtml.getContent().asString();
		int endIndex = indexstring.lastIndexOf("({domNode: \"wavemakerNode\"");
		int startIndex = indexstring.lastIndexOf(" ", endIndex);
		String newProjectName = indexstring.substring(startIndex + 1, endIndex);

		Folder projectFolderAlt = projectRootFolder.getFolder(newProjectName);	
		for (int i = 1; i < 1000 && projectFolderAlt.exists(); i++) {
		    projectFolderAlt = projectRootFolder.getFolder(newProjectName + i);
		}

		response += "'project':{'name':'" + newProjectName + "', 'exists':" + projectRootFolder.getFolder(newProjectName).exists() + ",'alt':'" + projectFolderAlt.getName() + "'},";
		 
	    }
	}

	response += "'_end':0}";
	ret.setPath(response);
        return ret;

    }
    public String uploadMultiFile(String file, String[] importList) throws IOException {
	String response = "";

        Folder componentStage = this.fileSystem.getWaveMakerHomeFolder().getFolder("tmp").getFolder(file);
	Folder common = this.fileSystem.getCommonFolder();

	boolean isOldStyleExport = true;

	Folder themes = componentStage.getFolder("themes");
	Folder commonThemes = common.getFolder("themes");

	Folder importProjectTemplateFolder = componentStage.getFolder("projecttemplate");
	Folder templatesFolder = this.fileSystem.getWaveMakerHomeFolder().getFolder("templates");

	Folder componentsFolder = componentStage.getFolder("components");
	Folder packagesFolder = common.getFolder("packages");

	Folder project = componentStage.getFolder("project");
	Folder projectFolder = this.fileSystem.getWaveMakerHomeFolder().getFolder("projects");

	for (int i = 0; i < importList.length; i++) {
	    String type = importList[i].substring(0, importList[i].indexOf(":"));
	    String value = importList[i].substring(1 + importList[i].indexOf(":"));
	    System.out.println("TYPE:" + type + ", VALUE: " + value);
	    if (type.equals("theme")) {
		if (themes.exists()) {
		    Folder themeFolder = themes.getFolder(value);
		    if (themeFolder.exists()) {
			themeFolder.copyTo(commonThemes);
		    }
		}
	    } else if (type.equals("projecttemplate")) {
		if (importProjectTemplateFolder.exists()) {
		    Folder pFolder = importProjectTemplateFolder.getFolder(value);
		    if (pFolder.exists()) {
			pFolder.copyTo(templatesFolder);
		    }
		}
	    } else if (type.equals("component")) {
		if (componentsFolder.exists()) {
		    com.wavemaker.tools.io.Resource componentFile;
		    System.out.println("VALUE: " + value);
		    if (value.indexOf(".js") != -1) {
			componentFile = componentsFolder.getFile(value);
		    } else {
			componentFile = componentsFolder.getFolder(value);
		    }
		    System.out.println(componentFile.toString() + " : " + componentFile.exists());
		    if (componentFile.exists()) {
			String s= uploadClientComponent(componentFile);
		    }
		}
	    } else if (type.equals("project")) {
		String originalName = value.substring(0, value.indexOf(":"));
		String newName = value.substring(value.indexOf(":") + 1);
		if (project.exists()) {
		    project = project.getFolder(originalName);
		}
		if (!project.exists()) {		    
		    project = componentStage;
		}
		if (project.exists() && project.getFile("webapproot/index.html").exists()) {
		    Folder destFolder = projectFolder.getFolder(newName);
		    destFolder.createIfMissing();
		    project.copyContentsTo(destFolder);
		    response = destFolder.getName();
		    if (!newName.equals(originalName)) {
			updateProjectFilesToMatchName(destFolder, originalName, newName);
		    }

		}
	    }
	}

	componentStage.delete();
        return response;
    }
    public String exportMultiFile(String zipFileName, boolean buildProject, boolean buildProjectTemplate, String templateJson, String[] themeList, String[] componentList ) throws IOException {
	return deploymentManager.exportMultiFile(zipFileName, buildProject, buildProjectTemplate, templateJson, themeList, componentList);
    }

    public DownloadResponse downloadClientComponent(String file) {
	Folder common = this.fileSystem.getCommonFolder();
	Folder packages = common.getFolder("packages");
	Folder componentFolder = packages.getFolder(file);
	Folder tmpMainFolder = this.fileSystem.getWaveMakerHomeFolder().getFolder("tmp");
	Folder tmpFolder = tmpMainFolder.getFolder("tmp" + new java.util.Date().getTime());	
	tmpFolder.createIfMissing();
	Folder components = tmpFolder.getFolder("components");
	components.createIfMissing();
	componentFolder.copyTo(components);

        InputStream inputStream = ZipArchive.compress(tmpFolder.find().files());


	int startIndex = 0;
	int lastIndex = file.length();
	if (file.indexOf("/") != -1) {
	    startIndex = file.lastIndexOf("/") + 1;
	} else if (file.indexOf("\\") != -1) {
	    startIndex = file.lastIndexOf("\\") + 1;
	} 
	System.out.println("FILE:" + file + ", START: " + startIndex + ", END: " + lastIndex);
	String fileName = file.substring(startIndex,lastIndex) + ".zip";
	
	com.wavemaker.tools.io.File exportFile = tmpMainFolder.getFile(fileName);
        exportFile.getContent().write(inputStream);
	//	tmpFolder.delete();
	return getAsDownloadResponse(exportFile);
    }

    public String uploadClientComponent(com.wavemaker.tools.io.Resource componentResource) throws IOException {
	String packageName = null;
	if (componentResource instanceof com.wavemaker.tools.io.File) {
	    com.wavemaker.tools.io.File f = (com.wavemaker.tools.io.File)componentResource;
	    packageName = getClientComponentPackageString(f);
	    if (packageName == null) throw new IOException("dojo.provide line missing in " + componentResource.toString());
	} else {
	    com.wavemaker.tools.io.Folder f = (com.wavemaker.tools.io.Folder)componentResource;
	    com.wavemaker.tools.io.File afile = f.getFile(componentResource.getName() + ".js");
	    if (afile.exists()) {
		packageName = getClientComponentPackageString(afile);
		if (packageName == null) throw new IOException("dojo.provide line missing in " + afile.toString());
	    }
	}
	System.out.println("PACKAGE NAME: " + packageName);
	if (packageName == null) throw new IOException("Could not find javascript file for " + componentResource.toString());
	String className = packageName.substring(packageName.lastIndexOf(".") + 1);
        String packageStr = packageName.substring(0, packageName.lastIndexOf("." + className));

        Folder componentFolder = this.fileSystem.getWaveMakerHomeFolder().getFolder(StringUtils.packageToSrcFilePath(packageStr));
        componentFolder.createIfMissing();
	componentFolder.list().delete(); // delete older version of the composite
	if (componentResource instanceof com.wavemaker.tools.io.File) {
	    componentResource.copyTo(componentFolder);
	} else {
	    com.wavemaker.tools.io.Folder f = (com.wavemaker.tools.io.Folder)componentResource;
	    f.copyContentsTo(componentFolder);
	}
	this.deploymentManager.writeModuleToLibJs(packageStr + "." + className);
	return packageStr + "." + className;
    }

    private void updateProjectFilesToMatchName(com.wavemaker.tools.io.Folder projectFolder, String originalName, String newName) {
	// Correction 1: Rename the js file
	System.out.println("Project:" + this.fileSystem.getWaveMakerHomeFolder().getFolder("projects").getFolder(projectFolder.getName()).toString());
	com.wavemaker.tools.project.Project finalProject = new com.wavemaker.tools.project.Project(projectFolder, projectFolder.getName());
	com.wavemaker.tools.io.File jsFile = finalProject.getWebAppRootFolder().getFile(originalName + ".js");
	com.wavemaker.tools.io.File newJsFile = finalProject.getWebAppRootFolder().getFile(newName + ".js");

	jsFile.rename(newJsFile.getName());

                // Correction 2: Change the class name in the js file
                com.wavemaker.tools.project.ResourceManager.ReplaceTextInProjectFile(finalProject, newJsFile, originalName, newName);

                // Corection3: Change the constructor in index.html
                com.wavemaker.tools.io.File index_html = finalProject.getWebAppRootFolder().getFile("index.html");
                com.wavemaker.tools.project.ResourceManager.ReplaceTextInProjectFile(finalProject, index_html, "new " + originalName
                    + "\\(\\{domNode", "new " + newName + "({domNode");

                // Correction 4: Change the pointer to the js script read in by
                // index.html
                com.wavemaker.tools.project.ResourceManager.ReplaceTextInProjectFile(finalProject, index_html, "\\\"" + originalName
                    + "\\.js\\\"", '"' + newName + ".js\"");

                // Correction 5: Change the title
                com.wavemaker.tools.project.ResourceManager.ReplaceTextInProjectFile(finalProject, index_html, "\\<title\\>" + originalName
                    + "\\<\\/title\\>", "<title>" + newName + "</title>");

    }

    public FileUploadResponse uploadClientComponent(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();
        String className = fileName.substring(0, fileName.lastIndexOf(".zip"));
        FileUploadResponse ret = new FileUploadResponse();
        Folder componentStage = this.fileSystem.getWaveMakerHomeFolder().getFolder("common/packages").getFolder(CLIENT_COMPONENTS_STAGE);
        ZipArchive.unpack(file.getInputStream(), componentStage);
        com.wavemaker.tools.io.Folder unzipfolder = componentStage.getFolder(className);
	com.wavemaker.tools.io.File jsFile = null;
	Folder zipFolder = unzipfolder;
	if (!unzipfolder.exists()) {
	    com.wavemaker.tools.io.Resources<com.wavemaker.tools.io.Folder> folders  = componentStage.list().folders();

	    for (com.wavemaker.tools.io.Folder f : folders) {
		String name = f.getName();
		com.wavemaker.tools.io.File afile = f.getFile(name + ".js");
		    System.out.println("TEST " + afile.getName());
		if (afile.exists() && getClientComponentPackageString(afile) != null) {
		    jsFile = afile;
		    zipFolder = f;
		    System.out.println("FOUND " + afile.getName() + " | " + getClientComponentPackageString(afile));
		    break;
		}
	    }
	}



        //com.wavemaker.tools.io.File jsFile = componentStage.getFolder(className + "/" + className + ".js");
	if (jsFile == null || !jsFile.exists()){
	    componentStage.delete();
	    throw new IOException(jsFile.toString() + " not found");
	}
        String str = getClientComponentPackageString(jsFile);
	if (str == null) throw new IOException("dojo.provide line missing in " + jsFile.toString());
	className = str.substring(str.lastIndexOf(".") + 1);
        String packageStr = str.substring(0, str.lastIndexOf("." + className));

        Folder componentFolder = this.fileSystem.getWaveMakerHomeFolder().getFolder(StringUtils.packageToSrcFilePath(packageStr));
        componentFolder.createIfMissing();
	componentFolder.list().delete(); // delete older version of the composite
	System.out.println("ZIP FOLDER: " + zipFolder.toString());
	//Folder zipFolder = componentStage.getFolder(className);
	zipFolder.copyContentsTo(componentFolder);
	this.deploymentManager.writeModuleToLibJs(packageStr + "." + className);
	componentStage.delete();
        ret.setPath(packageStr + "." + className);

        return ret;
    }

    public String copyComponentServices(String path) {
	Folder componentFolder = this.fileSystem.getWaveMakerHomeFolder().getFolder("common/packages").getFolder(path);
	com.wavemaker.tools.io.Folder componentServicesFolder = componentFolder.getFolder("services");
	com.wavemaker.tools.io.Folder projectServicesFolder = this.serviceDeploymentManager.getProjectManager().getCurrentProject().getRootFolder().getFolder("services");
	String responseInclude = "";
	String responseExclude = "";
	if (componentServicesFolder.exists()) {
	    com.wavemaker.tools.io.Resources<com.wavemaker.tools.io.Folder> componentServiceFolders =  componentServicesFolder.list().folders();
	    for (com.wavemaker.tools.io.Folder f : componentServiceFolders) {
		String name = f.getName();
		com.wavemaker.tools.io.Folder projectServiceFolder = projectServicesFolder.getFolder(name);
		if (!projectServiceFolder.exists()) {
		    projectServiceFolder.createIfMissing();
		    f.copyContentsTo(projectServiceFolder);
		    if (responseInclude.equals("") == false) responseInclude += ", ";
		    responseInclude += "'" + name + "'";
		} else {
		    if (responseExclude.equals("") == false) responseExclude += ", ";
		    responseExclude += "'" + name + "'";
		}
	    }
	}

	com.wavemaker.tools.io.Resources<com.wavemaker.tools.io.File> jarfiles = componentFolder.list().files().include(FilterOn.names().ending(".jar"));
	com.wavemaker.tools.io.Folder projectFolder = this.serviceDeploymentManager.getProjectManager().getCurrentProject().getRootFolder();
	com.wavemaker.tools.io.Folder libFolder = projectFolder.getFolder("lib");
	for (com.wavemaker.tools.io.File f : jarfiles) {
	    com.wavemaker.tools.io.File destfile = libFolder.getFile(f.getName());
	    if (!destfile.exists()) {
		f.copyTo(libFolder);
	    }
	}

	return "{servicesAdded: [" + responseInclude + "], servicesSkipped: [" + responseExclude + "]}";
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

    @HideFromClient
    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    private static String getClientComponentPackageString(com.wavemaker.tools.io.File file)
    {
        String rtn;

        String str = file.getContent().asString();
        Pattern p = Pattern.compile("\\s*dojo\\.provide\\s*\\(\\s*\"");
        Matcher m = p.matcher(str);
        if (m.find()) {
            str = str.substring(m.end());
        } else {
            return null;
        }

        p = Pattern.compile("\"");
        m = p.matcher(str);
        if (m.find()) {
            rtn = str.substring(0, m.end()-1);
        } else {
            return null;
        }
        return rtn;
    }
}
