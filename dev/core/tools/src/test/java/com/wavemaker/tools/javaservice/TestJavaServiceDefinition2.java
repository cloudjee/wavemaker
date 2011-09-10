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
import java.lang.reflect.Method;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.ResourceUtils;

import com.wavemaker.common.util.ClassUtils;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.ObjectTypeDefinition;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.runtime.service.LiveDataService;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceOperation;
import com.wavemaker.tools.javaservice.testtypes.JavaServiceDefinitionClass2;
import com.wavemaker.tools.javaservice.testtypes.JavaServiceDefinitionClass_Overloading;

/**
 * More JavaServiceDefinition tests.
 * 
 * @author small
 * @version $Rev$ - $Date:2008-05-30 14:45:46 -0700 (Fri, 30 May 2008) $
 *
 */
public class TestJavaServiceDefinition2 extends WMTestCase {
    
    public void testSupportsRuntime() throws Exception {
        
        ServiceDefinition def = getServiceDef(
                this.getClass().getPackage().getName()+".testtypes."+
                "JavaServiceDefinitionClass2", null);
        assertTrue(def.isLiveDataService());
        
        for (TypeDefinition et: def.getLocalTypes()) {
            if (JavaService_BeanClass.class.getName().equals(et.getTypeName())) {
                assertTrue(et.isLiveService());
            }
        }
    }
    
    public void testOverloading() throws Exception {
        
        ServiceDefinition def = getServiceDef(
                this.getClass().getPackage().getName()+".testtypes."+
                "JavaServiceDefinitionClass_Overloading", null);
        assertNotNull(getOperation(def, "getInt"));
        assertEquals(0, getOperation(def, "getInt").getParameterTypes().size());
    }
    
    public void testParamNameAnnotations() throws Exception {
        
        ServiceDefinition def = getServiceDef(
                this.getClass().getPackage().getName()+".testtypes."+
                "JavaServiceDefinitionClass_ParamName", null);
        assertEquals(1, def.getServiceOperations().size());
        assertNotNull(getOperation(def, "doSomething"));
        List<FieldDefinition> params = getOperation(def, "doSomething").getParameterTypes();
        
        assertEquals(2, params.size());
        assertEquals("foo", params.get(0).getName());
        assertEquals("bar", params.get(1).getName());
    }
    
    public void testGetNonOverloadedMethods() throws Exception {
        
        List<Method> methods = ClassUtils.getPublicMethods(JavaServiceDefinitionClass2.class);
        Collection<Method> retMethods = JavaServiceDefinition.filterOverloadedMethods(methods);
        assertEquals(5, retMethods.size());
        
        methods = ClassUtils.getPublicMethods(JavaServiceDefinitionClass_Overloading.class);
        retMethods = JavaServiceDefinition.filterOverloadedMethods(methods);
        assertEquals(1, retMethods.size());
        for (Method m: retMethods) {
            assertEquals(0, m.getParameterTypes().length);
        }
    }
    
    public void testJarWithDebug() throws Exception {
        
        String jarFileName = "Foo-debug.jar";
        ServiceDefinition def = getServiceDefFromJar(jarFileName);
        assertEquals(1, def.getServiceOperations().size());
        assertNotNull(getOperation(def, "someOperation"));
        
        List<FieldDefinition> inputTypes = getOperation(def, "someOperation").getParameterTypes();
        assertEquals(2, inputTypes.size());
        assertEquals("strParam", inputTypes.get(0).getName());
        assertEquals("intParam", inputTypes.get(1).getName());
    }

    public void testJarWithoutDebug() throws Exception {
        
        String jarFileName = "Foo-nodebug.jar";
        ServiceDefinition def = getServiceDefFromJar(jarFileName);
        assertEquals(1, def.getServiceOperations().size());
        assertNotNull(getOperation(def, "someOperation"));

        List<FieldDefinition> inputTypes = getOperation(def, "someOperation").getParameterTypes();
        assertEquals(2, inputTypes.size());
        assertEquals("arg-1", inputTypes.get(0).getName());
        assertEquals("arg-2", inputTypes.get(1).getName());
    }

    public void testGetWithNestedTypeWithArray() throws Exception {
        
        ServiceDefinition def = getServiceDef(
                this.getClass().getPackage().getName()+".testtypes."+
                "JavaServiceDefinitionClass_NestedType", null);
        List<TypeDefinition> types = def.getLocalTypes();
        assertEquals(1, types.size());
        TypeDefinition queryInfoType = types.get(0);
        assertEquals(JavaService_BeanClass.class.getName(), queryInfoType.getTypeName());
        assertFalse(queryInfoType.isLiveService());
        
        assertTrue(queryInfoType instanceof ObjectTypeDefinition);
        ObjectTypeDefinition otd = (ObjectTypeDefinition) queryInfoType;
        
        boolean gotInputs = false;
        for (Map.Entry<String, FieldDefinition> nestedType: otd.getFields().entrySet()) {
            if (nestedType.getKey().equals("inputs")) {
                gotInputs = true;
                assertTrue(nestedType.getValue().getDimensions() > 0);
            }
        }
        assertTrue(gotInputs);
    }
    
    public void testHiddenMethods() throws Exception {
        
        ServiceDefinition def = getServiceDef(
                this.getClass().getPackage().getName()+".testtypes."+
                "JavaServiceDefinitionClass_HiddenMethods", null);
        assertEquals(0, def.getServiceOperations().size());
    }
    
