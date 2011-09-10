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
 * @version $Rev$ - $Date$
 * 
 */
public class TestHQLGenerator extends WMTestCase {

	private HQLGenerator generator = null;

	@Override
	public void setUp() {
		generator = new HQLGenerator(City.class);
	}

	public void testGetAllCities() {
		String s = "select _e from " + City.class.getName() + " _e";
		assertEquals(s, generator.getQuery("sakila"));
	}

	public void testGetCitiesExpr() {
		generator.addSelection("cities", "like 'A%'");
		String s = "select _e from " + City.class.getName()
				+ " _e where _e.cities like 'A%'";
		assertEquals(s, generator.getQuery("sakila"));
	}

	public void testGetCityExprLower() {
		generator.addSelection("city", "like 'a%'", true);
		generator.addDescOrder("city", true);
		String s = "select _e from " + City.class.getName()
				+ " _e where lower(_e.city) like 'a%' "
				+ "order by lower(_e.city) desc";
		assertEquals(s, generator.getQuery("sakila"));
	}

	public void testCountryExpr() {
		generator.addSelection("country.country", "like 'A%'");
		String s = "select _e from " + City.class.getName() + " _e"
				+ " join _e.country _e2 where _e2.country like 'A%'";
		assertEquals(s, generator.getQuery("sakila"));
	}

	public void testEagerCountry() {
		generator.loadEagerly("country");
		assertEquals("select _e from " + City.class.getName()
				+ " _e join fetch _e.country _e2", generator.getQuery("sakila"));
	}

	public void testAddrExpr() {
		generator = new HQLGenerator(Address.class);
		generator.addSelection("address", "like '%MySQL%'");
		generator.addSelection("city.country.country", "='Australia'");
		generator.addSelection("city.city", "='Woodridge'");

		String s = "select _e from "
				+ Address.class.getName()
				+ " _e"
				+ " join _e.city _e2 join _e2.country _e3 where _e.address like '%MySQL%' and _e3.country ='Australia' and _e2.city ='Woodridge'";
		assertEquals(s, generator.getQuery("sakila"));
	}

	public void testAddrExpr2() {
		generator = new HQLGenerator(Address.class);
		generator.addSelection("address", "like '%MySQL%'");
		generator.addSelection("city.country.country", "='Australia'");
		generator.addSelection("city.city", "='Woodridge'");
		generator.loadEagerly("city");

		String s = "select _e from "
				+ Address.class.getName()
				+ " _e"
				+ " join fetch _e.city _e2 join _e2.country _e3 where _e.address like '%MySQL%' and _e3.country ='Australia' and _e2.city ='Woodridge'";
		assertEquals(s, generator.getQuery("sakila"));
		assertEquals(s, generator.getQuery("sakila"));
	}

	public void testAddrExpr3() {
		generator = new HQLGenerator(Address.class);
		generator.addSelection("address", "like '%MySQL%'");
		generator.addSelection("city.country.country", "='Australia'");
		generator.addSelection("city.city", "='Woodridge'");
		generator.loadEagerly("city.country");

		String s = "select _e from "
				+ Address.class.getName()
				+ " _e"
				+ " join fetch _e.city _e2 join fetch _e2.country _e3 where _e.address like '%MySQL%' and _e3.country ='Australia' and _e2.city ='Woodridge'";
		assertEquals(s, generator.getQuery("sakila"));
	}

	public void testAddrExpr4() {
		generator = new HQLGenerator(Address.class);
		generator.loadEagerly("city.country.cities");
		assertEquals(
				"select _e from "
						+ Address.class.getName()
						+ " _e join fetch _e.city _e2 join fetch _e2.country _e3 join fetch _e3.cities _e4",
				generator.getQuery("sakila"));
	}

	public void testOrder1() {
		generator.addAscOrder("city");
		assertEquals("select _e from " + City.class.getName()
				+ " _e order by _e.city asc", generator.getQuery("sakila"));
	}

	public void testOrder2() {
		generator = new HQLGenerator(Country.class);
		generator.addDescOrder("cities.city");
		assertEquals("select _e from " + Country.class.getName()
				+ " _e join _e.cities _e2 order by _e2.city desc", generator
				.getQuery("sakila"));
	}

	public void testCount() {
		assertEquals("select count(*) from " + City.class.getName()
				+ " _e", generator.getCountQuery("sakila"));
	}

	public void testCount2() {
		generator.loadEagerly("country");
		assertEquals("select count(*) from " + City.class.getName()
				+ " _e", generator.getCountQuery("sakila"));
	}

	public void testTypeManager() {
		HQLGenerator.TypeManager mgr = new HQLGenerator.TypeManager() {
			public boolean isComponentPath(String propertyPath, String dbName) {
				if (propertyPath.equals("id") || propertyPath.startsWith("id.")) {
					return true;
				}
				return false;
			}
		};
		generator = new HQLGenerator(FilmActor.class, mgr);
		generator.loadEagerly("id");
		generator.addSelection("id.actorId", "=1");
		generator.addSelection("id.actor.lastName", "=2");
		generator.addSelection("id.foo.blah", "=3");
		assertEquals(
				"select _e from com.wavemaker.runtime.data.sample.sakila.FilmActor _e where _e.id.actorId =1 and _e.id.actor.lastName =2 and _e.id.foo.blah =3",
				generator.getQuery("sakila"));
	}
}
