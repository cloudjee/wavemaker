/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.DirectoryScanner;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.types.FileSet;

/**
 * Nested within main ActiveGrid Ant Task.
 * 
 * @author Simon Toens
 */
public class ServiceGeneratorConfig {

    private File destDir = null;

    private File service = null;

    private String destinationPackage = null;

    private final List<FileSet> filesets = new ArrayList<FileSet>();

    private List<File> serviceFiles = null;

    private final Task parent;

    public ServiceGeneratorConfig(Task parent) {
        this.parent = parent;
    }

    public void validate() {

        if (this.service != null) {
            if (this.service.exists()) {
                if (this.service.isDirectory()) {
                    throw new BuildException("Service cannot be a directory: " + this.service.getAbsolutePath()
                        + ".  Use a nested fileset to load all files within a directory.");
                }
            } else {
                throw new BuildException(this.service.getAbsolutePath() + " doesn't exist");
            }
        }

        if (getServiceFiles().size() == 0) {
            throw new BuildException("Either \"service\" must be set, or use a nested fileset");
        }

        if (this.destDir == null) {
            throw new BuildException("\"destDir\" must be set");
        }

    }

    public void addServiceFile(File f) {

    }

    public void addFileset(FileSet fileset) {
        this.filesets.add(fileset);
    }

    public List<File> getServiceFiles() {

        if (this.serviceFiles != null) {
            return this.serviceFiles;
        }

        this.serviceFiles = new ArrayList<File>();

        for (FileSet fs : this.filesets) {
            DirectoryScanner ds = fs.getDirectoryScanner(this.parent.getProject());
            String[] includedFiles = ds.getIncludedFiles();
            for (int i = 0; i < includedFiles.length; i++) {
                this.serviceFiles.add(new File(ds.getBasedir(), includedFiles[i]));
            }
        }

        if (this.service != null) {
            this.serviceFiles.add(this.service);
        }

        return this.serviceFiles;
    }

    public void setPackage(String s) {
        this.destinationPackage = s;
    }

    public String getPackage() {
        return this.destinationPackage;
    }

    public void setService(File f) {
        this.service = f;
    }

    public void setDestDir(File f) {
        this.destDir = f;
    }

    public File getOutputDirectory() {
        return this.destDir;
    }
}
