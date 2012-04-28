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

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.tools.ant.BuildException;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Including;
import com.wavemaker.tools.io.Resources;
import com.wavemaker.tools.service.ServiceClassGenerator;
import com.wavemaker.tools.service.ServiceFile;

/**
 * Generate service classes.
 * 
 * @author Simon Toens
 * @author Matt Small
 */
public class ServiceCompilerTask extends CompilerTask {

    private java.io.File destDir = null;

    public ServiceCompilerTask() {
        super(true);
    }

    public void setDestDir(java.io.File destDir) {
        this.destDir = destDir;
    }

    private Resources<com.wavemaker.tools.io.File> getServiceFiles(Folder folder) {
        return folder.list(Including.fileNames().notEnding(".properties"));
    }

    @Override
    protected void doExecute() {
        for (String serviceId : getDesignServiceManager().getServiceIds()) {
            Resource serviceDir = getDesignServiceManager().getServiceRuntimeDirectory(serviceId);
            Folder serviceFolder = getDesignServiceManager().getServiceRuntimeFolder(serviceId);
            if (!serviceFolder.exists()) {
                throw new BuildException("Could not locate service home for " + serviceId);
            }
            ServiceClassGenerator generator = new ServiceClassGenerator();
            Resources<File> files = getServiceFiles(serviceFolder);
            List<ServiceFile> serviceFiles = new ArrayList<ServiceFile>();
            for (File file : files) {
                Resource resource;
                try {
                    resource = serviceDir.createRelative(file.getName());
                    serviceFiles.add(new ServiceFile(file, resource));
                } catch (IOException e) {
                    throw new IllegalStateException(e);
                }
            }
            generator.addServiceFiles(serviceFiles, serviceId);

            if (this.destDir == null) {
                generator.setOutputDirectory(serviceDir);
            } else {
                generator.setOutputDirectory(new FileSystemResource(this.destDir));
            }

            generator.setDesignServiceManager(getDesignServiceManager());
            generator.run();
        }
    }

    @Override
    protected void validate() {

        super.validate();

        if (this.destDir != null) {
            if (this.destDir.exists()) {
                if (!this.destDir.isDirectory()) {
                    throw new BuildException("destdir must be a directory");
                }
            } else {
                this.destDir.mkdirs();
            }
        }
    }

}