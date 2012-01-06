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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.criterion.MatchMode;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.context.ApplicationContext;

import com.wavemaker.infra.DependentTestFailureException;
import com.wavemaker.runtime.data.sample.sakila.Actor;
import com.wavemaker.runtime.data.sample.sakila.Address;
import com.wavemaker.runtime.data.sample.sakila.City;
import com.wavemaker.runtime.data.sample.sakila.Compositepk;
import com.wavemaker.runtime.data.sample.sakila.CompositepkId;
import com.wavemaker.runtime.data.sample.sakila.Country;
import com.wavemaker.runtime.data.sample.sakila.Customer;
import com.wavemaker.runtime.data.sample.sakila.Sakila;
import com.wavemaker.runtime.data.sample.sakila.Store;
import com.wavemaker.runtime.data.sample.sakila.Varcharpk;
import com.wavemaker.runtime.service.ServiceConstants;
import com.wavemaker.runtime.service.ServiceManager;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class TestSakilaQBE extends RuntimeDataSpringContextTestCase {

    static class TestData {

        Sakila sakila;

        boolean skipRemaining;

        String dependentTestName;

        void setSkipRemaining(String dependentTestName) {
            this.skipRemaining = true;
            this.dependentTestName = dependentTestName;
        }
    }

    private static TestData testData;

    private final TaskManager taskMgr = DefaultTaskManager.getInstance();

    @BeforeClass
    public void initData() {
        testData = new TestData();
    }

    protected void checkShouldSkip() {
        if (testData.skipRemaining) {
            throw new DependentTestFailureException(testData.dependentTestName);
        }
    }

    @Test
    public void testInitService() {

        try {

            ApplicationContext ctx = getApplicationContext();

            ServiceManager serviceMgr = (ServiceManager) ctx.getBean(ServiceConstants.SERVICE_MANAGER_NAME);

            Sakila sakila = (Sakila) ((ReflectServiceWire) serviceMgr.getServiceWire(DataServiceTestConstants.SAKILA_SERVICE_SPRING_ID_2)).getServiceBean();

            sakila.getActorById(Short.valueOf("1")); // test connection

            testData.sakila = sakila;

        } catch (RuntimeException ex) {
            testData.setSkipRemaining("testInitService");
            throw ex;
        }
    }

    @Test
    public void testGetAllActorsWithClass() {

        checkShouldSkip();

        List<?> actors = (List<?>) testData.sakila.getDataServiceManager().invoke(this.taskMgr.getSearchTask(), Actor.class);

        assertTrue(actors.size() == 200);
    }

    @Test
    public void testGetAllActorsWithInstance() {

        checkShouldSkip();

        List<?> actors = (List<?>) testData.sakila.getDataServiceManager().invoke(this.taskMgr.getSearchTask(), new Actor());

        assertTrue(actors.size() == 200);
    }

    @Test
    public void testSearchById() {

        checkShouldSkip();

        Actor a = new Actor();
        a.setActorId(Short.valueOf("2"));

        List<Actor> actors = testData.sakila.getActorList(a, new QueryOptions());
        if (actors.size() != 1) {
            fail("Expected 1 Actor, but got " + actors.size());
        }
        assertEquals(Short.valueOf("2"), actors.get(0).getActorId());
    }

    @Test
    public void testSearchById2() {

        checkShouldSkip();

        Actor a = new Actor();
        a.setActorId(Short.valueOf("2"));
        a.setFirstName("NICK");

        List<Actor> actors = testData.sakila.getActorList(a, new QueryOptions());
        if (actors.size() != 1) {
            fail("Expected 1 Actor, but got " + actors.size());
        }
        assertEquals(Short.valueOf("2"), actors.get(0).getActorId());
    }

    @Test
    public void testSearchById3() {

        checkShouldSkip();

        Varcharpk v = new Varcharpk();
        v.setId("AAA01");

        List<Varcharpk> vs = testData.sakila.getVarcharpkList(v, new QueryOptions());

        assertEquals(new Integer(1), new Integer(vs.size()));
        assertEquals("AAA01", vs.get(0).getId());
    }

    @Test
    public void testSearchById4() {

        checkShouldSkip();

        Varcharpk v = new Varcharpk();
        v.setId("AAA");
        QueryOptions options = new QueryOptions();
        options.setMatchMode("start");
        List<Varcharpk> vs = testData.sakila.getVarcharpkList(v, options);
        assertEquals(4, vs.size());

        v = new Varcharpk();
        v.setId("01");
        options = new QueryOptions();
        options.setMatchMode("end");
        vs = testData.sakila.getVarcharpkList(v, options);
        assertEquals(3, vs.size());

        v = new Varcharpk();
        v.setId("CC");
        options = new QueryOptions();
        options.setMatchMode("anywhere");
        vs = testData.sakila.getVarcharpkList(v, options);
        assertEquals(1, vs.size());

        v = new Varcharpk();
        v.setId("cc");
        options = new QueryOptions();
        options.setMatchMode("anywhere");
        options.setIgnoreCase(true);
        vs = testData.sakila.getVarcharpkList(v, options);
        assertEquals(1, vs.size());

        v = new Varcharpk();
        v.setId("CCC01");
        options = new QueryOptions();
        options.setMatchMode("exact");
        options.setIgnoreCase(false);
        vs = testData.sakila.getVarcharpkList(v, options);
        assertEquals(1, vs.size());
    }

    @Test
    public void testSearchByCompositeId() {

        checkShouldSkip();

        Compositepk cp = new Compositepk();
        CompositepkId id = new CompositepkId();
        id.setId("AAA");
        id.setId2("000");
        cp.setId(id);

        List<Compositepk> l = testData.sakila.getCompositepkList(cp, new QueryOptions());

        assertEquals(1, l.size());
        assertEquals("AAA", l.get(0).getId().getId());
        assertEquals("000", l.get(0).getId().getId2());
    }

    @Test
    public void testSearchByCompositeId2() {

        checkShouldSkip();

        Compositepk cp = new Compositepk();
        CompositepkId id = new CompositepkId();
        id.setId("AA");
        cp.setId(id);

        QueryOptions options = new QueryOptions();
        options.setMatchMode("start");

        List<Compositepk> l = testData.sakila.getCompositepkList(cp, options);

        assertEquals(3, l.size());

        Collection<String> expectedId2s = new HashSet<String>(3);
        expectedId2s.add("000");
        expectedId2s.add("111");
        expectedId2s.add("222");

        for (Compositepk p : l) {
            assertEquals("AAA", p.getId().getId());
            if (!expectedId2s.remove(p.getId().getId2())) {
                fail("Did not expect: " + p.getId().getId2());
            }
        }

        if (!expectedId2s.isEmpty()) {
            fail("Also expected " + expectedId2s);
        }
    }

    @Test
    public void testOrderBySimple() {

        checkShouldSkip();

        Actor actor = new Actor();
        QueryOptions options = new QueryOptions(3);
        options.addAscOrder("lastName");

        List<Actor> actors = testData.sakila.getActorList(actor, options);

        assertTrue(actors.size() == 3);

        Set<String> expectedFirstNames = new HashSet<String>();
        expectedFirstNames.add("CHRISTIAN");
        expectedFirstNames.add("KIRSTEN");
        expectedFirstNames.add("DEBBIE");

        for (Actor a : actors) {
            expectedFirstNames.remove(a.getFirstName());
        }

        if (expectedFirstNames.size() > 0) {
            fail("Also expected actors " + expectedFirstNames);
        }
    }

    // order by with explicit search instance
    @Test
    public void testOrderByRelated1() {

        checkShouldSkip();

        City city = new City();
        Country country = new Country();
        city.setCountry(country);

        QueryOptions options = new QueryOptions(3);
        options.addAscOrder("country.country");

        List<City> cities = testData.sakila.getCityList(city, options);

        assertTrue(cities.size() == 3);

        Set<String> expectedCities = new HashSet<String>();
        expectedCities.add("Kabul");
        expectedCities.add("Batna");
        expectedCities.add("Bchar");

        for (City c : cities) {
            expectedCities.remove(c.getCity());
        }

        if (expectedCities.size() > 0) {
            fail("Also expected cities " + expectedCities);
        }
    }

    // order by without explicit search instance
    @Test
    public void testOrderByRelated2() {

        checkShouldSkip();

        City city = new City();

        QueryOptions options = new QueryOptions(3);
        options.addAscOrder("country.country");

        List<City> cities = testData.sakila.getCityList(city, options);

        assertTrue(cities.size() == 3);

        Set<String> expectedCities = new HashSet<String>();
        expectedCities.add("Kabul");
        expectedCities.add("Batna");
        expectedCities.add("Bchar");

        for (City c : cities) {
            expectedCities.remove(c.getCity());
        }

        if (expectedCities.size() > 0) {
            fail("Also expected cities " + expectedCities);
        }
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testToManySearch() {

        checkShouldSkip();

        Country country = new Country();
        City city = new City();
        city.setCity("Johannesburg");
        country.getCities().add(city);

        QueryOptions options = new QueryOptions();
        options.matchMode(MatchMode.EXACT);
        testData.sakila.getDataServiceManager().begin();
        List<Country> countries = testData.sakila.getCountryList(country, options);

        assertTrue(countries.size() == 1);
        assertTrue(countries.get(0).getCountry().equals("South Africa"));

        testData.sakila.getDataServiceManager().rollback();
    }

    @Test
    public void testSubstringSearch() {

        checkShouldSkip();

        City city = new City();
        city.setCity("burg");
        Country country = new Country();
        country.setCountry("th a"); // matches South Africa
        city.setCountry(country);
        QueryOptions options = new QueryOptions(MatchMode.ANYWHERE);
        List<City> cities = testData.sakila.getCityList(city, options);

        Set<String> expectedCities = new HashSet<String>();
        expectedCities.add("Boksburg");
        expectedCities.add("Johannesburg");
        expectedCities.add("Rustenburg");

        for (City c : cities) {
            expectedCities.remove(c.getCity());
        }

        if (expectedCities.size() > 0) {
            fail("Also expected cities " + cities);
        }
    }

    @Test
    public void testCityNameSearch() {

        checkShouldSkip();

        City c = new City();
        c.setCity("Bo");
        List<City> cities = testData.sakila.getCityList(c);
        assertTrue(cities.size() == 4);

        // the string may also use '%', but it is not required
        c = new City();
        c.setCity("Bo%");
        cities = testData.sakila.getCityList(c);
        assertTrue(cities.size() == 4);
    }

    @Test
    public void testCityByCountrySearch() {

        checkShouldSkip();

        City city = new City();
        Country country = new Country();
        country.setCountry("Germany");
        city.setCountry(country);
        List<City> cities = testData.sakila.getCityList(city);
        assertTrue(cities.size() == 7);
    }

    @Test
    public void testGetActorsPaging() {

        checkShouldSkip();

        QueryOptions options = new QueryOptions(5);

        DataServiceManager ds = testData.sakila.getDataServiceManager();

        List<?> actors = (List<?>) ds.invoke(this.taskMgr.getSearchTask(), new Actor(), options);

        assertTrue(actors.size() == 5);

        Short lastActorId = checkActorIds(actors, 0);

        // get 192 more, there will be 3 left

        options = new QueryOptions(192, 5);

        actors = (List<?>) ds.invoke(this.taskMgr.getSearchTask(), Actor.class, options);

        assertTrue(actors.size() == 192);

        int i = lastActorId.shortValue() + 1;
        assertTrue(((Actor) actors.get(0)).getActorId().equals(Short.valueOf(String.valueOf(i))));

        lastActorId = checkActorIds(actors, 5);

        // get 10 more. we should only get the last 3
        options = new QueryOptions(Integer.valueOf(3), Integer.valueOf(197));

        actors = (List<?>) ds.invoke(this.taskMgr.getSearchTask(), Actor.class, options);

        assertTrue(actors.size() == 3);

        i = lastActorId.shortValue() + 1;
        assertTrue(((Actor) actors.get(0)).getActorId().equals(Short.valueOf(String.valueOf(i))));

        checkActorIds(actors, 197);

    }

    private static Short checkActorIds(List<?> actors, int offset) {
        Short lastActorId = null;
        for (int i = 0; i < actors.size(); i++) {
            Actor a = (Actor) actors.get(i);
            assertTrue(a.getActorId().equals(Short.valueOf(String.valueOf(i + 1 + offset))));
            lastActorId = a.getActorId();
        }
        return lastActorId;
    }

    @Test
    public void testSakilaServiceAutoPaging() {

        checkShouldSkip();

        Sakila sakila = testData.sakila;

        DataServiceManager ds = testData.sakila.getDataServiceManager();

        int pageSize = 10;

        QueryOptions options = new QueryOptions(pageSize);

        Address qbe = new Address();

        // test auto-paging
        List<Address> l = null;

        int numPages = 0;

        ds.begin(); // no required, but better to
        // avoid session-per-op

        int i = 0;

        while (true) {

            l = sakila.getAddressList(qbe, options);

            if (l.size() == 0) {
                break;
            }

            numPages++;

            if (numPages <= 60) {
                assertTrue(l.size() == pageSize);
            }

            for (Address a : l) {

                i++;

                if (i == 257 || i == 518) { // ids in sakila are not quite
                    // sequential
                    i++;
                }

                if (a.getAddressId().shortValue() != (short) i) {
                    fail("Expected address id to be " + i + " but it was " + a.getAddressId());
                }
            }

        }

        ds.commit();

        if (numPages != 61) {
            fail("Expected 61 pages with a 10 row page size, but got " + numPages);
        }
    }

    @Test
    public void testMAV101() {

        checkShouldSkip();

        City city = new City();
        Country country = new Country();
        country.setCountry("Afghanistan");
        city.setCountry(country);
        List<City> cities = testData.sakila.getCityList(city);
        assertTrue(cities.size() == 1);
    }

    // MAV-291
    @Test
    public void testSearchOnTwoForeignKeys() {

        checkShouldSkip();

        Customer customer = new Customer();
        Address a = new Address();
        a.setAddressId(Short.valueOf("20"));
        customer.setAddress(a);
        Store s = new Store();
        s.setStoreId(Byte.valueOf("2"));
        customer.setStore(s);
        List<Customer> l = testData.sakila.getCustomerList(customer);

        assertTrue(l.size() == 1 && l.get(0).getCustomerId().equals(Short.valueOf("16")));
        assertTrue(l.get(0).getAddress().getAddressId().equals(Short.valueOf("20")));
        assertTrue(l.get(0).getStore().getStoreId().equals(Byte.valueOf("2")));

        // sanity checks
        l.get(0).getAddress().getLastUpdate(); // ensure address has been
        // loaded
        l.get(0).getStore().getLastUpdate(); // ensure store has been loaded
    }

    @Test
    public void testLoadCityAndCountry() {

        checkShouldSkip();

        City c = new City();
        QueryOptions q = new QueryOptions();
        q.setMaxResults(1L);
        q.addAscOrder("country.countryId");
        List<City> l = testData.sakila.getCityList(c, q);

        // ordering on to-one eagerly loads the instance
        l.get(0).getCountry().getCountry();

    }

    @Test
    public void testLoadCityAndAddresses() {

        checkShouldSkip();

        City c = new City();
        QueryOptions q = new QueryOptions();
        q.setMaxResults(1L);
        q.addAscOrder("addresses.addressId");
        List<City> l = testData.sakila.getCityList(c, q);

        try {
            // ordering on to-many doesn't eagerly loads the instances
            l.get(0).getAddresses().iterator().next();
            fail();
        } catch (RuntimeException ex) {
        }
    }

    @Test
    public void testSqlRestrictionWhereClause() {

        checkShouldSkip();

        Actor a = new Actor();
        QueryOptions options = new QueryOptions();
        options.addSqlRestriction("last_name like 'A%'");
        List<Actor> l = testData.sakila.getActorList(a, options);
        assertEquals(7, l.size());
    }
}
