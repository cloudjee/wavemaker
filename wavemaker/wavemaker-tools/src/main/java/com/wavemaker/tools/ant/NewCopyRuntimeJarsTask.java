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
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.jar.JarFile;
import java.util.jar.Manifest;

import org.apache.tools.ant.Task;
import org.apache.commons.lang.ArrayUtils;
import org.springframework.core.io.FileSystemResource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.io.local.LocalFolder;
import com.wavemaker.tools.io.Resources;
import com.wavemaker.tools.io.FilterOn;
import com.wavemaker.tools.io.ResourceFilter;
import com.wavemaker.tools.project.LocalStudioFileSystem;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;

public class NewCopyRuntimeJarsTask extends Task {

    public static final String CLASSPATH_ATTR_NAME = "Class-Path";

    private static final String RUNTIME_JAR_PROPERTIES = "META-INF/runtimejar.properties";

    private static final String RUNTIME_JAR_PROPERTY_KEY = "runtimejar.name";

    private static final String DEFAULT_RUNTIME_JAR_NAME = "wavemaker-runtime.jar";

    private LocalFolder todir = null;

    private LocalFolder from = null;

    private boolean preserveLastModified = false;

    private boolean overwrite = false;

    private boolean verbose = false;

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
        String[] runtimeJarNamesArr = runtimeJarNames.toArray(new String[runtimeJarNames.size()]);

        Resources<com.wavemaker.tools.io.File> projectJars = getProjectJarFileSet();
        List<com.wavemaker.tools.io.File> projJarList = projectJars.fetchAll();
        String[] proJarNamesArr = null;
        if (projJarList != null && projJarList.size() > 0) {
            proJarNamesArr = new String[projJarList.size()];
            int i = 0;
            for (com.wavemaker.tools.io.File projJar :projJarList) {
                proJarNamesArr[i] = projJar.getName();
                i++;
            }
        }

        // Delete all jars not included in these lists

        ResourceFilter included = FilterOn.antPattern("*.jar");

        ResourceFilter excluded = FilterOn.caseSensitiveNames().matching((String[]) ArrayUtils.addAll(runtimeJarNamesArr, proJarNamesArr));

        this.todir.find().include(included).exclude(excluded).files().delete();

        // Copy all new or out of date jars to the target directory

        if (!this.todir.equals(this.from)) {
            Resources<com.wavemaker.tools.io.File> sourceRuntimeFileSet =
                    this.from.find().include(FilterOn.caseSensitiveNames().matching(runtimeJarNamesArr)).files();
            for (com.wavemaker.tools.io.File file : sourceRuntimeFileSet) {
                file.copyToIfNewer(this.todir);
            }
        }

        for (com.wavemaker.tools.io.File file : projectJars) {
            file.copyToIfNewer(this.todir);
        }

        //TODO:ant - copy pws files when supporting pws module
        //copyPwsFiles(this.from, this.wmProject);
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