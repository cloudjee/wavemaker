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

import java.io.IOException;
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
import javax.xml.bind.JAXBException;

import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.service.ConfigurationCompiler;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.service.definitions.ServiceComparator;

@SupportedAnnotationTypes("*")
@SupportedSourceVersion(SourceVersion.RELEASE_6)
@SupportedOptions({ ServiceProcessorConstants.PROJECT_NAME_PROP, ServiceProcessorConstants.PROJECT_ROOT_PROP })
public class ServiceConfigurationProcessor extends AbstractStudioServiceProcessor {

    private Resource servicesXml;

    private Resource managersXml;

    private Resource typesJs;

    private Project project;

    @Override
    protected void doInit(ProcessingEnvironment processingEnv) {
        this.project = this.designServiceManager.getProjectManager().getCurrentProject();
        try {
            this.servicesXml = this.project.getWebInf().createRelative(ConfigurationCompiler.RUNTIME_SERVICES);
            this.managersXml = this.project.getWebInf().createRelative(ConfigurationCompiler.RUNTIME_MANAGERS);
            this.typesJs = this.project.getWebAppRoot().createRelative(ConfigurationCompiler.TYPE_RUNTIME_FILE);
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    @Override
    protected boolean doProcess(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        boolean modifiedSMD = false;
        boolean modifiedXML = false;

        try {
            SortedSet<Service> services = new TreeSet<Service>(new ServiceComparator());
            Set<String> serviceIds = this.designServiceManager.getServiceIds();
            for (String serviceId : serviceIds) {
                Resource serviceDef = this.designServiceManager.getServiceDefXml(serviceId);
                Service service = DesignServiceManager.loadServiceDefinition(serviceDef.getInputStream(), true);
                services.add(service);
                Resource smd = ConfigurationCompiler.getSmdFile(this.project, serviceId);
                if (!smd.exists() || smd.lastModified() < serviceDef.lastModified()) {
                    this.processingEnv.getMessager().printMessage(Kind.NOTE, "Generating SMD for " + serviceId);
                    ConfigurationCompiler.generateSMD(this.project, service);
                    modifiedSMD = true;
                }
            }

            if (!this.servicesXml.exists() || !this.managersXml.exists() || !this.typesJs.exists() || modifiedSMD) {
                this.processingEnv.getMessager().printMessage(Kind.NOTE, "Generating " + ConfigurationCompiler.RUNTIME_SERVICES);
                ConfigurationCompiler.generateServices(this.project, this.servicesXml, services);
                this.processingEnv.getMessager().printMessage(Kind.NOTE, "Generating " + ConfigurationCompiler.RUNTIME_MANAGERS);
                ConfigurationCompiler.generateManagers(this.project, this.managersXml, services);
                modifiedXML = true;
            }

            if (modifiedSMD || modifiedXML) {
                this.processingEnv.getMessager().printMessage(Kind.NOTE, "Generating " + ConfigurationCompiler.TYPE_RUNTIME_FILE);
                ConfigurationCompiler.generateTypes(this.project, this.typesJs, services, this.designServiceManager.getPrimitiveDataObjects());
            }

        } catch (IOException e) {
            e.printStackTrace();
            throw new WMRuntimeException(e);
        } catch (JAXBException e) {
            e.printStackTrace();
            throw new WMRuntimeException(e);
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
            throw new WMRuntimeException(e);
        } catch (RuntimeException e) {
            e.printStackTrace();
            throw e;
        }

        return false;
    }

}
