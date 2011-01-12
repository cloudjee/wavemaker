/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.project;

import java.io.*;

import java.util.*;

import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.servlet.http.HttpSession;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.CommonConstants;

import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.StringUtils;

import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.data.util.DataServiceConstants;

import com.wavemaker.runtime.server.ServerConstants;

import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.data.DataModelManager;

import org.apache.commons.io.FileUtils;
import org.json.JSONObject;

/**
 * Manages projects; list of all available projects, and keeps track of any
 * open projects.  Normally this should be session-scoped.
 *
 * @author small
 * @version $Rev: 30678 $ - $Date: 2010-12-02 19:40:52 -0800 (Thu, 02 Dec 2010) $
 *
 */
public class ProjectManager {

    public static final String OPEN_PROJECT_SESSION_NAME = "agOpenProjectName";

    public static final String _TEMPLATE_APP_RESOURCE_NAME = "com/wavemaker/tools/project/templateapp.zip";
    private static final int _UNZIP_BLOCK_SIZE = 4096;
    
    private final List<String> projectCopyExclusions;
    
    public ProjectManager() {
        projectCopyExclusions = new ArrayList<String>(IOUtils.DEFAULT_EXCLUSION);
        projectCopyExclusions.add(DeploymentManager.EXPORT_DIR_DEFAULT);
        projectCopyExclusions.add(DeploymentManager.DIST_DIR_DEFAULT);
    }
    
    public File getTmpDir() {
    	try {
    	 File tmpDir = new File(getBaseProjectDir().getParentFile(), "common");        
         if (!tmpDir.exists()) tmpDir.mkdir();
         if (getCurrentUsername() != null) {
         	tmpDir = new File(tmpDir, getCurrentUsername());
         	if (!tmpDir.exists()) tmpDir.mkdir();
         }
         tmpDir = new File(tmpDir, "tmp");
         if (!tmpDir.exists()) tmpDir.mkdir();
        return tmpDir;
    	}catch(Exception e) {
    		return (File)null;
    	}
    }

    /**
     * Open a new project, insert it into the session as the current project.
     *
     * @param projectName
     * @throws IOException
     */
    public void openProject(String projectName) throws IOException {
        openProject(projectName, false);
    }

