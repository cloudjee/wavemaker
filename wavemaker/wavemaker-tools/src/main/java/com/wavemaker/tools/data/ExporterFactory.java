/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

import org.hibernate.tool.ant.ExporterTask;
import org.hibernate.tool.ant.HibernateToolTask;

import com.wavemaker.tools.io.Folder;

/**
 * This interface defines methods to return hibernate exporter factory
 * 
 * @author Seung Lee
 * 
 */
public interface ExporterFactory {

    /**
     * Generates the list of services for a partner.
     * 
     * @param type the exporter type (config, java, query, mapping)
     * @param parent the hibernate tool task
     * @param serviceName the service name
     * @return an instance of the exporter factory
     */
    public ExporterTask getExporter(String type, HibernateToolTask parent, String serviceName);

    /**
     * Sets the destination directory for cloud foundry
     * 
     * @param destDir the destination directory
     */
    public void setDestDir(Folder destDir);

    public void setPackageName(String packageName);

    public void setDataPackage(String dataPackage);

    public void setClassName(String className);

    public void setUseIndividualCRUDOperations(boolean useIndividualCRUDOperations);

    public void setImpersonateUser(boolean impersonateUser);

    public void setActiveDirectoryDomain(String activeDirectoryDomain);
}
