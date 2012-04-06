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

package com.wavemaker.tools.project;

import java.io.IOException;
import java.util.List;
import java.util.SortedSet;
import java.util.TreeSet;

import org.springframework.core.io.Resource;
import org.springframework.util.StringUtils;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.tools.io.Folder;

/**
 * Manages pages.
 * 
 * @author Matt Small
 */
public class PagesManager {

    public static final String PAGE_CSS = "css";

    public static final String PAGE_HTML = "html";

    public static final String PAGE_WIDGETS = "widgets.js";

    public static final String PAGE_JS = "js";

    private ProjectManager projectManager;

    private StudioFileSystem fileSystem;

    /**
     * List all pages in the current project.
     * 
     * @return
     * @throws FileAccessException
     */
    public SortedSet<String> listPages() throws FileAccessException {
        return listPages(getProjectManager().getCurrentProject().getProjectName());
    }

    /**
     * Return a list of all pages in the specified project.
     * 
     * @param projectName
     * @return
     * @throws FileAccessException
     */
    public SortedSet<String> listPages(String projectName) throws FileAccessException {

        SortedSet<String> ret = new TreeSet<String>();

        Resource pagesDir = getPagesDir(projectName);

        List<Resource> children = this.fileSystem.listChildren(pagesDir);
        if (children != null) {
            for (Resource child : children) {
                if (StringUtils.getFilenameExtension(child.getFilename()) == null && !IOUtils.DEFAULT_EXCLUSION.contains(child.getFilename())) {
                    ret.add(child.getFilename());
                }
            }
        }

        return ret;
    }

    /**
     * Delete a page.
     * 
     * @param pageName The pane to delete.
     * @throws IOException
     */
    public void deletePage(String pageName) throws IOException {

        Resource removePage = getPageDir(this.projectManager.getCurrentProject().getProjectName(), pageName);
        if (removePage.exists()) {
            this.fileSystem.deleteFile(removePage);
        }
    }

    /**
     * Copy a page from a project to the current project. A page with that name must not already exist in the current
     * project.
     * 
     * @param sourceProjectName The project to copy from.
     * @param sourcePaneName The name of the page to copy.
     * @param destPageName The name of the page in the destination project to copy to.
     * @throws IOException
     */
    public void copyPage(String sourceProjectName, String sourcePaneName, String destPageName) throws IOException {

        copyPage(sourceProjectName, sourcePaneName, getProjectManager().getCurrentProject().getProjectName(), destPageName);
    }

    /**
     * Copy a page between two arbitrary projects; allows for a rename to occur, as well.
     * 
     * @param sourceProjectName The project to copy from.
     * @param pageName The name of the page to copy.
     * @throws IOException
     */
    public void copyPage(String sourceProjectName, String sourcePageName, String destProjectName, String destPageName) throws IOException {

        Resource sourcePane = getPageDir(sourceProjectName, sourcePageName);
        if (!sourcePane.exists()) {
            throw new WMRuntimeException(MessageResource.PAGECP_SOURCEDNE, sourcePageName, sourceProjectName);
        }

        Resource destPane = getPageDir(destProjectName, destPageName);
        if (destPane.exists()) {
            throw new WMRuntimeException(MessageResource.PAGECP_TARGET_EXISTS, destPageName, destProjectName);
        }

        Project sourceProject = this.projectManager.getProject(sourceProjectName, false);
        Project destProject = this.projectManager.getProject(destProjectName, false);

        destProject.writeFile(destPane.createRelative(destPageName + "." + PAGE_HTML),
            sourceProject.readFile(sourcePane.createRelative(sourcePageName + "." + PAGE_HTML)));

        String cssContents = sourceProject.readFile(sourcePane.createRelative(sourcePageName + "." + PAGE_CSS));
        cssContents = cssContents.replace("." + sourcePageName, "." + destPageName);
        destProject.writeFile(destPane.createRelative(destPageName + "." + PAGE_CSS), cssContents);

        String jsContents = sourceProject.readFile(sourcePane.createRelative(sourcePageName + "." + PAGE_JS));
        jsContents = jsContents.replaceAll("^dojo.declare\\(\"" + sourcePageName + "\"", "dojo.declare(\"" + destPageName + "\"");
        destProject.writeFile(destPane.createRelative(destPageName + "." + PAGE_JS), jsContents);

        String widgetsContents = sourceProject.readFile(sourcePane.createRelative(sourcePageName + "." + PAGE_WIDGETS));
        widgetsContents = widgetsContents.replaceAll("^" + sourcePageName + ".widgets ", destPageName + ".widgets ");
        destProject.writeFile(destPane.createRelative(destPageName + "." + PAGE_WIDGETS), widgetsContents);
    }

    @Deprecated
    public Resource getPagesDir(String projectName) {
        Project project = this.projectManager.getProject(projectName, false);
        try {
            return project.getWebAppRoot().createRelative(ProjectConstants.PAGES_DIR);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public Folder getPagesFolder(String projectName) {
        return getPagesFolder(this.projectManager.getProject(projectName, false));
    }

    public Folder getPagesFolder(Project project) {
        return project.getWebAppRootFolder().getFolder(ProjectConstants.PAGES_DIR);
    }

    @Deprecated
    public Resource getPageDir(String projectName, String pageName) {
        try {
            return getPagesDir(projectName).createRelative(pageName + "/");
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public Folder getPageFolder(Project project, String pageName) {
        return getPagesFolder(project).getFolder(pageName);
    }

    public Resource getDictionariesDir(String projectName) {
        Project projectRoot = this.projectManager.getProject(projectName, false);
        try {
            return projectRoot.getWebAppRoot().createRelative(ProjectConstants.I18N_DIR);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * List all dictionaries in the current project
     * 
     * @return
     * @throws FileAccessException
     */
    public SortedSet<String> listDictionaries() throws FileAccessException {
        return listDictionaries(getProjectManager().getCurrentProject().getProjectName());
    }

    /**
     * Return a list of all dictionaries in the specified project.
     * 
     * @param projectName
     * @return
     * @throws FileAccessException
     */
    public SortedSet<String> listDictionaries(String projectName) throws FileAccessException {

        SortedSet<String> ret = new TreeSet<String>();

        Resource dictionariesDir = getDictionariesDir(projectName);

        List<Resource> children = this.fileSystem.listChildren(dictionariesDir);
        for (Resource child : children) {
            if (IOUtils.DEFAULT_EXCLUSION.contains(child.getFilename())) {
                ret.add(child.getFilename());
            }
        }

        return ret;
    }

    public ProjectManager getProjectManager() {
        return this.projectManager;
    }

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }
}