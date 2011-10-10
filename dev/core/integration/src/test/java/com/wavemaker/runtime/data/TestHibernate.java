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

package com.wavemaker.runtime.data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.hibernate.Criteria;
import org.hibernate.EmptyInterceptor;
import org.hibernate.EntityMode;
import org.hibernate.Hibernate;
import org.hibernate.Interceptor;
import org.hibernate.LockMode;
import org.hibernate.Query;
import org.hibernate.ScrollableResults;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Example;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.metadata.ClassMetadata;
import org.hibernate.type.Type;

import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.runtime.data.sample.sakila.CityInfo;
import com.wavemaker.runtime.data.sample.sakila.ExtendedCountry;
import com.wavemaker.runtime.data.sample.sakila.TestActor;
import com.wavemaker.runtime.data.sample.sakila.TestCity;
import com.wavemaker.runtime.data.sample.sakila.TestCustomer;
import com.wavemaker.runtime.data.sample.sakila.TestStore;

/**
 * Tests Hibernate directly without using any wm infrastucture.
 * 
 */
@SuppressWarnings("unchecked")
public class TestHibernate extends BaseHibernateTest {

    public void testPagingWithScrollableResultSet() {
        Query q = session.createQuery("from TestActor where lastName like 'A%'");

        int pageSize = 5;

        // q.setMaxResults(pageSize);

        List actors = new ArrayList(pageSize);

        ScrollableResults sr = q.scroll();

        int i = 0;
        while (sr.next() && i < pageSize) {
            actors.add(sr.get(0));
            i++;
        }

        assertEquals(actors.size(), 5);

        sr.last();
        assertEquals(7, sr.getRowNumber() + 1);

        sr.close();
    }

    public void testFkAccess() {
        TestCity c = (TestCity) session.get(TestCity.class, Short.valueOf("2"));
        session.close();
        assertEquals(Short.valueOf("82"), c.getCountryId());
    }

    public void testMultipleReturnTypes() {
        Query q = session.createQuery("from TestCity c join c.country");
        Type[] types = q.getReturnTypes();
        assertEquals(2, types.length);
        assertEquals(TestCity.class, types[0].getReturnedClass());
        assertEquals(ExtendedCountry.class, types[1].getReturnedClass());

        List<Object[]> l = getCitiesAndCountries();
        TestCity c = (TestCity) l.get(0)[0];
        ExtendedCountry ec = (ExtendedCountry) l.get(0)[1];
        assertTrue(ec == c.getCountry());
    }

    private List<Object[]> getCitiesAndCountries() {
        Query q = session.createQuery("from TestCity c join c.country");
        return q.list();
    }

    public void testTypes() {
        assertTrue(Hibernate.INTEGER.getReturnedClass() == Integer.class);
        assertTrue(Hibernate.LONG.getReturnedClass() == Long.class);
        assertTrue(Hibernate.SHORT.getReturnedClass() == Short.class);
        assertTrue(Hibernate.FLOAT.getReturnedClass() == Float.class);
        assertTrue(Hibernate.DOUBLE.getReturnedClass() == Double.class);
        assertTrue(Hibernate.BIG_INTEGER.getReturnedClass() == BigInteger.class);
        assertTrue(Hibernate.BIG_DECIMAL.getReturnedClass() == BigDecimal.class);
        assertTrue(Hibernate.CHARACTER.getReturnedClass() == Character.class);
        assertTrue(Hibernate.STRING.getReturnedClass() == String.class);
        assertTrue(Hibernate.BYTE.getReturnedClass() == Byte.class);
        assertTrue(Hibernate.BOOLEAN.getReturnedClass() == Boolean.class);
        assertTrue(Hibernate.YES_NO.getReturnedClass() == Boolean.class);
        assertTrue(Hibernate.TRUE_FALSE.getReturnedClass() == Boolean.class);

        assertTrue(Hibernate.DATE.getReturnedClass() == java.util.Date.class);
        assertTrue(Hibernate.TIME.getReturnedClass() == java.util.Date.class);
        assertTrue(Hibernate.TIMESTAMP.getReturnedClass() == java.util.Date.class);
        assertTrue(Hibernate.CALENDAR.getReturnedClass() == java.util.Calendar.class);
        assertTrue(Hibernate.CALENDAR_DATE.getReturnedClass() == java.util.Calendar.class);

        assertTrue(Hibernate.CHARACTER_ARRAY.getReturnedClass().isArray());
        assertTrue(Hibernate.CHARACTER_ARRAY.getReturnedClass().getComponentType() == Character.class);
        assertTrue(Hibernate.CHAR_ARRAY.getReturnedClass().isArray());
        assertTrue(Hibernate.CHAR_ARRAY.getReturnedClass().getComponentType() == char.class);
        assertTrue(Hibernate.BINARY.getReturnedClass().isArray());
        assertTrue(Hibernate.BINARY.getReturnedClass().getComponentType() == byte.class);
        assertTrue(Hibernate.TEXT.getReturnedClass() == String.class);
        assertTrue(Hibernate.CLOB.getReturnedClass() == java.sql.Clob.class);
        assertTrue(Hibernate.BLOB.getReturnedClass() == java.sql.Blob.class);
        assertTrue(Hibernate.SERIALIZABLE.getReturnedClass() == Serializable.class);

        assertTrue(Hibernate.CLASS.getReturnedClass() == Class.class);
        assertTrue(Hibernate.LOCALE.getReturnedClass() == java.util.Locale.class);
        assertTrue(Hibernate.TIMEZONE.getReturnedClass() == java.util.TimeZone.class);
        assertTrue(Hibernate.CURRENCY.getReturnedClass() == java.util.Currency.class);
    }

