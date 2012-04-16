/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.ant;

import java.io.File;
import java.util.Arrays;
import java.util.List;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.ConversionUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.tools.project.LocalStudioFileSystem;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.util.AntUtils;
import com.wavemaker.tools.util.DesignTimeUtils;
import com.wavemaker.tools.util.ResourceClassLoaderUtils;

/**
 * Base Task.
 * 
 * @author Simon Toens
 * @author Jeremy Grelle
 */
public abstract class CompilerTask extends Task {

    private File projectRoot;

    private Project agProject;

    private String classpath;

    private boolean projectRootRequired = false;

    private boolean verbose = false;

    private DesignServiceManager designServiceManager = null;

    protected StudioFileSystem fileSystem;

    protected CompilerTask() {
        this(false);
    }

    protected CompilerTask(boolean init) {
        if (init) {
            AntUtils.bootstrap(getClass().getClassLoader());
        }
        this.fileSystem = (StudioFileSystem) RuntimeAccess.getInstance().getSpringBean("fileSystem");
    }

    // REVIEW 25-Sep-07 stoens@activegrid.com -- We also need to handle
    // classpathref
    public void setClassPath(String s) {
        this.classpath = s;
    }

    public File getProjectRoot() {
        return this.projectRoot;
    }

    public void setProjectRoot(File projectRoot) {
        this.projectRoot = projectRoot;
        this.agProject = new Project(new FileSystemResource(projectRoot), new LocalStudioFileSystem());
    }

    public void setVerbose(boolean verbose) {
        this.verbose = verbose;
    }

    public boolean getVerbose() {
        return this.verbose;
    }

    public Project getAGProject() {
        return this.agProject;
    }

    protected synchronized DesignServiceManager getDesignServiceManager() {
        if (this.designServiceManager == null) {
            if (this.projectRoot != null) {
                this.designServiceManager = DesignTimeUtils.getDSMForProjectRoot(new FileSystemResource(this.projectRoot));
            }
        }
        return this.designServiceManager;
    }

    protected void setProjectRootRequired(boolean projectRootRequired) {
        this.projectRootRequired = projectRootRequired;
    }

    @Override
    public final void execute() {

        validate();

        Runnable task = new Runnable() {

            @Override
            public void run() {
                doExecute();
            }
        };

        ResourceClassLoaderUtils.runInClassLoaderContext(task, getClassLoader());
    }

    protected abstract void doExecute();

    protected void validate() {

        if (this.projectRootRequired) {

            if (this.projectRoot == null) {
                throw new BuildException("projectRoot must be set");
            }

            if (!this.projectRoot.exists()) {
                throw new BuildException("projectRoot: " + this.projectRoot + "doesn't exist");
            }

            if (!this.projectRoot.isDirectory()) {
                throw new BuildException("projectRoot: " + this.projectRoot + "is not a directory");
            }
        }
    }

    protected void debug(String s) {
        log(s, org.apache.tools.ant.Project.MSG_DEBUG);
    }

    private ClassLoader getClassLoader() {

        if (this.classpath == null) {
            // REVIEW 25-Sep-07 stoens@activegrid.com -- this is a hack for
            // running in Ant, so that we can get the taskdef's classloader
            // for this task. All this because Ant doesn't set the Thread's
            // context ClassLoader.
            return getClass().getClassLoader();
        } else {
            // FIXME 25-Sep-07 stoens@activegrid.com -- this path needs to
            // be split correctly on ';' and ':'. Assume it is a single path
            // for now.

            ClassLoader parent = ClassLoaderUtils.getClassLoader();

            // and another hack related to the comment above -
            if (getClass().getClassLoader().getClass().getName().endsWith("AntClassLoader")) {
                parent = getClass().getClassLoader();
            }
            String[] paths = this.classpath.split(":");
            File[] classPathFiles = new File[paths.length];
            for (int i = 0; i < paths.length; i++) {
                classPathFiles[i] = new File(paths[i]);
            }
            List<Resource> classPathResources = ConversionUtils.convertToResourceList(Arrays.asList(classPathFiles));
            return ResourceClassLoaderUtils.getClassLoaderForResources(parent, classPathResources.toArray(new Resource[classPathFiles.length]));
        }

    }
}