    /**
     * Open a new project; if noSession is false, insert it into the session as
     * the current project.
     *
     * @param projectName
     *                The name of the project (this should already be a project
     *                in the default project directory).
     * @param noSession
     *                if this is true, don't insert the project into the current
     *                session
     */
    public void openProject(String projectName, boolean noSession)
            throws IOException {
        File f = getProjectDir(projectName, false);

        // check the path
        if (!f.exists()) {
            throw new WMRuntimeException(Resource.PROJECT_DNE, projectName, f);
        }
        if (!f.isDirectory()) {
            throw new WMRuntimeException(Resource.UTIL_FILEUTILS_PATHNOTDIR, f);
        }

        // create and open
        Project ret = new Project(f);

        if (null!=currentProject) {
            closeProject();
        }
        if (null!=getProjectEventNotifier()) {
            getProjectEventNotifier().executeOpenProject(currentProject);
        }

        setCurrentProject(ret);
        if (!noSession) {
            RuntimeAccess.getInstance().getSession().setAttribute(
                    OPEN_PROJECT_SESSION_NAME, projectName);
            RuntimeAccess.getInstance().getSession().setAttribute(
                    DataServiceConstants.CURRENT_PROJECT_MANAGER, this);
            RuntimeAccess.getInstance().getSession().setAttribute(
                    DataServiceConstants.CURRENT_PROJECT_NAME, projectName);
            RuntimeAccess.getInstance().getSession().setAttribute(
                    DataServiceConstants.CURRENT_PROJECT_APP_ROOT, ret.getWebAppRoot().getAbsolutePath());
        }

        String appPropPath = ret.getWebAppRoot().getAbsolutePath() + "/WEB-INF/classes/" + CommonConstants.APP_PROPERTY_FILE;
        FileInputStream is = null;       
        boolean fileExists = true;

        int defTenantID = DataServiceConstants.DEFAULT_TENANT_ID;
        String tenantFieldName = DataServiceConstants.DEFAULT_TENANT_FIELD;
        String tenantColumnName = "";

        try {
            is = new FileInputStream(appPropPath);
        } catch (FileNotFoundException ne) {
            fileExists = false;
        }

        if (fileExists) {
            Properties props;

            props = new Properties();
            props.load(is);

            tenantFieldName = props.getProperty(DataServiceConstants.TENANT_FIELD_PROPERTY_NAME);
            defTenantID = Integer.parseInt(props.getProperty(DataServiceConstants.DEFAULT_TENANT_ID_PROPERTY_NAME));
            tenantColumnName = props.getProperty(DataServiceConstants.TENANT_FIELD_PROPERTY_NAME);
        }

        WMAppContext wmApp = WMAppContext.getInstance();
        if (wmApp != null) {
            wmApp.setTenantInfoForProj(projectName, tenantFieldName, defTenantID, tenantColumnName);
        }

        //Store types.js contents in the memory //xxx
        String typesPath = ret.getWebAppRoot().getAbsolutePath() + "/types.js";
        try {
            is = new FileInputStream(typesPath);

            String s = IOUtils.convertStreamToString(is);
            JSONObject typesObj = new JSONObject(s.substring(11));
            if (wmApp != null) {
                wmApp.setTypesObject(typesObj);
            }
        }  catch (FileNotFoundException ex) {
        }  catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    /**
     * Creates a new project in the default path (from studioConfiguration).
     *
     * @param projectName
     * @throws IOException
     */
    public void newProject(String projectName) throws IOException {

        newProject(studioConfiguration.getProjectsDir().getAbsolutePath(),
                projectName, false);
    }

    /**
     * Creates a new project in the default path (from studioConfiguration).
     *
     * @param projectName
     * @throws IOException
     */
    public void newProject(String projectName, boolean noTemplate)
            throws IOException {

        newProject(studioConfiguration.getProjectsDir().getAbsolutePath(),
                projectName, noTemplate);
    }

    /**
     * Create a new project in the specified path. A new directory containing
     * the project will be created in path/projectName.
     *
     * @param projectName
     *                The name of the project to create.
     * @param path
     *                The path to create the new project in; this must be a
     *                directory, and it must exist.
     * @param noTemplate
     *                If this is true, do not use the template.
     * @throws IOException
     */
    private void newProject(String path, String projectName, boolean noTemplate)
            throws IOException {

        checkNewProject(projectName);

        File f = new File(path);
        File projectFile = new File(f, projectName);
        if (!projectFile.exists()) {
            if (noTemplate) {
                projectFile.mkdir();
            } else {
                createProjectFromTemplate(projectFile);
            }
        } else if (projectFile.exists() && !projectFile.isDirectory()) {
            throw new WMRuntimeException(Resource.UTIL_FILEUTILS_PATHNOTDIR,
                    projectFile);
        }

        openProject(projectName);
        
        getCurrentProject().setProjectVersion(
                getUpgradeManager().getCurrentVersion());
    }

    /**
     * Copy a project.  Both source and destination must be in the default
     * project directory.
     *
     * @param sourceProjectName The source project; this must exist.
     * @param destinationProjectName The destination project; this must not exist.
     * @throws IOException
     */
    public void copyProject(String sourceProjectName,
            String destinationProjectName) throws IOException {

        File sourceProject = getProjectDir(sourceProjectName, false);
        File destProject = getProjectDir(destinationProjectName, true);

        if (!sourceProject.exists()) {
            throw new WMRuntimeException(Resource.PROJECTCOPY_SOURCE_DNE,
                    sourceProjectName);
        }
        if (destProject.exists()) {
            throw new WMRuntimeException(Resource.PROJECTCOPY_DEST_DE,
                    sourceProjectName);
        }

        IOUtils.copy(sourceProject, destProject, projectCopyExclusions);

        // delete the deployment xml
        File tomcatXml = new File(destProject, sourceProjectName+".xml");
        if (tomcatXml.exists()) {
            tomcatXml.delete();
        }
        // update the projectname.js file
        String shortSourceName = sourceProjectName.substring(getUserProjectPrefix().length());
        String shortDestName = destinationProjectName.substring(getUserProjectPrefix().length());

        String serviceStr = "\"service\":\"" + shortSourceName + "\"";
        String dummyStr = "nothingicandoifyouwanttoscrewup";

        File sourceJS = new File(destProject, ProjectConstants.WEB_DIR+"/"+
                shortSourceName+".js");

        if (sourceJS.exists()) {
            File destJS = new File(destProject, ProjectConstants.WEB_DIR+"/"+
				   shortDestName+".js");
            String sourceJSStr = FileUtils.readFileToString(sourceJS,
                    ServerConstants.DEFAULT_ENCODING);
            sourceJSStr = sourceJSStr.replace(serviceStr, dummyStr);
            String destJSStr = sourceJSStr.replace("\""+shortSourceName+"\"",
                    "\""+shortDestName+"\"");
	    destJSStr = destJSStr.replace(shortSourceName+".extend(",
						   shortDestName+".extend(");
            destJSStr = destJSStr.replace(dummyStr, serviceStr);
            FileUtils.writeStringToFile(destJS, destJSStr,
                    ServerConstants.DEFAULT_ENCODING);
            sourceJS.delete();
        }

        // update the index.html
        File indexHtml = new File(destProject,
                ProjectConstants.WEB_DIR+"/"+ProjectConstants.INDEX_HTML);
        if (indexHtml.exists()) {
            String indexHtmlStr = FileUtils.readFileToString(indexHtml,
                    ServerConstants.DEFAULT_ENCODING);
            indexHtmlStr = indexHtmlStr.replace(": "+shortSourceName+"<",
                    ": "+shortDestName+"<");
            indexHtmlStr = indexHtmlStr.replace(">"+shortSourceName+"<",
                    ">"+shortDestName+"<");
            indexHtmlStr = indexHtmlStr.replace("- "+shortSourceName+" -",
                    "- "+shortDestName+" -");
            indexHtmlStr = indexHtmlStr.replace("\""+shortSourceName+".js\"",
                    "\""+shortDestName+".js\"");
            indexHtmlStr = indexHtmlStr.replace("new "+shortSourceName+"(",
                    "new "+shortDestName+"(");
            FileUtils.writeStringToFile(indexHtml, indexHtmlStr,
                    ServerConstants.DEFAULT_ENCODING);
        }
    }

    /**
     * Get the project directory (looking in both the agHome and demo
     * directories).  If no existing project exists, returns the directory in
     * agHome.
     * @param projectName
     * @param ignoreDemos When true, ignore projects in the demo directory.
     * @return
     * @throws FileAccessException
     */
    public File getProjectDir(String projectName, boolean ignoreDemos) throws FileAccessException {

        File ret = new File(getBaseProjectDir(), projectName);
        if (!ret.exists() && null!=studioConfiguration.getDemoDir()) {
            File demoRet = new File(studioConfiguration.getDemoDir(),
                    projectName);
            if (demoRet.exists()) {
                ret = demoRet;
            }
        }

        return ret;
    }
    
    public File getBaseProjectDir() throws FileAccessException {
        File ret = new File(studioConfiguration.getProjectsDir().toString());
        return ret;
    }

    private void createProjectFromTemplate(File projectFile) throws IOException {

        // Explode resource into project dir.
        InputStream resourceStream = this.getClass().getClassLoader().
                getResourceAsStream(_TEMPLATE_APP_RESOURCE_NAME);
        ZipInputStream resourceZipStream = new ZipInputStream(resourceStream);
        ZipEntry zipEntry = null;
        byte[] data = new byte[_UNZIP_BLOCK_SIZE];
        while ((zipEntry = resourceZipStream.getNextEntry()) != null) {
            if (zipEntry.isDirectory()) {
                File d = new File(projectFile, zipEntry.getName());
                d.mkdirs();
            } else {
                File zipEntryFile = new File(projectFile, zipEntry.getName());
                FileOutputStream fos = new FileOutputStream(zipEntryFile);
                BufferedOutputStream bos = new BufferedOutputStream(fos, _UNZIP_BLOCK_SIZE);
                int byteCount = 0;
                while ((byteCount = resourceZipStream.read(data, 0, _UNZIP_BLOCK_SIZE)) != -1) {
                    bos.write(data, 0, byteCount);
                }
                bos.flush();
                bos.close();
            }
        }
        resourceZipStream.close();

        // DeploymentManager deploymentManager = new DeploymentManager();
        // XXX Need to modify files in place
        // At a minimum the application name needs to be set
    }

    /**
     * Delete a project with the specified name.  This does not close the
     * project; it is recommended that the project be closed first.
     *
     * @param projectName
     *                The project to delete.
     * @throws IOException
     */
    public void deleteProject(String projectName) throws IOException {

        File projectDir = getProjectDir(projectName, false);
        if (projectDir.exists() && projectDir.isDirectory()) {
            FileUtils.forceDelete(projectDir);
        }

        File logFolder = new File(System.getProperty("catalina.home") + "/logs/ProjectLogs", projectName);
        //System.out.println("DELETE LOG: " + logFolder.toString());
        if (logFolder.exists() && logFolder.isDirectory()) {
            FileUtils.forceDelete(logFolder);
        }
    }

    /**
     * Close the current project (cleanup any resources associated with it).
     *
     * @throws IOException
     */
    public void closeProject() throws IOException {

        RuntimeAccess.getInstance().getSession().removeAttribute(
                OPEN_PROJECT_SESSION_NAME);

        if (null==currentProject) {
            return;
        }

        if (null!=getProjectEventNotifier()) {
            getProjectEventNotifier().executeCloseProject(currentProject);
        }

        currentProject = null;
    }

    /**
     * List all current projects.
     *
     * @return The list of all current projects.
     * @throws FileAccessException
     */
    public SortedSet<String> listProjects(String prefixIn) throws FileAccessException {
        final String prefix = prefixIn;
        SortedSet<String> ret = new TreeSet<String>();

        File projectsDir = studioConfiguration.getProjectsDir();
        File temp;
        if (null!=projectsDir && projectsDir.exists()) {
            for (String possibleProject: projectsDir.list(new java.io.FilenameFilter() {
			public boolean accept(File dir, String name) {
			      return name.startsWith(prefix);
		        }
		   })
		) {
                if (!checkProjectName(possibleProject)) {
                    continue;
                }

                temp = new File(projectsDir, possibleProject);
                if (temp.isDirectory()) {
                    ret.add(possibleProject);
                }
            }
        }

        File demoDir = studioConfiguration.getDemoDir();
        if (null!=demoDir && demoDir.exists()) {
            for (String possibleProject: demoDir.list()) {
                if (possibleProject.startsWith(".")) {
                    continue;
                }

                temp = new File(demoDir, possibleProject);
                if (temp.isDirectory()) {
                    ret.add(possibleProject);
                }
            }
        }

        return ret;
    }


    /**
     * Make some checks on the project name.  Throws an WMRuntimeException if
     * it's bad.
     *
     * @param projectName
     */
    public void checkNewProject(String projectName) {

        if (null != studioConfiguration.getDemoDir()) {
            File demoProject = new File(studioConfiguration.getDemoDir(),
                    projectName);
            if (demoProject.exists() && demoProject.isDirectory()) {
                throw new WMRuntimeException(Resource.PROJECT_CONFLICT,
                        projectName);
            }
        }

        if (!checkProjectName(projectName)) {
            throw new WMRuntimeException(Resource.PROJECT_INVALID_NAME,
                    projectName);
        }
    }

    /**
     * Return true iff the projectName is valid.
     */
    protected boolean checkProjectName(String projectName) {

        if (projectName.startsWith(".") || projectName.contains(" ")) {
            return false;
        }

        return true;
    }

    // spring-managed bean properties
    private StudioConfiguration studioConfiguration;
    private ProjectEventNotifier projectEventNotifier;
    private UpgradeManager upgradeManager;

    public StudioConfiguration getStudioConfiguration() {
        return studioConfiguration;
    }
    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }

