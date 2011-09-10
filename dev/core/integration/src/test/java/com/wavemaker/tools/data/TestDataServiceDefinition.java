/*
 *  Copyright (C) 2007-2009 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.data;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Properties;

import junit.framework.Test;
import junit.framework.TestSuite;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.infra.DependentTestFailureException;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.data.ExternalDataModelConfig;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.service.definition.ReflectServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceOperation;
import com.wavemaker.tools.data.util.DataServiceTestUtils;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.ServiceClassGenerator;
import com.wavemaker.tools.util.AntUtils;
import com.wavemaker.tools.util.DesignTimeUtils;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class TestDataServiceDefinition extends WMTestCase {

    private static Properties connectionProperties = DataServiceTestUtils
            .loadSakilaConnectionProperties();

    static {
        Bootstrap.main(null);
    }

    @Override
    public void setUp() throws Exception {
        SpringUtils.initSpringConfig();
    }

    static class TestData {

        private String dependentTestName = null;

        private File projectRoot = null;

        private ServiceDefinition rtServiceDefinition = null;

        private ServiceDefinition dtServiceDefinition = null;

        private DesignServiceManager serviceMgr = null;

        private boolean skipRemaining = false;

        DesignServiceManager getDesignServiceManager() {
            return serviceMgr;
        }

        void setDesignServiceManager(DesignServiceManager serviceMgr) {
            this.serviceMgr = serviceMgr;
        }

        ServiceDefinition getRuntimeServiceDefinition() {
            return rtServiceDefinition;
        }

        void setRuntimeServiceDefinition(ServiceDefinition s) {
            rtServiceDefinition = s;
        }

        ServiceDefinition getDesignTimeServiceDefinition() {
            return dtServiceDefinition;
        }

        void setDesignTimeServiceDefinition(ServiceDefinition s) {
            dtServiceDefinition = s;
        }

        void setProjectRoot(File projectRoot) {
            this.projectRoot = projectRoot;
        }

        File getProjectRoot() {
            return projectRoot;
        }

        void setSkipRemaining(String dependentTestName) {
            this.skipRemaining = true;
            this.dependentTestName = dependentTestName;
        }

        boolean skipRemaining() {
            return skipRemaining;
        }

        String getDependentTestName() {
            return dependentTestName;
        }

        String getServiceName() {
            return "testservice";
        }

    }

    public static Test suite() {

        TestData testData = new TestData();

        TestSuite testsToRun = new TestSuite();

        testsToRun.addTest(new TestDataServiceDefinition("testImportDB",
                testData));

        testsToRun.addTest(new TestDataServiceDefinition(
                "testGetServiceConfigurationRuntime", testData));

        testsToRun.addTest(new TestDataServiceDefinition(
                "testInitDesignTimeServiceDefinition", testData));

        testsToRun.addTest(new TestDataServiceDefinition(
                "testCompareServiceNameAndIdAndType", testData));

        testsToRun.addTest(new TestDataServiceDefinition(
                "testCompareServiceClassAndPackage", testData));

        testsToRun.addTest(new TestDataServiceDefinition(
                "testRuntimeElementTypeProperties", testData));

        testsToRun.addTest(new TestDataServiceDefinition(
                "testValueTypesAreTopLevel", testData));

        testsToRun.addTest(new TestDataServiceDefinition(
                "testCompareOperationNames", testData));

        testsToRun.addTest(new TestDataServiceDefinition(
                "testGenerateServiceClassDesignTime", testData));

        testsToRun.addTest(new TestDataServiceDefinition("testQueryMetaData",
                testData));

        testsToRun.addTest(new TestDataServiceDefinition(
                "testImportDBVersionCol", testData));

        // must be last
        testsToRun.addTest(new TestDataServiceDefinition("testCleanup",
                testData));

        return testsToRun;
    }

    protected final TestData testData;

    public TestDataServiceDefinition(String testMethod, TestData testData) {
        super(testMethod);
        this.testData = testData;
    }

    protected void checkShouldSkip() {
        if (testData.skipRemaining) {
            throw new DependentTestFailureException(testData
                    .getDependentTestName());
        }
    }

    public void testImportDBVersionCol() throws Exception {

        File outputDir = IOUtils.createTempDirectory();

        try {

            ImportDB importer = new ImportDB(false);
            importer.setProperties(connectionProperties);
            importer.setDestDir(outputDir);
            importer.setServiceName("ver");
            importer.setTableFilter("v1");
            importer.setPackage("hh.gg.qq");
            importer.setDataPackage("hh.gg.qq.data");
            importer.setGenerateServiceClass(true);
            importer.setCompileServiceClass(true);
            importer.setCatalogName(null);

            File javaDir = DataModelManager.getJavaDir(outputDir, "hh.gg.qq");
            importer.setJavaDir(javaDir);

            importer.run();

            Collection<String> expectedFiles = new HashSet<String>();

            String s = outputDir.getAbsolutePath().replace("\\", "/");

            String springFile = s + "/ver.spring.xml";

            expectedFiles.add(s + "/hh/gg/qq/data/V1.java");
            expectedFiles.add(s + "/hh/gg/qq/data/V1.ql.xml");
            expectedFiles.add(s + "/hh/gg/qq/data/V1.hbm.xml");
            expectedFiles.add(s + "/hh/gg/qq/Ver.java");
            expectedFiles.add(s + "/ver.properties");
            expectedFiles.add(springFile);

            Collection<File> files = IOUtils.getFiles(outputDir);

            for (File f : files) {
                expectedFiles.remove(f.getAbsolutePath().replace("\\", "/"));
            }
            if (!expectedFiles.isEmpty()) {
                fail("Also expected files " + expectedFiles);
            }

            // check a property with name "version" exists as expected
            DataModelConfiguration cfg = new DataModelConfiguration(new File(
                    springFile));
            PropertyInfo prop = cfg.getProperty("V1", "version");
            assertTrue(prop.getType().equals("string"));
            cfg.dispose();

        } catch (RuntimeException ex) {
            testData.setSkipRemaining("testImportDB");
            throw ex;
        } finally {
            IOUtils.deleteRecursive(outputDir);
        }
    }

    public void testImportDB() throws Exception {

        File wmHome = IOUtils.createTempDirectory();
        File projectRoot = new File(wmHome, StudioConfiguration.PROJECTS_DIR);

        File outputDir = new File(projectRoot, DesignServiceManager
                .getRuntimeRelativeDir(testData.getServiceName()));

        try {

            testData.setProjectRoot(projectRoot);

            ImportDB importer = new ImportDB(false);
            importer.setProperties(connectionProperties);
            importer.setDestDir(outputDir);
            importer.setServiceName(testData.getServiceName());
            importer.setPackage("com.wavemaker.data.test");
            importer.setGenerateServiceClass(true);
            importer.setCompileServiceClass(true);
            importer.setCatalogName(null);

            // backward compat
            importer.setUseIndividualCRUDOperations(true);

            File javaDir = DataModelManager.getJavaDir(outputDir, "com.wavemaker.data.test");
            importer.setJavaDir(javaDir);

            importer.run();

            Collection<String> expectedFiles = new HashSet<String>();
            String s = outputDir.getAbsolutePath().replace("\\", "/");
            expectedFiles.add(s + "/com/wavemaker/data/test/Actor.java");
            expectedFiles.add(s + "/com/wavemaker/data/test/Actor.hbm.xml");
            expectedFiles.add(s + "/testservice.properties");
            expectedFiles.add(s + "/testservice.spring.xml");

            Collection<File> files = IOUtils.getFiles(outputDir);

            for (File f : files) {
                expectedFiles.remove(f.getAbsolutePath().replace("\\", "/"));
            }
            if (!expectedFiles.isEmpty()) {
                fail("Also expected files " + expectedFiles);
            }

            // clean up generated service class
            String sn = StringUtils.upperCaseFirstLetter(testData
                    .getServiceName());
            File f = new File(outputDir, "com/wavemaker/data/test/" + sn
                    + ".java");
            assertTrue(f.exists());
            f.delete();
            f = new File(outputDir, "com/wavemaker/data/test/" + sn + ".class");
            assertTrue(f.exists());
            f.delete();

            ServiceDefinition def = importer.getServiceDefinition();

            assertTrue(def != null);

            def = com.wavemaker.tools.data.util.DataServiceUtils
                    .unwrapAndCast(def);

            testData.setRuntimeServiceDefinition(def);

        } catch (RuntimeException ex) {
            testData.setSkipRemaining("testImportDB");
            throw ex;
        }
    }

    public void testGetServiceConfigurationRuntime() {

        checkShouldSkip();

        ServiceDefinition d = testData.getRuntimeServiceDefinition();

        assertNotNull(d);
        assertEquals("testservice.spring.xml", d.getRuntimeConfiguration());
    }

    public void testRuntimeElementTypeProperties() {

        checkShouldSkip();

        com.wavemaker.runtime.data.DataServiceDefinition d = (com.wavemaker.runtime.data.DataServiceDefinition) testData
                .getRuntimeServiceDefinition();

        DataModelConfiguration mgr = getHibernateCfgMgr();

        com.wavemaker.tools.data.util.DataServiceUtils.setupElementTypeFactory(
                mgr, d);

        List<ElementType> types = d.getTypes();

        ElementType filmActor = null;

        for (ElementType t : types) {
            if (t.getJavaType().endsWith("FilmActor")) {
                filmActor = t;
                break;
            }
        }

        assertTrue(filmActor != null);

        ElementType id = null;

        for (ElementType p : filmActor.getProperties()) {
            if (p.getName().equals("id")) {
                id = p;
                break;
            }
        }

        assertTrue(id != null);
        assertTrue(id.getJavaType().equals(
                "com.wavemaker.data.test.FilmActorId"));

        assertTrue(id.getProperties().size() == 2);
        assertEquals("actorId", id.getProperties().get(0).getName());
        assertEquals("filmId", id.getProperties().get(1).getName());
    }

    public void testValueTypesAreTopLevel() {

        checkShouldSkip();

        com.wavemaker.runtime.data.DataServiceDefinition d = (com.wavemaker.runtime.data.DataServiceDefinition) testData
                .getRuntimeServiceDefinition();

        DataModelConfiguration mgr = getHibernateCfgMgr();

        com.wavemaker.tools.data.util.DataServiceUtils.setupElementTypeFactory(
                mgr, d);

        List<ElementType> types = d.getTypes();

        ElementType filmActorId = null;

        for (ElementType t : types) {
            if (t.getJavaType().endsWith(".FilmActorId")) {
                filmActorId = t;
                break;
            }
        }

        assertTrue(filmActorId != null);
    }

    private DataModelConfiguration getHibernateCfgMgr() {
        File f = new File(testData.getProjectRoot(), DesignServiceManager
                .getRuntimeRelativeDir(testData.getServiceName()));
        f = new File(f, testData.getRuntimeServiceDefinition()
                .getRuntimeConfiguration());

        ExternalDataModelConfig e = new DesignExternalDataModelConfig(testData
                .getServiceName(), testData.getDesignServiceManager());

        return new DataModelConfiguration(f, e);
    }

    public void testInitDesignTimeServiceDefinition() {

        checkShouldSkip();

        try {

            DesignServiceManager dsm = DesignTimeUtils
                    .getDSMForProjectRoot(testData.getProjectRoot());
            testData.setDesignServiceManager(dsm);

            DataModelConfiguration mgr = getHibernateCfgMgr();

            assertEquals("mgr entity names: " + mgr.getEntityNames()
                    + " length: " + mgr.getEntityNames().size(), 29, mgr
                    .getEntityNames().size());

            // register new service from runtime definition - required
            // because the following information is only available at
            // db import, and stored with the design service manager:
            // - whether an operation returns a single result
            // - the operation output type
            // this is for query operations

            dsm.defineService(testData.getRuntimeServiceDefinition());

            ServiceDefinition def = new com.wavemaker.tools.data.DataServiceDefinition(
                    "testservice", mgr, dsm);

            assertTrue(def.getServiceId().equals("testservice"));

            testData.setDesignTimeServiceDefinition(def);

        } catch (RuntimeException ex) {
            testData.setSkipRemaining("testInitDesignTimeServiceDefinition");
            throw ex;
        }
    }

    public void testCompareServiceNameAndIdAndType() {

        checkShouldSkip();

        ServiceDefinition rt = testData.getRuntimeServiceDefinition();
        ServiceDefinition dt = testData.getDesignTimeServiceDefinition();

        try {

            assertTrue(!rt.getClass().equals(dt.getClass()));

            assertTrue(rt.getServiceId().equals(dt.getServiceId()));

            assertEquals(rt.getServiceType().getTypeName(),
                    dt.getServiceType().getTypeName());

        } catch (RuntimeException ex) {
            testData.setSkipRemaining("testCompareServiceNameAndId");
            throw ex;
        }
    }

    public void testCompareServiceClassAndPackage() {

        checkShouldSkip();

        ReflectServiceDefinition rt = (ReflectServiceDefinition) testData.getRuntimeServiceDefinition();
        ReflectServiceDefinition dt = (ReflectServiceDefinition) testData.getDesignTimeServiceDefinition();

        try {

            assertTrue(rt.getServiceClass().equals(dt.getServiceClass()));

            assertTrue(rt.getPackageName().equals(dt.getPackageName()));

        } catch (RuntimeException ex) {
            testData.setSkipRemaining("testCompareServiceNameAndId");
            throw ex;
        }
    }

    public void testCompareOperationNames() {

        checkShouldSkip();

        ServiceDefinition rt = testData.getRuntimeServiceDefinition();
        ServiceDefinition dt = testData.getDesignTimeServiceDefinition();
        assertEquals(rt.getServiceOperations().size(),
                dt.getServiceOperations().size());
        
        List<String> rtOpNames = new ArrayList<String>(rt.getServiceOperations().size());
        for (ServiceOperation so: rt.getServiceOperations()) {
            rtOpNames.add(so.getName());
        }
        
        for (ServiceOperation so : dt.getServiceOperations()) {
            if (!rtOpNames.remove(so.getName())) {
                fail(so.getName() + " not in runtime service def");
            }
        }
        if (!rtOpNames.isEmpty()) {
            fail("Also expected " + rtOpNames + " in design service def");
        }
    }

    public void testGenerateServiceClassDesignTime() throws Exception {

        checkShouldSkip();
        
        ReflectServiceDefinition dt = (ReflectServiceDefinition) testData.getDesignTimeServiceDefinition();

        String clazz = dt.getServiceClass();

        File f = new File(testData.getProjectRoot(), DesignServiceManager
                .getRuntimeRelativeDir(testData.getServiceName()));

        String path = StringUtils.classNameToSrcFilePath(clazz);

        assertTrue(!(new File(f, path).exists()));

        ServiceClassGenerator g = new ServiceClassGenerator();
        g.addService(f, testData.getServiceName());
        g.setDesignServiceManager(testData.getDesignServiceManager());
        g.setOutputDirectory(f);
        g.run();

        assertTrue(new File(f, path).exists());

        AntUtils.javac(f.getAbsolutePath(), f);

        ClassLoader cl = ClassLoaderUtils
                .getClassLoaderForFile(new File[] { f });

        Class<?> c = ClassLoaderUtils.loadClass(clazz, cl);

        Class<?> actor = ClassLoaderUtils.loadClass(StringUtils.fq(dt.getPackageName(), "Actor"),
                cl);

        CheckGeneratedServiceMethods.checkType(c, actor, true);

        assertEquals(282, c.getMethods().length);
    }

    public void testQueryMetaData() {

        checkShouldSkip();

        DataModelConfiguration cfg = getHibernateCfgMgr();

        Collection<String> names = cfg.getQueryNames();

        assertEquals(1, names.size());

        QueryInfo qi = cfg.getQuery(names.iterator().next());

        assertTrue(qi.getReturnsSingleResult());
    }

    public void testCleanup() throws IOException {
        IOUtils.deleteRecursive(testData.getProjectRoot());
    }

}
