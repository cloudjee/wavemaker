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
package com.wavemaker.tools.service;

import java.util.ArrayList;
import java.util.List;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.infra.TestSpringContextTestCase;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.TestJSONSerialization.CycleA;
import com.wavemaker.runtime.service.PropertyOptions;
import com.wavemaker.runtime.service.RuntimeService;
import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.TypedServiceReturn;
import com.wavemaker.runtime.service.events.EventManager;
import com.wavemaker.runtime.service.events.ServiceEventListener;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;
import com.wavemaker.tools.spring.ComplexRuntimeServiceBean;
import com.wavemaker.tools.spring.MultipleReturnsRuntimeServiceBean.RawObjectNoType;
import com.wavemaker.tools.spring.MultipleReturnsRuntimeServiceBean.RawObjectType;
import com.wavemaker.tools.spring.MultipleReturnsRuntimeServiceBean.WrappedObjectNoType;
import com.wavemaker.tools.spring.MultipleReturnsRuntimeServiceBean.WrappedObjectType;

/**
 * @author small
 * @version $Rev:22673 $ - $Date:2008-05-30 14:45:46 -0700 (Fri, 30 May 2008) $
 *
 */
public class TestRuntimeService extends TestSpringContextTestCase {

    public void testGetPropertyDelegate() throws Exception {
        
        ComplexRuntimeServiceBean crb = new ComplexRuntimeServiceBean();

        Object o = invokeService_toObject(
                "runtimeService", "getProperty", new Object[]{
                    crb, ComplexRuntimeServiceBean.class.getName(), "i"});

        assertTrue(o instanceof Number);
        assertTrue("o was: "+o.getClass(), o instanceof Long);
        assertEquals(1000L, o);

        try {
            o = invokeService_toObject(
                    "runtimeService", "getProperty", new Object[]{
                            crb, ComplexRuntimeServiceBean.class.getName(),
                        "fooDNE"});
            fail("didn't get an exception");
        } catch (WMRuntimeException e) {
            assertTrue(e.getMessage().startsWith("Unknown"));
        }
    }
    
    public void testReadInvoke() throws Exception {

        Object o = invokeService_toObject(
                "runtimeService", "read", new Object[]{
                        "complexRuntimeServiceBean",    // service name
                        "java.lang.Integer",            // type to load
                        null,                           // instance
                        null,                   // propertyOptions
                        null                    // pagingOptions
                });
        
        ComplexRuntimeServiceBean crsb = (ComplexRuntimeServiceBean) o;
        assertEquals(50, crsb.getI());
    }
    
    public void testReadInvoke_NoServiceName() throws Exception {
        
        Object o = invokeService_toObject(
                "runtimeService", "read", new Object[]{
                        null,    // service name
                        "com.wavemaker.tools.spring.ComplexRuntimeServiceBean",            // type to load
                        null,                           // instance
                        null,                   // propertyOptions
                        null                    // pagingOptions
                });
        
        ComplexRuntimeServiceBean crsb = (ComplexRuntimeServiceBean) o;
        assertEquals(60, crsb.getI());
    }
    
    public void testReadEventListener() throws Exception {
        
        ServiceEventListener eventListener = new ComplexRuntimeServiceBeanEventListener();
        List<ServiceWire> serviceWires = new ArrayList<ServiceWire>();
        serviceWires.add((ServiceWire) getBean("complexRuntimeServiceBeanServiceWire"));
        
        EventManager em = (EventManager) getBean(ConfigurationCompiler.EVENT_MANAGER_BEAN_ID);
        for (ServiceWire sw: serviceWires) {
            em.addEvent(eventListener, sw);
        }
        
        Object o = invokeService_toObject(
                "runtimeService", "read", new Object[]{
                        "complexRuntimeServiceBean",    // service name
                        "java.lang.Integer",            // type to load
                        null,                           // instance
                        null,                   // propertyOptions
                        null                    // pagingOptions
                });
        
        ComplexRuntimeServiceBean crsb = (ComplexRuntimeServiceBean) o;
        assertNotNull(crsb);
        assertEquals(550, crsb.getI());
        
        // the EM stuff above made everything dirty
        setDirty();
    }
    
    public void testGetService() throws Exception {
        
        RuntimeService rs = (RuntimeService) getBean("runtimeService");
        assertNotNull(rs);
        Object crsb = rs.getServiceWire("complexRuntimeServiceBean", "foo.bar");
        assertNotNull(crsb);
        
        Object crsbp = rs.getServiceWire(null,
                "com.wavemaker.tools.spring.ComplexRuntimeServiceBean");
        assertNotNull(crsbp);
        assertEquals(crsb, crsbp);
        
        crsbp = rs.getServiceWire("",
                "com.wavemaker.tools.spring.ComplexRuntimeServiceBean");
        assertNotNull(crsbp);
        assertEquals(crsb, crsbp);
        
        try {
            crsbp = rs.getServiceWire("", "com.foo.bar");
            fail("expected exception");
        } catch (WMRuntimeException e) {
            assertEquals(Resource.NO_SERVICE_FROM_ID_TYPE.getId(),
                    e.getMessageId());
        }
    }
    