    /**
     * N+1 select problem, because default fetching strategy uses lazy loading of related Objects. For a to-many
     * relationship, all related Objects are fetched when the manys (the Collection) is accessed for this first time.
     */

    public void testNPlus1SelectToMany() {
        Transaction tx = session.beginTransaction();
        Query q = session.createQuery("from TestActor");

        List actors = q.list();

        for (int i = 0; i < 3; i++) {
            TestActor a = (TestActor) actors.get(i);
            warn("Actor " + a.getLastName() + "# Films: " + a.getFilmActors().size());
        }

        tx.commit();
    }

    public void testCount() {
        // supported aggregate functions: count, min, max, avg, sum.
        Query q = session.createQuery("select count(a) from TestActor a");
        Long count = (Long) q.uniqueResult();
        assertTrue(count == 200);

        // how about using criteria?
        Integer count2 = (Integer) session.createCriteria(TestActor.class).setProjection(Projections.rowCount()).uniqueResult();
        assertTrue(count2 == 200);
    }

    public void testQBE() {
        TestCity city = new TestCity();
        city.setCity("new");
        Example e = Example.create(city);
        e.ignoreCase().enableLike(MatchMode.ANYWHERE);
        Criteria c = session.createCriteria(TestCity.class);
        c.add(e);
        c.setFirstResult(1);
        c.setMaxResults(1);
        c.addOrder(Order.asc("city"));
        assertTrue(((TestCity) c.list().get(0)).getCity().equals("Newcastle"));

    }

    public void testPaging() {
        assertTrue(session.createQuery("from TestCity").setFirstResult(1).setMaxResults(10).list().size() == 10);
    }

    public void testNPlus1SelectToOne() {
        Transaction tx = session.beginTransaction();
        // n+1 select vs...
        // String hql = "from Customer";
        // ...eager loading
        String hql = "from TestCustomer c join fetch c.address";
        Query q = session.createQuery(hql);

        List customers = q.list();

        for (int i = 0; i < 3; i++) {
            TestCustomer c = (TestCustomer) customers.get(i);
            warn("Customer " + c.getLastName() + " Phone: " + c.getAddress().getPhone());
        }

        tx.commit();
    }

    public void testBindParameterList() {
        Transaction tx = session.beginTransaction();
        String hql = "from TestActor where firstName in (:inList)";
        Query q = session.createQuery(hql);

        Collection names = new ArrayList();
        names.add("ED");
        names.add("NICK");
        q.setParameterList("inList", names);

        List l = q.list();
        assertEquals(l.size(), 6);
        tx.commit();
    }

