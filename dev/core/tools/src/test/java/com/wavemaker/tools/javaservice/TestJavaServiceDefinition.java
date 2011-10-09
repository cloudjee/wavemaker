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
package com.wavemaker.tools.javaservice;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.util.ResourceUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceOperation;

/**
 * @author Simon Toens
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class TestJavaServiceDefinition extends WMTestCase {

	private ServiceDefinition def = null;
	private final String CLASS_NAME = this.getClass().getPackage().getName()
			+ ".JavaServiceDefinitionClass";

	@Override
	public void setUp() throws Exception {

		super.setUp();

		SpringUtils.initSpringConfig();

		List<File> classRoots = new ArrayList<File>();
		List<File> libDirs = new ArrayList<File>();

		File classFile = (new ClassPathResource(CLASS_NAME.replace('.', '/')
				+ ".class")).getFile();
		File classRoot = classFile.getParentFile().getParentFile()
				.getParentFile().getParentFile().getParentFile();
		classRoots.add(classRoot);

		ClassPathResource runtimeServiceResource = new ClassPathResource(
				"com/wavemaker/runtime/service/LiveDataService.class");
		if (ResourceUtils.isJarURL(runtimeServiceResource.getURL())) {
			URL jarUrl = ResourceUtils.extractJarFileURL(runtimeServiceResource
					.getURL());
			libDirs.add(ResourceUtils.getFile(jarUrl).getParentFile());
		} else {
			File runtimeServiceClassFile = runtimeServiceResource.getFile();
			File runtimeClassRoot = runtimeServiceClassFile.getParentFile()
					.getParentFile().getParentFile().getParentFile()
					.getParentFile();

			classRoots.add(runtimeClassRoot);
		}

		List<String> exclude = new ArrayList<String>();
		exclude.add(this.getClass().getPackage().getName()
				+ ".JavaServiceDefinitionClass$FooClass");

		def = new JavaServiceDefinition(CLASS_NAME, "serviceId", classRoots,
				libDirs, exclude);
	}

	@Override
	public void tearDown() throws Exception {
		super.tearDown();

		this.def = null;
	}

	public void testOperations() {

		assertNotNull(getOperation("testOperations"));
	}

	public void testOperation1() {

		ServiceOperation oper = getOperation("op1");
		assertEquals(2, oper.getParameterTypes().size());
		assertEquals(String.class.getName(), oper.getParameterTypes().get(0)
				.getTypeDefinition().getTypeName());
		assertEquals(int.class.getName(), oper.getParameterTypes().get(1)
				.getTypeDefinition().getTypeName());
		assertNull(oper.getReturnType());
	}

	public void testOperation2() {

		ServiceOperation so = getOperation("op2");
		assertEquals(1, so.getParameterTypes().size());
		assertTrue(so.getParameterTypes().get(0).getDimensions() > 0);
		assertEquals(String.class.getName(), so.getParameterTypes().get(0)
				.getTypeDefinition().getTypeName());
	}

	public void testOperation3() {

		ServiceOperation so = getOperation("op3");
		assertEquals(0, so.getParameterTypes().size());
		assertEquals(JavaServiceDefinitionClass.class.getName(), so
				.getReturnType().getTypeDefinition().getTypeName());
		assertEquals(0, so.getReturnType().getDimensions());
	}

	public void testOperation4_ReturnList() {

		ServiceOperation so = getOperation("op4");
		assertTrue(so.getParameterTypes().isEmpty());
		assertEquals(JavaServiceDefinitionClass.class.getName(), so
				.getReturnType().getTypeDefinition().getTypeName());
		assertTrue(so.getReturnType().getDimensions() > 0);
	}

	public void testOperation5_ReturnArray() {

		ServiceOperation so = getOperation("op5");
		assertTrue(so.getParameterTypes().isEmpty());
		assertEquals(JavaServiceDefinitionClass.class.getName(), so
				.getReturnType().getTypeDefinition().getTypeName());
		assertTrue(so.getReturnType().getDimensions() > 0);
	}

	public void testGetTypes() {
		List<TypeDefinition> types = def.getLocalTypes();
		assertEquals("types: " + types, 1, types.size());
		for (TypeDefinition type : types) {
			if (type.getTypeName().equals(CLASS_NAME)) {
				// good
			} else {
				fail("unknown type: " + type.getTypeName());
			}
		}
	}

	public void testRuntimeService() {
		assertFalse(def.isLiveDataService());
	}

	private ServiceOperation getOperation(String name) {

		for (ServiceOperation so : def.getServiceOperations()) {
			if (name.equals(so.getName())) {
				return so;
			}
		}
		fail("no operation matching " + name);
		throw new WMRuntimeException("never reached");
	}
}
