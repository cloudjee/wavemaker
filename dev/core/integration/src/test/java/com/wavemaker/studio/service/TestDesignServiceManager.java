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
import static org.junit.Assert.assertNotSame;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.File;
import java.io.FileReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;

import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.ObjectTypeDefinition;
import com.wavemaker.json.type.OperationEnumeration;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.runtime.data.DataServiceType;
import com.wavemaker.runtime.javaservice.JavaServiceType;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.service.ServiceType;
import com.wavemaker.runtime.service.definition.AbstractDeprecatedServiceDefinition;
import com.wavemaker.runtime.service.definition.ReflectServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceOperation;
import com.wavemaker.runtime.ws.WebServiceType;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.ConfigurationCompiler;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.DesignServiceType;
import com.wavemaker.tools.service.InvalidServiceIdException;
import com.wavemaker.tools.service.definitions.DataObject;
import com.wavemaker.tools.service.definitions.Operation;
import com.wavemaker.tools.service.definitions.Operation.Parameter;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.Property;

/**
 * @author small
 * @author Jeremy Grelle
 * 
 */
public class TestDesignServiceManager extends StudioTestCase {

	ProjectManager pm;

	DesignServiceManager dsm;

	// information about the runtime service
	public static String[] RUNTIME_SERVICE_DOS = { "PagingOptions",
			"PropertyOptions" };

	@Before
	@Override
	public void setUp() throws Exception {

		super.setUp();

		pm = (ProjectManager) getApplicationContext().getBean("projectManager");
		dsm = (DesignServiceManager) getApplicationContext().getBean(
				"designServiceManager");
	}

	// this can be removed when AbstractDeprecatedServiceDefinition gets removed
	@SuppressWarnings("deprecation")
	@Test
	public void testToTypeDefinition() throws Exception {

		ServiceDefinition sd = new updateType_SD_sensible();
		List<TypeDefinition> localTypes = sd.getLocalTypes();
		List<ElementType> elementTypes = ((AbstractDeprecatedServiceDefinition) sd)
				.getTypes();

		assertEquals(elementTypes.size(), localTypes.size());

		for (ElementType et : elementTypes) {
			TypeDefinition td = null;
			for (TypeDefinition temp : localTypes) {
				if (et.getJavaType().equals(temp.getTypeName())) {
					td = temp;
					break;
				}
			}
			assertNotNull(td);

			assertEquals(et.getName(), td.getShortName());

			if (!et.getProperties().isEmpty()) {
				assertTrue(td instanceof ObjectTypeDefinition);
				ObjectTypeDefinition otd = (ObjectTypeDefinition) td;

				assertEquals(et.getProperties().size(), otd.getFields().size());
				for (ElementType propET : et.getProperties()) {
					FieldDefinition propFD = otd.getFields().get(
							propET.getName());
					assertNotNull(propFD);

					assertEquals(propET.getExclude().size(), propFD
							.getExclude().size());
					assertEquals(propET.getRequire().size(), propFD
							.getRequire().size());
					assertEquals(propET.getNoChange().size(), propFD
							.getNoChange().size());
					assertEquals(propET.isAllowNull(), propFD.isAllowNull());
				}
			}
		}
	}

	// this can be removed when AbstractDeprecatedServiceDefinition gets removed
	@SuppressWarnings("deprecation")
	@Test
	public void testMethodToFieldDefinition() throws Exception {

		ServiceDefinition sd = new updateType_SD_sensible();
		List<ElementType> elementType = ((AbstractDeprecatedServiceDefinition) sd)
				.getInputTypes("add");

		ServiceOperation so = null;
		for (ServiceOperation temp : sd.getServiceOperations()) {
			if ("add".equals(temp.getName())
					&& elementType.size() == temp.getParameterTypes().size()) {
				so = temp;
				break;
			}
		}
		assertNotNull(so);
		assertTrue(!so.getParameterTypes().isEmpty());

		for (int i = 0; i < elementType.size(); i++) {
			ElementType propET = elementType.get(i);
			FieldDefinition propFD = so.getParameterTypes().get(i);

			assertEquals(propET.getExclude().size(), propFD.getExclude().size());
			assertEquals(propET.getRequire().size(), propFD.getRequire().size());
			assertEquals(propET.getNoChange().size(), propFD.getNoChange()
					.size());
			assertEquals(propET.isAllowNull(), propFD.isAllowNull());
		}
	}

	@Test
	public void testProjectSwitch() throws Exception {

		String p1 = "testProjectSwitch_1";
		String p2 = "testProjectSwitch_2";

		makeProject(p1);
		makeProject(p2);

		pm.openProject(p1);

		Set<String> services1 = dsm.getServiceIds();

		pm.openProject(p2);

		Set<String> services2 = dsm.getServiceIds();
		assertNotSame(services1, services2);

		Set<String> services3 = dsm.getServiceIds();
		assertEquals(services2, services3);
	}

