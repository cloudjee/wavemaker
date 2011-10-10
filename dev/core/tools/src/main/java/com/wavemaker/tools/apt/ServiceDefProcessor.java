/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.annotation.processing.ProcessingEnvironment;
import javax.annotation.processing.RoundEnvironment;
import javax.annotation.processing.SupportedAnnotationTypes;
import javax.annotation.processing.SupportedOptions;
import javax.annotation.processing.SupportedSourceVersion;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.Element;
import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;
import javax.lang.model.element.VariableElement;
import javax.lang.model.type.TypeKind;
import javax.lang.model.type.TypeMirror;
import javax.lang.model.util.ElementKindVisitor6;
import javax.lang.model.util.ElementScanner6;
import javax.tools.Diagnostic.Kind;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.PrimitiveTypeDefinition;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.runtime.service.definition.ServiceOperation;
import com.wavemaker.tools.javaservice.JavaServiceDefinition;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.service.DesignServiceManager;

@SupportedAnnotationTypes("*")
@SupportedSourceVersion(SourceVersion.RELEASE_6)
@SupportedOptions({ ServiceProcessorConstants.PROJECT_NAME_PROP, ServiceProcessorConstants.PROJECT_ROOT_PROP,
    ServiceProcessorConstants.SERVICE_ID_PROP, ServiceProcessorConstants.SERVICE_CLASS_PROP, ServiceProcessorConstants.CLASS_PATH_SERVICE_PROP })
public class ServiceDefProcessor extends AbstractStudioServiceProcessor {

    private static final String LIVE_SERVICE_CLASS = "com.wavemaker.runtime.service.LiveDataService";

    private String serviceId;

    private String serviceClass;

    private boolean classPathService = false;

    private List<String> excludeTypeNames;

    @Override
    protected void doInit(ProcessingEnvironment processingEnv) {
        this.serviceId = processingEnv.getOptions().get(ServiceProcessorConstants.SERVICE_ID_PROP);
        this.serviceClass = processingEnv.getOptions().get(ServiceProcessorConstants.SERVICE_CLASS_PROP);
        if (processingEnv.getOptions().containsKey(ServiceProcessorConstants.CLASS_PATH_SERVICE_PROP)) {
            this.classPathService = Boolean.valueOf(processingEnv.getOptions().get(ServiceProcessorConstants.CLASS_PATH_SERVICE_PROP));
        }
        this.excludeTypeNames = this.designServiceManager.getExcludeTypeNames(this.serviceId);
    }

    @Override
    protected boolean doProcess(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {

        if (!isInitialized()) {
            return false;
        }

        if (roundEnv.processingOver()) {
            return false;
        }

        if (!StringUtils.hasText(this.serviceId)) {
            this.processingEnv.getMessager().printMessage(Kind.ERROR, "serviceId option is required.");
            return true;
        }

        if (this.classPathService) {
            TypeElement type = this.processingEnv.getElementUtils().getTypeElement(this.serviceClass);
            if (type == null) {
                this.processingEnv.getMessager().printMessage(Kind.ERROR,
                    "Could not locate " + this.serviceClass + " on the classpath for processing.");
                return true;
            }
            return processService(type);
        } else {
            for (Element e : roundEnv.getRootElements()) {
                if (e instanceof TypeElement) {
                    TypeElement type = (TypeElement) e;
                    if (StringUtils.hasText(this.serviceClass) && type.getQualifiedName().contentEquals(this.serviceClass)
                        || !StringUtils.hasText(this.serviceClass) && type.getSimpleName().toString().endsWith("Service")) {
                        return processService(type);
                    }
                }
            }
        }
        return false;
    }

    @Override
    public void setDesignServiceManager(DesignServiceManager designServiceManager) {
        this.designServiceManager = designServiceManager;
    }

    @Override
    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }

