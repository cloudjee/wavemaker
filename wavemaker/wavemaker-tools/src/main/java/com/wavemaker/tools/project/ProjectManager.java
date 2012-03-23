/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.util.StringUtils;

import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.project.upgrade.UpgradeManager;
import com.wavemaker.tools.util.NoCloseInputStream;

/**
 * Manages projects; list of all available projects, and keeps track of any open projects. Normally this should be
 * session-scoped.
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class ProjectManager {

    public static final String OPEN_PROJECT_SESSION_NAME = "agOpenProjectName";

    public static final String _TEMPLATE_APP_RESOURCE_NAME = "com/wavemaker/tools/project/templateapp.zip";

    private final List<String> projectCopyExclusions;

    private StudioFileSystem fileSystem;

    private ProjectEventNotifier projectEventNotifier;

    private UpgradeManager upgradeManager;

    public ProjectManager() {
        this.projectCopyExclusions = new ArrayList<String>(IOUtils.DEFAULT_EXCLUSION);
        this.projectCopyExclusions.add(AbstractDeploymentManager.EXPORT_DIR_DEFAULT);
        this.projectCopyExclusions.add(LocalDeploymentManager.DIST_DIR_DEFAULT);
    }

    // FIXME PW filesystem find a better way then remove the username method
    @Deprecated
    public Resource getTmpDir() {
        try {
            Resource tmpDir = this.fileSystem.getCommonDir();
            if (getCurrentUsername() != null) {
                tmpDir = this.fileSystem.createPath(tmpDir, getCurrentUsername() + "/");
            }
            tmpDir = this.fileSystem.createPath(tmpDir, "tmp/");
            return tmpDir;
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Deprecated
    private String getCurrentUsername() {
        try {
            org.acegisecurity.Authentication authentication = org.acegisecurity.context.SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            username = username.replaceAll("_", "__"); // insures that users
                                                       // can't type in
                                                       // mkantor_AT_wavemaker.com;
                                                       // because that gets
                                                       // turned into
                                                       // mkantor__AT__wavemaker.com
            username = username.replaceAll("\\.", "_DOT_");
            username = username.replaceAll("@", "_AT_");
            return username;
        } catch (Exception e) {
            return null;
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
     * Open a new project; if noSession is false, insert it into the session as the current project.
     * 
     * @param projectName The name of the project (this should already be a project in the default project directory).
     * @param noSession if this is true, don't insert the project into the current session
     */
    public void openProject(String projectName, boolean noSession) throws IOException {
        Resource projectDir = getProjectDir(projectName, false);
        openProject(projectDir, noSession);
    }

    /**
     * Open a new project; if noSession is false, insert it into the session as the current project.
     * 
     * @param projectName The name of the project (this should already be a project in the default project directory).
     * @param noSession if this is true, don't insert the project into the current session
     */
    @Deprecated
    public void openProject(Resource projectDir, boolean noSession) throws IOException {
        String projectName = projectDir.getFilename();
        if (!projectDir.exists()) {
            throw new WMRuntimeException(MessageResource.PROJECT_DNE, projectName, projectDir);
        }
        if (StringUtils.getFilenameExtension(projectDir.getFilename()) != null) {
            throw new WMRuntimeException(MessageResource.UTIL_FILEUTILS_PATHNOTDIR, projectDir);
        }
        Project project = new Project(projectDir, this.fileSystem);

        openProject(project, noSession);
    }

    // FIXME broken until Project can be fixed
    public void openProject(Folder projectFolder, boolean noSession) throws IOException {
        String projectName = projectFolder.getName();
        if (!projectFolder.exists()) {
            throw new WMRuntimeException(MessageResource.PROJECT_DNE, projectName, projectFolder);
        }
        Project project = new Project(projectFolder, this.fileSystem);
        openProject(project, noSession);
    }

    private void openProject(Project project, boolean noSession) throws IOException {
        closeProject();
        if (getProjectEventNotifier() != null) {
            getProjectEventNotifier().executeOpenProject(this.currentProject);
        }
        setCurrentProject(project);
        if (!noSession) {
            RuntimeAccess.getInstance().getSession().setAttribute(OPEN_PROJECT_SESSION_NAME, project.getProjectName());
            RuntimeAccess.getInstance().getSession().setAttribute(DataServiceConstants.CURRENT_PROJECT_MANAGER, this);
            RuntimeAccess.getInstance().getSession().setAttribute(DataServiceConstants.CURRENT_PROJECT_NAME, project.getProjectName());
            RuntimeAccess.getInstance().getSession().setAttribute(DataServiceConstants.CURRENT_PROJECT_APP_ROOT,
                project.getWebAppRoot().getURI().toString());
        }

        readProjectTenantInformation(project);
        readProjectTypes(project);
    }

    private void readProjectTenantInformation(Project project) throws IOException {
        File applicationPropertiesFile = project.getWebInfFolder().getFile(CommonConstants.APP_PROPERTY_FILE);
        String tenantFieldName = DataServiceConstants.DEFAULT_TENANT_FIELD;
        int defaultTenantID = DataServiceConstants.DEFAULT_TENANT_ID;
        String tenantColumnName = "";
        if (applicationPropertiesFile.exists()) {
            Properties applicationProperties = new Properties();
            InputStream propsStream = applicationPropertiesFile.getContent().asInputStream();
            try {
                applicationProperties.load(propsStream);
                tenantFieldName = applicationProperties.getProperty(DataServiceConstants.TENANT_FIELD_PROPERTY_NAME);
                defaultTenantID = Integer.parseInt(applicationProperties.getProperty(DataServiceConstants.DEFAULT_TENANT_ID_PROPERTY_NAME));
                tenantColumnName = applicationProperties.getProperty(DataServiceConstants.TENANT_FIELD_PROPERTY_NAME);
            } finally {
                propsStream.close();
            }
        }
        WMAppContext wmApp = WMAppContext.getInstance();
        if (wmApp != null) {
            wmApp.setTenantInfoForProj(project.getProjectName(), tenantFieldName, defaultTenantID, tenantColumnName);
        }
    }

    private void readProjectTypes(Project project) {
        File typesFile = project.getWebAppRootFolder().getFile("/types.js");
        if (typesFile.exists()) {
            String s = typesFile.getContent().asString();
            try {
                JSONObject typesObj = new JSONObject(s.substring(11));
                WMAppContext wmApp = WMAppContext.getInstance();
                if (wmApp != null) {
                    wmApp.setTypesObject(typesObj);
                }
            } catch (JSONException ex) {
                throw new WMRuntimeException(ex);
            }
        }
    }

    /**
     * Create a new project in the specified path. A new directory containing the project will be created in
     * path/projectName.
     * 
     * @param projectName the name of the project to create.
     * @throws IOException
     */
    public void newProject(String projectName) throws IOException {
        checkNewProject(projectName);
        Resource projectDir = this.fileSystem.getProjectsDir().createRelative(projectName + "/");
        if (!projectDir.exists()) {
            this.fileSystem.createPath(this.fileSystem.getProjectsDir(), projectName + "/");
            createProjectFromTemplate(projectDir);
        }
        openProject(projectName);
        Project project = getCurrentProject();
        project.setProjectVersion(getUpgradeManager().getCurrentVersion());
    }

    /**
     * Copy a project. Both source and destination must be in the default project directory.
     * 
     * @param sourceProjectName The source project; this must exist.
     * @param destinationProjectName The destination project; this must not exist.
     * @throws IOException
     */
    public void copyProject(String sourceProjectName, String destinationProjectName) throws IOException {

        Project sourceProject = new Project(getProjectDir(sourceProjectName, false), this.fileSystem);
        Project destProject = new Project(getProjectDir(destinationProjectName, true), this.fileSystem);

        if (!sourceProject.getProjectRoot().exists()) {
            throw new WMRuntimeException(MessageResource.PROJECTCOPY_SOURCE_DNE, sourceProjectName);
        }
        if (destProject.getProjectRoot().exists()) {
            throw new WMRuntimeException(MessageResource.PROJECTCOPY_DEST_DE, sourceProjectName);
        }

        this.fileSystem.copyRecursive(sourceProject.getProjectRoot(), destProject.getProjectRoot(), this.projectCopyExclusions);

        try {
            // delete the deployment xml
            Resource tomcatXml = destProject.getProjectRoot().createRelative(sourceProjectName + ".xml");
            if (tomcatXml.exists()) {
                this.fileSystem.deleteFile(tomcatXml);
            }
            // update the projectname.js file
            String shortSourceName = sourceProjectName;
            String shortDestName = destinationProjectName;

            String serviceStr = "\"service\":\"" + shortSourceName + "\"";
            String dummyStr = "nothingicandoifyouwanttoscrewup";

            Resource sourceJS = destProject.getWebAppRoot().createRelative(shortSourceName + ".js");
            if (sourceJS.exists()) {
                Resource destJS = destProject.getWebAppRoot().createRelative(shortDestName + ".js");
                String sourceJSStr = destProject.readFile(sourceJS);
                sourceJSStr = sourceJSStr.replace(serviceStr, dummyStr);
                String destJSStr = sourceJSStr.replace("\"" + shortSourceName + "\"", "\"" + shortDestName + "\"");
                destJSStr = destJSStr.replace(shortSourceName + ".extend(", shortDestName + ".extend(");
                destJSStr = destJSStr.replace(dummyStr, serviceStr);
                destProject.writeFile(destJS, destJSStr);
                this.fileSystem.deleteFile(sourceJS);
            }

            // update the index.html
            Resource indexHtml = destProject.getWebAppRoot().createRelative(ProjectConstants.INDEX_HTML);
            if (indexHtml.exists()) {
                String indexHtmlStr = destProject.readFile(indexHtml);
                indexHtmlStr = indexHtmlStr.replace(": " + shortSourceName + "<", ": " + shortDestName + "<");
                indexHtmlStr = indexHtmlStr.replace(">" + shortSourceName + "<", ">" + shortDestName + "<");
                indexHtmlStr = indexHtmlStr.replace("- " + shortSourceName + " -", "- " + shortDestName + " -");
                indexHtmlStr = indexHtmlStr.replace("\"" + shortSourceName + ".js\"", "\"" + shortDestName + ".js\"");
                indexHtmlStr = indexHtmlStr.replace("new " + shortSourceName + "(", "new " + shortDestName + "(");
                destProject.writeFile(indexHtml, indexHtmlStr);
            }

        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * Get the project directory (looking in both the agHome and demo directories). If no existing project exists,
     * returns the directory in agHome.
     * 
     * @param projectName
     * @param ignoreDemos When true, ignore projects in the demo directory.
     * @return
     * @throws FileAccessException
     */
    @Deprecated
    public Resource getProjectDir(String projectName, boolean ignoreDemos) {
        try {
            Resource projectDir = getBaseProjectDir().createRelative(projectName + "/");
            if (!projectDir.exists() && !ignoreDemos && this.fileSystem.getDemoDir() != null) {
                Resource demoProjectDir = this.fileSystem.getDemoDir().createRelative(projectName + "/");
                if (demoProjectDir.exists()) {
                    return demoProjectDir;
                }
            }
            if (!projectDir.exists()) {
                this.fileSystem.prepareForWriting(projectDir);
            }
            return projectDir;
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public Project getProject(String projectName, boolean ignoreDemos) {
        return new Project(getProjectDir(projectName, ignoreDemos), this.fileSystem);
    }

    public Resource getBaseProjectDir() throws FileAccessException {
        return this.fileSystem.getProjectsDir();
    }

    private void createProjectFromTemplate(Resource projectFile) throws IOException {
        // Explode resource into project dir.
        InputStream resourceStream = new ClassPathResource(_TEMPLATE_APP_RESOURCE_NAME).getInputStream();
        ZipInputStream resourceZipStream = new ZipInputStream(resourceStream);
        ZipEntry zipEntry = null;
        while ((zipEntry = resourceZipStream.getNextEntry()) != null) {
            if (zipEntry.isDirectory()) {
                this.fileSystem.createPath(projectFile, zipEntry.getName());
            } else {
                this.fileSystem.copyFile(projectFile, new NoCloseInputStream(resourceZipStream), zipEntry.getName());
            }
        }
        resourceZipStream.close();
    }

    /**
     * Delete a project with the specified name. This does not close the project; it is recommended that the project be
     * closed first.
     * 
     * @param projectName The project to delete.
     * @throws IOException
     */
    public void deleteProject(String projectName) throws IOException {

        Resource projectDir = getProjectDir(projectName, false);
        if (projectDir.exists()) {
            this.fileSystem.deleteFile(projectDir);
        }

        if (this.fileSystem instanceof EmbeddedServerConfiguration) {
            Resource logFolder = ((EmbeddedServerConfiguration) this.fileSystem).getProjectLogsFolder().createRelative(projectName);
            if (logFolder.exists()) {
                this.fileSystem.deleteFile(logFolder);
            }
        }
    }

    /**
     * Close the current project (cleanup any resources associated with it).
     * 
     * @throws IOException
     */
    public void closeProject() throws IOException {
        if (this.currentProject == null) {
            return;
        }
        HttpSession session = RuntimeAccess.getInstance().getSession();
        if (session != null) {
            session.removeAttribute(OPEN_PROJECT_SESSION_NAME);
        }
        if (getProjectEventNotifier() != null) {
            getProjectEventNotifier().executeCloseProject(this.currentProject);
        }
        this.currentProject = null;
    }

    /**
     * List all current projects.
     * 
     * @return The list of all current projects.
     * @throws FileAccessException
     */
    public SortedSet<String> listProjects() {
        SortedSet<String> ret = new TreeSet<String>();

        Resource projectsDir = this.fileSystem.getProjectsDir();
        if (projectsDir != null && projectsDir.exists()) {
            for (Resource possibleProject : this.fileSystem.listChildren(projectsDir)) {
                if (!checkProjectName(possibleProject.getFilename())) {
                    continue;
                }
                if (this.fileSystem.listChildren(possibleProject).size() > 0) {
                    ret.add(possibleProject.getFilename());
                }
            }
        }

        Resource demoDir = this.fileSystem.getDemoDir();
        if (demoDir != null && demoDir.exists()) {
            for (Resource possibleProject : this.fileSystem.listChildren(demoDir)) {
                if (possibleProject.getFilename().startsWith(".")) {
                    continue;
                }

                if (this.fileSystem.listChildren(possibleProject).size() > 0) {
                    ret.add(possibleProject.getFilename());
                }
            }
        }

        return ret;
    }

    /**
     * Make some checks on the project name. Throws an WMRuntimeException if it's bad.
     * 
     * @param projectName
     */
    public void checkNewProject(String projectName) {

        if (this.fileSystem.getDemoDir() != null) {
            try {
                Resource demoProject = this.fileSystem.getDemoDir().createRelative(projectName);
                if (demoProject.exists()) {
                    throw new WMRuntimeException(MessageResource.PROJECT_CONFLICT, projectName);
                }
            } catch (IOException ex) {
                throw new WMRuntimeException(ex);
            }
        }

        if (!checkProjectName(projectName)) {
            throw new WMRuntimeException(MessageResource.PROJECT_INVALID_NAME, projectName);
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

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    public ProjectEventNotifier getProjectEventNotifier() {
        return this.projectEventNotifier;
    }

    public void setProjectEventNotifier(ProjectEventNotifier projectEventNotifier) {
        this.projectEventNotifier = projectEventNotifier;
    }

    public UpgradeManager getUpgradeManager() {
        return this.upgradeManager;
    }

    public void setUpgradeManager(UpgradeManager upgradeManager) {
        this.upgradeManager = upgradeManager;
    }

    // other bean-style properties
    /**
     * Open/close project event notifications must be sent around this.
     */
    private Project currentProject;

    // Note if you change this, you may have to change how JavaServiceSuperClass
    // looks up the project folder
    public Project getCurrentProject() {
        if (this.currentProject == null) {
            HttpSession sess = RuntimeAccess.getInstance().getSession();
            String sessionProjectName = (String) sess.getAttribute(OPEN_PROJECT_SESSION_NAME);
            if (sessionProjectName != null) {
                try {
                    openProject(sessionProjectName);
                } catch (IOException e) {
                    throw new WMRuntimeException(e);
                }
            }
        }

        // if we still have no project, error
        if (this.currentProject == null) {
            throw new WMRuntimeException(MessageResource.NO_PROJECT_FROM_SESSION);
        }

        return this.currentProject;
    }

    private void setCurrentProject(Project currentProject) {
        this.currentProject = currentProject;
    }

    public StudioFileSystem getFileSystem() {
        return this.fileSystem;
    }
}
