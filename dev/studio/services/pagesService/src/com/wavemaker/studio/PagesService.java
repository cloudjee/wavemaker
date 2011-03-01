/*
 * Copyright (C) 2007-2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
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
