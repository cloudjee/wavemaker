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
import com.wavemaker.tools.project.LocalStudioFileSystem;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;

/**
 * @author Matt Small
 * @author Joel Hare
 * @author Jeremy Grelle
 */
public class CopyRuntimeJarsTask extends Task {

    public static final String CLASSPATH_ATTR_NAME = "Class-Path";

    public static final String TASK_NAME = "copyRuntimeJarsTask";

    /**
     * XXX this is pretty faux - ideally, we'd do something better, instead of this. Which is search through for all the
     * module config files, and then getting the beandefs, and brute-forcing names & extension points out. Spring or
     * OSGi should help us out more. And a lot of this code is copied out of ModuleManager & ModuleController, too.
     * Terrible.
     * 
     * @return
     * @throws IOException
     */
    protected List<File> getModuleLocations(ClassLoader cl) throws IOException {
        List<File> ret = new ArrayList<File>();

        PathMatchingResourcePatternResolver searcher;
        searcher = new PathMatchingResourcePatternResolver(cl);

        Resource resources[] = searcher.getResources(ResourcePatternResolver.CLASSPATH_ALL_URL_PREFIX + "/" + ModuleManager.MODULE_CONFIG_FILE);
        for (Resource resource : resources) {

            URL url = resource.getURL();
            if (ResourceUtils.isJarURL(url)) {
                URL jarURL = ResourceUtils.extractJarFileURL(url);
                ret.add(ResourceUtils.getFile(jarURL));
            } else {
                ret.add(ResourceUtils.getFile(url).getParentFile());
            }
        }

        return ret;
    }

