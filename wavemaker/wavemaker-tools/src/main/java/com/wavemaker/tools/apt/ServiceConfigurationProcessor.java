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

package com.wavemaker.tools.apt;

import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import javax.annotation.processing.ProcessingEnvironment;
import javax.annotation.processing.RoundEnvironment;
import javax.annotation.processing.SupportedAnnotationTypes;
import javax.annotation.processing.SupportedOptions;
import javax.annotation.processing.SupportedSourceVersion;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.TypeElement;
import javax.tools.Diagnostic.Kind;

import org.springframework.core.io.Resource;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.service.ConfigurationCompiler;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.service.definitions.ServiceComparator;

@SupportedAnnotationTypes("*")
@SupportedSourceVersion(SourceVersion.RELEASE_6)
@SupportedOptions({ ServiceProcessorConstants.PROJECT_NAME_PROP, ServiceProcessorConstants.PROJECT_ROOT_PROP })
public class ServiceConfigurationProcessor extends AbstractStudioServiceProcessor {

    private File servicesXml;

    private File managersXml;

    private File typesJs;

    @Override
    protected void doInit(ProcessingEnvironment processingEnv) throws Exception {
        this.servicesXml = getProject().getWebInfFolder().getFile(ConfigurationCompiler.RUNTIME_SERVICES);
        this.managersXml = getProject().getWebInfFolder().getFile(ConfigurationCompiler.RUNTIME_MANAGERS);
        this.typesJs = getProject().getWebAppRootFolder().getFile(ConfigurationCompiler.TYPE_RUNTIME_FILE);
    }

    @Override
    protected boolean doProcess(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) throws Exception {
        boolean modifiedSMD = false;
        boolean modifiedXML = false;

        SortedSet<Service> services = new TreeSet<Service>(new ServiceComparator());
        Set<String> serviceIds = getDesignServiceManager().getServiceIds();
        for (String serviceId : serviceIds) {
            Resource serviceDef = getDesignServiceManager().getServiceDefXml(serviceId);
            Service service = DesignServiceManager.loadServiceDefinition(serviceDef.getInputStream(), true);
            services.add(service);
            Resource smd = ConfigurationCompiler.getSmdFile(getProject(), serviceId);
            if (!smd.exists() || smd.lastModified() < serviceDef.lastModified()) {
                this.processingEnv.getMessager().printMessage(Kind.NOTE, "Generating SMD for " + serviceId);
                ConfigurationCompiler.generateSMD(getProject(), service);
                modifiedSMD = true;
            }
        }

        if (!this.servicesXml.exists() || !this.managersXml.exists() || !this.typesJs.exists() || modifiedSMD) {
            this.processingEnv.getMessager().printMessage(Kind.NOTE, "Generating " + ConfigurationCompiler.RUNTIME_SERVICES);
            ConfigurationCompiler.generateServices(this.servicesXml, services);
            this.processingEnv.getMessager().printMessage(Kind.NOTE, "Generating " + ConfigurationCompiler.RUNTIME_MANAGERS);
            ConfigurationCompiler.generateManagers(this.managersXml, services);
            modifiedXML = true;
        }

        if (modifiedSMD || modifiedXML) {
            this.processingEnv.getMessager().printMessage(Kind.NOTE, "Generating " + ConfigurationCompiler.TYPE_RUNTIME_FILE);
            ConfigurationCompiler.generateTypes(this.typesJs, services, getDesignServiceManager().getPrimitiveDataObjects());
        }

        return false;
    }

}
