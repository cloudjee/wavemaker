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

package com.wavemaker.studio.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.SortedSet;
import java.util.TreeSet;

import javax.xml.bind.JAXBException;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.json.type.OperationEnumeration;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.AbstractFileService;
import com.wavemaker.tools.service.ConfigurationCompiler;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.FileService;
import com.wavemaker.tools.service.definitions.DataObject;
import com.wavemaker.tools.service.definitions.DataObject.Element;
import com.wavemaker.tools.service.definitions.DataObjects;
import com.wavemaker.tools.service.definitions.EventNotifier;
import com.wavemaker.tools.service.definitions.Operation;
import com.wavemaker.tools.service.definitions.Operation.Parameter;
import com.wavemaker.tools.service.definitions.Operation.Return;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.service.definitions.ServiceComparator;
import com.wavemaker.tools.service.smd.Method;
import com.wavemaker.tools.service.smd.Param;
import com.wavemaker.tools.service.types.ComplexType;
import com.wavemaker.tools.service.types.Field;
import com.wavemaker.tools.service.types.PrimitiveType;
import com.wavemaker.tools.service.types.PrimitiveType.PRIMITIVES;
import com.wavemaker.tools.service.types.Type;
import com.wavemaker.tools.service.types.Types;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Beans;

/**
 * @author small
 * @author Jeremy Grelle
 * 
 */
public class TestConfigurationCompiler extends StudioTestCase {

    private DesignServiceManager dsm;

    private ProjectManager pm;

    private FileService fileService;

    @Before
    @Override
    public void setUp() throws Exception {

        super.setUp();

        this.pm = (ProjectManager) getApplicationContext().getBean("projectManager");
        this.dsm = (DesignServiceManager) getApplicationContext().getBean("designServiceManager");
        this.fileService = new AbstractFileService(new LocalStudioConfiguration()) {

            public Resource getFileServiceRoot() {
                return new FileSystemResource("/");
            }
        };
    }

    @Test
    public void testGenerateManagers() throws Exception {

        File actualFile = File.createTempFile("TestRuntimeConfigurationGeneration", ".tmp");
        actualFile.deleteOnExit();

        Project project = new Project(new FileSystemResource(actualFile.getParentFile().getAbsolutePath() + "/"), new LocalStudioConfiguration());

        SortedSet<Service> services = new TreeSet<Service>(new ServiceComparator());
        Service a = new Service();
        a.setId("a");
        Service b = new Service();
        b.setId("b");
        services.add(a);
        services.add(b);

        EventNotifier enA = new EventNotifier();
        enA.setName("eventA");

        a.getEventnotifier().add(enA);
        b.getEventnotifier().add(enA);

        ConfigurationCompiler.generateManagers(project, new FileSystemResource(actualFile), services);

        File expectedFile = new ClassPathResource("com/wavemaker/tools/service/generate-managers-test.xml").getFile();

        Beans actual = SpringConfigSupport.readBeans(new FileSystemResource(actualFile.getAbsolutePath() + "/"), this.fileService);
        Beans expected = SpringConfigSupport.readBeans(new FileSystemResource(expectedFile.getAbsolutePath() + "/"), this.fileService);

        assertBeansEquals(expected, actual);
    }

    @Test
    public void testGenerateServicesWithoutSpringFile() throws Exception {

        File actualFile = File.createTempFile("TestRuntimeConfigurationGeneration", ".tmp");
        actualFile.deleteOnExit();
        Project project = new Project(new FileSystemResource(actualFile.getParentFile().getAbsolutePath() + "/"), new LocalStudioConfiguration());

        SortedSet<Service> services = new TreeSet<Service>(new ServiceComparator());
        Service a = new Service();
        a.setId("service1");
        a.setClazz("foo.bar.Service1");
        services.add(a);

        try {
            ConfigurationCompiler.generateServices(project, new FileSystemResource(actualFile), services);
            fail("no exception");
        } catch (WMRuntimeException e) {
            assertEquals(e.getMessageId(), MessageResource.NO_EXTERNAL_BEAN_DEF.getId());
        }
    }