	@Test
	public void testGetServiceDirs() throws Exception {

		String p1 = "testGetServiceDirs";
		makeProject(p1);
		File projectDir = pm.getCurrentProject().getProjectRoot().getFile();

		File fooServiceDir = new File(new File(projectDir,
				DesignServiceManager.getServicesRelativeDir()), "foo");
		assertEquals(fooServiceDir, dsm.getServiceHome("foo"));

		assertEquals(
				new File(projectDir,
						DesignServiceManager.getRuntimeRelativeDir("foo")),
				dsm.getServiceRuntimeDirectory("foo"));
		assertEquals(
				new File(projectDir,
						DesignServiceManager.getDesigntimeRelativeDir("foo")),
				dsm.getServiceDesigntimeDirectory("foo"));
	}

	@Test
	public void testBasicService() throws Exception {

		String p = "testBasicService";

		// this will fail in eclipse
		makeProject(p, false);

		ServiceDefinition sd = new updateService_SD();
		ServiceDefinition sd2 = new updateService_SD2();

		File expected = dsm.getServiceDefXml(sd.getServiceId()).getFile();
		assertFalse(expected.exists());

		dsm.defineService(sd);
		assertTrue(expected.exists());
		dsm.defineService(sd2);

		Set<String> ids = dsm.getServiceIds();
		SortedSet<String> expectedIds = new TreeSet<String>();
		expectedIds.add(sd.getServiceId());
		expectedIds.add(sd2.getServiceId());
		expectedIds.add(DesignServiceManager.RUNTIME_SERVICE_ID);

		assertEquals(expectedIds, ids);

		FileUtils.forceMkdir(dsm.getProjectManager().getCurrentProject()
				.getWebInfLib().getFile());
		File serviceFile = ConfigurationCompiler.getSmdFile(
				dsm.getProjectManager().getCurrentProject(), sd.getServiceId())
				.getFile();
		FileUtils.forceMkdir(serviceFile.getParentFile());
		FileUtils.touch(serviceFile);
		assertTrue(serviceFile.exists());

		assertTrue(dsm.getServiceHome(sd.getServiceId()).exists());
		dsm.deleteService(sd.getServiceId());
		assertFalse(expected.exists());
		assertFalse(dsm.getServiceHome(sd.getServiceId()).exists());
		assertFalse(serviceFile.exists());

		ids = dsm.getServiceIds();
		expectedIds = new TreeSet<String>();
		expectedIds.add(sd2.getServiceId());
		expectedIds.add(DesignServiceManager.RUNTIME_SERVICE_ID);

		assertEquals(expectedIds, ids);

		// test a new dsm
		DesignServiceManager dsm2 = new DesignServiceManager();
		dsm2.setProjectManager(pm);
		Set<String> dsm2ServiceIds = dsm2.getServiceIds();
		assertEquals(expectedIds, dsm2ServiceIds);

		assertEquals(dsm.getServices().size(), dsm2.getServices().size());
		assertNotNull(dsm.getService(sd2.getServiceId()));
		assertEquals(dsm.getService(sd2.getServiceId()).getId(), dsm2
				.getService(sd2.getServiceId()).getId());
	}

	@Test
	public void testGetDNEService() throws Exception {

		String p = "testGetDNEService";
		makeProject(p);

		Service service = dsm.getService("DNEService");
		assertNull(service);
	}

	@Test
	public void testWriteBasicTypes() throws Exception {

		String p = "testWriteBasicTypes";
		makeProject(p);

		ServiceDefinition sd = new updateType_SD();

		dsm.defineService(sd);

		String servicesStr = FileUtils.readFileToString(dsm.getServiceDefXml(
				sd.getServiceId()).getFile());

		assertTrue(servicesStr.contains("package.name.Foo"));
	}

	@Test
	public void testIsIdValid() throws Exception {

		String p = "testIsIdValid";
		makeProject(p);

		try {
			dsm.validateServiceId("foo/bar");
			fail();
		} catch (InvalidServiceIdException ex) {
		}

		try {
			dsm.validateServiceId("foo\\bar");
			fail();
		} catch (InvalidServiceIdException ex) {

		}

		try {
			dsm.validateServiceId("id");
		} catch (InvalidServiceIdException ex) {
			fail();
		}

		ServiceDefinition sd = new updateService_SD();
		try {
			dsm.validateServiceId(sd.getServiceId());
		} catch (InvalidServiceIdException ex) {
			fail();
		}
		dsm.defineService(sd);

		try {
			dsm.validateServiceId(sd.getServiceId());
			fail();
		} catch (InvalidServiceIdException ex) {

		}
	}