    private boolean processService(TypeElement type) {
        Resource serviceDefXml = this.designServiceManager.getServiceDefXml(this.serviceId);
        try {
            Resource sourceFile = this.designServiceManager.getServiceRuntimeDirectory(this.serviceId).createRelative(
                JavaServiceDefinition.getRelPathFromClass(type.getQualifiedName().toString()));
            if (!sourceFile.exists()) {
                ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(ClassUtils.getDefaultClassLoader());
                String classFile = JavaServiceDefinition.getRelPathFromClass(type.getQualifiedName().toString()).replace(".java", ".class");
                Resource[] matches = resolver.getResources("classpath*:/" + classFile);
                if (matches.length == 0) {
                    this.processingEnv.getMessager().printMessage(Kind.ERROR,
                        "Could not locate source or class file for " + type.getQualifiedName().toString());
                    return true;
                }
                sourceFile = matches[0];
            }
            if (serviceDefXml.exists() && sourceFile.lastModified() <= serviceDefXml.lastModified()) {
                return false;
            }
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

        this.processingEnv.getMessager().printMessage(Kind.NOTE, "Creating servicdedef for service " + this.serviceId);

        JavaServiceDefinition serviceDef = new JavaServiceDefinition(type.getQualifiedName().toString(), this.serviceId);
        serviceDef.setPackageName(this.processingEnv.getElementUtils().getPackageOf(type).getQualifiedName().toString());
        TypeMirror dataServiceType = this.processingEnv.getElementUtils().getTypeElement(LIVE_SERVICE_CLASS).asType();
        if (this.processingEnv.getTypeUtils().isSubtype(type.asType(), dataServiceType)) {
            serviceDef.setLiveDataService(true);
        }
        serviceDef = type.accept(new JavaServiceScanner(), serviceDef);
        this.designServiceManager.defineService(serviceDef);

        return false;
    }

    private class JavaServiceScanner extends ElementScanner6<JavaServiceDefinition, JavaServiceDefinition> {

        private final CompileTypeState typeState = new CompileTypeState();

        @Override
        public JavaServiceDefinition scan(Element element, JavaServiceDefinition serviceDef) {
            return element.accept(new JavaServiceVisitor(this.typeState), serviceDef);
        }
    }

    private class JavaServiceVisitor extends ElementKindVisitor6<JavaServiceDefinition, JavaServiceDefinition> {

        private final CompileTypeState typeState;

        public JavaServiceVisitor(CompileTypeState typeState) {
            this.typeState = typeState;
        }

        @Override
        protected JavaServiceDefinition defaultAction(Element element, JavaServiceDefinition serviceDef) {
            return serviceDef;
        }

        @Override
        public JavaServiceDefinition visitExecutableAsMethod(ExecutableElement method, JavaServiceDefinition serviceDef) {

            if (isMethodHidden(method)) {
                return serviceDef;
            }

            ServiceOperation operation = new ServiceOperation();
            operation.setName(method.getSimpleName().toString());
            if (method.getReturnType().getKind() != TypeKind.VOID) {
                FieldDefinition returnType = CompileTypeUtils.buildFieldDefinition(ServiceDefProcessor.this.processingEnv, this.typeState,
                    method.getReturnType(), null);
                operation.setReturnType(returnType);
                checkAddType(serviceDef, returnType.getTypeDefinition());
            }

            List<FieldDefinition> params = new ArrayList<FieldDefinition>();
            for (VariableElement var : method.getParameters()) {
                FieldDefinition paramType = CompileTypeUtils.buildFieldDefinition(ServiceDefProcessor.this.processingEnv, this.typeState,
                    var.asType(), var.getSimpleName().toString());
                params.add(paramType);
                checkAddType(serviceDef, paramType.getTypeDefinition());
            }
            operation.setParameterTypes(params);

            serviceDef.getServiceOperations().add(operation);
            return serviceDef;
        }

        private boolean isMethodHidden(ExecutableElement method) {
            if (method.getAnnotation(ExposeToClient.class) != null) {
                return false;
            } else if (method.getAnnotation(HideFromClient.class) != null) {
                return true;
            } else if (method.getEnclosingElement().getAnnotation(HideFromClient.class) != null) {
                return true;
            }
            return false;
        }

        private void checkAddType(JavaServiceDefinition serviceDef, TypeDefinition td) {

            if (null == td) {
                return;
            }
            if (serviceDef.getLocalTypes().contains(td)) {
                return;
            }
            if (td instanceof PrimitiveTypeDefinition) {
                return;
            }

            for (TypeDefinition knownType : serviceDef.getLocalTypes()) {
                if (knownType.getTypeName().equals(td.getTypeName())) {
                    return;
                }
            }

            if (ServiceDefProcessor.this.excludeTypeNames.contains(td.getTypeName())) {
                return;
            }

            serviceDef.getLocalTypes().add(td);
        }

    }

}
