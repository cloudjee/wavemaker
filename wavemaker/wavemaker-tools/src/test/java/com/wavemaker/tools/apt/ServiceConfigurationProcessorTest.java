
package com.wavemaker.tools.apt;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.processing.Processor;
import javax.tools.JavaCompiler;
import javax.tools.JavaCompiler.CompilationTask;
import javax.tools.JavaFileObject;
import javax.tools.JavaFileObject.Kind;
import javax.tools.StandardJavaFileManager;
import javax.tools.StandardLocation;
import javax.xml.bind.JAXBException;

import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.wavemaker.json.type.OperationEnumeration;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.javaservice.JavaServiceType;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.service.ServiceType;
import com.wavemaker.runtime.service.definition.AbstractDeprecatedServiceDefinition;
import com.wavemaker.runtime.service.definition.ReflectServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.runtime.ws.WebServiceType;
import com.wavemaker.tools.compiler.WaveMakerJavaCompiler;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.compiler.ResourceJavaFileManager;
import com.wavemaker.tools.io.filesystem.FileSystemFolder;
import com.wavemaker.tools.io.filesystem.local.LocalFileSystem;
import com.wavemaker.tools.project.LocalStudioFileSystem;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.service.ConfigurationCompiler;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.util.DesignTimeUtils;

public class ServiceConfigurationProcessorTest {

    private LocalStudioFileSystem fileSystem;

    private Project project;

    private DesignServiceManager localDSM;

    @Before
    public void setUp() throws IOException {
        RuntimeAccess.setRuntimeBean(new RuntimeAccess());
        this.fileSystem = new LocalStudioFileSystem();
        Resource wmHome = this.fileSystem.createTempDir();
        // cftempfix
        LocalFileSystem fileSystem = new LocalFileSystem(wmHome.getFile());
        Folder wmHomeFolder = FileSystemFolder.getRoot(fileSystem);
        this.fileSystem.setTestWaveMakerHome(wmHomeFolder);
        Resource projectDir = wmHome.createRelative("/projects/ServiceDefProcessorProject/");
        this.fileSystem.copyRecursive(new ClassPathResource("templates/templateapp/"), projectDir, new ArrayList<String>());
        assertTrue(projectDir.exists());
        assertTrue(projectDir.createRelative("file_map_readme.txt").exists());
        this.project = new Project(projectDir, this.fileSystem);
        this.localDSM = DesignTimeUtils.getDesignServiceManager(this.project);
        this.localDSM.setFileSystem(this.fileSystem);
    }

    @After
    public void tearDown() {
        this.project.getRootFolder().delete();
    }

    @Test
    public void testDMCompile() throws IOException, JAXBException, InterruptedException {
        ServiceDefinition sd = new updateService_SD();
        ServiceDefinition sd2 = new updateService_SD2();

        File actual = this.localDSM.getServiceDefXmlFile(sd.getServiceId());
        assertFalse(actual.exists());
        this.localDSM.defineService(sd);
        assertTrue(actual.exists());
        this.localDSM.defineService(sd2);

        ServiceConfigurationProcessor processor = new ServiceConfigurationProcessor();
        processor.setFileSystem(this.fileSystem);
        buildWithProcessor(this.project, "Foo", processor);

        File actualServices = this.project.getWebInfFolder().getFile("project-services.xml");
        assertTrue(actualServices.exists());

        File smd_sd = ConfigurationCompiler.getSmdFile(this.project, sd.getServiceId());
        File smd_sd2 = ConfigurationCompiler.getSmdFile(this.project, sd2.getServiceId());
        assertTrue(smd_sd + " DNE", smd_sd.exists());
        assertTrue(smd_sd2 + " DNE", smd_sd2.exists());

        Beans actualBeans = SpringConfigSupport.readBeans(actualServices);

        assertEquals(0, actualBeans.getImportsAndAliasAndBean().size());

        File actualManagers = this.project.getWebInfFolder().getFile("project-managers.xml");
        assertTrue(actualManagers.exists());
        actualBeans = SpringConfigSupport.readBeans(actualManagers);

        assertNull(actualBeans.getBeanById("serviceManager"));
    }

