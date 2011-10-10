/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.compiler;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.tools.JavaFileObject;

import org.springframework.core.io.Resource;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.StudioConfiguration;

/**
 * Compiler utils
 * 
 * @author slee
 *
 */

public class CompilerUtils {
	
	//Given a Spring resource, create a Java File Object
    public static JavaFileObject getJavaResourceObject(Resource resource) throws IOException {
        String className = resource.getFilename();
        int len = className.length();
        if (className.substring(len - StringUtils.JAVA_SRC_EXT.length()).equals(StringUtils.JAVA_SRC_EXT)) {
            className = className.substring(0, len - StringUtils.JAVA_SRC_EXT.length());
        }
        InputStream is = resource.getInputStream();
        JavaFileObject obj = null;//new JavaResourceObject(className, IOUtils.toString(is));

        return obj;
    }

    //Get all java source files to be compiled in a project
    public static List<JavaFileObject> getProjectJavaFileObjects(Project project, StudioConfiguration config)
            throws IOException {
        List<JavaFileObject> jfiles = null;
        List<Resource> javaFileResources = null;
        List<Resource> targets;

        // service related java source files

        Resource root = project.getProjectRoot().createRelative("services/");
        List<Resource> services = config.listChildren(root);

        for (Resource service : services) {
            Resource svcSourceRoot = service.createRelative("src/");
            targets = getTargetResources(svcSourceRoot, StringUtils.JAVA_SRC_EXT, config);
            if (targets != null && targets.size() > 0) {
                javaFileResources = (javaFileResources == null) ? new ArrayList<Resource>() : javaFileResources;
                javaFileResources.addAll(targets);
            }
        }

        // project-wise java source files

        root = project.getProjectRoot().createRelative("src/");

        targets = getTargetResources(root, StringUtils.JAVA_SRC_EXT, config);
        if (targets != null && targets.size() > 0) {
            javaFileResources = (javaFileResources == null) ? new ArrayList<Resource>() : javaFileResources;
            javaFileResources.addAll(targets);
        }

        if (javaFileResources != null && javaFileResources.size() > 0) {
            for (Resource fileResource : javaFileResources) {
                jfiles = (jfiles == null) ? new ArrayList<JavaFileObject>() : jfiles;
                jfiles.add(CompilerUtils.getJavaResourceObject(fileResource));
            }
        }

        return jfiles;
    }

    //Get all java source files to be compiled in a project
    public static List<JavaFileObject> getServiceJavaFileObjects(Project project,
                            String serviceName, StudioConfiguration config) throws IOException {
        List<JavaFileObject> jfiles = null;
        List<Resource> javaFileResources;

        Resource root = project.getProjectRoot().createRelative("services/" + serviceName + "/src/");

        javaFileResources = getTargetResources(root, StringUtils.JAVA_SRC_EXT, config);

        if (javaFileResources != null && javaFileResources.size() > 0) {
            for (Resource fileResource : javaFileResources) {
                jfiles = (jfiles == null) ? new ArrayList<JavaFileObject>() : jfiles;
                jfiles.add(CompilerUtils.getJavaResourceObject(fileResource));
            }
        }

        return jfiles;
    }

    //Get the list of all target files with the specified file extension in a directory
    public static List<Resource> getTargetResources(Resource root, String ext, StudioConfiguration config) {
        List<Resource> rtn = null;
        List<Resource> children = config.listChildren(root);
        if (children != null && children.size() > 0) {
            for (Resource child : children) {
                String name = child.getFilename();
                int len1 = name.length();
                int len2 = ext.length();
                if (len1 > len2 && name.substring(len1 - len2).equals(StringUtils.JAVA_SRC_EXT)) {
                    rtn = (rtn == null) ? new ArrayList<Resource>() : rtn;
                    rtn.add(child);
                } else {
                    List<Resource> nextLevelTargets = getTargetResources(child, ext, config);
                    if (nextLevelTargets != null && nextLevelTargets.size() > 0) {
                        rtn = (rtn == null) ? new ArrayList<Resource>() : rtn;
                        rtn.addAll(nextLevelTargets);
                    }
                }
            }
        }

        return rtn;
    }

    //construct classpath string for all jars in the path passed in
    public static String getClassPath(String path) {
        File libDir = new File(path);

        FilenameFilter ft = new FilenameFilter() {
            public boolean accept(File dir, String name) {
                return name.endsWith("." + "jar");
            }
        };

        File[] jars = libDir.listFiles(ft);

        String cp = "";
        if (jars != null && jars.length > 0) {
            for (File jar : jars) {
                cp = cp + jar.getAbsolutePath() + ";";
            }
        }

        return cp;
    }

}
