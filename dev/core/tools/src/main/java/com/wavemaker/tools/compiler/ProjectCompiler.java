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

import javax.tools.JavaFileObject;
import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;
import java.util.List;
import java.util.ArrayList;
import java.io.IOException;

import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.project.Project;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

/**
 * Compiler main class.  This class compiles all java class source files in a project
 * 
 * @author slee
 *
 */

public class ProjectCompiler {

    private StudioConfiguration studioConfiguration;

    private ProjectManager projectManager;
    
    public void compileProject(String projectName) {

        Project project = projectManager.getProject(projectName, true);

        List<JavaFileObject> jfiles = null;

        try {
            jfiles = CompilerUtils.getProjectJavaFileObjects(project, studioConfiguration);
        } catch (IOException e) {
            //continue
        }

        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        ClassFileManager fileManager = new ClassFileManager(compiler.getStandardFileManager(null, null, null), project, studioConfiguration);

        List<String> optionList = null;

        Resource webInfLibResource = project.getWebInfLib();
        String cPath = CompilerUtils.getClassPath(studioConfiguration.getPath(webInfLibResource));

        if (cPath != null && cPath.length() > 0) {
            optionList = new ArrayList<String>();
            optionList.add("-classpath");
            optionList.add(cPath);
        }

        JavaCompiler.CompilationTask task = compiler.getTask(null, fileManager, null, optionList, null, jfiles);
        task.call();
    }

    public void compileService(String projectName, String serviceName) {

        Project project = projectManager.getProject(projectName, true);
        List<JavaFileObject> jfiles = null;

        try {
            jfiles = CompilerUtils.getServiceJavaFileObjects(project, serviceName, studioConfiguration);
        } catch (IOException e) {
            //continue
        }

        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        ClassFileManager fileManager = new ClassFileManager(compiler.getStandardFileManager(null, null, null), project, studioConfiguration);

        List<String> optionList = null;

        Resource webInfLibResource = project.getWebInfLib();
        String cPath = CompilerUtils.getClassPath(studioConfiguration.getPath(webInfLibResource));

        if (cPath != null && cPath.length() > 0) {
            optionList = new ArrayList<String>();
            optionList.add("-classpath");
            optionList.add(cPath);
        }

        JavaCompiler.CompilationTask task = compiler.getTask(null, fileManager, null, optionList, null, jfiles);
        task.call();
    }

    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }
}
 
