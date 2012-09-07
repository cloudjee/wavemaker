
package com.sampledatadb.data;

import java.util.HashSet;
import java.util.Set;


/**
 *  sampledataDB.Department
 *  09/15/2011 08:52:08
 * 
 */
public class Department {

    private Integer deptid;
    private String name;
    private Integer budget;
    private Integer q1;
    private Integer q2;
    private Integer q3;
    private Integer q4;
    private String deptcode;
    private String location;
    private Integer tenantid;
    private Set<com.sampledatadb.data.Employee> employees = new HashSet<com.sampledatadb.data.Employee>();

    public Integer getDeptid() {
        return deptid;
    }

    public void setDeptid(Integer deptid) {
        this.deptid = deptid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getBudget() {
        return budget;
    }

    public void setBudget(Integer budget) {
        this.budget = budget;
    }

    public Integer getQ1() {
        return q1;
    }

    public void setQ1(Integer q1) {
        this.q1 = q1;
    }

    public Integer getQ2() {
        return q2;
    }

    public void setQ2(Integer q2) {
        this.q2 = q2;
    }

    public Integer getQ3() {
        return q3;
    }

    public void setQ3(Integer q3) {
        this.q3 = q3;
    }

    public Integer getQ4() {
        return q4;
    }

    public void setQ4(Integer q4) {
        this.q4 = q4;
    }

    public String getDeptcode() {
        return deptcode;
    }

    public void setDeptcode(String deptcode) {
        this.deptcode = deptcode;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getTenantid() {
        return tenantid;
    }

    public void setTenantid(Integer tenantid) {
        this.tenantid = tenantid;
    }

    public Set<com.sampledatadb.data.Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(Set<com.sampledatadb.data.Employee> employees) {
        this.employees = employees;
    }

}
