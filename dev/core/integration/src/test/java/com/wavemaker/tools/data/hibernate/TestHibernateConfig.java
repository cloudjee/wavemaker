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

package com.wavemaker.tools.data.hibernate;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import junit.framework.Test;
import junit.framework.TestSuite;

import org.hibernate.HibernateException;
import org.hibernate.QueryException;
import org.springframework.beans.factory.BeanCreationException;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.ObjectAccess;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.JSONState;
import com.wavemaker.runtime.data.DataServiceTestConstants;
import com.wavemaker.runtime.data.Input;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.server.InternalRuntime;
import com.wavemaker.tools.data.BeanInfo;
import com.wavemaker.tools.data.ColumnInfo;
import com.wavemaker.tools.data.DataModelConfiguration;
import com.wavemaker.tools.data.EntityInfo;
import com.wavemaker.tools.data.ImportDB;
import com.wavemaker.tools.data.PropertyInfo;
import com.wavemaker.tools.data.QueryInfo;
import com.wavemaker.tools.data.RelatedInfo;
import com.wavemaker.tools.data.TypeInfo;
import com.wavemaker.tools.data.util.DataServiceTestUtils;
import com.wavemaker.tools.data.util.DataServiceUtils;
import com.wavemaker.tools.util.AntUtils;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 * 
 */
public class TestHibernateConfig extends WMTestCase {

    private static DataModelConfiguration cfg;

    private static final File serviceCfg;

    private static final File serviceDir;

    private static Collection<String> entityNames = new HashSet<String>();

    public static Test suite() {

        TestSuite testsToRun = new TestSuite();

        /*
         * These tests are disabled in UNIX; when fixing MAV-2098, remove the if statement and the testDummy() method.
         */
        if (SystemUtils.isLinux() || SystemUtils.isMacOSX()) {
            testsToRun.addTest(new TestCreateDataModel("testDummy"));
        } else {
            testsToRun.addTest(new TestCreateDataModel("testDummy"));

            /*
             * disabled to work around test failures; see MAV-2108
             * 
             * when fixing MAV-2180, delete the testDummy above (not the Linux/OS X one), and uncomment the tests below:
             * 
             * 
             * testsToRun.addTest(new TestHibernateConfig("testRenameCountry")); testsToRun.addTest(new
             * TestHibernateConfig("testRenameCity")); testsToRun.addTest(new TestHibernateConfig(
             * "testGenerateAllJavaTypes")); testsToRun.addTest(new TestHibernateConfig("testUpdateColumns"));
             * testsToRun.addTest(new TestHibernateConfig("testAddQueryActorRtn")); testsToRun.addTest(new
             * TestHibernateConfig("testAddQueryLongRtn")); testsToRun.addTest(new TestHibernateConfig(
             * "testAddQuerySyntaxError")); testsToRun.addTest(new TestHibernateConfig( "testRunQuerySyntaxError"));
             * testsToRun.addTest(new TestHibernateConfig( "testAddQueryMultipleRtn")); testsToRun.addTest(new
             * TestHibernateConfig("testColumnInfoActor")); testsToRun.addTest(new TestHibernateConfig(
             * "testColumnInfoFilmActor")); testsToRun.addTest(new TestHibernateConfig("testCompositeFk1"));
             * testsToRun.addTest(new TestHibernateConfig("testCompositeFk2")); testsToRun.addTest(new
             * TestHibernateConfig("testCompositeFk2")); testsToRun.addTest(new TestHibernateConfig(
             * "testGetAndSetConnectionProperties")); testsToRun .addTest(new
             * TestHibernateConfig("testGetColumnsForActor")); testsToRun.addTest(new
             * TestHibernateConfig("testGetEntityInfos")); testsToRun.addTest(new
             * TestHibernateConfig("testGetEntityNames")); testsToRun.addTest(new TestHibernateConfig(
             * "testGetForeignKeyColumnType")); testsToRun.addTest(new TestHibernateConfig(
             * "testGetPropertyNamesForActor")); testsToRun.addTest(new TestHibernateConfig(
             * "testGetPropertyNamesForFilmActor")); testsToRun.addTest(new TestHibernateConfig("testGetQuery"));
             * testsToRun.addTest(new TestHibernateConfig("testGetQueryNames")); testsToRun .addTest(new
             * TestHibernateConfig("testGetCascadeOptions")); testsToRun.addTest(new TestHibernateConfig(
             * "testGetRelatedPropertiesCity")); testsToRun.addTest(new TestHibernateConfig("testGetRelatedToMany"));
             * testsToRun.addTest(new TestHibernateConfig("testGetRelatedToOne")); testsToRun.addTest(new
             * TestHibernateConfig("testGetTypesActor")); testsToRun .addTest(new
             * TestHibernateConfig("testGetTypesFilmActor")); testsToRun.addTest(new
             * TestHibernateConfig("testGetValueTypes")); testsToRun.addTest(new
             * TestHibernateConfig("testPrimaryKeyActor")); testsToRun.addTest(new TestHibernateConfig(
             * "testPrimaryKeyFilmActor")); testsToRun.addTest(new TestHibernateConfig("testRunQuery"));
             * testsToRun.addTest(new TestHibernateConfig("testUpdateQuery")); testsToRun.addTest(new
             * TestHibernateConfig("testUpdateRelToOne")); testsToRun .addTest(new
             * TestHibernateConfig("testSetRefreshEntities")); testsToRun.addTest(new TestHibernateConfig(
             * "testCompositeForeignKey"));
             */
        }

        return testsToRun;
    }

