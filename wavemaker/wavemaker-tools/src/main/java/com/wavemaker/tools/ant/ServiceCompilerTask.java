/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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

import java.util.ArrayList;
import java.util.List;

import org.apache.tools.ant.BuildException;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.FilterOn;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resources;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.ServiceClassGenerator;
import com.wavemaker.tools.service.ServiceFile;

/**
 * Generate service classes.
 * 
 * @author Simon Toens
 * @author Matt Small
 */
public class ServiceCompilerTask extends CompilerTask {

    private Folder destDir = null;

    public ServiceCompilerTask() {
        super(true);
    }

    public void setDestDir(Folder destDir) {
        this.destDir = destDir;
    }

    private Resources<com.wavemaker.tools.io.File> getServiceFiles(Folder folder) {
        return folder.list().files().include(FilterOn.names().notEnding(".properties"));
    }

    @Override
    public void doExecute() {
        for (String serviceId : getDesignServiceManager().getServiceIds()) {
            processService(getDesignServiceManager(), serviceId);
        }
    }

    public void processService(DesignServiceManager serviceMgr, String serviceId) {
        Folder serviceDir = serviceMgr.getServiceRuntimeFolder(serviceId);
        Folder serviceFolder = serviceMgr.getServiceRuntimeFolder(serviceId);
        if (!serviceFolder.exists()) {
            throw new BuildException("Could not locate service home for " + serviceId);
        }
        ServiceClassGenerator generator = new ServiceClassGenerator();
        Resources<File> files = getServiceFiles(serviceFolder);
        List<ServiceFile> serviceFiles = new ArrayList<ServiceFile>();
        for (File file : files) {
            File resource = serviceDir.getFile(file.getName());
            serviceFiles.add(new ServiceFile(file, resource));
        }
        generator.addServiceFiles(serviceFiles, serviceId);

        if (this.destDir == null) {
            generator.setOutputDirectory(serviceDir);
        } else {
            generator.setOutputDirectory(this.destDir);
        }

        generator.setDesignServiceManager(serviceMgr);
        generator.run();
    }

    @Override
    protected void validate() {

        super.validate();

        if (this.destDir != null) {
            this.destDir.createIfMissing();
        }
    }

}