    @Test
    public void testGenerateSMDs() throws Exception {

        File expectedAFile = new ClassPathResource("com/wavemaker/tools/service/testgeneratesmds_a.smd").getFile();
        File expectedBFile = new ClassPathResource("com/wavemaker/tools/service/testgeneratesmds_b.smd").getFile();

        makeProject("testGenerateSMDs");

        SortedSet<Service> services = new TreeSet<Service>(new ServiceComparator());
        Service a = new Service();
        a.setId("service1");
        a.setClazz("foo.bar.Service1");
        Operation op = new Operation();
        op.setName("foo");
        Return r = new Return();
        r.setTypeRef("java.lang.String");
        op.setReturn(r);
        List<Parameter> params = op.getParameter();
        params.add(newParameter("foo", "java.lang.Integer"));
        params.add(newParameter("bar", "java.lang.Integer"));
        a.getOperation().add(op);
        services.add(a);

        Service b = new Service();
        b.setId("service2");
        b.setClazz("foo.bar.Service2");
        op = new Operation();
        op.setName("bar");
        r = new Return();
        r.setTypeRef("java.lang.Integer");
        r.setIsList(true);
        op.setReturn(r);
        params = op.getParameter();
        params.add(newParameter("param", "java.lang.Boolean", true));
        b.getOperation().add(op);
        services.add(b);

        ConfigurationCompiler.generateSMDs(this.pm.getCurrentProject(), services);

        File serviceA_SMD = ConfigurationCompiler.getSmdFile(this.pm.getCurrentProject(), a.getId()).getFile();
        File serviceB_SMD = ConfigurationCompiler.getSmdFile(this.pm.getCurrentProject(), b.getId()).getFile();
        assertTrue(serviceA_SMD.exists());
        assertTrue(serviceB_SMD.exists());

        assertEquals(StringUtils.deleteWhitespace(FileUtils.readFileToString(expectedAFile)),
            StringUtils.deleteWhitespace(FileUtils.readFileToString(serviceA_SMD)));

        JSONObject jsonA = (JSONObject) JSONUnmarshaller.unmarshal(FileUtils.readFileToString(serviceA_SMD));
        JSONObject expectedA = (JSONObject) JSONUnmarshaller.unmarshal(FileUtils.readFileToString(expectedAFile));
        assertEquals(expectedA, jsonA);

        JSONObject jsonB = (JSONObject) JSONUnmarshaller.unmarshal(FileUtils.readFileToString(serviceB_SMD));
        JSONObject expectedB = (JSONObject) JSONUnmarshaller.unmarshal(FileUtils.readFileToString(expectedBFile));
        assertEquals(expectedB, jsonB);
    }

    @Test
    public void testGetMethod_NoReturn() throws Exception {

        makeProject("testNoReturn");

        List<Operation> ops = new ArrayList<Operation>();
        Operation o = new Operation();
        o.setName("noReturnMethod");
        List<Parameter> params = o.getParameter();
        params.add(newParameter("arg0", "java.lang.String"));
        ops.add(o);

        SortedSet<Method> methods = ConfigurationCompiler.getMethods(ops, "foo");

        Method foundMethod = null;
        for (Method method : methods) {

            String methodName = method.getName();
            if (methodName.equals("noReturnMethod")) {
                foundMethod = method;
                break;
            }
        }

        assertNotNull(foundMethod);
        List<Param> foundParams = foundMethod.getParameters();
        assertEquals(1, foundParams.size());
    }

    @Test
    public void testGetMethod_GoodMethodOverload() throws Exception {

        makeProject("testGetMethod_GoodMethodOverload");

        List<Operation> ops = new ArrayList<Operation>();
        Operation o = new Operation();
        o.setName("args");
        List<Parameter> params = o.getParameter();
        params.add(newParameter("arg0", "java.lang.Integer", true));
        ops.add(o);

        o = new Operation();
        params = o.getParameter();
        o.setName("args");
        params.add(newParameter("arg0", "java.lang.Integer"));
        params.add(newParameter("arg1", "java.lang.String"));
        ops.add(o);

        assertEquals(2, ops.size());

        SortedSet<Method> methods = ConfigurationCompiler.getMethods(ops, "foo");
        assertEquals(1, methods.size());
        List<Param> actualParams = methods.iterator().next().getParameters();
        assertNotNull(actualParams);
        assertEquals(1, actualParams.size());
        assertEquals("arg0", actualParams.get(0).getName());
        assertEquals("[java.lang.Integer]", actualParams.get(0).getType());
    }

