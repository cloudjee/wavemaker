package com.wavemaker.tools.compiler;

import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.ArrayList;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.DesignServiceManager;

public class TestProjectCompiler {

	private LocalStudioConfiguration studioConfiguration;
	
	private ProjectManager projectManager;
	
	private ProjectCompiler projectCompiler;

	@Before
	public void setUp() throws IOException {
		RuntimeAccess.setRuntimeBean(new RuntimeAccess());
		studioConfiguration = new LocalStudioConfiguration();
		Resource wmHome = studioConfiguration.createTempDir();
		studioConfiguration.setTestWaveMakerHome(wmHome.getFile());
		Resource projectDir = wmHome
				.createRelative("/projects/ProjectCompilerProject/");
		studioConfiguration.copyRecursive(new ClassPathResource(
				"templates/templateapp/"), projectDir, new ArrayList<String>());
		assertTrue(projectDir.exists());
		assertTrue(projectDir.createRelative("file_map_readme.txt").exists());
		
		projectManager = new ProjectManager();
		projectManager.setStudioConfiguration(studioConfiguration);
		projectManager.openProject(projectDir, true);
		
		projectCompiler = new ProjectCompiler();
		projectCompiler.setProjectManager(projectManager);
		projectCompiler.setStudioConfiguration(studioConfiguration);
	}

	@After
	public void tearDown() {
		studioConfiguration.deleteFile(projectManager.getCurrentProject().getProjectRoot());
	}
	
	@Test
	public void testCompileProjectSingleClass() throws IOException {
		Project project = projectManager.getCurrentProject();

		Resource fooSrc = project.getProjectRoot().createRelative("src/Foo.java");
		project.writeFile(fooSrc,
				"public class Foo{public int getInt(){return 12;}}");
		
		projectCompiler.compileProject("ProjectCompilerProject");
		
		Resource fooClass = project.getWebInfClasses().createRelative("Foo.class");
		assertTrue(fooClass.exists());
	}
	
	@Test
	public void testCompileProjectMultipleClasses() throws IOException {
		Project project = projectManager.getCurrentProject();

		Resource fooSrc = project.getProjectRoot().createRelative("src/com/mycompany/foo/Foo.java");
		project.writeFile(fooSrc,
				"package com.mycompany.foo;\n\npublic class Foo{public int getInt(){return 12;}}");
		
		Resource barSrc = project.getProjectRoot().createRelative("src/com/mycompany/bar/Bar.java");
		project.writeFile(barSrc,
				"package com.mycompany.bar;\n\npublic class Bar{public String getString(){return \"blah blah\";}}");
		
		projectCompiler.compileProject("ProjectCompilerProject");
		
		Resource fooClass = project.getWebInfClasses().createRelative("com/mycompany/foo/Foo.class");
		assertTrue(fooClass.exists());
		
		Resource barClass = project.getWebInfClasses().createRelative("com/mycompany/bar/Bar.class");
		assertTrue(barClass.exists());
	}
	
	@Test
	public void testCompileProjectWithServices() throws IOException {
		Project project = projectManager.getCurrentProject();

		Resource fooSrc = project.getProjectRoot().createRelative("src/com/mycompany/foo/Foo.java");
		project.writeFile(fooSrc,
				"package com.mycompany.foo;\n\npublic class Foo{public int getInt(){return 12;}}");
		
		Resource barSrc = project.getProjectRoot().createRelative("src/com/mycompany/bar/Bar.java");
		project.writeFile(barSrc,
				"package com.mycompany.bar;\n\npublic class Bar{public String getString(){return \"blah blah\";}}");
		
		String serviceId = "serviceA";
		Resource serviceASrc = project.getProjectRoot().createRelative(DesignServiceManager
				.getRuntimeRelativeDir(serviceId));
		Resource javaSrc = serviceASrc.createRelative("FooService.java");
		project.writeFile(
				javaSrc,
				"public class FooService{public int getInt(){return 12;}\n"
						+ "\tpublic int getInt2(java.util.List<String[]> strings){return 0;}\n}");
		
		projectCompiler.compileProject("ProjectCompilerProject");
		
		Resource fooClass = project.getWebInfClasses().createRelative("com/mycompany/foo/Foo.class");
		assertTrue(fooClass.exists());
		
		Resource barClass = project.getWebInfClasses().createRelative("com/mycompany/bar/Bar.class");
		assertTrue(barClass.exists());
		
		Resource serviceClass = project.getWebInfClasses().createRelative("FooService.class");
		assertTrue(serviceClass.exists());
		
		Resource serviceDef = project.getProjectRoot().createRelative(DesignServiceManager.getDesigntimeRelativeDir(serviceId)+"servicedef.xml");
		assertTrue(serviceDef.exists());
		
		Resource types = project.getWebAppRoot().createRelative("types.js");
		assertTrue(types.exists());
	}
	
	@Test
	public void testCompileProjectWithServiceOnly() throws IOException {
		Project project = projectManager.getCurrentProject();

		String serviceId = "serviceA";
		Resource serviceASrc = project.getProjectRoot().createRelative(DesignServiceManager
				.getRuntimeRelativeDir(serviceId));
		Resource javaSrc = serviceASrc.createRelative("FooService.java");
		project.writeFile(
				javaSrc,
				"public class FooService{public int getInt(){return 12;}\n"
						+ "\tpublic int getInt2(java.util.List<String[]> strings){return 0;}\n}");
		
		projectCompiler.compileProject("ProjectCompilerProject");
		
		Resource serviceClass = project.getWebInfClasses().createRelative("FooService.class");
		assertTrue(serviceClass.exists());
		
		Resource serviceDef = project.getProjectRoot().createRelative(DesignServiceManager.getDesigntimeRelativeDir(serviceId)+"servicedef.xml");
		assertTrue(serviceDef.exists());
		
		Resource types = project.getWebAppRoot().createRelative("types.js");
		assertTrue(types.exists());
	}
}
