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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.Map;

import org.junit.Test;

import com.wavemaker.runtime.data.DataServiceTestConstants;
import com.wavemaker.runtime.data.sample.sakila.Address;
import com.wavemaker.runtime.data.sample.sakila.City;
import com.wavemaker.runtime.data.sample.sakila.Defaults;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class TestUpdate extends BaseJSONDataTest {

    // check handling of default values
    @Test public void testInsertUpdateCRUDDefaults() {

        try {
            String post = "{\"params\": [" + "\""
                    + DataServiceTestConstants.SAKILA_SERVICE_SPRING_ID_2 + "\"," + "\""
                    + Defaults.class.getName() + "\","
                    + "{\"id\": 1, \"firstName\": \"foo\"}], "
                    + "\"method\": \"insert\", \"id\": 9}";

            String s = runRuntimeOpMarshalledResponse(post);

            Map<String, String> m = tokenizeObjectLiteral(s);

            assertEquals("1", m.get("id"));
            assertEquals("foo", m.get("firstName"));
            assertEquals("default ln", m.get("lastName")); // default from db

            // try update - last_name has a trigger
            post = "{\"params\": [" + "\""
                    + DataServiceTestConstants.SAKILA_SERVICE_SPRING_ID_2 + "\"," + "\""
                    + Defaults.class.getName() + "\","
                    + "{\"id\": 1, \"lastName\": null}], "
                    + "\"method\": \"update\", \"id\": 9}";

            s = runRuntimeOpMarshalledResponse(post);

            m = tokenizeObjectLiteral(s);
            assertEquals("1", m.get("id"));
            assertEquals("foo", m.get("firstName"));
            assertEquals("trigger ln", m.get("lastName")); // default from db

        } finally {
            String post = "{\"params\": [" + "\""
                    + DataServiceTestConstants.SAKILA_SERVICE_SPRING_ID_2 + "\"," + "\""
                    + Defaults.class.getName() + "\"," + "{\"id\": 1}], "
                    + "\"method\": \"delete\", \"id\": 9}";
            try {
                runRuntimeOpMarshalledResponse(post);
            } catch (RuntimeException ignore) {
            }
        }
    }

    @Test public void testUpdateCityName() {

        String newCityName = "ffcity";

        String s = runSakilaOpMarshalledResponse("getCityById", Short
                .valueOf("1"));

        Map<String, String> org = tokenizeObjectLiteral(s);

        String post = getUpdateCityPost(newCityName);

        assertTrue(!org.get("city").equals(newCityName));

        try {

            s = runSakilaOpMarshalledResponse(post);

            assertEquals("null", s);

            s = runSakilaOpMarshalledResponse("getCityById", Short.valueOf("1"));

            Map<String, String> mod = tokenizeObjectLiteral(s);

            Map<String, String> modified = getModifiedProperties(org, mod);

            assertEquals(1, modified.size());
            assertTrue(modified.containsKey("city"));
            assertEquals("ffcity", modified.get("city"));

        } finally {

            post = getUpdateCityPost(org.get("city"));

            runSakilaOpMarshalledResponse(post);
        }
    }

    // Verify mergeUpdate traverses relationships
    // With save-update enabled on Address.city
    // expecting Address.address and related City.city changed
    // City.country will not change
    @Test public void testUpdateAddressAndRelatedCity() {

        String addressId = "1";
        String cityId = "300";
        String newAddress = "11 WaveMaker Way";
        String newCity = "WaveMaker City";
        String countryId = "20"; // city 300 has country 20

        String s = runSakilaOpMarshalledResponse("getAddressById", addressId);
        Map<String, String> orgAddress = tokenizeObjectLiteral(s);
        assertEquals("47 MySakila Drive", orgAddress.get("address"));

        s = runRuntimeOpMarshalledResponse(getRelatedCityPost(addressId));
        Map<String, String> orgCity = tokenizeObjectLiteral(s);
        assertEquals(cityId, orgCity.get("cityId"));
        assertEquals("Lethbridge", orgCity.get("city"));

        s = runRuntimeOpMarshalledResponse(getRelatedCountryPost(cityId));
        Map<String, String> orgCountry = tokenizeObjectLiteral(s);
        assertEquals(countryId, orgCountry.get("countryId"));

        String post = getUpdateAddressAndCityPost(addressId, cityId,
                newAddress, newCity);
        runSakilaOpMarshalledResponse(post);

        // verify
        s = runSakilaOpMarshalledResponse("getAddressById", addressId);
        Map<String, String> m = tokenizeObjectLiteral(s);
        assertEquals(newAddress, m.get("address"));

        s = runRuntimeOpMarshalledResponse(getRelatedCityPost(addressId));
        m = tokenizeObjectLiteral(s);
        assertEquals(cityId, m.get("cityId"));
        assertEquals(newCity, m.get("city"));

        s = runRuntimeOpMarshalledResponse(getRelatedCountryPost(cityId));
        m = tokenizeObjectLiteral(s);
        assertEquals(countryId, m.get("countryId"));

        // revert changes
        post = getUpdateAddressAndCityPost(addressId, cityId, orgAddress
                .get("address"), orgCity.get("city"));
        runSakilaOpMarshalledResponse(post);
    }

    @Test public void testUpdateRelatedCountry() {

        String cityId = "1";

        String newCountryId = "1";

        String s = runSakilaOpMarshalledResponse("getCityById", Short
                .valueOf(cityId));

        Map<String, String> org = tokenizeObjectLiteral(s);

        s = runRuntimeOpMarshalledResponse(getRelatedCountryPost(cityId));

        Map<String, String> orgCountry = tokenizeObjectLiteral(s);

        assertTrue(!orgCountry.get("countryId").equals(newCountryId));

        try {

            String post = getUpdateRelatedCountryPost(cityId, newCountryId);

            s = runSakilaOpMarshalledResponse(post);

            assertEquals("null", s);

            s = runSakilaOpMarshalledResponse("getCityById", Short
                    .valueOf(cityId));

            Map<String, String> mod = tokenizeObjectLiteral(s);

            Map<String, String> modified = getModifiedProperties(org, mod);

            assertEquals(0, modified.size());

            s = runRuntimeOpMarshalledResponse(getRelatedCountryPost("1"));

            Map<String, String> newCountry = tokenizeObjectLiteral(s);

            assertEquals("1", newCountry.get("countryId"));

        } finally {

            runSakilaOpMarshalledResponse(getUpdateRelatedCountryPost(cityId,
                    orgCountry.get("countryId")));
        }

    }

    @Test public void testUpdateEmptyInstance() {

        String post = "{\"params\": [{}], "
                + "\"method\": \"updateCity\", \"id\": 9}";

        String s = runSakilaOpMarshalledResponse(post);

        assertEquals("{\"error\":\"id property \\\"cityId\\\" must be set\"}",
                s);
    }

    private String getUpdateCityPost(String cityName) {
        return "{\"params\": [" + "{\"cityId\": \"1\"," + "\"city\": \""
                + cityName + "\"}], "
                + "\"method\": \"updateCity\", \"id\": 9}";
    }

    private String getUpdateRelatedCountryPost(String cityId, String countryId) {
        return "{\"params\": [" + "{\"cityId\": \"" + cityId + "\","
                + "\"country\":{\"countryId\": \"" + countryId + "\" }}], "
                + "\"method\": \"updateCity\", \"id\": 9}";
    }

    private String getUpdateAddressAndCityPost(String addressId, String cityId,
            String newAddress, String newCity) {
        return "{\"params\": [" + "{\"addressId\": \"" + addressId + "\","
                + "\"address\":\"" + newAddress + "\","
                + "\"city\":{\"cityId\": \"" + cityId + "\", \"city\": \""
                + newCity + "\" }}], "
                + "\"method\": \"updateAddress\", \"id\": 9}";
    }

    private String getRelatedCityPost(String addressId) {
        return "{\"params\":[" + "{\"addressId\":\"" + addressId + "\"},\""
                + Address.class.getName() + "\",\"city\"],"
                + "\"method\":\"getProperty\", \"id\":9}";
    }

    private String getRelatedCountryPost(String cityId) {
        return "{\"params\":[" + "{\"cityId\":\"" + cityId + "\"},\""
                + City.class.getName() + "\",\"country\"],"
                + "\"method\":\"getProperty\", \"id\":9}";
    }
}
