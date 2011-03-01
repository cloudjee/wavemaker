/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.ant;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.tools.ant.BuildException;

import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.tools.javaservice.JavaServiceDefinition;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.util.DesignTimeUtils;


/**
 * Compile servicedefs from .class files (and maybe old servicedef xml files).
 * This will treat services as Java services (using
 * reflection to discover method attributes and other information), and so
 * should only be used on Java services.  All other services should be
 * configured through the studio.
 *
 * @author small
 * @version $Rev$ - $Date:2008-05-30 16:38:13 -0700 (Fri, 30 May 2008) $
 *
 */
public class ServiceDefCompilerTask extends CompilerTask {

    private final List<NestedService> nestedServices;
    private File classesDir = null;

    public ServiceDefCompilerTask() {
        this(true);
    }

    public ServiceDefCompilerTask(boolean init) {
        super(init);
        setProjectRootRequired(true);
        nestedServices = new ArrayList<NestedService>();
    }

    public void addService(NestedService service) {
        nestedServices.add(service);
    }
    
    /**
     * Location where the JavaServiceDefinition should expect the compiled
     * .class files for the services to be.
     * 
     * @param classesDir
     */
    public void setClassesDir(File classesDir) {
        this.classesDir = classesDir;
    }


    /* (non-Javadoc)
     * @see com.wavemaker.tools.ant.CompilerTask#doExecute()
     */
    @Override
    protected void doExecute() {

        DesignServiceManager dsm = DesignTimeUtils.getDSMForProjectRoot(
                getProjectRoot(), true);

        for (NestedService ns: nestedServices) {
            String serviceId = ns.getServiceId();
            String fqClassName = ns.getServiceClass(dsm);

            File serviceDefXml = dsm.getServiceDefXml(serviceId);
            boolean reGen = true;
            File serviceSrc = dsm.getServiceRuntimeDirectory(serviceId);
            
            File serviceSrcFile = new File(serviceSrc,
                    fqClassName.replace('.', '/') + ".java");
            if (serviceSrcFile.exists() && serviceDefXml.exists()
                    && (serviceSrcFile.lastModified() <= serviceDefXml
                            .lastModified())) {
                // System.out.println("service "+serviceId+" is up to date, don't regen");
                reGen = false;
            }

            if (reGen) {
                System.out.println("creating servicedef for service "
                        + serviceId);
                
                ServiceDefinition serviceDef;
                try {
                    if (null==classesDir) {
                        classesDir = dsm.getProjectManager().getCurrentProject().getWebInfClasses();
                    }
                    
                    serviceDef = new JavaServiceDefinition(fqClassName,
                            serviceId, classesDir,
                            dsm.getProjectManager().getCurrentProject().getWebInfLib(),
                            dsm.getExcludeTypeNames(serviceId));
                } catch (ClassNotFoundException e) {
                    throw new BuildException(e);
                } catch (LinkageError e) {
                    throw new BuildException(e);
                }

                dsm.defineService(serviceDef);
            }
        }
    }



    public static class NestedService {
        
        private String serviceId;
        private String serviceClass = null;

        public NestedService() {
        }
        public NestedService(String serviceId) {
            this();
            this.serviceId = serviceId;
        }

        public String getServiceId() {
            return serviceId;
        }

        public void setServiceId(String serviceId) {
            this.serviceId = serviceId;
        }
        
        /**
         * Sets the service class name.  This is optional; if it is not set, a
         * default will be used; see {@link #getServiceClass()}.
         * @param serviceClass
         */
        public void setServiceClass(String serviceClass) {
            this.serviceClass = serviceClass;
        }
        
        /**
         * Gets the service class name.  This is determined by the following (in
         * order):
         * 
         * <ol>
         *  <li>Value set in {@link #setServiceClass(String)}.</li>
         *  <li>Value currently in the servicedef.xml associated with this service.</li>
         *  <li>If there is only a single Java file in this service's src directory, that will be used.</li>
         * </ol>
         * 
         * If none of those conditions are met, an Exception will be thrown.
         * 
         * @return The serviceClassName for the service being configured.
         */
        public String getServiceClass(DesignServiceManager dsm) {
            
            String ret = null;
            File serviceDefXml = dsm.getServiceDefXml(serviceId);
            File serviceSrc = dsm.getServiceRuntimeDirectory(serviceId);
            
            if (null!=this.serviceClass) {
                ret = this.serviceClass;
            } else if (serviceDefXml.exists()) {
                Service sTemp = dsm.getService(serviceId);
                ret = sTemp.getClazz();
            } else {
                Collection<?> files = FileUtils.listFiles(serviceSrc,
                        new String[]{"java"}, true);

                if (1!=files.size()) {
                    throw new BuildException("Couldn't determine class for service; create a servicedef: "+files);
                }
                for (Object o: files) {
                    File cF = (File) o;
                    ret = JavaServiceDefinition.getFQClassFromFile(cF,
                            dsm.getServiceRuntimeDirectory(serviceId));
                }
            }
            
            return ret;
        }
    }
}