    @Test
    public void testBasicWriteConfig() throws IOException {
        ReflectServiceDefinition sd = new updateService_SD();
        ReflectServiceDefinition sd2 = new updateService_SD2();
        assertNull(sd.getRuntimeConfiguration());

        File expected = this.localDSM.getServiceDefXmlFile(sd.getServiceId());
        assertFalse(expected.exists());

        this.localDSM.defineService(sd);
        assertTrue(expected.exists());

        this.localDSM.defineService(sd2);
        ServiceConfigurationProcessor processor = new ServiceConfigurationProcessor();
        processor.setFileSystem(this.fileSystem);
        buildWithProcessor(this.project, "Foo", processor);

        java.io.File actualServices = ConfigurationCompiler.getRuntimeServicesXml(this.project).getFile();
        java.io.File actualManagers = ConfigurationCompiler.getRuntimeManagersXml(this.project).getFile();
        java.io.File actualTypes = ConfigurationCompiler.getTypesFileDeprecated(this.project).getFile();
        assertTrue(actualServices.exists());
        assertTrue(actualManagers.exists());
        assertTrue(actualTypes.exists());

        String managersStr = FileUtils.readFileToString(actualManagers);
        String typesStr = FileUtils.readFileToString(actualTypes);

        assertTrue(-1 != managersStr.indexOf(sd.getServiceId()));
        assertTrue(-1 != managersStr.indexOf(sd2.getServiceId()));

        assertTrue(typesStr.startsWith("wm.types"));
    }

    @Test
    public void testWriteTypes() throws Exception {

        java.io.File typesFile = ConfigurationCompiler.getTypesFileDeprecated(this.project).getFile();
        java.io.File managersFile = ConfigurationCompiler.getRuntimeManagersXml(this.project).getFile();
        assertFalse(typesFile.exists());

        ServiceDefinition sd = new updateType_SD();
        ServiceDefinition sd2 = new updateType_SD2();

        this.localDSM.defineService(sd);

        ServiceConfigurationProcessor processor = new ServiceConfigurationProcessor();
        processor.setFileSystem(this.fileSystem);
        buildWithProcessor(this.project, "Foo", processor);

        assertTrue(typesFile.exists());
        String typesFileContents = FileUtils.readFileToString(typesFile);
        assertTrue(typesFileContents.contains(sd.getLocalTypes().get(0).getTypeName()));

        assertTrue(managersFile.exists());
        String managersFileContents = FileUtils.readFileToString(managersFile);
        assertTrue(managersFileContents.contains("\"" + sd.getServiceId() + "\""));
        assertFalse(managersFileContents.contains("\"" + sd2.getServiceId() + "\""));

        this.localDSM.defineService(sd2);

        processor = new ServiceConfigurationProcessor();
        processor.setFileSystem(this.fileSystem);
        buildWithProcessor(this.project, "Foo", processor);

        assertTrue(managersFile.exists());
        managersFileContents = FileUtils.readFileToString(managersFile);
        assertTrue(managersFileContents.contains("\"" + sd.getServiceId() + "\""));
        assertTrue(managersFileContents.contains("\"" + sd2.getServiceId() + "\""));

        assertTrue(typesFile.exists());
        typesFileContents = FileUtils.readFileToString(typesFile);
        assertTrue(typesFileContents.contains(sd.getLocalTypes().get(0).getTypeName()));
        assertTrue(typesFileContents.contains(sd2.getLocalTypes().get(0).getTypeName()));
        assertTrue(typesFileContents.contains(OperationEnumeration.read.value()));
    }

    private static class updateService_SD extends AbstractDeprecatedServiceDefinition implements ReflectServiceDefinition {

        @Override
        public void dispose() {
        }

        @Override
        public List<ElementType> getInputTypes(String operationName) {
            return null;
        }

        @Override
        public List<String> getOperationNames() {
            return Collections.emptyList();
        }

        @Override
        public ElementType getOutputType(String operationName) {
            return null;
        }

        @Override
        public String getPackageName() {
            return null;
        }

        @Override
        public String getServiceId() {
            return "updateService";
        }

        @Override
        public ServiceType getServiceType() {
            return new WebServiceType();
        }

        @Override
        public String getServiceClass() {
            return "com.wavemaker.tools.service.UpdateService_SD";
        }

        @Override
        public List<ElementType> getTypes() {
            return new ArrayList<ElementType>();
        }

        @Override
        public String getRuntimeConfiguration() {
            return null;
        }

        @Override
        public List<String> getEventNotifiers() {
            return new ArrayList<String>();
        }

