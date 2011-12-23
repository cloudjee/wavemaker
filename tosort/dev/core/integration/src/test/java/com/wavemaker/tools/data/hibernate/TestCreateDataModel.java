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

package com.wavemaker.tools.data.hibernate;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import junit.framework.Test;
import junit.framework.TestSuite;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.data.ColumnInfo;
import com.wavemaker.tools.data.DataModelConfiguration;
import com.wavemaker.tools.data.EntityInfo;
import com.wavemaker.tools.data.PropertyInfo;
import com.wavemaker.tools.data.RelatedInfo;
import com.wavemaker.tools.data.util.DataServiceUtils;

public class TestCreateDataModel extends WMTestCase {

    public static Test suite() {

        TestSuite testsToRun = new TestSuite();

        /*
         * These tests are disabled in UNIX; when fixing MAV-2098, remove the if statement and the testDummy() method.
         */
        if (SystemUtils.isLinux() || SystemUtils.isMacOSX()) {
            testsToRun.addTest(new TestCreateDataModel("testDummy"));
        } else {
            testsToRun.addTest(new TestCreateDataModel("testAddSingleEntity"));
            testsToRun.addTest(new TestCreateDataModel("testAddRelatedEntities"));
            testsToRun.addTest(new TestCreateDataModel("testAddRelatedPkIsFk"));
            testsToRun.addTest(new TestCreateDataModel("testDeleteColumn"));
            testsToRun.addTest(new TestCreateDataModel("testDeleteColumn2"));
            testsToRun.addTest(new TestCreateDataModel("testAddRelatedEntitiesCompositePkFk"));
        }

        return testsToRun;
    }

    public TestCreateDataModel(String testMethodName) {
        super(testMethodName);
    }

    public void testDummy() {
    }

    public void testAddSingleEntity() throws IOException {

        EntityInfo ei = new EntityInfo();
        ei.setCatalogName("db");
        ei.setTableName("t1");
        ei.setPackageName("com.blah");
        ei.setEntityName("Foo");

        PropertyInfo id = PropertyInfo.newIdProperty("id");
        id.types("int");
        id.setIsId(true);
        id.setColumn(ColumnInfo.newColumnInfo(id));

        PropertyInfo name = PropertyInfo.newProperty("name");
        name.types("java.lang.String");
        name.setColumn(ColumnInfo.newColumnInfo(name));
        assertEquals("string", name.getColumn().getSqlType());
        name.getColumn().setNotNull(true);

        File tmp = IOUtils.createTempDirectory();

        File f = DataServiceUtils.createEmptyDataModel(tmp, "foo", ei.getPackageName());

        try {
            DataModelConfiguration mgr = new DataModelConfiguration(f);

            mgr.updateEntity(ei.getEntityName(), ei);
            List<ColumnInfo> l = new ArrayList<ColumnInfo>(2);
            l.add(id.getColumn());
            l.add(name.getColumn());
            mgr.updateColumns(ei.getEntityName(), l);
            mgr.save(false);

            // add another col
            List<ColumnInfo> l2 = new ArrayList<ColumnInfo>(3);
            l2.add(ColumnInfo.newColumnInfo(id));
            l2.add(ColumnInfo.newColumnInfo(name));
            ColumnInfo ci = new ColumnInfo();
            ci.setIsFk(false); // don't set to true
            ci.setIsPk(false);

            ci.setName("e2_fk");

            ci.setSqlType("int");
            l2.add(ci);
            mgr.updateColumns(ei.getEntityName(), l2);
            assertEquals(3, l2.size());

            mgr.save();

            assertTrue(mgr.getProperties("Foo").size() == 3);

            // change col/property type
            l2 = new ArrayList<ColumnInfo>(3);
            l2.add(ColumnInfo.newColumnInfo(id));
            l2.add(ColumnInfo.newColumnInfo(name));
            ci = (ColumnInfo) ci.clone();
            ci.setSqlType("string");
            l2.add(ci);
            mgr.updateColumns(ei.getEntityName(), l2);
            mgr.save();

            // make sure types are still on the columns
            ColumnInfo colinfo = mgr.getColumn(ei.getEntityName(), name.getName());

            assertEquals("string", colinfo.getSqlType());

            // verify
            mgr = new DataModelConfiguration(f);
            assertTrue(mgr.getEntityNames().size() == 1);
            ei = mgr.getEntities().iterator().next();
            assertTrue(ei.getCatalogName().equals("db"));
            assertTrue(ei.getTableName().equals("t1"));
            assertTrue(ei.getPackageName().equals("com.blah"));
            assertTrue(ei.getEntityName().equals("Foo"));

            List<PropertyInfo> properties = new ArrayList<PropertyInfo>(ei.getProperties());

            assertTrue(properties.size() == 3);
            assertTrue(properties.get(0).getIsId());
            assertTrue(properties.get(1).getFullyQualifiedType().equals("string"));

            assertTrue(!properties.get(2).getColumn().getNotNull());
            assertTrue(properties.get(2).getFullyQualifiedType().equals("string"));

        } finally {
            IOUtils.deleteRecursive(tmp);
        }
    }