    @Test
    public void testGetMethod_GoodMethodOverloadNoArgs() throws Exception {

        makeProject("testGetMethod_GoodMethodOverloadNoArgs");

        List<Operation> ops = new ArrayList<Operation>();
        Operation o = new Operation();
        o.setName("args");
        List<Parameter> params = o.getParameter();
        params.add(newParameter("arg0", "java.lang.Integer"));
        ops.add(o);

        o = new Operation();
        params = o.getParameter();
        o.setName("args");
        params.add(newParameter("arg0", "java.lang.Integer"));
        params.add(newParameter("arg1", "java.lang.String"));
        ops.add(o);

        o = new Operation();
        o.setName("args");
        ops.add(o);

        SortedSet<Method> methods = ConfigurationCompiler.getMethods(ops, "foo");
        assertEquals(1, methods.size());
        List<Param> actualParams = methods.iterator().next().getParameters();
        assertEquals(null, actualParams);
    }

    @Test
    public void testGetMethod_GoodMethodOverloadNoArgsReorder() throws Exception {

        makeProject("testGetMethod_GoodMethodOverloadNoArgsReorder");
        List<Operation> ops = new ArrayList<Operation>();

        Operation o = new Operation();
        o.setName("args");
        ops.add(o);

        o = new Operation();
        List<Parameter> params = o.getParameter();
        o.setName("args");
        params.add(newParameter("arg0", "java.lang.Integer"));
        params.add(newParameter("arg1", "java.lang.String"));
        ops.add(o);

        o = new Operation();
        o.setName("args");
        params = o.getParameter();
        params.add(newParameter("arg0", "java.lang.Integer"));
        ops.add(o);

        SortedSet<Method> methods = ConfigurationCompiler.getMethods(ops, "foo");
        assertEquals(1, methods.size());
        List<Param> actualParams = methods.iterator().next().getParameters();
        assertEquals(null, actualParams);
    }

    @Test
    public void testGetMethod_BadMethodOverload() throws Exception {

        makeProject("testGetMethod_GoodMethodOverload");

        List<Operation> ops = new ArrayList<Operation>();
        Operation o = new Operation();
        o.setName("args");
        List<Parameter> params = o.getParameter();
        params.add(newParameter("arg0", "java.lang.Integer"));
        ops.add(o);

        o = new Operation();
        params = o.getParameter();
        o.setName("args");
        params.add(newParameter("arg0", "java.lang.String"));
        ops.add(o);

        assertEquals(2, ops.size());

        boolean gotException = false;
        try {
            ConfigurationCompiler.getMethods(ops, "foo");
        } catch (WMRuntimeException e) {
            gotException = true;
        }
        assertTrue(gotException);
    }

    // this file has some typeRefs without matching types, so see if we can do
    // the conversion without errors
    @Test
    public void testBadServiceDefXml() throws Exception {

        makeProject("testBadServiceDefXml");

        String badServiceData = FileUtils.readFileToString(new ClassPathResource("com/wavemaker/tools/service/bad-servicedef.xml").getFile());

        FileUtils.writeStringToFile(this.dsm.getServiceDefXml("sakila").getFile(), badServiceData);

        ConfigurationCompiler.generateSMDs(this.pm.getCurrentProject(), this.dsm.getServices());
    }