        @Override
        public boolean isLiveDataService() {
            return false;
        }

        @Override
        public String getOperationType(String operationName) {
            return null;
        }
    }

    private static class updateService_SD2 extends AbstractDeprecatedServiceDefinition implements ReflectServiceDefinition {

        @Override
        public void dispose() {
        }

        @Override
        public String getRuntimeConfiguration() {
            return "foo/bar.xml";
        }

        @Override
        public List<ElementType> getInputTypes(String operationName) {
            return null;
        }

        @Override
        public List<String> getOperationNames() {
            return Collections.emptyList();
        }

        @Override
        public ElementType getOutputType(String operationName) {
            return null;
        }

        @Override
        public String getPackageName() {
            return null;
        }

        @Override
        public String getServiceId() {
            return "updateService2";
        }

        @Override
        public ServiceType getServiceType() {
            return new JavaServiceType();
        }

        @Override
        public String getServiceClass() {
            return "com.wavemaker.tools.service.UpdateService_SD2";
        }

        @Override
        public List<ElementType> getTypes() {
            return new ArrayList<ElementType>();
        }

        @Override
        public List<String> getEventNotifiers() {
            return new ArrayList<String>();
        }

        @Override
        public boolean isLiveDataService() {
            return false;
        }

        @Override
        public String getOperationType(String operationName) {
            return null;
        }
    }

    private static class updateOperation_SD extends AbstractDeprecatedServiceDefinition implements ReflectServiceDefinition {

        private final List<String> operationNames;

        public updateOperation_SD() {
            this.operationNames = new ArrayList<String>(1);
            this.operationNames.add("add");
        }

        @Override
        public void dispose() {
        }

        @Override
        public String getRuntimeConfiguration() {
            return null;
        }

        @Override
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

        @Override
        public List<String> getOperationNames() {
            return this.operationNames;
        }

        @Override
        public ElementType getOutputType(String operationName) {
            ElementType ret = null;
            if (operationName.equals("add")) {
                ret = new ElementType("result", long.class, false);
            }
            return ret;
        }

        @Override
        public String getPackageName() {
            return null;
        }

        @Override
        public String getServiceId() {
            return "updateOperation";
        }

        @Override
        public ServiceType getServiceType() {
            return new JavaServiceType();
        }

        @Override
        public String getServiceClass() {
            return "com.wavemaker.tools.service.UpdateOperation_SD";
        }

        @Override
        public List<ElementType> getTypes() {
            return new ArrayList<ElementType>();
        }

        @Override
        public List<String> getEventNotifiers() {
            return new ArrayList<String>();
        }

        @Override
        public boolean isLiveDataService() {
            return false;
        }

        @Override
        public String getOperationType(String operationName) {
            return null;
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
            ElementType etp = new ElementType("fooNested", "package.name.FooNested");
            etp.getExclude().add(OperationEnumeration.read);
            et.getProperties().add(etp);

            et = new ElementType("baz", "package.name.Baz");
            ret.add(et);

            return ret;
        }
    }

    private void buildWithProcessor(Project project, String serviceClass, Processor processor) throws IOException {
        JavaCompiler compiler = new WaveMakerJavaCompiler();
        StandardJavaFileManager standardFileManager = compiler.getStandardFileManager(null, null, null);
        ResourceJavaFileManager fileManager = new ResourceJavaFileManager(standardFileManager);

        project.getClassOutputFolder().createIfMissing();
        fileManager.setLocation(StandardLocation.CLASS_OUTPUT, Collections.singleton(project.getClassOutputFolder()));

        File javaSrc = project.getRootFolder().getFile("services/src/Foo.java");
        javaSrc.getContent().write("public class Foo{public int getInt(){return 12;}}");

        Iterable<? extends JavaFileObject> compilationUnits = fileManager.list(StandardLocation.SOURCE_PATH, "", Collections.singleton(Kind.SOURCE),
            true);

        Set<String> options = new HashSet<String>();
        options.add("-A" + ServiceProcessorConstants.PROJECT_NAME_PROP + "=" + project.getProjectName());

        // Create the compilation task
        CompilationTask task = compiler.getTask(null, fileManager, null, options, null, compilationUnits);
        task.setProcessors(Collections.singletonList(processor));
        // Perform the compilation task.
        task.call();

    }
}
