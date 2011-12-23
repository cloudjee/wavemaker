/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.tools.ant.BuildException;
import org.springframework.core.io.FileSystemResource;
import org.springframework.util.StringUtils;

import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.tools.javaservice.JavaServiceDefinition;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.util.DesignTimeUtils;

/**
 * Compile servicedefs from .class files (and maybe old servicedef xml files). This will treat services as Java services
 * (using reflection to discover method attributes and other information), and so should only be used on Java services.
 * All other services should be configured through the studio.
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class ServiceDefCompilerTask extends CompilerTask {

    private final List<NestedService> nestedServices;

    private File classesDir = null;

    private String mavenClasspath;

    public ServiceDefCompilerTask() {
        this(true);
    }

    public ServiceDefCompilerTask(boolean init) {
        super(init);
        setProjectRootRequired(true);
        this.nestedServices = new ArrayList<NestedService>();
    }

    public void addService(NestedService service) {
        this.nestedServices.add(service);
    }

    /**
     * Location where the JavaServiceDefinition should expect the compiled .class files for the services to be.
     * 
     * @param classesDir
     */
    public void setClassesDir(File classesDir) {
        this.classesDir = classesDir;
    }

    public void setMavenClasspath(String mavenClasspath) {
        this.mavenClasspath = mavenClasspath;
    }

    @Override
    protected void doExecute() {

        DesignServiceManager dsm = DesignTimeUtils.getDSMForProjectRoot(new FileSystemResource(getProjectRoot()));

        for (NestedService ns : this.nestedServices) {
            String serviceId = ns.getServiceId();
            String fqClassName = ns.getServiceClass(dsm);

            try {
                File serviceDefXml = dsm.getServiceDefXml(serviceId).getFile();
                boolean reGen = true;
                File serviceSrc = dsm.getServiceRuntimeDirectory(serviceId).getFile();

                File serviceSrcFile = new File(serviceSrc, fqClassName.replace('.', '/') + ".java");
                if (serviceSrcFile.exists() && serviceDefXml.exists() && serviceSrcFile.lastModified() <= serviceDefXml.lastModified()) {
                    // System.out.println("service "+serviceId+" is up to date, don't regen");
                    reGen = false;
                }

                if (reGen) {
                    System.out.println("creating servicedef for service " + serviceId);

                    ServiceDefinition serviceDef;

                    if (this.classesDir == null) {
                        this.classesDir = dsm.getProjectManager().getCurrentProject().getWebInfClasses().getFile();
                    }

                    if (StringUtils.hasText(this.mavenClasspath)) {
                        String[] paths = this.mavenClasspath.split(File.pathSeparator);
                        File[] classPathFiles = new File[paths.length];
                        for (int i = 0; i < paths.length; i++) {
                            classPathFiles[i] = new File(paths[i]).getParentFile();
                        }
                        serviceDef = new JavaServiceDefinition(fqClassName, serviceId, Arrays.asList(new File[] { this.classesDir }),
                            Arrays.asList(classPathFiles), dsm.getExcludeTypeNames(serviceId));
                    } else {
                        serviceDef = new JavaServiceDefinition(fqClassName, serviceId, new FileSystemResource(this.classesDir),
                            dsm.getProjectManager().getCurrentProject().getWebInfLib(), dsm.getExcludeTypeNames(serviceId));
                    }

                    dsm.defineService(serviceDef);
                }
            } catch (ClassNotFoundException e) {
                throw new BuildException(e);
            } catch (LinkageError e) {
                throw new BuildException(e);
            } catch (IOException e) {
                throw new BuildException(e);
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
            return this.serviceId;
        }

        public void setServiceId(String serviceId) {
            this.serviceId = serviceId;
        }

        /**
         * Sets the service class name. This is optional; if it is not set, a default will be used; see
         * {@link #getServiceClass()}.
         * 
         * @param serviceClass
         */
        public void setServiceClass(String serviceClass) {
            this.serviceClass = serviceClass;
        }

        /**
         * Gets the service class name. This is determined by the following (in order):
         * 
         * <ol>
         * <li>Value set in {@link #setServiceClass(String)}.</li>
         * <li>Value currently in the servicedef.xml associated with this service.</li>
         * <li>If there is only a single Java file in this service's src directory, that will be used.</li>
         * </ol>
         * 
         * If none of those conditions are met, an Exception will be thrown.
         * 
         * @return The serviceClassName for the service being configured.
         */
        public String getServiceClass(DesignServiceManager dsm) {

            try {
                String ret = null;
                File serviceDefXml = dsm.getServiceDefXml(this.serviceId).getFile();
                File serviceSrc = dsm.getServiceRuntimeDirectory(this.serviceId).getFile();

                if (this.serviceClass != null) {
                    ret = this.serviceClass;
                } else if (serviceDefXml.exists()) {
                    Service sTemp = dsm.getService(this.serviceId);
                    ret = sTemp.getClazz();
                } else {
                    Collection<?> files = FileUtils.listFiles(serviceSrc, new String[] { "java" }, true);

                    if (1 != files.size()) {
                        throw new BuildException("Couldn't determine class for service; create a servicedef: " + files);
                    }
                    for (Object o : files) {
                        ret = "";
                    }
                }

                return ret;
            } catch (IOException ex) {
                throw new BuildException(ex);
            }
        }
    }
}