    /**
     * Using join, can be used for eager loading to resolve the N+1 select problem.
     * 
     * In mapping: fetch="join" | fetch="subselect"
     * 
     */
    public void testJoin() {
        Transaction tx = session.beginTransaction();
        // note - joins are not referencing foreign keys explicitly in the
        // query
        // note2 - implicit join if rel is to-one using '.'.

        // String hql = "select a from Actor a join a.filmActors fa where
        // fa.film.title like :filmName";

        // eager loading is enabled using the "FETCH" keyword
        String hql = "select a from TestActor a join fetch a.filmActors fa where fa.film.title like :filmName";

        Query q = session.createQuery(hql);
        q.setParameter("filmName", "Z%");
        List actors = q.list();

        for (int i = 0; i < 3; i++) {
            TestActor a = (TestActor) actors.get(i);
            warn("Actor " + a.getLastName() + "# Films: " + a.getFilmActors().size());
        }

        tx.commit();
    }

    public void testJoinMultipleProjections() {

        Transaction tx = session.beginTransaction();

        String hql = "select c, c.country from TestCity c";

        Query q = session.createQuery(hql);

        List l = q.list();

        for (Iterator iter = l.iterator(); iter.hasNext();) {
            Object[] o = (Object[]) iter.next();
            TestCity city = (TestCity) o[0];
            ExtendedCountry ec = (ExtendedCountry) o[1];
            warn(city.getCity());
            warn(ec.getCountry());
        }

        tx.commit();
    }

    public void testJoinMultipleProjectionsWithRelation() {

        Transaction tx = session.beginTransaction();

        // get all countries that have cities starting with A
        String hql = "select co, ci from ExtendedCountry co join co.cities ci where ci.city like 'A%'";

        Query q = session.createQuery(hql);

        List l = q.list();

        ExtendedCountry USA = null;

        for (Iterator iter = l.iterator(); iter.hasNext();) {
            Object[] o = (Object[]) iter.next();
            TestCity city = (TestCity) o[1];
            ExtendedCountry ec = (ExtendedCountry) o[0];
            warn(ec.getCountry() + " " + city.getCity());
            if (ec.getCountry().equals("United States")) {
                USA = ec;
            }
        }

        // This returns all cities, ignoring the original join condition
        warn("Cities in USA " + ObjectUtils.map(new String[] { "getCity" }, USA.getCities()));

        List cities = session.createFilter(USA.getCities(), "where city like 'A%'").list();
        warn("Cities in USA starting with A " + ObjectUtils.map(new String[] { "getCity" }, cities));

        tx.commit();
    }

    public void testJoinPojo() {

        Transaction tx = session.beginTransaction();

        List l = session.createQuery("from CityInfo").list();
        warn(l.size());
        for (Iterator iter = l.iterator(); iter.hasNext();) {
            CityInfo i = (CityInfo) iter.next();
            // this doesn't work, the same (city, country) is returned for each
            // row that
            // has the same country as a previous city. In other words, the
            // first
            // (city, country) returned is returned over and over, until the
            // country changes.
            // I think this is because the <id> of CityInfo is the pk of the
            // country table
            // (country_id). So many rows share the same id, hibernate therefore
            // always
            // returns the same object
            warn(i.getCity() + " " + i.getCountry());
        }

        tx.commit();
    }

    public void testJoinPojoWithDynamicInstantiation() {

        Transaction tx = session.beginTransaction();

        List l = session.createQuery("select new CityInfo(c.city, c.country.country) " + "from TestCity c").list();

        warn(l.size());
        for (Iterator iter = l.iterator(); iter.hasNext();) {
            CityInfo i = (CityInfo) iter.next();
            warn(i.getCity() + " " + i.getCountry());
        }

        tx.commit();

    }

    public void testNativeSQL() {

        Transaction tx = session.beginTransaction();

        List l = session.createSQLQuery(
            "select distinct country.country_id, country.country, country.last_update from country, city where city.city like "
                + "'A%' and city.country_id = country.country_id").addEntity(ExtendedCountry.class).list();

        ExtendedCountry c = (ExtendedCountry) l.get(2);

        c.setCountry("foo");

        session.flush();
        tx.rollback();

    }

