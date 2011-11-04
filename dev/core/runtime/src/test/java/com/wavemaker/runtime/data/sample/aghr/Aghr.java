/*
 *  Copyright (C) 2009 WaveMaker Software, Inc.
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

package com.wavemaker.runtime.data.sample.aghr;

import java.util.List;

import org.apache.log4j.NDC;

import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.runtime.data.DataServiceManager;
import com.wavemaker.runtime.data.DataServiceManagerAccess;
import com.wavemaker.runtime.data.QueryOptions;
import com.wavemaker.runtime.data.TaskManager;

/**
 * Generated for Service "aghr" on 08/28/2007 16:37:08
 */
@SuppressWarnings({ "unchecked" })
public class Aghr implements DataServiceManagerAccess {

    private DataServiceManager dsMgr;

    private TaskManager taskMgr;

    public void insertCompkey(Compkey compkey) {
        try {
            NDC.push("Aghr.insertCompkey");
            this.dsMgr.invoke(this.taskMgr.getInsertTask(), compkey);
        } finally {
            NDC.pop();
        }
    }

    public Compkey getCompkeyById(CompkeyId id) {
        try {
            NDC.push("Aghr.getCompkeyById");
            List<Compkey> rtn = (List<Compkey>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getCompkeyById", id);
            if (rtn.isEmpty()) {
                return null;
            } else {
                return rtn.get(0);
            }
        } finally {
            NDC.pop();
        }
    }

    public List<Compkey> getCompkeyList(Compkey searchInstance, QueryOptions options) {
        try {
            NDC.push("Aghr.getCompkeyList");
            return (List<Compkey>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
        } finally {
            NDC.pop();
        }
    }

    public Integer getCompkeyCount(Compkey searchInstance, QueryOptions options) {
        try {
            NDC.push("Aghr.getCompkeyCount");
            return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
        } finally {
            NDC.pop();
        }
    }

    public void updateCompkey(Compkey compkey) {
        try {
            NDC.push("Aghr.updateCompkey");
            this.dsMgr.invoke(this.taskMgr.getUpdateTask(), compkey);
        } finally {
            NDC.pop();
        }
    }

    public void deleteCompkey(Compkey compkey) {
        try {
            NDC.push("Aghr.deleteCompkey");
            this.dsMgr.invoke(this.taskMgr.getDeleteTask(), compkey);
        } finally {
            NDC.pop();
        }
    }

    public void insertEmployee(Employee employee) {
        try {
            NDC.push("Aghr.insertEmployee");
            this.dsMgr.invoke(this.taskMgr.getInsertTask(), employee);
        } finally {
            NDC.pop();
        }
    }

    public Person insertPerson(Person person) {
        return (Person) this.dsMgr.invoke(this.taskMgr.getInsertTask(), person);
    }

    public void deletePerson(Person person) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), person);
    }

    public Employee getEmployeeById(Short id) {
        try {
            NDC.push("Aghr.getEmployeeById");
            List<Employee> rtn = (List<Employee>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getEmployeeById", id);
            if (rtn.isEmpty()) {
                return null;
            } else {
                return rtn.get(0);
            }
        } finally {
            NDC.pop();
        }
    }

    public List<Employee> getEmployeeList(Employee searchInstance, QueryOptions options) {
        try {
            NDC.push("Aghr.getEmployeeList");
            return (List<Employee>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
        } finally {
            NDC.pop();
        }
    }

    public Integer getEmployeeCount(Employee searchInstance, QueryOptions options) {
        try {
            NDC.push("Aghr.getEmployeeCount");
            return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
        } finally {
            NDC.pop();
        }
    }

    public void updateEmployee(Employee employee) {
        try {
            NDC.push("Aghr.updateEmployee");
            this.dsMgr.invoke(this.taskMgr.getUpdateTask(), employee);
        } finally {
            NDC.pop();
        }
    }

    public void deleteEmployee(Employee employee) {
        try {
            NDC.push("Aghr.deleteEmployee");
            this.dsMgr.invoke(this.taskMgr.getDeleteTask(), employee);
        } finally {
            NDC.pop();
        }
    }

    @Override
    public DataServiceManager getDataServiceManager() {
        return this.dsMgr;
    }

    public void setDataServiceManager(DataServiceManager dsMgr) {
        this.dsMgr = dsMgr;
    }

    public TaskManager getTaskManager() {
        return this.taskMgr;
    }

    public void setTaskManager(TaskManager taskMgr) {
        this.taskMgr = taskMgr;
    }

    public void begin() {
        try {
            NDC.push("Aghr.begin");
            this.dsMgr.begin();
        } finally {
            NDC.pop();
        }
    }

    public void commit() {
        try {
            NDC.push("Aghr.commit");
            this.dsMgr.commit();
        } finally {
            NDC.pop();
        }
    }

    public void rollback() {
        try {
            NDC.push("Aghr.rollback");
            this.dsMgr.rollback();
        } finally {
            NDC.pop();
        }
    }

    public final static void main(String[] args) {
        String cfg = "aghr.spring.xml";
        String beanName = "aghr";
        Aghr s = (Aghr) SpringUtils.getBean(cfg, beanName);
        System.out.print("getCompkeyCount: ");
        System.out.println(s.getCompkeyCount(new Compkey(), new QueryOptions()));
    }

}
