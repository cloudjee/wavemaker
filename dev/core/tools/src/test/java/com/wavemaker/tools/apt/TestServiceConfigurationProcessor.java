package com.wavemaker.tools.apt;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.ServiceLoader;
import java.util.Set;

import javax.annotation.processing.Processor;
import javax.tools.JavaCompiler;
import javax.tools.JavaCompiler.CompilationTask;
import javax.tools.JavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.StandardLocation;
import javax.xml.bind.JAXBException;

import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.wavemaker.json.type.OperationEnumeration;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.javaservice.JavaServiceType;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.service.ServiceType;
import com.wavemaker.runtime.service.definition.AbstractDeprecatedServiceDefinition;
import com.wavemaker.runtime.service.definition.ReflectServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.runtime.ws.WebServiceType;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.service.ConfigurationCompiler;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.Import;
import com.wavemaker.tools.util.DesignTimeUtils;

public class TestServiceConfigurationProcessor {

	private StudioConfiguration studioConfiguration;

	private Project project;

	private DesignServiceManager localDSM;

	@Before
	public void setUp() throws IOException {
		RuntimeAccess.setRuntimeBean(new RuntimeAccess());
		studioConfiguration = new LocalStudioConfiguration();
		Resource wmHome = studioConfiguration.createTempDir();
		((LocalStudioConfiguration) studioConfiguration)
				.setTestWaveMakerHome(wmHome.getFile());
		Resource projectDir = wmHome
				.createRelative("/projects/ServiceDefProcessorProject/");
		studioConfiguration.copyRecursive(new ClassPathResource(
				"templates/templateapp/"), projectDir, new ArrayList<String>());
		assertTrue(projectDir.exists());
		assertTrue(projectDir.createRelative("file_map_readme.txt").exists());
		project = new Project(projectDir, studioConfiguration);

		localDSM = DesignTimeUtils.getDSMForProjectRoot(project
				.getProjectRoot());
	}

	@After
	public void tearDown() {
		studioConfiguration.deleteFile(project.getProjectRoot());
	}

	@Test
	public void testDMCompile() throws IOException, JAXBException,
			InterruptedException {
		ServiceDefinition sd = new updateService_SD();
		ServiceDefinition sd2 = new updateService_SD2();

		File actual = localDSM.getServiceDefXml(sd.getServiceId()).getFile();
		assertFalse(actual.exists());
		localDSM.defineService(sd);
		assertTrue(actual.exists());
		localDSM.defineService(sd2);

		ServiceConfigurationProcessor processor = new ServiceConfigurationProcessor();
		processor.setStudioConfiguration(studioConfiguration);
		buildWithProcessor(project, "Foo", processor);

		File actualServices = new File(project.getWebInf().getFile(),
				"project-services.xml");
		assertTrue(actualServices.exists());

		File smd_sd = ConfigurationCompiler.getSmdFile(project,
				sd.getServiceId()).getFile();
		File smd_sd2 = ConfigurationCompiler.getSmdFile(project,
				sd2.getServiceId()).getFile();
		assertTrue(smd_sd + " DNE", smd_sd.exists());
		assertTrue(smd_sd2 + " DNE", smd_sd2.exists());

		Beans actualBeans = SpringConfigSupport.readBeans(
				new FileSystemResource(actualServices), project);

		assertEquals(2, actualBeans.getImportsAndAliasAndBean().size());
		for (Object o : actualBeans.getImportsAndAliasAndBean()) {
			if (o instanceof Import) {
				Import imp = (Import) o;

				if (("classpath:" + sd2.getRuntimeConfiguration()).equals(imp
						.getResource())) {
					// good
				} else if ("classpath:com/wavemaker/runtime/service/runtimeServiceBean.xml"
						.equals(imp.getResource())) {
					// good
				} else if ("classpath:com/wavemaker/runtime/service/waveMakerServiceBean.xml"
						.equals(imp.getResource())) {
					// good
				} else if (("classpath:" + DesignServiceManager
						.getServiceBeanName(sd.getServiceId())).equals(imp
						.getResource())) {
					// good
				} else {
					fail("unknown resource: " + imp.getResource());
				}
			} else if (o instanceof Bean) {
				Bean bean = (Bean) o;

				if ("updateService".equals(bean.getId())) {
					assertEquals(
							"com.wavemaker.tools.service.UpdateService_SD",
							bean.getClazz());
				} else {
					fail("unknown id: " + bean.getId());
				}
			} else {
				fail("unknown type: " + o);
			}
		}

		File actualManagers = new File(project.getWebInf().getFile(),
				"project-managers.xml");
		assertTrue(actualManagers.exists());
		actualBeans = SpringConfigSupport.readBeans(new FileSystemResource(
				actualManagers), project);

		assertNull(actualBeans.getBeanById("serviceManager"));
	}