    public void testAddRelatedEntities() throws IOException {

        EntityInfo ei = new EntityInfo();
        ei.setCatalogName("db");
        ei.setTableName("t1");
        ei.setPackageName("com.blah");
        ei.setEntityName("Foo");

        EntityInfo ei2 = new EntityInfo();
        ei2.setCatalogName("db");
        ei2.setTableName("t2");
        ei2.setPackageName("com.blah");
        ei2.setEntityName("Blah");

        PropertyInfo id2 = PropertyInfo.newIdProperty("id");
        id2.types("int");
        id2.setIsId(true);
        id2.setColumn(ColumnInfo.newColumnInfo(id2));

        PropertyInfo id = PropertyInfo.newIdProperty("id");
        id.types("int");
        id.setIsId(true);
        id.setColumn(ColumnInfo.newColumnInfo(id));

        PropertyInfo name = PropertyInfo.newProperty("name");
        name.types("string");
        name.setColumn(ColumnInfo.newColumnInfo(name));
        name.getColumn().setNotNull(true);

        PropertyInfo ei2fk = PropertyInfo.newProperty("ei2fk");
        ei2fk.types("int"); // maps to hbm type "integer"
        ei2fk.setColumn(ColumnInfo.newColumnInfo(ei2fk));
        ei2fk.getColumn().setNotNull(true);

        // ei has a to-one to ei2
        RelatedInfo r1 = new RelatedInfo();
        r1.setName("r1");
        r1.setCardinality(RelatedInfo.Cardinality.OneToOne.toString());
        r1.setColumnNames(new String[] { ei2fk.getColumn().getName() });
        r1.setFullyQualifiedType(ei2.getPackageName() + "." + ei2.getEntityName());
        r1.setRelatedType(ei2.getEntityName());
        r1.setTableName(ei.getTableName());

        r1.setCascadeOptions(RelatedInfo.CascadeOption.Delete);

        File tmp = IOUtils.createTempDirectory();

        File f = DataServiceUtils.createEmptyDataModel(tmp, "foo", ei.getPackageName());

        try {
            DataModelConfiguration mgr = new DataModelConfiguration(f);

            mgr.updateEntity(ei.getEntityName(), ei);
            mgr.updateEntity(ei2.getEntityName(), ei2);

            List<ColumnInfo> l = new ArrayList<ColumnInfo>(3);
            l.add(id.getColumn());
            l.add(name.getColumn());
            l.add(ei2fk.getColumn());
            mgr.updateColumns(ei.getEntityName(), l);

            List<ColumnInfo> l2 = new ArrayList<ColumnInfo>(1);
            l2.add(id2.getColumn());
            mgr.updateColumns(ei2.getEntityName(), l2);

            List<RelatedInfo> l3 = new ArrayList<RelatedInfo>(1);
            l3.add(r1);
            mgr.updateRelated(ei.getEntityName(), l3);

            // check foreign key col type is set
            Map<String, ColumnInfo> m = mgr.getColumnsMap(ei.getEntityName());
            assertTrue(m.get("ei2fk").getSqlType().equals("integer"));

            assertTrue(mgr.getModifiedFiles().size() == 2);

            mgr.save(false);

            assertTrue(mgr.getModifiedFiles().size() == 0);
            checkForeignKeyCol(mgr);

            Collection<RelatedInfo> all = mgr.getRelated("Blah");
            assertTrue(all.size() == 1);

            String toManyRelatedName = "foos";
            RelatedInfo toMany = mgr.getRelated("Blah", toManyRelatedName);
            assertTrue(toMany.getCardinality().equals(RelatedInfo.Cardinality.OneToMany.toString()));

            checkKeys(mgr);

            // verify
            mgr = new DataModelConfiguration(f);
            assertTrue(mgr.getEntityNames().size() == 2);

            // MAV 2120
            Iterator<EntityInfo> itr = mgr.getEntities().iterator();
            while (itr.hasNext()) {
                ei = itr.next();
                if (ei.getTableName().equals("t1")) {
                    break;
                }
            }

            assertTrue(ei.getCatalogName().equals("db"));

            List<PropertyInfo> properties = null;
            List<PropertyInfo> relproperties = null;

            assertTrue(ei.getPackageName().equals("com.blah"));
            assertTrue(ei.getEntityName().equals("Foo"));

            properties = new ArrayList<PropertyInfo>(ei.getProperties());

            assertTrue(properties.size() == 3);
            assertTrue(properties.get(0).getIsId());
            assertTrue(properties.get(1).getFullyQualifiedType().equals("string"));

            relproperties = new ArrayList<PropertyInfo>(ei.getRelatedProperties());
            assertTrue(relproperties.size() == 1);
            assertTrue(relproperties.get(0).getIsRelated());
            assertEquals(1, relproperties.get(0).getCascadeOptions().size());
            assertEquals(RelatedInfo.CascadeOption.Delete, relproperties.get(0).getCascadeOptions().get(0));
            assertTrue(!relproperties.get(0).getIsInverse());

            // MAV 2120
            Iterator<EntityInfo> iter = mgr.getEntities().iterator();
            while (iter.hasNext()) {
                ei = iter.next();
                if (ei.getTableName().equals("t2")) {
                    break;
                }
            }

            assertTrue(ei.getCatalogName().equals("db"));
            assertTrue(ei.getTableName().equals("t2"));
            assertTrue(ei.getPackageName().equals("com.blah"));
            assertTrue(ei.getEntityName().equals("Blah"));

            properties = new ArrayList<PropertyInfo>(ei.getProperties());

            assertTrue(properties.size() == 2);
            assertTrue(properties.get(0).getIsId());
            assertTrue(properties.get(0).getFullyQualifiedType().equals("integer"));

            relproperties = new ArrayList<PropertyInfo>(ei.getRelatedProperties());
            assertTrue(ei.getRelatedProperties().size() == 1);
            assertTrue(relproperties.get(0).getIsRelated());
            assertTrue(relproperties.get(0).getIsInverse());

            checkForeignKeyCol(mgr);

            // now try to remove related one
            assertTrue(mgr.getModifiedFiles().size() == 0);
            mgr.updateRelated("Foo", Collections.<RelatedInfo> emptyList());
            assertTrue(mgr.getModifiedFiles().size() == 2);
            mgr.save(false);
            assertTrue(mgr.getModifiedFiles().size() == 0);

            checkKeys(mgr);

            // verify
            mgr = new DataModelConfiguration(f);
            assertTrue(mgr.getEntityNames().size() == 2);
            ei = mgr.getEntity("Foo");
            assertTrue(ei.getProperties().size() == 3);

            PropertyInfo p = ei.getProperty("ei2fk");
            assertTrue(p.getFullyQualifiedType().equals("integer"));

            ei = mgr.getEntity("Blah");
            assertTrue(ei.getProperties().size() == 1);

        } finally {
            IOUtils.deleteRecursive(tmp);
        }
    }

