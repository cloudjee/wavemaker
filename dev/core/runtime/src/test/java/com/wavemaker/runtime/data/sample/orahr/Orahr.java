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

package com.wavemaker.runtime.data.sample.orahr;

import java.math.BigDecimal;
import java.util.List;

import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.runtime.data.DataServiceManager;
import com.wavemaker.runtime.data.DataServiceManagerAccess;
import com.wavemaker.runtime.data.DefaultTaskManager;
import com.wavemaker.runtime.data.QueryOptions;
import com.wavemaker.runtime.data.TaskManager;

/**
 * Generated for Service "orahr" on 08/19/2007 21:06:53
 * 
 */
@SuppressWarnings({ "unchecked" })
public class Orahr implements DataServiceManagerAccess {

    private final DataServiceManager ds;

    private final TaskManager taskMgr = DefaultTaskManager.getInstance();

    public Orahr(DataServiceManager ds) {
        this.ds = ds;
    }

    public void insertCountries(Countries countries) {
        this.ds.invoke(this.taskMgr.getInsertTask(), countries);
    }

    public Countries getCountriesById(String id) {
        List<Countries> rtn = (List<Countries>) this.ds.invoke(this.taskMgr.getQueryTask(), "getCountriesById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Countries> getCountriesList(Countries searchInstance, QueryOptions options) {
        return (List<Countries>) this.ds.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public Integer getCountriesCount(Countries searchInstance, QueryOptions options) {
        return (Integer) this.ds.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public void updateCountries(Countries countries) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), countries);
    }

    public void deleteCountries(Countries countries) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), countries);
    }

    public void insertDepartments(Departments departments) {
        this.ds.invoke(this.taskMgr.getInsertTask(), departments);
    }

    public Departments getDepartmentsById(Short id) {
        List<Departments> rtn = (List<Departments>) this.ds.invoke(this.taskMgr.getQueryTask(), "getDepartmentsById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Departments> getDepartmentsList(Departments searchInstance, QueryOptions options) {
        return (List<Departments>) this.ds.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public Integer getDepartmentsCount(Departments searchInstance, QueryOptions options) {
        return (Integer) this.ds.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public void updateDepartments(Departments departments) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), departments);
    }

    public void deleteDepartments(Departments departments) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), departments);
    }

    public void insertEmpDetailsView(EmpDetailsView empDetailsView) {
        this.ds.invoke(this.taskMgr.getInsertTask(), empDetailsView);
    }

    public EmpDetailsView getEmpDetailsViewById(EmpDetailsViewId id) {
        List<EmpDetailsView> rtn = (List<EmpDetailsView>) this.ds.invoke(this.taskMgr.getQueryTask(), "getEmpDetailsViewById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<EmpDetailsView> getEmpDetailsViewList(EmpDetailsView searchInstance, QueryOptions options) {
        return (List<EmpDetailsView>) this.ds.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public Integer getEmpDetailsViewCount(EmpDetailsView searchInstance, QueryOptions options) {
        return (Integer) this.ds.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public void updateEmpDetailsView(EmpDetailsView empDetailsView) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), empDetailsView);
    }

    public void deleteEmpDetailsView(EmpDetailsView empDetailsView) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), empDetailsView);
    }

    public void insertEmployees(Employees employees) {
        this.ds.invoke(this.taskMgr.getInsertTask(), employees);
    }

    public Employees getEmployeesById(Integer id) {
        List<Employees> rtn = (List<Employees>) this.ds.invoke(this.taskMgr.getQueryTask(), "getEmployeesById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Employees> getEmployeesList(Employees searchInstance, QueryOptions options) {
        return (List<Employees>) this.ds.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public Integer getEmployeesCount(Employees searchInstance, QueryOptions options) {
        return (Integer) this.ds.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public void updateEmployees(Employees employees) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), employees);
    }

    public void deleteEmployees(Employees employees) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), employees);
    }

    public void insertJobHistory(JobHistory jobHistory) {
        this.ds.invoke(this.taskMgr.getInsertTask(), jobHistory);
    }

    public JobHistory getJobHistoryById(JobHistoryId id) {
        List<JobHistory> rtn = (List<JobHistory>) this.ds.invoke(this.taskMgr.getQueryTask(), "getJobHistoryById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<JobHistory> getJobHistoryList(JobHistory searchInstance, QueryOptions options) {
        return (List<JobHistory>) this.ds.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public Integer getJobHistoryCount(JobHistory searchInstance, QueryOptions options) {
        return (Integer) this.ds.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public void updateJobHistory(JobHistory jobHistory) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), jobHistory);
    }

    public void deleteJobHistory(JobHistory jobHistory) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), jobHistory);
    }

    public void insertJobs(Jobs jobs) {
        this.ds.invoke(this.taskMgr.getInsertTask(), jobs);
    }

    public Jobs getJobsById(String id) {
        List<Jobs> rtn = (List<Jobs>) this.ds.invoke(this.taskMgr.getQueryTask(), "getJobsById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Jobs> getJobsList(Jobs searchInstance, QueryOptions options) {
        return (List<Jobs>) this.ds.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public Integer getJobsCount(Jobs searchInstance, QueryOptions options) {
        return (Integer) this.ds.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public void updateJobs(Jobs jobs) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), jobs);
    }

    public void deleteJobs(Jobs jobs) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), jobs);
    }

    public void insertLocations(Locations locations) {
        this.ds.invoke(this.taskMgr.getInsertTask(), locations);
    }

    public Locations getLocationsById(Short id) {
        List<Locations> rtn = (List<Locations>) this.ds.invoke(this.taskMgr.getQueryTask(), "getLocationsById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Locations> getLocationsList(Locations searchInstance, QueryOptions options) {
        return (List<Locations>) this.ds.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public Integer getLocationsCount(Locations searchInstance, QueryOptions options) {
        return (Integer) this.ds.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public void updateLocations(Locations locations) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), locations);
    }

    public void deleteLocations(Locations locations) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), locations);
    }

    public void insertRegions(Regions regions) {
        this.ds.invoke(this.taskMgr.getInsertTask(), regions);
    }

    public Regions getRegionsById(BigDecimal id) {
        List<Regions> rtn = (List<Regions>) this.ds.invoke(this.taskMgr.getQueryTask(), "getRegionsById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Regions> getRegionsList(Regions searchInstance, QueryOptions options) {
        return (List<Regions>) this.ds.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public Integer getRegionsCount(Regions searchInstance, QueryOptions options) {
        return (Integer) this.ds.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public void updateRegions(Regions regions) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), regions);
    }

    public void deleteRegions(Regions regions) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), regions);
    }

    @Override
    public DataServiceManager getDataServiceManager() {
        return this.ds;
    }

    public final static void main(String[] args) {
        String cfg = "orahr.spring.xml";
        String beanName = "orahr";
        Orahr s = (Orahr) SpringUtils.getBean(cfg, beanName);
        System.out.print("getCountriesCount: ");
        System.out.println(s.getCountriesCount(new Countries(), new QueryOptions()));
    }

}
