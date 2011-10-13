
package com.wavemaker.tools.apt;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;
import java.util.ServiceLoader;

import javax.annotation.processing.Processor;
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
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Operation;
import com.wavemaker.tools.service.definitions.Operation.Parameter;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.util.DesignTimeUtils;

public class TestServiceDefProcessor {

    private StudioConfiguration studioConfiguration;

    private Project project;

    private DesignServiceManager localDSM;

    @Before
    public void setUp() throws IOException {
        RuntimeAccess.setRuntimeBean(new RuntimeAccess());
        this.studioConfiguration = new LocalStudioConfiguration();
        Resource wmHome = this.studioConfiguration.createTempDir();
        ((LocalStudioConfiguration) this.studioConfiguration).setTestWaveMakerHome(wmHome.getFile());
        Resource projectDir = wmHome.createRelative("/projects/ServiceDefProcessorProject/");
        this.studioConfiguration.copyRecursive(new ClassPathResource("templates/templateapp/"), projectDir, new ArrayList<String>());
        assertTrue(projectDir.exists());
        assertTrue(projectDir.createRelative("file_map_readme.txt").exists());
        this.project = new Project(projectDir, this.studioConfiguration);

        this.localDSM = DesignTimeUtils.getDSMForProjectRoot(this.project.getProjectRoot());
    }

    @After
    public void tearDown() {
        this.studioConfiguration.deleteFile(this.project.getProjectRoot());
    }

    @Test
    public void testCreateServiceDef_NoArgPrimitiveReturn() throws IOException {
        String serviceId = "serviceA";
        Resource projectRoot = this.project.getProjectRoot();

        Resource serviceASrc = projectRoot.createRelative(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        Resource javaSrc = serviceASrc.createRelative("Foo.java");
        this.project.writeFile(javaSrc,
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}}");

        Resource serviceDesignDir = projectRoot.createRelative(DesignServiceManager.getDesigntimeRelativeDir(serviceId));
        assertFalse(serviceDesignDir.exists());

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setStudioConfiguration(this.studioConfiguration);
        buildWithProcessor(this.project, serviceId, processor);

        assertTrue(serviceDesignDir.exists());

        Service service = this.localDSM.getService(serviceId);
        assertEquals("Foo", service.getClazz());
        assertEquals(1, service.getOperation().size());
    }