    public void testReadWithCycles() throws Exception {
        
        CycleA pl = (CycleA) invokeService_toObject(
                "complexReturnBean", "getCycle", new Object[]{});
        assertEquals("a", pl.getAString());
        assertNotNull(pl.getCycleB());
        assertEquals("b", pl.getCycleB().getBString());
        assertNull(pl.getCycleB().getCycleA());
        
        pl = (CycleA) invokeService_toObject(
                "runtimeService", "read", new Object[]{
                        "complexRuntimeServiceBean",
                        CycleA.class.getName(),
                        null,
                        null, // propertyOptions
                        null
                });
        assertEquals("a", pl.getAString());
        assertNotNull(pl.getCycleB());
        assertEquals("b", pl.getCycleB().getBString());
        assertNull(pl.getCycleB().getCycleA());
        
        PropertyOptions po = new PropertyOptions();
        po.getProperties().add("cycleB.cycleA");
        pl = (CycleA) invokeService_toObject(
                "runtimeService", "read", new Object[]{
                        "complexRuntimeServiceBean",
                        CycleA.class.getName(),
                        null,
                        po, // propertyOptions
                        null
                });
        assertEquals("a", pl.getAString());
        assertNotNull(pl.getCycleB());
        assertEquals("b", pl.getCycleB().getBString());
        assertNotNull(pl.getCycleB().getCycleA());
        assertEquals("a", pl.getCycleB().getCycleA().getAString());
        assertNull(pl.getCycleB().getCycleA().getCycleB());
    }
    
    public void testMultipleReturn_RawObjectNoType() throws Exception {
        
        Object o = invokeService_toObject(
                "runtimeService", "read", new Object[]{
                        "multipleReturnsRuntimeServiceBean",    // service name
                        RawObjectNoType.class.getName(),        // type to load
                        null,                                   // instance
                        null,                                   // propertyOptions
                        null                                    // pagingOptions
                });

        assertTrue(o instanceof JSONObject);
        assertTrue(((JSONObject)o).containsKey("a"));
        assertEquals("aVal", ((JSONObject)o).get("a"));
    }
    
    public void testMultipleReturn_RawObjectType() throws Exception {
        
        Object o = invokeService_toObject(
                "runtimeService", "read", new Object[]{
                        "multipleReturnsRuntimeServiceBean",    // service name
                        RawObjectType.class.getName(),    // type to load
                        null,                                   // instance
                        null,                                   // propertyOptions
                        null                                    // pagingOptions
                });
        
        assertTrue(o instanceof RawObjectType);
        assertEquals("bVal", ((RawObjectType)o).getB());
    }
    
    public void testMultipleReturn_WrappedObjectNoType() throws Exception {
        
        Object o = invokeService_toObject(
                "runtimeService", "read", new Object[]{
                        "multipleReturnsRuntimeServiceBean",    // service name
                        WrappedObjectNoType.class.getName(),    // type to load
                        null,                                   // instance
                        null,                                   // propertyOptions
                        null                                    // pagingOptions
                });
        
        assertTrue(o instanceof JSONObject);
        assertTrue(((JSONObject)o).containsKey("c"));
        assertEquals("cVal", ((JSONObject)o).get("c"));
    }
    
    public void testMultipleReturn_WrappedObjectType() throws Exception {

        
        Object o = invokeService_toObject(
                "runtimeService", "read", new Object[]{
                        "multipleReturnsRuntimeServiceBean",    // service name
                        WrappedObjectType.class.getName(),      // type to load
                        null,                                   // instance
                        null,                                   // propertyOptions
                        null                                    // pagingOptions
                });
        
        assertTrue(o instanceof WrappedObjectType);
        assertEquals("dVal", ((WrappedObjectType)o).getD());
    }
    
    public static class ComplexRuntimeServiceBeanEventListener
            implements ServiceEventListener {

        public TypedServiceReturn postOperation(
                ServiceWire serviceWire, String operationName,
                TypedServiceReturn result, Throwable throwable)
                throws Throwable {
            return result;
        }

        public Object[] preOperation(ServiceWire serviceWire,
                String operationName, Object[] params) {
            
            Object service = ((ReflectServiceWire) serviceWire).getServiceBean();
            
            if (service instanceof ComplexRuntimeServiceBean) {
                ComplexRuntimeServiceBean crsb = (ComplexRuntimeServiceBean) service;
                crsb.setEventCalled(true);
            }
            
            return params;
        }
        
    }
}
