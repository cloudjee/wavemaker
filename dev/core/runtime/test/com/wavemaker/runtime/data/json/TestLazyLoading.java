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
package com.wavemaker.runtime.data.json;

import java.util.List;
import java.util.Map;

import com.wavemaker.runtime.data.sample.sakila.Address;
import com.wavemaker.runtime.data.sample.sakila.City;
import com.wavemaker.runtime.data.sample.sakila.Country;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public class TestLazyLoading extends BaseJSONDataTest {

    public void testLazyLoadCountry() {

        String s = runSakilaOpMarshalledResponse("getCityById", "1");

        Map<String, String> attrs = tokenizeObjectLiteral(s);

        verifyCityAttributes(attrs, true, false);

        assertEquals("1", attrs.get("cityId"));

        // lazy load related country
        City c = new City();
        c.setCityId(Short.valueOf("1"));
        c.setAddresses(null); // workaround for MAV-901
        s = runRuntimeOpMarshalledResponse("getProperty", c, c.getClass()
                .getName(), "country");
        
        attrs = tokenizeObjectLiteral(s);

        assertEquals("87", attrs.get("countryId"));
        assertEquals("Spain", attrs.get("country"));

        // cities should not be here
        assertFalse("cities should not have been marchalled", attrs
                .containsKey("cities"));
    }

    public void testLazyLoadCities() {

        String s = runSakilaOpMarshalledResponse("getCountryById", "1");

        Map<String, String> attrs = tokenizeObjectLiteral(s);

        assertEquals("1", attrs.get("countryId"));

        verifyCountryAttributes(attrs, false);

        Country c = new Country();
        c.setCountryId(Short.valueOf("1"));
        c.setCities(null); // workaround for MAV-901

        // lazy load related cities
        s = runRuntimeOpMarshalledResponse("getProperty", c, c.getClass()
                .getName(), "cities");
        
        List<Map<String, String>> cities = tokenizeObjectLiteralList(s);        
        
        assertEquals(1, cities.size());
        
        Map<String, String> m = cities.iterator().next();
        
        assertEquals("251", m.get("cityId"));
        assertEquals("Kabul", m.get("city"));
    }

    public void testLazyLoadCountryFromAddress() {

        String s = runSakilaOpMarshalledResponse("getAddressById", "1");

        Map<String, String> attrs = tokenizeObjectLiteral(s);

        assertEquals("1", attrs.get("addressId"));

        Address a = new Address();
        a.setAddressId(Short.valueOf("1"));
        a.setCustomers(null); // workaround for MAV-901
        a.setStaffs(null); // workaround for MAV-901
        a.setStores(null); // workaround for MAV-901

        // lazy load related city.country
        s = runRuntimeOpMarshalledResponse("getProperty", a, a.getClass()
                .getName(), "city.country");

        attrs = tokenizeObjectLiteral(s);

        verifyCountryAttributes(attrs, false);
    }

    public void testLazyLoadCountryCitiesFromAddress() {

        String s = runSakilaOpMarshalledResponse("getAddressById", "1");

        Map<String, String> attrs = tokenizeObjectLiteral(s);

        assertEquals("1", attrs.get("addressId"));

        Address a = new Address();
        a.setAddressId(Short.valueOf("1"));
        a.setCustomers(null); // workaround for MAV-901
        a.setStaffs(null); // workaround for MAV-901
        a.setStores(null); // workaround for MAV-901

        // lazy load related city.country.cities
        s = runRuntimeOpMarshalledResponse("getProperty", a, a.getClass()
                .getName(), "city.country.cities");

        List<Map<String, String>> cities = tokenizeObjectLiteralList(s);
        
        assertEquals(7, cities.size());
        
        for (Map<String, String> m : cities) {
            verifyCityAttributes(m, false, false);
        }
    }

}
