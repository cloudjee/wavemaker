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
import java.io.Writer;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

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

    private StudioFileSystem fileSystem;

    private ProjectManager projectManager;

    private DesignServiceManager designServiceManager;

    public String compile(String projectName) {
        StringWriter out = new StringWriter();
        Project project = this.projectManager.getCurrentProject();
        JavaCompiler compiler = newJavaCompiler();
        JavaFileManager fileManager;
        Iterable<JavaFileObject> sourceFiles = null;
        Iterable<JavaFileObject> resourceFiles = null;
        try {
            fileManager = new ClassFileManager(compiler.getStandardFileManager(null, null, null), this.fileSystem, project);
            sourceFiles = fileManager.list(StandardLocation.SOURCE_PATH, "", Collections.singleton(Kind.SOURCE), true);
            resourceFiles = fileManager.list(StandardLocation.SOURCE_PATH, "", Collections.singleton(Kind.OTHER), true);
            for (JavaFileObject resourceFile : resourceFiles) {
                Assert.isTrue(resourceFile instanceof GenericResourceFileObject, "Expected a Resource-based JavaFileObject");
                this.fileSystem.copyFile(project.getWebInfClasses(), resourceFile.openInputStream(),
                    ((GenericResourceFileObject) resourceFile).getFilename());
            }

        } catch (IOException e) {
            throw new WMRuntimeException("Could not create Java file manager for project " + projectName, e);
        }

        List<String> options = new ArrayList<String>();

        options.add("-encoding");
        options.add("utf8");

        options.add("-A" + ServiceProcessorConstants.PROJECT_NAME_PROP + "=" + projectName);
        options.add("-g");

        if (sourceFiles.iterator().hasNext()) {
            JavaCompiler.CompilationTask task = compiler.getTask(out, fileManager, null, options, null, sourceFiles);
            task.setProcessors(Collections.singleton(createServiceDefProcessor(fileManager)));
            if (!task.call()) {
                throw new WMRuntimeException("Compile failed with output:\n\n" + out.toString());
            }
        }
        executeConfigurationProcessor(compiler, fileManager, projectName, out);
        return out.toString();
    }

    private JavaCompiler newJavaCompiler() {
        return new WaveMakerJavaCompiler();
    }

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    public void setDesignServiceManager(DesignServiceManager designServiceManager) {
        this.designServiceManager = designServiceManager;
    }

    @SuppressWarnings("unchecked")
    private void executeConfigurationProcessor(JavaCompiler compiler, JavaFileManager projectFileManager, String projectName, Writer out) {
        List<String> options = new ArrayList<String>();

        options.add("-encoding");
        options.add("utf8");

        options.add("-proc:only");

        options.add("-classNames");
        options.add("java.lang.Object");

        options.add("-A" + ServiceProcessorConstants.PROJECT_NAME_PROP + "=" + projectName);

        JavaCompiler.CompilationTask task = compiler.getTask(out, projectFileManager, null, options, null, Collections.EMPTY_SET);
        task.setProcessors(Collections.singleton(createServiceConfigProcessor()));
        if (!task.call()) {
            throw new WMRuntimeException("Compiler/Annotation processing failed with output:\n\n" + out.toString());
        }
    }

    private Processor createServiceConfigProcessor() {
        ServiceConfigurationProcessor processor = new ServiceConfigurationProcessor();
        processor.setFileSystem(this.fileSystem);
        processor.setDesignServiceManager(this.designServiceManager);
        return processor;
    }

    private Processor createServiceDefProcessor(JavaFileManager projectFileManager) {
        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setFileSystem(this.fileSystem);
        processor.setDesignServiceManager(this.designServiceManager);
        processor.setFileManager(projectFileManager);
        return processor;
    }
}
