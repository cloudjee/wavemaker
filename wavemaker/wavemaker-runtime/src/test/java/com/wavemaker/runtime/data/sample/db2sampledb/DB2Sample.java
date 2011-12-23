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

package com.wavemaker.runtime.data.sample.db2sampledb;

import java.util.List;

import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.runtime.data.DataServiceManager;
import com.wavemaker.runtime.data.DataServiceManagerAccess;
import com.wavemaker.runtime.data.QueryOptions;
import com.wavemaker.runtime.data.TaskManager;

/**
 * Generated for service "db2sample" on 02/07/2008 13:48:00
 */
@SuppressWarnings({ "unchecked" })
public class DB2Sample implements DataServiceManagerAccess {

    private DataServiceManager dsMgr;

    private TaskManager taskMgr;

    public Integer getCustomerCount(Customer searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Customer();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getCustomerCount(Customer searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Customer();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getCustomerCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Customer.class);
    }

    public List<Org> getOrgList(Org searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Org();
        }
        return (List<Org>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Org> getOrgList(Org searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Org();
        }
        return (List<Org>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Org> getOrgList() {
        return (List<Org>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Org.class);
    }

    public List<Vastrde2> getVastrde2List(Vastrde2 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde2();
        }
        return (List<Vastrde2>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vastrde2> getVastrde2List(Vastrde2 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde2();
        }
        return (List<Vastrde2>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vastrde2> getVastrde2List() {
        return (List<Vastrde2>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vastrde2.class);
    }

    public void deleteVphone(Vphone vphone) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vphone);
    }

    public void deleteInTray(InTray inTray) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), inTray);
    }

    public Customer insertCustomer(Customer customer) {
        return (Customer) this.dsMgr.invoke(this.taskMgr.getInsertTask(), customer);
    }

    public void deleteEmployee(Employee employee) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), employee);
    }

    public Vprojre1 insertVprojre1(Vprojre1 vprojre1) {
        return (Vprojre1) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vprojre1);
    }

    public List<Productsupplier> getProductsupplierList(Productsupplier searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Productsupplier();
        }
        return (List<Productsupplier>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Productsupplier> getProductsupplierList(Productsupplier searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Productsupplier();
        }
        return (List<Productsupplier>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Productsupplier> getProductsupplierList() {
        return (List<Productsupplier>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Productsupplier.class);
    }

    public Integer getVdepmg1Count(Vdepmg1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vdepmg1();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVdepmg1Count(Vdepmg1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vdepmg1();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVdepmg1Count() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vdepmg1.class);
    }

    public Integer getVhdeptCount(Vhdept searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vhdept();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVhdeptCount(Vhdept searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vhdept();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVhdeptCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vhdept.class);
    }

    public List<Sales> getSalesList(Sales searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Sales();
        }
        return (List<Sales>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Sales> getSalesList(Sales searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Sales();
        }
        return (List<Sales>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Sales> getSalesList() {
        return (List<Sales>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Sales.class);
    }

    public void updatePurchaseorder(Purchaseorder purchaseorder) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), purchaseorder);
    }

    public void updateVprojact(Vprojact vprojact) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vprojact);
    }

    public void updateProductsupplier(Productsupplier productsupplier) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), productsupplier);
    }

    public void deleteVemp(Vemp vemp) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vemp);
    }

    public Projact getProjactById(ProjactId id) {
        List<Projact> rtn = (List<Projact>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getProjactById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Staff getStaffById(StaffId id) {
        List<Staff> rtn = (List<Staff>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getStaffById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Vastrde1 getVastrde1ById(Vastrde1Id id) {
        List<Vastrde1> rtn = (List<Vastrde1>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVastrde1ById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Vastrde1 insertVastrde1(Vastrde1 vastrde1) {
        return (Vastrde1) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vastrde1);
    }

    public Project insertProject(Project project) {
        return (Project) this.dsMgr.invoke(this.taskMgr.getInsertTask(), project);
    }

    public Act getActById(Short id) {
        List<Act> rtn = (List<Act>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getActById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Integer getEmpPhotoCount(EmpPhoto searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.EmpPhoto();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getEmpPhotoCount(EmpPhoto searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.EmpPhoto();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getEmpPhotoCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), EmpPhoto.class);
    }

    public Integer getStaffCount(Staff searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Staff();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getStaffCount(Staff searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Staff();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getStaffCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Staff.class);
    }

    public Integer getVempprojactCount(Vempprojact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vempprojact();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVempprojactCount(Vempprojact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vempprojact();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVempprojactCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vempprojact.class);
    }

    public void updateVprojre1(Vprojre1 vprojre1) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vprojre1);
    }

    public void updateVphone(Vphone vphone) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vphone);
    }

    public void deleteEmpprojact(Empprojact empprojact) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), empprojact);
    }

    public List<Vdept> getVdeptList(Vdept searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vdept();
        }
        return (List<Vdept>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vdept> getVdeptList(Vdept searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vdept();
        }
        return (List<Vdept>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vdept> getVdeptList() {
        return (List<Vdept>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vdept.class);
    }

    public Catalog getCatalogById(String id) {
        List<Catalog> rtn = (List<Catalog>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getCatalogById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void deleteCatalog(Catalog catalog) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), catalog);
    }

    public Vastrde2 insertVastrde2(Vastrde2 vastrde2) {
        return (Vastrde2) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vastrde2);
    }

    public Integer getProjactCount(Projact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Projact();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getProjactCount(Projact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Projact();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getProjactCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Projact.class);
    }

    public void deleteVproj(Vproj vproj) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vproj);
    }

    public void updateAct(Act act) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), act);
    }

    public Integer getEmpmdcCount(Empmdc searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empmdc();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getEmpmdcCount(Empmdc searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empmdc();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getEmpmdcCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Empmdc.class);
    }

    public void deleteCustomer(Customer customer) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), customer);
    }

    public Vstafac2 getVstafac2ById(Vstafac2Id id) {
        List<Vstafac2> rtn = (List<Vstafac2>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVstafac2ById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Sales insertSales(Sales sales) {
        return (Sales) this.dsMgr.invoke(this.taskMgr.getInsertTask(), sales);
    }

    public void deleteProject(Project project) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), project);
    }

    public void deleteVstafac1(Vstafac1 vstafac1) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vstafac1);
    }

    public Vdept insertVdept(Vdept vdept) {
        return (Vdept) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vdept);
    }

    public Vemplp getVemplpById(VemplpId id) {
        List<Vemplp> rtn = (List<Vemplp>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVemplpById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public EmpPhoto getEmpPhotoById(EmpPhotoId id) {
        List<EmpPhoto> rtn = (List<EmpPhoto>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getEmpPhotoById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Vproj insertVproj(Vproj vproj) {
        return (Vproj) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vproj);
    }

    public Integer getProductsupplierCount(Productsupplier searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Productsupplier();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getProductsupplierCount(Productsupplier searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Productsupplier();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getProductsupplierCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Productsupplier.class);
    }

    public void deleteEmpResume(EmpResume empResume) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), empResume);
    }

    public void deleteVempdpt1(Vempdpt1 vempdpt1) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vempdpt1);
    }

    public Foo1 insertFoo1(Foo1 foo1) {
        return (Foo1) this.dsMgr.invoke(this.taskMgr.getInsertTask(), foo1);
    }

    public Department getDepartmentById(String id) {
        List<Department> rtn = (List<Department>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getDepartmentById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Productsupplier getProductsupplierById(ProductsupplierId id) {
        List<Productsupplier> rtn = (List<Productsupplier>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getProductsupplierById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateVempdpt1(Vempdpt1 vempdpt1) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vempdpt1);
    }

    public List<Vempprojact> getVempprojactList(Vempprojact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vempprojact();
        }
        return (List<Vempprojact>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vempprojact> getVempprojactList(Vempprojact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vempprojact();
        }
        return (List<Vempprojact>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vempprojact> getVempprojactList() {
        return (List<Vempprojact>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vempprojact.class);
    }

    public Integer getClSchedCount(ClSched searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.ClSched();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getClSchedCount(ClSched searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.ClSched();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getClSchedCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), ClSched.class);
    }

    public void updateEmpPhoto(EmpPhoto empPhoto) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), empPhoto);
    }

    public Integer getProjectCount(Project searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Project();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getProjectCount(Project searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Project();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getProjectCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Project.class);
    }

    public Purchaseorder getPurchaseorderById(Long id) {
        List<Purchaseorder> rtn = (List<Purchaseorder>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getPurchaseorderById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void deletePurchaseorder(Purchaseorder purchaseorder) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), purchaseorder);
    }

    public Vempprojact getVempprojactById(VempprojactId id) {
        List<Vempprojact> rtn = (List<Vempprojact>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVempprojactById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Productsupplier insertProductsupplier(Productsupplier productsupplier) {
        return (Productsupplier) this.dsMgr.invoke(this.taskMgr.getInsertTask(), productsupplier);
    }

    public List<Vemp> getVempList(Vemp searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vemp();
        }
        return (List<Vemp>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vemp> getVempList(Vemp searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vemp();
        }
        return (List<Vemp>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vemp> getVempList() {
        return (List<Vemp>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vemp.class);
    }

    public Suppliers insertSuppliers(Suppliers suppliers) {
        return (Suppliers) this.dsMgr.invoke(this.taskMgr.getInsertTask(), suppliers);
    }

    public List<Empprojact> getEmpprojactList(Empprojact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empprojact();
        }
        return (List<Empprojact>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Empprojact> getEmpprojactList(Empprojact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empprojact();
        }
        return (List<Empprojact>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Empprojact> getEmpprojactList() {
        return (List<Empprojact>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Empprojact.class);
    }

    public Vstafac2 insertVstafac2(Vstafac2 vstafac2) {
        return (Vstafac2) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vstafac2);
    }

    public Integer getVactCount(Vact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vact();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVactCount(Vact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vact();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVactCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vact.class);
    }

    public Integer getVdeptCount(Vdept searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vdept();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVdeptCount(Vdept searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vdept();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVdeptCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vdept.class);
    }

    public void updateVempprojact(Vempprojact vempprojact) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vempprojact);
    }

    public Vstafac1 insertVstafac1(Vstafac1 vstafac1) {
        return (Vstafac1) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vstafac1);
    }

    public Integer getSuppliersCount(Suppliers searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Suppliers();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getSuppliersCount(Suppliers searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Suppliers();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getSuppliersCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Suppliers.class);
    }

    public Purchaseorder insertPurchaseorder(Purchaseorder purchaseorder) {
        return (Purchaseorder) this.dsMgr.invoke(this.taskMgr.getInsertTask(), purchaseorder);
    }

    public Vdepmg1 insertVdepmg1(Vdepmg1 vdepmg1) {
        return (Vdepmg1) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vdepmg1);
    }

    public Vempdpt1 getVempdpt1ById(Vempdpt1Id id) {
        List<Vempdpt1> rtn = (List<Vempdpt1>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVempdpt1ById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Integer getVphoneCount(Vphone searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vphone();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVphoneCount(Vphone searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vphone();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVphoneCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vphone.class);
    }

    public void updateCustomer(Customer customer) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), customer);
    }

    public void updateVpstrde1(Vpstrde1 vpstrde1) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vpstrde1);
    }

    public List<InTray> getInTrayList(InTray searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.InTray();
        }
        return (List<InTray>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<InTray> getInTrayList(InTray searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.InTray();
        }
        return (List<InTray>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<InTray> getInTrayList() {
        return (List<InTray>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), InTray.class);
    }

    public void deleteEmpmdc(Empmdc empmdc) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), empmdc);
    }

    public void updateVforpla(Vforpla vforpla) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vforpla);
    }

    public Project getProjectById(String id) {
        List<Project> rtn = (List<Project>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getProjectById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Vdepmg1> getVdepmg1List(Vdepmg1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vdepmg1();
        }
        return (List<Vdepmg1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vdepmg1> getVdepmg1List(Vdepmg1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vdepmg1();
        }
        return (List<Vdepmg1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vdepmg1> getVdepmg1List() {
        return (List<Vdepmg1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vdepmg1.class);
    }

    public InTray insertInTray(InTray inTray) {
        return (InTray) this.dsMgr.invoke(this.taskMgr.getInsertTask(), inTray);
    }

    public List<Vastrde1> getVastrde1List(Vastrde1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde1();
        }
        return (List<Vastrde1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vastrde1> getVastrde1List(Vastrde1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde1();
        }
        return (List<Vastrde1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vastrde1> getVastrde1List() {
        return (List<Vastrde1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vastrde1.class);
    }

    public Integer getVstafac1Count(Vstafac1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac1();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVstafac1Count(Vstafac1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac1();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVstafac1Count() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vstafac1.class);
    }

    public Vpstrde2 insertVpstrde2(Vpstrde2 vpstrde2) {
        return (Vpstrde2) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vpstrde2);
    }

    public List<Vprojre1> getVprojre1List(Vprojre1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vprojre1();
        }
        return (List<Vprojre1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vprojre1> getVprojre1List(Vprojre1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vprojre1();
        }
        return (List<Vprojre1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vprojre1> getVprojre1List() {
        return (List<Vprojre1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vprojre1.class);
    }

    public EmpResume insertEmpResume(EmpResume empResume) {
        return (EmpResume) this.dsMgr.invoke(this.taskMgr.getInsertTask(), empResume);
    }

    public Vforpla insertVforpla(Vforpla vforpla) {
        return (Vforpla) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vforpla);
    }

    public List<Vhdept> getVhdeptList(Vhdept searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vhdept();
        }
        return (List<Vhdept>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vhdept> getVhdeptList(Vhdept searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vhdept();
        }
        return (List<Vhdept>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vhdept> getVhdeptList() {
        return (List<Vhdept>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vhdept.class);
    }

    public List<Vemplp> getVemplpList(Vemplp searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vemplp();
        }
        return (List<Vemplp>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vemplp> getVemplpList(Vemplp searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vemplp();
        }
        return (List<Vemplp>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vemplp> getVemplpList() {
        return (List<Vemplp>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vemplp.class);
    }

    public void deleteFoo1(Foo1 foo1) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), foo1);
    }

    public void deleteOrg(Org org) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), org);
    }

    public void deleteVemplp(Vemplp vemplp) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vemplp);
    }

    public Empmdc getEmpmdcById(EmpmdcId id) {
        List<Empmdc> rtn = (List<Empmdc>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getEmpmdcById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateVact(Vact vact) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vact);
    }

    public void updateSales(Sales sales) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), sales);
    }

    public EmpPhoto insertEmpPhoto(EmpPhoto empPhoto) {
        return (EmpPhoto) this.dsMgr.invoke(this.taskMgr.getInsertTask(), empPhoto);
    }

    public List<Vact> getVactList(Vact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vact();
        }
        return (List<Vact>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vact> getVactList(Vact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vact();
        }
        return (List<Vact>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vact> getVactList() {
        return (List<Vact>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vact.class);
    }

    public List<Vstafac2> getVstafac2List(Vstafac2 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac2();
        }
        return (List<Vstafac2>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vstafac2> getVstafac2List(Vstafac2 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac2();
        }
        return (List<Vstafac2>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vstafac2> getVstafac2List() {
        return (List<Vstafac2>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vstafac2.class);
    }

    public Vhdept insertVhdept(Vhdept vhdept) {
        return (Vhdept) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vhdept);
    }

    public List<Product> getProductList(Product searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Product();
        }
        return (List<Product>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Product> getProductList(Product searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Product();
        }
        return (List<Product>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Product> getProductList() {
        return (List<Product>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Product.class);
    }

    public Act insertAct(Act act) {
        return (Act) this.dsMgr.invoke(this.taskMgr.getInsertTask(), act);
    }

    public Integer getDepartmentCount(Department searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Department();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getDepartmentCount(Department searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Department();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getDepartmentCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Department.class);
    }

    public Vact insertVact(Vact vact) {
        return (Vact) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vact);
    }

    public Integer getVforplaCount(Vforpla searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vforpla();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVforplaCount(Vforpla searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vforpla();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVforplaCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vforpla.class);
    }

    public void deleteVprojact(Vprojact vprojact) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vprojact);
    }

    public void deleteSuppliers(Suppliers suppliers) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), suppliers);
    }

    public List<Vphone> getVphoneList(Vphone searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vphone();
        }
        return (List<Vphone>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vphone> getVphoneList(Vphone searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vphone();
        }
        return (List<Vphone>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vphone> getVphoneList() {
        return (List<Vphone>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vphone.class);
    }

    public void updateVastrde2(Vastrde2 vastrde2) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vastrde2);
    }

    public List<Customer> getCustomerList(Customer searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Customer();
        }
        return (List<Customer>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Customer> getCustomerList(Customer searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Customer();
        }
        return (List<Customer>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Customer> getCustomerList() {
        return (List<Customer>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Customer.class);
    }

    public List<Employee> getEmployeeList(Employee searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Employee();
        }
        return (List<Employee>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Employee> getEmployeeList(Employee searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Employee();
        }
        return (List<Employee>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Employee> getEmployeeList() {
        return (List<Employee>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Employee.class);
    }

    public void updateVastrde1(Vastrde1 vastrde1) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vastrde1);
    }

    public Integer getVemplpCount(Vemplp searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vemplp();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVemplpCount(Vemplp searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vemplp();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVemplpCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vemplp.class);
    }

    public Integer getEmpprojactCount(Empprojact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empprojact();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getEmpprojactCount(Empprojact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empprojact();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getEmpprojactCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Empprojact.class);
    }

    public void deleteAct(Act act) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), act);
    }

    public Vastrde2 getVastrde2ById(Vastrde2Id id) {
        List<Vastrde2> rtn = (List<Vastrde2>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVastrde2ById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Vpstrde1> getVpstrde1List(Vpstrde1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vpstrde1();
        }
        return (List<Vpstrde1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vpstrde1> getVpstrde1List(Vpstrde1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vpstrde1();
        }
        return (List<Vpstrde1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vpstrde1> getVpstrde1List() {
        return (List<Vpstrde1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vpstrde1.class);
    }

    public List<Staff> getStaffList(Staff searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Staff();
        }
        return (List<Staff>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Staff> getStaffList(Staff searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Staff();
        }
        return (List<Staff>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Staff> getStaffList() {
        return (List<Staff>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Staff.class);
    }

    public Org getOrgById(OrgId id) {
        List<Org> rtn = (List<Org>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getOrgById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Purchaseorder> getPurchaseorderList(Purchaseorder searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Purchaseorder();
        }
        return (List<Purchaseorder>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Purchaseorder> getPurchaseorderList(Purchaseorder searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Purchaseorder();
        }
        return (List<Purchaseorder>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Purchaseorder> getPurchaseorderList() {
        return (List<Purchaseorder>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Purchaseorder.class);
    }

    public void deleteVempprojact(Vempprojact vempprojact) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vempprojact);
    }

    public void updateDepartment(Department department) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), department);
    }

    public Inventory getInventoryById(String id) {
        List<Inventory> rtn = (List<Inventory>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getInventoryById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateInventory(Inventory inventory) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), inventory);
    }

    public List<Act> getActList(Act searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Act();
        }
        return (List<Act>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Act> getActList(Act searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Act();
        }
        return (List<Act>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Act> getActList() {
        return (List<Act>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Act.class);
    }

    public Vemplp insertVemplp(Vemplp vemplp) {
        return (Vemplp) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vemplp);
    }

    public Integer getEmployeeCount(Employee searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Employee();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getEmployeeCount(Employee searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Employee();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getEmployeeCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Employee.class);
    }

    public List<Catalog> getCatalogList(Catalog searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Catalog();
        }
        return (List<Catalog>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Catalog> getCatalogList(Catalog searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Catalog();
        }
        return (List<Catalog>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Catalog> getCatalogList() {
        return (List<Catalog>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Catalog.class);
    }

    public Integer getPurchaseorderCount(Purchaseorder searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Purchaseorder();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getPurchaseorderCount(Purchaseorder searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Purchaseorder();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getPurchaseorderCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Purchaseorder.class);
    }

    public Org insertOrg(Org org) {
        return (Org) this.dsMgr.invoke(this.taskMgr.getInsertTask(), org);
    }

    public void deleteVastrde1(Vastrde1 vastrde1) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vastrde1);
    }

    public void deleteStaff(Staff staff) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), staff);
    }

    public Vprojre1 getVprojre1ById(Vprojre1Id id) {
        List<Vprojre1> rtn = (List<Vprojre1>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVprojre1ById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void deleteProjact(Projact projact) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), projact);
    }

    public void deleteInventory(Inventory inventory) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), inventory);
    }

    public List<Department> getDepartmentList(Department searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Department();
        }
        return (List<Department>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Department> getDepartmentList(Department searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Department();
        }
        return (List<Department>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Department> getDepartmentList() {
        return (List<Department>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Department.class);
    }

    public void updateEmpprojact(Empprojact empprojact) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), empprojact);
    }

    public void updateEmployee(Employee employee) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), employee);
    }

    public void deleteVastrde2(Vastrde2 vastrde2) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vastrde2);
    }

    public void deleteProduct(Product product) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), product);
    }

    public Integer getCatalogCount(Catalog searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Catalog();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getCatalogCount(Catalog searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Catalog();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getCatalogCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Catalog.class);
    }

    public Integer getFoo1Count(Foo1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Foo1();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getFoo1Count(Foo1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Foo1();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getFoo1Count() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Foo1.class);
    }

    public void updateVdept(Vdept vdept) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vdept);
    }

    public Vprojact getVprojactById(VprojactId id) {
        List<Vprojact> rtn = (List<Vprojact>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVprojactById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateFoo1(Foo1 foo1) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), foo1);
    }

    public Foo1 getFoo1ById(Long id) {
        List<Foo1> rtn = (List<Foo1>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getFoo1ById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Integer getVempCount(Vemp searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vemp();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVempCount(Vemp searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vemp();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVempCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vemp.class);
    }

    public Vdepmg1 getVdepmg1ById(Vdepmg1Id id) {
        List<Vdepmg1> rtn = (List<Vdepmg1>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVdepmg1ById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Empmdc insertEmpmdc(Empmdc empmdc) {
        return (Empmdc) this.dsMgr.invoke(this.taskMgr.getInsertTask(), empmdc);
    }

    public void deleteClSched(ClSched clSched) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), clSched);
    }

    public List<Vstafac1> getVstafac1List(Vstafac1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac1();
        }
        return (List<Vstafac1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vstafac1> getVstafac1List(Vstafac1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac1();
        }
        return (List<Vstafac1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vstafac1> getVstafac1List() {
        return (List<Vstafac1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vstafac1.class);
    }

    public List<Empmdc> getEmpmdcList(Empmdc searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empmdc();
        }
        return (List<Empmdc>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Empmdc> getEmpmdcList(Empmdc searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empmdc();
        }
        return (List<Empmdc>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Empmdc> getEmpmdcList() {
        return (List<Empmdc>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Empmdc.class);
    }

    public Suppliers getSuppliersById(String id) {
        List<Suppliers> rtn = (List<Suppliers>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getSuppliersById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateProjact(Projact projact) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), projact);
    }

    public Vemp insertVemp(Vemp vemp) {
        return (Vemp) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vemp);
    }

    public Vstafac1 getVstafac1ById(Vstafac1Id id) {
        List<Vstafac1> rtn = (List<Vstafac1>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVstafac1ById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateProduct(Product product) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), product);
    }

    public void deleteVdepmg1(Vdepmg1 vdepmg1) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vdepmg1);
    }

    public Department insertDepartment(Department department) {
        return (Department) this.dsMgr.invoke(this.taskMgr.getInsertTask(), department);
    }

    public List<Projact> getProjactList(Projact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Projact();
        }
        return (List<Projact>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Projact> getProjactList(Projact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Projact();
        }
        return (List<Projact>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Projact> getProjactList() {
        return (List<Projact>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Projact.class);
    }

    public Vforpla getVforplaById(VforplaId id) {
        List<Vforpla> rtn = (List<Vforpla>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVforplaById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Vhdept getVhdeptById(VhdeptId id) {
        List<Vhdept> rtn = (List<Vhdept>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVhdeptById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Suppliers> getSuppliersList(Suppliers searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Suppliers();
        }
        return (List<Suppliers>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Suppliers> getSuppliersList(Suppliers searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Suppliers();
        }
        return (List<Suppliers>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Suppliers> getSuppliersList() {
        return (List<Suppliers>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Suppliers.class);
    }

    public Customer getCustomerById(Long id) {
        List<Customer> rtn = (List<Customer>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getCustomerById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateProject(Project project) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), project);
    }

    public Integer getEmpResumeCount(EmpResume searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.EmpResume();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getEmpResumeCount(EmpResume searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.EmpResume();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getEmpResumeCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), EmpResume.class);
    }

    public void updateEmpmdc(Empmdc empmdc) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), empmdc);
    }

    public List<Project> getProjectList(Project searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Project();
        }
        return (List<Project>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Project> getProjectList(Project searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Project();
        }
        return (List<Project>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Project> getProjectList() {
        return (List<Project>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Project.class);
    }

    public void deleteDepartment(Department department) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), department);
    }

    public Vphone getVphoneById(VphoneId id) {
        List<Vphone> rtn = (List<Vphone>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVphoneById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void deleteVhdept(Vhdept vhdept) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vhdept);
    }

    public ClSched getClSchedById(ClSchedId id) {
        List<ClSched> rtn = (List<ClSched>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getClSchedById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<EmpResume> getEmpResumeList(EmpResume searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.EmpResume();
        }
        return (List<EmpResume>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<EmpResume> getEmpResumeList(EmpResume searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.EmpResume();
        }
        return (List<EmpResume>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<EmpResume> getEmpResumeList() {
        return (List<EmpResume>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), EmpResume.class);
    }

    public Integer getInTrayCount(InTray searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.InTray();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getInTrayCount(InTray searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.InTray();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getInTrayCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), InTray.class);
    }

    public Empprojact getEmpprojactById(EmpprojactId id) {
        List<Empprojact> rtn = (List<Empprojact>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getEmpprojactById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Integer getInventoryCount(Inventory searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Inventory();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getInventoryCount(Inventory searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Inventory();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getInventoryCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Inventory.class);
    }

    public Vphone insertVphone(Vphone vphone) {
        return (Vphone) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vphone);
    }

    public void updateVpstrde2(Vpstrde2 vpstrde2) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vpstrde2);
    }

    public Integer getActCount(Act searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Act();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getActCount(Act searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Act();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getActCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Act.class);
    }

    public ClSched insertClSched(ClSched clSched) {
        return (ClSched) this.dsMgr.invoke(this.taskMgr.getInsertTask(), clSched);
    }

    public void deleteVprojre1(Vprojre1 vprojre1) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vprojre1);
    }

    public Integer getVempdpt1Count(Vempdpt1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vempdpt1();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVempdpt1Count(Vempdpt1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vempdpt1();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVempdpt1Count() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vempdpt1.class);
    }

    public Product insertProduct(Product product) {
        return (Product) this.dsMgr.invoke(this.taskMgr.getInsertTask(), product);
    }

    public Staff insertStaff(Staff staff) {
        return (Staff) this.dsMgr.invoke(this.taskMgr.getInsertTask(), staff);
    }

    public void updateVhdept(Vhdept vhdept) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vhdept);
    }

    public void deleteVact(Vact vact) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vact);
    }

    public Vpstrde1 insertVpstrde1(Vpstrde1 vpstrde1) {
        return (Vpstrde1) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vpstrde1);
    }

    public List<Vproj> getVprojList(Vproj searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vproj();
        }
        return (List<Vproj>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vproj> getVprojList(Vproj searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vproj();
        }
        return (List<Vproj>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vproj> getVprojList() {
        return (List<Vproj>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vproj.class);
    }

    public Integer getVprojre1Count(Vprojre1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vprojre1();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVprojre1Count(Vprojre1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vprojre1();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVprojre1Count() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vprojre1.class);
    }

    public Sales getSalesById(SalesId id) {
        List<Sales> rtn = (List<Sales>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getSalesById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateSuppliers(Suppliers suppliers) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), suppliers);
    }

    public Integer getVstafac2Count(Vstafac2 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac2();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVstafac2Count(Vstafac2 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac2();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVstafac2Count() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vstafac2.class);
    }

    public void updateInTray(InTray inTray) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), inTray);
    }

    public void updateClSched(ClSched clSched) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), clSched);
    }

    public Vempdpt1 insertVempdpt1(Vempdpt1 vempdpt1) {
        return (Vempdpt1) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vempdpt1);
    }

    public Employee getEmployeeById(String id) {
        List<Employee> rtn = (List<Employee>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getEmployeeById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Product getProductById(String id) {
        List<Product> rtn = (List<Product>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getProductById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Catalog insertCatalog(Catalog catalog) {
        return (Catalog) this.dsMgr.invoke(this.taskMgr.getInsertTask(), catalog);
    }

    public Empprojact insertEmpprojact(Empprojact empprojact) {
        return (Empprojact) this.dsMgr.invoke(this.taskMgr.getInsertTask(), empprojact);
    }

    public void deleteVdept(Vdept vdept) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vdept);
    }

    public Integer getVpstrde1Count(Vpstrde1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vpstrde1();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVpstrde1Count(Vpstrde1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vpstrde1();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVpstrde1Count() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vpstrde1.class);
    }

    public void updateVemplp(Vemplp vemplp) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vemplp);
    }

    public void updateOrg(Org org) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), org);
    }

    public Integer getProductCount(Product searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Product();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getProductCount(Product searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Product();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getProductCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Product.class);
    }

    public EmpResume getEmpResumeById(EmpResumeId id) {
        List<EmpResume> rtn = (List<EmpResume>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getEmpResumeById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Vpstrde1 getVpstrde1ById(Vpstrde1Id id) {
        List<Vpstrde1> rtn = (List<Vpstrde1>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVpstrde1ById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Vemp getVempById(VempId id) {
        List<Vemp> rtn = (List<Vemp>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVempById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Vempdpt1> getVempdpt1List(Vempdpt1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vempdpt1();
        }
        return (List<Vempdpt1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vempdpt1> getVempdpt1List(Vempdpt1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vempdpt1();
        }
        return (List<Vempdpt1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vempdpt1> getVempdpt1List() {
        return (List<Vempdpt1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vempdpt1.class);
    }

    public void updateVstafac2(Vstafac2 vstafac2) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vstafac2);
    }

    public Projact insertProjact(Projact projact) {
        return (Projact) this.dsMgr.invoke(this.taskMgr.getInsertTask(), projact);
    }

    public Integer getOrgCount(Org searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Org();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getOrgCount(Org searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Org();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getOrgCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Org.class);
    }

    public InTray getInTrayById(InTrayId id) {
        List<InTray> rtn = (List<InTray>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getInTrayById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Vforpla> getVforplaList(Vforpla searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vforpla();
        }
        return (List<Vforpla>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vforpla> getVforplaList(Vforpla searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vforpla();
        }
        return (List<Vforpla>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vforpla> getVforplaList() {
        return (List<Vforpla>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vforpla.class);
    }

    public Integer getVastrde2Count(Vastrde2 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde2();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVastrde2Count(Vastrde2 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde2();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVastrde2Count() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vastrde2.class);
    }

    public Vdept getVdeptById(VdeptId id) {
        List<Vdept> rtn = (List<Vdept>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVdeptById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Integer getVprojactCount(Vprojact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vprojact();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVprojactCount(Vprojact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vprojact();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVprojactCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vprojact.class);
    }

    public void deleteProductsupplier(Productsupplier productsupplier) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), productsupplier);
    }

    public void updateVdepmg1(Vdepmg1 vdepmg1) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vdepmg1);
    }

    public Vprojact insertVprojact(Vprojact vprojact) {
        return (Vprojact) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vprojact);
    }

    public Integer getSalesCount(Sales searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Sales();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getSalesCount(Sales searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Sales();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getSalesCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Sales.class);
    }

    public Vact getVactById(VactId id) {
        List<Vact> rtn = (List<Vact>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVactById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Vprojact> getVprojactList(Vprojact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vprojact();
        }
        return (List<Vprojact>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vprojact> getVprojactList(Vprojact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vprojact();
        }
        return (List<Vprojact>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vprojact> getVprojactList() {
        return (List<Vprojact>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vprojact.class);
    }

    public void deleteVforpla(Vforpla vforpla) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vforpla);
    }

    public void updateVstafac1(Vstafac1 vstafac1) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vstafac1);
    }

    public List<EmpPhoto> getEmpPhotoList(EmpPhoto searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.EmpPhoto();
        }
        return (List<EmpPhoto>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<EmpPhoto> getEmpPhotoList(EmpPhoto searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.EmpPhoto();
        }
        return (List<EmpPhoto>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<EmpPhoto> getEmpPhotoList() {
        return (List<EmpPhoto>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), EmpPhoto.class);
    }

    public List<Inventory> getInventoryList(Inventory searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Inventory();
        }
        return (List<Inventory>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Inventory> getInventoryList(Inventory searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Inventory();
        }
        return (List<Inventory>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Inventory> getInventoryList() {
        return (List<Inventory>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Inventory.class);
    }

    public void updateCatalog(Catalog catalog) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), catalog);
    }

    public void updateVemp(Vemp vemp) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vemp);
    }

    public void deleteSales(Sales sales) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), sales);
    }

    public Vempprojact insertVempprojact(Vempprojact vempprojact) {
        return (Vempprojact) this.dsMgr.invoke(this.taskMgr.getInsertTask(), vempprojact);
    }

    public List<Vpstrde2> getVpstrde2List(Vpstrde2 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vpstrde2();
        }
        return (List<Vpstrde2>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Vpstrde2> getVpstrde2List(Vpstrde2 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vpstrde2();
        }
        return (List<Vpstrde2>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Vpstrde2> getVpstrde2List() {
        return (List<Vpstrde2>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Vpstrde2.class);
    }

    public void deleteVstafac2(Vstafac2 vstafac2) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vstafac2);
    }

    public Vproj getVprojById(VprojId id) {
        List<Vproj> rtn = (List<Vproj>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVprojById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateEmpResume(EmpResume empResume) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), empResume);
    }

    public Integer getVprojCount(Vproj searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vproj();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVprojCount(Vproj searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vproj();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVprojCount() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vproj.class);
    }

    public Employee insertEmployee(Employee employee) {
        return (Employee) this.dsMgr.invoke(this.taskMgr.getInsertTask(), employee);
    }

    public List<ClSched> getClSchedList(ClSched searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.ClSched();
        }
        return (List<ClSched>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<ClSched> getClSchedList(ClSched searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.ClSched();
        }
        return (List<ClSched>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<ClSched> getClSchedList() {
        return (List<ClSched>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), ClSched.class);
    }

    public Integer getVastrde1Count(Vastrde1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde1();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVastrde1Count(Vastrde1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde1();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVastrde1Count() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vastrde1.class);
    }

    public Inventory insertInventory(Inventory inventory) {
        return (Inventory) this.dsMgr.invoke(this.taskMgr.getInsertTask(), inventory);
    }

    public void updateStaff(Staff staff) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), staff);
    }

    public void deleteVpstrde1(Vpstrde1 vpstrde1) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vpstrde1);
    }

    public void deleteVpstrde2(Vpstrde2 vpstrde2) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), vpstrde2);
    }

    public Integer getVpstrde2Count(Vpstrde2 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vpstrde2();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance, options);
    }

    public Integer getVpstrde2Count(Vpstrde2 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vpstrde2();
        }
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), searchInstance);
    }

    public Integer getVpstrde2Count() {
        return (Integer) this.dsMgr.invoke(this.taskMgr.getCountTask(), Vpstrde2.class);
    }

    public void updateVproj(Vproj vproj) {
        this.dsMgr.invoke(this.taskMgr.getUpdateTask(), vproj);
    }

    public Vpstrde2 getVpstrde2ById(Vpstrde2Id id) {
        List<Vpstrde2> rtn = (List<Vpstrde2>) this.dsMgr.invoke(this.taskMgr.getQueryTask(), "getVpstrde2ById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void deleteEmpPhoto(EmpPhoto empPhoto) {
        this.dsMgr.invoke(this.taskMgr.getDeleteTask(), empPhoto);
    }

    public List<Foo1> getFoo1List(Foo1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Foo1();
        }
        return (List<Foo1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance, options);
    }

    public List<Foo1> getFoo1List(Foo1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Foo1();
        }
        return (List<Foo1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), searchInstance);
    }

    public List<Foo1> getFoo1List() {
        return (List<Foo1>) this.dsMgr.invoke(this.taskMgr.getSearchTask(), Foo1.class);
    }

    public void begin() {
        this.dsMgr.begin();
    }

    public void commit() {
        this.dsMgr.commit();
    }

    public void rollback() {
        this.dsMgr.rollback();
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

    public static final void main(String[] args) {
        String cfg = "db2sample.spring.xml";
        String beanName = "db2sample";
        com.wavemaker.runtime.data.sample.db2sampledb.DB2Sample s = (com.wavemaker.runtime.data.sample.db2sampledb.DB2Sample) SpringUtils.getBean(
            cfg, beanName);
        System.out.print("getCustomerCount: ");
        System.out.println(s.getCustomerCount());
    }
}
