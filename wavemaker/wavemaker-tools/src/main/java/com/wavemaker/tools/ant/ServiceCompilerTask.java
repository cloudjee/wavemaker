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
import java.util.ArrayList;
import java.util.List;

import org.apache.tools.ant.BuildException;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.wavemaker.tools.service.ServiceClassGenerator;

/**
 * Generate service classes.
 * 
 * @author Simon Toens
 * @author Matt Small
 */
public class ServiceCompilerTask extends CompilerTask {

    private File destDir = null;

    public ServiceCompilerTask() {
        super(true);
    }

    public void setDestDir(File destDir) {
        this.destDir = destDir;
    }

    private List<Resource> getServiceFiles(Resource srcDir) throws IOException {

        List<Resource> rtn = new ArrayList<Resource>();

        if (srcDir != null && srcDir.exists()) {
            List<Resource> children = fileSystem.listChildren(srcDir);
            for (Resource child : children) {
                Resource f = srcDir.createRelative(fileSystem.getPath(child));
                // lets skip directories and properties files for now
                if (fileSystem.isDirectory(f) || f.getFilename().endsWith(".properties")) {
                    continue;
                }
                rtn.add(f);
            }
        }

        return rtn;
    }

    @Override
    protected void doExecute() {

        for (String serviceId : getDesignServiceManager().getServiceIds()) {

            Resource srcDir;
            srcDir = getDesignServiceManager().getServiceRuntimeDirectory(serviceId);

            if (srcDir == null) {
                throw new BuildException("Could not locate service home for " + serviceId);
            }

            ServiceClassGenerator generator = new ServiceClassGenerator();

            try {
                generator.addServiceFiles(getServiceFiles(srcDir), serviceId);
            } catch (IOException ex) {
                throw new BuildException(ex);
            }

            if (this.destDir == null) {
                generator.setOutputDirectory(srcDir);
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