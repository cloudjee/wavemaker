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

package com.wavemaker.tools.apt;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Callable;

import javax.annotation.processing.AbstractProcessor;
import javax.annotation.processing.ProcessingEnvironment;
import javax.annotation.processing.RoundEnvironment;
import javax.lang.model.element.TypeElement;
import javax.tools.Diagnostic.Kind;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileManager;
import javax.tools.ToolProvider;

import org.springframework.core.io.Resource;
import org.springframework.util.Assert;
import org.springframework.util.ClassUtils;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.StringUtils;

import com.wavemaker.tools.javaservice.JavaDesignServiceType;
import com.wavemaker.tools.project.LocalStudioFileSystem;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.DesignServiceType;

public abstract class AbstractStudioServiceProcessor extends AbstractProcessor {

    private boolean initialized;

    private StudioFileSystem fileSystem;

    private DesignServiceManager designServiceManager;

    private JavaFileManager javaFileManager;

    protected final DesignServiceManager getDesignServiceManager() {
        return this.designServiceManager;
    }

    protected final JavaFileManager getJavaFileManager() {
        return this.javaFileManager;
    }

    protected Project getProject() {
        return getDesignServiceManager().getProjectManager().getCurrentProject();
    }

    @Override
    public synchronized final void init(final ProcessingEnvironment processingEnv) {
        super.init(processingEnv);
        try {
            doWithProcessorClassLoader(new Callable<Object>() {

                @Override
                public Object call() throws Exception {
                    initializeFileSystem(processingEnv);
                    initializeDesignServiceManager(processingEnv);
                    initializeJavaFileManager(processingEnv);
                    doInit(processingEnv);
                    return null;
                }
            });
            this.initialized = true;
        } catch (Exception e) {
            e.printStackTrace();
            this.processingEnv.getMessager().printMessage(Kind.ERROR,
                "Failed to initialize ServiceDefProcessor - could not create DesignServiceManager due to: " + e.getMessage());
        }
    }

    private void initializeFileSystem(ProcessingEnvironment processingEnv) throws Exception {
        if (this.fileSystem == null) {
            this.fileSystem = new LocalStudioFileSystem();
        }
    }

    private void initializeDesignServiceManager(ProcessingEnvironment processingEnv) throws Exception {
        if (this.designServiceManager == null) {
            String projectName = processingEnv.getOptions().get(ServiceProcessorConstants.PROJECT_NAME_PROP);
            ProjectManager projectManager = new ProjectManager();
            projectManager.setFileSystem(this.fileSystem);
            String projectRoot = processingEnv.getOptions().get(ServiceProcessorConstants.PROJECT_ROOT_PROP);
            if (StringUtils.hasText(projectRoot)) {
                projectRoot = projectRoot.endsWith("/") ? projectRoot : projectRoot + "/";
                Resource projectDir = this.fileSystem.getResourceForURI(projectRoot);
                projectName = projectDir.getFilename();
                projectManager.openProject(projectDir, true);
            } else {
                projectManager.openProject(projectName, true);
            }
            this.designServiceManager = new DesignServiceManager();
            this.designServiceManager.setProjectManager(projectManager);
            this.designServiceManager.setFileSystem(this.fileSystem);
            JavaDesignServiceType designServiceType = new JavaDesignServiceType();
            designServiceType.setServiceType("JavaService");
            List<DesignServiceType> designServiceTypes = new ArrayList<DesignServiceType>();
            designServiceTypes.add(designServiceType);
            this.designServiceManager.setDesignServiceTypes(designServiceTypes);
        }
    }

    private void initializeJavaFileManager(ProcessingEnvironment processingEnv) throws Exception {
        if (this.javaFileManager == null) {
            JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
            this.javaFileManager = compiler == null ? null : compiler.getStandardFileManager(null, null, null);
            Assert.state(this.javaFileManager != null, "Unable to load a JavaFileManager");
        }
    }

    /**
     * Subclasses may override this to provide additional initialization logic.
     * 
     * @param processingEnv
     */
    protected abstract void doInit(ProcessingEnvironment processingEnv) throws Exception;

    @Override
    protected synchronized boolean isInitialized() {
        return this.initialized && super.isInitialized();
    }

    @Override
    public final boolean process(final Set<? extends TypeElement> annotations, final RoundEnvironment roundEnv) {
        try {
            return doWithProcessorClassLoader(new Callable<Boolean>() {

                @Override
                public Boolean call() throws Exception {
                    return doProcess(annotations, roundEnv);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            ReflectionUtils.rethrowRuntimeException(e);
            return false;
        }
    }

    protected abstract boolean doProcess(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) throws Exception;

    private <T> T doWithProcessorClassLoader(Callable<T> callable) throws Exception {
        ClassLoader originalLoader = ClassUtils.getDefaultClassLoader();
        ClassUtils.overrideThreadContextClassLoader(getClass().getClassLoader());
        try {
            return callable.call();
        } finally {
            ClassUtils.overrideThreadContextClassLoader(originalLoader);
        }
    }

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    public void setDesignServiceManager(DesignServiceManager designServiceManager) {
        this.designServiceManager = designServiceManager;
    }

    public void setJavaFileManager(JavaFileManager javaFileManager) {
        this.javaFileManager = javaFileManager;
    }
}
