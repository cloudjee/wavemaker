/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.ClassLoaderUtils;

/**
 * Project utility methods.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public class ProjectUtils {

    /**
     * Gets a temporary classloader for this project. The project should already
     * be built; classes and libraries should be present in WEB-INF/classes &
     * WEB-INF/lib, respectively.
     * 
     * @param project
     *            The project to get a ClassLoader for.
     * @return A temporary ClassLoader for the given project.
     */
    @SuppressWarnings("unchecked")
    public static ClassLoader getClassLoaderForProject(Project project) {

        List<File> classpath = new ArrayList<File>();
        if (null != project.getWebInfClasses()) {
            classpath.add(project.getWebInfClasses());
        }

        if (null != project.getWebInfLib() && project.getWebInfLib().exists()) {
            if (!project.getWebInfLib().isDirectory()) {
                throw new WMRuntimeException(Resource.LIB_DIR_NOT_DIR,
                        project.getWebInfLib());
            }

            classpath.addAll(FileUtils.listFiles(project.getWebInfLib(),
                    new String[] { "jar" }, false));
        }
        
        return ClassLoaderUtils.getTempClassLoaderForFile(
                classpath.toArray(new File[]{}));
    }
}