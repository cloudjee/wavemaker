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

package com.wavemaker.runtime.data;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.Date;
import java.util.List;

import org.hibernate.MappingException;
import org.hibernate.Session;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Projections;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.HibernateSystemException;

import com.wavemaker.runtime.data.sample.sakila.Actor;
import com.wavemaker.runtime.data.sample.sakila.Country;
import com.wavemaker.runtime.data.sample.sakila.Sakila;
import com.wavemaker.runtime.service.ServiceConstants;
import com.wavemaker.runtime.service.ServiceManager;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;

public class TestDataService extends RuntimeDataSpringContextTestCase {

    private DataServiceManager ds = null;

    private final TaskManager taskMgr = DefaultTaskManager.getInstance();

    @Before
    public void setUp() {

        this.ds = getSakilaService().getDataServiceManager();
    }

    @Test
    public void testCountTask() {
        Actor actor = new Actor();
        actor.setFirstName("N");
        QueryOptions options = new QueryOptions(3);
        options.matchMode(MatchMode.START);
        int count = (Integer) this.ds.invoke(this.taskMgr.getCountTask(), actor, options);
        assertTrue(count == 4);
    }

    @Test
    public void testUknownQuery() throws Throwable {
        try {
            this.ds.invoke(this.taskMgr.getQueryTask(), "GetFoo");
        } catch (HibernateSystemException ex) {
            assertTrue(ex.getCause().getClass() == MappingException.class);
            return;
        }
        fail();
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testGetActorById() {
        List<Actor> l = (List<Actor>) this.ds.invoke(this.taskMgr.getQueryTask(), "getActorById", Short.valueOf("2"));

        assertTrue(l.size() == 1);
        assertTrue(l.get(0).getActorId().equals(Short.valueOf("2")));
    }

    @Test
    public void testSakilaServiceGetActorById() {
        Sakila sakila = getSakilaService();
        Actor a = sakila.getActorById(Short.valueOf("2"));
        assertTrue(a.getFirstName().equals("NICK"));
    }

    @Test
    public void testSakilaServiceUpdateCountry() {
        Sakila sakila = getSakilaService();

        Country ec = sakila.getCountryById(Short.valueOf("109"));

        String originalName = ec.getCountry();

        assertEquals("Zambia", originalName);

        ec.setCountry("foo-country");

        sakila.updateCountry(ec);

        ec = sakila.getCountryById(Short.valueOf("109"));

        assertTrue(ec.getCountry().equals("foo-country"));

        ec.setCountry(originalName);

        sakila.updateCountry(ec);
    }

    @Test
    public void testSakilaServiceInsertCountry() {
        Sakila sakila = getSakilaService();
        Country ec = new Country();
        ec.setCountry("Turkmeister");
        ec.setLastUpdate(new Date());
        sakila.insertCountry(ec);

        Short id = ec.getCountryId();

        assertTrue(sakila.getCountryById(id) != null);

        sakila.deleteCountry(ec);

        ec = sakila.getCountryById(id);
        assertTrue(ec == null);

    }

    /**
     * Check we can work with the Hibernate session directly
     */
    @Test
    public void testGetSession() {

        Sakila sakila = getSakilaService();

        // using the session directly requires starting a tx
        sakila.getDataServiceManager().begin();

        Session session = sakila.getDataServiceManager().getSession();
        assertTrue("Session cannot be null", session != null);

        Integer numActors = (Integer) session.createCriteria(Actor.class).setProjection(Projections.rowCount()).uniqueResult();

        sakila.getDataServiceManager().rollback();

        assertTrue(numActors == 200);
    }

    private Sakila getSakilaService() {
        ApplicationContext ctx = getApplicationContext();
        ServiceManager serviceMgr = (ServiceManager) ctx.getBean(ServiceConstants.SERVICE_MANAGER_NAME);

        return (Sakila) ((ReflectServiceWire) serviceMgr.getServiceWire(DataServiceTestConstants.SAKILA_SERVICE_SPRING_ID_2)).getServiceBean();
    }
}
