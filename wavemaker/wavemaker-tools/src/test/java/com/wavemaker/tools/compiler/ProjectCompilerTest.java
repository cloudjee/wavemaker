
package com.wavemaker.tools.compiler;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.ArrayList;

import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockServletContext;

import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.filesystem.FileSystemUtils;
import com.wavemaker.tools.project.LocalStudioFileSystem;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.DesignServiceManager;

public class ProjectCompilerTest {

    @Rule
    public TemporaryFolder temporaryFolder = new TemporaryFolder();

    private LocalStudioFileSystem studioConfiguration;

    private ProjectManager projectManager;

    private ProjectCompiler projectCompiler;

    private MockServletContext servletContext;

    @Before
    public void setUp() throws IOException {
        java.io.File studioWebApp = this.temporaryFolder.newFolder();
        java.io.File webInfLib = new java.io.File(studioWebApp, "WEB-INF/lib/");
        webInfLib.mkdirs();
        String basePath = studioWebApp.toURI().toURL().toString();
        this.servletContext = new MockServletContext(basePath);

        RuntimeAccess.setRuntimeBean(new RuntimeAccess());
        this.studioConfiguration = new LocalStudioFileSystem();
        this.studioConfiguration.setServletContext(this.servletContext);
        Resource wmHome = this.studioConfiguration.createTempDir();
        // cftempfix
        // LocalFileSystem fileSystem = new LocalFileSystem(wmHome.getFile());
        // Folder wmHomeFolder = FileSystemFolder.getRoot(fileSystem);
        Folder wmHomeFolder = FileSystemUtils.convertToFileSystemFolder(wmHome.getFile());
        this.studioConfiguration.setTestWaveMakerHome(wmHomeFolder);
        Resource projectDir = wmHome.createRelative("/projects/ProjectCompilerProject/");
        this.studioConfiguration.copyRecursive(new ClassPathResource("templates/templateapp/"), projectDir, new ArrayList<String>());
        assertTrue(projectDir.exists());
        assertTrue(projectDir.createRelative("file_map_readme.txt").exists());

        this.projectManager = new ProjectManager();
        this.projectManager.setFileSystem(this.studioConfiguration);
        this.projectManager.openProject(projectDir, true);
        this.projectCompiler = new ProjectCompiler();
        this.projectCompiler.setProjectManager(this.projectManager);
        this.projectCompiler.setFileSystem(this.studioConfiguration);
    }

    @After
    public void tearDown() {
        this.studioConfiguration.deleteFile(this.projectManager.getCurrentProject().getProjectRoot());
    }

    @Test
    public void testCompileProjectSingleClass() throws IOException {
        Project project = this.projectManager.getCurrentProject();

        File fooSrc = project.getRootFolder().getFile("src/Foo.java");
        fooSrc.getContent().write("public class Foo{public int getInt(){return 12;}}");

        this.projectCompiler.compile();

        File fooClass = project.getClassOutputFolder().getFile("Foo.class");
        assertTrue(fooClass.exists());
    }

    @Test
    public void testCompileProjectMultipleClasses() throws IOException {
        Project project = this.projectManager.getCurrentProject();

        File fooSrc = project.getRootFolder().getFile("src/com/mycompany/foo/Foo.java");
        fooSrc.getContent().write("package com.mycompany.foo;\n\npublic class Foo{public int getInt(){return 12;}}");

        File barSrc = project.getRootFolder().getFile("src/com/mycompany/bar/Bar.java");
        barSrc.getContent().write("package com.mycompany.bar;\n\npublic class Bar{public String getString(){return \"blah blah\";}}");

        this.projectCompiler.compile();

        File fooClass = project.getClassOutputFolder().getFile("com/mycompany/foo/Foo.class");
        assertTrue(fooClass.exists());

        File barClass = project.getClassOutputFolder().getFile("com/mycompany/bar/Bar.class");
        assertTrue(barClass.exists());
    }

