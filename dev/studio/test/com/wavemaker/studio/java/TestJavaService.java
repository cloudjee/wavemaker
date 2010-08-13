/*
 * Copyright (C) 2007-2008 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.wavemaker.studio.java;

import java.io.File;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;

import com.wavemaker.common.util.ClassLoaderUtils;

import com.wavemaker.studio.infra.StudioTestCase;

import com.wavemaker.studio.java.JavaService.CompileOutput;

import com.wavemaker.tools.project.DeploymentManager;

import com.wavemaker.tools.service.DesignServiceManager;

import com.wavemaker.tools.service.definitions.DataObject;
import com.wavemaker.tools.service.definitions.Operation;
import com.wavemaker.tools.service.definitions.Service;

import org.apache.commons.io.FileUtils;

import org.apache.commons.lang.SystemUtils;

import org.springframework.core.io.ClassPathResource;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestJavaService extends StudioTestCase {

    DesignServiceManager dsm;

    DeploymentManager dm;

    JAXBContext jaxbContext;

    Unmarshaller unmarshaller;

    @Override
    public void onSetUp() throws Exception {

        super.onSetUp();

        dsm = (DesignServiceManager) getApplicationContext().getBean(
                "designServiceManager");
        dm = (DeploymentManager) getApplicationContext().getBean(
                "deploymentManager");

        try {
            jaxbContext = JAXBContext
                    .newInstance("com.wavemaker.tools.service.definitions");
            unmarshaller = jaxbContext.createUnmarshaller();
        } catch (JAXBException ex) {
            throw new RuntimeException(ex);
        }
    }

    public void testNewService() throws Exception {

        String projectName = "testNewService";
        String serviceId = "newServiceId";
        String className = "FooBar";
        makeProject(projectName, false);

        Object o = invokeService_toObject("javaService", "newClass",
                new Object[] { serviceId, className });

        File expectedDir = dsm.getServiceRuntimeDirectory(serviceId);
        assertTrue("expectedDir DNE: " + expectedDir, expectedDir.exists());

        File expectedXml = dsm.getServiceDefXml(serviceId);
        assertTrue("expectedXML DNE: " + expectedXml, expectedXml.exists());

        assertTrue("o: " + o, o instanceof String);
        String s = (String) o;
        assertTrue("s:" + s, s.contains("public class FooBar extends "));
        assertTrue("s: " + s, s.endsWith("}" + SystemUtils.LINE_SEPARATOR));

        File serviceDefFile = dsm.getServiceDefXml(serviceId);
        assertTrue(serviceDefFile.exists());

        Service service = (Service) unmarshaller.unmarshal(serviceDefFile);
        assertEquals(serviceId, service.getId());
        assertEquals(1, service.getOperation().size());
        assertEquals(className, service.getClazz());
    }

    public void testDuplicateNewService() throws Exception {

        String projectName = "testDuplicateNewService";
        String serviceId = "newServiceId";
        String className = "FooBar";
        makeProject(projectName, false);

        invokeService_toObject("javaService", "newClass",
                new Object[] { serviceId, className });

        try {
            invokeService_toObject("javaService", "newClass", new Object[] {
                    serviceId, className });
            fail("expected exception");
        } catch (WMRuntimeException e) {
            assertTrue(e.getMessage().contains("another service"));
        }
    }

    public void testNewServicePackage() throws Exception {

        String projectName = "testNewServicePackage";
        String serviceId = "newServicePackageId";
        String packageName = "foo.bar.baz";
        String className = "FooBar";
        makeProject(projectName, false);

        Object o = invokeService_toObject("javaService", "newClass",
                new Object[] { serviceId, packageName + "." + className });

        File expectedDir = dsm.getServiceRuntimeDirectory(serviceId);
        assertTrue("expectedDir DNE: " + expectedDir, expectedDir.exists());

        File expectedXml = dsm.getServiceDefXml(serviceId);
        assertTrue("expectedXML DNE: " + expectedXml, expectedXml.exists());

        File expectedPackageDir = new File(expectedDir, "foo/bar/baz");
        assertTrue(expectedPackageDir.exists());

        assertTrue("o: " + o, o instanceof String);
        String s = (String) o;
        assertTrue("s: " + s, s.contains("package foo.bar.baz;"));
        assertTrue("S: " + s, s.contains("public class FooBar extends "));
        assertTrue("s: " + s, s.endsWith("}" + SystemUtils.LINE_SEPARATOR));

        // verify that the class hasn't stuck around
        boolean gotException = false;
        try {
            this.getClass().getClassLoader().loadClass(
                    packageName + "." + className);
        } catch (ClassNotFoundException e) {
            gotException = true;
        }
        assertTrue(gotException);

        File serviceDefFile = dsm.getServiceDefXml(serviceId);
        assertTrue(serviceDefFile.exists());

        Service service = (Service) unmarshaller.unmarshal(serviceDefFile);
        assertEquals(serviceId, service.getId());
        assertEquals(1, service.getOperation().size());
        assertEquals(packageName + "." + className, service.getClazz());
    }

    public void testSaveOpen() throws Exception {

        String projectName = "testSaveOpen";
        String serviceId = "saveServiceId";
        String packageName = "foo.bar.baz";
        String className = "FooBar";
        makeProject(projectName, false);

        Object o = invokeService_toObject("javaService", "newClass",
                new Object[] { serviceId, packageName + "." + className });
        assertNotNull(o);

        File serviceDefFile = dsm.getServiceDefXml(serviceId);
        assertTrue(serviceDefFile.exists());

        Service service = (Service) unmarshaller.unmarshal(serviceDefFile);
        assertEquals(serviceId, service.getId());
        assertEquals(1, service.getOperation().size());
        assertEquals(packageName + "." + className, service.getClazz());

        // give the mtime a chance to increment
        Thread.sleep(2000);

        File javaSource = (new ClassPathResource(
                "com/wavemaker/tools/project/FooBar.java.txt")).getFile();
        assertTrue(javaSource.exists());

        File javaDataSource = (new ClassPathResource(
                "com/wavemaker/tools/project/FooBarData.java.txt")).getFile();
        File javaDataDest = new File(dsm.getServiceRuntimeDirectory(serviceId),
                "foo/bar/baz/data/FooBarData.java");
        FileUtils.copyFile(javaDataSource, javaDataDest);

        File javaData2Source = (new ClassPathResource(
                "com/wavemaker/tools/project/FooBarData2.java.txt")).getFile();
        File javaData2Dest = new File(
                dsm.getServiceRuntimeDirectory(serviceId),
                "foo/bar/baz/data/FooBarData2.java");
        FileUtils.copyFile(javaData2Source, javaData2Dest);

        o = invokeService_toObject("javaService", "saveClass",
                new Object[] { serviceId,
                        FileUtils.readFileToString(javaSource) });
        assertNotNull(o);
        assertTrue(o instanceof CompileOutput);
        assertTrue( ((CompileOutput)o).isBuildSucceeded() );

        service = (Service) unmarshaller.unmarshal(serviceDefFile);
        assertEquals(serviceId, service.getId());
        assertEquals(3, service.getOperation().size());
        assertEquals(packageName + "." + className, service.getClazz());
        assertEquals(1, service.getDataobjects().getDataobject().size());
        DataObject dao = service.getDataobjects().getDataobject().get(0);
        assertEquals("FooBarData", dao.getName());
        assertEquals("foo.bar.baz.data.FooBarData", dao.getJavaType());
        assertEquals(1, dao.getElement().size());
        assertEquals("intVal", dao.getElement().get(0).getName());

        Operation op = null;
        for (Operation opT : service.getOperation()) {
            if (opT.getName().equals("someOp")) {
                op = opT;
                break;
            }
        }
        assertNotNull("couldn't find someOp", op);
        assertEquals("someOp", op.getName());
        assertEquals(1, op.getParameter().size());
        assertEquals("int", op.getParameter().get(0).getTypeRef());
        assertEquals("int", op.getReturn().getTypeRef());

        o = invokeService_toObject("javaService", "openClass",
                new Object[] { serviceId });
        assertTrue(o instanceof String);
        assertEquals(FileUtils.readFileToString(javaSource), o);

        dsm.getProjectManager().closeProject();
    }

    @SuppressWarnings("unchecked")
    public void testNewSaveSimple() throws Exception {

        // MAV-2328
        if (SystemUtils.IS_OS_WINDOWS) {
            return;
        }

        String projectName = "testSimple";
        String serviceId = "newServiceId";
        String className = "foo.bar.FooBar";
        makeProject(projectName, false);

        invokeService_toObject("javaService", "newClass",
                new Object[] { serviceId, className });

        // copy in the jar
        File javaData2Source = (new ClassPathResource(
                "com/wavemaker/common/foojar.jar")).getFile();
        File javaData2Dest = new File(dsm.getProjectManager()
                .getCurrentProject().getProjectRoot(), "lib/foojar.jar");
        FileUtils.copyFile(javaData2Source, javaData2Dest, false);

        // give files a chance to update their mtime
        Thread.sleep(2000);

        File javaFile = new File(dsm.getServiceRuntimeDirectory(serviceId),
                "foo/bar/FooBar.java");
        assertTrue(javaFile.exists());
        FileUtils.writeStringToFile(javaFile, "package foo.bar;\n"
                + "import foo.bar.baz.JarType;\n" + "public class FooBar extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {\n"
                + "public JarType fooOp(int a){return null;}\n}");

        dm.build();

        // get the class
        List<File> classpath = new ArrayList<File>();
        File buildDir = dsm.getProjectManager().getCurrentProject().getWebInfClasses();
        File serviceLibDir = dsm.getProjectManager().getCurrentProject()
                .getWebInfLib();
        classpath.add(buildDir);
        if (null != serviceLibDir) {
            classpath.addAll(FileUtils.listFiles(serviceLibDir,
                    new String[] { "jar" }, false));
        }

        ClassLoader cl = ClassLoaderUtils.getTempClassLoaderForFile(classpath
                .toArray(new File[] {}));
        @SuppressWarnings("unused")
        Class<?> clazz = cl.loadClass("foo.bar.FooBar");
        clazz = null;

        Class<?> serviceClass = ClassLoaderUtils
                .loadClass("foo.bar.FooBar", cl);
        assertNotNull(serviceClass);

        // this will cause problems
        serviceClass = cl.loadClass("foo.bar.baz.JarType");
        assertNotNull(serviceClass);
        serviceClass = null;
        cl = null;
    }

    public void testJarType() throws Exception {

        // MAV-2328
        if (SystemUtils.IS_OS_WINDOWS) {
            return;
        }

        String projectName = "testJarType";
        String serviceId = "newServiceId";
        String className = "foo.bar.FooBar";
        makeProject(projectName, false);

        invokeService_toObject("javaService", "newClass",
                new Object[] { serviceId, className });

        // copy in the jar
        File javaData2Source = (new ClassPathResource(
                "com/wavemaker/common/foojar.jar")).getFile();
        File javaData2Dest = new File(dsm.getProjectManager()
                .getCurrentProject().getProjectRoot(), "lib/foojar.jar");
        FileUtils.copyFile(javaData2Source, javaData2Dest);

        // give files a chance to update their mtime
        Thread.sleep(2000);

        invokeService_toObject("javaService", "saveClass",
                        new Object[] {
                                serviceId,
                                "package foo.bar;\n"
                                        + "import foo.bar.baz.JarType;\n"
                                        + "public class FooBar extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {\npublic JarType fooOp(int a){return null;}\n}" });

        // give files a chance to update their mtime
        Thread.sleep(2000);

        File expectedDir = dsm.getServiceRuntimeDirectory(serviceId);
        assertTrue("expectedDir DNE: " + expectedDir, expectedDir.exists());

        File serviceDefFile = dsm.getServiceDefXml(serviceId);
        assertTrue(serviceDefFile.exists());

        Service service = (Service) unmarshaller.unmarshal(serviceDefFile);
        assertEquals(serviceId, service.getId());
        assertEquals(1, service.getOperation().size());
        assertEquals(className, service.getClazz());

        service = null;
        dsm.getProjectManager().closeProject();

        try {
            dsm.getClass().getClassLoader().loadClass("foo.bar.FooBar");
            fail("got foo.bar.FooBar");
        } catch (ClassNotFoundException e) {
            // good
        }
    }

    public void testBadId() throws Exception {

        makeProject("testBadId", false);
        String serviceName = "DNEservice";

        try {
            invokeService_toObject("javaService", "saveClass",
                            new Object[] {
                                    serviceName,
                                    "package foo.bar;\n"
                                            + "public class FooBar extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {\n"
                                            + "\tpublic FooBar getInstance() { return null; }\n"
                                            + "}" });
            fail("expected exception");
        } catch (WMRuntimeException e) {
            assertEquals(Resource.STUDIO_UNKNOWN_SERVICE
                    .getMessage(serviceName), e.getMessage());
        }
    }

    public void testBadJava() throws Exception {

        String projectName = "testNewService";
        String serviceId = "newServiceId";
        String className = "FooBar";
        makeProject(projectName, false);

        invokeService_toObject("javaService", "newClass",
                new Object[] { serviceId, className });

        // let the fs catch up
        Thread.sleep(2000);
        
        Object o = invokeService_toObject(
                        "javaService",
                        "saveClass",
                        new Object[] {
                                serviceId,
                                "package foo.bar;\nasdf"
                                        + "public class FooBar extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {\n"
                                        + "\tpublic FooBar getInstance() { return null; }\n"
                                        + "}" });
        
        assertTrue(o instanceof CompileOutput);
        assertFalse( ((CompileOutput)o).isBuildSucceeded() );
    }
    
    /**
     * Tests saving a bad java file when there is no class file.
     */
    public void testBadJavaNoClassFile() throws Exception {

        String projectName = "testNewService";
        String serviceId = "newServiceId";
        String className = "FooBar";
        makeProject(projectName, false);

        invokeService_toObject("javaService", "newClass",
                new Object[] { serviceId, className });

        invokeService_toObject("deploymentService", "testRunClean", null);

        // let the fs catch up
        Thread.sleep(2000);
        
        Object o = invokeService_toObject(
                        "javaService",
                        "saveClass",
                        new Object[] {
                                serviceId,
                                "package foo.bar;\nasdf"
                                        + "public class FooBar extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {\n"
                                        + "\tpublic FooBar getInstance() { return null; }\n"
                                        + "}" });
        
        assertTrue(o instanceof CompileOutput);
        assertFalse( ((CompileOutput)o).isBuildSucceeded() );
    }

    public void testExcludeOtherServicesTypes() throws Exception {

        String projectName = "testExcludeOtherServicesTypes";
        String oneServiceId = "newServiceId";
        String oneClassName = "foo.bar.FooBar";
        String twoServiceId = "twoService";
        String twoClassName = "com.foo.BarBaz";

        makeProject(projectName, false);

        invokeService_toObject("javaService", "newClass",
                new Object[] { oneServiceId, oneClassName });

        // give files a chance to update their mtime
        Thread.sleep(2000);

        invokeService_toObject("javaService", "saveClass",
                        new Object[] {
                                oneServiceId,
                                "package foo.bar;\n"
                                        + "public class FooBar extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {\n"
                                        + "\tpublic FooBar getInstance() { return null; }\n"
                                        + "}" });

        invokeService_toObject("javaService", "newClass",
                new Object[] { twoServiceId, twoClassName });

        // give files a chance to update their mtime
        Thread.sleep(2000);

        invokeService_toObject("javaService", "saveClass",
                        new Object[] {
                                twoServiceId,
                                "package com.foo;\n"
                                        + "import "
                                        + oneClassName
                                        + ";\n"
                                        + "public class BarBaz extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {\n"
                                        + "\tpublic FooBar getFooBar() { return null; }\n"
                                        + "}" });

        // give files a chance to update their mtime
        Thread.sleep(2000);

        File expectedDir = dsm.getServiceRuntimeDirectory(twoServiceId);
        assertTrue("expectedDir DNE: " + expectedDir, expectedDir.exists());

        File serviceDefFile = dsm.getServiceDefXml(twoServiceId);
        assertTrue(serviceDefFile.exists());

        Service service = (Service) unmarshaller.unmarshal(serviceDefFile);
        assertEquals(twoServiceId, service.getId());
        assertEquals(1, service.getOperation().size());
        assertEquals(twoClassName, service.getClazz());
        assertEquals(0, service.getDataobjects().getDataobject().size());

        expectedDir = dsm.getServiceRuntimeDirectory(oneServiceId);
        assertTrue("expectedDir DNE: " + expectedDir, expectedDir.exists());

        serviceDefFile = dsm.getServiceDefXml(oneServiceId);
        assertTrue(serviceDefFile.exists());

        service = (Service) unmarshaller.unmarshal(serviceDefFile);
        assertEquals(oneServiceId, service.getId());
        assertEquals(1, service.getOperation().size());
        assertEquals(oneClassName, service.getClazz());
        assertEquals(1, service.getDataobjects().getDataobject().size());
        assertEquals(oneClassName, service.getDataobjects().getDataobject()
                .get(0).getJavaType());
    }
    
    // MAV-1360 - repro case
    public void testNewServiceWithVariables() throws Exception {

        String projectName = "testNewServiceWithVariables";
        String serviceId = "test";
        String className = "Test";
        makeProject(projectName, false);

        invokeService_toObject("javaService", "newClass",
                new Object[] { serviceId, className });

        // give files a chance to update their mtime
        Thread.sleep(2000);

        invokeService_toObject("javaService", "saveClass",
                        new Object[] {
                                serviceId,
                                "public class Test extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {\n"+
                                "\tpublic String testMe(String firstName, String lastName) {\n"+
                                "\t\ttry { \n"+
                                "\t\t\tString s = \"hello world\";\n"+
                                "\t\t} catch (Exception e) { \n"+
                                "\t\t}\n"+
                                "\t\treturn null;\n"+
                                "\t}\n"+
                                "}"});
        
        // give files a chance to update their mtime
        Thread.sleep(2000);
        
        File serviceDefFile = dsm.getServiceDefXml(serviceId);
        assertTrue(serviceDefFile.exists());

        Service service = (Service) unmarshaller.unmarshal(serviceDefFile);
        assertEquals(serviceId, service.getId());
        assertEquals(1, service.getOperation().size());
        assertEquals(className, service.getClazz());
        assertEquals(0, service.getDataobjects().getDataobject().size());

        Operation oper = service.getOperation().get(0);
        assertEquals("testMe", oper.getName());
        assertEquals(2, oper.getParameter().size());
        assertEquals("firstName", oper.getParameter().get(0).getName());
        assertEquals("lastName", oper.getParameter().get(1).getName());
    }

    // MAV-1377
    public void XXXtestGreedyJavaService_LinkedType() throws Exception {

        String projectName = "testNewServiceWithVariables";
        makeProject(projectName, false);
        
        String fooServiceId = "Foo";
        String barServiceId = "Bar";

        // create Bar
        invokeService_toObject("javaService", "newClass",
                new Object[] { barServiceId, "Bar" });
        Thread.sleep(2000);

        invokeService_toObject("javaService", "saveClass",
                new Object[] {
                        barServiceId,
                        "public class Bar extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {\n"+
                        "\tprivate String message;\n"+
                        "\tpublic String getMessage() { return this.message; }\n"+
                        "\tpublic void setMessage(String message) { this.message = message; }\n"+
                        "}"});
        Thread.sleep(2000);
        
        // make sure Bar hasn't been added as a type
        for (DataObject dao: dsm.getDataObjects()) {
            assertFalse(dao.getJavaType().equals("Bar"));
        }

        // add Foo service
        invokeService_toObject("javaService", "newClass",
                new Object[] { fooServiceId, "Foo" });
        Thread.sleep(2000);

        invokeService_toObject("javaService", "saveClass",
                new Object[] {
                        fooServiceId,
                        "public class Foo extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {\n"+
                        "\tprivate Bar bar;\n"+
                        "\tpublic Bar getBar() { return this.bar; }\n"+
                        "\tpublic void setBar(Bar bar) { this.bar = bar; }\n"+
                        "}"});
        Thread.sleep(2000);
        
        // make sure Bar has now been added as a type
        boolean gotBar = false;
        for (DataObject dao: dsm.getDataObjects()) {
            if (dao.getJavaType().equals("Bar")) {
                if (gotBar) {
                    fail("got multiple Bars");
                }
                
                assertEquals(1, dao.getElement().size());
                assertEquals("message", dao.getElement().get(0).getName());
                
                gotBar = true;
            }
        }
        assertTrue(gotBar);
        
        // redefine Bar
        invokeService_toObject("javaService", "saveClass",
                new Object[] {
                        barServiceId,
                        "public class Bar extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {\n"+
                        "\tprivate String textMessage;\n"+
                        "\tpublic String getTextMessage() { return this.textMessage; }\n"+
                        "\tpublic void setTextMessage(String textMessage) { this.textMessage = textMessage; }\n"+
                        "}"});
        Thread.sleep(2000);
        
        // make sure Bar has been updated
        gotBar = false;
        for (DataObject dao: dsm.getDataObjects()) {
            if (dao.getJavaType().equals("Bar")) {
                if (gotBar) {
                    fail("got multiple Bars");
                }
                
                assertEquals(1, dao.getElement().size());
                assertEquals("textMessage", dao.getElement().get(0).getName());
                
                gotBar = true;
            }
        }
        assertTrue(gotBar);
    }
}
