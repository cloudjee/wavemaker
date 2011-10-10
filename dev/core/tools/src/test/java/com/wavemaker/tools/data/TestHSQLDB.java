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

package com.wavemaker.tools.data;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;

import org.junit.Ignore;
import org.junit.Test;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.data.DataServiceRuntimeException;

public class TestHSQLDB {

    private static final String HSQLDB_PATH = "com/wavemaker/tools/data/hsqldb";

    @Test
    public void testConnection1() throws IOException {

        String u = "jdbc:hsqldb:file:%s;shutdown=true;ifexists=true";

        File f = ClassLoaderUtils.getClasspathFile(HSQLDB_PATH).getFile();

        File dbdir = new File(f, "rolodexdb");

        String url = String.format(u, dbdir.getAbsolutePath() + "/rolodex");

        TestDBConnection t = new TestDBConnection();
        t.setUsername("sa");
        t.setConnectionUrl(url);
        t.run();
    }

    @Test
    public void testConnection2() throws IOException {

        String u = "jdbc:hsqldb:file:%s;shutdown=true;ifexists=true";

        File f = ClassLoaderUtils.getClasspathFile(HSQLDB_PATH).getFile();

        File dbdir = new File(f, "rolodexdb_doesnt_exist");

        String url = String.format(u, dbdir.getAbsolutePath() + "/rolodex");

        TestDBConnection t = new TestDBConnection();
        t.setUsername("sa");
        t.setConnectionUrl(url);
        try {
            t.run();
        } catch (DataServiceRuntimeException ex) {
            Throwable cause = ex.getCause();
            assertTrue(cause.getMessage().startsWith("Database does not exists"));
            return;
        }
        fail("Expected this to not work");
    }

    @Test
    public void testConnection3() throws IOException {

        // test that we add "ifexists=true" correctly to the url
        String u = "jdbc:hsqldb:file:%s;shutdown=true";

        File f = ClassLoaderUtils.getClasspathFile(HSQLDB_PATH).getFile();

        File dbdir = new File(f, "rolodexdb_doenst_exist");

        String url = String.format(u, dbdir.getAbsolutePath() + "/rolodex");

        TestDBConnection t = new TestDBConnection();
        t.setUsername("sa");
        t.setConnectionUrl(url);
        try {
            t.run();
        } catch (DataServiceRuntimeException ex) {
            Throwable cause = ex.getCause();
            assertTrue(cause.getMessage().startsWith("Database does not exists"));
            return;
        }
        fail("Expected this to not work");
    }

    @Test
    public void testCreateCheckDB() throws Exception {

        String u = "jdbc:hsqldb:file:%s/hsql/p1;shutdown=true";

        File f = IOUtils.createTempDirectory();

        String url = String.format(u, f.getAbsolutePath());

        Class.forName("org.hsqldb.jdbcDriver").newInstance();

        Connection c = DriverManager.getConnection(url, "sa", "");

        Statement s = c.createStatement();

        s.executeUpdate("create table foo22(id int identity primary key, " + "name varchar(50))");
        s.executeUpdate("insert into foo22 (name) values ('ed')");
        s.executeUpdate("insert into foo22 (name) values ('ed2')");

        c.commit();

        c.close();

        c = DriverManager.getConnection(url, "sa", "");

        s.close();

        ResultSet rs = null;
        try {
            s = c.createStatement();

            rs = s.executeQuery("SELECT * from foo22");

            ResultSetMetaData rsmd = rs.getMetaData();
            for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                if (i == 1) {
                    assertTrue(rsmd.isAutoIncrement(i));
                } else {
                    assertFalse(rsmd.isAutoIncrement(i));
                }
            }

        } finally {
            rs.close();
            s.close();
        }

        try {

            s = c.createStatement();

            s.execute("select * from foo22");

            rs = s.getResultSet();

            int i = 0;

            while (rs.next()) {
                if (i == 0) {
                    if (rs.getInt(1) != 0) {
                        fail("expected first pk to be 0");
                    }
                    if (!rs.getString(2).equals("ed")) {
                        fail("expected first name to be ed");
                    }
                }
                if (i == 1) {
                    if (rs.getInt(1) != 1) {
                        fail("expected second pk to be 1");
                    }
                    if (!rs.getString(2).equals("ed2")) {
                        fail("expected second name to be ed2");
                    }
                }
                if (i > 1) {
                    fail("expected 2 rows");
                }
                i++;
            }
        } finally {

            rs.close();

            s.close();

            c.close();

            IOUtils.deleteRecursive(f);
        }
    }

    // MAV-1534 - ensure no .lck file is left around after import
    // TODO - revisit this after ensuring ImportDB works with new compiler infrastructure
    @Ignore
    @Test
    public void testImportNoLock() throws Exception {

        String u = "jdbc:hsqldb:file:%s;shutdown=true;ifexists=true";

        File f = ClassLoaderUtils.getClasspathFile(HSQLDB_PATH).getFile();

        File dbdir = new File(f, "rolodexdb");

        String dbname = "rolodex";

        String url = String.format(u, dbdir.getAbsolutePath() + "/" + dbname);

        File outputDir = IOUtils.createTempDirectory();

        File lockfile = new File(dbdir, dbname + "_lck");

        try {

            ImportDB importer = new ImportDB();
            importer.setUsername("sa");
            importer.setConnectionUrl(url);
            importer.testConnection();

            importer.setDestDir(outputDir);
            importer.setPackage("com.foo.blah");
            importer.setClassName("Service");
            importer.setTableFilter("COUNTRY");
            importer.setGenerateServiceClass(true);
            importer.setCompileServiceClass(true);

            File javaDir = DataModelManager.getJavaDir(outputDir, "com.foo.blah");
            importer.setJavaDir(javaDir);

            importer.run();

            // the existence of the lockfile indicates we don't
            // shut down correctly and leave connections to the db
            // open
            assertFalse("Lock file exists after import: " + lockfile.getAbsolutePath(), lockfile.exists());

        } finally {
            IOUtils.deleteRecursive(outputDir);
            lockfile.delete();
        }
    }
}
