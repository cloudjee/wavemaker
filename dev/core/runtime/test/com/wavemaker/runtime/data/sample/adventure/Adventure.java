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

package com.wavemaker.runtime.data.sample.adventure;

import java.util.List;

import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.runtime.data.DataServiceManager;
import com.wavemaker.runtime.data.DataServiceManagerAccess;
import com.wavemaker.runtime.data.DefaultTaskManager;
import com.wavemaker.runtime.data.QueryOptions;
import com.wavemaker.runtime.data.TaskManager;


/**
 * Generated for Service "adventure" on 08/18/2007 17:20:18
 * 
 */
@SuppressWarnings("unchecked")
public class Adventure
    implements DataServiceManagerAccess
{

    private final DataServiceManager ds;
    private final TaskManager taskMgr = DefaultTaskManager.getInstance();

    public Adventure(DataServiceManager ds) {
        this.ds = ds;
    }

    public void insertAddress(Address address) {
        ds.invoke(taskMgr.getInsertTask(), address);
    }

    public Address getAddressById(Integer id) {
        List<Address> rtn = ((List<Address>) ds.invoke(taskMgr.getQueryTask(), "getAddressById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Address> getAddressList(Address searchInstance, QueryOptions options) {
        return ((List<Address> ) ds.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public Integer getAddressCount(Address searchInstance, QueryOptions options) {
        return ((Integer) ds.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public void updateAddress(Address address) {
        ds.invoke(taskMgr.getUpdateTask(), address);
    }

    public void deleteAddress(Address address) {
        ds.invoke(taskMgr.getDeleteTask(), address);
    }

    public void insertCustomer(Customer customer) {
        ds.invoke(taskMgr.getInsertTask(), customer);
    }

    public Customer getCustomerById(Integer id) {
        List<Customer> rtn = ((List<Customer>) ds.invoke(taskMgr.getQueryTask(), "getCustomerById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Customer> getCustomerList(Customer searchInstance, QueryOptions options) {
        return ((List<Customer> ) ds.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public Integer getCustomerCount(Customer searchInstance, QueryOptions options) {
        return ((Integer) ds.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public void updateCustomer(Customer customer) {
        ds.invoke(taskMgr.getUpdateTask(), customer);
    }

    public void deleteCustomer(Customer customer) {
        ds.invoke(taskMgr.getDeleteTask(), customer);
    }

    public void insertCustomerAddress(CustomerAddress customerAddress) {
        ds.invoke(taskMgr.getInsertTask(), customerAddress);
    }

    public CustomerAddress getCustomerAddressById(CustomerAddressId id) {
        List<CustomerAddress> rtn = ((List<CustomerAddress>) ds.invoke(taskMgr.getQueryTask(), "getCustomerAddressById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<CustomerAddress> getCustomerAddressList(CustomerAddress searchInstance, QueryOptions options) {
        return ((List<CustomerAddress> ) ds.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public Integer getCustomerAddressCount(CustomerAddress searchInstance, QueryOptions options) {
        return ((Integer) ds.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public void updateCustomerAddress(CustomerAddress customerAddress) {
        ds.invoke(taskMgr.getUpdateTask(), customerAddress);
    }

    public void deleteCustomerAddress(CustomerAddress customerAddress) {
        ds.invoke(taskMgr.getDeleteTask(), customerAddress);
    }

    public void insertProduct(Product product) {
        ds.invoke(taskMgr.getInsertTask(), product);
    }

    public Product getProductById(Integer id) {
        List<Product> rtn = ((List<Product>) ds.invoke(taskMgr.getQueryTask(), "getProductById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Product> getProductList(Product searchInstance, QueryOptions options) {
        return ((List<Product> ) ds.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public Integer getProductCount(Product searchInstance, QueryOptions options) {
        return ((Integer) ds.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public void updateProduct(Product product) {
        ds.invoke(taskMgr.getUpdateTask(), product);
    }

    public void deleteProduct(Product product) {
        ds.invoke(taskMgr.getDeleteTask(), product);
    }

    public void insertProductCategory(ProductCategory productCategory) {
        ds.invoke(taskMgr.getInsertTask(), productCategory);
    }

    public ProductCategory getProductCategoryById(Integer id) {
        List<ProductCategory> rtn = ((List<ProductCategory>) ds.invoke(taskMgr.getQueryTask(), "getProductCategoryById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<ProductCategory> getProductCategoryList(ProductCategory searchInstance, QueryOptions options) {
        return ((List<ProductCategory> ) ds.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public Integer getProductCategoryCount(ProductCategory searchInstance, QueryOptions options) {
        return ((Integer) ds.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public void updateProductCategory(ProductCategory productCategory) {
        ds.invoke(taskMgr.getUpdateTask(), productCategory);
    }

    public void deleteProductCategory(ProductCategory productCategory) {
        ds.invoke(taskMgr.getDeleteTask(), productCategory);
    }

    public void insertProductDescription(ProductDescription productDescription) {
        ds.invoke(taskMgr.getInsertTask(), productDescription);
    }

    public ProductDescription getProductDescriptionById(Integer id) {
        List<ProductDescription> rtn = ((List<ProductDescription>) ds.invoke(taskMgr.getQueryTask(), "getProductDescriptionById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<ProductDescription> getProductDescriptionList(ProductDescription searchInstance, QueryOptions options) {
        return ((List<ProductDescription> ) ds.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public Integer getProductDescriptionCount(ProductDescription searchInstance, QueryOptions options) {
        return ((Integer) ds.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public void updateProductDescription(ProductDescription productDescription) {
        ds.invoke(taskMgr.getUpdateTask(), productDescription);
    }

    public void deleteProductDescription(ProductDescription productDescription) {
        ds.invoke(taskMgr.getDeleteTask(), productDescription);
    }

    public void insertProductModel(ProductModel productModel) {
        ds.invoke(taskMgr.getInsertTask(), productModel);
    }

    public ProductModel getProductModelById(Integer id) {
        List<ProductModel> rtn = ((List<ProductModel>) ds.invoke(taskMgr.getQueryTask(), "getProductModelById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<ProductModel> getProductModelList(ProductModel searchInstance, QueryOptions options) {
        return ((List<ProductModel> ) ds.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public Integer getProductModelCount(ProductModel searchInstance, QueryOptions options) {
        return ((Integer) ds.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public void updateProductModel(ProductModel productModel) {
        ds.invoke(taskMgr.getUpdateTask(), productModel);
    }

    public void deleteProductModel(ProductModel productModel) {
        ds.invoke(taskMgr.getDeleteTask(), productModel);
    }

    public void insertProductModelProductDescription(ProductModelProductDescription productModelProductDescription) {
        ds.invoke(taskMgr.getInsertTask(), productModelProductDescription);
    }

    public ProductModelProductDescription getProductModelProductDescriptionById(ProductModelProductDescriptionId id) {
        List<ProductModelProductDescription> rtn = ((List<ProductModelProductDescription>) ds.invoke(taskMgr.getQueryTask(), "getProductModelProductDescriptionById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<ProductModelProductDescription> getProductModelProductDescriptionList(ProductModelProductDescription searchInstance, QueryOptions options) {
        return ((List<ProductModelProductDescription> ) ds.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public Integer getProductModelProductDescriptionCount(ProductModelProductDescription searchInstance, QueryOptions options) {
        return ((Integer) ds.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public void updateProductModelProductDescription(ProductModelProductDescription productModelProductDescription) {
        ds.invoke(taskMgr.getUpdateTask(), productModelProductDescription);
    }

    public void deleteProductModelProductDescription(ProductModelProductDescription productModelProductDescription) {
        ds.invoke(taskMgr.getDeleteTask(), productModelProductDescription);
    }

    public void insertSalesOrderDetail(SalesOrderDetail salesOrderDetail) {
        ds.invoke(taskMgr.getInsertTask(), salesOrderDetail);
    }

    public SalesOrderDetail getSalesOrderDetailById(SalesOrderDetailId id) {
        List<SalesOrderDetail> rtn = ((List<SalesOrderDetail>) ds.invoke(taskMgr.getQueryTask(), "getSalesOrderDetailById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<SalesOrderDetail> getSalesOrderDetailList(SalesOrderDetail searchInstance, QueryOptions options) {
        return ((List<SalesOrderDetail> ) ds.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public Integer getSalesOrderDetailCount(SalesOrderDetail searchInstance, QueryOptions options) {
        return ((Integer) ds.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public void updateSalesOrderDetail(SalesOrderDetail salesOrderDetail) {
        ds.invoke(taskMgr.getUpdateTask(), salesOrderDetail);
    }

    public void deleteSalesOrderDetail(SalesOrderDetail salesOrderDetail) {
        ds.invoke(taskMgr.getDeleteTask(), salesOrderDetail);
    }

    public void insertSalesOrderHeader(SalesOrderHeader salesOrderHeader) {
        ds.invoke(taskMgr.getInsertTask(), salesOrderHeader);
    }

    public SalesOrderHeader getSalesOrderHeaderById(Integer id) {
        List<SalesOrderHeader> rtn = ((List<SalesOrderHeader>) ds.invoke(taskMgr.getQueryTask(), "getSalesOrderHeaderById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<SalesOrderHeader> getSalesOrderHeaderList(SalesOrderHeader searchInstance, QueryOptions options) {
        return ((List<SalesOrderHeader> ) ds.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public Integer getSalesOrderHeaderCount(SalesOrderHeader searchInstance, QueryOptions options) {
        return ((Integer) ds.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public void updateSalesOrderHeader(SalesOrderHeader salesOrderHeader) {
        ds.invoke(taskMgr.getUpdateTask(), salesOrderHeader);
    }

    public void deleteSalesOrderHeader(SalesOrderHeader salesOrderHeader) {
        ds.invoke(taskMgr.getDeleteTask(), salesOrderHeader);
    }

    public void insertVgetAllCategories(VgetAllCategories vgetAllCategories) {
        ds.invoke(taskMgr.getInsertTask(), vgetAllCategories);
    }

    public VgetAllCategories getVgetAllCategoriesById(VgetAllCategoriesId id) {
        List<VgetAllCategories> rtn = ((List<VgetAllCategories>) ds.invoke(taskMgr.getQueryTask(), "getVgetAllCategoriesById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<VgetAllCategories> getVgetAllCategoriesList(VgetAllCategories searchInstance, QueryOptions options) {
        return ((List<VgetAllCategories> ) ds.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public Integer getVgetAllCategoriesCount(VgetAllCategories searchInstance, QueryOptions options) {
        return ((Integer) ds.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public void updateVgetAllCategories(VgetAllCategories vgetAllCategories) {
        ds.invoke(taskMgr.getUpdateTask(), vgetAllCategories);
    }

    public void deleteVgetAllCategories(VgetAllCategories vgetAllCategories) {
        ds.invoke(taskMgr.getDeleteTask(), vgetAllCategories);
    }

    public void insertVproductAndDescription(VproductAndDescription vproductAndDescription) {
        ds.invoke(taskMgr.getInsertTask(), vproductAndDescription);
    }

    public VproductAndDescription getVproductAndDescriptionById(VproductAndDescriptionId id) {
        List<VproductAndDescription> rtn = ((List<VproductAndDescription>) ds.invoke(taskMgr.getQueryTask(), "getVproductAndDescriptionById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<VproductAndDescription> getVproductAndDescriptionList(VproductAndDescription searchInstance, QueryOptions options) {
        return ((List<VproductAndDescription> ) ds.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public Integer getVproductAndDescriptionCount(VproductAndDescription searchInstance, QueryOptions options) {
        return ((Integer) ds.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public void updateVproductAndDescription(VproductAndDescription vproductAndDescription) {
        ds.invoke(taskMgr.getUpdateTask(), vproductAndDescription);
    }

    public void deleteVproductAndDescription(VproductAndDescription vproductAndDescription) {
        ds.invoke(taskMgr.getDeleteTask(), vproductAndDescription);
    }

    public void insertVproductModelCatalogDescription(VproductModelCatalogDescription vproductModelCatalogDescription) {
        ds.invoke(taskMgr.getInsertTask(), vproductModelCatalogDescription);
    }

    public VproductModelCatalogDescription getVproductModelCatalogDescriptionById(VproductModelCatalogDescriptionId id) {
        List<VproductModelCatalogDescription> rtn = ((List<VproductModelCatalogDescription>) ds.invoke(taskMgr.getQueryTask(), "getVproductModelCatalogDescriptionById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<VproductModelCatalogDescription> getVproductModelCatalogDescriptionList(VproductModelCatalogDescription searchInstance, QueryOptions options) {
        return ((List<VproductModelCatalogDescription> ) ds.invoke(taskMgr.getSearchTask(), searchInstance, options));
    }

    public Integer getVproductModelCatalogDescriptionCount(VproductModelCatalogDescription searchInstance, QueryOptions options) {
        return ((Integer) ds.invoke(taskMgr.getCountTask(), searchInstance, options));
    }

    public void updateVproductModelCatalogDescription(VproductModelCatalogDescription vproductModelCatalogDescription) {
        ds.invoke(taskMgr.getUpdateTask(), vproductModelCatalogDescription);
    }

    public void deleteVproductModelCatalogDescription(VproductModelCatalogDescription vproductModelCatalogDescription) {
        ds.invoke(taskMgr.getDeleteTask(), vproductModelCatalogDescription);
    }

    public DataServiceManager getDataServiceManager() {
        return ds;
    }

    public final static void main(String[] args) {
        String cfg = "adventure.spring.xml";
        String beanName = "adventure";
        Adventure s = ((Adventure) SpringUtils.getBean(cfg, beanName));
        System.out.print("getAddressCount: ");
        System.out.println(s.getAddressCount(new Address(), new QueryOptions()));
    }

}