    @Test
    public void testEnclosedClassRegularName() throws Exception {

        makeProject("testEnclosedClassRegularName");

        String serviceDef = FileUtils.readFileToString(new ClassPathResource("com/wavemaker/tools/service/enclosedclass-servicedef.xml").getFile());
        FileUtils.writeStringToFile(this.dsm.getServiceDefXml("asdf").getFile(), serviceDef);

        // make sure we're getting the types properly
        Types types = ConfigurationCompiler.getTypesFromServices(this.dsm.getServices(), this.dsm.getPrimitiveDataObjects());
        boolean gotAsdfFoo = false;
        for (Map.Entry<String, Type> typeEntry : types.getTypes().entrySet()) {
            if ("Asdf$Foo".equals(typeEntry.getKey())) {
                gotAsdfFoo = true;
                assertTrue(typeEntry.getValue() instanceof ComplexType);
                ComplexType ct = (ComplexType) typeEntry.getValue();

                assertTrue(ct.getFields().containsKey("name"));
                Field field = ct.getFields().get("name");
                assertEquals("java.lang.String", field.getType());
            }
        }
        assertTrue(gotAsdfFoo);

        // and test writing them to disk
        ConfigurationCompiler.generateTypes(this.pm.getCurrentProject(), ConfigurationCompiler.getTypesFile(this.pm.getCurrentProject()),
            this.dsm.getServices(), this.dsm.getPrimitiveDataObjects());

        String typesString = FileUtils.readFileToString(ConfigurationCompiler.getTypesFile(this.pm.getCurrentProject()).getFile());
        typesString = typesString.substring(ConfigurationCompiler.WM_TYPES_PREPEND.length(), typesString.length()
            - ConfigurationCompiler.WM_TYPES_APPEND.length());
        JSON j = JSONUnmarshaller.unmarshal(typesString);
        assertTrue(j.isObject());
        JSONObject jo = (JSONObject) j;

        jo = (JSONObject) jo.get("types");
        assertNotNull(jo);

        assertTrue(jo.containsKey("Asdf$Foo"));
        jo = (JSONObject) jo.get("Asdf$Foo");

        assertEquals("asdf", jo.get("service"));
        assertTrue(jo.containsKey("fields"));
        JSONObject jop = (JSONObject) jo.get("fields");

        assertTrue(jop.containsKey("name"));
        jop = (JSONObject) jop.get("name");
        assertTrue(jop.containsKey("type"));
        assertEquals("java.lang.String", jop.get("type"));
    }

    @Test
    public void testGetTypesFromServices() throws Exception {

        SortedSet<Service> services = getTestServices();

        Types types = ConfigurationCompiler.getTypesFromServices(services, null);
        assertNotNull(types);
        assertNotNull(types.getTypes());
        assertEquals(2, types.getTypes().size());
        assertTrue(types.getTypes().containsKey("foo.bar.Baz"));
        assertTrue(types.getTypes().containsKey("foo.bar.Bclass"));

        Type tp = types.getTypes().get("foo.bar.Baz");
        assertNotNull(tp);
        assertTrue(tp instanceof ComplexType);
        ComplexType t = (ComplexType) tp;
        assertFalse(t.isLiveService());
        assertEquals("srvA", t.getService());

        assertEquals(1, t.getFields().size());
        assertTrue(t.getFields().containsKey("foo"));
        Field f = t.getFields().get("foo");
        assertTrue(f.isIsList());
        assertTrue(f.isRequired());
        assertEquals(0, f.getNoChange().size());
        assertEquals(0, f.getExclude().size());
        assertEquals(0, f.getInclude().size());

        tp = types.getTypes().get("foo.bar.Bclass");
        assertNotNull(tp);
        assertTrue(tp instanceof ComplexType);
        t = (ComplexType) tp;
        assertTrue(t.isLiveService());
        assertEquals("srvB", t.getService());
        assertFalse(t.isInternal());

        assertEquals(1, t.getFields().size());
        assertTrue(t.getFields().containsKey("bar"));
        f = t.getFields().get("bar");
        assertFalse(f.isIsList());
        assertFalse(f.isRequired());
        assertEquals(2, f.getNoChange().size());
        assertEquals(0, f.getExclude().size());
        assertEquals(0, f.getInclude().size());
        assertTrue(f.getNoChange().contains(OperationEnumeration.read));
        assertTrue(f.getNoChange().contains(OperationEnumeration.update));
        assertEquals("foo.bar.Baz", f.getType());
    }