    public void testEvict() {
        Transaction tx = session.beginTransaction();

        Query q = session.createQuery("from TestCustomer");
        List customers = q.list();

        List customerIds = new ArrayList(customers.size());

        for (Iterator iter = customers.iterator(); iter.hasNext();) {
            customerIds.add(new Short(((TestCustomer) iter.next()).getCustomerId()));
        }

        // no cached objects returned here
        // warn("run query again ");
        // List customers2 = q.list();

        warn("getting customer 2");
        TestCustomer c = (TestCustomer) session.get(TestCustomer.class, (Serializable) customerIds.get(2));
        warn("got " + c.getLastName());

        // evit 3rd customer
        session.evict(customers.get(2));

        warn("getting customer 2 after evict");
        TestCustomer c2 = (TestCustomer) session.get(TestCustomer.class, (Serializable) customerIds.get(2));
        warn("got " + c2.getLastName());

        tx.commit();
    }

    /**
     * Interactions with the first level cache. HQL queries goes to db, but cached instance is returned regardless.
     */
    public void testCacheWithQuery() {

        Transaction tx = session.beginTransaction();

        TestCustomer c = (TestCustomer) session.get(TestCustomer.class, new Short("567"));

        warn("Got customer: " + c.getFirstName());

        assertTrue(session.contains(c));

        TestCustomer c2 = (TestCustomer) session.createQuery("from TestCustomer where customer_id = :customerId").setProperties(c).uniqueResult();

        warn("Got customer again: " + c2.getFirstName());

        assertTrue(session.contains(c2));
        assertTrue(session.contains(c));

        assertTrue(c == c2);

        tx.commit();
    }

    /**
     * Persistent objects - entity instance with a database identity set. Always associated with a persistence context.
     * 
     * Detached objects - persistent object without active persistence context.
     * 
     * Dirty Checking - custom algorith in org.hibernate.Interceptor.
     * 
     * Options for reattaching: - update(): re-attaches and marks object as "dirty". select-before-update may be set in
     * meta data. Object cannot have been loaded into session. - lock(): re-attach. Object is now managed by hibernate
     * again. May do version check for optimistc concurrency. Object cannot have been loaded into session - merge():
     * Merges detaches object with persistent version, returns persistent one.
     * 
     */
    public void testAttach() {

        Transaction tx = session.beginTransaction();

        TestCustomer c = (TestCustomer) session.get(TestCustomer.class, new Short("567"));

        tx.commit();

        tx = session.beginTransaction();

        @SuppressWarnings("unused")
        TestCustomer c2 = (TestCustomer) session.get(TestCustomer.class, new Short("567"));
        try {
            session.update(c);
            // session.lock(c, LockMode.NONE);
        } catch (Exception ex) {
            // cannot update (or lock) an object if one with the same db
            // identity has already been loaded into the session
        }

        // merge doesn't have this restriction
        // c.setFirstName("Ugo"); would cause an update
        c = (TestCustomer) session.merge(c);

        tx.commit();
    }

    /**
     * Optimistic Concurrency check has to use version col when we there's more than one session during a conversation.
     */
    public void testAttachOpCon() {

        Transaction tx = session.beginTransaction();
        TestActor a = (TestActor) session.get(TestActor.class, new Short("191"));
        tx.commit();
        session.close();

        String originalName = a.getLastName();

        session = sessionFactory.openSession();
        tx = session.beginTransaction();
        // re-attach
        session.lock(a, LockMode.NONE);
        // mods have to be made after invoking lock
        a.setLastName("FOO-NAME");
        tx.commit();
        session.close();

        session = sessionFactory.openSession();
        tx = session.beginTransaction();
        session.update(a);
        a.setLastName(originalName);
        tx.commit();

        a.setFirstName("BLAH-NAME");
        a.setLastUpdate(new Date(123456));

        session.close();

        session = sessionFactory.openSession();
        tx = session.beginTransaction();
        try {
            session.merge(a);
            tx.commit();
        } catch (Exception ex) {
            // expected, since lastUpdate has been modified and version
            // check will fail
            info("As expected: " + ex.getMessage());
            tx.rollback();
        } finally {

        }

    }

    public void testAttachRelated() {

        session.beginTransaction();

        TestCity c = (TestCity) session.get(TestCity.class, Short.valueOf("2"));

        session.getTransaction().rollback();

        c.getCountry(); // ok, still not accessing data from related

        // c.getCountry().getCountry(); error because no session

        session = sessionFactory.openSession();

        session.beginTransaction();

        session.lock(c.getCountry(), LockMode.NONE);

        c.getCountry().getCountry();

        session.getTransaction().rollback();
    }