    public void testAddRelatedEntitiesCompositePkFk() throws IOException {

        EntityInfo t1 = new EntityInfo();
        t1.setCatalogName("db");
        t1.setTableName("t1");
        t1.setPackageName("com.blah");
        t1.setEntityName("T1");

        EntityInfo t2 = new EntityInfo();
        t2.setCatalogName("db");
        t2.setTableName("t2");
        t2.setPackageName("com.blah");
        t2.setEntityName("T2");

        ColumnInfo pk1 = new ColumnInfo();
        pk1.setName("pk1");
        pk1.setSqlType("integer");
        pk1.setIsPk(true);
        ColumnInfo pk2 = new ColumnInfo();
        pk2.setName("pk2");
        pk2.setSqlType("integer");
        pk2.setIsPk(true);

        List<ColumnInfo> l = new ArrayList<ColumnInfo>();
        l.add(pk1);
        l.add(pk2);

        ColumnInfo t2id = new ColumnInfo();
        t2id.setName("id");
        t2id.setIsPk(true);
        t2id.setSqlType("integer");
        t2id.setGenerator(DataServiceConstants.GENERATOR_ASSIGNED);
        List<ColumnInfo> l2 = new ArrayList<ColumnInfo>();
        l2.add(t2id);

        File tmp = IOUtils.createTempDirectory();
        File f = DataServiceUtils.createEmptyDataModel(tmp, "foo", t1.getPackageName());

        try {
            DataModelConfiguration mgr = new DataModelConfiguration(f);

            mgr.updateEntity(t1.getEntityName(), t1);
            mgr.updateEntity(t2.getEntityName(), t2);

            List<PropertyInfo> properties = new ArrayList<PropertyInfo>(1);
            PropertyInfo id2 = PropertyInfo.newIdProperty("id");
            id2.types("com.foo.MyIdType");
            id2.setIsId(true);
            id2.setColumn(ColumnInfo.newColumnInfo(id2));
            properties.add(id2);
            PropertyInfo cpk1 = new PropertyInfo();
            cpk1.setName("pk1");
            PropertyInfo cpk2 = new PropertyInfo();
            cpk1.setName("pk2");
            id2.addCompositeProperty(cpk1);
            id2.addCompositeProperty(cpk2);

            mgr.updateColumns(t1.getEntityName(), l, properties);
            mgr.updateColumns(t2.getEntityName(), l2);

            // add composite fk to t2, referencing t1
            ColumnInfo fk1 = new ColumnInfo();
            fk1.setName("fk1");
            fk1.setSqlType("integer");
            ColumnInfo fk2 = new ColumnInfo();
            fk2.setName("fk2");
            fk2.setSqlType("integer");
            l2.add(fk1);
            l2.add(fk2);
            mgr.updateColumns(t2.getEntityName(), l2);

            RelatedInfo ri = new RelatedInfo();
            ri.setName("reft1");
            ri.setCardinality(RelatedInfo.Cardinality.OneToOne.toString());
            ri.setRelatedType(t1.getEntityName());
            ri.setFullyQualifiedType(StringUtils.fq(t1.getPackageName(), t1.getEntityName()));
            ri.setTableName(t1.getTableName());
            ri.setColumnNames(new String[] { "fk1", "fk2" });
            List<RelatedInfo> rl = new ArrayList<RelatedInfo>();
            rl.add(ri);

            mgr.updateRelated(t2.getEntityName(), rl);

            mgr.save(false);

            // verify
            mgr = new DataModelConfiguration(f);
            assertTrue(mgr.getEntityNames().size() == 2);

            PropertyInfo id = mgr.getEntity("T1").getId();
            assertEquals(true, id.hasCompositeProperties());
            assertEquals("com.foo.MyIdType", id.getFullyQualifiedType());
            assertEquals(2, id.getCompositeProperties().size());
            assertEquals("pk1", id.getCompositeProperty("pk1").getName());
            assertEquals("pk2", id.getCompositeProperty("pk2").getName());

            RelatedInfo r1 = mgr.getRelated(t2.getEntityName(), "reft1");
            assertEquals(2, r1.getColumnNames().length);
            assertEquals(RelatedInfo.Cardinality.OneToZeroOrOne.toString(), r1.getCardinality());
            assertEquals("fk1", r1.getColumnNames()[0]);
            assertEquals("fk2", r1.getColumnNames()[1]);

            RelatedInfo r2 = mgr.getRelated(t1.getEntityName(), "t2s");
            assertEquals(2, r2.getColumnNames().length);
            assertEquals(RelatedInfo.Cardinality.OneToMany.toString(), r2.getCardinality());
            assertEquals("fk1", r2.getColumnNames()[0]);
            assertEquals("fk2", r2.getColumnNames()[1]);

        } finally {
            IOUtils.deleteRecursive(tmp);
        }
    }