    @Test
    public void testGetTypesFromDataObjects() throws Exception {

        List<DataObject> daos = new ArrayList<DataObject>();
        DataObject dao = new DataObject();
        dao.setJavaType("com.fooType");
        Element elem = new Element();
        elem.setName("foo");
        elem.setTypeRef("com.fooType");
        dao.getElement().add(elem);
        dao.setInternal(true);
        daos.add(dao);

        Types types = new Types();

        ConfigurationCompiler.getTypesFromDataObjects("fooService", daos, types);
        assertEquals(1, types.getTypes().size());
        assertTrue(types.getTypes().containsKey("com.fooType"));
        assertTrue(types.getTypes().get("com.fooType") instanceof ComplexType);
        ComplexType ct = (ComplexType) types.getTypes().get("com.fooType");
        assertEquals(1, ct.getFields().size());
        assertTrue(ct.isInternal());

        DesignServiceManager dsm = new DesignServiceManager();
        ConfigurationCompiler.getTypesFromDataObjects("primitive", dsm.getPrimitiveDataObjects(), types);
        assertTrue(types.getTypes().size() > 1);
        assertTrue(types.getTypes().containsKey("boolean"));
        assertTrue(types.getTypes().get("boolean") instanceof PrimitiveType);
        PrimitiveType pt = (PrimitiveType) types.getTypes().get("boolean");
        assertTrue(pt.isInternal());
        assertEquals(PRIMITIVES.BOOLEAN, pt.getPrimitiveType());
    }

    protected static void assertBeansEquals(Beans expected, Beans actual) throws IOException, JAXBException {

        File actualFileOut = File.createTempFile("TestRuntimeConfigurationGeneration", ".tmp");
        actualFileOut.deleteOnExit();
        File expectedFileOut = File.createTempFile("TestRuntimeConfigurationGeneration", ".tmp");
        expectedFileOut.deleteOnExit();

        Writer writer = new OutputStreamWriter(new FileOutputStream(actualFileOut), ServerConstants.DEFAULT_ENCODING);
        SpringConfigSupport.writeBeans(actual, writer);
        writer.close();

        writer = new OutputStreamWriter(new FileOutputStream(expectedFileOut), ServerConstants.DEFAULT_ENCODING);
        SpringConfigSupport.writeBeans(expected, writer);
        writer.close();

        assertEquals(FileUtils.readFileToString(expectedFileOut), FileUtils.readFileToString(actualFileOut));
    }

    protected Parameter newParameter(String name, String typeRef) {
        return newParameter(name, typeRef, false);
    }

    protected Parameter newParameter(String name, String typeRef, boolean isList) {

        Parameter ret = new Parameter();
        ret.setName(name);
        ret.setTypeRef(typeRef);
        ret.setIsList(isList);
        return ret;
    }

    protected SortedSet<Service> getTestServices() {

        SortedSet<Service> services = new TreeSet<Service>(new ServiceComparator());
        Service a = new Service();
        a.setId("srvA");
        a.setClazz("foo.bar.srvA");
        a.setCRUDService(true);
        DataObject dao = new DataObject();
        dao.setJavaType("foo.bar.Baz");
        dao.setName("Baz");

        Element elem = new Element();
        elem.setIsList(true);
        elem.setName("foo");
        elem.setTypeRef("foo.bar.Baz");
        dao.getElement().add(elem);
        a.setDataobjects(new DataObjects());
        a.getDataobjects().getDataobject().add(dao);

        Operation op = new Operation();
        op.setName("foo");
        Return r = new Return();
        r.setTypeRef("java.lang.String");
        op.setReturn(r);
        List<Parameter> params = op.getParameter();
        params.add(newParameter("foo", "java.lang.Integer"));
        params.add(newParameter("bar", "java.lang.Integer"));
        a.getOperation().add(op);

        services.add(a);
        a = null;

        Service b = new Service();
        b.setId("srvB");
        b.setClazz("foo.bar.srvB");
        dao = new DataObject();
        dao.setJavaType("foo.bar.Bclass");
        dao.setName("Bclass");
        dao.setSupportsQuickData(true);
        elem = new Element();
        elem.setIsList(false);
        elem.setName("bar");
        elem.setTypeRef("foo.bar.Baz");
        elem.setAllowNull(true);
        elem.getNoChange().add(OperationEnumeration.read);
        elem.getNoChange().add(OperationEnumeration.update);
        dao.getElement().add(elem);
        b.setDataobjects(new DataObjects());
        b.getDataobjects().getDataobject().add(dao);
        services.add(b);
        b = null;

        return services;
    }
}
