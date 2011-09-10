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
package com.wavemaker.runtime.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.List;
import java.util.Set;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.test.annotation.DirtiesContext;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.javaservice.JavaServiceType;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;
import com.wavemaker.runtime.test.TestSpringContextTestCase;

/**
 * Test ServiceManager and TypeManager.
 *
 * @author Matt Small
 * @version $Rev:22673 $ - $Date:2008-05-30 14:45:46 -0700 (Fri, 30 May 2008) $
 *
 */
public class TestServiceManager extends TestSpringContextTestCase {

    public static final String SAMPLE_PRODUCT_SERVICE_ID = "sampleProductService";
    public static final String LAZY_INIT_SERVICE_ID = "lazyInitTestBean";
    public static final String LIFECYCLE_TEST_SERVICE_ID = "lifecycleTestBean";
    public static final String COMPLEX_BEAN_SERVICE_ID = "complexReturnBean";

    private ServiceManager serviceManager;
    private TypeManager typeManager;
    private Set<ServiceWire> originalServiceWiresSet;

    public void addServiceId(String id) {

        ServiceWire sw = new ReflectServiceWire();
        sw.setServiceId(id);
        sw.setServiceType(new JavaServiceType());
        this.serviceManager.getServiceWires().add(sw);
    }

    @Before
    public void setUp() {

        Object serviceMgrObj = getApplicationContext().getBean(
                ServiceConstants.SERVICE_MANAGER_NAME);
        assertTrue(ServiceConstants.SERVICE_MANAGER_NAME
                + " must be instance of ServiceManager; type: "
                + serviceMgrObj.getClass(),
                (serviceMgrObj instanceof ServiceManager));

        this.serviceManager = (ServiceManager) serviceMgrObj;

        Object typeMgrObj = getApplicationContext().getBean(
                ServiceConstants.TYPE_MANAGER_NAME);
        assertTrue(ServiceConstants.TYPE_MANAGER_NAME
                + " must be instance of TypeManager; type: "
                + typeMgrObj.getClass(),
                (typeMgrObj instanceof TypeManager));

        this.typeManager = (TypeManager) typeMgrObj;


        // strip out all services but the one we're looking for
        originalServiceWiresSet = this.serviceManager.getServiceWires();
        this.serviceManager.getServiceWires().clear();
        addServiceId(SAMPLE_PRODUCT_SERVICE_ID);
        addServiceId(LIFECYCLE_TEST_SERVICE_ID);
        addServiceId(COMPLEX_BEAN_SERVICE_ID);
        addServiceId("duplicateServiceClassBean1");
        addServiceId("duplicateServiceClassBean2");
        addServiceId("fauxDuplicateServiceClassBean1");
    }

    @After
    @Override
    public void tearDown() throws Exception {
        this.serviceManager.getServiceWires().clear();
        for (ServiceWire sw: originalServiceWiresSet) {
            this.serviceManager.addServiceWire(sw);
        }
    }

    // -------------------------------------------------------------------------
    // ServiceManager tests
    // -------------------------------------------------------------------------
    @Test public void testGetServiceWire() {
        
        ServiceWire sw = serviceManager.getServiceWire(SAMPLE_PRODUCT_SERVICE_ID);
        assertNotNull(sw);
        assertEquals(SAMPLE_PRODUCT_SERVICE_ID, sw.getServiceId());
        assertEquals(JavaServiceType.TYPE_NAME, sw.getServiceType().getTypeName());
    }
    
    @SuppressWarnings("deprecation")
    @Test public void testUnknownService() {
        
        try {
            serviceManager.getService("foo");
            fail("expected exception");
        } catch (WMRuntimeException ex) {
            assertEquals(Resource.UNKNOWN_SERVICE.getId(), ex.getMessageId());
        }
        
        try {
            serviceManager.getService(this.getClass());
            fail("expected exception");
        } catch (WMRuntimeException e) {
            assertEquals(e.getMessage(),
                    Resource.UNKNOWN_SERVICE_TYPE.getId(), e.getMessageId());
        }
        
        assertNull(serviceManager.getServiceWire("foo"));
    }
    
    @SuppressWarnings("deprecation")
    @Test public void testDuplicateClasses() {
        
        try {
            serviceManager.getService(DuplicateServiceClassBean.class);
            fail("expected exception");
        } catch (WMRuntimeException e) {
            assertEquals(e.getMessage(),
                    Resource.MULTIPLE_SERVICE_BEANS.getId(), e.getMessageId());
        }
    }
    
    @SuppressWarnings("deprecation")
    @Test public void testFauxDuplicateClasses() {
        Object o = serviceManager.getService(FauxDuplicateServiceClassBean.class);
        assertTrue(o instanceof FauxDuplicateServiceClassBean);
    }

    @SuppressWarnings("deprecation")
    @DirtiesContext
    @Test public void testLazyInit() {

        assertFalse(LazyInitTestBeanLoaded);

        ServiceWire sw = new ReflectServiceWire();
        sw.setServiceId(LAZY_INIT_SERVICE_ID);
        sw.setServiceType(new JavaServiceType());
        this.serviceManager.getServiceWires().add(sw);

        LazyInitTestBean.afterSpringInit = true;
        Object o = this.serviceManager.getService(LAZY_INIT_SERVICE_ID);
        assertNotNull(o);
        assertTrue(o instanceof LazyInitTestBean);
        
        assertTrue(LazyInitTestBeanLoaded);
    }


    // -------------------------------------------------------------------------
    // TypeManager tests
    // -------------------------------------------------------------------------
    @Test public void testGetTypes() {

        List<String> types = typeManager.getTypes(COMPLEX_BEAN_SERVICE_ID);
        assertEquals(1, types.size());
        assertEquals(
                "com.wavemaker.runtime.server.testspring.ComplexReturnBean",
                types.get(0));
    }

    @SuppressWarnings("deprecation")
    @Test public void testGetServiceForTypes() throws TypeNotFoundException {

        Object expectedService = serviceManager.getService(COMPLEX_BEAN_SERVICE_ID);

        List<String> types = typeManager.getTypes(COMPLEX_BEAN_SERVICE_ID);
        assertEquals(1, types.size());
        String type = types.get(0);

        Object actualService = typeManager.getServiceForType(type);
        assertEquals(expectedService, actualService);

        String actualServiceId = typeManager.getServiceIdForType(type);
        assertEquals(COMPLEX_BEAN_SERVICE_ID, actualServiceId);
    }



    // -------------------------------------------------------------------------
    // classes
    // -------------------------------------------------------------------------
    public static class DuplicateServiceClassBean {
        
    }
    
    public static class FauxDuplicateServiceClassBean {
        
    }
    
    public static class LazyInitTestBean {

        static {
            TestServiceManager.LazyInitTestBeanLoaded = true;
        }
        
        public LazyInitTestBean() {

            if (!afterSpringInit) {
                throw new WMRuntimeException("Tried to create LazyInitTestBean during spring initialization, instead of lazily later");
            }
        }

        public static boolean afterSpringInit = false;
    }
    
    /**
     * Used to tell if the LazyInitTestBean has been loaded yet.
     */
    public static boolean LazyInitTestBeanLoaded = false;

    public static class LifecycleTestBean {

    }
}