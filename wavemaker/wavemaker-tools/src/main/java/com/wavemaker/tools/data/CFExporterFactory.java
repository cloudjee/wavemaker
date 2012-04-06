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
import org.springframework.core.io.Resource;
import net.sf.cglib.proxy.Enhancer;

public class CFExporterFactory implements ExporterFactory {
    private Resource destDir;
    private String packageName;
    private String dataPackage;
    private String className;
    private boolean useIndividualCRUDOperations;
    private boolean impersonateUser;
    private String activeDirectoryDomain;

    public ExporterTask getExporter(String type, HibernateToolTask parent, String serviceName) {
        Enhancer enhancer = new Enhancer();
        enhancer.setCallbackType(ExporterTaskInterceptor.class);
        enhancer.setCallback(new ExporterTaskInterceptor());

        ExporterTask proxy = null;
        if (type.equals("config")) {
            enhancer.setSuperclass(HibernateConfigExporterTask.class);
            enhancer.setClassLoader(HibernateConfigExporterTask.class.getClassLoader());
            proxy = (HibernateConfigExporterTask)enhancer.create(new Class[] {HibernateToolTask.class, Resource.class},
                        new Object[] {parent, this.destDir}) ;
        } else if (type.equals("java")) {
            enhancer.setSuperclass(Hbm2JavaExporterTaskWrapper.class);
            enhancer.setClassLoader(Hbm2JavaExporterTaskWrapper.class.getClassLoader());
            proxy = (Hbm2JavaExporterTaskWrapper)enhancer.create(new Class[] {HibernateToolTask.class, Resource.class},
                        new Object[] {parent, this.destDir}) ;
        } else if (type.equals("query")) {
            enhancer.setSuperclass(QueryExporterTask.class);
            enhancer.setClassLoader(QueryExporterTask.class.getClassLoader());
            proxy = (QueryExporterTask)enhancer.create(new Class[] {HibernateToolTask.class, String.class, Resource.class},
                        new Object[] {parent, serviceName, this.destDir}) ;
        } else if (type.equals("mapping")) {
            enhancer.setSuperclass(Hbm2HbmXmlExporterTaskWrapper.class);
            enhancer.setClassLoader(Hbm2HbmXmlExporterTaskWrapper.class.getClassLoader());
            proxy = (Hbm2HbmXmlExporterTaskWrapper)enhancer.create(new Class[] {HibernateToolTask.class, Resource.class},
                        new Object[] {parent, this.destDir}) ;
        } else if (type.equals("springConfig")) {
            enhancer.setSuperclass(HibernateSpringConfigExporterTask.class);
            enhancer.setClassLoader(HibernateSpringConfigExporterTask.class.getClassLoader());
            proxy = (HibernateSpringConfigExporterTask)enhancer.create(new Class[] {HibernateToolTask.class, Resource.class,
                        String.class, String.class, String.class, String.class, boolean.class, boolean.class, String.class},
                        new Object[] {parent, this.destDir, serviceName, this.packageName, this.dataPackage,
                        this.className, this.useIndividualCRUDOperations, this.impersonateUser, this.activeDirectoryDomain}) ;
        }
        return proxy;
    }

    public void setDestDir(Resource destDir) {
        this.destDir = destDir;   
    }

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