    static {
        entityNames.add("Actor");
        entityNames.add("ActorInfo");
        entityNames.add("Address");
        entityNames.add("Category");
        entityNames.add("City");
        entityNames.add("Country");
        entityNames.add("Customer");
        entityNames.add("CustomerListFixed");
        entityNames.add("Film");
        entityNames.add("FilmActor");
        entityNames.add("FilmCategory");
        entityNames.add("FilmList");
        entityNames.add("FilmText");
        entityNames.add("Inventory");
        entityNames.add("Language");
        entityNames.add("NicerButSlowerFilmList");
        entityNames.add("Payment");
        entityNames.add("Rental");
        entityNames.add("SalesByFilmCategory");
        entityNames.add("SalesByStore");
        entityNames.add("Staff");
        entityNames.add("StaffList");
        entityNames.add("Store");
        entityNames.add("Table1Mav260");
        entityNames.add("Table2Mav260");
        entityNames.add("Varcharpk");
        entityNames.add("Compositepk");
        entityNames.add("Defaults");

        entityNames = Collections.unmodifiableCollection(entityNames);

        try {

            serviceCfg = DataServiceTestUtils.setupSakilaConfiguration();

            serviceDir = serviceCfg.getParentFile();

            cfg = new DataModelConfiguration(serviceCfg);

            SpringUtils.initSpringConfig();

        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public TestHibernateConfig(String testCase) {
        super(testCase);
    }

    public void testDummy() {
    }

    public void testGetEntityNames() {

        Collection<String> names = new HashSet<String>(entityNames);
        for (String e : cfg.getEntityNames()) {
            if (!names.remove(e)) {
                fail("Didn't expect " + e);
            }
        }

        if (!names.isEmpty()) {
            fail("Also expected " + names);
        }
    }

    public void testGetTypesActor() {

        PropertyInfo p = cfg.getProperty("Actor", "actorId");
        assertTrue(p.getType().equals("short"));

        p = cfg.getProperty("Actor", "firstName");
        assertTrue(p.getType().equals("string"));

        p = cfg.getProperty("Actor", "lastName");
        assertTrue(p.getType().equals("string"));

        p = cfg.getProperty("Actor", "lastUpdate");
        assertTrue(p.getType().equals("timestamp"));

        p = cfg.getProperty("Actor", "filmActors");
        assertTrue(p.getType().equals("FilmActor"));
    }

    public void testGetTypesFilmActor() {

        PropertyInfo p = cfg.getProperty("FilmActor", "id");
        assertTrue(p.getType().equals("FilmActorId"));

        p = cfg.getProperty("FilmActor", "film");
        assertTrue(p.getType().equals("Film"));

        p = cfg.getProperty("FilmActor", "actor");
        assertTrue(p.getType().equals("Actor"));

        p = cfg.getProperty("FilmActor", "lastUpdate");
        assertTrue(p.getType().equals("timestamp"));
    }

    public void testPrimaryKeyActor() {
        for (PropertyInfo p : cfg.getProperties("Actor")) {
            if (p.getIsId()) {
                if (!p.getName().equals("actorId")) {
                    fail("Did not get expected id");
                }
                return;
            }
        }
        fail("Did not find an id property");
    }

    public void testColumnInfoFilmActor() {

        ColumnInfo c = cfg.getProperty("FilmActor", "lastUpdate").getColumn();
        assertTrue(c.getName().equals("last_update"));
        assertTrue(c.getLength().equals(19));
        assertTrue(c.getNotNull() == true);

        c = cfg.getProperty("FilmActor", "actor").getColumn();
        assertTrue(c.getName().equals("actor_id"));
        assertTrue(c.getNotNull() == true);

        c = cfg.getProperty("FilmActor", "film").getColumn();
        assertTrue(c.getName().equals("film_id"));
        assertTrue(c.getNotNull() == true);

        for (PropertyInfo p : cfg.getProperty("FilmActor", "id").getCompositeProperties()) {
            if (p.getName().equals("actorId")) {
                assertTrue(p.getColumn().getName().equals("actor_id"));
                assertTrue(p.getColumn().getNotNull() == true);
            }
            if (p.getName().equals("filmId")) {
                assertTrue(p.getColumn().getName().equals("film_id"));
                assertTrue(p.getColumn().getNotNull() == true);
            }
        }
    }

    public void testColumnInfoActor() {

        ColumnInfo c = cfg.getProperty("Actor", "filmActors").getColumn();
        assertTrue(c.getName().equals("actor_id"));

        c = cfg.getProperty("Actor", "lastUpdate").getColumn();
        assertTrue(c.getName().equals("last_update"));
        assertTrue(c.getLength().equals(19));
        assertTrue(c.getNotNull() == true);

        c = cfg.getProperty("Actor", "lastName").getColumn();
        assertTrue(c.getName().equals("last_name"));
        assertTrue(c.getLength().equals(45));
        assertTrue(c.getNotNull() == true);

        c = cfg.getProperty("Actor", "firstName").getColumn();
        assertTrue(c.getName().equals("first_name"));
        assertTrue(c.getLength().equals(45));
        assertTrue(c.getNotNull() == true);

        c = cfg.getProperty("Actor", "actorId").getColumn();
        assertTrue(c.getName().equals("actor_id"));
        assertTrue(c.getGenerator().equals(DataServiceConstants.GENERATOR_IDENTITY));
    }

    public void testPrimaryKeyFilmActor() {
        PropertyInfo pk = null;
        for (PropertyInfo p : cfg.getProperties("FilmActor")) {
            if (p.getIsId()) {
                if (!p.getName().equals("id")) {
                    fail("Did not get expected id");
                }
                pk = p;
                break;
            }
        }

        if (pk == null) {
            fail("Did not find an id property");
        }

        Collection<String> names = new HashSet<String>();
        names.add("filmId");
        names.add("actorId");

        for (PropertyInfo k : pk.getCompositeProperties()) {
            if (!names.remove(k.getName())) {
                fail("Didn't expect " + k.getName());
            }

            assertTrue(k.getType().equals("short"));

        }

        if (!names.isEmpty()) {
            fail("Also expected " + names);
        }
    }

    public void testGetPropertyNamesForActor() {

        Collection<String> names = new HashSet<String>();
        names.add("actorId");
        names.add("firstName");
        names.add("lastName");
        names.add("lastUpdate");
        names.add("filmActors");

        for (String s : cfg.getPropertyNames("Actor")) {
            if (!names.remove(s)) {
                fail("Didn't expect " + s);
            }
        }

        if (!names.isEmpty()) {
            fail("Also expected " + names);
        }
    }

    public void testGetCascadeOptions() {

        PropertyInfo ri = cfg.getProperty("City", "country");

        assertEquals(1, ri.getCascadeOptions().size());
        assertEquals(RelatedInfo.CascadeOption.SaveUpdate, ri.getCascadeOptions().get(0));
    }

    public void testGetColumnsForActor() {

        Collection<String> names = new HashSet<String>();
        names.add("actor_id");
        names.add("first_name");
        names.add("last_name");
        names.add("last_update");

        for (ColumnInfo c : cfg.getColumns("Actor")) {
            if (!names.remove(c.getName())) {
                fail("Didn't expect " + c.getName());
            }
        }

        if (!names.isEmpty()) {
            fail("Also expected " + names);
        }
    }

    public void testGetEntityInfos() {

        Collection<String> names = new HashSet<String>(entityNames);
        for (EntityInfo e : cfg.getEntities()) {
            if (!names.remove(e.getEntityName())) {
                fail("Didn't expect " + e.getEntityName());
            }

            if (e.getEntityName().equals("Film")) {
                assertTrue(e.getTableName().equals("film"));
                assertTrue(e.getCatalogName().equals("sakila"));
                assertTrue(e.getPackageName().equals("com.wavemaker.runtime.data.sample.sakila"));
            }

            if (e.getEntityName().equals("FilmActor")) {
                assertTrue(e.getTableName().equals("film_actor"));
                assertTrue(e.getCatalogName().equals("sakila"));
                assertTrue(e.getPackageName().equals("com.wavemaker.runtime.data.sample.sakila"));
            }
        }

        if (!names.isEmpty()) {
            fail("Also expected " + names);
        }

    }

    public void testGetPropertyNamesForFilmActor() {

        Collection<String> names = new HashSet<String>();
        names.add("id");
        names.add("film");
        names.add("actor");
        names.add("lastUpdate");

        for (String s : cfg.getPropertyNames("FilmActor")) {
            if (!names.remove(s)) {
                fail("Didn't expect " + s);
            }
        }

        if (!names.isEmpty()) {
            fail("Also expected " + names);
        }
    }

    public void testGetRelatedPropertiesCity() {

        Collection<String> names = new HashSet<String>();
        names.add("country");
        names.add("addresses");

        for (PropertyInfo p : cfg.getRelatedProperties("City")) {
            if (!names.remove(p.getName())) {
                fail("Didn't expect " + p.getName());
            }
        }

        if (!names.isEmpty()) {
            fail("Also expected " + names);
        }
    }

    public void testGetForeignKeyColumnType() {

        Map<String, ColumnInfo> m = cfg.getColumnsMap("City");
        ColumnInfo fk = m.get("country_id");
        assertTrue(fk.getIsFk());
        assertTrue(fk.getSqlType().equals("short"));
    }

    public void testGetQueryNames() {

        Collection<?> c = cfg.getQueryNames();

        assertEquals(32, c.size());

        assertTrue(c.contains("getActorById"));
        assertTrue(c.contains("getFilmById"));
        assertTrue(c.contains("getStoreById"));
        assertTrue(!c.contains("getActorCount"));
    }

    public void testGetQuery() {

        QueryInfo q = cfg.getQuery("getActorById");

        Input[] l = q.getInputs();

        assertTrue("Expected 1 input, but got " + l.length, l.length == 1);

        assertTrue(l[0].getParamName().equals("id"));
        assertTrue(l[0].getParamType().equals("java.lang.Short"));
    }

    public void testGetRelatedToOne() {

        RelatedInfo ri = cfg.getRelated("City", "country");

        assertTrue(ri.getName().equals("country"));
        assertTrue(ri.getTableName().equals("city"));
        assertTrue(ri.getRelatedType().equals("Country"));
        assertTrue(ri.cardinality() == RelatedInfo.Cardinality.OneToOne);
        ColumnInfo[] cols = ri.foreignKeyColumns();
        assertTrue(cols.length == 1);
        assertTrue(cols[0].getName().equals("country_id"));
    }

    public void testGetRelatedToMany() {

        RelatedInfo ri = cfg.getRelated("Country", "cities");

        assertTrue(ri.getName().equals("cities"));
        assertTrue(ri.getTableName().equals("city"));
        assertTrue(ri.getRelatedType().equals("City"));
        assertTrue(ri.cardinality() == RelatedInfo.Cardinality.OneToMany);
        ColumnInfo[] cols = ri.foreignKeyColumns();
        assertTrue(cols.length == 1);
        assertTrue(cols[0].getName().equals("country_id"));
    }

    public void testGetValueTypes() {

        Collection<String> names = new HashSet<String>();
        names.add("com.wavemaker.runtime.data.sample.sakila.ActorInfoId");
        names.add("com.wavemaker.runtime.data.sample.sakila.NicerButSlowerFilmListId");
        names.add("com.wavemaker.runtime.data.sample.sakila.SalesByFilmCategoryId");
        names.add("com.wavemaker.runtime.data.sample.sakila.SalesByStoreId");
        names.add("com.wavemaker.runtime.data.sample.sakila.FilmListId");
        names.add("com.wavemaker.runtime.data.sample.sakila.FilmCategoryId");
        names.add("com.wavemaker.runtime.data.sample.sakila.StaffListId");
        names.add("com.wavemaker.runtime.data.sample.sakila.FilmActorId");
        names.add("com.wavemaker.runtime.data.sample.sakila.Table1Mav260Id");
        names.add("com.wavemaker.runtime.data.sample.sakila.CompositepkId");
        names.add("com.wavemaker.runtime.data.sample.sakila.CustomerListId");

        for (TypeInfo vti : cfg.getValueTypes()) {
            if (!names.remove(vti.getFullyQualifiedName())) {
                fail("Got unexpected " + vti.getFullyQualifiedName());
            }
        }

        assertTrue(names.isEmpty());
    }

    public void testGetAndSetConnectionProperties() {

        Properties org = cfg.readConnectionProperties();

        Properties p = new Properties();
        p.setProperty("testkey", "testvalue");
        p.setProperty("connectionUrl", "jdbc:mysql://localhost:3306");
        cfg.writeConnectionProperties(p);
        Properties p2 = cfg.readConnectionProperties();
        assertTrue(p2.getProperty("testkey").equals("testvalue"));

        cfg.writeConnectionProperties(org);
    }

    @SuppressWarnings("unchecked")
    public void testRunQuery() throws Throwable {

        // Spring should do this...
        InternalRuntime.setInternalRuntimeBean(new InternalRuntime());
        InternalRuntime.getInstance().setJSONState(new JSONState());

        Object o = cfg.runQuery("select new Actor(a.actorId, a.firstName, a.lastName, a.lastUpdate) from Actor a order by a.lastName",
            new Input[] {}, "", null);

        assertTrue(o instanceof List);

        Object actor = ((List) o).get(0);

        Method m = actor.getClass().getMethod("getLastName");
        assertEquals("AKROYD", m.invoke(actor, (Object[]) null));

        m = actor.getClass().getMethod("getFirstName");
        assertEquals("CHRISTIAN", m.invoke(actor, (Object[]) null));
    }

    public void testUpdateColumns() {

        cfg = new DataModelConfiguration(serviceCfg);

        try {

            // force writing of original Actor java src
            // so we can revert to it at the end
            // of the test
            cfg.touchEntity("Actor");
            cfg.save();

            Map<String, ColumnInfo> m = cfg.getColumnsMap("Actor");

            ColumnInfo c = (ColumnInfo) m.get("actor_id").clone();
            c.setName("foo_col");
            m.put("actor_id", c);

            List<ColumnInfo> cl = new ArrayList<ColumnInfo>(m.size());

            for (ColumnInfo ci : m.values()) {
                cl.add(ci);
            }

            assertTrue(cfg.getModifiedFiles().size() == 0);

            // pass mapped properties for columns to preserve property names
            List<PropertyInfo> properties = new ArrayList<PropertyInfo>(cfg.getProperties("Actor"));

            cfg.updateColumns("Actor", cl, properties);

            assertTrue(cfg.getModifiedFiles().size() == 1);

            assertTrue(cfg.getModifiedFiles().get(0).endsWith("Actor.hbm.xml"));

            // since we renamed the id column, the getActorById query is not
            // valid
            // anymore
            cfg.deleteQuery("getActorById");

            cfg.save(true);

            DataModelConfiguration cfg2 = new DataModelConfiguration(serviceCfg);

            Collection<String> names = new HashSet<String>();
            names.add("foo_col");
            names.add("first_name");
            names.add("last_name");
            names.add("last_update");

            for (ColumnInfo c3 : cfg2.getColumns("Actor")) {
                if (!names.remove(c3.getName())) {
                    fail("Didn't expect " + c.getName());
                }
            }

            if (!names.isEmpty()) {
                fail("Also expected " + names);
            }

        } finally {
            cfg.revert(true);
        }

    }

    public void testUpdateRelToOne() {

        cfg = new DataModelConfiguration(serviceCfg);

        try {

            // generate original City and Country java src
            cfg.touchEntity("City");
            cfg.touchEntity("Country");
            cfg.save();

            RelatedInfo r = (RelatedInfo) cfg.getRelated("City", "country").clone();

            r.setName("blah");
            r.setColumnNames(new String[] { "city" });

            assertTrue(cfg.getModifiedFiles().size() == 0);

            List<RelatedInfo> l = new ArrayList<RelatedInfo>(1);
            l.add(r);
            cfg.updateRelated("City", l);

            assertTrue(cfg.getModifiedFiles().size() == 2);

            List<String> l2 = new ArrayList<String>(cfg.getModifiedFiles());
            Collections.sort(l2);

            assertTrue(l2.get(0).endsWith("City.hbm.xml"));
            assertTrue(l2.get(1).endsWith("Country.hbm.xml"));

            // since we renamed country, the following queries are not
            // valid anymore
            cfg.deleteQuery("testLoadCityAndCountryAndAddresses");
            cfg.deleteQuery("testLoadCityAndCountryAndCities");

            cfg.save(true);

            DataModelConfiguration cfg2 = new DataModelConfiguration(serviceCfg);

            Collection<RelatedInfo> rels = cfg2.getRelated("City");
            assertTrue(rels.size() == 2); // one inverse one was already there
            boolean found = false;
            for (RelatedInfo r2 : rels) {
                if (r2.getCardinality() == RelatedInfo.Cardinality.OneToOne.toString()) {
                    found = true;
                    assertEquals(r2.getName(), "blah");
                    assertEquals(r2.getColumnNames()[0], "city");
                }
            }
            assertTrue(found);

            Collection<String> cityProperties = new HashSet<String>();
            cityProperties.add("cityId");
            cityProperties.add("lastUpdate");
            cityProperties.add("addresses");
            cityProperties.add("blah");
            cityProperties.add("country_id");

            // city is gone - it has become the foreign key col
            for (String s : cfg2.getPropertyNames("City")) {
                if (!cityProperties.remove(s)) {
                    fail("Didn't expect " + s);
                }
            }

            if (!cityProperties.isEmpty()) {
                fail("Also expected " + cityProperties);
            }

        } finally {
            cfg.revert();
        }

    }

    public void testAddQueryActorRtn() {

        cfg = new DataModelConfiguration(serviceCfg);

        try {

            String name = "getActorz";
            String query = "from Actor where lastName like :lastName";

            QueryInfo qi = new QueryInfo(name, query, true, false);
            qi.setOutputType(cfg.getDataPackage() + ".Actor");
            qi.addInput("lastName", "java.lang.String", Boolean.FALSE);

            assertTrue(cfg.getModifiedFiles().size() == 0);

            cfg.updateQuery(qi);

            assertTrue(cfg.getModifiedFiles().size() == 1);

            assertTrue(cfg.getModifiedFiles().get(0).endsWith("default.crud.hql.xml"));

            cfg.save(true);

            DataModelConfiguration cfg2 = new DataModelConfiguration(serviceCfg);
            QueryInfo qi2 = cfg2.getQuery(name);
            assertTrue(qi2.getName().equals(name));
            assertTrue(qi2.getQuery().equals(query));
            assertTrue(!qi2.getReturnsSingleResult());
            assertTrue(qi2.getIsHQL());
            assertTrue(qi2.getInputs().length == 1);
            assertTrue(qi2.getInputs()[0].getParamName().equals("lastName"));
            assertTrue(qi2.getInputs()[0].getParamType().equals("java.lang.String"));

            genServiceClass();
            cleanupServiceClass(true);

        } finally {
            cfg.revert();
            cleanupServiceClass(false);
        }
    }

    public void testAddQueryLongRtn() throws Exception {
        cfg = new DataModelConfiguration(serviceCfg);

        try {

            String name = "getActorTotal";
            String query = "select count(_a) from Actor _a";

            QueryInfo qi = new QueryInfo(name, query, true, false);
            qi.setOutputType("java.lang.Long");
            qi.setReturnsSingleResult(true);

            assertTrue(cfg.getModifiedFiles().size() == 0);

            cfg.updateQuery(qi);

            assertTrue(cfg.getModifiedFiles().size() == 1);
            assertTrue(cfg.getModifiedFiles().get(0).endsWith("default.crud.hql.xml"));

            cfg.save(true);

            DataModelConfiguration cfg2 = new DataModelConfiguration(serviceCfg);

            QueryInfo qi2 = cfg2.getQuery(name);
            assertTrue(qi2.getName().equals(name));
            assertTrue(qi2.getQuery().equals(query));
            assertTrue(qi2.getIsHQL());

            genServiceClass();
            cleanupServiceClass(true);
        } finally {
            cfg.revert();
            cleanupServiceClass(false);
        }
    }

    // MAV-1585
    public void testAddQuerySyntaxError() throws Exception {

        cfg = new DataModelConfiguration(serviceCfg);

        String query = "from Actor where a=";

        try {
            cfg.checkQuery(query, new Input[] {}, null);
            fail("Expected Exception to be thrown");
        } catch (RuntimeException ex) {
            assertTrue(ex instanceof QueryException);
        }

        QueryInfo qi = new QueryInfo("foo", query, true, false);
        qi.setOutputType("java.lang.Long");
        qi.setReturnsSingleResult(true);

        assertTrue(cfg.getModifiedFiles().size() == 0);

        cfg.updateQuery(qi);

        assertTrue(cfg.getModifiedFiles().size() == 1);
        assertTrue(cfg.getModifiedFiles().get(0).endsWith("default.crud.hql.xml"));

        try {

            cfg.save(true);

            fail("Expected Exception to be thrown");

        } catch (RuntimeException ex) {
            assertTrue(ex instanceof BeanCreationException);
            Throwable th = SystemUtils.getRootException(ex);
            // we can't get to the underlying QueryException
            assertTrue(th instanceof HibernateException);
        } finally {
            cfg.revert();
        }
    }

    public void testRunQuerySyntaxError() throws Throwable {

        try {
            cfg.runQuery("from Actor where a=", new Input[] {}, null, 0L);
            fail("Expected Exception to be thrown");
        } catch (RuntimeException ex) {
            assertTrue(ex instanceof QueryException);
        }
    }

    public void testAddQueryMultipleRtn() throws Exception {

        cfg = new DataModelConfiguration(serviceCfg);

        try {

            String name = "getActorFirstAndLastName";
            String query = "select firstName as name1, lastName as name2 from Actor";

            QueryInfo qi = new QueryInfo(name, query, true, false);
            qi.setReturnsSingleResult(false);

            assertTrue(cfg.getModifiedFiles().size() == 0);

            cfg.updateQuery(qi);

            assertTrue(cfg.getModifiedFiles().size() == 1);
            assertTrue(cfg.getModifiedFiles().get(0).endsWith("default.crud.hql.xml"));

            cfg.save(true);

            // check we generated wrapper class
            Collection<BeanInfo> wrappers = cfg.getOtherTypes();
            assertEquals(2, wrappers.size());

            DataModelConfiguration cfg2 = new DataModelConfiguration(serviceCfg);

            QueryInfo qi2 = cfg2.getQuery(name);
            assertTrue(qi2.getName().equals(name));
            assertTrue(qi2.getQuery().equals(query));
            assertTrue(qi2.getIsHQL());

            genServiceClass();
            cleanupServiceClass(true);

            String type = com.wavemaker.runtime.data.util.DataServiceUtils.getOutputType(cfg2.getDataPackage(), name);

            File wrapper = new File(serviceDir, StringUtils.classNameToSrcFilePath(type));

            assertTrue(wrapper.exists());

            AntUtils.javac(wrapper.getParent(), serviceDir);

            File classFile = new File(serviceDir, StringUtils.classNameToClassFilePath(type));

            assertTrue(classFile.exists());

            ClassLoader cl = ClassLoaderUtils.getClassLoaderForFile(serviceDir);

            Class<?> wrapperClass = Class.forName(type, true, cl);

            ObjectAccess oa = ObjectAccess.getInstance();

            assertTrue(oa.hasProperty(wrapperClass, "name1"));
            assertTrue(oa.hasProperty(wrapperClass, "name2"));
            assertFalse(oa.hasProperty(wrapperClass, "firstName"));
            assertFalse(oa.hasProperty(wrapperClass, "lastName"));

        } finally {
            cfg.revert();
            cleanupServiceClass(false);
            IOUtils.deleteRecursive(new File(serviceDir, StringUtils.packageToSrcFilePath(cfg.getOutputPackage())));
        }
    }

    // MAV-1910
    public void testAddQuerySelectToMany() throws Exception {

        cfg = new DataModelConfiguration(serviceCfg);

        try {

            String name = "getSwissCities";
            String query = "select cities from Country c where c.id=91";

            QueryInfo qi = new QueryInfo(name, query, true, false);
            qi.setReturnsSingleResult(true);

            assertTrue(cfg.getModifiedFiles().size() == 0);

            cfg.updateQuery(qi);

            assertTrue(cfg.getModifiedFiles().size() == 1);
            assertTrue(cfg.getModifiedFiles().get(0).endsWith("default.crud.hql.xml"));

            cfg.save(true);

            // check we generated wrapper class
            Collection<BeanInfo> wrappers = cfg.getOtherTypes();
            assertEquals(2, wrappers.size());

            DataModelConfiguration cfg2 = new DataModelConfiguration(serviceCfg);

            QueryInfo qi2 = cfg2.getQuery(name);
            assertTrue(qi2.getName().equals(name));
            assertTrue(qi2.getQuery().equals(query));
            assertTrue(qi2.getIsHQL());

            genServiceClass();
            cleanupServiceClass(true);

            String type = com.wavemaker.runtime.data.util.DataServiceUtils.getOutputType(cfg2.getDataPackage(), name);

            File wrapper = new File(serviceDir, StringUtils.classNameToSrcFilePath(type));

            assertTrue(wrapper.exists());

            AntUtils.javac(wrapper.getParent(), serviceDir);

            File classFile = new File(serviceDir, StringUtils.classNameToClassFilePath(type));

            assertTrue(classFile.exists());

            ClassLoader cl = ClassLoaderUtils.getClassLoaderForFile(serviceDir);

            Class<?> wrapperClass = Class.forName(type, true, cl);

            ObjectAccess oa = ObjectAccess.getInstance();

            // default name if no alias was used
            assertTrue(oa.hasProperty(wrapperClass, "c0"));
            assertTrue(oa.getPropertyType(wrapperClass, "c0").getName().endsWith(".City"));
        } finally {
            cfg.revert();
            cleanupServiceClass(false);
            IOUtils.deleteRecursive(new File(serviceDir, StringUtils.packageToSrcFilePath(cfg.getOutputPackage())));
        }
    }

    public void testUpdateQuery() {

        cfg = new DataModelConfiguration(serviceCfg);

        try {

            String name = "getFilmById";
            String query = "from Film where title='foo%'";
            QueryInfo qi = cfg.getQuery(name);
            assertTrue(qi.getComment().length() > 0);
            qi.setQuery(query);
            qi.setReturnsSingleResult(false);

            assertTrue(cfg.getModifiedFiles().size() == 0);

            cfg.updateQuery(qi);

            assertTrue(cfg.getModifiedFiles().size() == 1);
            assertTrue(cfg.getModifiedFiles().get(0).endsWith("Film.crud.hql.xml"));

            cfg.save(true);

            DataModelConfiguration cfg2 = new DataModelConfiguration(serviceCfg);

            QueryInfo qi2 = cfg2.getQuery(name);

            assertTrue(qi2.getName().equals(name));
            assertTrue(qi2.getQuery().equals(query));
            assertTrue(qi2.getIsHQL());
            assertTrue(qi2.getComment().length() > 0);

            genServiceClass();
            cleanupServiceClass(true);

        } finally {
            cfg.revert();
            cleanupServiceClass(false);
        }
    }

    public void testCompositeForeignKey() throws IOException {

        File f = new File(serviceDir, DataServiceTestConstants.PK_FK_SPRING_CFG).getCanonicalFile();

        assertTrue(f.exists());

        DataModelConfiguration cfg = new DataModelConfiguration(f);
        assertEquals(2, cfg.getEntities().size());
        EntityInfo t1 = cfg.getEntity("T1");

        assertEquals(2, t1.getProperties().size());
        PropertyInfo id = t1.getProperty("id");
        assertEquals("id", id.getName());
        assertEquals(2, id.allColumns().size());
        PropertyInfo keyprop1 = id.getCompositeProperty("id1");
        assertEquals("id1", keyprop1.getColumn().getName());
        assertEquals("integer", keyprop1.getFullyQualifiedType());
        assertEquals("integer", keyprop1.getColumn().getSqlType());
        PropertyInfo keyprop2 = id.getCompositeProperty("id2");
        assertEquals("id2", keyprop2.getColumn().getName());
        assertEquals("integer", keyprop2.getFullyQualifiedType());
        assertEquals("integer", keyprop2.getColumn().getSqlType());

        PropertyInfo t2sprop = t1.getProperty("t2s");
        assertEquals("t2s", t2sprop.getName());
        assertEquals("com.wavemaker.dqq.data.T2", t2sprop.getFullyQualifiedType());
        assertEquals(true, t2sprop.hasCompositeProperties());

        EntityInfo t2 = cfg.getEntity("T2");
        PropertyInfo id2 = t2.getId();
        assertEquals(id2, t2.getProperty("id"));
        assertEquals(1, id2.allColumns().size());

        PropertyInfo t1prop = t2.getProperty("t1");
        assertEquals("t1", t1prop.getName());
        assertEquals(2, t1prop.allColumns().size());

        PropertyInfo fkprop1 = t1prop.getCompositeProperty("fk1");
        assertEquals("fk1", fkprop1.getName());
        ColumnInfo fkcol1 = fkprop1.getColumn();
        assertEquals("integer", fkcol1.getSqlType());
        assertEquals(true, fkcol1.getIsFk());
        assertEquals(false, fkcol1.getIsPk());

        PropertyInfo fkprop2 = t1prop.getCompositeProperty("fk2");
        assertEquals("fk2", fkprop2.getName());
        ColumnInfo fkcol2 = fkprop2.getColumn();
        assertEquals("integer", fkcol2.getSqlType());
        assertEquals(true, fkcol2.getIsFk());
        assertEquals(false, fkcol2.getIsPk());

        RelatedInfo toOne = cfg.getRelated("T2", "t1");
        assertEquals("t1", toOne.getName());
        assertEquals(2, toOne.getColumnNames().length);

        RelatedInfo toMany = cfg.getRelated("T1", "t2s");
        assertEquals("t2s", toMany.getName());
        assertEquals(2, toMany.getColumnNames().length);

    }

    private ImportDB getImporter() {
        ImportDB importer = new ImportDB(false);
        importer.setImportDatabase(false);
        importer.setPackage(cfg.getDataPackage());
        importer.setClassName("Amsterdam");
        importer.setServiceName("sakila");
        importer.setDestDir(serviceDir);
        importer.setCompile(true);
        return importer;
    }

    private void genServiceClass() {
        ImportDB i = getImporter();
        try {
            i.run();
        } finally {
            i.dispose();
        }
    }

    private void cleanupServiceClass(boolean assertFilesExist) {
        ImportDB i = getImporter();
        for (String s : DataServiceUtils.getServiceClassNames(i.getPackage(), i.getClassName())) {
            File f = new File(serviceDir, StringUtils.classNameToSrcFilePath(s));
            if (assertFilesExist) {
                assertTrue(f.exists());
            }
            f.delete();
            f = new File(serviceDir, StringUtils.classNameToClassFilePath(s));
            if (assertFilesExist) {
                assertTrue(f.exists());
            }
            f.delete();
        }
    }

    public void testGenerateAllJavaTypes() {

        try {

            for (String s : cfg.getEntityNames()) {
                cfg.touchEntity(s);
            }

            cfg.save(true);

        } finally {
            cfg.revert(true);
        }
    }

    // MAV-260
    public void testCompositeFk1() {

        EntityInfo t2 = cfg.getEntity("Table2Mav260");
        assertTrue(t2 != null);

        // table1Mav260ByFk2 is a composite fk with 2 nullable columns
        PropertyInfo p = t2.getProperty("table1Mav260ByFk2");
        assertTrue(p.getIsRelated());
        assertTrue(!p.getIsInverse());
        assertTrue(p.getColumn() == null);
        assertTrue(p.getIsRelated());

        // columns are fk and name
        ColumnInfo fk = p.getCompositeProperty("fk").getColumn();
        assertTrue(fk != null);
        assertEquals(false, fk.getNotNull());

        ColumnInfo name = p.getCompositeProperty("name").getColumn();
        assertTrue(name != null);
        assertEquals(false, name.getNotNull());
    }

    // MAV-260
    public void testCompositeFk2() {

        EntityInfo t2 = cfg.getEntity("Table2Mav260");
        assertTrue(t2 != null);

        // table1Mav260ByFk is a composite fk with 1 not-null and 1 nullable
        // column
        PropertyInfo p = t2.getProperty("table1Mav260ByFk");
        assertTrue(p.getIsRelated());
        assertTrue(!p.getIsInverse());
        assertTrue(p.getColumn() == null);
        assertTrue(p.getIsRelated());

        // columns are id and name
        ColumnInfo fk = p.getCompositeProperty("id").getColumn();
        assertTrue(fk != null);
        assertEquals(true, fk.getNotNull());

        ColumnInfo name = p.getCompositeProperty("name").getColumn();
        assertTrue(name != null);
        assertEquals(false, name.getNotNull()); // bug was here

        // although the same column is referenced in both composite fks,
        // we have different col instances
        ColumnInfo otherNameRef = t2.getProperty("table1Mav260ByFk2").getCompositeProperty("name").getColumn();
        assertTrue(name != otherNameRef);
    }

    public void testRenameCity() {

        Collection<QueryInfo> queries = new ArrayList<QueryInfo>(3);

        try {

            renameEntity("City", "NewCity");

            // blow away illegal queries
            queries.add(cfg.deleteQuery("getCityById"));
            queries.add(cfg.deleteQuery("testLoadCityAndCountryAndCities"));
            queries.add(cfg.deleteQuery("testLoadCityAndCountryAndAddresses"));

            cfg.save();

            DataModelConfiguration cfg2 = new DataModelConfiguration(serviceCfg);
            EntityInfo newCity = cfg2.getEntity("NewCity");
            assertTrue(newCity != null);
            assertTrue(newCity.getId() != null);
            assertEquals(2, newCity.getRelatedProperties().size());
            assertTrue(newCity.getProperty("addresses") != null);
            assertTrue(newCity.getProperty("country") != null);
            assertEquals(1, cfg2.getEntity("Country").getRelatedProperties().size());
            assertTrue(cfg2.getEntity("Country").getProperty("newcities") != null);
        } finally {
            renameEntity("NewCity", "City");
            cfg.save();
            for (QueryInfo qi : queries) {
                cfg.updateQuery(qi);
            }
            cfg.save();

            // MAV-2108
            cfg.revert();
        }
    }

    public void testRenameCountry() {

        Collection<QueryInfo> queries = new ArrayList<QueryInfo>(1);

        try {

            renameEntity("Country", "NewCountry");

            // blow away illegal query
            queries.add(cfg.deleteQuery("getCountryById"));

            cfg.save();

            DataModelConfiguration cfg2 = new DataModelConfiguration(serviceCfg);
            EntityInfo newCountry = cfg2.getEntity("NewCountry");
            assertTrue(newCountry != null);
            assertTrue(newCountry.getId() != null);
            assertEquals(1, newCountry.getRelatedProperties().size());
            assertTrue(newCountry.getProperty("cities") != null);
            assertTrue(newCountry.getProperty("country") != null);
            assertTrue(newCountry.getProperty("lastUpdate") != null);
            assertEquals(2, cfg2.getEntity("City").getRelatedProperties().size());
            PropertyInfo countryProp = cfg2.getEntity("City").getProperty("country");
            assertEquals("NewCountry", countryProp.getType());
        } finally {
            renameEntity("NewCountry", "Country");
            cfg.save();
            for (QueryInfo qi : queries) {
                cfg.updateQuery(qi);
            }
            cfg.save();

            // MAV-2108
            cfg.revert();
        }
    }

    public void testSetRefreshEntities() {
        List<String> l = new ArrayList<String>();
        l.add("Actor");
        l.add("Film");
        cfg.setRefreshEntities(l);
        try {
            cfg.save(true);

            // verify
            DataModelConfiguration cfg2 = new DataModelConfiguration(serviceCfg);
            l = cfg2.getRefreshEntities();
            assertEquals(2, l.size());
            assertEquals("Actor", l.get(0));
            assertEquals("Film", l.get(1));
        } finally {
            cfg.revert();
            l = cfg.getRefreshEntities();
            // check revert
            assertEquals(1, l.size());
            assertEquals("com.wavemaker.runtime.data.sample.sakila.Defaults", l.get(0));
        }
    }

    private void renameEntity(String oldName, String newName) {

        EntityInfo e = cfg.getEntity(oldName);
        List<ColumnInfo> columns = new ArrayList<ColumnInfo>(cfg.getColumns(oldName));
        List<RelatedInfo> relations = new ArrayList<RelatedInfo>(cfg.getRelated(oldName));

        e.setEntityName(newName);

        cfg.updateEntity(oldName, e);

        // update logic requires all columns to be not foreign keys
        // they are turned into fks by setting updating relationships
        // (also happens on client)
        for (ColumnInfo ci : columns) {
            ci.setIsFk(false);
        }

        List<PropertyInfo> properties = new ArrayList<PropertyInfo>(e.getProperties());

        cfg.updateColumns(newName, columns, properties);

        cfg.updateRelated(newName, relations);
    }

}