	@Test
	public void testBasicOperation() throws Exception {

		String p = "testBasicOperation";
		makeProject(p);

		ServiceDefinition sd = new updateOperation_SD();
		dsm.defineService(sd);

		JAXBContext definitionsContext = JAXBContext
				.newInstance("com.wavemaker.tools.service.definitions");
		Unmarshaller unmarshaller = definitionsContext.createUnmarshaller();
		File serviceXml = dsm.getServiceDefXml(sd.getServiceId()).getFile();
		Service service = (Service) unmarshaller.unmarshal(serviceXml);
		basicOperation_check(service, sd);

		dsm.defineService(sd);

		service = (Service) unmarshaller.unmarshal(serviceXml);
		basicOperation_check(service, sd);
	}

	@SuppressWarnings("deprecation")
	@Test
	public void testRemoveOperation() throws Exception {

		String p = "testRemoveOperation";
		makeProject(p);

		ServiceDefinition sd = new updateOperation_SD();
		dsm.defineService(sd);

		JAXBContext definitionsContext = JAXBContext
				.newInstance("com.wavemaker.tools.service.definitions");
		Unmarshaller unmarshaller = definitionsContext.createUnmarshaller();
		File serviceXml = dsm.getServiceDefXml(sd.getServiceId()).getFile();
		Service service = (Service) unmarshaller.unmarshal(serviceXml);
		basicOperation_check(service, sd);

		dsm.defineService(sd);

		service = (Service) unmarshaller.unmarshal(serviceXml);
		basicOperation_check(service, sd);

		assertEquals(1, dsm.getOperationNames(sd.getServiceId()).size());

		// this will have to remove based on the new backing store when
		// AbstractDeprecatedServiceDefinition.getOperationNames() is removed.
		// For now, though, there is no different backing store, so I've left it
		// alone. -small
		((AbstractDeprecatedServiceDefinition) sd).getOperationNames()
				.remove(0);

		dsm.defineService(sd);
		assertEquals(0, dsm.getOperationNames(sd.getServiceId()).size());
	}

	@Test
	public void testBasicWriteConfig() throws Exception {

		String p = "testUpdateService";
		makeProject(p);

		ReflectServiceDefinition sd = new updateService_SD();
		ReflectServiceDefinition sd2 = new updateService_SD2();

		File expected = dsm.getServiceDefXml(sd.getServiceId()).getFile();
		assertFalse(expected.exists());

		dsm.defineService(sd);
		assertTrue(expected.exists());
		String serviceDefXmlStr = FileUtils.readFileToString(expected);
		assertTrue(serviceDefXmlStr.contains(DesignServiceManager
				.getServiceBeanName(sd.getServiceId())));
		dsm.defineService(sd2);

		File actualServices = ConfigurationCompiler.getRuntimeServicesXml(
				pm.getCurrentProject()).getFile();
		File actualManagers = ConfigurationCompiler.getRuntimeManagersXml(
				pm.getCurrentProject()).getFile();
		File actualTypes = ConfigurationCompiler.getTypesFile(
				pm.getCurrentProject()).getFile();
		assertTrue(actualServices.exists());
		assertTrue(actualManagers.exists());
		assertTrue(actualTypes.exists());

		String servicesStr = FileUtils.readFileToString(actualServices);
		String managersStr = FileUtils.readFileToString(actualManagers);

		assertTrue(-1 == servicesStr.indexOf(sd.getServiceClass() + "\""));
		assertTrue(-1 != servicesStr.indexOf(DesignServiceManager
				.getServiceBeanName(sd.getServiceId())));
		assertTrue(-1 != servicesStr.indexOf(sd.getServiceId()));
		assertTrue(-1 == servicesStr.indexOf(sd2.getServiceClass() + "\""));
		assertTrue(-1 == servicesStr.indexOf(sd2.getServiceId() + "\""));
		assertTrue(-1 != servicesStr.indexOf("classpath:"
				+ sd2.getRuntimeConfiguration() + "\""));

		assertTrue(-1 != managersStr.indexOf(sd.getServiceId()));
		assertTrue(-1 != managersStr.indexOf(sd2.getServiceId()));

		String actualTypesString = FileUtils.readFileToString(actualTypes);
		assertTrue(actualTypesString.startsWith("wm.types = {"));
		assertTrue(actualTypesString.endsWith("};"));
		assertTrue(actualTypesString.contains(String.class.getName()));

		File sdBeanDef = dsm.getServiceBeanXml(sd.getServiceId()).getFile();
		Reader sdBeanDefReader = new FileReader(sdBeanDef);
		assertTrue(sdBeanDef.exists());

		Beans beans;
		try {
			beans = SpringConfigSupport.readBeans(sdBeanDefReader);
		} finally {
			sdBeanDefReader.close();
		}

		DesignServiceType dst = dsm.getDesignServiceType(sd.getServiceType()
				.getTypeName());

		boolean gotServiceBean = false;
		boolean gotServiceWire = false;
		for (Bean bean : beans.getBeanList()) {
			if (sd.getServiceClass().equals(bean.getClazz())) {
				gotServiceBean = true;
				assertEquals(sd.getServiceId(), bean.getId());
			} else if (dst.getServiceWire().getName().equals(bean.getClazz())) {
				gotServiceWire = true;
				Property prop = bean.getProperty("serviceType");
				assertEquals(dst.getServiceType(), prop.getRef());
			}
		}
		assertTrue(gotServiceBean);
		assertTrue(gotServiceWire);

		File sd2BeanDef = dsm.getServiceBeanXml(sd2.getServiceId()).getFile();
		assertFalse(sd2BeanDef.exists());
	}

