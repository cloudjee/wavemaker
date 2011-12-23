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

import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.data.sample.sakila.Address;
import com.wavemaker.runtime.data.sample.sakila.City;
import com.wavemaker.runtime.data.sample.sakila.Country;
import com.wavemaker.runtime.data.sample.sakila.FilmActor;

/**
 * @author Simon Toens
 */
public class TestHQLGenerator extends WMTestCase {

    private HQLGenerator generator = null;

    @Override
    public void setUp() {
        this.generator = new HQLGenerator(City.class);
    }

    public void testGetAllCities() {
        String s = "select _e from " + City.class.getName() + " _e";
        assertEquals(s, this.generator.getQuery("sakila"));
    }

    public void testGetCitiesExpr() {
        this.generator.addSelection("cities", "like 'A%'");
        String s = "select _e from " + City.class.getName() + " _e where _e.cities like 'A%'";
        assertEquals(s, this.generator.getQuery("sakila"));
    }

    public void testGetCityExprLower() {
        this.generator.addSelection("city", "like 'a%'", true);
        this.generator.addDescOrder("city", true);
        String s = "select _e from " + City.class.getName() + " _e where lower(_e.city) like 'a%' " + "order by lower(_e.city) desc";
        assertEquals(s, this.generator.getQuery("sakila"));
    }

    public void testCountryExpr() {
        this.generator.addSelection("country.country", "like 'A%'");
        String s = "select _e from " + City.class.getName() + " _e" + " join _e.country _e2 where _e2.country like 'A%'";
        assertEquals(s, this.generator.getQuery("sakila"));
    }

    public void testEagerCountry() {
        this.generator.loadEagerly("country");
        assertEquals("select _e from " + City.class.getName() + " _e join fetch _e.country _e2", this.generator.getQuery("sakila"));
    }

    public void testAddrExpr() {
        this.generator = new HQLGenerator(Address.class);
        this.generator.addSelection("address", "like '%MySQL%'");
        this.generator.addSelection("city.country.country", "='Australia'");
        this.generator.addSelection("city.city", "='Woodridge'");

        String s = "select _e from " + Address.class.getName() + " _e"
            + " join _e.city _e2 join _e2.country _e3 where _e.address like '%MySQL%' and _e3.country ='Australia' and _e2.city ='Woodridge'";
        assertEquals(s, this.generator.getQuery("sakila"));
    }

    public void testAddrExpr2() {
        this.generator = new HQLGenerator(Address.class);
        this.generator.addSelection("address", "like '%MySQL%'");
        this.generator.addSelection("city.country.country", "='Australia'");
        this.generator.addSelection("city.city", "='Woodridge'");
        this.generator.loadEagerly("city");

        String s = "select _e from " + Address.class.getName() + " _e"
            + " join fetch _e.city _e2 join _e2.country _e3 where _e.address like '%MySQL%' and _e3.country ='Australia' and _e2.city ='Woodridge'";
        assertEquals(s, this.generator.getQuery("sakila"));
        assertEquals(s, this.generator.getQuery("sakila"));
    }

    public void testAddrExpr3() {
        this.generator = new HQLGenerator(Address.class);
        this.generator.addSelection("address", "like '%MySQL%'");
        this.generator.addSelection("city.country.country", "='Australia'");
        this.generator.addSelection("city.city", "='Woodridge'");
        this.generator.loadEagerly("city.country");

        String s = "select _e from "
            + Address.class.getName()
            + " _e"
            + " join fetch _e.city _e2 join fetch _e2.country _e3 where _e.address like '%MySQL%' and _e3.country ='Australia' and _e2.city ='Woodridge'";
        assertEquals(s, this.generator.getQuery("sakila"));
    }

    public void testAddrExpr4() {
        this.generator = new HQLGenerator(Address.class);
        this.generator.loadEagerly("city.country.cities");
        assertEquals("select _e from " + Address.class.getName() + " _e join fetch _e.city _e2 join fetch _e2.country _e3 join fetch _e3.cities _e4",
            this.generator.getQuery("sakila"));
    }

    public void testOrder1() {
        this.generator.addAscOrder("city");
        assertEquals("select _e from " + City.class.getName() + " _e order by _e.city asc", this.generator.getQuery("sakila"));
    }

    public void testOrder2() {
        this.generator = new HQLGenerator(Country.class);
        this.generator.addDescOrder("cities.city");
        assertEquals("select _e from " + Country.class.getName() + " _e join _e.cities _e2 order by _e2.city desc", this.generator.getQuery("sakila"));
    }

    public void testCount() {
        assertEquals("select count(*) from " + City.class.getName() + " _e", this.generator.getCountQuery("sakila"));
    }

    public void testCount2() {
        this.generator.loadEagerly("country");
        assertEquals("select count(*) from " + City.class.getName() + " _e", this.generator.getCountQuery("sakila"));
    }

    public void testTypeManager() {
        HQLGenerator.TypeManager mgr = new HQLGenerator.TypeManager() {

            @Override
            public boolean isComponentPath(String propertyPath, String dbName) {
                if (propertyPath.equals("id") || propertyPath.startsWith("id.")) {
                    return true;
                }
                return false;
            }
        };
        this.generator = new HQLGenerator(FilmActor.class, mgr);
        this.generator.loadEagerly("id");
        this.generator.addSelection("id.actorId", "=1");
        this.generator.addSelection("id.actor.lastName", "=2");
        this.generator.addSelection("id.foo.blah", "=3");
        assertEquals(
            "select _e from com.wavemaker.runtime.data.sample.sakila.FilmActor _e where _e.id.actorId =1 and _e.id.actor.lastName =2 and _e.id.foo.blah =3",
            this.generator.getQuery("sakila"));
    }
}