    private void checkKeys(DataModelConfiguration mgr) {
        // make sure keys are set correctly
        ColumnInfo c = mgr.getColumn("Foo", "id");
        assertTrue(c.getIsPk());
        assertTrue(!c.getIsFk());
        c = mgr.getColumn("Blah", "id");
        assertTrue(c.getIsPk());
        assertTrue(!c.getIsFk());
    }

    private void checkForeignKeyCol(DataModelConfiguration mgr) {
        // the foreign key column should only exist in in Foo
        List<ColumnInfo> cols = new ArrayList<ColumnInfo>(mgr.getEntity("Foo").getColumns());
        boolean found = false;
        for (ColumnInfo c : cols) {
            if (c.getIsFk()) {
                if (found) {
                    fail("didn't expect two foreign key columns");
                }
                found = true;
                assertTrue(c.getName().equals("ei2fk"));
            }
        }

        if (!found) {
            fail("didn't find fk column");
        }

        cols = new ArrayList<ColumnInfo>(mgr.getEntity("Blah").getColumns());
        for (ColumnInfo c : cols) {
            if (c.getIsFk() || c.getName().equals("ei2fk")) {
                fail("didn't expect a foreign key col in Blah");
            }
        }

    }

    public void testAddRelatedPkIsFk() throws IOException {

        EntityInfo ei = new EntityInfo();
        ei.setCatalogName("db");
        ei.setTableName("t1");
        ei.setPackageName("com.blah");
        ei.setEntityName("Foo");

        EntityInfo ei2 = new EntityInfo();
        ei2.setCatalogName("db");
        ei2.setTableName("t2");
        ei2.setPackageName("com.blah");
        ei2.setEntityName("Blah");

        PropertyInfo id = PropertyInfo.newIdProperty("id");
        id.types("int");
        id.setIsId(true);
        id.setColumn(ColumnInfo.newColumnInfo(id));

        PropertyInfo id2 = PropertyInfo.newIdProperty("id");
        id2.types("int");
        id2.setIsId(true);
        id2.setColumn(ColumnInfo.newColumnInfo(id2));

        // Foo's pk is also used as fk to Blah
        RelatedInfo r1 = new RelatedInfo();
        r1.setName("r1");
        r1.setCardinality(RelatedInfo.Cardinality.OneToOne.toString());
        r1.setColumnNames(new String[] { id.getColumn().getName() });
        r1.setFullyQualifiedType(ei2.getPackageName() + "." + ei2.getEntityName());
        r1.setRelatedType(ei2.getEntityName());
        r1.setTableName(ei.getTableName());

        File tmp = IOUtils.createTempDirectory();
        File f = DataServiceUtils.createEmptyDataModel(tmp, "foo", ei.getPackageName());

        try {
            DataModelConfiguration mgr = new DataModelConfiguration(f);

            mgr.updateEntity(ei.getEntityName(), ei);
            mgr.updateEntity(ei2.getEntityName(), ei2);

            List<ColumnInfo> l = new ArrayList<ColumnInfo>(1);
            l.add(id.getColumn());
            mgr.updateColumns(ei.getEntityName(), l);

            List<ColumnInfo> l2 = new ArrayList<ColumnInfo>(1);
            l2.add(id2.getColumn());
            mgr.updateColumns(ei2.getEntityName(), l2);

            List<RelatedInfo> l3 = new ArrayList<RelatedInfo>(1);
            l3.add(r1);
            mgr.updateRelated(ei.getEntityName(), l3);

            assertTrue(mgr.getModifiedFiles().size() == 2);

            mgr.save(false);

            assertTrue(mgr.getModifiedFiles().size() == 0);

            // verify
            mgr = new DataModelConfiguration(f);
            assertTrue(mgr.getEntityNames().size() == 2);
            ei = mgr.getEntity("Foo");
            assertTrue(ei.getCatalogName().equals("db"));
            assertTrue(ei.getTableName().equals("t1"));
            assertTrue(ei.getPackageName().equals("com.blah"));
            assertTrue(ei.getEntityName().equals("Foo"));

            assertTrue(ei.getProperties().size() == 2);
            List<PropertyInfo> l10 = new ArrayList<PropertyInfo>(ei.getProperties());
            assertTrue(l10.get(0).getName().equals("id"));
            assertTrue(l10.get(1).getName().equals("r1"));
            assertTrue(ei.getColumns().size() == 1);
            assertTrue(ei.getColumns().iterator().next().getName().equals("id"));

            ei = mgr.getEntity("Blah");
            assertTrue(ei.getProperties().size() == 2);
            assertTrue(ei.getColumns().size() == 1);
            assertTrue(ei.getColumns().iterator().next().getName().equals("id"));

            // remove related
            mgr.updateRelated("Foo", Collections.<RelatedInfo> emptyList());
            mgr.save(false);

            // verify
            mgr = new DataModelConfiguration(f);

            ei = mgr.getEntity("Foo");
            assertTrue(ei.getProperties().size() == 1);
            assertTrue(ei.getColumns().iterator().next().getName().equals("id"));
            assertTrue(ei.getColumns().iterator().next().getIsPk());

            ei = mgr.getEntity("Blah");
            assertTrue(ei.getProperties().size() == 1);
            assertTrue(ei.getColumns().iterator().next().getName().equals("id"));
            assertTrue(ei.getColumns().iterator().next().getIsPk());

        } finally {
            IOUtils.deleteRecursive(tmp);
        }
    }