	protected void basicOperation_check(Service service, ServiceDefinition sd)
			throws Exception {

		assertEquals(sd.getServiceId(), service.getId());

		List<Operation> operations = service.getOperation();
		assertEquals(1, operations.size());

		List<String> opNames = dsm.getOperationNames(sd.getServiceId());
		assertEquals(1, opNames.size());

		boolean hadAdd = false;
		for (Operation op : operations) {
			assertTrue(opNames.contains(op.getName()));

			if (op.getName().equals("add")) {
				hadAdd = true;

				Operation.Return ret = op.getReturn();
				assertEquals("long", ret.getTypeRef());

				List<Operation.Parameter> params = op.getParameter();
				assertEquals(2, params.size());

				assertEquals("a", params.get(0).getName());
				assertEquals("b", params.get(1).getName());

				assertEquals("int", params.get(0).getTypeRef());
				assertEquals("int", params.get(1).getTypeRef());

				assertEquals(false, params.get(0).isIsList());
				assertEquals(false, params.get(1).isIsList());
			}
		}
		assertTrue(hadAdd);
	}

	@Test
	public void testGetDataObjects() throws Exception {

		String p = "testGetDataObjects";
		makeProject(p);

		ServiceDefinition sd = new updateType_SD();
		ServiceDefinition sd2 = new updateType_SD2();

		dsm.defineService(sd);
		dsm.defineService(sd2);

		String servicesStr = FileUtils.readFileToString(dsm.getServiceDefXml(
				sd.getServiceId()).getFile());

		assertTrue(servicesStr.contains("package.name.Foo"));

		List<DataObject> dataobjects = dsm.getLocalDataObjects();
		assertEquals(3 + RUNTIME_SERVICE_DOS.length, dataobjects.size());
		assertEquals(3 + dsm.getPrimitiveDataObjects().size()
				+ RUNTIME_SERVICE_DOS.length, dsm.getDataObjects().size());

		boolean gotSDOne = false;
		boolean gotSD2One = false;
		boolean gotSD2Two = false;
		boolean gotRuntimeOne = false;
		boolean gotRuntimeTwo = false;
		for (DataObject data : dataobjects) {
			if (sd.getLocalTypes().get(0).getTypeName()
					.equals(data.getJavaType())) {
				if (gotSDOne) {
					fail();
				}
				gotSDOne = true;
				continue;
			} else if (sd2.getLocalTypes().get(0).getTypeName()
					.equals(data.getJavaType())) {
				if (gotSD2One) {
					fail();
				}
				gotSD2One = true;

				assertTrue(data.isSupportsQuickData());

				continue;
			} else if (sd2.getLocalTypes().get(1).getTypeName()
					.equals(data.getJavaType())) {
				if (gotSD2Two) {
					fail();
				}
				gotSD2Two = true;

				assertFalse(data.isSupportsQuickData());

				continue;
			} else if (RUNTIME_SERVICE_DOS[0].equals(data.getName())) {
				if (gotRuntimeOne) {
					fail();
				}
				gotRuntimeOne = true;
				continue;
			} else if (RUNTIME_SERVICE_DOS[1].equals(data.getName())) {
				if (gotRuntimeTwo) {
					fail();
				}
				gotRuntimeTwo = true;
				continue;
			} else if (RUNTIME_SERVICE_DOS[2].equals(data.getName())) {
				// fine, let's skip it
			} else {
				fail("unrecognized data: " + data.getName());
			}
		}

		assertNull(dsm.findDataObjectFromJavaType("foo.bar.Baz"));
		assertNotNull(dsm.findDataObjectFromJavaType(sd.getLocalTypes().get(0)
				.getTypeName()));

		// test to make sure the output is OK
		File actualTypes = ConfigurationCompiler.getTypesFile(
				pm.getCurrentProject()).getFile();
		assertTrue(actualTypes.exists());

		String actualTypesContents = FileUtils.readFileToString(actualTypes);
		actualTypesContents = actualTypesContents.replace("wm.types = ", "");
		actualTypesContents = actualTypesContents.substring(0,
				actualTypesContents.length() - 1);

		JSONObject jo = (JSONObject) JSONUnmarshaller
				.unmarshal(actualTypesContents);
		JSONObject types = (JSONObject) jo.get("types");
		assertTrue(types.containsKey("package.name.Baz"));
		assertTrue(types.containsKey("package.name.Bar"));
	}