    public ProjectEventNotifier getProjectEventNotifier() {
        return projectEventNotifier;
    }
    public void setProjectEventNotifier(ProjectEventNotifier projectEventNotifier) {
        this.projectEventNotifier = projectEventNotifier;
    }

    public UpgradeManager getUpgradeManager() {
        return upgradeManager;
    }
    public void setUpgradeManager(UpgradeManager upgradeManager) {
        this.upgradeManager = upgradeManager;
    }
    
    public String getUserProjectPrefix() {
	  String s = getCurrentUsername();
	  if (s == null) return "";
	  else return s + "___";
    }
    public String getCurrentUsername() {        

	/*
	com.wavemaker.runtime.security.SecurityService securityService = (com.wavemaker.runtime.security.SecurityService) RuntimeAccess.getInstance().getService("securityService");
	String username = securityService.getUserName();
	*/
	try {
	    org.acegisecurity.Authentication authentication = org.acegisecurity.context.SecurityContextHolder.getContext().getAuthentication();
	    String username = authentication.getName();
	    username = username.replaceAll("_","__"); // insures that users can't type in mkantor_AT_wavemaker.com; because that gets turned into mkantor__AT__wavemaker.com
	    username = username.replaceAll("\\.", "_DOT_");
	    username = username.replaceAll("@", "_AT_");
	    return username;
	} catch(Exception e) {
	    return null;
	}
    }

    // other bean-style properties
    /**
     * Open/close project event notifications must be sent around this.
     */
    private Project currentProject;    
    
    // Note if you change this, you may have to change how JavaServiceSuperClass looks up the project folder
    public Project getCurrentProject() {
        if (null == currentProject) {
            HttpSession sess = RuntimeAccess.getInstance().getSession();
            String sessionProjectName = (String) sess.getAttribute(
                    OPEN_PROJECT_SESSION_NAME);
            if (null != sessionProjectName) {
                try {
                    openProject(sessionProjectName);
                } catch (IOException e) {
                    throw new WMRuntimeException(e);
                }
            }
        }
        
        // if we still have no project, error
        if (null==currentProject) {
            throw new WMRuntimeException(Resource.NO_PROJECT_FROM_SESSION);
        }

        return currentProject;
    }
    private void setCurrentProject(Project currentProject) {
        this.currentProject = currentProject;
    }
}
