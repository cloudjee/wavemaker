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
import static org.junit.Assert.fail;

import java.util.Collection;
import java.util.List;

import org.hibernate.LazyInitializationException;
import org.junit.Test;

import com.wavemaker.runtime.data.DefaultTaskManager;
import com.wavemaker.runtime.data.Task;
import com.wavemaker.runtime.data.sample.sakila.Actor;
import com.wavemaker.runtime.data.sample.sakila.Address;
import com.wavemaker.runtime.data.sample.sakila.City;
import com.wavemaker.runtime.data.sample.sakila.Country;
import com.wavemaker.runtime.data.sample.sakila.Customer;
import com.wavemaker.runtime.data.sample.sakila.Film;
import com.wavemaker.runtime.data.sample.sakila.FilmActor;
import com.wavemaker.runtime.data.sample.sakila.FilmCategory;
import com.wavemaker.runtime.service.Filter;
import com.wavemaker.runtime.service.PagingOptions;
import com.wavemaker.runtime.service.PropertyOptions;
import com.wavemaker.runtime.service.TypedServiceReturn;
import com.wavemaker.runtime.service.response.LiveDataServiceResponse;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class TestReadOperation extends BaseCRUDServiceTest {

    private final Task readTask = DefaultTaskManager.getInstance().getReadTask();

    @Test public void testReadTaskNoInput() {

        try {
            sakila.getDataServiceManager().invoke(readTask);
            fail();
        } catch (IllegalArgumentException ex) {
        }
        try {
            sakila.getDataServiceManager().invoke(readTask, (Object[]) null);
            fail();
        } catch (IllegalArgumentException ex) {
        }

        try {
            sakila.getDataServiceManager().invoke(readTask, new Object[] {});
            fail();
        } catch (IllegalArgumentException ex) {
        }
    }

    @SuppressWarnings("unchecked")
    @Test public void testReadTaskRootClass() {
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, City.class);
        List<City> cities = (List<City>) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        assertEquals(600, cities.size());

        City c = cities.get(0);
        try {
            c.getCountry().getCountry();
            fail();
        } catch (LazyInitializationException ex) {
        }
    }

    @Test public void testReadTaskInstance() {
        try {
            sakila.getDataServiceManager().invoke(readTask, null, new City());
            fail();
        } catch (IllegalArgumentException ex) {
            // cityId must be set
        }
    }

    @SuppressWarnings("unchecked")
    @Test public void testRootClassEager() {
        PropertyOptions po = new PropertyOptions();
        po.getProperties().add("country");
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, City.class, null, po);
        List<City> cities = (List<City>) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        assertEquals(600, cities.size());

        City c = cities.get(0);
        try {
            c.getCountry().getCountry();
        } catch (LazyInitializationException ex) {
            fail("Expected Country to be loaded eagerly");
        }
    }

    @SuppressWarnings("unchecked")
    @Test public void testRootClassFilter() {
        PropertyOptions po = new PropertyOptions();
        po.getFilterList().add(Filter.newInstance("country.country=Argentina"));
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, City.class, null, po);
        List<City> cities = (List<City>) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        assertEquals(13, cities.size());

        City c = cities.get(0);
        try {
            c.getCountry().getCountry();
            fail();
        } catch (LazyInitializationException ex) {

        }
    }

    @SuppressWarnings("unchecked")
    @Test public void testRootClassFilter2() {
        PropertyOptions po = new PropertyOptions();
        po.getFilterList().add(Filter.newInstance("length=50"));
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, Film.class, null, po);
        List<Film> films = (List<Film>) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        assertEquals(9, films.size());

        Film f = films.get(0);
        try {
            f.getFilmActors().size();
            fail();
        } catch (LazyInitializationException ex) {
        }
    }

    @SuppressWarnings("unchecked")
    @Test public void testRootClassFilter3() {
        PropertyOptions po = new PropertyOptions();
        po.getFilterList().add(Filter.newInstance("length=51"));
        po.getFilterList().add(
                Filter.newInstance("filmActors.actor.lastName=Wood"));
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, Film.class, null, po);
        List<Film> films = (List<Film>) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        assertEquals(1, films.size());

        Film f = films.get(0);
        try {
            f.getFilmActors().size();
            fail();
        } catch (LazyInitializationException ex) {
        }
    }

    @SuppressWarnings("unchecked")
    @Test public void testRootClassFilterWithEager() {
        PropertyOptions po = new PropertyOptions();
        po.getProperties().add("country");
        po.getFilterList().add(Filter.newInstance("country.country=Argentina"));
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, City.class, null, po);
        List<City> cities = (List<City>) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        assertEquals(13, cities.size());

        City c = cities.get(0);
        try {
            c.getCountry().getCountry();
        } catch (LazyInitializationException ex) {
            fail();
        }
    }

    @SuppressWarnings("unchecked")
    @Test public void testFilterLikeCaseInsensitive() {
        PropertyOptions po = new PropertyOptions();
        po.setIgnoreCase(true);
        po.getProperties().add("country");

        // default match mode is starts with
        po.getFilterList().add(Filter.newInstance("country.country=aRgEnT"));

        PagingOptions pa = new PagingOptions();
        pa.addAscOrder("country");

        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, City.class, null, po,
                        pa);
        List<City> cities = (List<City>) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        assertEquals(13, cities.size());

        City c = cities.get(0);
        try {
            c.getCountry().getCountry();
        } catch (LazyInitializationException ex) {
            fail();
        }
    }

    @SuppressWarnings("unchecked")
    @Test public void testFilterLike() {
        PropertyOptions po = new PropertyOptions();
        po.getProperties().add("country");

        // default match mode is starts with
        po.getFilterList().add(Filter.newInstance("country.country=Argent"));

        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, City.class, null, po);
        List<City> cities = (List<City>) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        assertEquals(13, cities.size());

        City c = cities.get(0);
        try {
            c.getCountry().getCountry();
        } catch (LazyInitializationException ex) {
            fail();
        }
    }

    @Test public void testMatchMode() {
        PropertyOptions po = new PropertyOptions();
        po.getProperties().add("country");
        po.getFilterList().add(Filter.newInstance("country.country=rgentina"));
        po.setMatchMode("end");
        verifyArgentina(po);

        po = new PropertyOptions();
        po.getProperties().add("country");
        po.getFilterList().add(Filter.newInstance("country.country=argentin"));
        po.setMatchMode("start");
        verifyArgentina(po);

        po = new PropertyOptions();
        po.getProperties().add("country");
        po.getFilterList().add(Filter.newInstance("country.country=rgentin"));
        po.setMatchMode("anywhere");
        verifyArgentina(po);

        po = new PropertyOptions();
        po.getProperties().add("country");
        po.getFilterList().add(Filter.newInstance("country.country=argentina"));
        po.setMatchMode("exact");
        verifyArgentina(po);
    }

    @Test public void testLoadRelatedToOne() {
        PropertyOptions po = new PropertyOptions();
        po.getProperties().add("country");
        City city = new City();
        city.setCityId(Short.valueOf("11"));
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, null, city, po);
        city = (City) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        assertEquals(Short.valueOf("11"), city.getCityId());
        Country country = city.getCountry();
        assertEquals("United States", country.getCountry());
    }

    @SuppressWarnings("unchecked")
    @Test public void testLoadRelatedToMany() {
        PropertyOptions po = new PropertyOptions();
        po.getProperties().add("cities");
        Country country = new Country();
        country.setCountryId(Short.valueOf("2"));
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, null, country, po);
        country = (Country) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();

        Collection<City> cities = country.getCities();
        try {
            assertEquals(3, cities.size());
        } catch (LazyInitializationException ex) {
            fail();
        }
    }

    @SuppressWarnings("unchecked")
    @Test public void testPaging() {
        PropertyOptions po = new PropertyOptions();
        po.getProperties().add("country");
        PagingOptions pa = new PagingOptions();
        pa.setFirstResult(Long.valueOf("1"));
        pa.setMaxResults(Long.valueOf("10"));
        pa.addAscOrder("city");
        pa.addDescOrder("country.country");
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, City.class, po, pa);
        List<City> cities = (List<City>) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();

        assertEquals(10, cities.size());
        assertEquals(600, ((LiveDataServiceResponse)resp.getReturnValue()).getDataSetSize());

        for (City c : cities) {
            try {
                c.getCountry().getCountry();
            } catch (LazyInitializationException ex) {
                fail();
            }
        }
    }

    @SuppressWarnings("unchecked")
    @Test public void testOrderByMAV1542() {
        PropertyOptions po = new PropertyOptions();
        po.getProperties().add("country");
        PagingOptions pa = new PagingOptions();
        pa.setFirstResult(Long.valueOf("1"));
        pa.setMaxResults(Long.valueOf("10"));
        pa.addDescOrder("country.country");
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, City.class, po, pa);
        List<City> cities = (List<City>) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();

        assertEquals(10, cities.size());
        assertEquals(600, ((LiveDataServiceResponse)resp.getReturnValue()).getDataSetSize());

        for (City c : cities) {
            try {
                c.getCountry().getCountry();
            } catch (LazyInitializationException ex) {
                fail();
            }
        }
    }

    @Test public void testInstanceWithPkSet() {
        City city = new City();
        city.setCityId(Short.valueOf("1"));
        PropertyOptions po = new PropertyOptions();
        PagingOptions pa = new PagingOptions();
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, City.class, city, po,
                        pa);
        city = (City) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();

        assertEquals(Short.valueOf("1"), city.getCityId());
    }

    @SuppressWarnings("unchecked")
    @Test public void testOuterJoinToOne() {
        PropertyOptions po = new PropertyOptions();
        po.getProperties().add("city.country");
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, Address.class, null,
                        po);
        List<Address> addresses = (List<Address>) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        assertEquals(604, addresses.size());
    }

    @Test public void testOuterJoinInstance() {
        Customer c = new Customer();
        c.setCustomerId(Short.valueOf("600"));
        PropertyOptions po = new PropertyOptions();
        po.getProperties().add("address");
        po.getProperties().add("address.city");
        po.getProperties().add("address.city.country");
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager()
                .invoke(readTask, Customer.class, c, po);
        c = (Customer) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        assertEquals(null, c.getAddress().getCity());
    }

    @Test public void testReadCustomer() {
        PropertyOptions po = new PropertyOptions();
        po.getProperties().add("address");
        po.getProperties().add("address.city");
        po.getProperties().add("address.city.country");
        Customer c = new Customer();
        c.setCustomerId(Short.valueOf("2"));
        c.setActive(true);
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager()
                .invoke(readTask, Customer.class, c, po);
        c = (Customer) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        Country co = c.getAddress().getCity().getCountry();
        assertEquals(Short.valueOf("103"), co.getCountryId());
    }

    @SuppressWarnings("unchecked")
    @Test public void testComponentType() {
        PropertyOptions po = new PropertyOptions();
        po.getProperties().add("id");
        po.getProperties().add("id.actorId");
        po.getFilterList().add(Filter.newInstance("id.filmId=87"));
        po.getFilterList().add(Filter.newInstance("id.actorId=3"));
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, FilmActor.class,
                        null, po);
        List<FilmActor> l = (List<FilmActor>) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        assertEquals(1, l.size());
    }

    @SuppressWarnings("unchecked")
    @Test public void testComponentType2() {
        PropertyOptions po = new PropertyOptions();
        po.getProperties().add("film.filmActors.id");
        po.getProperties().add("film.filmActors.id.actorId");
        po.getFilterList().add(
                Filter.newInstance("film.filmActors.id.filmId=87"));
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, FilmCategory.class,
                        null, po);
        List<FilmActor> l = (List<FilmActor>) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        assertEquals(1, l.size());
    }

    @SuppressWarnings("unchecked")
    @Test public void testFilterEmptyString() {
        PropertyOptions po = new PropertyOptions();
        po.getFilterList().add(Filter.newInstance("lastName="));
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager()
                .invoke(readTask, Actor.class, null, po);
        List<Actor> l = (List<Actor>) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        assertEquals(200, l.size());
    }

    @SuppressWarnings("unchecked")
    private void verifyArgentina(PropertyOptions po) {
        TypedServiceReturn resp = (TypedServiceReturn) sakila
                .getDataServiceManager().invoke(readTask, City.class, null, po);
        List<City> cities = (List<City>) ((LiveDataServiceResponse)resp.getReturnValue()).getResult();
        assertEquals(13, cities.size());

        City c = cities.get(0);
        try {
            c.getCountry().getCountry();
        } catch (LazyInitializationException ex) {
            fail();
        }
    }
}