	@Test
	public void testBasicWriteConfig() throws IOException {
		ReflectServiceDefinition sd = new updateService_SD();
		ReflectServiceDefinition sd2 = new updateService_SD2();
		assertNull(sd.getRuntimeConfiguration());

		File expected = localDSM.getServiceDefXml(sd.getServiceId()).getFile();
		assertFalse(expected.exists());

		localDSM.defineService(sd);
		assertTrue(expected.exists());
		localDSM.defineService(sd2);

		ServiceConfigurationProcessor processor = new ServiceConfigurationProcessor();
		processor.setStudioConfiguration(studioConfiguration);
		buildWithProcessor(project, "Foo", processor);
		
		File actualServices = ConfigurationCompiler.getRuntimeServicesXml(
				project).getFile();
		File actualManagers = ConfigurationCompiler.getRuntimeManagersXml(
				project).getFile();
		File actualTypes = ConfigurationCompiler.getTypesFile(project)
				.getFile();
		assertTrue(actualServices.exists());
		assertTrue(actualManagers.exists());
		assertTrue(actualTypes.exists());

		String servicesStr = FileUtils.readFileToString(actualServices);
		String managersStr = FileUtils.readFileToString(actualManagers);
		String typesStr = FileUtils.readFileToString(actualTypes);

		assertTrue("didn't expect service " + sd.getServiceClass()
				+ " in servicesStr:\n" + servicesStr,
				-1 == servicesStr.indexOf(sd.getServiceClass() + "\""));
		assertTrue(
				"servicesStr:\n" + servicesStr,
				-1 != servicesStr.indexOf("classpath:"
						+ DesignServiceManager.getServiceBeanName(sd
								.getServiceId()) + "\""));
		assertTrue(-1 == servicesStr.indexOf(sd2.getServiceClass() + "\""));
		assertTrue(-1 == servicesStr.indexOf(sd2.getServiceId() + "\""));
		assertTrue(-1 != servicesStr.indexOf("classpath:"
				+ sd2.getRuntimeConfiguration() + "\""));

		assertTrue(-1 != managersStr.indexOf(sd.getServiceId()));
		assertTrue(-1 != managersStr.indexOf(sd2.getServiceId()));

		assertTrue(typesStr.startsWith("wm.types"));
	}

	@Test
	public void testWriteTypes() throws Exception {

		File typesFile = ConfigurationCompiler.getTypesFile(project).getFile();
		File managersFile = ConfigurationCompiler
				.getRuntimeManagersXml(project).getFile();
		assertFalse(typesFile.exists());

		ServiceDefinition sd = new updateType_SD();
		ServiceDefinition sd2 = new updateType_SD2();

		localDSM.defineService(sd);

		ServiceConfigurationProcessor processor = new ServiceConfigurationProcessor();
		processor.setStudioConfiguration(studioConfiguration);
		buildWithProcessor(project, "Foo", processor);
		
		assertTrue(typesFile.exists());
		String typesFileContents = FileUtils.readFileToString(typesFile);
		assertTrue(typesFileContents.contains(sd.getLocalTypes().get(0)
				.getTypeName()));

		assertTrue(managersFile.exists());
		String managersFileContents = FileUtils.readFileToString(managersFile);
		assertTrue(managersFileContents.contains("\"" + sd.getServiceId()
				+ "\""));
		assertFalse(managersFileContents.contains("\"" + sd2.getServiceId()
				+ "\""));

		localDSM.defineService(sd2);

		processor = new ServiceConfigurationProcessor();
		processor.setStudioConfiguration(studioConfiguration);
		buildWithProcessor(project, "Foo", processor);
		
		assertTrue(managersFile.exists());
		managersFileContents = FileUtils.readFileToString(managersFile);
		assertTrue(managersFileContents.contains("\"" + sd.getServiceId()
				+ "\""));
		assertTrue(managersFileContents.contains("\"" + sd2.getServiceId()
				+ "\""));

		assertTrue(typesFile.exists());
		typesFileContents = FileUtils.readFileToString(typesFile);
		assertTrue(typesFileContents.contains(sd.getLocalTypes().get(0)
				.getTypeName()));
		assertTrue(typesFileContents.contains(sd2.getLocalTypes().get(0)
				.getTypeName()));
		assertTrue(typesFileContents
				.contains(OperationEnumeration.read.value()));
	}

	private static class updateService_SD extends
			AbstractDeprecatedServiceDefinition implements
			ReflectServiceDefinition {

		public void dispose() {
		}

		public List<ElementType> getInputTypes(String operationName) {
			return null;
		}

		public List<String> getOperationNames() {
			return Collections.emptyList();
		}

		public ElementType getOutputType(String operationName) {
			return null;
		}

		public String getPackageName() {
			return null;
		}

		public String getServiceId() {
			return "updateService";
		}

		public ServiceType getServiceType() {
			return new WebServiceType();
		}

		public String getServiceClass() {
			return "com.wavemaker.tools.service.UpdateService_SD";
		}

		public List<ElementType> getTypes() {
			return new ArrayList<ElementType>();
		}

		public String getRuntimeConfiguration() {
			return null;
		}

		public List<String> getEventNotifiers() {
			return new ArrayList<String>();
		}

		public boolean isLiveDataService() {
			return false;
		}
	}

