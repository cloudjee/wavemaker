/*
 *  Copyright (C) 2008-2009 WaveMaker Software, Inc.
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

package com.wavemaker.runtime.data.util;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;

import org.hibernate.Session;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.context.ApplicationContext;

import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.data.DataServiceRuntimeException;
import com.wavemaker.runtime.data.DataServiceTestConstants;
import com.wavemaker.runtime.data.RuntimeDataSpringContextTestCase;
import com.wavemaker.runtime.data.sample.sakila.Actor;
import com.wavemaker.runtime.data.sample.sakila.City;
import com.wavemaker.runtime.data.sample.sakila.Country;
import com.wavemaker.runtime.data.sample.sakila.Sakila;
import com.wavemaker.runtime.service.ServiceConstants;
import com.wavemaker.runtime.service.ServiceManager;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public class TestDataServiceUtils extends RuntimeDataSpringContextTestCase {

    private static class TestData {

        private Sakila sakila = null;

    }

    private static TestData data;

    @BeforeClass
    public static void initData() {
        data = new TestData();
    }

    /**
     * Get connection, validate it
     */
    @Test
    public void testConnection() {

        ApplicationContext ctx = getApplicationContext();

        ServiceManager serviceMgr = (ServiceManager) ctx.getBean(ServiceConstants.SERVICE_MANAGER_NAME);

        Sakila sakila = (Sakila) ((ReflectServiceWire) serviceMgr.getServiceWire(DataServiceTestConstants.SAKILA_SERVICE_SPRING_ID_2)).getServiceBean();

        sakila.getActorById(Short.valueOf("1")); // test connection

        data.sakila = sakila;
    }

    @Test
    public void testReloadById() {

        data.sakila.begin();
        Session session = data.sakila.getDataServiceManager().getSession();
        Actor a = (Actor) session.get(Actor.class, new Short("1"));
        assertTrue(a != null);
        data.sakila.rollback();

        data.sakila.begin();
        session = data.sakila.getDataServiceManager().getSession();
        DataServiceMetaData meta = data.sakila.getDataServiceManager().getMetaData();
        Actor b = (Actor) DataServiceUtils.loadById(a, session, meta);
        assertTrue(b != null);
        data.sakila.rollback();

        assertEquals(a.getActorId(), b.getActorId());
        assertEquals(a.getFirstName(), b.getFirstName());
        assertEquals(a.getLastName(), b.getLastName());
        assertEquals(a.getLastUpdate(), b.getLastUpdate());
    }

    @Test
    public void testMergeForUpdateSimpleProperties() {

        Actor org = data.sakila.getActorById(new Short("1"));

        Actor fromClient = new Actor();
        fromClient.setLastName("foo");

        Collection<String> populatedProperties = Collections.emptySet();

        try {
            // causes warning about starting a tx before accessing session
            // that's ok since we don't use the session here
            DataServiceUtils.mergeForUpdate(fromClient, data.sakila, populatedProperties);
            fail();
        } catch (DataServiceRuntimeException ex) {
            assertEquals("id property \"actorId\" must be set", ex.getMessage());
        }

        populatedProperties = new HashSet<String>(2);
        populatedProperties.add("actorId");
        populatedProperties.add("lastName");
        fromClient.setActorId(org.getActorId());

        data.sakila.begin();
        Session session = data.sakila.getDataServiceManager().getSession();
        fromClient = (Actor) DataServiceUtils.mergeForUpdate(fromClient, data.sakila, populatedProperties);

        assertTrue(session.contains(fromClient));
        assertEquals("foo", fromClient.getLastName());
        assertEquals("PENELOPE", fromClient.getFirstName());
        assertEquals(org.getLastUpdate(), fromClient.getLastUpdate());
        assertEquals(19, fromClient.getFilmActors().size());

        data.sakila.rollback();
    }

    @Test
    public void testMergeForUpdateRelatedProperty() {

        City orgCity = data.sakila.getCityById(Short.valueOf("1"));

        Short newCountryId = Short.valueOf("10");

        assertTrue(!orgCity.getCountry().getCountryId().equals(newCountryId));

        Country country = new Country();
        country.setCountryId(newCountryId);
        City fromClient = new City();
        fromClient.setCountry(country);
        fromClient.setCityId(Short.valueOf("1"));

        Collection<String> populatedProperties = new HashSet<String>(1);
        populatedProperties.add("cityId");
        populatedProperties.add("country");
        populatedProperties.add("country.countryId");

        data.sakila.begin();

        fromClient = (City) DataServiceUtils.mergeForUpdate(fromClient, data.sakila, populatedProperties);

        Session session = data.sakila.getDataServiceManager().getSession();
        assertTrue(session.contains(fromClient));
        assertEquals(newCountryId, fromClient.getCountry().getCountryId());

        data.sakila.commit();

        data.sakila.begin();

        fromClient.getCountry().setCountryId(orgCity.getCountry().getCountryId());

        populatedProperties = new HashSet<String>(1);
        populatedProperties.add("cityId");
        populatedProperties.add("country");
        populatedProperties.add("country.countryId");

        fromClient = (City) DataServiceUtils.mergeForUpdate(fromClient, data.sakila, populatedProperties);

        data.sakila.commit();

        City c = data.sakila.getCityById(Short.valueOf("1"));
        assertEquals(orgCity.getCountry().getCountryId(), c.getCountry().getCountryId());
    }

}