	@Test
	public void testTypeConflict() throws Exception {

		String p = "testTypeConflict";
		makeProject(p);

		ServiceDefinition sd = new updateType_SD2();
		ServiceDefinition sd2 = new updateType_SD3();

		dsm.defineService(sd);

		boolean gotException = false;
		try {
			dsm.defineService(sd2);
		} catch (WMRuntimeException e) {
			assertTrue(e.getMessage().startsWith("Conflict"));
			gotException = true;
		}
		assertTrue(gotException);
	}

	@Test
	public void testTypeSequence() throws Exception {

		makeProject("testTypeSequence");

		ServiceDefinition sd = new updateType_SD_sensible();

		dsm.defineService(sd);

		Service service = dsm.getService(sd.getServiceId());
		Operation op = service.getOperation().get(0);
		List<Parameter> params = op.getParameter();
		assertEquals("int", params.get(0).getTypeRef());
		assertEquals(updateType_SD_sensible.type1.getJavaType(), params.get(1)
				.getTypeRef());
		assertEquals(updateType_SD_sensible.type2.getJavaType(), params.get(2)
				.getTypeRef());
		assertFalse(params.get(1).isIsList());
		assertTrue(params.get(2).isIsList());

		Parameter p = params.get(1);
		DataObject dataobject = dsm.findDataObjectFromJavaType(p.getTypeRef());
		assertEquals(p.getTypeRef(), dataobject.getJavaType());

		assertFalse(updateType_SD_sensible.type1.isAllowNull());
		assertTrue(updateType_SD_sensible.type2.isAllowNull());
		assertFalse(updateType_SD_sensible.type3.isAllowNull());
		assertFalse(updateType_SD_sensible.type3.getProperties().get(0)
				.isAllowNull());
		assertTrue(updateType_SD_sensible.type3.getProperties().get(1)
				.isAllowNull());

		assertEquals(3, service.getDataobjects().getDataobject().size());
		for (DataObject dao : service.getDataobjects().getDataobject()) {
			if (dao.getJavaType().equals(
					updateType_SD_sensible.type1.getJavaType())) {
				assertEquals(dao.getName(),
						updateType_SD_sensible.type1.getName());
			} else if (dao.getJavaType().equals(
					updateType_SD_sensible.type2.getJavaType())) {
				assertEquals(dao.getName(),
						updateType_SD_sensible.type2.getName());
			} else if (dao.getJavaType().equals(
					updateType_SD_sensible.type3.getJavaType())) {
				assertEquals(dao.getName(),
						updateType_SD_sensible.type3.getName());
				assertEquals(2, dao.getElement().size());

				for (DataObject.Element elem : dao.getElement()) {
					if (elem.getName().equals(
							updateType_SD_sensible.type1.getName())) {
						assertEquals(updateType_SD_sensible.type1.isList(),
								elem.isIsList());
						assertEquals(
								updateType_SD_sensible.type1.getJavaType(),
								elem.getTypeRef());
						assertEquals(
								updateType_SD_sensible.type1.isAllowNull(),
								elem.isAllowNull());
						assertEquals(0, elem.getNoChange().size());
						assertEquals(0, elem.getExclude().size());
						assertEquals(0, elem.getRequire().size());
					} else if (elem.getName().equals(
							updateType_SD_sensible.type2.getName())) {
						assertEquals(updateType_SD_sensible.type2.isList(),
								elem.isIsList());
						assertEquals(
								updateType_SD_sensible.type2.getJavaType(),
								elem.getTypeRef());

						assertEquals(
								updateType_SD_sensible.type2.isAllowNull(),
								elem.isAllowNull());

						assertEquals(1, elem.getExclude().size());
						assertEquals(OperationEnumeration.read, elem
								.getExclude().get(0));
						assertEquals(1, elem.getRequire().size());
						assertEquals(OperationEnumeration.insert, elem
								.getRequire().get(0));
						assertEquals(0, elem.getNoChange().size());
					} else {
						fail("unknown element: " + elem.getName());
					}
				}
			} else {
				fail("unknown type: " + dao.getName());
			}
		}
	}