    /**
     * Optimistic Concurrency Check using a timestamp column.
     */
    public void testOptConWithVersion() {

        Transaction tx = session.beginTransaction();

        String originalName = null;

        TestActor a = (TestActor) session.get(TestActor.class, new Short("191"));

        originalName = a.getFirstName();

        a.setFirstName("new-name");
        tx.commit();

        tx = session.beginTransaction();

        a.setFirstName(originalName);

        tx.commit();

    }

    /**
     * Can we query against modified objects?
     * 
     * Yes, running a query seems to force an update, without committing the db transaction. Joel was right.
     * 
     */
    public void testQueryModifiedObject() {

        Transaction tx = session.beginTransaction();

        TestCustomer c = (TestCustomer) session.get(TestCustomer.class, new Short("567"));

        c.setFirstName("NELSON22");

        TestCustomer c2 = (TestCustomer) session.createQuery("from TestCustomer where firstName = :name").setParameter("name", "NELSON22").uniqueResult();

        warn("Query result " + c2 + " " + c2.getFirstName());

        tx.rollback();
    }

    /**
     * Can we query against new objects? Yes.
     */
    public void testQueryNewObject() {

        Transaction tx = session.beginTransaction();

        TestActor a = new TestActor();
        a.setFirstName("Frankie");
        a.setLastName("Fu");

        session.save(a);

        TestActor a2 = (TestActor) session.createQuery("from TestActor where firstName = :first and " + "lastName = :last").setParameter("first",
            "Frankie").setParameter("last", "Fu").uniqueResult();

        warn("Query result " + a2 + " " + a2.getFirstName());

        tx.rollback();
    }

    /**
     * Optimistic Concurrency Check using DB values in where clause.
     * 
     * This test shows one of the complications when using this method for optimistic concurrency checking: default
     * values set by the database are not picked up unless the object is explicitly refreshed. Stale values cause the
     * concurrency check to fail.
     * 
     * The other requirement here is that we always use the same Hibernate session.
     */
    public void testOptConWithDBValues() {

        Transaction tx = session.beginTransaction();

        String originalName = null;

        TestCustomer c = (TestCustomer) session.get(TestCustomer.class, new Short("567"));

        originalName = c.getFirstName();

        c.setFirstName("new-name");
        session.flush();
        tx.commit();

        TestCustomer custCopy = getCustomerCopy(c);

        // refresh is necessary so that last_update is reloaded
        session.refresh(c, LockMode.NONE);

        warn("Diff after refresh:\n" + ObjectUtils.diffObjects(c, custCopy));

        tx = session.beginTransaction();

        c.setFirstName(originalName);

        tx.commit();

    }

    /**
     * Options: specify order-by in meta data, such as: <set name="customers" inverse="true" order-by="last_name asc">
     * 
     * Run an hql query with a join and an order by.
     * 
     * Use a collection filter: session.createFilter - can also be used for paging related objects
     * 
     * 
     */
    public void testOrderRelated() {

        Transaction tx = session.beginTransaction();

        TestStore s = (TestStore) session.get(TestStore.class, new Byte("1"));

        Collection customers = s.getCustomers();

        List l = new ArrayList(customers.size());
        for (Iterator iter = customers.iterator(); iter.hasNext();) {
            l.add(((TestCustomer) iter.next()).getLastName());
        }
        compareOrdering(session.createQuery("select lastName from TestCustomer where store.id=1 order by lastName asc").list(), l);

        // a Filter can be used for ordering, and to provide other restrictions
        customers = session.createFilter(s.getCustomers(), "order by lastName desc").list();

        l = new ArrayList(customers.size());
        for (Iterator iter = customers.iterator(); iter.hasNext();) {
            l.add(((TestCustomer) iter.next()).getLastName());
        }

        compareOrdering(session.createQuery("select lastName from TestCustomer where store.id=1 order by lastName desc").list(), l);

        tx.commit();
    }

    private void compareOrdering(List l1, List l2) {
        assertTrue(l1.size() == l2.size());
        for (int i = 0; i < l1.size(); i++) {
            Object o1 = l1.get(i);
            Object o2 = l2.get(i);
            warn(o1 + " - " + o2);
            if (!o1.equals(o2)) {
                fail("not equal ordering");
            }
        }
    }

