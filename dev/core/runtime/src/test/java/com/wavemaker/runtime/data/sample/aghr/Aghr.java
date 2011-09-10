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

import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.runtime.data.DataServiceManager;
import com.wavemaker.runtime.data.DataServiceManagerAccess;
import com.wavemaker.runtime.data.QueryOptions;
import com.wavemaker.runtime.data.TaskManager;

import org.apache.log4j.NDC;


/**
 * Generated for Service "aghr" on 08/28/2007 16:37:08
 * 
 */
@SuppressWarnings({"unchecked"})
public class Aghr
    implements DataServiceManagerAccess
{

    private DataServiceManager dsMgr;
    private TaskManager taskMgr;

    public void insertCompkey(Compkey compkey) {
        try {
            NDC.push("Aghr.insertCompkey");
            dsMgr.invoke(taskMgr.getInsertTask(), compkey);
        } finally {
            NDC.pop();
        }
    }

    public Compkey getCompkeyById(CompkeyId id) {
        try {
            NDC.push("Aghr.getCompkeyById");
            List<Compkey> rtn = ((List<Compkey>) dsMgr.invoke(taskMgr.getQueryTask(), "getCompkeyById", id));
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
            return ((List<Compkey> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
        } finally {
            NDC.pop();
        }
    }

    public Integer getCompkeyCount(Compkey searchInstance, QueryOptions options) {
        try {
            NDC.push("Aghr.getCompkeyCount");
            return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
        } finally {
            NDC.pop();
        }
    }

    public void updateCompkey(Compkey compkey) {
        try {
            NDC.push("Aghr.updateCompkey");
            dsMgr.invoke(taskMgr.getUpdateTask(), compkey);
        } finally {
            NDC.pop();
        }
    }

    public void deleteCompkey(Compkey compkey) {
        try {
            NDC.push("Aghr.deleteCompkey");
            dsMgr.invoke(taskMgr.getDeleteTask(), compkey);
        } finally {
            NDC.pop();
        }
    }

    public void insertEmployee(Employee employee) {
        try {
            NDC.push("Aghr.insertEmployee");
            dsMgr.invoke(taskMgr.getInsertTask(), employee);
        } finally {
            NDC.pop();
        }
    }

    public Person insertPerson(Person person) {
        return (Person)dsMgr.invoke(taskMgr.getInsertTask(), person);
    }

    public void deletePerson(Person person) {
        dsMgr.invoke(taskMgr.getDeleteTask(), person);
    }

    public Employee getEmployeeById(Short id) {
        try {
            NDC.push("Aghr.getEmployeeById");
            List<Employee> rtn = ((List<Employee>) dsMgr.invoke(taskMgr.getQueryTask(), "getEmployeeById", id));
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
            return ((List<Employee> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
        } finally {
            NDC.pop();
        }
    }

    public Integer getEmployeeCount(Employee searchInstance, QueryOptions options) {
        try {
            NDC.push("Aghr.getEmployeeCount");
            return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
        } finally {
            NDC.pop();
        }
    }

    public void updateEmployee(Employee employee) {
        try {
            NDC.push("Aghr.updateEmployee");
            dsMgr.invoke(taskMgr.getUpdateTask(), employee);
        } finally {
            NDC.pop();
        }
    }

    public void deleteEmployee(Employee employee) {
        try {
            NDC.push("Aghr.deleteEmployee");
            dsMgr.invoke(taskMgr.getDeleteTask(), employee);
        } finally {
            NDC.pop();
        }
    }

    public DataServiceManager getDataServiceManager() {
        return dsMgr;
    }

    public void setDataServiceManager(DataServiceManager dsMgr) {
        this.dsMgr = dsMgr;
    }

    public TaskManager getTaskManager() {
        return taskMgr;
    }

    public void setTaskManager(TaskManager taskMgr) {
        this.taskMgr = taskMgr;
    }

    public void begin() {
        try {
            NDC.push("Aghr.begin");
            dsMgr.begin();
        } finally {
            NDC.pop();
        }
    }

    public void commit() {
        try {
            NDC.push("Aghr.commit");
            dsMgr.commit();
        } finally {
            NDC.pop();
        }
    }

    public void rollback() {
        try {
            NDC.push("Aghr.rollback");
            dsMgr.rollback();
        } finally {
            NDC.pop();
        }
    }

    public final static void main(String[] args) {
        String cfg = "aghr.spring.xml";
        String beanName = "aghr";
        Aghr s = ((Aghr) SpringUtils.getBean(cfg, beanName));
        System.out.print("getCompkeyCount: ");
        System.out.println(s.getCompkeyCount(new Compkey(), new QueryOptions()));
    }

}
