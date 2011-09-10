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
package com.wavemaker.runtime.data.crud;

import static org.junit.Assert.assertEquals;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;

import com.wavemaker.runtime.data.Task;
import com.wavemaker.runtime.data.sample.sakila.Address;
import com.wavemaker.runtime.data.sample.sakila.City;
import com.wavemaker.runtime.data.sample.sakila.Country;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class TestInsertOperation extends BaseCRUDServiceTest {

    private Task insertTask = null;

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();

        insertTask = taskMgr.getInsertTask();
    }

    @Test public void testInsertCascadeToMany() {
        Country california = new Country();
        try {
            california = new Country();
            california.setCountry("california");
            Set<City> cities = new HashSet<City>();
            City c = new City();
            c.setLastUpdate(new Date());
            c.setCity("Tenderloin");
            c.setCountry(california);
            cities.add(c);
            c = new City();
            c.setCity("Mission");
            c.setLastUpdate(new Date());
            c.setCountry(california);
            cities.add(c);
            california.setCities(cities);
            sakila.getDataServiceManager().invoke(insertTask, california);
            try {
                sakila.begin();
                california = sakila.getCountryById(california.getCountryId());
                assertEquals(2, california.getCities().size());
            } finally {
                sakila.rollback();
            }
        } finally {
            // uses cascade="delete"
            sakila.delete(california);
        }
    }

    // MAV-1557 - breaks with save-update on Address.city
    @Test public void testInsertAddress() {

        Address a = new Address();

        String newAddress = "myNewAddress";
        Short cityId = Short.valueOf("589"); // this city exists

        a.setAddress(newAddress);
        a.setDistrict("myNewDistrict");
        a.setPhone("1234");
        a.setLastUpdate(new Date());

        // this is an existing city
        City york = new City();
        york.setCityId(cityId);

        a.setCity(york);

        a = (Address) sakila.getDataServiceManager().invoke(insertTask, a);

        Short newAddressId = a.getAddressId();

        try {
            a = sakila.getAddressById(newAddressId);
            assertEquals(newAddress, a.getAddress());
            assertEquals(cityId, a.getCity().getCityId());
        } finally {
            try {
                a.setAddressId(newAddressId);
                sakila.delete(a);
            } catch (RuntimeException ignore) {
            }
        }
    }

    @Test public void testInsertAddressAndCity() {

        Address a = new Address();
        Short countryId = Short.valueOf("1"); // this country exists

        String newCity = "newCity";
        String newAddress = "myNewAddress";

        a.setAddress(newAddress);
        a.setDistrict("myNewDistrict");
        a.setPhone("1234");
        a.setLastUpdate(new Date());

        City city = new City();
        city.setCity(newCity);
        city.setLastUpdate(new Date());
        a.setCity(city);

        Country country = new Country();
        country.setCountryId(countryId);
        city.setCountry(country);

        a = (Address) sakila.getDataServiceManager().invoke(insertTask, a);

        Short newAddressId = a.getAddressId();
        Short newCityId = null;

        try {
            a = sakila.getAddressById(newAddressId);
            assertEquals(newAddress, a.getAddress());

            city = sakila.getCityById(a.getCity().getCityId());
            newCityId = city.getCityId();
            assertEquals(newCity, city.getCity());
            assertEquals(countryId, city.getCountry().getCountryId());
        } finally {
            try {
                a.setAddressId(newAddressId);
                sakila.delete(a);
            } catch (RuntimeException ignore) {
            }
            try {
                city.setCityId(newCityId);
                sakila.delete(city);
            } catch (RuntimeException ignore) {
            }

        }
    }
}
