
package com.wavemaker.tools.compiler;

import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockServletContext;
import org.springframework.util.Assert;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.DesignServiceManager;

public class TestProjectCompiler {

    private LocalStudioConfiguration studioConfiguration;

    private ProjectManager projectManager;

    private ProjectCompiler projectCompiler;

    private static MockServletContext servletContext;

    private static File webInfLib;

    @BeforeClass
    public static void init() throws IOException {
        File studioWebApp = IOUtils.createTempDirectory();
        String basePath = studioWebApp.toURI().toURL().toString();
        servletContext = new MockServletContext(basePath);
        webInfLib = new File(studioWebApp, "WEB-INF/lib/");
        webInfLib.mkdirs();
        Assert.isTrue(webInfLib.exists());
        Assert.notNull(servletContext.getResource("/WEB-INF/lib/"));
    }

    @Before
    public void setUp() throws IOException {
        RuntimeAccess.setRuntimeBean(new RuntimeAccess());
        this.studioConfiguration = new LocalStudioConfiguration();
        this.studioConfiguration.setServletContext(servletContext);
        Resource wmHome = this.studioConfiguration.createTempDir();
        this.studioConfiguration.setTestWaveMakerHome(wmHome.getFile());
        Resource projectDir = wmHome.createRelative("/projects/ProjectCompilerProject/");
        this.studioConfiguration.copyRecursive(new ClassPathResource("templates/templateapp/"), projectDir, new ArrayList<String>());
        assertTrue(projectDir.exists());
        assertTrue(projectDir.createRelative("file_map_readme.txt").exists());

        this.projectManager = new ProjectManager();
        this.projectManager.setStudioConfiguration(this.studioConfiguration);
        this.projectManager.openProject(projectDir, true);

        this.projectCompiler = new ProjectCompiler();
        this.projectCompiler.setProjectManager(this.projectManager);
        this.projectCompiler.setStudioConfiguration(this.studioConfiguration);
    }

    @After
    public void tearDown() {
        this.studioConfiguration.deleteFile(this.projectManager.getCurrentProject().getProjectRoot());
    }

    @Test
    public void testCompileProjectSingleClass() throws IOException {
        Project project = this.projectManager.getCurrentProject();

        Resource fooSrc = project.getProjectRoot().createRelative("src/Foo.java");
        project.writeFile(fooSrc, "public class Foo{public int getInt(){return 12;}}");

        this.projectCompiler.compileProject("ProjectCompilerProject");

        Resource fooClass = project.getWebInfClasses().createRelative("Foo.class");
        assertTrue(fooClass.exists());
    }

    @Test
    public void testCompileProjectMultipleClasses() throws IOException {
        Project project = this.projectManager.getCurrentProject();

        Resource fooSrc = project.getProjectRoot().createRelative("src/com/mycompany/foo/Foo.java");
        project.writeFile(fooSrc, "package com.mycompany.foo;\n\npublic class Foo{public int getInt(){return 12;}}");

        Resource barSrc = project.getProjectRoot().createRelative("src/com/mycompany/bar/Bar.java");
        project.writeFile(barSrc, "package com.mycompany.bar;\n\npublic class Bar{public String getString(){return \"blah blah\";}}");

        this.projectCompiler.compileProject("ProjectCompilerProject");

        Resource fooClass = project.getWebInfClasses().createRelative("com/mycompany/foo/Foo.class");
        assertTrue(fooClass.exists());

        Resource barClass = project.getWebInfClasses().createRelative("com/mycompany/bar/Bar.class");
        assertTrue(barClass.exists());
    }