    public void testGetUnmodifiedValues() {

        TestInterceptor interceptor = new TestInterceptor();

        Session session = sessionFactory.openSession(interceptor);

        Transaction tx = session.beginTransaction();

        TestActor a = (TestActor) session.createQuery("from TestActor where actor_id=1").uniqueResult();

        a.setFirstName("Matt");
        a.setLastName("Small");

        warn("Original values " + interceptor.getDBValue(a));

        assertTrue(interceptor.getDBValue(a).get("firstName").equals("PENELOPE"));
        session.flush();
        tx.rollback();
        session.close();
        interceptor.close();
    }

    // public void testManualOptConWithNewSession() {
    // TestInterceptor interceptor = new TestInterceptor();
    // Session session = sessionMgr.getSession(interceptor);
    // Transaction tx = session.beginTransaction();
    //
    // // load customer
    // Customer customer = (Customer) session.get(Customer.class, new Short(
    // "1"));
    // sessionMgr.closeSession();
    //
    // // before sending to client, ask service for original values
    // Map originalValues = interceptor.getDBValue(customer);
    //
    // // the client modifies the customer - get a new instance from the
    // // service
    // Customer modifiedCustomer = new Customer();
    //
    // // set system attrs
    // modifiedCustomer.setCustomerId((short) 1);
    //
    // // register(modifiedCustomer)
    // // need to lock() with original values - service can get original values
    // // for this
    // // instance through some ActiveGrid runtime API:
    // // original values =
    // // Runtime.getRuntime().getOriginalValues(modifiedCustomer)
    //
    // // we decided to not actually do this
    //
    // }

    public void testEvictWithInterceptor() {

        TestInterceptor interceptor = new TestInterceptor();
        Session session = sessionFactory.openSession(interceptor);
        Transaction tx = session.beginTransaction();

        Query q = session.createQuery("from TestActor");

        List actors = q.list();

        int total = actors.size();

        for (int i = 0; i < actors.size(); i++) {
            TestActor a = (TestActor) actors.get(i);
            // since this collection is mapped with
            // lazy="extra", calling size() doesn't initialize
            // the collection - so no entities are loaded
            // total += a.getFilmActors().size();
            a.getFilmActors().size();
        }

        q = session.createQuery("from TestActor where firstName like '%JO%'");
        actors = q.list();
        info("additional actors " + actors.size());

        assertTrue(interceptor.getCachedEntities().size() == total && total == session.getStatistics().getEntityCount());

        // evict all
        for (Iterator iter = interceptor.getCachedEntities().iterator(); iter.hasNext();) {
            session.evict(iter.next());
        }

        assertTrue(session.getStatistics().getEntityCount() == 0);

        tx.commit();
        session.close();
    }

    public void testDynamicProperty() {

        Transaction tx = session.beginTransaction();

        List l = session.createQuery("from TestActor order by fullName").list();

        assertTrue(((TestActor) l.get(0)).getFullName().equals("ADAM GRANT"));
        assertTrue(((TestActor) l.get(l.size() - 1)).getFullName().equals("ZERO CAGE"));

        tx.commit();
    }

    public void testExtendedCountryMapping() {

        Transaction tx = session.beginTransaction();

        ExtendedCountry ec = (ExtendedCountry) session.get(ExtendedCountry.class, new Short("1"));

        warn(ec.getInfo());

        tx.rollback();
    }

    public void testDynamicInstantiation() {

        Transaction tx = session.beginTransaction();

        List l = session.createQuery("select new com.wavemaker.runtime.data.TestHibernate$Person(firstName, lastName) from TestCustomer").list();

        for (Iterator iter = l.iterator(); iter.hasNext();) {
            warn(iter.next());
        }

        tx.commit();

    }

    public void testDynamicInstantiation2() {

        Transaction tx = session.beginTransaction();

        Query q = session.createQuery("select new TestActor(actorId, firstName, lastName, lastUpdate) from TestActor");

        // for (Type t : q.getReturnTypes()) {
        // System.out.println(t.getName());
        // }

        List l = q.list();

        for (Iterator iter = l.iterator(); iter.hasNext();) {
            warn(iter.next());
        }

        tx.commit();

    }

