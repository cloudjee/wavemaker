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
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.jar.JarFile;
import java.util.jar.Manifest;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.taskdefs.Copy;
import org.apache.tools.ant.taskdefs.Delete;
import org.apache.tools.ant.types.FileList;
import org.apache.tools.ant.types.FileSet;
import org.apache.tools.ant.types.Reference;
import org.apache.tools.ant.util.ClasspathUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.util.ResourceUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.module.ModuleManager;
import com.wavemaker.tools.io.local.LocalFolder;
import com.wavemaker.tools.io.local.LocalFile;
import com.wavemaker.tools.io.Resources;
import com.wavemaker.tools.io.FilterOn;
import com.wavemaker.tools.io.ResourceFilter;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.project.LocalStudioFileSystem;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;

/**
 * @author Matt Small
 * @author Joel Hare
 * @author Jeremy Grelle
 */
public class NewCopyRuntimeJarsTask extends Task {

    public static final String CLASSPATH_ATTR_NAME = "Class-Path";

    public static final String TASK_NAME = "copyRuntimeJarsTask";

    private static final String RUNTIME_JAR_PROPERTIES = "META-INF/runtimejar.properties";

    private static final String RUNTIME_JAR_PROPERTY_KEY = "runtimejar.name";

    private static final String DEFAULT_RUNTIME_JAR_NAME = "wavemaker-runtime.jar";

    private LocalFolder todir = null;

    private LocalFolder from = null;

    private boolean preserveLastModified = false;

    private boolean overwrite = false;

    private boolean verbose = false;

    private ClasspathUtils.Delegate cpDelegate;

    private Project wmProject;

    /**
     * Get the wavemaker runtime jar file, ensuring that it exists.
     * 
     * @return the wavemaker runtime jar files.
     */
    private File getRuntimeJarFile() {
        String runtimeJarName = getRuntimeJarNameFromProperties();
        File runtimeJarFile = new File(this.from.getLocalFile(), runtimeJarName);
        if (runtimeJarFile.exists()) {
            return runtimeJarFile;
        }
        // Default does not exist, we might be running inside an IDE, try without the version number
        runtimeJarFile = new File(this.from.getLocalFile(), DEFAULT_RUNTIME_JAR_NAME);
        if (runtimeJarFile.exists()) {
            return runtimeJarFile;
        }
        throw new IllegalStateException(runtimeJarFile + " does not exist");
    }

    private String getRuntimeJarNameFromProperties() {
        InputStream in = this.getClass().getClassLoader().getResourceAsStream(RUNTIME_JAR_PROPERTIES);
        if (in != null) {
            try {
                Properties prop = new Properties();
                prop.load(in);
                return prop.getProperty(RUNTIME_JAR_PROPERTY_KEY);
            } catch (IOException ioe) {
                throw new WMRuntimeException(ioe);
            } finally {
                try {
                    in.close();
                } catch (Exception e) {
                    throw new WMRuntimeException(e);
                }
            }
        } else {
            throw new IllegalStateException("CopyRuntimeJarsTask could not load " + RUNTIME_JAR_PROPERTIES);
        }
    }