    @Test
    public void testCompileProjectWithServices() throws IOException {
        Project project = this.projectManager.getCurrentProject();

        File fooSrc = project.getRootFolder().getFile("src/com/mycompany/foo/Foo.java");
        fooSrc.getContent().write("package com.mycompany.foo;\n\npublic class Foo{public int getInt(){return 12;}}");

        File barSrc = project.getRootFolder().getFile("src/com/mycompany/bar/Bar.java");
        barSrc.getContent().write("package com.mycompany.bar;\n\npublic class Bar{public String getString(){return \"blah blah\";}}");

        String serviceId = "serviceA";
        Folder serviceASrc = project.getRootFolder().getFolder(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        File javaSrc = serviceASrc.getFile("FooService.java");
        javaSrc.getContent().write(
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class FooService{public int getInt(){return 12;}\n"
                + "\tpublic int getInt2(java.util.List<String[]> strings){return 0;}\n}");

        this.projectCompiler.compile();

        File fooClass = project.getClassOutputFolder().getFile("com/mycompany/foo/Foo.class");
        assertTrue(fooClass.exists());

        File barClass = project.getClassOutputFolder().getFile("com/mycompany/bar/Bar.class");
        assertTrue(barClass.exists());

        File serviceClass = project.getClassOutputFolder().getFile("FooService.class");
        assertTrue(serviceClass.exists());

        File serviceDef = project.getRootFolder().getFile(DesignServiceManager.getDesigntimeRelativeDir(serviceId) + "servicedef.xml");
        assertTrue(serviceDef.exists());

        File types = project.getWebAppRootFolder().getFile("types.js");
        assertTrue(types.exists());
    }

    @Test
    public void testCompileProjectWithServiceOnly() throws IOException {
        Project project = this.projectManager.getCurrentProject();

        String serviceId = "serviceA";
        Folder serviceASrc = project.getRootFolder().getFolder(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        File javaSrc = serviceASrc.getFile("FooService.java");
        javaSrc.getContent().write(
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class FooService{public int getInt(){return 12;}\n"
                + "\tpublic int getInt2(java.util.List<String[]> strings){return 0;}\n}");

        this.projectCompiler.compile();

        File serviceClass = project.getClassOutputFolder().getFile("FooService.class");
        assertTrue(serviceClass.exists());

        File serviceDef = project.getRootFolder().getFolder(DesignServiceManager.getDesigntimeRelativeDir(serviceId)).getFile("servicedef.xml");
        assertTrue(serviceDef.exists());

        File types = project.getWebAppRootFolder().getFile("types.js");
        assertTrue(types.exists());
    }

    @Test
    public void testCompileProjectRequiringExternalClasspath() throws IOException {
        Project project = this.projectManager.getCurrentProject();

        File fooSrc = project.getRootFolder().getFile("src/com/foo/FooSubClass.java");
        fooSrc.getContent().write(
            "package com.foo;\n\npublic class FooSubClass extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {public int getInt(){return 12;}}");

        this.projectCompiler.compile();

        File fooClass = project.getClassOutputFolder().getFile("com/foo/FooSubClass.class");
        assertTrue(fooClass.exists());
    }

    @Test
    public void testCompileProjectRequiringExternalClasspathForService() throws IOException {
        Project project = this.projectManager.getCurrentProject();

        String serviceId = "serviceA";
        Folder serviceASrc = project.getRootFolder().getFolder(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        File javaSrc = serviceASrc.getFile("com/bar/BarService.java");

        javaSrc.getContent().write(
            "package com.bar;\n\nimport com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class BarService extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {public int getInt(){return 12;}}");

        this.projectCompiler.compile();

        File barClass = project.getClassOutputFolder().getFile("com/bar/BarService.class");
        assertTrue(barClass.exists());

        File serviceDef = project.getRootFolder().getFolder(DesignServiceManager.getDesigntimeRelativeDir(serviceId)).getFile("servicedef.xml");
        assertTrue(serviceDef.exists());
    }

    @Test
    public void testCompileAndCopyResources() throws IOException {
        Project project = this.projectManager.getCurrentProject();

        File fooSrc = project.getRootFolder().getFile("src/Foo.java");
        fooSrc.getContent().write("public class Foo{public int getInt(){return 12;}}");

        this.projectCompiler.compile();

        File fooClass = project.getClassOutputFolder().getFile("Foo.class");
        assertTrue(fooClass.exists());

        File classPathProps = project.getClassOutputFolder().getFile("log4j.properties");
        assertTrue(classPathProps.exists());

        File javaFile = project.getClassOutputFolder().getFile("Foo.java");
        assertFalse(javaFile.exists());
    }
}