	@Test
	public void testNullReturnType() throws Exception {

		makeProject("testNullReturnType");

		ServiceDefinition sd = new nullParamsAndReturn_SD();

		dsm.defineService(sd);

		Service service = dsm.getService(sd.getServiceId());
		assertEquals(1, service.getOperation().size());
		Operation op = service.getOperation().get(0);
		assertEquals(null, op.getReturn());
		assertEquals(0, op.getParameter().size());
	}

	@Test
	public void testGetServiceByType() throws Exception {

		makeProject("testGetServiceByType");

		ServiceDefinition sd = new nullParamsAndReturn_SD();
		ServiceDefinition sd2 = new updateService_SD();
		ServiceDefinition sd3 = new updateService_SD_WebService();

		dsm.defineService(sd);
		assertEquals(2, dsm.getServices().size());
		assertEquals(2, dsm.getServicesByType(JavaServiceType.TYPE_NAME).size());
		dsm.defineService(sd);
		assertEquals(2, dsm.getServices().size());
		assertEquals(2, dsm.getServicesByType(JavaServiceType.TYPE_NAME).size());

		dsm.defineService(sd2);
		assertEquals(3, dsm.getServices().size());
		assertEquals(2, dsm.getServicesByType(JavaServiceType.TYPE_NAME).size());
		assertEquals(1, dsm.getServicesByType(WebServiceType.TYPE_NAME).size());

		dsm.defineService(sd3);
		assertEquals(4, dsm.getServices().size());
		assertEquals(2, dsm.getServicesByType(JavaServiceType.TYPE_NAME).size());
		assertEquals(2, dsm.getServicesByType(WebServiceType.TYPE_NAME).size());
	}

	@Test
	public void testProjectEventNotifiers() throws Exception {

		String p1 = "testEvents_1";
		String p2 = "testEvents_2";
		ServiceDefinition sd = new updateService_SD();

		makeProject(p1);
		dsm.defineService(sd);
		Project p1Project = pm.getCurrentProject();
		assertTrue(dsm.getAllServiceDefinitions().containsKey(p1Project));

		makeProject(p2);
		dsm.defineService(sd);
		Project p2Project = pm.getCurrentProject();
		assertFalse(dsm.getAllServiceDefinitions().containsKey(p1Project));
		assertTrue(dsm.getAllServiceDefinitions().containsKey(p2Project));

		pm.closeProject();
		assertFalse(dsm.getAllServiceDefinitions().containsKey(p2Project));
	}

	@Test
	public void testBeanClassToId() {

		assertEquals("beanA",
				DesignServiceManager.beanClassToId("foo.bar.BeanA"));
		assertEquals("beanA",
				DesignServiceManager.beanClassToId("foo.bar.beanA"));
		assertEquals("beanB", DesignServiceManager.beanClassToId("BeanB"));
		assertEquals("beanB", DesignServiceManager.beanClassToId("beanB"));
		assertEquals("b", DesignServiceManager.beanClassToId("foob.ar.B"));
		assertEquals("b", DesignServiceManager.beanClassToId("foo.bar.b"));
		assertEquals("b", DesignServiceManager.beanClassToId("B"));
		assertEquals("b", DesignServiceManager.beanClassToId("b"));
	}

	@Test
	public void testUpdateService() throws Exception {

		String p1 = "testUpdateService";
		ServiceDefinition sd = new updateService_SD();

		makeProject(p1);
		dsm.defineService(sd);

		Service service1 = dsm.getService(sd.getServiceId());
		assertEquals(0, service1.getOperation().size());

		ServiceDefinition sd2 = new updateService_ExtraOp_SD();
		dsm.defineService(sd2);

		assertEquals(sd.getServiceId(), sd2.getServiceId());
		Service service2 = dsm.getService(sd2.getServiceId());
		assertEquals(2, service2.getOperation().size());
	}

	// MAV-646
	@Test
	public void testDeleteService() throws Exception {

		String p = "testDeleteService";

		// this will fail in eclipse
		makeProject(p, false);

		ServiceDefinition sd = new updateService_SD();
		ServiceDefinition sd2 = new updateService_SD2();

		dsm.defineService(sd);
		dsm.defineService(sd2);

		File servicesXml = new File(dsm.getProjectManager().getCurrentProject()
				.getWebInf().getFile(), ConfigurationCompiler.RUNTIME_SERVICES);
		File managersXml = new File(dsm.getProjectManager().getCurrentProject()
				.getWebInf().getFile(), ConfigurationCompiler.RUNTIME_MANAGERS);
		assertTrue(servicesXml.exists());
		assertTrue(managersXml.exists());
		assertTrue(dsm.getServiceDefXml(sd2.getServiceId()).exists());
		assertTrue(FileUtils.readFileToString(managersXml).contains(
				sd2.getServiceId()));

		dsm.deleteService(sd2.getServiceId());
		assertFalse(dsm.getServiceDefXml(sd2.getServiceId()).exists());
		assertTrue(FileUtils.readFileToString(managersXml).contains(
				sd.getServiceId()));
		assertFalse(FileUtils.readFileToString(managersXml).contains(
				sd2.getServiceId()));
	}

