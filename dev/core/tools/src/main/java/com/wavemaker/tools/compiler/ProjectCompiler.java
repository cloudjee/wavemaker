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

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.ServiceLoader;

import javax.annotation.processing.Processor;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileManager;
import javax.tools.JavaFileObject;
import javax.tools.JavaFileObject.Kind;
import javax.tools.StandardLocation;

import org.springframework.util.Assert;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.apt.ServiceConfigurationProcessor;
import com.wavemaker.tools.apt.ServiceDefProcessor;
import com.wavemaker.tools.apt.ServiceProcessorConstants;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.service.DesignServiceManager;

/**
 * Compiler main class. This class compiles all java class source files in a project and executes annotation processors
 * post-compilation
 * 
 * @author Seung Lee
 * @author Jeremy Grelle
 */

public class ProjectCompiler {

    private StudioConfiguration studioConfiguration;

    private ProjectManager projectManager;

    private DesignServiceManager designServiceManager;

    public void compileProject(String projectName) {

        Project project = this.projectManager.getProject(projectName, true);

        JavaCompiler compiler = ServiceLoader.load(JavaCompiler.class).iterator().next();
        ClassFileManager projectFileManager;
        Iterable<JavaFileObject> sourceFiles = null;
        Iterable<JavaFileObject> resourceFiles = null;
        try {
            projectFileManager = new ClassFileManager(compiler.getStandardFileManager(null, null, null), this.studioConfiguration, project);
            sourceFiles = projectFileManager.list(StandardLocation.SOURCE_PATH, "", Collections.singleton(Kind.SOURCE), true);
            resourceFiles = projectFileManager.list(StandardLocation.SOURCE_PATH, "", Collections.singleton(Kind.OTHER), true);
            for (JavaFileObject resourceFile : resourceFiles) {
                Assert.isTrue(resourceFile instanceof GenericResourceFileObject, "Expected a Resource-based JavaFileObject");
                this.studioConfiguration.copyFile(project.getWebInfClasses(), resourceFile.openInputStream(),
                    ((GenericResourceFileObject) resourceFile).getFilename());
            }

        } catch (IOException e) {
            throw new WMRuntimeException("Could not create Java file manager for project " + projectName, e);
        }

        List<String> options = new ArrayList<String>();

        options.add("-encoding");
        options.add("utf8");

        options.add("-A" + ServiceProcessorConstants.PROJECT_NAME_PROP + "=" + projectName);

        if (sourceFiles.iterator().hasNext()) {
            JavaCompiler.CompilationTask task = compiler.getTask(null, projectFileManager, null, options, null, sourceFiles);
            task.setProcessors(Collections.singleton(createServiceDefProcessor(projectFileManager)));
            if (!task.call()) {
                return;
            }
        }
        executeConfigurationProcessor(compiler, projectFileManager, projectName);
    }

    public void compileService(String projectName, String serviceId) {

        Project project = this.projectManager.getProject(projectName, true);

        JavaCompiler compiler = ServiceLoader.load(JavaCompiler.class).iterator().next();
        ClassFileManager projectFileManager;
        Iterable<JavaFileObject> sourceFiles;
        try {
            projectFileManager = new ClassFileManager(compiler.getStandardFileManager(null, null, null), this.studioConfiguration, project);
            sourceFiles = projectFileManager.list(StandardLocation.SOURCE_PATH, "", Collections.singleton(Kind.SOURCE), true);
        } catch (IOException e) {
            throw new WMRuntimeException("Could not create Java file manager for project " + projectName, e);
        }

        List<String> options = new ArrayList<String>();

        options.add("-encoding");
        options.add("utf8");

        options.add("-A" + ServiceProcessorConstants.PROJECT_NAME_PROP + "=" + projectName);

        if (sourceFiles.iterator().hasNext()) {
            JavaCompiler.CompilationTask task = compiler.getTask(null, projectFileManager, null, options, null, sourceFiles);
            task.setProcessors(Collections.singleton(createServiceDefProcessor(projectFileManager)));
            task.call();
        }
        executeConfigurationProcessor(compiler, projectFileManager, projectName);
    }

    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    public void setDesignServiceManager(DesignServiceManager designServiceManager) {
        this.designServiceManager = designServiceManager;
    }

    @SuppressWarnings("unchecked")
    private void executeConfigurationProcessor(JavaCompiler compiler, JavaFileManager projectFileManager, String projectName) {
        List<String> options = new ArrayList<String>();

        options.add("-encoding");
        options.add("utf8");

        options.add("-proc:only");

        options.add("-classNames");
        options.add("java.lang.Object");

        options.add("-A" + ServiceProcessorConstants.PROJECT_NAME_PROP + "=" + projectName);

        JavaCompiler.CompilationTask task = compiler.getTask(null, projectFileManager, null, options, null, Collections.EMPTY_SET);
        task.setProcessors(Collections.singleton(createServiceConfigProcessor()));
        task.call();
    }

    private Processor createServiceConfigProcessor() {
        ServiceConfigurationProcessor processor = new ServiceConfigurationProcessor();
        processor.setStudioConfiguration(this.studioConfiguration);
        processor.setDesignServiceManager(this.designServiceManager);
        return processor;
    }

    private Processor createServiceDefProcessor(ClassFileManager projectFileManager) {
        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setStudioConfiguration(this.studioConfiguration);
        processor.setDesignServiceManager(this.designServiceManager);
        processor.setFileManager(projectFileManager);
        return processor;
    }
}
