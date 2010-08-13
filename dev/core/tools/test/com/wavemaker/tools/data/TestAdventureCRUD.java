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
package com.wavemaker.tools.data;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import junit.framework.Test;
import junit.framework.TestSuite;

import org.hibernate.Query;
import org.hibernate.ScrollableResults;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.infra.DependentTestFailureException;
import com.wavemaker.infra.TestSpringContextTestCase;
import com.wavemaker.runtime.data.DataServiceTestConstants;
import com.wavemaker.runtime.data.QueryOptions;
import com.wavemaker.runtime.data.sample.adventure.Adventure;
import com.wavemaker.runtime.data.sample.adventure.Customer;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.service.ServiceConstants;
import com.wavemaker.runtime.service.ServiceManager;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 * Issues:
 * 
 * Required modifications to Customer.hbm.xml:
 * 
 * generator has to be set to identity rowguid: insert="false", update="false",
 * optionally generated="true" for auto-refresh from Hibernate
 * 
 * modified date is being set manually because versionning is not enabled in
 * Hibernate
 * 
 */
public class TestAdventureCRUD extends TestSpringContextTestCase {

    static class TestData {

        private String dependentTestName = null;

        private boolean skipRemaining = false;

        private Adventure adventure = null;

        private Customer newCustomer = null;

        void setService(Adventure adventure) {
            this.adventure = adventure;
        }

        Adventure getAdventure() {
            return adventure;
        }

        void setNewCustomer(Customer newCustomer) {
            this.newCustomer = newCustomer;
        }

        Customer getNewCustomer() {
            return newCustomer;
        }

        void setSkipRemaining(String dependentTestName) {
            this.skipRemaining = true;
            this.dependentTestName = dependentTestName;
        }

        boolean skipRemaining() {
            return skipRemaining;
        }

        String getDependentTestName() {
            return dependentTestName;
        }

    }

    public static Test suite() {

        TestData testData = new TestData();

        TestSuite testsToRun = new TestSuite();

        testsToRun
                .addTest(new TestAdventureCRUD("testCountCustomers", testData));
        testsToRun.addTest(new TestAdventureCRUD("testScrollableResultSet",
                testData));
         testsToRun
         .addTest(new TestAdventureCRUD("testAddNewCustomer", testData));
         testsToRun.addTest(new TestAdventureCRUD("testFindNewCustomer",
         testData));
         testsToRun.addTest(new TestAdventureCRUD("testDeleteNewCustomer",
         testData));
         testsToRun.addTest(new TestAdventureCRUD("testConnection",
         testData));
         testsToRun.addTest(new TestAdventureCRUD("testConnection2",
         testData));

        return testsToRun;
    }

    protected final TestData testData;

    public TestAdventureCRUD(String testMethod, TestData testData) {
        super(testMethod);
        this.testData = testData;
    }

    protected void checkShouldSkip() {
        if (testData.skipRemaining) {
            throw new DependentTestFailureException(testData
                    .getDependentTestName());
        }
    }

    public void testCountCustomers() {

        try {

            ApplicationContext ctx = getApplicationContext();

            ServiceManager serviceMgr = (ServiceManager) ctx
                    .getBean(ServiceConstants.SERVICE_MANAGER_NAME);

            Adventure adventure = (Adventure) ((ReflectServiceWire) serviceMgr
                    .getServiceWire(DataServiceTestConstants.SQL_SERVER_ADVENTURE_SERVICE_ID)).getServiceBean();

            assertTrue(adventure.getCustomerCount(new Customer(),
                    new QueryOptions()) == (long) 440);

            testData.setService(adventure);

        } catch (RuntimeException ex) {
            testData.setSkipRemaining("testCountCustomers");
            throw ex;
        }
    }

    public void testScrollableResultSet() {

        checkShouldSkip();

        Adventure adventure = testData.getAdventure();

        adventure.getDataServiceManager().begin();

        ScrollableResults sr = null;

        try {

            Session session = adventure.getDataServiceManager().getSession();

            Query q = session
                    .createQuery("from Customer where lastName like 'A%'");

            sr = q.scroll();
            sr.last();
            assertEquals(23, sr.getRowNumber() + 1);

        } finally {
            try {
                sr.close();
            } catch (Exception ignore) {
            }

            adventure.getDataServiceManager().rollback();
        }
    }

    public void testAddNewCustomer() {

        checkShouldSkip();

        Customer c = new Customer();

        c.setFirstName("f");
        c.setLastName("Rasputin");
        c.setPasswordHash("a");
        c.setPasswordSalt("s");
        c.setModifiedDate(new Date());

        try {
            testData.getAdventure().insertCustomer(c);
        } catch (RuntimeException ex) {
            testData.setSkipRemaining("testAddNewCustomer");
            throw ex;
        }
    }

    public void testFindNewCustomer() {

        checkShouldSkip();

        Customer qbe = new Customer();

        qbe.setLastName("Rasputin");

        try {
            List<Customer> l = testData.getAdventure().getCustomerList(qbe,
                    new QueryOptions());

            assertTrue(l.size() == 1);

            assertTrue(l.get(0).getLastName().equals("Rasputin"));

            testData.setNewCustomer(l.get(0));

        } catch (RuntimeException ex) {
            testData.setSkipRemaining("testFindNewCustomer");
            throw ex;
        }

    }

    public void testDeleteNewCustomer() {

        checkShouldSkip();

        testData.getAdventure().deleteCustomer(testData.getNewCustomer());

    }

    public void testConnection() throws IOException {

        File props = ClassLoaderUtils
                .getClasspathFile("sqlserver_adventure.properties");

        Properties p = DataServiceUtils.loadDBProperties(props);

        TestDBConnection t = new TestDBConnection();
        t.setProperties(p);
        t.run();
    }

    public void testConnection2() throws IOException {

        File props = ClassLoaderUtils
                .getClasspathFile("sqlserver_adventure.properties");

        Properties p = DataServiceUtils.loadDBProperties(props);

        TestDBConnection t = new TestDBConnection();
        t.setProperties(p);
        t.setUsername("__blah__");
        try {
            t.run();
        } catch (Exception ex) {
            assertTrue(ex.getCause().getMessage().equals(
                    "Login failed for user '__blah__'."));
            return;
        }
        fail("Expected this to fail");
    }

}