    public void testDefaultHiddenMethods() throws Exception {
        
        ServiceDefinition def = getServiceDef(
                this.getClass().getPackage().getName()+".testtypes."+
                "JavaServiceDefinitionClass_DefaultHiddenMethods", null);
        assertEquals(1, def.getServiceOperations().size());
        assertNotNull(getOperation(def, "exposed"));
    }
    
    // WM-12
    public void testOutOfOrder_WM_12() throws Exception {
        
        ServiceDefinition def = getServiceDef(
                this.getClass().getPackage().getName()+".testtypes."+
                "OutOfOrder_WM_12", null);
        
        assertEquals(1, def.getServiceOperations().size());
        ServiceOperation so = def.getServiceOperations().get(0);
        assertEquals(3, so.getParameterTypes().size());
        
        assertEquals("long", so.getParameterTypes().get(0).getTypeDefinition().getTypeName());
        assertEquals("one", so.getParameterTypes().get(0).getName());
        
        assertEquals("int", so.getParameterTypes().get(1).getTypeDefinition().getTypeName());
        assertEquals("two", so.getParameterTypes().get(1).getName());
        
        assertEquals("java.lang.String", so.getParameterTypes().get(2).getTypeDefinition().getTypeName());
        assertEquals("something", so.getParameterTypes().get(2).getName());
    }
    
    
    
    private ServiceOperation getOperation(ServiceDefinition def, String op) {
        for (ServiceOperation so: def.getServiceOperations()) {
            if (op.equals(so.getName())) {
                return so;
            }
        }
        return null;
    }
    
    private ServiceDefinition getServiceDefFromJar(String jarFileName)
            throws Exception {
        
    	List<File> classRoots = new ArrayList<File>();
    	List<File> jarDirs = new ArrayList<File>();
    	
        File jarDir = IOUtils.createTempDirectory();
        File srcJarFile = (new ClassPathResource(this.getClass().getPackage()
                .getName().replace(".", "/")
                + "/" + jarFileName)).getFile();
        File jarFile = new File(jarDir, jarFileName);
        FileUtils.copyFile(srcJarFile, jarFile);
        jarDirs.add(jarDir);

        ClassPathResource runtimeServiceResource = new ClassPathResource("com/wavemaker/runtime/service/LiveDataService.class");
        if (ResourceUtils.isJarURL(runtimeServiceResource.getURL())) {
        	URL jarUrl = ResourceUtils.extractJarFileURL(runtimeServiceResource.getURL());
        	jarDirs.add(ResourceUtils.getFile(jarUrl).getParentFile());
        } else {
	        File runtimeServiceClassFile = runtimeServiceResource.getFile();
	        File runtimeClassRoot = runtimeServiceClassFile.getParentFile()
	                .getParentFile().getParentFile().getParentFile()
	                .getParentFile();
	        classRoots.add(runtimeClassRoot);
        }
        
        ServiceDefinition ret = new JavaServiceDefinition("Foo", "serviceId",
                classRoots, jarDirs, new ArrayList<String>());
        
        jarFile.delete();
        jarDir.delete();
        
        return ret;
    }
    
    private ServiceDefinition getServiceDef(String className,
            List<File> serviceLibDirs) throws Exception {

    	List<File> classRoots = new ArrayList<File>();
    	serviceLibDirs = serviceLibDirs == null ? new ArrayList<File>() : serviceLibDirs;
    	
        File classFile = (new ClassPathResource(className.replace('.', '/')
                + ".class")).getFile();
        File classRoot = classFile.getParentFile().getParentFile()
                .getParentFile().getParentFile().getParentFile();
        classRoots.add(classRoot);
        
        File queryInfoClassFile = (new ClassPathResource(
                JavaService_BeanClass.class.getName().replace('.', '/')+".class")).getFile();
        File queryInfoClassRoot = queryInfoClassFile.getParentFile()
                .getParentFile().getParentFile().getParentFile()
                .getParentFile();
        classRoots.add(queryInfoClassRoot);

        ClassPathResource runtimeServiceResource = new ClassPathResource(
                LiveDataService.class.getName().replace(".", "/")+".class");
        if (ResourceUtils.isJarURL(runtimeServiceResource.getURL())) {
        	URL jarUrl = ResourceUtils.extractJarFileURL(runtimeServiceResource.getURL());
        	serviceLibDirs.add(ResourceUtils.getFile(jarUrl).getParentFile());
        } else {
	        File runtimeServiceClassFile = runtimeServiceResource.getFile();
	        File runtimeClassRoot = runtimeServiceClassFile.getParentFile()
	                .getParentFile().getParentFile().getParentFile()
	                .getParentFile();
	        classRoots.add(runtimeClassRoot);        
        }
        
        ClassPathResource typeDefinitionResource = new ClassPathResource(
                TypeDefinition.class.getName().replace(".", "/")+".class");
        if (ResourceUtils.isJarURL(typeDefinitionResource.getURL())) {
        	URL jarUrl = ResourceUtils.extractJarFileURL(typeDefinitionResource.getURL());
        	serviceLibDirs.add(ResourceUtils.getFile(jarUrl).getParentFile());
        } else {
			File typeDefinitionClassFile = typeDefinitionResource.getFile();
	        File typeDefinitionClassRoot = typeDefinitionClassFile.getParentFile().
	                getParentFile().getParentFile().getParentFile().getParentFile();
	        classRoots.add(typeDefinitionClassRoot);
        }

        return new JavaServiceDefinition(className, "serviceId", classRoots,
                serviceLibDirs, new ArrayList<String>());
    }
}
