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

package com.wavemaker.tools.compiler;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.tools.JavaCompiler;
import javax.tools.JavaCompiler.CompilationTask;
import javax.tools.JavaFileManager;
import javax.tools.JavaFileObject;
import javax.tools.JavaFileObject.Kind;
import javax.tools.StandardJavaFileManager;
import javax.tools.StandardLocation;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.apt.AbstractStudioServiceProcessor;
import com.wavemaker.tools.apt.ServiceConfigurationProcessor;
import com.wavemaker.tools.apt.ServiceDefProcessor;
import com.wavemaker.tools.apt.ServiceProcessorConstants;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.compiler.ResourceJavaFileManager;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.tools.service.DesignServiceManager;

/**
 * Compiler main class. This class compiles all java class source files in a project and executes annotation processors
 * post-compilation
 * 
 * @author Seung Lee
 * @author Jeremy Grelle
 */
public class ProjectCompiler {

    private ProjectManager projectManager;

    private DesignServiceManager designServiceManager;

    private StudioFileSystem fileSystem;

    public String compile() {
        Project project = this.projectManager.getCurrentProject();
        return compile(project);
    }

    private String compile(Project project) {
        try {
            JavaCompiler compiler = new WaveMakerJavaCompiler();
            StandardJavaFileManager standardFileManager = compiler.getStandardFileManager(null, null, null);
            ResourceJavaFileManager projectFileManager = new ResourceJavaFileManager(standardFileManager);
            projectFileManager.setLocation(StandardLocation.SOURCE_PATH, project.getSourceFolders());
            projectFileManager.setLocation(StandardLocation.CLASS_OUTPUT, Collections.singleton(project.getClassOutputFolder()));
            for (Folder sourceFolder : project.getSourceFolders()) {
                // FIXME filter out *.java and *.class
                sourceFolder.list().copyTo(project.getClassOutputFolder());
            }
            Iterable<JavaFileObject> compilationUnits = projectFileManager.list(StandardLocation.SOURCE_PATH, "", Collections.singleton(Kind.SOURCE),
                true);
            StringWriter compilerOutput = new StringWriter();
            CompilationTask compilationTask = compiler.getTask(compilerOutput, projectFileManager, null, getCompilerOptions(project), null,
                compilationUnits);
            ServiceDefProcessor serviceDefProcessor = configure(new ServiceDefProcessor(), projectFileManager);
            ServiceConfigurationProcessor serviceConfigurationProcessor = configure(new ServiceConfigurationProcessor(), projectFileManager);
            compilationTask.setProcessors(Arrays.asList(serviceConfigurationProcessor, serviceDefProcessor));
            if (!compilationTask.call()) {
                throw new WMRuntimeException("Compile failed with output:\n\n" + compilerOutput.toString());
            }
            return compilerOutput.toString();
        } catch (IOException e) {
            throw new WMRuntimeException("Unable to compile " + project.getProjectName(), e);
        }
    }

    private <T extends AbstractStudioServiceProcessor> T configure(T processor, JavaFileManager javaFileManager) {
        processor.setFileSystem(this.fileSystem);
        processor.setDesignServiceManager(this.designServiceManager);
        processor.setJavaFileManager(javaFileManager);
        return processor;
    }

    private Iterable<String> getCompilerOptions(Project project) {
        List<String> options = new ArrayList<String>();
        options.add("-encoding");
        options.add("utf8");
        options.add("-A" + ServiceProcessorConstants.PROJECT_NAME_PROP + "=" + project.getProjectName());
        options.add("-g");
        return options;
    }

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    public void setDesignServiceManager(DesignServiceManager designServiceManager) {
        this.designServiceManager = designServiceManager;
    }

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }
}
