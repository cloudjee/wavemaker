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
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import java.util.Properties;
import java.util.Set;

import javax.annotation.processing.ProcessingEnvironment;
import javax.annotation.processing.RoundEnvironment;
import javax.annotation.processing.SupportedAnnotationTypes;
import javax.annotation.processing.SupportedOptions;
import javax.annotation.processing.SupportedSourceVersion;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.AnnotationMirror;
import javax.lang.model.element.Element;
import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;
import javax.lang.model.element.VariableElement;
import javax.lang.model.type.TypeKind;
import javax.lang.model.type.TypeMirror;
import javax.lang.model.util.ElementKindVisitor6;
import javax.lang.model.util.ElementScanner6;
import javax.tools.Diagnostic.Kind;
import javax.tools.JavaFileObject;
import javax.tools.StandardLocation;

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
import com.wavemaker.tools.compiler.ResourceJavaFileObject;
import com.wavemaker.tools.javaservice.JavaServiceDefinition;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.service.DesignServiceManager;

@SupportedAnnotationTypes({ "com.wavemaker.runtime.service.annotations.ExposeToClient", "com.wavemaker.runtime.service.annotations.HideFromClient" })
@SupportedSourceVersion(SourceVersion.RELEASE_6)
@SupportedOptions({ ServiceProcessorConstants.PROJECT_NAME_PROP, ServiceProcessorConstants.PROJECT_ROOT_PROP })
public class ServiceDefProcessor extends AbstractStudioServiceProcessor {

    private static final String LIVE_SERVICE_CLASS = "com.wavemaker.runtime.service.LiveDataService";

    private Properties classPathServices = null;

    @Override
    protected void doInit(ProcessingEnvironment processingEnv) {
        Project project = this.designServiceManager.getProjectManager().getCurrentProject();
        try {
            Resource classPathServicesProps = project.getProjectRoot().createRelative(
                "services/" + ServiceProcessorConstants.CLASS_PATH_SERVICES_FILE);
            if (classPathServicesProps.exists()) {
                this.classPathServices = new Properties();
                this.classPathServices.load(classPathServicesProps.getInputStream());
            }
        } catch (IOException e) {
            this.processingEnv.getMessager().printMessage(Kind.ERROR, "Could not load " + ServiceProcessorConstants.CLASS_PATH_SERVICES_FILE);
        }
    }

    @Override
    protected boolean doProcess(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {

        if (!isInitialized()) {
            return false;
        }

        if (roundEnv.processingOver()) {
            return false;
        }

        Project project = this.designServiceManager.getProjectManager().getCurrentProject();

        for (TypeElement annotation : annotations) {
            Set<? extends Element> elements = roundEnv.getElementsAnnotatedWith(annotation);
            for (Element e : elements) {
                if (e instanceof TypeElement) {
                    TypeElement type = (TypeElement) e;
                    String serviceId = "";
                    try {
                        JavaFileObject file = this.fileManager.getJavaFileForInput(StandardLocation.SOURCE_PATH, type.getQualifiedName().toString(),
                            JavaFileObject.Kind.SOURCE);
                        if (file != null && file.toUri().getPath().contains("/src/")) {
                            String path = file.toUri().getPath();
                            String servicePath = path.substring(0, path.lastIndexOf("/src/"));
                            if (servicePath.contains("services/")) {
                                serviceId = servicePath.substring(servicePath.lastIndexOf("/") + 1);
                            }
                        }
                    } catch (IOException ex) {
                        // File can't be located, so default to using the class name for the serviceId
                    }
                    if (!StringUtils.hasText(serviceId)) {
                        serviceId = StringUtils.uncapitalize(type.getSimpleName().toString());
                    }
                    if (processService(serviceId, type)) {
                        return true;
                    }
                }
            }
        }
        if (this.classPathServices != null) {
            TypeElement exposeAnn = this.processingEnv.getElementUtils().getTypeElement(ExposeToClient.class.getName());
            TypeElement hideAnn = this.processingEnv.getElementUtils().getTypeElement(HideFromClient.class.getName());
            Enumeration<?> props = this.classPathServices.propertyNames();
            while (props.hasMoreElements()) {
                String serviceId = props.nextElement().toString();
                TypeElement type = this.processingEnv.getElementUtils().getTypeElement(this.classPathServices.getProperty(serviceId));
                for (AnnotationMirror annotationMirror : this.processingEnv.getElementUtils().getAllAnnotationMirrors(type)) {
                    if (this.processingEnv.getTypeUtils().isSameType(annotationMirror.getAnnotationType(), exposeAnn.asType())
                        || this.processingEnv.getTypeUtils().isSameType(annotationMirror.getAnnotationType(), hideAnn.asType())) {
                        if (processService(serviceId, type)) {
                            return true;
                        }
                        Resource serviceDef = this.designServiceManager.getServiceDefXml(serviceId);
                        try {
                            getFileSystem().copyFile(project.getWebInfClasses(), serviceDef.getInputStream(),
                                "services/" + serviceId + "/" + serviceDef.getFilename());
                        } catch (IOException ex) {
                            this.processingEnv.getMessager().printMessage(Kind.ERROR,
                                "Could not copy servicedef for runtime service " + serviceId + " to classpath.");
                        }
                    }
                }
            }
        }
        try {
            copySpringXml();
        } catch (IOException e) {
            this.processingEnv.getMessager().printMessage(Kind.ERROR, "Could not copy Spring xml config to classpath.");
        }
        return false;
    }

    @Override
    public void setDesignServiceManager(DesignServiceManager designServiceManager) {
        this.designServiceManager = designServiceManager;
    }

    private void copySpringXml() throws IOException {
        Project project = this.designServiceManager.getProjectManager().getCurrentProject();
        if (!project.isMavenProject()) {
            Iterable<JavaFileObject> matchedFiles = this.fileManager.list(StandardLocation.SOURCE_PATH, "",
                Collections.singleton(JavaFileObject.Kind.OTHER), false);
            for (JavaFileObject match : matchedFiles) {
                if (match instanceof ResourceJavaFileObject) {
                    ResourceJavaFileObject resource = (ResourceJavaFileObject) match;
                    if (resource.getFilename().endsWith("spring.xml")) {
                        getFileSystem().copyFile(project.getWebInfClasses(), resource.openInputStream(), resource.getFilename());
                    }
                }
            }
        }
    }

    private boolean processService(String serviceId, TypeElement type) {
        Resource serviceDefXml = this.designServiceManager.getServiceDefXml(serviceId);
        try {
            Resource sourceFile = this.designServiceManager.getServiceRuntimeDirectory(serviceId).createRelative(
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

        this.processingEnv.getMessager().printMessage(Kind.NOTE, "Creating servicdedef for service " + serviceId);

        JavaServiceDefinition serviceDef = new JavaServiceDefinition(type.getQualifiedName().toString(), serviceId);
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
            return element.accept(new JavaServiceVisitor(this.typeState, serviceDef.getServiceId()), serviceDef);
        }
    }

    private class JavaServiceVisitor extends ElementKindVisitor6<JavaServiceDefinition, JavaServiceDefinition> {

        private final CompileTypeState typeState;

        private final List<String> excludeTypeNames;

        public JavaServiceVisitor(CompileTypeState typeState, String serviceId) {
            this.typeState = typeState;
            this.excludeTypeNames = ServiceDefProcessor.this.designServiceManager.getExcludeTypeNames(serviceId);
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

            if (td == null) {
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

            if (this.excludeTypeNames.contains(td.getTypeName())) {
                return;
            }

            serviceDef.getLocalTypes().add(td);
        }
    }
}
