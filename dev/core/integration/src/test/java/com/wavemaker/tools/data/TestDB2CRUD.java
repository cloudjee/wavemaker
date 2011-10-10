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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Properties;

import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.context.ApplicationContext;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.infra.DependentTestFailureException;
import com.wavemaker.runtime.data.DataServiceTestConstants;
import com.wavemaker.runtime.data.sample.db2sampledb.DB2Sample;
import com.wavemaker.runtime.data.sample.db2sampledb.Department;
import com.wavemaker.runtime.data.sample.db2sampledb.Employee;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.service.ServiceConstants;
import com.wavemaker.runtime.service.ServiceManager;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;
import com.wavemaker.runtime.test.TestSpringContextTestCase;

/**
 * @author stoens
 * @author Jeremy Grelle
 * 
 */
public class TestDB2CRUD extends TestSpringContextTestCase {

    static class TestData {

        private String dependentTestName = null;

        private boolean skipRemaining = false;

        private DB2Sample db2sample = null;

        private Employee newEmployee = null;

        void setSkipRemaining(String dependentTestName) {
            this.skipRemaining = true;
            this.dependentTestName = dependentTestName;
        }

        boolean skipRemaining() {
            return this.skipRemaining;
        }

        String getDependentTestName() {
            return this.dependentTestName;
        }

    }

    protected static TestData testData;

    @BeforeClass
    public static void initData() {
        testData = new TestData();
    }

    protected void checkShouldSkip() {
        if (testData.skipRemaining) {
            throw new DependentTestFailureException(testData.getDependentTestName());
        }
    }

    @Test
    public void testCountEmployees() {

        try {

            ApplicationContext ctx = getApplicationContext();

            ServiceManager serviceMgr = (ServiceManager) ctx.getBean(ServiceConstants.SERVICE_MANAGER_NAME);

            DB2Sample db2 = (DB2Sample) ((ReflectServiceWire) serviceMgr.getServiceWire(DataServiceTestConstants.DB2_SAMPLE_BEAN_ID)).getServiceBean();

            assertEquals(Integer.valueOf(42), db2.getEmployeeCount());

            testData.db2sample = db2;

        } catch (Error ex) {
            testData.setSkipRemaining("testCountEmployees");
            throw ex;
        }
    }

    @Test
    public void testAddNewEmployee() {

        checkShouldSkip();

        Department department = new Department();
        department.setDeptno("A00");

        Employee employee = new Employee();

        employee.setEmpno("555000");
        employee.setFirstnme("f1");
        employee.setLastname("l1");
        employee.setEdlevel(Short.valueOf("1"));

        try {
            testData.db2sample.insertEmployee(employee);
        } catch (RuntimeException ex) {
            testData.setSkipRemaining("testAddNewEmployee");
            throw ex;
        }
    }

    @Test
    public void testFindNewEmployee() {

        checkShouldSkip();

        Employee qbe = new Employee();

        qbe.setFirstnme("f1");
        qbe.setLastname("l1");

        try {

            List<Employee> l = testData.db2sample.getEmployeeList(qbe);

            assertTrue(l.size() == 1);

            assertEquals("555000", l.get(0).getEmpno());

            testData.newEmployee = l.get(0);

        } catch (RuntimeException ex) {
            testData.setSkipRemaining("testFindNewEmployee");
            throw ex;
        }

    }

    @Test
    public void testDeleteNewEmployee() {

        checkShouldSkip();

        testData.db2sample.deleteEmployee(testData.newEmployee);

    }

    @Test
    public void testConnection() throws IOException {

        File props = ClassLoaderUtils.getClasspathFile("db2sample.properties").getFile();

        Properties p = DataServiceUtils.loadDBProperties(props);

        TestDBConnection t = new TestDBConnection();
        t.setProperties(p);
        t.run();
    }

}