    public void testDeleteColumn() throws IOException {

        EntityInfo ei = new EntityInfo();
        ei.setCatalogName("db");
        ei.setTableName("t1");
        ei.setPackageName("com.blah");
        ei.setEntityName("Foo");

        PropertyInfo id = PropertyInfo.newIdProperty("id");
        id.types("int");
        id.setIsId(true);
        id.setColumn(ColumnInfo.newColumnInfo(id));

        PropertyInfo name = PropertyInfo.newIdProperty("name");
        name.types("string");
        name.setIsId(false);
        name.setColumn(ColumnInfo.newColumnInfo(name));

        File tmp = IOUtils.createTempDirectory();
        File f = DataServiceUtils.createEmptyDataModel(tmp, "foo", ei.getPackageName());

        try {
            DataModelConfiguration mgr = new DataModelConfiguration(f);

            mgr.updateEntity(ei.getEntityName(), ei);

            List<ColumnInfo> l = new ArrayList<ColumnInfo>(2);
            l.add(id.getColumn());
            l.add(name.getColumn());
            mgr.updateColumns(ei.getEntityName(), l);

            assertTrue(mgr.getModifiedFiles().size() == 1);

            mgr.save(false);

            assertTrue(mgr.getModifiedFiles().size() == 0);

            // verify
            mgr = new DataModelConfiguration(f);
            assertTrue(mgr.getEntityNames().size() == 1);
            ei = mgr.getEntity("Foo");
            assertTrue(ei.getColumns().size() == 2);

            // remove one col
            l = new ArrayList<ColumnInfo>(1);
            l.add(ColumnInfo.newColumnInfo(id));
            mgr.updateColumns(ei.getEntityName(), l);
            mgr.save(false);

            mgr = new DataModelConfiguration(f);
            assertTrue(mgr.getEntityNames().size() == 1);
            ei = mgr.getEntity("Foo");
            assertTrue(ei.getColumns().size() == 1);

        } finally {
            IOUtils.deleteRecursive(tmp);
        }

    }