    protected String getRuntimeJarName() {
        String runtimeJarName = null;
        String propFile = "META-INF/runtimejar.properties";
        String key = "runtimejar.name";

        Properties prop = new Properties();
        InputStream in = this.getClass().getClassLoader().getResourceAsStream(propFile);
        if (in != null) {
            try {
                prop.load(in);
                runtimeJarName = prop.getProperty(key);
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
            throw new IllegalStateException("CopyRuntimeJarsTask could not load " + propFile);
        }

        runtimeJarName = cleanupRuntimeJarName(runtimeJarName);

        return runtimeJarName;
    }

    private String cleanupRuntimeJarName(String runtimeJarName) {
        // Allows for deployment inside eclipse
        return runtimeJarName.replaceAll("\\Q-${project.version}\\E", "");
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

            jarNames.add(getRuntimeJarName());
            for (String jarName : jarClassPath.split("\\s")) {
                jarNames.add(jarName);
            }
            return jarNames;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    protected FileSet getProjectJarFileSet() {
        FileSet projectJarSet = new FileSet();
        projectJarSet.setProject(getProject());
        try {
            projectJarSet.setDir(this.wmProject.getProjectRoot().getFile());

            projectJarSet.createInclude().setName(ProjectConstants.LIB_DIR + "/**/*.jar");

            File includeList = new File(this.wmProject.getWebAppRoot().getFile(), "resources/.includeJars");
            if (includeList.exists()) {

                String s = com.wavemaker.common.util.IOUtils.read(includeList);
                String[] filePaths = s.split("\n");
                for (int i = 0; i < filePaths.length; i++) {
                    projectJarSet.createInclude().setName("webapproot/resources/" + filePaths[i]);
                }

            }
        } catch (Exception e) {
            throw new BuildException(e);
        }
        return projectJarSet;
    }

    protected List<String> copyModules() throws IOException {

        List<String> moduleJarNames = new ArrayList<String>();
        List<File> mm = getModuleLocations(getClassLoader());

        Copy copyJars = new Copy();
        copyJars.setProject(getProject());
        copyJars.setPreserveLastModified(false);
        copyJars.setTaskName(TASK_NAME);
        copyJars.setFlatten(true);
        copyJars.setVerbose(this.verbose);
        copyJars.setTodir(this.wmProject.getWebInfLib().getFile());

        FileList jarsFileList = new FileList();

        for (File file : mm) {
            if (file.isDirectory()) {
                Copy copyDirs = new Copy();
                copyDirs.setProject(getProject());
                copyDirs.setTaskName("copymodules-dir");
                copyDirs.setFlatten(false);
                copyDirs.setTodir(new File(this.wmProject.getWebInfClasses().getFile(), file.getName()));

                FileSet dirsFileSet = new FileSet();
                dirsFileSet.setDir(file);
                copyDirs.add(dirsFileSet);

                copyDirs.execute();
            } else {
                FileList.FileName fileName = new FileList.FileName();
                fileName.setName(file.getAbsolutePath());
                jarsFileList.addConfiguredFile(fileName);
                moduleJarNames.add(file.getName());

                List<String> referencedJars = getReferencedClassPathJars(file, false);
                for (String ref : referencedJars) {
                    File refFile = new File(file.getParentFile(), ref);
                    if (refFile.exists()) {
                        FileList.FileName refFileName = new FileList.FileName();
                        refFileName.setName(refFile.getAbsolutePath());
                        jarsFileList.addConfiguredFile(refFileName);
                        moduleJarNames.add(ref);
                    }
                }
            }
        }

        copyJars.add(jarsFileList);
        copyJars.perform();

        return moduleJarNames;
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

        File runtimeJarFile = new File(this.from, getRuntimeJarName());
        if (!runtimeJarFile.exists()) {
            throw new IllegalStateException(runtimeJarFile + " does not exist");
        }

        List<String> runtimeJarNames = getReferencedClassPathJars(runtimeJarFile, true);

        FileSet projectJars = getProjectJarFileSet();
        List<String> moduleJars;
        try {
            moduleJars = copyModules();
        } catch (IOException e) {
            throw new BuildException(e);
        }

        // Delete all jars not included in these lists
        Delete deleteTask = new Delete();
        deleteTask.setProject(getProject());
        deleteTask.setTaskName(TASK_NAME);
        deleteTask.setVerbose(isVerbose());
        FileSet deleteFileSet = new FileSet();
        deleteFileSet.setProject(getProject());
        deleteFileSet.setDir(this.todir);
        deleteFileSet.createInclude().setName("*.jar");

        for (String runtimeJarName : runtimeJarNames) {
            deleteFileSet.createExclude().setName(runtimeJarName);
        }
        for (String projectJarName : projectJars.getDirectoryScanner().getIncludedFiles()) {
            String trimmedJarName = projectJarName.substring(ProjectConstants.LIB_DIR.length() + 1);
            deleteFileSet.createExclude().setName(trimmedJarName);
        }
        for (String moduleJarName : moduleJars) {
            deleteFileSet.createExclude().setName(moduleJarName);
        }

        deleteTask.add(deleteFileSet);
        deleteTask.perform();

        // Copy all new or out of date jars to the target directory

        Copy copyTask = new Copy();
        copyTask.setProject(getProject());
        copyTask.setPreserveLastModified(isPreserveLastModified());
        copyTask.setTaskName(TASK_NAME);
        copyTask.setOverwrite(isOverwrite());
        copyTask.setVerbose(isVerbose());
        copyTask.setFlatten(true);
        copyTask.setTodir(this.todir);

        if (!this.todir.equals(this.from)) {
            FileSet sourceRuntimeFileSet = new FileSet();
            sourceRuntimeFileSet.setDir(this.from);
            for (String runtimeJarName : runtimeJarNames) {
                sourceRuntimeFileSet.createInclude().setName(runtimeJarName);
            }
            copyTask.add(sourceRuntimeFileSet);
        }

        copyTask.add(projectJars);
        copyTask.perform();
        copyPwsFiles(this.from, this.wmProject);
    }

    protected ClasspathUtils.Delegate getDelegate() {

        if (this.cpDelegate == null) {
            this.cpDelegate = ClasspathUtils.getDelegate(this);
        }
        return this.cpDelegate;
    }

    protected ClassLoader getClassLoader() {
        return this.cpDelegate.getClassLoader();
    }

    private void copyPwsFiles(File libDir, Project wmproject) {
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
        srcPwsFileSet.setDir(pwsWebInfNode);
        srcPwsFileSet.createInclude().setName("**/*.*");
        srcPwsFileSet.createExclude().setName("**/.svn/**/*.*");

        copyTask.add(srcPwsFileSet);
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
            srcPartnerFileSet.setDir(partnerWebInfNode);
            srcPartnerFileSet.createInclude().setName("**/*.*");
            srcPartnerFileSet.createExclude().setName("**/.svn/**/*.*");

            copyTask.add(srcPartnerFileSet);
            copyTask.perform();
        }
    }

    // bean properties
    private File todir = null;

    private File from = null;

    private boolean preserveLastModified = false;

    private boolean overwrite = false;

    private boolean verbose = false;

    private ClasspathUtils.Delegate cpDelegate;

    private Project wmProject;

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

    public File getTodir() {
        return this.todir;
    }

    public void setTodir(File todir) {
        this.todir = todir;
    }

    public File getFrom() {
        return this.from;
    }

    public void setFrom(File from) {
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