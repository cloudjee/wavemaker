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
 * 
 */
@SuppressWarnings({"unchecked"})
public class DB2Sample
    implements DataServiceManagerAccess
{

    private DataServiceManager dsMgr;
    private TaskManager taskMgr;

    public Integer getCustomerCount(Customer searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Customer();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getCustomerCount(Customer searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Customer();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getCustomerCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Customer.class));
    }

    public List<Org> getOrgList(Org searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Org();
        }
        return ((List<Org> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Org> getOrgList(Org searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Org();
        }
        return ((List<Org> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Org> getOrgList() {
        return ((List<Org> ) dsMgr.invoke(taskMgr.getSearchTask(), Org.class));
    }

    public List<Vastrde2> getVastrde2List(Vastrde2 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde2();
        }
        return ((List<Vastrde2> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vastrde2> getVastrde2List(Vastrde2 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde2();
        }
        return ((List<Vastrde2> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vastrde2> getVastrde2List() {
        return ((List<Vastrde2> ) dsMgr.invoke(taskMgr.getSearchTask(), Vastrde2 .class));
    }

    public void deleteVphone(Vphone vphone) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vphone);
    }

    public void deleteInTray(InTray inTray) {
        dsMgr.invoke(taskMgr.getDeleteTask(), inTray);
    }

    public Customer insertCustomer(Customer customer) {
        return ((Customer) dsMgr.invoke(taskMgr.getInsertTask(), customer));
    }

    public void deleteEmployee(Employee employee) {
        dsMgr.invoke(taskMgr.getDeleteTask(), employee);
    }

    public Vprojre1 insertVprojre1(Vprojre1 vprojre1) {
        return ((Vprojre1) dsMgr.invoke(taskMgr.getInsertTask(), vprojre1));
    }

    public List<Productsupplier> getProductsupplierList(Productsupplier searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Productsupplier();
        }
        return ((List<Productsupplier> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Productsupplier> getProductsupplierList(Productsupplier searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Productsupplier();
        }
        return ((List<Productsupplier> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Productsupplier> getProductsupplierList() {
        return ((List<Productsupplier> ) dsMgr.invoke(taskMgr.getSearchTask(), Productsupplier.class));
    }

    public Integer getVdepmg1Count(Vdepmg1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vdepmg1();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVdepmg1Count(Vdepmg1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vdepmg1();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVdepmg1Count() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vdepmg1 .class));
    }

    public Integer getVhdeptCount(Vhdept searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vhdept();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVhdeptCount(Vhdept searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vhdept();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVhdeptCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vhdept.class));
    }

    public List<Sales> getSalesList(Sales searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Sales();
        }
        return ((List<Sales> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Sales> getSalesList(Sales searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Sales();
        }
        return ((List<Sales> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Sales> getSalesList() {
        return ((List<Sales> ) dsMgr.invoke(taskMgr.getSearchTask(), Sales.class));
    }

    public void updatePurchaseorder(Purchaseorder purchaseorder) {
        dsMgr.invoke(taskMgr.getUpdateTask(), purchaseorder);
    }

    public void updateVprojact(Vprojact vprojact) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vprojact);
    }

    public void updateProductsupplier(Productsupplier productsupplier) {
        dsMgr.invoke(taskMgr.getUpdateTask(), productsupplier);
    }

    public void deleteVemp(Vemp vemp) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vemp);
    }

    public Projact getProjactById(ProjactId id) {
        List<Projact> rtn = ((List<Projact> ) dsMgr.invoke(taskMgr.getQueryTask(), "getProjactById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Staff getStaffById(StaffId id) {
        List<Staff> rtn = ((List<Staff> ) dsMgr.invoke(taskMgr.getQueryTask(), "getStaffById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Vastrde1 getVastrde1ById(Vastrde1Id id) {
        List<Vastrde1> rtn = ((List<Vastrde1> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVastrde1ById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Vastrde1 insertVastrde1(Vastrde1 vastrde1) {
        return ((Vastrde1) dsMgr.invoke(taskMgr.getInsertTask(), vastrde1));
    }

    public Project insertProject(Project project) {
        return ((Project) dsMgr.invoke(taskMgr.getInsertTask(), project));
    }

    public Act getActById(Short id) {
        List<Act> rtn = ((List<Act> ) dsMgr.invoke(taskMgr.getQueryTask(), "getActById", id));
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
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getEmpPhotoCount(EmpPhoto searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.EmpPhoto();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getEmpPhotoCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), EmpPhoto.class));
    }

    public Integer getStaffCount(Staff searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Staff();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getStaffCount(Staff searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Staff();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getStaffCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Staff.class));
    }

    public Integer getVempprojactCount(Vempprojact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vempprojact();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVempprojactCount(Vempprojact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vempprojact();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVempprojactCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vempprojact.class));
    }

    public void updateVprojre1(Vprojre1 vprojre1) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vprojre1);
    }

    public void updateVphone(Vphone vphone) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vphone);
    }

    public void deleteEmpprojact(Empprojact empprojact) {
        dsMgr.invoke(taskMgr.getDeleteTask(), empprojact);
    }

    public List<Vdept> getVdeptList(Vdept searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vdept();
        }
        return ((List<Vdept> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vdept> getVdeptList(Vdept searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vdept();
        }
        return ((List<Vdept> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vdept> getVdeptList() {
        return ((List<Vdept> ) dsMgr.invoke(taskMgr.getSearchTask(), Vdept.class));
    }

    public Catalog getCatalogById(String id) {
        List<Catalog> rtn = ((List<Catalog> ) dsMgr.invoke(taskMgr.getQueryTask(), "getCatalogById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void deleteCatalog(Catalog catalog) {
        dsMgr.invoke(taskMgr.getDeleteTask(), catalog);
    }

    public Vastrde2 insertVastrde2(Vastrde2 vastrde2) {
        return ((Vastrde2) dsMgr.invoke(taskMgr.getInsertTask(), vastrde2));
    }

    public Integer getProjactCount(Projact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Projact();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getProjactCount(Projact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Projact();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getProjactCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Projact.class));
    }

    public void deleteVproj(Vproj vproj) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vproj);
    }

    public void updateAct(Act act) {
        dsMgr.invoke(taskMgr.getUpdateTask(), act);
    }

    public Integer getEmpmdcCount(Empmdc searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empmdc();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getEmpmdcCount(Empmdc searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empmdc();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getEmpmdcCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Empmdc.class));
    }

    public void deleteCustomer(Customer customer) {
        dsMgr.invoke(taskMgr.getDeleteTask(), customer);
    }

    public Vstafac2 getVstafac2ById(Vstafac2Id id) {
        List<Vstafac2> rtn = ((List<Vstafac2> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVstafac2ById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Sales insertSales(Sales sales) {
        return ((Sales) dsMgr.invoke(taskMgr.getInsertTask(), sales));
    }

    public void deleteProject(Project project) {
        dsMgr.invoke(taskMgr.getDeleteTask(), project);
    }

    public void deleteVstafac1(Vstafac1 vstafac1) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vstafac1);
    }

    public Vdept insertVdept(Vdept vdept) {
        return ((Vdept) dsMgr.invoke(taskMgr.getInsertTask(), vdept));
    }

    public Vemplp getVemplpById(VemplpId id) {
        List<Vemplp> rtn = ((List<Vemplp> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVemplpById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public EmpPhoto getEmpPhotoById(EmpPhotoId id) {
        List<EmpPhoto> rtn = ((List<EmpPhoto> ) dsMgr.invoke(taskMgr.getQueryTask(), "getEmpPhotoById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Vproj insertVproj(Vproj vproj) {
        return ((Vproj) dsMgr.invoke(taskMgr.getInsertTask(), vproj));
    }

    public Integer getProductsupplierCount(Productsupplier searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Productsupplier();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getProductsupplierCount(Productsupplier searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Productsupplier();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getProductsupplierCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Productsupplier.class));
    }

    public void deleteEmpResume(EmpResume empResume) {
        dsMgr.invoke(taskMgr.getDeleteTask(), empResume);
    }

    public void deleteVempdpt1(Vempdpt1 vempdpt1) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vempdpt1);
    }

    public Foo1 insertFoo1(Foo1 foo1) {
        return ((Foo1) dsMgr.invoke(taskMgr.getInsertTask(), foo1));
    }

    public Department getDepartmentById(String id) {
        List<Department> rtn = ((List<Department> ) dsMgr.invoke(taskMgr.getQueryTask(), "getDepartmentById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Productsupplier getProductsupplierById(ProductsupplierId id) {
        List<Productsupplier> rtn = ((List<Productsupplier> ) dsMgr.invoke(taskMgr.getQueryTask(), "getProductsupplierById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateVempdpt1(Vempdpt1 vempdpt1) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vempdpt1);
    }

    public List<Vempprojact> getVempprojactList(Vempprojact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vempprojact();
        }
        return ((List<Vempprojact> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vempprojact> getVempprojactList(Vempprojact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vempprojact();
        }
        return ((List<Vempprojact> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vempprojact> getVempprojactList() {
        return ((List<Vempprojact> ) dsMgr.invoke(taskMgr.getSearchTask(), Vempprojact.class));
    }

    public Integer getClSchedCount(ClSched searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.ClSched();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getClSchedCount(ClSched searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.ClSched();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getClSchedCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), ClSched.class));
    }

    public void updateEmpPhoto(EmpPhoto empPhoto) {
        dsMgr.invoke(taskMgr.getUpdateTask(), empPhoto);
    }

    public Integer getProjectCount(Project searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Project();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getProjectCount(Project searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Project();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getProjectCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Project.class));
    }

    public Purchaseorder getPurchaseorderById(Long id) {
        List<Purchaseorder> rtn = ((List<Purchaseorder> ) dsMgr.invoke(taskMgr.getQueryTask(), "getPurchaseorderById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void deletePurchaseorder(Purchaseorder purchaseorder) {
        dsMgr.invoke(taskMgr.getDeleteTask(), purchaseorder);
    }

    public Vempprojact getVempprojactById(VempprojactId id) {
        List<Vempprojact> rtn = ((List<Vempprojact> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVempprojactById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Productsupplier insertProductsupplier(Productsupplier productsupplier) {
        return ((Productsupplier) dsMgr.invoke(taskMgr.getInsertTask(), productsupplier));
    }

    public List<Vemp> getVempList(Vemp searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vemp();
        }
        return ((List<Vemp> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vemp> getVempList(Vemp searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vemp();
        }
        return ((List<Vemp> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vemp> getVempList() {
        return ((List<Vemp> ) dsMgr.invoke(taskMgr.getSearchTask(), Vemp.class));
    }

    public Suppliers insertSuppliers(Suppliers suppliers) {
        return ((Suppliers) dsMgr.invoke(taskMgr.getInsertTask(), suppliers));
    }

    public List<Empprojact> getEmpprojactList(Empprojact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empprojact();
        }
        return ((List<Empprojact> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Empprojact> getEmpprojactList(Empprojact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empprojact();
        }
        return ((List<Empprojact> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Empprojact> getEmpprojactList() {
        return ((List<Empprojact> ) dsMgr.invoke(taskMgr.getSearchTask(), Empprojact.class));
    }

    public Vstafac2 insertVstafac2(Vstafac2 vstafac2) {
        return ((Vstafac2) dsMgr.invoke(taskMgr.getInsertTask(), vstafac2));
    }

    public Integer getVactCount(Vact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vact();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVactCount(Vact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vact();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVactCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vact.class));
    }

    public Integer getVdeptCount(Vdept searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vdept();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVdeptCount(Vdept searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vdept();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVdeptCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vdept.class));
    }

    public void updateVempprojact(Vempprojact vempprojact) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vempprojact);
    }

    public Vstafac1 insertVstafac1(Vstafac1 vstafac1) {
        return ((Vstafac1) dsMgr.invoke(taskMgr.getInsertTask(), vstafac1));
    }

    public Integer getSuppliersCount(Suppliers searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Suppliers();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getSuppliersCount(Suppliers searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Suppliers();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getSuppliersCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Suppliers.class));
    }

    public Purchaseorder insertPurchaseorder(Purchaseorder purchaseorder) {
        return ((Purchaseorder) dsMgr.invoke(taskMgr.getInsertTask(), purchaseorder));
    }

    public Vdepmg1 insertVdepmg1(Vdepmg1 vdepmg1) {
        return ((Vdepmg1) dsMgr.invoke(taskMgr.getInsertTask(), vdepmg1));
    }

    public Vempdpt1 getVempdpt1ById(Vempdpt1Id id) {
        List<Vempdpt1> rtn = ((List<Vempdpt1> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVempdpt1ById", id));
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
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVphoneCount(Vphone searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vphone();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVphoneCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vphone.class));
    }

    public void updateCustomer(Customer customer) {
        dsMgr.invoke(taskMgr.getUpdateTask(), customer);
    }

    public void updateVpstrde1(Vpstrde1 vpstrde1) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vpstrde1);
    }

    public List<InTray> getInTrayList(InTray searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.InTray();
        }
        return ((List<InTray> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<InTray> getInTrayList(InTray searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.InTray();
        }
        return ((List<InTray> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<InTray> getInTrayList() {
        return ((List<InTray> ) dsMgr.invoke(taskMgr.getSearchTask(), InTray.class));
    }

    public void deleteEmpmdc(Empmdc empmdc) {
        dsMgr.invoke(taskMgr.getDeleteTask(), empmdc);
    }

    public void updateVforpla(Vforpla vforpla) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vforpla);
    }

    public Project getProjectById(String id) {
        List<Project> rtn = ((List<Project> ) dsMgr.invoke(taskMgr.getQueryTask(), "getProjectById", id));
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
        return ((List<Vdepmg1> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vdepmg1> getVdepmg1List(Vdepmg1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vdepmg1();
        }
        return ((List<Vdepmg1> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vdepmg1> getVdepmg1List() {
        return ((List<Vdepmg1> ) dsMgr.invoke(taskMgr.getSearchTask(), Vdepmg1 .class));
    }

    public InTray insertInTray(InTray inTray) {
        return ((InTray) dsMgr.invoke(taskMgr.getInsertTask(), inTray));
    }

    public List<Vastrde1> getVastrde1List(Vastrde1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde1();
        }
        return ((List<Vastrde1> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vastrde1> getVastrde1List(Vastrde1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde1();
        }
        return ((List<Vastrde1> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vastrde1> getVastrde1List() {
        return ((List<Vastrde1> ) dsMgr.invoke(taskMgr.getSearchTask(), Vastrde1 .class));
    }

    public Integer getVstafac1Count(Vstafac1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac1();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVstafac1Count(Vstafac1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac1();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVstafac1Count() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vstafac1 .class));
    }

    public Vpstrde2 insertVpstrde2(Vpstrde2 vpstrde2) {
        return ((Vpstrde2) dsMgr.invoke(taskMgr.getInsertTask(), vpstrde2));
    }

    public List<Vprojre1> getVprojre1List(Vprojre1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vprojre1();
        }
        return ((List<Vprojre1> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vprojre1> getVprojre1List(Vprojre1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vprojre1();
        }
        return ((List<Vprojre1> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vprojre1> getVprojre1List() {
        return ((List<Vprojre1> ) dsMgr.invoke(taskMgr.getSearchTask(), Vprojre1 .class));
    }

    public EmpResume insertEmpResume(EmpResume empResume) {
        return ((EmpResume) dsMgr.invoke(taskMgr.getInsertTask(), empResume));
    }

    public Vforpla insertVforpla(Vforpla vforpla) {
        return ((Vforpla) dsMgr.invoke(taskMgr.getInsertTask(), vforpla));
    }

    public List<Vhdept> getVhdeptList(Vhdept searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vhdept();
        }
        return ((List<Vhdept> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vhdept> getVhdeptList(Vhdept searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vhdept();
        }
        return ((List<Vhdept> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vhdept> getVhdeptList() {
        return ((List<Vhdept> ) dsMgr.invoke(taskMgr.getSearchTask(), Vhdept.class));
    }

    public List<Vemplp> getVemplpList(Vemplp searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vemplp();
        }
        return ((List<Vemplp> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vemplp> getVemplpList(Vemplp searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vemplp();
        }
        return ((List<Vemplp> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vemplp> getVemplpList() {
        return ((List<Vemplp> ) dsMgr.invoke(taskMgr.getSearchTask(), Vemplp.class));
    }

    public void deleteFoo1(Foo1 foo1) {
        dsMgr.invoke(taskMgr.getDeleteTask(), foo1);
    }

    public void deleteOrg(Org org) {
        dsMgr.invoke(taskMgr.getDeleteTask(), org);
    }

    public void deleteVemplp(Vemplp vemplp) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vemplp);
    }

    public Empmdc getEmpmdcById(EmpmdcId id) {
        List<Empmdc> rtn = ((List<Empmdc> ) dsMgr.invoke(taskMgr.getQueryTask(), "getEmpmdcById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateVact(Vact vact) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vact);
    }

    public void updateSales(Sales sales) {
        dsMgr.invoke(taskMgr.getUpdateTask(), sales);
    }

    public EmpPhoto insertEmpPhoto(EmpPhoto empPhoto) {
        return ((EmpPhoto) dsMgr.invoke(taskMgr.getInsertTask(), empPhoto));
    }

    public List<Vact> getVactList(Vact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vact();
        }
        return ((List<Vact> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vact> getVactList(Vact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vact();
        }
        return ((List<Vact> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vact> getVactList() {
        return ((List<Vact> ) dsMgr.invoke(taskMgr.getSearchTask(), Vact.class));
    }

    public List<Vstafac2> getVstafac2List(Vstafac2 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac2();
        }
        return ((List<Vstafac2> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vstafac2> getVstafac2List(Vstafac2 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac2();
        }
        return ((List<Vstafac2> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vstafac2> getVstafac2List() {
        return ((List<Vstafac2> ) dsMgr.invoke(taskMgr.getSearchTask(), Vstafac2 .class));
    }

    public Vhdept insertVhdept(Vhdept vhdept) {
        return ((Vhdept) dsMgr.invoke(taskMgr.getInsertTask(), vhdept));
    }

    public List<Product> getProductList(Product searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Product();
        }
        return ((List<Product> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Product> getProductList(Product searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Product();
        }
        return ((List<Product> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Product> getProductList() {
        return ((List<Product> ) dsMgr.invoke(taskMgr.getSearchTask(), Product.class));
    }

    public Act insertAct(Act act) {
        return ((Act) dsMgr.invoke(taskMgr.getInsertTask(), act));
    }

    public Integer getDepartmentCount(Department searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Department();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getDepartmentCount(Department searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Department();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getDepartmentCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Department.class));
    }

    public Vact insertVact(Vact vact) {
        return ((Vact) dsMgr.invoke(taskMgr.getInsertTask(), vact));
    }

    public Integer getVforplaCount(Vforpla searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vforpla();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVforplaCount(Vforpla searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vforpla();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVforplaCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vforpla.class));
    }

    public void deleteVprojact(Vprojact vprojact) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vprojact);
    }

    public void deleteSuppliers(Suppliers suppliers) {
        dsMgr.invoke(taskMgr.getDeleteTask(), suppliers);
    }

    public List<Vphone> getVphoneList(Vphone searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vphone();
        }
        return ((List<Vphone> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vphone> getVphoneList(Vphone searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vphone();
        }
        return ((List<Vphone> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vphone> getVphoneList() {
        return ((List<Vphone> ) dsMgr.invoke(taskMgr.getSearchTask(), Vphone.class));
    }

    public void updateVastrde2(Vastrde2 vastrde2) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vastrde2);
    }

    public List<Customer> getCustomerList(Customer searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Customer();
        }
        return ((List<Customer> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Customer> getCustomerList(Customer searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Customer();
        }
        return ((List<Customer> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Customer> getCustomerList() {
        return ((List<Customer> ) dsMgr.invoke(taskMgr.getSearchTask(), Customer.class));
    }

    public List<Employee> getEmployeeList(Employee searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Employee();
        }
        return ((List<Employee> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Employee> getEmployeeList(Employee searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Employee();
        }
        return ((List<Employee> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Employee> getEmployeeList() {
        return ((List<Employee> ) dsMgr.invoke(taskMgr.getSearchTask(), Employee.class));
    }

    public void updateVastrde1(Vastrde1 vastrde1) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vastrde1);
    }

    public Integer getVemplpCount(Vemplp searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vemplp();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVemplpCount(Vemplp searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vemplp();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVemplpCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vemplp.class));
    }

    public Integer getEmpprojactCount(Empprojact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empprojact();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getEmpprojactCount(Empprojact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empprojact();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getEmpprojactCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Empprojact.class));
    }

    public void deleteAct(Act act) {
        dsMgr.invoke(taskMgr.getDeleteTask(), act);
    }

    public Vastrde2 getVastrde2ById(Vastrde2Id id) {
        List<Vastrde2> rtn = ((List<Vastrde2> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVastrde2ById", id));
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
        return ((List<Vpstrde1> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vpstrde1> getVpstrde1List(Vpstrde1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vpstrde1();
        }
        return ((List<Vpstrde1> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vpstrde1> getVpstrde1List() {
        return ((List<Vpstrde1> ) dsMgr.invoke(taskMgr.getSearchTask(), Vpstrde1 .class));
    }

    public List<Staff> getStaffList(Staff searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Staff();
        }
        return ((List<Staff> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Staff> getStaffList(Staff searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Staff();
        }
        return ((List<Staff> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Staff> getStaffList() {
        return ((List<Staff> ) dsMgr.invoke(taskMgr.getSearchTask(), Staff.class));
    }

    public Org getOrgById(OrgId id) {
        List<Org> rtn = ((List<Org> ) dsMgr.invoke(taskMgr.getQueryTask(), "getOrgById", id));
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
        return ((List<Purchaseorder> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Purchaseorder> getPurchaseorderList(Purchaseorder searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Purchaseorder();
        }
        return ((List<Purchaseorder> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Purchaseorder> getPurchaseorderList() {
        return ((List<Purchaseorder> ) dsMgr.invoke(taskMgr.getSearchTask(), Purchaseorder.class));
    }

    public void deleteVempprojact(Vempprojact vempprojact) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vempprojact);
    }

    public void updateDepartment(Department department) {
        dsMgr.invoke(taskMgr.getUpdateTask(), department);
    }

    public Inventory getInventoryById(String id) {
        List<Inventory> rtn = ((List<Inventory> ) dsMgr.invoke(taskMgr.getQueryTask(), "getInventoryById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateInventory(Inventory inventory) {
        dsMgr.invoke(taskMgr.getUpdateTask(), inventory);
    }

    public List<Act> getActList(Act searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Act();
        }
        return ((List<Act> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Act> getActList(Act searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Act();
        }
        return ((List<Act> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Act> getActList() {
        return ((List<Act> ) dsMgr.invoke(taskMgr.getSearchTask(), Act.class));
    }

    public Vemplp insertVemplp(Vemplp vemplp) {
        return ((Vemplp) dsMgr.invoke(taskMgr.getInsertTask(), vemplp));
    }

    public Integer getEmployeeCount(Employee searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Employee();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getEmployeeCount(Employee searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Employee();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getEmployeeCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Employee.class));
    }

    public List<Catalog> getCatalogList(Catalog searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Catalog();
        }
        return ((List<Catalog> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Catalog> getCatalogList(Catalog searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Catalog();
        }
        return ((List<Catalog> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Catalog> getCatalogList() {
        return ((List<Catalog> ) dsMgr.invoke(taskMgr.getSearchTask(), Catalog.class));
    }

    public Integer getPurchaseorderCount(Purchaseorder searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Purchaseorder();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getPurchaseorderCount(Purchaseorder searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Purchaseorder();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getPurchaseorderCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Purchaseorder.class));
    }

    public Org insertOrg(Org org) {
        return ((Org) dsMgr.invoke(taskMgr.getInsertTask(), org));
    }

    public void deleteVastrde1(Vastrde1 vastrde1) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vastrde1);
    }

    public void deleteStaff(Staff staff) {
        dsMgr.invoke(taskMgr.getDeleteTask(), staff);
    }

    public Vprojre1 getVprojre1ById(Vprojre1Id id) {
        List<Vprojre1> rtn = ((List<Vprojre1> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVprojre1ById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void deleteProjact(Projact projact) {
        dsMgr.invoke(taskMgr.getDeleteTask(), projact);
    }

    public void deleteInventory(Inventory inventory) {
        dsMgr.invoke(taskMgr.getDeleteTask(), inventory);
    }

    public List<Department> getDepartmentList(Department searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Department();
        }
        return ((List<Department> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Department> getDepartmentList(Department searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Department();
        }
        return ((List<Department> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Department> getDepartmentList() {
        return ((List<Department> ) dsMgr.invoke(taskMgr.getSearchTask(), Department.class));
    }

    public void updateEmpprojact(Empprojact empprojact) {
        dsMgr.invoke(taskMgr.getUpdateTask(), empprojact);
    }

    public void updateEmployee(Employee employee) {
        dsMgr.invoke(taskMgr.getUpdateTask(), employee);
    }

    public void deleteVastrde2(Vastrde2 vastrde2) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vastrde2);
    }

    public void deleteProduct(Product product) {
        dsMgr.invoke(taskMgr.getDeleteTask(), product);
    }

    public Integer getCatalogCount(Catalog searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Catalog();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getCatalogCount(Catalog searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Catalog();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getCatalogCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Catalog.class));
    }

    public Integer getFoo1Count(Foo1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Foo1();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getFoo1Count(Foo1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Foo1();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getFoo1Count() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Foo1 .class));
    }

    public void updateVdept(Vdept vdept) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vdept);
    }

    public Vprojact getVprojactById(VprojactId id) {
        List<Vprojact> rtn = ((List<Vprojact> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVprojactById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateFoo1(Foo1 foo1) {
        dsMgr.invoke(taskMgr.getUpdateTask(), foo1);
    }

    public Foo1 getFoo1ById(Long id) {
        List<Foo1> rtn = ((List<Foo1> ) dsMgr.invoke(taskMgr.getQueryTask(), "getFoo1ById", id));
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
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVempCount(Vemp searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vemp();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVempCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vemp.class));
    }

    public Vdepmg1 getVdepmg1ById(Vdepmg1Id id) {
        List<Vdepmg1> rtn = ((List<Vdepmg1> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVdepmg1ById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Empmdc insertEmpmdc(Empmdc empmdc) {
        return ((Empmdc) dsMgr.invoke(taskMgr.getInsertTask(), empmdc));
    }

    public void deleteClSched(ClSched clSched) {
        dsMgr.invoke(taskMgr.getDeleteTask(), clSched);
    }

    public List<Vstafac1> getVstafac1List(Vstafac1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac1();
        }
        return ((List<Vstafac1> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vstafac1> getVstafac1List(Vstafac1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac1();
        }
        return ((List<Vstafac1> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vstafac1> getVstafac1List() {
        return ((List<Vstafac1> ) dsMgr.invoke(taskMgr.getSearchTask(), Vstafac1 .class));
    }

    public List<Empmdc> getEmpmdcList(Empmdc searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empmdc();
        }
        return ((List<Empmdc> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Empmdc> getEmpmdcList(Empmdc searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Empmdc();
        }
        return ((List<Empmdc> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Empmdc> getEmpmdcList() {
        return ((List<Empmdc> ) dsMgr.invoke(taskMgr.getSearchTask(), Empmdc.class));
    }

    public Suppliers getSuppliersById(String id) {
        List<Suppliers> rtn = ((List<Suppliers> ) dsMgr.invoke(taskMgr.getQueryTask(), "getSuppliersById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateProjact(Projact projact) {
        dsMgr.invoke(taskMgr.getUpdateTask(), projact);
    }

    public Vemp insertVemp(Vemp vemp) {
        return ((Vemp) dsMgr.invoke(taskMgr.getInsertTask(), vemp));
    }

    public Vstafac1 getVstafac1ById(Vstafac1Id id) {
        List<Vstafac1> rtn = ((List<Vstafac1> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVstafac1ById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateProduct(Product product) {
        dsMgr.invoke(taskMgr.getUpdateTask(), product);
    }

    public void deleteVdepmg1(Vdepmg1 vdepmg1) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vdepmg1);
    }

    public Department insertDepartment(Department department) {
        return ((Department) dsMgr.invoke(taskMgr.getInsertTask(), department));
    }

    public List<Projact> getProjactList(Projact searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Projact();
        }
        return ((List<Projact> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Projact> getProjactList(Projact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Projact();
        }
        return ((List<Projact> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Projact> getProjactList() {
        return ((List<Projact> ) dsMgr.invoke(taskMgr.getSearchTask(), Projact.class));
    }

    public Vforpla getVforplaById(VforplaId id) {
        List<Vforpla> rtn = ((List<Vforpla> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVforplaById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Vhdept getVhdeptById(VhdeptId id) {
        List<Vhdept> rtn = ((List<Vhdept> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVhdeptById", id));
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
        return ((List<Suppliers> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Suppliers> getSuppliersList(Suppliers searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Suppliers();
        }
        return ((List<Suppliers> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Suppliers> getSuppliersList() {
        return ((List<Suppliers> ) dsMgr.invoke(taskMgr.getSearchTask(), Suppliers.class));
    }

    public Customer getCustomerById(Long id) {
        List<Customer> rtn = ((List<Customer> ) dsMgr.invoke(taskMgr.getQueryTask(), "getCustomerById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateProject(Project project) {
        dsMgr.invoke(taskMgr.getUpdateTask(), project);
    }

    public Integer getEmpResumeCount(EmpResume searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.EmpResume();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getEmpResumeCount(EmpResume searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.EmpResume();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getEmpResumeCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), EmpResume.class));
    }

    public void updateEmpmdc(Empmdc empmdc) {
        dsMgr.invoke(taskMgr.getUpdateTask(), empmdc);
    }

    public List<Project> getProjectList(Project searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Project();
        }
        return ((List<Project> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Project> getProjectList(Project searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Project();
        }
        return ((List<Project> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Project> getProjectList() {
        return ((List<Project> ) dsMgr.invoke(taskMgr.getSearchTask(), Project.class));
    }

    public void deleteDepartment(Department department) {
        dsMgr.invoke(taskMgr.getDeleteTask(), department);
    }

    public Vphone getVphoneById(VphoneId id) {
        List<Vphone> rtn = ((List<Vphone> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVphoneById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void deleteVhdept(Vhdept vhdept) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vhdept);
    }

    public ClSched getClSchedById(ClSchedId id) {
        List<ClSched> rtn = ((List<ClSched> ) dsMgr.invoke(taskMgr.getQueryTask(), "getClSchedById", id));
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
        return ((List<EmpResume> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<EmpResume> getEmpResumeList(EmpResume searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.EmpResume();
        }
        return ((List<EmpResume> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<EmpResume> getEmpResumeList() {
        return ((List<EmpResume> ) dsMgr.invoke(taskMgr.getSearchTask(), EmpResume.class));
    }

    public Integer getInTrayCount(InTray searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.InTray();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getInTrayCount(InTray searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.InTray();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getInTrayCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), InTray.class));
    }

    public Empprojact getEmpprojactById(EmpprojactId id) {
        List<Empprojact> rtn = ((List<Empprojact> ) dsMgr.invoke(taskMgr.getQueryTask(), "getEmpprojactById", id));
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
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getInventoryCount(Inventory searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Inventory();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getInventoryCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Inventory.class));
    }

    public Vphone insertVphone(Vphone vphone) {
        return ((Vphone) dsMgr.invoke(taskMgr.getInsertTask(), vphone));
    }

    public void updateVpstrde2(Vpstrde2 vpstrde2) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vpstrde2);
    }

    public Integer getActCount(Act searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Act();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getActCount(Act searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Act();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getActCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Act.class));
    }

    public ClSched insertClSched(ClSched clSched) {
        return ((ClSched) dsMgr.invoke(taskMgr.getInsertTask(), clSched));
    }

    public void deleteVprojre1(Vprojre1 vprojre1) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vprojre1);
    }

    public Integer getVempdpt1Count(Vempdpt1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vempdpt1();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVempdpt1Count(Vempdpt1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vempdpt1();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVempdpt1Count() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vempdpt1 .class));
    }

    public Product insertProduct(Product product) {
        return ((Product) dsMgr.invoke(taskMgr.getInsertTask(), product));
    }

    public Staff insertStaff(Staff staff) {
        return ((Staff) dsMgr.invoke(taskMgr.getInsertTask(), staff));
    }

    public void updateVhdept(Vhdept vhdept) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vhdept);
    }

    public void deleteVact(Vact vact) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vact);
    }

    public Vpstrde1 insertVpstrde1(Vpstrde1 vpstrde1) {
        return ((Vpstrde1) dsMgr.invoke(taskMgr.getInsertTask(), vpstrde1));
    }

    public List<Vproj> getVprojList(Vproj searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vproj();
        }
        return ((List<Vproj> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vproj> getVprojList(Vproj searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vproj();
        }
        return ((List<Vproj> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vproj> getVprojList() {
        return ((List<Vproj> ) dsMgr.invoke(taskMgr.getSearchTask(), Vproj.class));
    }

    public Integer getVprojre1Count(Vprojre1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vprojre1();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVprojre1Count(Vprojre1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vprojre1();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVprojre1Count() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vprojre1 .class));
    }

    public Sales getSalesById(SalesId id) {
        List<Sales> rtn = ((List<Sales> ) dsMgr.invoke(taskMgr.getQueryTask(), "getSalesById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateSuppliers(Suppliers suppliers) {
        dsMgr.invoke(taskMgr.getUpdateTask(), suppliers);
    }

    public Integer getVstafac2Count(Vstafac2 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac2();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVstafac2Count(Vstafac2 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vstafac2();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVstafac2Count() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vstafac2 .class));
    }

    public void updateInTray(InTray inTray) {
        dsMgr.invoke(taskMgr.getUpdateTask(), inTray);
    }

    public void updateClSched(ClSched clSched) {
        dsMgr.invoke(taskMgr.getUpdateTask(), clSched);
    }

    public Vempdpt1 insertVempdpt1(Vempdpt1 vempdpt1) {
        return ((Vempdpt1) dsMgr.invoke(taskMgr.getInsertTask(), vempdpt1));
    }

    public Employee getEmployeeById(String id) {
        List<Employee> rtn = ((List<Employee> ) dsMgr.invoke(taskMgr.getQueryTask(), "getEmployeeById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Product getProductById(String id) {
        List<Product> rtn = ((List<Product> ) dsMgr.invoke(taskMgr.getQueryTask(), "getProductById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Catalog insertCatalog(Catalog catalog) {
        return ((Catalog) dsMgr.invoke(taskMgr.getInsertTask(), catalog));
    }

    public Empprojact insertEmpprojact(Empprojact empprojact) {
        return ((Empprojact) dsMgr.invoke(taskMgr.getInsertTask(), empprojact));
    }

    public void deleteVdept(Vdept vdept) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vdept);
    }

    public Integer getVpstrde1Count(Vpstrde1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vpstrde1();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVpstrde1Count(Vpstrde1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vpstrde1();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVpstrde1Count() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vpstrde1 .class));
    }

    public void updateVemplp(Vemplp vemplp) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vemplp);
    }

    public void updateOrg(Org org) {
        dsMgr.invoke(taskMgr.getUpdateTask(), org);
    }

    public Integer getProductCount(Product searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Product();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getProductCount(Product searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Product();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getProductCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Product.class));
    }

    public EmpResume getEmpResumeById(EmpResumeId id) {
        List<EmpResume> rtn = ((List<EmpResume> ) dsMgr.invoke(taskMgr.getQueryTask(), "getEmpResumeById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Vpstrde1 getVpstrde1ById(Vpstrde1Id id) {
        List<Vpstrde1> rtn = ((List<Vpstrde1> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVpstrde1ById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Vemp getVempById(VempId id) {
        List<Vemp> rtn = ((List<Vemp> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVempById", id));
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
        return ((List<Vempdpt1> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vempdpt1> getVempdpt1List(Vempdpt1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vempdpt1();
        }
        return ((List<Vempdpt1> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vempdpt1> getVempdpt1List() {
        return ((List<Vempdpt1> ) dsMgr.invoke(taskMgr.getSearchTask(), Vempdpt1 .class));
    }

    public void updateVstafac2(Vstafac2 vstafac2) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vstafac2);
    }

    public Projact insertProjact(Projact projact) {
        return ((Projact) dsMgr.invoke(taskMgr.getInsertTask(), projact));
    }

    public Integer getOrgCount(Org searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Org();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getOrgCount(Org searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Org();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getOrgCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Org.class));
    }

    public InTray getInTrayById(InTrayId id) {
        List<InTray> rtn = ((List<InTray> ) dsMgr.invoke(taskMgr.getQueryTask(), "getInTrayById", id));
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
        return ((List<Vforpla> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vforpla> getVforplaList(Vforpla searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vforpla();
        }
        return ((List<Vforpla> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vforpla> getVforplaList() {
        return ((List<Vforpla> ) dsMgr.invoke(taskMgr.getSearchTask(), Vforpla.class));
    }

    public Integer getVastrde2Count(Vastrde2 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde2();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVastrde2Count(Vastrde2 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde2();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVastrde2Count() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vastrde2 .class));
    }

    public Vdept getVdeptById(VdeptId id) {
        List<Vdept> rtn = ((List<Vdept> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVdeptById", id));
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
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVprojactCount(Vprojact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vprojact();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVprojactCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vprojact.class));
    }

    public void deleteProductsupplier(Productsupplier productsupplier) {
        dsMgr.invoke(taskMgr.getDeleteTask(), productsupplier);
    }

    public void updateVdepmg1(Vdepmg1 vdepmg1) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vdepmg1);
    }

    public Vprojact insertVprojact(Vprojact vprojact) {
        return ((Vprojact) dsMgr.invoke(taskMgr.getInsertTask(), vprojact));
    }

    public Integer getSalesCount(Sales searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Sales();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getSalesCount(Sales searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Sales();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getSalesCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Sales.class));
    }

    public Vact getVactById(VactId id) {
        List<Vact> rtn = ((List<Vact> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVactById", id));
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
        return ((List<Vprojact> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vprojact> getVprojactList(Vprojact searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vprojact();
        }
        return ((List<Vprojact> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vprojact> getVprojactList() {
        return ((List<Vprojact> ) dsMgr.invoke(taskMgr.getSearchTask(), Vprojact.class));
    }

    public void deleteVforpla(Vforpla vforpla) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vforpla);
    }

    public void updateVstafac1(Vstafac1 vstafac1) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vstafac1);
    }

    public List<EmpPhoto> getEmpPhotoList(EmpPhoto searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.EmpPhoto();
        }
        return ((List<EmpPhoto> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<EmpPhoto> getEmpPhotoList(EmpPhoto searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.EmpPhoto();
        }
        return ((List<EmpPhoto> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<EmpPhoto> getEmpPhotoList() {
        return ((List<EmpPhoto> ) dsMgr.invoke(taskMgr.getSearchTask(), EmpPhoto.class));
    }

    public List<Inventory> getInventoryList(Inventory searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Inventory();
        }
        return ((List<Inventory> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Inventory> getInventoryList(Inventory searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Inventory();
        }
        return ((List<Inventory> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Inventory> getInventoryList() {
        return ((List<Inventory> ) dsMgr.invoke(taskMgr.getSearchTask(), Inventory.class));
    }

    public void updateCatalog(Catalog catalog) {
        dsMgr.invoke(taskMgr.getUpdateTask(), catalog);
    }

    public void updateVemp(Vemp vemp) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vemp);
    }

    public void deleteSales(Sales sales) {
        dsMgr.invoke(taskMgr.getDeleteTask(), sales);
    }

    public Vempprojact insertVempprojact(Vempprojact vempprojact) {
        return ((Vempprojact) dsMgr.invoke(taskMgr.getInsertTask(), vempprojact));
    }

    public List<Vpstrde2> getVpstrde2List(Vpstrde2 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vpstrde2();
        }
        return ((List<Vpstrde2> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Vpstrde2> getVpstrde2List(Vpstrde2 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vpstrde2();
        }
        return ((List<Vpstrde2> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Vpstrde2> getVpstrde2List() {
        return ((List<Vpstrde2> ) dsMgr.invoke(taskMgr.getSearchTask(), Vpstrde2 .class));
    }

    public void deleteVstafac2(Vstafac2 vstafac2) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vstafac2);
    }

    public Vproj getVprojById(VprojId id) {
        List<Vproj> rtn = ((List<Vproj> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVprojById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void updateEmpResume(EmpResume empResume) {
        dsMgr.invoke(taskMgr.getUpdateTask(), empResume);
    }

    public Integer getVprojCount(Vproj searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vproj();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVprojCount(Vproj searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vproj();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVprojCount() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vproj.class));
    }

    public Employee insertEmployee(Employee employee) {
        return ((Employee) dsMgr.invoke(taskMgr.getInsertTask(), employee));
    }

    public List<ClSched> getClSchedList(ClSched searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.ClSched();
        }
        return ((List<ClSched> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<ClSched> getClSchedList(ClSched searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.ClSched();
        }
        return ((List<ClSched> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<ClSched> getClSchedList() {
        return ((List<ClSched> ) dsMgr.invoke(taskMgr.getSearchTask(), ClSched.class));
    }

    public Integer getVastrde1Count(Vastrde1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde1();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVastrde1Count(Vastrde1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vastrde1();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVastrde1Count() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vastrde1 .class));
    }

    public Inventory insertInventory(Inventory inventory) {
        return ((Inventory) dsMgr.invoke(taskMgr.getInsertTask(), inventory));
    }

    public void updateStaff(Staff staff) {
        dsMgr.invoke(taskMgr.getUpdateTask(), staff);
    }

    public void deleteVpstrde1(Vpstrde1 vpstrde1) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vpstrde1);
    }

    public void deleteVpstrde2(Vpstrde2 vpstrde2) {
        dsMgr.invoke(taskMgr.getDeleteTask(), vpstrde2);
    }

    public Integer getVpstrde2Count(Vpstrde2 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vpstrde2();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public Integer getVpstrde2Count(Vpstrde2 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Vpstrde2();
        }
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), searchInstance));
    }

    public Integer getVpstrde2Count() {
        return ((Integer) dsMgr.invoke(taskMgr.getCountTask(), Vpstrde2 .class));
    }

    public void updateVproj(Vproj vproj) {
        dsMgr.invoke(taskMgr.getUpdateTask(), vproj);
    }

    public Vpstrde2 getVpstrde2ById(Vpstrde2Id id) {
        List<Vpstrde2> rtn = ((List<Vpstrde2> ) dsMgr.invoke(taskMgr.getQueryTask(), "getVpstrde2ById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public void deleteEmpPhoto(EmpPhoto empPhoto) {
        dsMgr.invoke(taskMgr.getDeleteTask(), empPhoto);
    }

    public List<Foo1> getFoo1List(Foo1 searchInstance, QueryOptions options) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Foo1();
        }
        return ((List<Foo1> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public List<Foo1> getFoo1List(Foo1 searchInstance) {
        if (searchInstance == null) {
            searchInstance = new com.wavemaker.runtime.data.sample.db2sampledb.Foo1();
        }
        return ((List<Foo1> ) dsMgr.invoke(taskMgr.getSearchTask(), searchInstance));
    }

    public List<Foo1> getFoo1List() {
        return ((List<Foo1> ) dsMgr.invoke(taskMgr.getSearchTask(), Foo1 .class));
    }

    public void begin() {
        dsMgr.begin();
    }

    public void commit() {
        dsMgr.commit();
    }

    public void rollback() {
        dsMgr.rollback();
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

    public final static void main(String[] args) {
        String cfg = "db2sample.spring.xml";
        String beanName = "db2sample";
        com.wavemaker.runtime.data.sample.db2sampledb.DB2Sample s = ((com.wavemaker.runtime.data.sample.db2sampledb.DB2Sample) SpringUtils.getBean(cfg, beanName));
        System.out.print("getCustomerCount: ");
        System.out.println(s.getCustomerCount());
    }
}
