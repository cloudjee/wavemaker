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

package com.wavemaker.runtime.data;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.junit.Test;
import org.springframework.context.ApplicationContext;

import com.wavemaker.runtime.data.sample.aghr.Aghr;
import com.wavemaker.runtime.data.sample.aghr.Compkey;
import com.wavemaker.runtime.data.sample.aghr.CompkeyId;
import com.wavemaker.runtime.data.sample.aghr.Employee;
import com.wavemaker.runtime.data.sample.aghr.Person;
import com.wavemaker.runtime.service.ServiceConstants;
import com.wavemaker.runtime.service.ServiceManager;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class TestAghrCRUD extends RuntimeDataSpringContextTestCase {

    @Test
    public void testGetAllEmployees() {

        Aghr aghr = getAghr();

        aghr.getDataServiceManager().begin();

        Session session = aghr.getDataServiceManager().getSession();
        assertTrue("Session cannot be null", session != null);

        Integer numEmployees = (Integer) session.createCriteria(Employee.class).setProjection(Projections.rowCount()).uniqueResult();

        aghr.getDataServiceManager().rollback();

        // get all employees using service class list operation
        List<Employee> employees = aghr.getEmployeeList(new Employee(), new QueryOptions());

        assertTrue(employees.size() == numEmployees.intValue());
    }

    @Test
    public void testCount() {
        assertTrue(getAghr().getEmployeeCount(new Employee(), new QueryOptions()).equals(Integer.valueOf("4")));
    }

    @Test
    public void testPageCompkey() {
        QueryOptions options = new QueryOptions(1, 0);
        List<Compkey> l = getAghr().getCompkeyList(new Compkey(), options);
        assertTrue(l.get(0).getName().equals("name1"));
    }

    @Test
    public void testGetCompKeyById() {
        Compkey k = getAghr().getCompkeyById(new CompkeyId((short) 0, (short) 1));
        assertTrue(k.getName().equals("name2"));
    }

    // MAV-2065
    @Test
    public void testInsertDuplicatePK() {
        Aghr aghr = getAghr();
        Person p = new Person();
        p.setId(Short.valueOf("1"));
        p.setLastName("Fu");
        ThreadContext.setPreProcessorTask(DefaultTaskManager.getInstance().getPreProcessorRouterTask());
        try {
            aghr.insertPerson(p);

            try {
                aghr.insertPerson(p);
                fail("Second insert should have caused a " + "\"key already exists\" exception");
            } catch (RuntimeException ex) {
                // ok
            }

        } finally {
            ThreadContext.unsetPreProcessorTask();
            try {
                aghr.deletePerson(p);
            } catch (RuntimeException ignore) {
            }
        }
    }

    private Aghr getAghr() {
        ApplicationContext ctx = getApplicationContext();
        ServiceManager serviceMgr = (ServiceManager) ctx.getBean(ServiceConstants.SERVICE_MANAGER_NAME);

        return (Aghr) ((ReflectServiceWire) serviceMgr.getServiceWire(DataServiceTestConstants.AG_HR_SERVICE_ID)).getServiceBean();
    }
}
