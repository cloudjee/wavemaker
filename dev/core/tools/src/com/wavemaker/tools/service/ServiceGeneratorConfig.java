/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
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

    private List<FileSet> filesets = new ArrayList<FileSet>();

    private List<File> serviceFiles = null;

    private final Task parent;

    public ServiceGeneratorConfig(Task parent) {
        this.parent = parent;
    }

    public void validate() {

        if (service != null) {
            if (service.exists()) {
                if (service.isDirectory()) {
                    throw new BuildException(
                            "Service cannot be a directory: "
                                    + service.getAbsolutePath()
                                    + ".  Use a nested fileset to load all files within a directory.");
                }
            } else {
                throw new BuildException(service.getAbsolutePath()
                        + " doesn't exist");
            }
        }

        if (getServiceFiles().size() == 0) {
            throw new BuildException(
                    "Either \"service\" must be set, or use a nested fileset");
        }

        if (destDir == null) {
            throw new BuildException("\"destDir\" must be set");
        }

    }
    
    public void addServiceFile(File f) {
        
    }

    public void addFileset(FileSet fileset) {
        filesets.add(fileset);
    }

    public List<File> getServiceFiles() {

        if (serviceFiles != null) {
            return serviceFiles;
        }

        serviceFiles = new ArrayList<File>();

        for (FileSet fs : filesets) {
            DirectoryScanner ds = fs.getDirectoryScanner(parent.getProject());
            String[] includedFiles = ds.getIncludedFiles();
            for (int i = 0; i < includedFiles.length; i++) {
                serviceFiles.add(new File(ds.getBasedir(), includedFiles[i]));
            }
        }

        if (service != null) {
            serviceFiles.add(service);
        }

        return serviceFiles;
    }

    public void setPackage(String s) {
        destinationPackage = s;
    }

    public String getPackage() {
        return destinationPackage;
    }

    public void setService(File f) {
        service = f;
    }

    public void setDestDir(File f) {
        destDir = f;
    }

    public File getOutputDirectory() {
        return destDir;
    }
}