	// MAV-632
	@Test
	public void testServiceSort() throws Exception {

		String p = "testServiceSort";
		makeProject(p);

		ServiceDefinition sd = new updateService_SD();
		ServiceDefinition sd2 = new updateService_SD2();

		dsm.defineService(sd);
		dsm.defineService(sd2);

		orderTest_testServiceSort(dsm.getServices(), sd, sd2);

		p = "testServiceSort2";
		makeProject(p);

		dsm.defineService(sd2);
		dsm.defineService(sd);

		orderTest_testServiceSort(dsm.getServices(), sd, sd2);
	}

	private void orderTest_testServiceSort(Set<Service> services,
			ServiceDefinition sd, ServiceDefinition sd2) {

		assertEquals(3, services.size());

		int i = 0;
		for (Service service : services) {
			if (0 == i) {
				assertEquals("runtimeService", service.getId());
			} else if (1 == i) {
				assertEquals(sd.getServiceId(), service.getId());
			} else if (2 == i) {
				assertEquals(sd2.getServiceId(), service.getId());
			}
			i++;
		}
	}

	// MAV-898
	@Test
	public void testRetainSpringFileAttr() throws Exception {

		String expectedSpringFile = "someSpringFile.xml";
		String p = "testRetainSpringFileAttr";
		makeProject(p);

		ServiceDefinition sd = new updateService_SD();

		File destSDFile = dsm.getServiceDefXml(sd.getServiceId()).getFile();
		FileUtils.copyFile((new ClassPathResource(
				"com/wavemaker/tools/service/retainspringfile_servicedef.xml"))
				.getFile(), destSDFile);

		Service s = dsm.getService(sd.getServiceId());
		assertEquals(expectedSpringFile, s.getSpringFile());

		dsm.defineService(sd);
		s = dsm.getService(sd.getServiceId());
		assertEquals(expectedSpringFile, s.getSpringFile());
	}

	@Test
	public void testNoIdInServiceDef() throws Exception {

		String p = "testNoIdInServiceDef";
		String fooService = "fooService";
		makeProject(p);

		ServiceDefinition sd = new updateService_SD();
		dsm.defineService(sd);

		File f = new File(pm.getCurrentProject().getProjectRoot().getFile(),
				DesignServiceManager.getDesigntimeRelativeDir(fooService));
		FileUtils.forceMkdir(f);
		File destSD = new File(f, DesignServiceManager.getServiceXmlRelative());
		FileUtils.copyFile((new ClassPathResource(
				"com/wavemaker/tools/service/bad-serviceid.xml")).getFile(),
				destSD);

		try {
			dsm.getService(fooService);
			fail("no exception");
		} catch (WMRuntimeException e) {
			assertTrue(e.getMessage().startsWith("Service definition for "));
			assertTrue(e.getMessage().contains("\"" + fooService + "\""));
		}

		try {
			dsm.getServices();
			fail("no exception");
		} catch (WMRuntimeException e) {
			assertTrue(e.getMessage().startsWith("Service definition for "));
			assertTrue(e.getMessage().contains("\"" + fooService + "\""));
		}
	}

	public void getServiceBeanName() {

		assertEquals("foo-servicebean.xml",
				DesignServiceManager.getServiceBeanName("foo"));
	}

	@Test
	public void testGetDesignServiceTypes() throws Exception {

		String p = "testGetDesignServiceTypes";
		makeProject(p);

		boolean gotJava = false;
		boolean gotData = false;
		boolean gotWeb = false;

		for (DesignServiceType dst : dsm.getDesignServiceTypes()) {
			if (JavaServiceType.TYPE_NAME.equals(dst.getServiceType())) {
				assertFalse(gotJava);
				gotJava = true;
			} else if (WebServiceType.TYPE_NAME.equals(dst.getServiceType())) {
				assertFalse(gotWeb);
				gotWeb = true;
			} else if (DataServiceType.TYPE_NAME.equals(dst.getServiceType())) {
				assertFalse(gotData);
				gotData = true;
			}
		}

		assertTrue(gotJava);
		assertTrue(gotData);
		assertTrue(gotWeb);
	}

