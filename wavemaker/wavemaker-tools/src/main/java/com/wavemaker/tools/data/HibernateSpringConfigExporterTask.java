/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.data;

import org.hibernate.tool.ant.GenericExporterTask;
import org.hibernate.tool.ant.HibernateToolTask;
import org.hibernate.tool.hbm2x.Exporter;

import com.wavemaker.tools.io.Folder;

public class HibernateSpringConfigExporterTask extends GenericExporterTask {

    private final Folder destDir;

    private final String serviceName;

    private final String packageName;

    private final String dataPackage;

    private final String className;

    private final boolean useIndividualCRUDOperations;

    private final boolean impersonateUser;

    private final String activeDirectoryDomain;

    public HibernateSpringConfigExporterTask(HibernateToolTask parent, Folder destDir, String serviceName, String packageName, String dataPackage,
        String className, boolean useIndividualCRUDOperations, boolean impersonateUser, String activeDirectoryDomain) {
        super(parent);
        this.destDir = destDir;
        this.serviceName = serviceName;
        this.packageName = packageName;
        this.dataPackage = dataPackage;
        this.className = className;
        this.useIndividualCRUDOperations = useIndividualCRUDOperations;
        this.impersonateUser = impersonateUser;
        this.activeDirectoryDomain = activeDirectoryDomain;
    }

    @Override
    public Exporter createExporter() {
        return new HibernateSpringConfigExporter(this.serviceName, this.packageName, this.dataPackage, this.className,
            this.useIndividualCRUDOperations, this.impersonateUser, this.activeDirectoryDomain);
    }

    public Folder getDestDir() {
        return this.destDir;
    }

    public HibernateToolTask getParent() {
        return super.parent;
    }
}