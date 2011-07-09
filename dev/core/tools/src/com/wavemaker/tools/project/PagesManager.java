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

package com.wavemaker.tools.project;

import java.io.File;
import java.io.IOException;
import java.util.SortedSet;
import java.util.TreeSet;

import org.apache.commons.io.FileUtils;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.server.ServerConstants;

/**
 * Manages pages.
 * 
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class PagesManager {
    
    public static final String PAGE_CSS = "css";
    public static final String PAGE_HTML = "html";
    public static final String PAGE_WIDGETS = "widgets.js";
    public static final String PAGE_JS = "js";
    
    /**
     * List all pages in the current project.
     * @return
     * @throws FileAccessException
     */
    public SortedSet<String> listPages() throws FileAccessException {
        return listPages(
                getProjectManager().getCurrentProject().getProjectName());
    }
    
    /**
     * Return a list of all pages in the specified project.
     * @param projectName
     * @return
     * @throws FileAccessException
     */
    public SortedSet<String> listPages(String projectName) throws FileAccessException {
        
        SortedSet<String> ret = new TreeSet<String>();
        
        File pagesDir = getPagesDir(projectName);
        
        File[] children = pagesDir.listFiles();
        if (null!=children) {
            for (File child: children) {
                if (child.isDirectory() &&
                        !IOUtils.DEFAULT_EXCLUSION.contains(child.getName())) {
                    ret.add(child.getName());
                }
            }
        }
        
        return ret;
    }
    
    /**
     * Delete a page.
     * 
     * @param pageName
     *                The pane to delete.
     * @throws IOException
     */
    public void deletePage(String pageName) throws IOException {

        File removePage = getPageDir(
                projectManager.getCurrentProject().getProjectName(), pageName);
        if (removePage.exists() && removePage.isDirectory()) {
            FileUtils.forceDelete(removePage);
        }
    }

    /**
     * Copy a page from a project to the current project. A page with that name
     * must not already exist in the current project.
     * 
     * @param sourceProjectName
     *                The project to copy from.
     * @param sourcePaneName
     *                The name of the page to copy.
     * @param destPageName
     *                The name of the page in the destination project to copy
     *                to.
     * @throws IOException
     */
    public void copyPage(String sourceProjectName, String sourcePaneName,
            String destPageName) throws IOException {
        
        copyPage(sourceProjectName, sourcePaneName,
                getProjectManager().getCurrentProject().getProjectName(),
                destPageName);
    }
    
    /**
     * Copy a page between two arbitrary projects; allows for a rename to occur,
     * as well.
     * 
     * @param sourceProjectName
     *                The project to copy from.
     * @param pageName
     *                The name of the page to copy.
     * @throws IOException
     */
    public void copyPage(String sourceProjectName, String sourcePageName,
            String destProjectName, String destPageName)
            throws IOException {
        
        File sourcePane = getPageDir(sourceProjectName, sourcePageName);
        if (!sourcePane.exists() || !sourcePane.isDirectory()) {
            throw new WMRuntimeException(Resource.PAGECP_SOURCEDNE,
                    sourcePageName, sourceProjectName);
        }
        
        File destPane = getPageDir(destProjectName, destPageName);
        if (destPane.exists()) {
            throw new WMRuntimeException(Resource.PAGECP_TARGET_EXISTS,
                    destPageName, destProjectName);
        }
        
        FileUtils.copyFile(new File(sourcePane, sourcePageName+"."+PAGE_HTML),
                new File(destPane, destPageName+"."+PAGE_HTML));
        
        String cssContents = FileUtils.readFileToString(
                new File(sourcePane, sourcePageName+"."+PAGE_CSS),
                ServerConstants.DEFAULT_ENCODING);
        cssContents = cssContents.replace("."+sourcePageName, "."+destPageName);
        FileUtils.writeStringToFile(
                new File(destPane, destPageName+"."+PAGE_CSS),
                cssContents, ServerConstants.DEFAULT_ENCODING);
        
        String jsContents = FileUtils.readFileToString(
                new File(sourcePane, sourcePageName+"."+PAGE_JS),
                ServerConstants.DEFAULT_ENCODING);
        jsContents = jsContents.replaceAll(
                "^dojo.declare\\(\""+sourcePageName+"\"",
                "dojo.declare(\""+destPageName+"\"");
        FileUtils.writeStringToFile(
                new File(destPane, destPageName+"."+PAGE_JS), jsContents,
                ServerConstants.DEFAULT_ENCODING);
        
        String widgetsContents = FileUtils.readFileToString(
                new File(sourcePane, sourcePageName+"."+PAGE_WIDGETS),
                ServerConstants.DEFAULT_ENCODING);
        widgetsContents = widgetsContents.replaceAll(
                "^"+sourcePageName+".widgets ", destPageName+".widgets ");
        FileUtils.writeStringToFile(
                new File(destPane, destPageName+"."+PAGE_WIDGETS),
                widgetsContents, ServerConstants.DEFAULT_ENCODING);
    }

    public File getPagesDir(String projectName) throws FileAccessException {
        
        File projectRoot = projectManager.getProjectDir(projectName, false);
        return new File(new File(projectRoot, ProjectConstants.WEB_DIR),
                ProjectConstants.PAGES_DIR);
    }
    
    public File getPageDir(String projectName, String pageName)
            throws FileAccessException {
        return new File(getPagesDir(projectName), pageName);
    }

    public File getDictionariesDir(String projectName) throws FileAccessException {
        
        File projectRoot = projectManager.getProjectDir(projectName, false);
        return new File(new File(projectRoot, ProjectConstants.WEB_DIR),
                ProjectConstants.I18N_DIR);
    }


    /**
     * List all dictionaries in the current project
     * @return
     * @throws FileAccessException
     */
    public SortedSet<String> listDictionaries() throws FileAccessException {
        return listDictionaries(
                getProjectManager().getCurrentProject().getProjectName());
    }
    
    /**
     * Return a list of all dictionaries in the specified project.
     * @param projectName
     * @return
     * @throws FileAccessException
     */
    public SortedSet<String> listDictionaries(String projectName) throws FileAccessException {
        
        SortedSet<String> ret = new TreeSet<String>();
        
        File dictionariesDir = getDictionariesDir(projectName);
        
        File[] children = dictionariesDir.listFiles();
        if (null!=children) {
            for (File child: children) {
                if (child.isDirectory() &&
                        !IOUtils.DEFAULT_EXCLUSION.contains(child.getName())) {
                    ret.add(child.getName());
                }
            }
        }
        
        return ret;
    }



    // spring-controlled bean properties
    ProjectManager projectManager;

    public ProjectManager getProjectManager() {
        return projectManager;
    }
    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }
}