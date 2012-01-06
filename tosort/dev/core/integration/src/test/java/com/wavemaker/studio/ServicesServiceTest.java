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

package com.wavemaker.studio;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletResponse;

import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.studio.service.TestDesignServiceManager;
import com.wavemaker.studio.service.TestDesignServiceManager.updateOperation_SD;
import com.wavemaker.studio.service.TestDesignServiceManager.updateService_SD;
import com.wavemaker.studio.service.TestDesignServiceManager.updateService_SD2;
import com.wavemaker.studio.service.TestDesignServiceManager.updateType_SD;
import com.wavemaker.studio.service.TestDesignServiceManager.updateType_SD2;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.DataObject;
import com.wavemaker.tools.service.definitions.DataObject.Element;
import com.wavemaker.tools.service.definitions.DataObjects;
import com.wavemaker.tools.service.definitions.Service;

/**
 * @author small
 * @author Jeremy Grelle
 * 
 */
public class TestServicesService extends StudioTestCase {

    ProjectManager pm;

    DesignServiceManager dsm;

    @Before
    @Override
    public void setUp() throws Exception {

        super.setUp();

        this.pm = (ProjectManager) getApplicationContext().getBean("projectManager");
        this.dsm = (DesignServiceManager) getApplicationContext().getBean("designServiceManager");
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testBasicService() throws Exception {

        Object o;
        Set<String> ol;

        String p = "testUpdateService";
        makeProject(p);

        o = invokeService_toObject("servicesService", "listServices", null);
        assertTrue(o instanceof Set<?>);
        ol = (Set<String>) o;
        assertEquals(0, ol.size());

        ServiceDefinition sd = new updateService_SD();
        ServiceDefinition sd2 = new updateService_SD2();

        File expected = this.dsm.getServiceDefXml(sd.getServiceId()).getFile();
        assertFalse(expected.exists());

        this.dsm.defineService(sd);
        this.dsm.defineService(sd2);

        o = invokeService_toObject("servicesService", "listServices", null);
        assertTrue(o instanceof Set<?>);
        ol = (Set<String>) o;
        assertEquals(2, ol.size());

        SortedSet<String> expectedAL = new TreeSet<String>();
        expectedAL.add(sd.getServiceId());
        expectedAL.add(sd2.getServiceId());

        assertEquals(expectedAL, ol);
    }

    @Test
    public void testListDataObjects() throws Exception {

        String p = "testListDataObjects";
        makeProject(p);

        ServiceDefinition sd = new updateOperation_SD();
        ServiceDefinition sd2 = new updateType_SD();
        ServiceDefinition sd3 = new updateType_SD2();

        this.dsm.defineService(sd);

        Object oWithId = invokeService_toObject("servicesService", "listDataObjects", null);
        assertTrue(oWithId instanceof Map<?, ?>);
        assertEquals(TestDesignServiceManager.RUNTIME_SERVICE_DOS.length, ((Map<?, ?>) oWithId).size());

        this.dsm.defineService(sd2);
        oWithId = invokeService_toObject("servicesService", "listDataObjects", null);
        assertTrue(oWithId instanceof Map<?, ?>);
        Map<?, ?> oWithIdMap = (Map<?, ?>) oWithId;
        assertEquals(1 + TestDesignServiceManager.RUNTIME_SERVICE_DOS.length, oWithIdMap.size());
        assertTrue(oWithIdMap.containsKey(sd2.getLocalTypes().get(0).getTypeName()));

        this.dsm.defineService(sd3);
        oWithId = invokeService_toObject("servicesService", "listDataObjects", null);
        assertTrue(oWithId instanceof Map<?, ?>);
        assertEquals(3 + TestDesignServiceManager.RUNTIME_SERVICE_DOS.length, ((Map<?, ?>) oWithId).size());
        assertTrue(((Map<?, ?>) oWithId).containsKey(sd3.getLocalTypes().get(0).getTypeName()));
    }

    @Test
    public void testConvertDataObjects() {

        List<DataObject> daos = new ArrayList<DataObject>();
        DataObject dao = new DataObject();
        dao.setName("name");
        dao.setJavaType("someType");
        List<Element> elems = dao.getElement();
        Element e1 = new Element();
        e1.setIsList(true);
        e1.setName("foo");
        e1.setTypeRef("java.lang.String");
        Element e2 = new Element();
        e2.setIsList(false);
        e2.setName("bar");
        e2.setTypeRef("someType");
        elems.add(e1);
        elems.add(e2);
        daos.add(dao);

        Set<Service> services = new TreeSet<Service>();
        Service s1 = new Service();
        s1.setCRUDService(true);
        s1.setDataobjects(new DataObjects());
        s1.getDataobjects().getDataobject().add(dao);
        services.add(s1);

        Map<String, Map<String, Map<String, Object>>> testee = ServicesService.convertDataObjects(daos, services);

        assertTrue(testee.containsKey(dao.getJavaType()));

        Map<String, Map<String, Object>> type = testee.get(dao.getJavaType());
        assertTrue(type.containsKey(e1.getName()));
        assertEquals(e1.getTypeRef(), type.get(e1.getName()).get("type"));
        assertFalse((Boolean) type.get(e1.getName()).get("isObject"));
        assertFalse((Boolean) type.get(e1.getName()).get(ServicesService.SUPPORTS_RUNTIME_ACCESS_KEY));
        assertTrue((Boolean) type.get(e1.getName()).get("isList"));

        assertTrue(type.containsKey(e2.getName()));
        assertEquals(e2.getTypeRef(), type.get(e2.getName()).get("type"));
        assertTrue((Boolean) type.get(e2.getName()).get("isObject"));
        assertTrue((Boolean) type.get(e2.getName()).get(ServicesService.SUPPORTS_RUNTIME_ACCESS_KEY));
    }

    @Test
    public void testListTypes() throws Exception {

        String p = "testListDataObjects";
        makeProject(p);
        MockHttpServletResponse resp = new MockHttpServletResponse();

        ServiceDefinition sd = new updateOperation_SD();
        ServiceDefinition sd2 = new updateType_SD();
        ServiceDefinition sd3 = new updateType_SD2();

        invokeService("servicesService", "listTypes", null, resp);
        JSONObject jo = (JSONObject) JSONUnmarshaller.unmarshal(resp.getContentAsString());
        JSONObject jop = (JSONObject) ((JSONObject) jo.get("result")).get("types");
        assertNotNull(jop);
        int primitivesLength = jop.size();
        assertTrue(jop.containsKey("java.lang.String"));
        JSONObject str = (JSONObject) jop.get("java.lang.String");
        assertEquals("String", str.get("primitiveType"));
        assertFalse((Boolean) str.get("internal"));

        this.dsm.defineService(sd);
        resp = new MockHttpServletResponse();
        invokeService("servicesService", "listTypes", null, resp);
        jo = (JSONObject) JSONUnmarshaller.unmarshal(resp.getContentAsString());
        jop = (JSONObject) ((JSONObject) jo.get("result")).get("types");
        assertNotNull(jop);
        assertEquals(primitivesLength, jop.size());

        this.dsm.defineService(sd2);
        resp = new MockHttpServletResponse();
        invokeService("servicesService", "listTypes", null, resp);
        jo = (JSONObject) JSONUnmarshaller.unmarshal(resp.getContentAsString());
        jop = (JSONObject) ((JSONObject) jo.get("result")).get("types");
        assertNotNull(jop);
        assertEquals(1 + primitivesLength, jop.size());
        assertTrue(jop.containsKey(sd2.getLocalTypes().get(0).getTypeName()));

        this.dsm.defineService(sd3);
        resp = new MockHttpServletResponse();
        invokeService("servicesService", "listTypes", null, resp);
        jo = (JSONObject) JSONUnmarshaller.unmarshal(resp.getContentAsString());
        jop = (JSONObject) ((JSONObject) jo.get("result")).get("types");
        assertNotNull(jop);
        assertEquals(3 + primitivesLength, jop.size());
        assertTrue(jop.containsKey(sd3.getLocalTypes().get(0).getTypeName()));
    }
}