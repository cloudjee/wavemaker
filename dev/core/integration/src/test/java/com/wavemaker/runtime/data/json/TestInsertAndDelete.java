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

import com.wavemaker.runtime.data.sample.sakila.Country;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public class TestInsertAndDelete extends BaseJSONDataTest {

    private static boolean inserted = false;

    private static Short countryId = null;

    @Test public void testInsertCountry() {

        String post = "{\"params\": [" + "{\"country\": \"newcountry\", }], "
                + "\"method\": \"insertCountry\", \"id\": 9}";

        String s = runSakilaOpMarshalledResponse(post);

        Map<String, String> attrs = tokenizeObjectLiteral(s);

        // expecting an empty list to be sent back for cities - this
        // is not a proxy, therefore it is not removed
        verifyCountryAttributes(attrs, true);

        assertEquals(0, tokenizeObjectLiteralList(attrs.get("cities")).size());

        assertEquals("newcountry", attrs.get("country"));

        countryId = Short.valueOf(attrs.get("countryId"));

        assertTrue(countryId != null);

        inserted = true;
    }

    @Test public void testDeleteCountry() {

        if (!inserted) {
            return;
        }

        Country c = new Country();
        c.setCountryId(countryId);
        c.setCities(null); // workaround for MAV-901

        String s = runSakilaOpMarshalledResponse("deleteCountry", c);

        assertEquals("null", s);
    }

    @Test public void testDeleteCountryNotInDB() {

        Country c = new Country();
        c.setCountryId(Short.valueOf("1111"));
        c.setCities(null); // workaround for MAV-901

        String s = runSakilaOpMarshalledResponse("deleteCountry", c);

        assertEquals("null", s);
    }

}
