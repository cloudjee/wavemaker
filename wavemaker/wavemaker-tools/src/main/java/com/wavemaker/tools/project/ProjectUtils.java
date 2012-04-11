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

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.springframework.util.Assert;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.runtime.WMAppContext;

/**
 * Project utility methods.
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class ProjectUtils {

    /**
     * Gets a temporary classloader for this project. The project should already be built; classes and libraries should
     * be present in WEB-INF/classes & WEB-INF/lib, respectively.
     * 
     * @param project The project to get a ClassLoader for.
     * @return A temporary ClassLoader for the given project.
     */
    @SuppressWarnings("unchecked")
    public static ClassLoader getClassLoaderForProject(Project project) {

        // TODO - This may get ripped out entirely later, so for now we just
        // need to ensure it does not get used in Cloud Foundry
        Assert.isTrue(!WMAppContext.getInstance().isCloudFoundry(), "This class should not get used in CloudFoundry");

        try {
            List<File> classpath = new ArrayList<File>();
            if (project.getWebInfClasses() != null) {
                classpath.add(project.getWebInfClasses().getFile());
            }

            if (project.getWebInfLib() != null && project.getWebInfLib().exists()) {
                if (!project.getWebInfLib().getFile().isDirectory()) {
                    throw new WMRuntimeException(MessageResource.LIB_DIR_NOT_DIR, project.getWebInfLib());
                }

                classpath.addAll(FileUtils.listFiles(project.getWebInfLib().getFile(), new String[] { "jar" }, false));
            }

            return ClassLoaderUtils.getTempClassLoaderForFile(classpath.toArray(new File[] {}));
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }
}