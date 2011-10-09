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
		project = designServiceManager.getProjectManager()
				.getCurrentProject();
		try {
			servicesXml = project.getWebInf().createRelative(
					ConfigurationCompiler.RUNTIME_SERVICES);
			managersXml = project.getWebInf().createRelative(
					ConfigurationCompiler.RUNTIME_MANAGERS);
			typesJs = project.getWebAppRoot().createRelative(
					ConfigurationCompiler.TYPE_RUNTIME_FILE);
		} catch (IOException e) {
			throw new WMRuntimeException(e);
		}
	}

	@Override
	protected boolean doProcess(Set<? extends TypeElement> annotations,
			RoundEnvironment roundEnv) {
		boolean modifiedSMD = false;
		boolean modifiedXML = false;

		try {
			SortedSet<Service> services = new TreeSet<Service>(new ServiceComparator());
			Set<String> serviceIds = designServiceManager.getServiceIds();
			for (String serviceId : serviceIds) {
				Resource serviceDef = designServiceManager
						.getServiceDefXml(serviceId);
				Service service = DesignServiceManager
						.loadServiceDefinition(serviceDef.getInputStream());
				services.add(service);
				Resource smd = ConfigurationCompiler.getSmdFile(project,
						serviceId);
				if (!smd.exists()
						|| smd.lastModified() < serviceDef.lastModified()) {
					processingEnv.getMessager().printMessage(Kind.NOTE, "Generating SMD for "+serviceId);
					ConfigurationCompiler.generateSMD(project, service);
					modifiedSMD = true;
				}
			}

			if (!servicesXml.exists() || !managersXml.exists()
					|| !typesJs.exists() || modifiedSMD) {
				processingEnv.getMessager().printMessage(Kind.NOTE, "Generating "+ConfigurationCompiler.RUNTIME_SERVICES);
				ConfigurationCompiler.generateServices(project, servicesXml,
						services);
				processingEnv.getMessager().printMessage(Kind.NOTE, "Generating "+ConfigurationCompiler.RUNTIME_MANAGERS);
				ConfigurationCompiler.generateManagers(project, managersXml,
						services);
				modifiedXML = true;
			}

			if (modifiedSMD || modifiedXML) {
				processingEnv.getMessager().printMessage(Kind.NOTE, "Generating "+ConfigurationCompiler.TYPE_RUNTIME_FILE);
				ConfigurationCompiler.generateTypes(project, typesJs, services,
						designServiceManager.getPrimitiveDataObjects());
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