    protected List<String> getReferencedClassPathJars(File jarFile, boolean failOnError) {

        try {
            JarFile runtimeJar = new JarFile(jarFile);
            Manifest manifest = runtimeJar.getManifest();
            String jarClassPath = manifest.getMainAttributes().getValue(CLASSPATH_ATTR_NAME);
            if (failOnError && jarClassPath == null) {
                throw new IllegalStateException(CLASSPATH_ATTR_NAME + " attribute is missing from " + jarFile);
            } else if (jarClassPath == null) {
                return new ArrayList<String>();
            }

            String[] tokens = jarClassPath.split("\\s");

            List<String> jarNames = new ArrayList<String>(tokens.length + 1);

            jarNames.add(jarFile.getName());
            for (String jarName : jarClassPath.split("\\s")) {
                jarNames.add(jarName);
            }
            return jarNames;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    protected Resources<com.wavemaker.tools.io.File> getProjectJarFileSet() {
        ResourceFilter included = FilterOn.antPattern(ProjectConstants.LIB_DIR + "/**/*.jar");
        Resources<com.wavemaker.tools.io.File> rtn = this.wmProject.getRootFolder().find().include(included).files();

        return rtn;
    }

    @Override
    public void execute() {
        if (this.todir == null) {
            throw new IllegalArgumentException("todir is not set");
        }
        if (this.from == null) {
            throw new IllegalArgumentException("from is not set");
        }
        if (!this.todir.exists()) {
            throw new IllegalArgumentException(this.todir + " does not exist");
        }
        if (!this.from.exists()) {
            throw new IllegalArgumentException(this.from + " does not exist");
        }

        File runtimeJarFile = getRuntimeJarFile();

        List<String> runtimeJarNames = getReferencedClassPathJars(runtimeJarFile, true);

        Resources<com.wavemaker.tools.io.File> projectJars = getProjectJarFileSet();

        // Delete all jars not included in these lists
        com.wavemaker.tools.io.ResourceFilter included = FilterOn.antPattern("*.jar");

        List<ResourceFilter> flist;
        ResourceFilter[] runtimeJarFilter = null;
        if (runtimeJarNames != null && runtimeJarNames.size() > 0 ) {
            flist = new ArrayList<ResourceFilter>();
            for (String runtimeJarName : runtimeJarNames) {
                flist.add(FilterOn.caseSensitiveNames().matching(runtimeJarName));
            }
            runtimeJarFilter = flist.toArray(new ResourceFilter[runtimeJarNames.size()]);
        }

        this.todir.find().include(included).exclude(runtimeJarFilter).files().delete();

        //TODO:ant - The following lines of code intend to handle user-added jars but it seems wrong. Fix it.
        /*for (String projectJarName : projectJars.getDirectoryScanner().getIncludedFiles()) {
            String trimmedJarName = projectJarName.substring(ProjectConstants.LIB_DIR.length() + 1);
            deleteFileSet.createExclude().setName(trimmedJarName);
        }*/

        // Copy all new or out of date jars to the target directory

        Resources<com.wavemaker.tools.io.File> sourceRuntimeFileSet = null;
        //if (!this.todir.equals(this.from)) { //TODO:ant - use this loine when the bug with "equals" is fixed
        if (!this.todir.getLocalFile().getAbsolutePath().equals(this.from.getLocalFile().getAbsolutePath())) {
            sourceRuntimeFileSet = this.from.find().include(runtimeJarFilter).files();
        }

        for (com.wavemaker.tools.io.File file : projectJars) {
            com.wavemaker.tools.io.File destf = this.todir.getFile(file.getName());
            if (destf.exists()) destf.delete(); //TODO:ant - prepareWebRoot should not copy this file.  Once fixed, this line should be removed.
            destf.createIfMissing();
            file.getContent().copyTo(destf.getContent().asOutputStream());    
        }

        for (com.wavemaker.tools.io.File file : sourceRuntimeFileSet) {
            com.wavemaker.tools.io.File destf = this.todir.getFile(file.getName());
            if (destf.exists()) destf.delete(); //TODO:ant - prepareWebRoot should not copy this file.  Once fixed, this line should be removed.
            destf.createIfMissing();
            file.getContent().copyTo(destf.getContent().asOutputStream());
        }

        //TODO:ant - copy pws files when supporting pws module
        //copyPwsFiles(this.from, this.wmProject);
    }

    protected ClasspathUtils.Delegate getDelegate() {

        if (this.cpDelegate == null) {
            this.cpDelegate = ClasspathUtils.getDelegate(this);
        }
        return this.cpDelegate;
    }

    protected ClassLoader getClassLoader() {
        this.cpDelegate = this.cpDelegate == null ? getDelegate() : this.cpDelegate;
        return this.cpDelegate.getClassLoader();
    }

    /*private void copyPwsFiles(File libDir, Project wmproject) {
        File pwsNode = new File(libDir.getParentFile().getParentFile(), "app/templates/pws");
        File pwsWebInfNode = new File(pwsNode, "WEB-INF");
        Copy copyTask = new Copy();
        copyTask.setProject(getProject());
        copyTask.setPreserveLastModified(isPreserveLastModified());
        copyTask.setTaskName(TASK_NAME);
        copyTask.setOverwrite(true);
        copyTask.setVerbose(isVerbose());
        copyTask.setFlatten(false);
        copyTask.setTodir(this.todir.getParentFile());

        FileSet srcPwsFileSet = new FileSet();
        srcPwsFileSet.setDir(pwsWebInfNode);*/
        //srcPwsFileSet.createInclude().setName("**/*.*");
        //srcPwsFileSet.createExclude().setName("**/.svn/**/*.*");

        /*copyTask.add(srcPwsFileSet);
        copyTask.perform();

        String[] partnerNodeList = pwsNode.list();

        if (partnerNodeList == null || partnerNodeList.length == 0) {
            return;
        }

        for (String partnerNodeName : partnerNodeList) {
            File partnerWebInfNode = new File(pwsNode, partnerNodeName + "/WEB-INF");
            if (!partnerWebInfNode.exists()) {
                continue;
            }
            copyTask = new Copy();
            copyTask.setProject(getProject());
            copyTask.setPreserveLastModified(isPreserveLastModified());
            copyTask.setTaskName(TASK_NAME);
            copyTask.setOverwrite(isOverwrite());
            copyTask.setVerbose(isVerbose());
            copyTask.setFlatten(false);
            copyTask.setTodir(this.todir.getParentFile());

            FileSet srcPartnerFileSet = new FileSet();
            srcPartnerFileSet.setDir(partnerWebInfNode);*/
            //srcPartnerFileSet.createInclude().setName("**/*.*");
            //srcPartnerFileSet.createExclude().setName("**/.svn/**/*.*");

            //copyTask.add(srcPartnerFileSet);
            //copyTask.perform();
        //}
    //}

    /**
     * Set the classpathref - this classpath will be used to discover available modules.
     * 
     * @param r A reference to a Path structure - this should be a classpath or similar.
     */
    public void setClasspathRef(Reference r) {
        getDelegate().setClasspathref(r);
    }

    public void setProjectRoot(File projectRoot) {
        this.wmProject = new Project(new FileSystemResource(projectRoot), new LocalStudioFileSystem());
    }

    public LocalFolder getTodir() {
        return this.todir;
    }

    public void setTodir(LocalFolder todir) {
        this.todir = todir;
    }

    public LocalFolder getFrom() {
        return this.from;
    }

    public void setFrom(LocalFolder from) {
        this.from = from;
    }

    public boolean isPreserveLastModified() {
        return this.preserveLastModified;
    }

    public void setPreserveLastModified(boolean preserveLastModified) {
        this.preserveLastModified = preserveLastModified;
    }

    public boolean isOverwrite() {
        return this.overwrite;
    }

    public void setOverwrite(boolean overwrite) {
        this.overwrite = overwrite;
    }

    public boolean isVerbose() {
        return this.verbose;
    }

    public void setVerbose(boolean verbose) {
        this.verbose = verbose;
    }
}