    public void testDeleteColumn2() throws IOException {

        EntityInfo ei = new EntityInfo();
        ei.setCatalogName("db");
        ei.setTableName("t1");
        ei.setPackageName("com.blah");
        ei.setEntityName("Foo");

        PropertyInfo id = PropertyInfo.newIdProperty("id");
        id.types("int");
        id.setIsId(true);
        id.setColumn(ColumnInfo.newColumnInfo(id));

        PropertyInfo name = PropertyInfo.newIdProperty("name");
        name.types("string");
        name.setIsId(false);
        name.setColumn(ColumnInfo.newColumnInfo(name));

        File tmp = IOUtils.createTempDirectory();
        File f = DataServiceUtils.createEmptyDataModel(tmp, "foo", ei.getPackageName());

        try {
            DataModelConfiguration mgr = new DataModelConfiguration(f);

            mgr.updateEntity(ei.getEntityName(), ei);

            List<ColumnInfo> l = new ArrayList<ColumnInfo>(2);
            l.add(id.getColumn());
            l.add(name.getColumn());
            mgr.updateColumns(ei.getEntityName(), l);

            assertTrue(mgr.getModifiedFiles().size() == 1);

            mgr.save(false);

            assertTrue(mgr.getModifiedFiles().size() == 0);

            assertTrue(mgr.getEntityNames().size() == 1);
            ei = mgr.getEntity("Foo");
            assertTrue(ei.getColumns().size() == 2);

            // remove one col from same mgr instance
            id = PropertyInfo.newIdProperty("id");
            id.types("int");
            id.setIsId(true);
            id.setColumn(ColumnInfo.newColumnInfo(id));
            l = new ArrayList<ColumnInfo>(1);
            l.add(id.getColumn());

            mgr.updateColumns(ei.getEntityName(), l);
            mgr.save(false);

            assertTrue(mgr.getEntityNames().size() == 1);
            ei = mgr.getEntity("Foo");
            assertTrue(ei.getColumns().size() == 1);

        } finally {
            IOUtils.deleteRecursive(tmp);
        }

    }
}
