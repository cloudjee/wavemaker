/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

import com.wavemaker.tools.service.ServiceClassGenerator;

/**
 * Generate service classes.
 * 
 * @author Simon Toens
 * @author Matt Small
 * @version $Rev$ - $Date$
 */
public class ServiceCompilerTask extends CompilerTask {

    private File destDir = null;

    public ServiceCompilerTask() {
        super(true);
    }

    public void setDestDir(File destDir) {
        this.destDir = destDir;
    }

    private List<File> getServiceFiles(File srcDir) {

        List<File> rtn = new ArrayList<File>();

        if (srcDir != null && srcDir.exists()) {
            for (String s : srcDir.list()) {
                File f = new File(srcDir, s);
                // lets skip directories and properties files for now
                if (f.isDirectory() || f.getName().endsWith(".properties")) {
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

            File srcDir;
            try {
                srcDir = getDesignServiceManager().getServiceRuntimeDirectory(serviceId).getFile();
            } catch (IOException ex) {
                throw new BuildException(ex);
            }

            if (srcDir == null) {
                throw new BuildException("Could not locate service home for " + serviceId);
            }

            ServiceClassGenerator generator = new ServiceClassGenerator();

            generator.addServiceFiles(getServiceFiles(srcDir), serviceId);

            if (this.destDir == null) {
                generator.setOutputDirectory(new FileSystemResource(srcDir));
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