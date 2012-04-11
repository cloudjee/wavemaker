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

import org.hibernate.tool.ant.HibernateToolTask;
import org.hibernate.tool.ant.ExporterTask;
import org.hibernate.tool.ant.Hbm2JavaExporterTask;
import org.hibernate.tool.ant.Hbm2HbmXmlExporterTask;
import org.springframework.core.io.Resource;

public class LocalExporterFactory implements ExporterFactory {
    private String packageName;
    private String dataPackage;
    private String className;
    private boolean useIndividualCRUDOperations;
    private boolean impersonateUser;
    private String activeDirectoryDomain;

    @Override
    public ExporterTask getExporter(String type, HibernateToolTask parent, String serviceName) {

        ExporterTask task = null;
        if (type.equals("config")) {
            task = new HibernateConfigExporterTask(parent, null);
        } else if (type.equals("java")) {
            task = new Hbm2JavaExporterTask(parent);
        } else if (type.equals("query")) {
            task = new QueryExporterTask(parent, serviceName, null);
        } else if (type.equals("mapping")) {
            task = new Hbm2HbmXmlExporterTask(parent);
        } else if (type.equals("springConfig")) {
            task = new HibernateSpringConfigExporterTask(parent, null, serviceName, packageName, dataPackage,
                    className, useIndividualCRUDOperations, impersonateUser, activeDirectoryDomain);
        }
        return task;
    }

    @Override
    public void setDestDir(Resource destDir) {}

    @Override
    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    @Override
    public void setDataPackage(String dataPackage) {
        this.dataPackage = dataPackage;
    }

    @Override
    public void setClassName(String className) {
        this.className = className;
    }

    @Override
    public void setUseIndividualCRUDOperations(boolean useIndividualCRUDOperations) {
        this.useIndividualCRUDOperations = useIndividualCRUDOperations;
    }

    @Override
    public void setImpersonateUser(boolean impersonateUser) {
        this.impersonateUser = impersonateUser;
    }

    @Override
    public void setActiveDirectoryDomain(String activeDirectoryDomain) {
        this.activeDirectoryDomain = activeDirectoryDomain;
    }
}