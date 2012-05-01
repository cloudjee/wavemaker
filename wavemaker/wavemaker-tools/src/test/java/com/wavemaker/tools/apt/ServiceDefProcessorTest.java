
package com.wavemaker.tools.apt;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

import javax.tools.Diagnostic;
import javax.tools.DiagnosticListener;
import javax.tools.JavaCompiler;
import javax.tools.JavaCompiler.CompilationTask;
import javax.tools.JavaFileObject;
import javax.tools.JavaFileObject.Kind;
import javax.tools.StandardJavaFileManager;
import javax.tools.StandardLocation;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.util.StringUtils;

import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.security.SecurityService;
import com.wavemaker.tools.compiler.WaveMakerJavaCompiler;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.filesystem.local.LocalFileSystem;
import com.wavemaker.tools.io.filesystem.FileSystemFolder;
import com.wavemaker.tools.io.compiler.ResourceJavaFileManager;
import com.wavemaker.tools.project.LocalStudioFileSystem;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Operation;
import com.wavemaker.tools.service.definitions.Operation.Parameter;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.util.DesignTimeUtils;

public class ServiceDefProcessorTest {

    private LocalStudioFileSystem fileSystem;

    private Project project;

    private DesignServiceManager designServiceManager;

    @Before
    public void setUp() throws IOException {
        RuntimeAccess.setRuntimeBean(new RuntimeAccess());
        this.fileSystem = new LocalStudioFileSystem();
        Resource wmHome = this.fileSystem.createTempDir();
        //cftempfix
        LocalFileSystem fileSystem = new LocalFileSystem(wmHome.getFile());
        Folder wmHomeFolder = FileSystemFolder.getRoot(fileSystem);
        this.fileSystem.setTestWaveMakerHome(wmHomeFolder);
        Resource projectDir = wmHome.createRelative("/projects/ServiceDefProcessorProject/");
        this.fileSystem.copyRecursive(new ClassPathResource("templates/templateapp/"), projectDir, new ArrayList<String>());
        assertTrue(projectDir.exists());
        assertTrue(projectDir.createRelative("file_map_readme.txt").exists());
        this.project = new Project(projectDir, this.fileSystem);
        this.designServiceManager = DesignTimeUtils.getDesignServiceManager(this.project);
    }

    @After
    public void tearDown() {
        this.fileSystem.deleteFile(this.project.getProjectRoot());
    }

    @Test
    public void testCreateServiceDef_NoArgPrimitiveReturn() throws IOException {
        String serviceId = "serviceA";
        Folder projectRoot = this.project.getRootFolder();

        Folder serviceASrc = projectRoot.getFolder(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        File javaSrc = serviceASrc.getFile("Foo.java");
        javaSrc.getContent().write(
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}}");

        Folder serviceDesignDir = projectRoot.getFolder(DesignServiceManager.getDesigntimeRelativeDir(serviceId));
        assertFalse(serviceDesignDir.exists());

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setFileSystem(this.fileSystem);
        buildWithProcessor(this.project, serviceId, processor);

        assertTrue(serviceDesignDir.exists());

        Service service = this.designServiceManager.getService(serviceId);
        assertEquals("Foo", service.getClazz());
        assertEquals(1, service.getOperation().size());

        File sourceSpringXml = serviceASrc.getFile("serviceA.spring.xml");
        assertTrue(sourceSpringXml.exists());

        File classPathSpringXml = this.project.getClassOutputFolder().getFile("serviceA.spring.xml");
        assertTrue(classPathSpringXml.exists());
    }

