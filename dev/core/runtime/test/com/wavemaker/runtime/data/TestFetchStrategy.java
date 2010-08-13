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
package com.wavemaker.runtime.data;

import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import org.hibernate.Hibernate;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.data.sample.sakila.Country;
import com.wavemaker.runtime.data.sample.sakila.TestAddress;
import com.wavemaker.runtime.data.sample.sakila.TestCity;
import com.wavemaker.runtime.data.util.DataServiceUtils;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public class TestFetchStrategy extends WMTestCase {

    private static SessionFactory sessionFactory = null;

    static {
        Properties p = DataServiceUtils
                .loadDBProperties(DataServiceTestConstants.MYSQL_SAKILA_PROPERTIES);

        Configuration cfg = com.wavemaker.runtime.data.util.DataServiceUtils.initConfiguration(
                DataServiceTestConstants.SAKILA_HIBERNATE_CFG, p);

        sessionFactory = cfg.buildSessionFactory();
    }

    public void testEagerLoadToOne() {

        Session session = sessionFactory.openSession();

        List<?> l = null;

        try {

            Query q = session.createQuery("from TestCity c join fetch c.country");

            l = q.list();

        } finally {
            session.close();
        }

        for (Iterator<?> iter = l.iterator(); iter.hasNext();) {

            TestCity city = (TestCity) iter.next();

            Country country = city.getCountry();

            // eagerly loaded
            country.getCountry();
        }
    }

    public void testEagerLoadToMany() {

        Session session = sessionFactory.openSession();

        List<?> l = null;

        try {

            Query q = session
                    .createQuery("from ExtendedCountry c join fetch c.cities");

            l = q.list();

        } finally {
            session.close();
        }

        for (Iterator<?> iter = l.iterator(); iter.hasNext();) {

            Country country = (Country) iter.next();

            TestCity city = (TestCity) country.getCities().iterator().next();

            // eagerly loaded
            city.getCity();
        }
    }

    public void testEagerLoadToManyMany() {

        Session session = sessionFactory.openSession();

        List<?> l = null;

        try {

            Query q = session.createQuery("from ExtendedCountry c join "
                    + "fetch c.cities ci join fetch ci.addresses");

            l = q.list();

        } finally {
            session.close();
        }

        for (Iterator<?> iter = l.iterator(); iter.hasNext();) {

            Country country = (Country) iter.next();

            TestCity city = (TestCity) country.getCities().iterator().next();

            // eagerly loaded
            city.getCity();

            TestAddress a = (TestAddress) city.getAddresses().iterator().next();

            // also eagerly loaded
            a.getAddress();

            assertTrue(Hibernate.isInitialized(country));
            assertTrue(Hibernate.isInitialized(city));
            assertTrue(Hibernate.isInitialized(a));
            
            assertTrue(!Hibernate.isInitialized(a.getCustomers()));
        }
    }
}
