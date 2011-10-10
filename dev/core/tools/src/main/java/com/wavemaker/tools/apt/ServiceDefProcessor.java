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
@SupportedOptions({ ServiceProcessorConstants.PROJECT_NAME_PROP,
		ServiceProcessorConstants.PROJECT_ROOT_PROP,
		ServiceProcessorConstants.SERVICE_ID_PROP,
		ServiceProcessorConstants.SERVICE_CLASS_PROP,
		ServiceProcessorConstants.CLASS_PATH_SERVICE_PROP })
public class ServiceDefProcessor extends AbstractStudioServiceProcessor {

	private static final String LIVE_SERVICE_CLASS = "com.wavemaker.runtime.service.LiveDataService";

	private String serviceId;

	private String serviceClass;

	private boolean classPathService = false;

	private List<String> excludeTypeNames;

	@Override
	protected void doInit(ProcessingEnvironment processingEnv) {
		serviceId = processingEnv.getOptions().get(
				ServiceProcessorConstants.SERVICE_ID_PROP);
		serviceClass = processingEnv.getOptions().get(
				ServiceProcessorConstants.SERVICE_CLASS_PROP);
		if (processingEnv.getOptions().containsKey(
				ServiceProcessorConstants.CLASS_PATH_SERVICE_PROP)) {
			classPathService = Boolean.valueOf(processingEnv.getOptions().get(
					ServiceProcessorConstants.CLASS_PATH_SERVICE_PROP));
		}
		excludeTypeNames = designServiceManager.getExcludeTypeNames(serviceId);
	}

	@Override
	protected boolean doProcess(Set<? extends TypeElement> annotations,
			RoundEnvironment roundEnv) {

		if (!isInitialized()) {
			return false;
		}

		if (roundEnv.processingOver()) {
			return false;
		}

		if (!StringUtils.hasText(serviceId)) {
			processingEnv.getMessager().printMessage(Kind.ERROR,
					"serviceId option is required.");
			return true;
		}

		if (classPathService) {
			TypeElement type = processingEnv.getElementUtils().getTypeElement(
					serviceClass);
			if (type == null) {
				processingEnv.getMessager().printMessage(
						Kind.ERROR,
						"Could not locate " + serviceClass
								+ " on the classpath for processing.");
				return true;
			}
			return processService(type);
		} else {
			for (Element e : roundEnv.getRootElements()) {
				if (e instanceof TypeElement) {
					TypeElement type = (TypeElement) e;
					if ((StringUtils.hasText(serviceClass) && type
							.getQualifiedName().contentEquals(serviceClass))
							|| (!StringUtils.hasText(serviceClass) && type
									.getSimpleName().toString()
									.endsWith("Service"))) {
						return processService(type);
					}
				}
			}
		}
		return false;
	}

	public void setDesignServiceManager(
			DesignServiceManager designServiceManager) {
		this.designServiceManager = designServiceManager;
	}

	public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
		this.studioConfiguration = studioConfiguration;
	}

	private boolean processService(TypeElement type) {
		Resource serviceDefXml = designServiceManager
				.getServiceDefXml(serviceId);
		try {
			Resource sourceFile = designServiceManager
					.getServiceRuntimeDirectory(serviceId).createRelative(
							JavaServiceDefinition
									.getRelPathFromClass(type.getQualifiedName().toString()));
			if (!sourceFile.exists()) {
				ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(
						ClassUtils.getDefaultClassLoader());
				String classFile = JavaServiceDefinition.getRelPathFromClass(
						type.getQualifiedName().toString()).replace(".java", ".class");
				Resource[] matches = resolver.getResources("classpath*:/"
						+ classFile);
				if (matches.length == 0) {
					processingEnv.getMessager().printMessage(
							Kind.ERROR,
							"Could not locate source or class file for "
									+ type.getQualifiedName().toString());
					return true;
				}
				sourceFile = matches[0];
			}
			if (serviceDefXml.exists()
					&& sourceFile.lastModified() <= serviceDefXml
							.lastModified()) {
				return false;
			}
		} catch (IOException ex) {
			throw new WMRuntimeException(ex);
		}

		processingEnv.getMessager().printMessage(Kind.NOTE,
				"Creating servicdedef for service " + serviceId);

		JavaServiceDefinition serviceDef = new JavaServiceDefinition(
				type.getQualifiedName().toString(), serviceId);
		serviceDef.setPackageName(processingEnv.getElementUtils()
				.getPackageOf(type).getQualifiedName().toString());
		TypeMirror dataServiceType = processingEnv.getElementUtils()
				.getTypeElement(LIVE_SERVICE_CLASS).asType();
		if (processingEnv.getTypeUtils().isSubtype(type.asType(),
				dataServiceType)) {
			serviceDef.setLiveDataService(true);
		}
		serviceDef = type.accept(new JavaServiceScanner(), serviceDef);
		designServiceManager.defineService(serviceDef);

		return false;
	}

	private class JavaServiceScanner extends
			ElementScanner6<JavaServiceDefinition, JavaServiceDefinition> {

		private CompileTypeState typeState = new CompileTypeState();

		@Override
		public JavaServiceDefinition scan(Element element,
				JavaServiceDefinition serviceDef) {
			return element
					.accept(new JavaServiceVisitor(typeState), serviceDef);
		}
	}

	private class JavaServiceVisitor extends
			ElementKindVisitor6<JavaServiceDefinition, JavaServiceDefinition> {

		private CompileTypeState typeState;

		public JavaServiceVisitor(CompileTypeState typeState) {
			this.typeState = typeState;
		}

		@Override
		protected JavaServiceDefinition defaultAction(Element element,
				JavaServiceDefinition serviceDef) {
			return serviceDef;
		}

		@Override
		public JavaServiceDefinition visitExecutableAsMethod(
				ExecutableElement method, JavaServiceDefinition serviceDef) {

			if (isMethodHidden(method)) {
				return serviceDef;
			}

			ServiceOperation operation = new ServiceOperation();
			operation.setName(method.getSimpleName().toString());
			if (method.getReturnType().getKind() != TypeKind.VOID) {
				FieldDefinition returnType = CompileTypeUtils
						.buildFieldDefinition(processingEnv, typeState,
								method.getReturnType(), null);
				operation.setReturnType(returnType);
				checkAddType(serviceDef, returnType.getTypeDefinition());
			}

			List<FieldDefinition> params = new ArrayList<FieldDefinition>();
			for (VariableElement var : method.getParameters()) {
				FieldDefinition paramType = CompileTypeUtils
						.buildFieldDefinition(processingEnv, typeState,
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
			} else if (method.getEnclosingElement().getAnnotation(
					HideFromClient.class) != null) {
				return true;
			}
			return false;
		}

		private void checkAddType(JavaServiceDefinition serviceDef,
				TypeDefinition td) {

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

			if (excludeTypeNames.contains(td.getTypeName())) {
				return;
			}

			serviceDef.getLocalTypes().add(td);
		}

	}

}
