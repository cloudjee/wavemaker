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

import java.io.IOException;
import java.util.SortedSet;

import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.project.PagesManager;

/**
 * @author small
 * @version $Rev$ - $Date$
 */
@HideFromClient
public class PagesService {
    
    /**
     * Return a list of pages in the current application.  Currently, this is
     * every directory in the pages directory.
     * @return
     * @throws FileAccessException
     */
    @ExposeToClient
    public SortedSet<String> listPages() throws FileAccessException {
        
        return pagesManager.listPages();
    }
    
    /**
     * Return a list of all pages in the specified project.
     * @param projectName
     * @return
     * @throws FileAccessException
     */
    @ExposeToClient
    public SortedSet<String> listPages(String projectName) throws FileAccessException {
        
        return pagesManager.listPages(pagesManager.getProjectManager().getUserProjectPrefix() + projectName);
    }
    
    /**
     * Delete a page.
     * 
     * @param pageName
     *                The page to delete.
     * @throws IOException
     */
    @ExposeToClient
    public void deletePage(String pageName) throws IOException {

        pagesManager.deletePage(pageName);
    }
    
    /**
     * Copy a page from a project to the current project. A page with the
     * specified name must not already exist in the current project.
     * 
     * @param sourceProjectName
     *                The project to copy from.
     * @param sourcePageName
     *                The name of the page to copy from.
     * @param destPageName
     *                The name of the page to copy to (must not exist in the
     *                current project).
     * @throws IOException
     */
    @ExposeToClient
    public void copyPage(String sourceProjectName, String sourcePageName,
            String destPageName) throws IOException {
        
        pagesManager.copyPage(pagesManager.getProjectManager().getUserProjectPrefix() + sourceProjectName, sourcePageName, destPageName);
    }
    
    
    // spring-controlled bean properties
    PagesManager pagesManager;

    public PagesManager getPagesManager() {
        return pagesManager;
    }
    public void setPagesManager(PagesManager pagesManager) {
        this.pagesManager = pagesManager;
    }
}
