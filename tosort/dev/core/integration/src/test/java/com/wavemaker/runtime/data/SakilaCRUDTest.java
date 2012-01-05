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

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.context.ApplicationContext;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.data.sample.sakila.Actor;
import com.wavemaker.runtime.data.sample.sakila.Address;
import com.wavemaker.runtime.data.sample.sakila.City;
import com.wavemaker.runtime.data.sample.sakila.Country;
import com.wavemaker.runtime.data.sample.sakila.Customer;
import com.wavemaker.runtime.data.sample.sakila.CustomerListFixed;
import com.wavemaker.runtime.data.sample.sakila.CustomerListId;
import com.wavemaker.runtime.data.sample.sakila.Film;
import com.wavemaker.runtime.data.sample.sakila.FilmList;
import com.wavemaker.runtime.data.sample.sakila.FilmListId;
import com.wavemaker.runtime.data.sample.sakila.Inventory;
import com.wavemaker.runtime.data.sample.sakila.Language;
import com.wavemaker.runtime.data.sample.sakila.Rental;
import com.wavemaker.runtime.data.sample.sakila.Sakila;
import com.wavemaker.runtime.data.sample.sakila.Staff;
import com.wavemaker.runtime.data.sample.sakila.Store;
import com.wavemaker.runtime.data.sample.sakila.output.GetActorNames;
import com.wavemaker.runtime.data.util.LoggingUtils;
import com.wavemaker.runtime.data.util.TxUtils;
import com.wavemaker.runtime.service.ServiceConstants;
import com.wavemaker.runtime.service.ServiceManager;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;

