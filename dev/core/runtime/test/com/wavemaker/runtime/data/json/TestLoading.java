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

import com.wavemaker.runtime.data.QueryOptions;
import com.wavemaker.runtime.data.sample.sakila.City;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public class TestLoading extends BaseJSONDataTest {

    public void testLoadCity() {

        // load a single city - related properties should not be marshalled,
        // to indicate they have not been loaded

        String s = runSakilaOpMarshalledResponse("getCityById", "1");

        Map<String, String> attrs = tokenizeObjectLiteral(s);

        verifyCityAttributes(attrs, true, false);
    }

    public void testLoadCityAndCountry() {

        // use getCityList with ordering on related city to force loading
        // of the city eagerly.

        City c = new City();
        c.setAddresses(null); // workaround for MAV-901
        QueryOptions q = new QueryOptions();
        q.setMaxResults(1L);
        q.addAscOrder("country.countryId");
        String s = runSakilaOpMarshalledResponse("getCityList", c, q);

        Map<String, String> attrs = tokenizeObjectLiteral(s);

        verifyCityAttributes(attrs, false);

        assertFalse("related addresses should not have been marshalled", attrs
                .containsKey("addresses"));
        assertTrue("country has not been marshalled", attrs
                .containsKey("country"));

        Map<String, String> countryAttrs = tokenizeObjectLiteral(attrs
                .get("country"));

        verifyCountryAttributes(countryAttrs, false);
    }

    public void testLoadCityAndCountryAndAddresses() {

        // eagerly load country and addresses

        String s = runSakilaOpMarshalledResponse(
                "testLoadCityAndCountryAndAddresses", (Object[]) null);

        Map<String, String> attrs = tokenizeObjectLiteral(s);

        verifyCityAttributes(attrs, true, true);

        Map<String, String> countryAttrs = tokenizeObjectLiteral(attrs
                .get("country"));

        verifyCountryAttributes(countryAttrs, false);

        Map<String, String> addresses = tokenizeObjectLiteral(attrs
                .get("addresses"));

        assertTrue("addressId has not been marshalled", addresses
                .containsKey("addressId"));
        assertFalse("related city has been marshalled", addresses
                .containsKey("city"));
    }

    public void testLoadCityAndCountryAndCities() {

        // eagerly load country and addresses

        String s = runSakilaOpMarshalledResponse(
                "testLoadCityAndCountryAndCities", (Object[]) null);

        Map<String, String> attrs = tokenizeObjectLiteral(s);

        verifyCityAttributes(attrs, false);

        assertFalse("related addresses should not have been marshalled", attrs
                .containsKey("addresses"));

        assertTrue("country has not been marshalled", attrs
                .containsKey("country"));

        Map<String, String> countryAttrs = tokenizeObjectLiteral(attrs
                .get("country"));

        verifyCountryAttributes(countryAttrs, true);
    }

    public void testLoadAddressNotInDB() {

        String s = runSakilaOpMarshalledResponse("getAddressById", Short
                .valueOf("1111"));

        assertEquals("null", s);
    }

    // this currently hits OOM in JSON
    public void xxxtestLoadActorsFilmActorsFilms() {

        String s = runSakilaOpMarshalledResponse(
                "testLoadActorsFilmActorsFilms", (Object[]) null);

        @SuppressWarnings("unused")        
        List<Map<String, String>> actors = tokenizeObjectLiteralList(s);
    }
}