    @SuppressWarnings("unused")
    public void testDynamicMapMode() {

        Session session = sessionFactory.openSession();

        Session s = session.getSession(EntityMode.MAP);

        Transaction tx = session.beginTransaction();

        // this query doesn't work with map mode
        // Query q = s.createQuery("from Actor a join fetch a.filmActors fa");
        Query q = s.createQuery("from TestActor a");

        long startTime = System.currentTimeMillis();

        List actors = q.list();

        long queryEndTime = System.currentTimeMillis();

        for (Object o : actors) {
            Map m = (Map) o;
            detach(m);
        }

        long total = System.currentTimeMillis();

        tx.rollback();
    }

    private void detach(Map m) {
        Collection<String> propNames = new HashSet<String>();
        for (Iterator iter = m.entrySet().iterator(); iter.hasNext();) {
            Map.Entry e = (Map.Entry) iter.next();
            if (Map.class.isAssignableFrom(e.getValue().getClass())) {
                detach((Map) e.getValue());
            } else if (!Hibernate.isInitialized(e.getValue())) {
                propNames.add((String) e.getKey());
            }
        }
        for (String propName : propNames) {
            m.remove(propName);
        }
    }

    public void testDistinct() {

        Transaction tx = session.beginTransaction();

        // get all countries that have cities starting with A
        String hql = "select distinct co from ExtendedCountry co join co.cities ci where ci.city like 'A%'";

        Query q = session.createQuery(hql);

        List l = q.list();

        assertTrue(l.size() == 24);

        tx.commit();
    }

    public void testNamedQuery() {
        Transaction tx = session.beginTransaction();

        Query q = session.getNamedQuery("getCountryById");
        q.setParameter("id", Short.valueOf("1"));

        assertTrue(q.list().size() == 1);

        tx.rollback();
    }

    public static class Person {

        private final String firstName;

        private final String lastName;

        public Person(String firstName, String lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
        }

        public void setFirstName(String s) {
        }

        public void setLastName(String s) {
        }

        @Override
        public String toString() {
            return this.firstName + " " + this.lastName;
        }

    }

    private class TestInterceptor extends EmptyInterceptor implements Interceptor {

        private static final long serialVersionUID = 1L;

        private final Set<Object> cachedEntities = new HashSet<Object>();

        private final Map<String, Map> dbValues = new HashMap<String, Map>();

        @Override
        public boolean onLoad(Object entity, Serializable id, Object[] state, String[] propertyNames, Type[] types) {

            // cachedEntities.add(new WeakReference(entity));
            this.cachedEntities.add(entity);

            Map valueMapping = null;

            for (int i = 0; i < propertyNames.length; i++) {
                if (types[i].isCollectionType()) {
                    continue;
                } else if (types[i].isAssociationType()) {
                    continue;
                }

                String keyValue = getKeyValue(entity, id);

                if (valueMapping == null) {
                    valueMapping = new HashMap();

                    if (this.dbValues.containsKey(keyValue)) {
                        // throw new AssertionError(keyValue
                        // + " has already been loaded");
                    } else {
                        this.dbValues.put(keyValue, valueMapping);
                    }
                }

                valueMapping.put(propertyNames[i], state[i]);
            }
            return super.onLoad(entity, id, state, propertyNames, types);
        }

        private Object getKeyValue(Object entity) {
            ClassMetadata m = sessionFactory.getClassMetadata(entity.getClass());
            Serializable id = m.getIdentifier(entity, EntityMode.POJO);
            return getKeyValue(entity, id);
        }

        private String getKeyValue(Object entity, Serializable id) {
            // this is assuming id is a primitive. that is wrong.
            return entity.getClass() + "#" + String.valueOf(id);
        }

        public Map getDBValue(Object entity) {
            return this.dbValues.get(getKeyValue(entity));
        }

        public Set getCachedEntities() {
            return this.cachedEntities;
        }

        public void close() {
            this.cachedEntities.clear();
            this.dbValues.clear();
        }

    }

    private TestCustomer getCustomerCopy(TestCustomer c) {
        TestCustomer rtn = new TestCustomer();
        rtn.setFirstName(c.getFirstName());
        rtn.setLastName(c.getLastName());
        rtn.setCustomerId(c.getCustomerId());
        rtn.setLastUpdate(c.getLastUpdate());
        return rtn;
    }
}