    @Test
    public void testCreateProcessNonService() throws IOException {

        Resource projectRoot = this.project.getProjectRoot();

        Resource srcDir = projectRoot.createRelative("src/");
        Resource javaSrc = srcDir.createRelative("Foo.java");
        this.project.writeFile(javaSrc, "public class Foo{public int getInt(){return 12;}}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setStudioConfiguration(this.studioConfiguration);
        buildWithProcessor(this.project, null, processor);

        assertTrue(this.project.getWebInfClasses().createRelative("Foo.class").exists());
    }

    @Test
    public void testCreateServiceDef_TwoNoArgPrimitiveReturn() throws IOException {
        String serviceId = "serviceA";
        Resource projectRoot = this.project.getProjectRoot();

        Resource serviceASrc = projectRoot.createRelative(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        Resource javaSrc = serviceASrc.createRelative("Foo.java");
        this.project.writeFile(javaSrc,
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}\n"
                + "\tpublic int getInt2(){return 13;}\n}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setStudioConfiguration(this.studioConfiguration);
        buildWithProcessor(this.project, serviceId, processor);

        Service service = this.localDSM.getService(serviceId);
        assertEquals("Foo", service.getClazz());
        assertEquals(2, service.getOperation().size());
    }

    @Test
    public void testCreateServiceDef_ArrayArgPrimitiveReturn() throws IOException {
        String serviceId = "serviceA";
        Resource projectRoot = this.project.getProjectRoot();

        Resource serviceASrc = projectRoot.createRelative(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        Resource javaSrc = serviceASrc.createRelative("Foo.java");
        this.project.writeFile(javaSrc,
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}\n"
                + "\tpublic int getInt2(Integer[] ints){return 13+ints[0];}\n}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setStudioConfiguration(this.studioConfiguration);
        buildWithProcessor(this.project, serviceId, processor);

        Service service = this.localDSM.getService(serviceId);
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
        Resource projectRoot = this.project.getProjectRoot();

        Resource serviceASrc = projectRoot.createRelative(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        Resource javaSrc = serviceASrc.createRelative("Foo.java");
        this.project.writeFile(javaSrc,
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}\n"
                + "\tpublic int getInt2(java.util.List<Integer> ints){return ints.get(0);}\n}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setStudioConfiguration(this.studioConfiguration);
        buildWithProcessor(this.project, serviceId, processor);

        Service service = this.localDSM.getService(serviceId);
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
        Resource projectRoot = this.project.getProjectRoot();

        Resource serviceASrc = projectRoot.createRelative(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        Resource javaSrc = serviceASrc.createRelative("Foo.java");
        this.project.writeFile(javaSrc,
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}\n"
                + "\tpublic int getInt2(java.util.List<String[]> strings){return 0;}\n}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setStudioConfiguration(this.studioConfiguration);
        buildWithProcessor(this.project, serviceId, processor);

        Service service = this.localDSM.getService(serviceId);
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
        Resource projectRoot = this.project.getProjectRoot();

        Resource serviceASrc = projectRoot.createRelative(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        Resource javaSrc = serviceASrc.createRelative("Foo.java");
        this.project.writeFile(javaSrc,
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}\n"
                + "\tpublic void takeThisMap(java.util.Map<String, String> strings){ }\n}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setStudioConfiguration(this.studioConfiguration);
        buildWithProcessor(this.project, serviceId, processor);

        Service service = this.localDSM.getService(serviceId);
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
        Resource projectRoot = this.project.getProjectRoot();

        Resource serviceASrc = projectRoot.createRelative(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        Resource javaSrc = serviceASrc.createRelative("Foo.java");
        this.project.writeFile(javaSrc,
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}\n"
                + "\tpublic void takeThisEnum(java.lang.annotation.ElementType elementType){ }\n}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setStudioConfiguration(this.studioConfiguration);
        buildWithProcessor(this.project, serviceId, processor);

        Service service = this.localDSM.getService(serviceId);
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
        Resource projectRoot = this.project.getProjectRoot();

        Resource serviceASrc = projectRoot.createRelative(DesignServiceManager.getRuntimeRelativeDir(serviceId));
        Resource javeFileToRead = new ClassPathResource("/com/wavemaker/tools/apt/MyBean.javax");
        Resource javaSrc1 = serviceASrc.createRelative("com/wavemaker/tools/apt/MyBean.java");
        this.project.writeFile(javaSrc1, this.project.readFile(javeFileToRead));
        Resource javaSrc2 = serviceASrc.createRelative("Foo.java");
        this.project.writeFile(javaSrc2,
            "import com.wavemaker.tools.apt.MyBean;\nimport com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\n"
                + "public class Foo{public MyBean findMyBean(){return new MyBean();}\n" + "\tpublic void saveMyBean(MyBean myBean){ }\n}");

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setStudioConfiguration(this.studioConfiguration);
        buildWithProcessor(this.project, serviceId, processor);

        Service service = this.localDSM.getService(serviceId);
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

        Resource projectRoot = this.project.getProjectRoot();

        String sourceServiceId = "serviceA";
        Resource serviceASrc = projectRoot.createRelative(DesignServiceManager.getRuntimeRelativeDir(sourceServiceId));
        Resource javaSrc = serviceASrc.createRelative("Foo.java");
        this.project.writeFile(javaSrc,
            "import com.wavemaker.runtime.service.annotations.ExposeToClient;\n\n@ExposeToClient\npublic class Foo{public int getInt(){return 12;}}");

        String classPathServiceId = "securityService";
        Resource serviceDesignDir = projectRoot.createRelative(DesignServiceManager.getDesigntimeRelativeDir(classPathServiceId));
        assertFalse(serviceDesignDir.exists());

        Properties properties = new Properties();
        properties.setProperty(classPathServiceId, SecurityService.class.getName());
        properties.store(this.project.getWriter("/services/" + ServiceProcessorConstants.CLASS_PATH_SERVICES_FILE), null);
        assertTrue(this.project.getProjectRoot().createRelative("services/" + ServiceProcessorConstants.CLASS_PATH_SERVICES_FILE).exists());

        ServiceDefProcessor processor = new ServiceDefProcessor();
        processor.setStudioConfiguration(this.studioConfiguration);
        buildWithProcessor(this.project, sourceServiceId, processor);

        assertTrue(serviceDesignDir.exists());

        Service service = this.localDSM.getService(classPathServiceId);
        assertEquals(SecurityService.class.getName(), service.getClazz());
        assertTrue(service.getOperation().size() > 0);

        Resource classPathServiceDef = this.project.getWebInfClasses().createRelative("services/" + classPathServiceId + "/servicedef.xml");
        assertTrue(classPathServiceDef.exists());
    }

    private void buildWithProcessor(Project project, String serviceId, Processor processor) throws IOException {
        // Get an instance of Eclipse compiler
        JavaCompiler compiler = ServiceLoader.load(JavaCompiler.class).iterator().next();

        // Get an instance of Standard compiler
        // JavaCompiler compiler = javax.tools.ToolProvider.getSystemJavaCompiler();

        // Get a new instance of the standard file manager implementation
        StandardJavaFileManager fileManager = compiler.getStandardFileManager(null, null, Charset.forName(ServerConstants.DEFAULT_ENCODING));

        project.getWebInfClasses().getFile().mkdirs();
        fileManager.setLocation(StandardLocation.CLASS_OUTPUT, Collections.singleton(project.getWebInfClasses().getFile()));

        if (StringUtils.hasText(serviceId)) {
            fileManager.setLocation(StandardLocation.SOURCE_PATH,
                Collections.singleton(project.getProjectRoot().createRelative("services/" + serviceId + "/src/").getFile()));
        } else {
            fileManager.setLocation(StandardLocation.SOURCE_PATH, Collections.singleton(project.getProjectRoot().createRelative("src/").getFile()));
        }

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