	@Test
	public void testGetServiceType() throws Exception {

		String p = "testGetServiceType";
		makeProject(p);

		DesignServiceType st = dsm
				.getDesignServiceType(JavaServiceType.TYPE_NAME);
		assertNotNull(st);
		assertEquals(JavaServiceType.TYPE_NAME, st.getServiceType());

		st = dsm.getDesignServiceType(WebServiceType.TYPE_NAME);
		assertNotNull(st);
		assertEquals(WebServiceType.TYPE_NAME, st.getServiceType());
	}

	// -----------------------------------------------------------------------
	// class
	// ----------------------------------------------------------------------
	public static class updateService_SD extends
			AbstractDeprecatedServiceDefinition implements
			ReflectServiceDefinition {

		public void addOperation(String operationName,
				List<ElementType> inputTypes, ElementType outputType) {
		}

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

	public static class updateService_ExtraOp_SD extends updateService_SD {

		@Override
		public List<String> getOperationNames() {

			List<String> ret = new ArrayList<String>();
			ret.add("op1");
			ret.add("op2");
			return ret;
		}
	}

	public static class updateService_SD_WebService extends updateService_SD {

		@Override
		public String getServiceId() {
			return "updateService_SD_WebService";
		}

		@Override
		public ServiceType getServiceType() {
			return new WebServiceType();
		}
	}

	public static class updateService_SD2 extends
			AbstractDeprecatedServiceDefinition implements
			ReflectServiceDefinition {

		public void addOperation(String operationName,
				List<ElementType> inputTypes, ElementType outputType) {
		}

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

	public static class updateOperation_SD extends
			AbstractDeprecatedServiceDefinition implements
			ReflectServiceDefinition {

		private final List<String> operationNames;

		public updateOperation_SD() {
			operationNames = new ArrayList<String>(1);
			operationNames.add("add");
		}

		public void addOperation(String operationName,
				List<ElementType> inputTypes, ElementType outputType) {
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

	public static class nullParamsAndReturn_SD extends updateOperation_SD {

		@Override
		public String getServiceId() {
			return "nullReturnType_SD";
		}

		@Override
		public ElementType getOutputType(String operationName) {

			ElementType ret = null;

			if (operationName.equals("add")) {
				ret = null;
			}

			return ret;
		}

		@Override
		public List<ElementType> getInputTypes(String operationName) {

			List<ElementType> ret = new ArrayList<ElementType>();

			if (operationName.equals("add")) {
				ret = null;
			}

			return ret;
		}
	}

	public static class updateType_SD extends updateOperation_SD {

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

	public static class updateType_SD2 extends updateService_SD {

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

	public static class updateType_SD3 extends updateType_SD2 {

		@Override
		public String getServiceId() {
			return "updateType_SD3";
		}
	}

	public static class updateType_SD_sensible extends updateType_SD2 {

		public static final ElementType type1;

		public static final ElementType type2;

		public static final ElementType type3;

		static {
			type1 = new ElementType("b", "com.wavemaker.test.Test1", false);
			type2 = new ElementType("c", "com.wavemaker.test.Test2", true);
			type2.setAllowNull(true);
			type2.getExclude().add(OperationEnumeration.read);
			type2.getRequire().add(OperationEnumeration.insert);

			type3 = new ElementType("d", "com.wavemaker.test.Test3", false);
			type3.getProperties().add(type1);
			type3.getProperties().add(type2);
		}

		@Override
		public String getServiceId() {
			return "updateType_SD_sensible";
		}

		@Override
		public List<ElementType> getInputTypes(String operationName) {

			List<ElementType> ret = new ArrayList<ElementType>();

			if (operationName.equals("add")) {
				ElementType a = new ElementType("a", int.class, false);

				ElementType b = type1;
				ElementType c = type2;

				ret.add(a);
				ret.add(b);
				ret.add(c);
			}

			return ret;
		}

		@Override
		public List<String> getOperationNames() {
			List<String> rtn = new ArrayList<String>(1);
			rtn.add("add");
			return rtn;
		}

		@Override
		public ElementType getOutputType(String operationName) {

			ElementType ret = null;

			if (operationName.equals("add")) {
				ret = new ElementType("result", type2.getJavaType(), true);
			}

			return ret;
		}

		@Override
		public List<ElementType> getTypes() {

			List<ElementType> ret = new ArrayList<ElementType>();

			ret.add(type1);
			ret.add(type2);
			ret.add(type3);

			return ret;

		}
	}

	public static class testEvents_SD extends updateType_SD_sensible {

		public testEvents_SD() {
			eventNotifiers = new ArrayList<String>();
			eventNotifiers.add("foo.bar.HibernateEventNotifier");
			eventNotifiers.add("foo.bar.OtherEventNotifier");
		}

		private final List<String> eventNotifiers;

		@Override
		public List<String> getEventNotifiers() {
			return eventNotifiers;
		}
	}
}