	private static class updateService_SD2 extends
			AbstractDeprecatedServiceDefinition implements
			ReflectServiceDefinition {

		public void dispose() {
		}

		public String getRuntimeConfiguration() {
			return "foo/bar.xml";
		}

		public List<ElementType> getInputTypes(String operationName) {
			return null;
		}

		public List<String> getOperationNames() {
			return Collections.emptyList();
		}

		public ElementType getOutputType(String operationName) {
			return null;
		}

		public String getPackageName() {
			return null;
		}

		public String getServiceId() {
			return "updateService2";
		}

		public ServiceType getServiceType() {
			return new JavaServiceType();
		}

		public String getServiceClass() {
			return "com.wavemaker.tools.service.UpdateService_SD2";
		}

		public List<ElementType> getTypes() {
			return new ArrayList<ElementType>();
		}

		public List<String> getEventNotifiers() {
			return new ArrayList<String>();
		}

		public boolean isLiveDataService() {
			return false;
		}
	}

	private static class updateOperation_SD extends
			AbstractDeprecatedServiceDefinition implements
			ReflectServiceDefinition {

		private final List<String> operationNames;

		public updateOperation_SD() {
			operationNames = new ArrayList<String>(1);
			operationNames.add("add");
		}

		public void dispose() {
		}

		public String getRuntimeConfiguration() {
			return null;
		}

		public List<ElementType> getInputTypes(String operationName) {

			List<ElementType> ret = new ArrayList<ElementType>();

			if (operationName.equals("add")) {
				ElementType a = new ElementType("a", int.class, false);
				ElementType b = new ElementType("b", int.class, false);

				ret.add(a);
				ret.add(b);
			}

			return ret;
		}

		public List<String> getOperationNames() {
			return operationNames;
		}

		public ElementType getOutputType(String operationName) {

			ElementType ret = null;

			if (operationName.equals("add")) {
				ret = new ElementType("result", long.class, false);
			}

			return ret;
		}

		public String getPackageName() {
			return null;
		}

		public String getServiceId() {
			return "updateOperation";
		}

		public ServiceType getServiceType() {
			return new JavaServiceType();
		}

		public String getServiceClass() {
			return "com.wavemaker.tools.service.UpdateOperation_SD";
		}

		public List<ElementType> getTypes() {
			return new ArrayList<ElementType>();
		}

		public List<String> getEventNotifiers() {
			return new ArrayList<String>();
		}

		public boolean isLiveDataService() {
			return false;
		}
	}

	private static class updateType_SD extends updateOperation_SD {

		@Override
		public String getServiceId() {
			return "updateType_SD";
		}

		@Override
		public List<ElementType> getTypes() {

			List<ElementType> ret = new ArrayList<ElementType>();

			ElementType et = new ElementType("foo", "package.name.Foo");
			ret.add(et);

			return ret;
		}
	}

	private static class updateType_SD2 extends updateService_SD {

		@Override
		public String getServiceId() {
			return "updateType_SD2";
		}

		@Override
		public List<ElementType> getTypes() {

			List<ElementType> ret = new ArrayList<ElementType>();

			ElementType et = new ElementType("bar", "package.name.Bar");
			et.setSupportsQuickData(true);
			et.getExclude().add(OperationEnumeration.read);
			ret.add(et);
			ElementType etp = new ElementType("fooNested",
					"package.name.FooNested");
			etp.getExclude().add(OperationEnumeration.read);
			et.getProperties().add(etp);

			et = new ElementType("baz", "package.name.Baz");
			ret.add(et);

			return ret;
		}
	}

	private void buildWithProcessor(Project project, String serviceClass,
			Processor processor) throws IOException {
		// Get an instance of Eclipse compiler
		JavaCompiler compiler = ServiceLoader.load(JavaCompiler.class)
				.iterator().next();

		// Get an instance of Standard compiler
		// JavaCompiler compiler =
		// javax.tools.ToolProvider.getSystemJavaCompiler();

		// Get a new instance of the standard file manager implementation
		StandardJavaFileManager fileManager = compiler.getStandardFileManager(
				null, null, Charset.forName(ServerConstants.DEFAULT_ENCODING));

		project.getWebInfClasses().getFile().mkdirs();
		fileManager.setLocation(StandardLocation.CLASS_OUTPUT,
				Collections.singleton(project.getWebInfClasses().getFile()));

		Resource javaSrc = project.getProjectRoot().createRelative(
				"services/src/Foo.java");
		project.writeFile(javaSrc,
				"public class Foo{public int getInt(){return 12;}}");
		// Get the list of java file objects, in this case we have only
		// one file, TestClass.java
		Iterable<? extends JavaFileObject> compilationUnits = fileManager
				.getJavaFileObjectsFromFiles(Collections.singletonList(javaSrc
						.getFile()));

		Set<String> options = new HashSet<String>();
		options.add("-A" + ServiceProcessorConstants.PROJECT_NAME_PROP + "="
				+ project.getProjectName());

		// Create the compilation task
		CompilationTask task = compiler.getTask(null, fileManager, null,
				options, null, compilationUnits);
		task.setProcessors(Collections.singletonList(processor));
		// Perform the compilation task.
		task.call();

	}
}