    @Test
    public void testCreateProcessNonService() throws IOException {

        Folder projectRoot = this.project.getRootFolder();

        Folder srcDir = projectRoot.getFolder("src/");
        File javaSrc = srcDir.getFile("Foo.java");
        javaSrc.getContent().write("public class Foo{public int getInt(){return 12;}}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setFileSystem(this.fileSystem);
        buildWithProcessor(this.project, null, processor);

        assertTrue(this.project.getClassOutputFolder().getFile("Foo.class").exists());
    }

    @Test
    public void testCreateServiceDef_TwoNoArgPrimitiveReturn() throws IOException {
        String serviceId = "serviceA";
        Folder projectRoot = this.project.getRootFolder();

        Folder serviceASrc = projectRoot.getFolder(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        File javaSrc = serviceASrc.getFile("Foo.java");
        javaSrc.getContent().write(
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}\n"
                + "\tpublic int getInt2(){return 13;}\n}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setFileSystem(this.fileSystem);
        buildWithProcessor(this.project, serviceId, processor);

        Service service = this.designServiceManager.getService(serviceId);
        assertEquals("Foo", service.getClazz());
        assertEquals(2, service.getOperation().size());
    }

    @Test
    public void testCreateServiceDef_ArrayArgPrimitiveReturn() throws IOException {
        String serviceId = "serviceA";
        Folder projectRoot = this.project.getRootFolder();

        Folder serviceASrc = projectRoot.getFolder(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        File javaSrc = serviceASrc.getFile("Foo.java");
        javaSrc.getContent().write(
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}\n"
                + "\tpublic int getInt2(Integer[] ints){return 13+ints[0];}\n}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setFileSystem(this.fileSystem);
        buildWithProcessor(this.project, serviceId, processor);

        Service service = this.designServiceManager.getService(serviceId);
        assertEquals("Foo", service.getClazz());
        assertEquals(2, service.getOperation().size());

        boolean foundGetInt2 = false;
        for (Operation op : service.getOperation()) {
            if (op.getName().equals("getInt2")) {
                foundGetInt2 = true;

                assertEquals(1, op.getParameter().size());
                Parameter param = op.getParameter().get(0);
                assertTrue(param.isIsList());
                assertEquals("java.lang.Integer", param.getTypeRef());
            }
        }
        assertTrue("" + service.getOperation(), foundGetInt2);
    }

    @Test
    public void testCreateServiceDef_ListArgPrimitiveReturn() throws IOException {
        String serviceId = "serviceA";
        Folder projectRoot = this.project.getRootFolder();

        Folder serviceASrc = projectRoot.getFolder(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        File javaSrc = serviceASrc.getFile("Foo.java");
        javaSrc.getContent().write(
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}\n"
                + "\tpublic int getInt2(java.util.List<Integer> ints){return ints.get(0);}\n}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setFileSystem(this.fileSystem);
        buildWithProcessor(this.project, serviceId, processor);

        Service service = this.designServiceManager.getService(serviceId);
        assertEquals("Foo", service.getClazz());
        assertEquals(2, service.getOperation().size());

        boolean foundGetInt2 = false;
        for (Operation op : service.getOperation()) {
            if (op.getName().equals("getInt2")) {
                foundGetInt2 = true;

                assertEquals(1, op.getParameter().size());
                Parameter param = op.getParameter().get(0);
                assertTrue(param.isIsList());
                assertEquals("java.lang.Integer", param.getTypeRef());
            }
        }
        assertTrue("" + service.getOperation(), foundGetInt2);
    }

    @Test
    public void testCreateServiceDef_TwoDimmensionalListArgPrimitiveReturn() throws IOException {
        String serviceId = "serviceA";
        Folder projectRoot = this.project.getRootFolder();

        Folder serviceASrc = projectRoot.getFolder(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        File javaSrc = serviceASrc.getFile("Foo.java");
        javaSrc.getContent().write(
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}\n"
                + "\tpublic int getInt2(java.util.List<String[]> strings){return 0;}\n}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setFileSystem(this.fileSystem);
        buildWithProcessor(this.project, serviceId, processor);

        Service service = this.designServiceManager.getService(serviceId);
        assertEquals("Foo", service.getClazz());
        assertEquals(2, service.getOperation().size());

        boolean foundGetInt2 = false;
        for (Operation op : service.getOperation()) {
            if (op.getName().equals("getInt2")) {
                foundGetInt2 = true;

                assertEquals(1, op.getParameter().size());
                Parameter param = op.getParameter().get(0);
                assertTrue(param.isIsList());
                assertEquals("java.lang.String", param.getTypeRef());
            }
        }
        assertTrue("" + service.getOperation(), foundGetInt2);
    }

    @Test
    public void testCreateServiceDef_MapArgVoidReturn() throws IOException {
        String serviceId = "serviceA";
        Folder projectRoot = this.project.getRootFolder();

        Folder serviceASrc = projectRoot.getFolder(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        File javaSrc = serviceASrc.getFile("Foo.java");
        javaSrc.getContent().write(
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}\n"
                + "\tpublic void takeThisMap(java.util.Map<String, String> strings){ }\n}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setFileSystem(this.fileSystem);
        buildWithProcessor(this.project, serviceId, processor);

        Service service = this.designServiceManager.getService(serviceId);
        assertEquals("Foo", service.getClazz());
        assertEquals(2, service.getOperation().size());

        boolean foundMapMethod = false;
        for (Operation op : service.getOperation()) {
            if (op.getName().equals("takeThisMap")) {
                foundMapMethod = true;

                assertEquals(1, op.getParameter().size());
                Parameter param = op.getParameter().get(0);
                assertEquals("java.util.Map<java.lang.String,java.lang.String>", param.getTypeRef());
            }
        }
        assertTrue("" + service.getOperation(), foundMapMethod);
    }

    @Test
    public void testCreateServiceDef_EnumArgVoidReturn() throws IOException {
        String serviceId = "serviceA";
        Folder projectRoot = this.project.getRootFolder();

        Folder serviceASrc = projectRoot.getFolder(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        File javaSrc = serviceASrc.getFile("Foo.java");
        javaSrc.getContent().write(
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}\n"
                + "\tpublic void takeThisEnum(java.lang.annotation.ElementType elementType){ }\n}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setFileSystem(this.fileSystem);
        buildWithProcessor(this.project, serviceId, processor);

        Service service = this.designServiceManager.getService(serviceId);
        assertEquals("Foo", service.getClazz());
        assertEquals(2, service.getOperation().size());

        boolean foundMapMethod = false;
        for (Operation op : service.getOperation()) {
            if (op.getName().equals("takeThisEnum")) {
                foundMapMethod = true;

                assertEquals(1, op.getParameter().size());
                Parameter param = op.getParameter().get(0);
                assertEquals("java.lang.annotation.ElementType", param.getTypeRef());
            }
        }
        assertTrue("" + service.getOperation(), foundMapMethod);
    }

    @Test
    public void testCreateServiceDef_BeanArgBeanReturn() throws IOException {
        String serviceId = "serviceA";
        Folder projectRoot = this.project.getRootFolder();

        Folder serviceASrc = projectRoot.getFolder(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        Resource javeFileToRead = new ClassPathResource("/com/wavemaker/tools/apt/MyBean.javax");
        File javaSrc1 = serviceASrc.getFile("com/wavemaker/tools/apt/MyBean.java");
        javaSrc1.getContent().write(javeFileToRead.getInputStream());
        File javaSrc2 = serviceASrc.getFile("Foo.java");
        javaSrc2.getContent().write(
            "import com.wavemaker.tools.apt.MyBean;\nimport com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\n"
                + "public class Foo{public MyBean findMyBean(){return new MyBean();}\n" + "\tpublic void saveMyBean(MyBean myBean){ }\n}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setFileSystem(this.fileSystem);
        buildWithProcessor(this.project, serviceId, processor);

        Service service = this.designServiceManager.getService(serviceId);
        assertEquals("Foo", service.getClazz());
        assertEquals(2, service.getOperation().size());

        boolean foundBeanReturn = false;
        boolean foundBeanArg = false;
        for (Operation op : service.getOperation()) {
            if (op.getName().equals("saveMyBean")) {
                foundBeanArg = true;
                assertEquals(1, op.getParameter().size());
                Parameter param = op.getParameter().get(0);
                assertEquals("com.wavemaker.tools.apt.MyBean", param.getTypeRef());
            } else if (op.getName().equals("findMyBean")) {
                foundBeanReturn = true;
                assertEquals("com.wavemaker.tools.apt.MyBean", op.getReturn().getTypeRef());
            }
        }
        assertTrue(foundBeanReturn && foundBeanArg);
    }

    @Test
    public void testCreateServiceDef_ClassPathService() throws IOException {

        Folder projectRoot = this.project.getRootFolder();

        String sourceServiceId = "serviceA";
        Folder serviceASrc = projectRoot.getFolder(DesignServiceManager.getRuntimeRelativeDir(sourceServiceId));
        File javaSrc = serviceASrc.getFile("Foo.java");
        javaSrc.getContent().write(
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}}");

        String classPathServiceId = "securityService";
        Folder serviceDesignDir = projectRoot.getFolder(DesignServiceManager.getDesigntimeRelativeDir(classPathServiceId));
        assertFalse(serviceDesignDir.exists());

        Properties properties = new Properties();
        properties.setProperty(classPathServiceId, SecurityService.class.getName());
        Writer writer = this.project.getRootFolder().getFile("/services/" + ServiceProcessorConstants.CLASS_PATH_SERVICES_FILE).getContent().asWriter();
        try {
            properties.store(writer, null);
        } finally {
            writer.close();
        }
        assertTrue(this.project.getRootFolder().getFile("services/" + ServiceProcessorConstants.CLASS_PATH_SERVICES_FILE).exists());

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setFileSystem(this.fileSystem);
        buildWithProcessor(this.project, sourceServiceId, processor);

        assertTrue(serviceDesignDir.exists());

        Service service = this.designServiceManager.getService(classPathServiceId);
        assertEquals(SecurityService.class.getName(), service.getClazz());
        assertTrue(service.getOperation().size() > 0);

        File classPathServiceDef = this.project.getClassOutputFolder().getFile("services/" + classPathServiceId + "/servicedef.xml");
        assertTrue(classPathServiceDef.exists());
    }

    private void buildWithProcessor(Project project, String serviceId, AbstractStudioServiceProcessor processor) throws IOException {
        JavaCompiler compiler = new WaveMakerJavaCompiler();
        StandardJavaFileManager standardFileManager = compiler.getStandardFileManager(null, null, null);
        ResourceJavaFileManager fileManager = new ResourceJavaFileManager(standardFileManager);

        project.getClassOutputFolder().createIfMissing();
        fileManager.setLocation(StandardLocation.CLASS_OUTPUT, Collections.singleton(project.getClassOutputFolder()));

        if (StringUtils.hasText(serviceId)) {
            fileManager.setLocation(StandardLocation.SOURCE_PATH,
                Collections.singleton(project.getRootFolder().getFolder("services/" + serviceId + "/src/")));
        } else {
            fileManager.setLocation(StandardLocation.SOURCE_PATH, Collections.singleton(project.getRootFolder().getFolder("src/")));
        }

        processor.setJavaFileManager(fileManager);

        // Get the list of java file objects
        Iterable<? extends JavaFileObject> compilationUnits = fileManager.list(StandardLocation.SOURCE_PATH, "", Collections.singleton(Kind.SOURCE),
            true);

        List<String> options = new ArrayList<String>();
        options.add("-A" + ServiceProcessorConstants.PROJECT_NAME_PROP + "=" + project.getProjectName());

        // Create the compilation task
        CompilationTask task = compiler.getTask(null, fileManager, new DiagnosticListener<JavaFileObject>() {

            @Override
            public void report(Diagnostic<? extends JavaFileObject> diagnostic) {
                assertFalse("Error reported: " + diagnostic.getMessage(null), diagnostic.getKind() == Diagnostic.Kind.ERROR);
            }
        }, options, null, compilationUnits);
        task.setProcessors(Collections.singletonList(processor));
        // Perform the compilation task.
        task.call();

    }

}