/**
 * Overview:
 * 
 * Check if any stores are located in San Francisco. If there aren't any, add a new San Francisco store, with manager
 * 'Stephens'. Check out his picture (blob). NOTE: turns out there's no picture for Stephens. Try Mike's picture -
 * staff_id=1.
 * 
 * Lookup his staff_id, and get his picture. Trying to add a new store with Stephens as manager will fail because he's
 * already a manager at a different store. Catch the Exception and rollback. Make sure the store was not added.
 * 
 * Add a new customer to one of the Woodridge stores, called 'Fred Fu' (with same address as the store). Find the
 * Woodridge store using a QBE search, with related city set to 'Woodridge'.
 * 
 * User the customer_list view to confirm the new customer is there.
 * 
 * Add a new film (with language_id 3, which is japanese) and inventory to the store.
 * 
 * Call the film_in_stock procedure to confirm the inventory is there.
 * 
 * Have Fred rent this new move.
 * 
 * Undo all changes, using cascade delete if possible.
 * 
 * 
 * 
 * Note that these tests are using com.wavemaker.runtime.data.sample.sakila
 * 
 * 
 * Issues: - The date for each DataObject needs to be set explicitly, since the import doesn't automatically identify it
 * as "version col". We will need tooling to identify columns as "version columns" or some algorithm that automatically
 * marks them as such given some naming convention.
 * 
 * 
 * The QueryOptions API is annoying to use. It requires instantiating QueryOption instances all over. UPDATE: This has
 * been fixed. A QueryOptions instance is now optional.
 * 
 * insert...(session.save()) needs to be called on each instance, unless cascade-save is enabled in the mapping meta
 * data. UPDATE: It is also possible now to call begin()/rollback() on the service class, so this is no longer a real
 * problem. Same issue with delete. cascade-delete.
 * 
 * Hibernate QBE ignores ids: http://opensource.atlassian.com/projects/hibernate/browse/HB-1437 This is a problem if
 * everything imported is an id, which happens when Hibernate Tools can't figure out the id, which in turn happens for
 * views for sure. I am modifying the CustomerList mapping file for now (CustomerListFixed.hbm.xml).
 * 
 * 
 * Stored procedures have to return a single result set as the first out param to work with Hibernate
 * http://www.hibernate.org/hib_docs/v3/reference/en/html_single/#sp_query
 * 
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class TestSakilaCRUD extends RuntimeDataSpringContextTestCase {

    private static class TestData {

        private Sakila sakila = null;

        private Staff stephens = null;

        private Store woodridge = null;

        private Customer fred = null;

        private Rental rental = null;

        private Inventory inventory = null;

        void setSakila(Sakila sakila) {
            this.sakila = sakila;
        }

        void setWoodridge(Store woodridge) {
            this.woodridge = woodridge;
        }

        Store getWoodridge() {
            return this.woodridge;
        }

        Sakila getSakila() {
            return this.sakila;
        }

        void setStephens(Staff stephens) {
            this.stephens = stephens;
        }

        Staff getStephens() {
            return this.stephens;
        }

        void setFred(Customer fred) {
            this.fred = fred;
        }

        Customer getFred() {
            return this.fred;
        }

        Rental getRental() {
            return this.rental;
        }

        void setRenal(Rental rental) {
            this.rental = rental;
        }

        Inventory getInventory() {
            return this.inventory;
        }

        void setInventory(Inventory inventory) {
            this.inventory = inventory;
        }

    }

    private static TestData data;

    @BeforeClass
    public static void initData() {
        data = new TestData();
    }

    protected String getSakilaBeanId() {
        return DataServiceTestConstants.SAKILA_SERVICE_SPRING_ID_2;
    }

    /**
     * Get connection, validate it
     */
    @Test
    public void testConnection() {

        ApplicationContext ctx = getApplicationContext();

        ServiceManager serviceMgr = (ServiceManager) ctx.getBean(ServiceConstants.SERVICE_MANAGER_NAME);

        Sakila sakila = (Sakila) ((ReflectServiceWire) serviceMgr.getServiceWire(getSakilaBeanId())).getServiceBean();

        sakila.getActorById(Short.valueOf("1")); // test connection

        data.setSakila(sakila);
    }

    @Test
    public void testNoSanFrancisco() {

        if (data.getSakila() == null) {
            fail("sakila cannot be null");
        }

        Sakila sakila = data.getSakila();

        City c = new City();

        c.setCity("San Fran");

        List<City> l = sakila.getCityList(c, new QueryOptions(MatchMode.START));

        if (!l.isEmpty()) {
            fail("Did not expect city starting with \"San Fran\"");
            data.setSakila(null); // will cause subsequent tests to fail
        }
    }

    @Test
    public void testGetStephens() {

        if (data.getSakila() == null) {
            fail("sakila cannot be null");
        }

        Sakila sakila = data.getSakila();

        // get staff instance for 'Stephens'

        Staff qbeStaff = new Staff();
        qbeStaff.setLastName("Stephens");
        qbeStaff.setActive(true);

        // here it would be nice if I could get a single Staff instance
        // instead of having to unwrap
        List<Staff> l = sakila.getStaffList(qbeStaff, new QueryOptions(MatchMode.START));

        assertTrue(l.size() == 1);

        data.setStephens(l.iterator().next());
    }

    @Test
    public void testAddStore() {

        if (data.getStephens() == null) {
            fail("Staff Stephens cannot be null");
        }

        Sakila sakila = data.getSakila();

        // new city for san francisco
        City city = new City();

        city.setCity("San Francisco");
        city.setLastUpdate(new Date());

        // re-use existing country
        Country country = new Country();
        country.setCountryId(Short.valueOf("103")); // United States

        city.setCountry(country);

        sakila.getDataServiceManager().begin();

        try {

            sakila.insertCity(city);

            // new address for the store
            Address address = new Address();

            address.setCity(city);

            address.setAddress("150 Spear Street");
            address.setDistrict("Market");
            address.setPostalCode("94102");
            address.setPhone("415-402-2349");
            address.setLastUpdate(new Date());

            sakila.insertAddress(address);

            // the new store
            Store store = new Store();

            store.setAddress(address);
            store.setStaff(data.getStephens());
            store.setLastUpdate(new Date());

            sakila.insertStore(store);

            sakila.getDataServiceManager().commit();

        } catch (RuntimeException ex) {
            try {
                sakila.getDataServiceManager().rollback();
                return;
            } catch (RuntimeException ex2) {
                LoggingUtils.logCannotRollbackTx(ex2);
                fail();
            }
            throw ex;
        }

        fail();
    }

    @Test
    public void testGetWoodridgeAddress() {

        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        Store s = new Store();
        QueryOptions o = new QueryOptions();

        // join on related address -> join on related city

        City city = new City();
        city.setCity("Woodridge");

        s.setAddress(new Address());
        s.getAddress().setCity(city);

        List<Store> l = sakila.getStoreList(s, o);

        assertTrue(l.size() == 1);

        Store woodridge = l.get(0);

        assertTrue(woodridge.getStoreId() == 2);

        data.setWoodridge(woodridge);

    }

    @Test
    public void testAddCustomer() {

        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        Store woodridge = data.getWoodridge();

        if (woodridge == null) {
            fail("woordridge store must be set");
        }

        Address a = woodridge.getAddress();

        // way to re-attach
        // sakila.begin();
        // sakila.getSession().lock(woodridge, LockMode.NONE);
        // Staff staff = woodridge.getStaff();
        // warn(staff.getFirstName());
        // sakila.rollback();

        Customer fred = new Customer();

        fred.setFirstName("FRED");
        fred.setLastName("FU");
        fred.setAddress(a);
        fred.setStore(woodridge);
        fred.setActive(true);
        fred.setCreateDate(new Date());

        // test the custom Sakila insert task, which does just this:
        // (wired in through the spring config file for this service)
        // fred.setLastUpdate(new Date());

        sakila.insertCustomer(fred);

        data.setFred(fred);
    }

    @Test
    public void testCustomerInserted() {

        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        Customer fred = data.getFred();
        if (fred == null) {
            fail("Fred cannot be null");
        }

        Customer c = sakila.getCustomerById(data.getFred().getCustomerId());

        assertTrue(c != null);
        assertTrue(c.getFirstName().equals("FRED"));
    }

    @Test
    public void testAddFilmAndInventory() {

        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        Store woodridgeStore = data.getWoodridge();
        if (woodridgeStore == null) {
            fail("The Woodridge Store is null!");
        }

        Customer fred = data.getFred();

        if (fred == null) {
            fail("Fred cannot be null");
        }

        sakila.getDataServiceManager().begin();

        try {

            Language l = new Language();
            l.setLanguageId((byte) 3);

            Film film = new Film();
            film.setTitle("Frankie goes to Starbucks");
            film.setLanguageByLanguageId(l);
            film.setLanguageByOriginalLanguageId(l);
            film.setRentalRate(BigDecimal.ONE);
            film.setRentalDuration((byte) 2);
            film.setReplacementCost(BigDecimal.TEN);
            film.setLastUpdate(new Date());

            sakila.insertFilm(film);

            Inventory inventory = new Inventory();
            inventory.setFilm(film);
            inventory.setStore(woodridgeStore);
            inventory.setLastUpdate(new Date());

            sakila.insertInventory(inventory);

            sakila.getDataServiceManager().commit();

            this.logger.info("added new inventory " + inventory.getInventoryId());
            data.setInventory(inventory);

        } catch (RuntimeException ex) {
            TxUtils.rollbackTx(sakila.getDataServiceManager());
            throw ex;
        }
    }

    @Test
    public void testAddRental() {

        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        Store woodridgeStore = data.getWoodridge();
        if (woodridgeStore == null) {
            fail("The Woodridge Store is null!");
        }

        Customer fred = data.getFred();
        if (fred == null) {
            fail("Fred cannot be null");
        }

        Inventory inventory = data.getInventory();
        if (inventory == null) {
            fail("Inventory cannot be null");
        }

        Rental rental = new Rental();
        rental.setCustomer(fred);
        rental.setInventory(inventory);
        rental.setStaff(woodridgeStore.getStaff());
        rental.setLastUpdate(new Date());
        rental.setRentalDate(new Date());
        rental.setReturnDate(new Date());

        sakila.insertRental(rental);

        this.logger.info("added rental " + rental.getRentalId());

        data.setRenal(rental);

    }

    @Test
    public void testCustomerListView() {
        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        CustomerListId lid = new CustomerListId();
        lid.setName("FU");

        CustomerListFixed c = new CustomerListFixed();
        c.setId(lid);

        QueryOptions o = new QueryOptions(MatchMode.ANYWHERE);
        List<CustomerListFixed> l = sakila.getCustomerListFixedList(c, o);

        assertTrue(l.size() == 3); // there are 3 FU people

        assertTrue(l.get(2).getId().getName().equals("FRED FU"));
    }

    @Test
    public void testFilmListView() {
        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        List<FilmList> l = sakila.getFilmListList();

        assertTrue(l.size() == 997);

        FilmListId id = new FilmListId();
        id.setCategory("Animation");

        FilmList fl = new FilmList();
        fl.setId(id);

        l = sakila.getFilmListList(fl, new QueryOptions());

        assertEquals(66, l.size());

        for (FilmList filmList : l) {
            assertEquals("Animation", filmList.getId().getCategory());
        }
    }

    @Test
    public void testFilmInStockProcedure() {

        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        Store woodridgeStore = data.getWoodridge();
        if (woodridgeStore == null) {
            fail("The Woodridge Store is null!");
        }

        Inventory inventory = data.getInventory();

        if (inventory == null) {
            fail("The inventory cannot be null");
        }

        this.logger.info("Calling film_not_in_stock with " + inventory.getFilm().getFilmId() + ", " + woodridgeStore.getStoreId());

        List<?> l = sakila.getFilmInStock(inventory.getFilm().getFilmId(), woodridgeStore.getStoreId());

        assertTrue(l.size() == 1);

        assertTrue(l.get(0).equals(inventory.getInventoryId()));
    }

    @Test
    public void testDeleteCustomer() {

        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        Customer fred = data.getFred();

        if (fred == null) {
            fail("Fred cannot be null");
        }

        sakila.deleteCustomer(fred);

    }

    @Test
    public void testDeleteFilmAndRental() {

        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        Rental rental = data.getRental();

        if (rental == null) {
            fail("The rental cannot be null");
        }

        sakila.getDataServiceManager().begin();
        try {
            sakila.deleteRental(rental);
            sakila.deleteInventory(rental.getInventory());
            sakila.deleteFilm(rental.getInventory().getFilm());
            sakila.getDataServiceManager().commit();
            this.logger.info("Deleted Film " + rental.getInventory().getFilm().getFilmId());
            this.logger.info("Deleted Inventory " + rental.getInventory().getInventoryId());
            this.logger.info("Deleted Rental " + rental.getRentalId());
        } catch (RuntimeException ex) {
            TxUtils.rollbackTx(sakila.getDataServiceManager());
            throw ex;
        }
    }

    @Test
    public void testBlob() throws Exception {

        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        Staff staff = sakila.getStaffById((byte) 1);

        byte[] picture = staff.getPicture();

        InputStream is = this.getClass().getClassLoader().getResourceAsStream("com/wavemaker/runtime/data/mike.pic");

        assertTrue("Resource mike.pic doesn't exist", is != null);

        assertTrue("Files are not equal", IOUtils.compare(new ByteArrayInputStream(picture), is));

    }

    @Test
    public void testDeleteDetachedCity() {

        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        sakila.begin();

        City c = new City();
        c.setCityId(Short.valueOf("1"));

        boolean ok = true;

        try {
            sakila.deleteCity(c);
            sakila.commit();
            ok = false;
        } catch (RuntimeException ex) {
            // TxUtils.rollbackTx(sakila.getDataServiceManager());
            ok = true;
        }

        if (!ok) {
            fail("delete should fail because of fk constraint violation");
        }

        sakila.begin();
        sakila.rollback();

    }

    @Test
    public void testUpdateCity() {

        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        sakila.begin();
        City c = sakila.getCityById(Short.valueOf("1"));
        String orgCity = c.getCity();
        c.setCity("_+foo");
        sakila.commit();

        try {
            City c2 = sakila.getCityById(Short.valueOf("1"));
            assertTrue(c2.getCity().equals("_+foo"));
        } finally {
            sakila.begin();
            City c3 = sakila.getCityById(Short.valueOf("1"));
            c3.setCity(orgCity);
            sakila.commit();
        }

    }

    @Test
    public void testSelectClause() {

        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        List<GetActorNames> names = sakila.getActorNames();

        assertEquals("PENELOPE", names.get(0).getFirstName());
        assertEquals("GUINESS", names.get(0).getLastName());

        assertEquals(200, names.size());

    }

    @Test
    public void testUpdateCityAndCountry() {

        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        sakila.begin();

        City org = sakila.getCityById(Short.valueOf("1"));
        String orgCountry = org.getCountry().getCountry();
        String orgCity = org.getCity();

        assertTrue(orgCity.equals("A Corua (La Corua)"));
        assertTrue(orgCountry.equals("Spain"));

        boolean reset = false;

        try {

            org = sakila.getCityById(Short.valueOf("1"));
            org.setCity("foo-blah");
            org.getCountry().setCountry("blah-country");

            sakila.commit();
            reset = true;

            sakila.begin();
            try {
                City c2 = sakila.getCityById(Short.valueOf("1"));
                assertTrue(c2.getCity().equals("foo-blah"));
                assertTrue(c2.getCountry().getCountry().equals("blah-country"));
            } finally {
                sakila.rollback();
            }

        } finally {
            if (reset) {
                org.setCity(orgCity);
                org.getCountry().setCountry(orgCountry);
                sakila.updateCity(org);
            }
        }
    }

    @Test
    public void testListBindParameter() {

        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        List<String> names = new ArrayList<String>();
        names.add("ED");
        names.add("NICK");

        List<Actor> actors = sakila.getActorsByFirstNames(names);

        assertEquals(6, actors.size());
    }

    @Test
    public void testCascadeSave() {

        Sakila sakila = data.getSakila();
        if (sakila == null) {
            fail("sakila cannot be null");
        }

        City c = new City();
        c.setCity("Rock Band");
        c.setLastUpdate(new Date());
        Country co = new Country();
        co.setCountry("Upstairs conf room");
        co.setLastUpdate(new Date());
        c.setCountry(co);

        try {
            sakila.insertCity(c);

            co = sakila.getCountryById(co.getCountryId());
            assertEquals("Upstairs conf room", co.getCountry());

        } finally {
            try {
                sakila.deleteCity(c);
            } catch (RuntimeException ignore) {
            }
            try {
                sakila.deleteCountry(co);
            } catch (RuntimeException ignore) {
            }
        }
    }
}