    @Test
    public void testCompileProjectWithServices() throws IOException {
        Project project = this.projectManager.getCurrentProject();

        Resource fooSrc = project.getProjectRoot().createRelative("src/com/mycompany/foo/Foo.java");
        project.writeFile(fooSrc, "package com.mycompany.foo;\n\npublic class Foo{public int getInt(){return 12;}}");

        Resource barSrc = project.getProjectRoot().createRelative("src/com/mycompany/bar/Bar.java");
        project.writeFile(barSrc, "package com.mycompany.bar;\n\npublic class Bar{public String getString(){return \"blah blah\";}}");

        String serviceId = "serviceA";
        Resource serviceASrc = project.getProjectRoot().createRelative(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        Resource javaSrc = serviceASrc.createRelative("FooService.java");
        project.writeFile(javaSrc,
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class FooService{public int getInt(){return 12;}\n"
                + "\tpublic int getInt2(java.util.List<String[]> strings){return 0;}\n}");

        this.projectCompiler.compileProject("ProjectCompilerProject");

        Resource fooClass = project.getWebInfClasses().createRelative("com/mycompany/foo/Foo.class");
        assertTrue(fooClass.exists());

        Resource barClass = project.getWebInfClasses().createRelative("com/mycompany/bar/Bar.class");
        assertTrue(barClass.exists());

        Resource serviceClass = project.getWebInfClasses().createRelative("FooService.class");
        assertTrue(serviceClass.exists());

        Resource serviceDef = project.getProjectRoot().createRelative(DesignServiceManager.getDesigntimeRelativeDir(serviceId) + "servicedef.xml");
        assertTrue(serviceDef.exists());

        Resource types = project.getWebAppRoot().createRelative("types.js");
        assertTrue(types.exists());
    }

    @Test
    public void testCompileProjectWithServiceOnly() throws IOException {
        Project project = this.projectManager.getCurrentProject();

        String serviceId = "serviceA";
        Resource serviceASrc = project.getProjectRoot().createRelative(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        Resource javaSrc = serviceASrc.createRelative("FooService.java");
        project.writeFile(javaSrc,
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class FooService{public int getInt(){return 12;}\n"
                + "\tpublic int getInt2(java.util.List<String[]> strings){return 0;}\n}");

        this.projectCompiler.compileProject("ProjectCompilerProject");

        Resource serviceClass = project.getWebInfClasses().createRelative("FooService.class");
        assertTrue(serviceClass.exists());

        Resource serviceDef = project.getProjectRoot().createRelative(DesignServiceManager.getDesigntimeRelativeDir(serviceId) + "servicedef.xml");
        assertTrue(serviceDef.exists());

        Resource types = project.getWebAppRoot().createRelative("types.js");
        assertTrue(types.exists());
    }

    @Test
    public void testCompileProjectRequiringExternalClasspath() throws IOException {
        Project project = this.projectManager.getCurrentProject();

        Resource fooSrc = project.getProjectRoot().createRelative("src/com/foo/FooSubClass.java");
        project.writeFile(fooSrc,
            "package com.foo;\n\npublic class FooSubClass extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {public int getInt(){return 12;}}");

        this.projectCompiler.compileProject("ProjectCompilerProject");

        Resource fooClass = project.getWebInfClasses().createRelative("com/foo/FooSubClass.class");
        assertTrue(fooClass.exists());
    }

    @Test
    public void testCompileProjectRequiringExternalClasspathForService() throws IOException {
        Project project = this.projectManager.getCurrentProject();

        String serviceId = "serviceA";
        Resource serviceASrc = project.getProjectRoot().createRelative(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        Resource javaSrc = serviceASrc.createRelative("com/bar/BarService.java");
        project.writeFile(
            javaSrc,
            "package com.bar;\n\nimport com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class BarService extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {public int getInt(){return 12;}}");

        this.projectCompiler.compileProject("ProjectCompilerProject");

        Resource barClass = project.getWebInfClasses().createRelative("com/bar/BarService.class");
        assertTrue(barClass.exists());

        Resource serviceDef = project.getProjectRoot().createRelative(DesignServiceManager.getDesigntimeRelativeDir(serviceId) + "servicedef.xml");
        assertTrue(serviceDef.exists());
    }

    @Test
    public void testCompileSingleService() throws IOException {
        Project project = this.projectManager.getCurrentProject();

        String serviceId = "serviceA";
        Resource serviceASrc = project.getProjectRoot().createRelative(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        Resource javaSrc = serviceASrc.createRelative("FooService.java");
        project.writeFile(javaSrc,
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class FooService{public int getInt(){return 12;}\n"
                + "\tpublic int getInt2(java.util.List<String[]> strings){return 0;}\n}");

        this.projectCompiler.compileService("ProjectCompilerProject", serviceId);

        Resource serviceClass = project.getWebInfClasses().createRelative("FooService.class");
        assertTrue(serviceClass.exists());

        Resource serviceDef = project.getProjectRoot().createRelative(DesignServiceManager.getDesigntimeRelativeDir(serviceId) + "servicedef.xml");
        assertTrue(serviceDef.exists());

        Resource types = project.getWebAppRoot().createRelative("types.js");
        assertTrue(types.exists());
    }
}
