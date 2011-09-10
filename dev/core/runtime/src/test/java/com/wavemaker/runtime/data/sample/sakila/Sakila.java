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
package com.wavemaker.runtime.data.sample.sakila;

import java.util.List;

import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.runtime.data.DataServiceManager;
import com.wavemaker.runtime.data.DataServiceManagerAccess;
import com.wavemaker.runtime.data.QueryOptions;
import com.wavemaker.runtime.data.TaskManager;
import com.wavemaker.runtime.data.sample.sakila.output.GetActorNames;
import com.wavemaker.runtime.service.LiveDataService;
import com.wavemaker.runtime.service.PagingOptions;
import com.wavemaker.runtime.service.PropertyOptions;
import com.wavemaker.runtime.service.TypedServiceReturn;

/**
 * Generated for Service "sakila2" on 07/07/2007 15:52:39
 * 
 */
@SuppressWarnings({"unchecked"})
public class Sakila implements DataServiceManagerAccess, LiveDataService {

    private DataServiceManager ds = null;
    private TaskManager taskMgr = null;

    public Sakila() {}

    public Sakila(DataServiceManager ds) {
        this.ds = ds;
    }

    public void setDataServiceManager(DataServiceManager ds) {
        this.ds = ds;
    }

    public void setTaskManager(TaskManager taskMgr) {
        this.taskMgr = taskMgr;
    }

    public List getFilmInStock(Short filmId, Byte storeId) {
        return (List) ds.invoke(taskMgr.getQueryTask(), "FilmInStock", filmId,
                storeId);
    }

    public void insertCity(City city) {
        ds.invoke(taskMgr.getInsertTask(), city);
    }
    
    public City testLoadCityAndCountryAndAddresses() {
        List<City> rtn = ((List<City>) ds.invoke(taskMgr.getQueryTask(), "testLoadCityAndCountryAndAddresses"));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }
    
    public City testLoadCityAndCountryAndCities() {
        List<City> rtn = ((List<City>) ds.invoke(taskMgr.getQueryTask(), "testLoadCityAndCountryAndCities"));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }
    
    public List<Actor> testLoadActorsFilmActorsFilms() {
        return ((List<Actor>) ds.invoke(taskMgr.getQueryTask(), "testLoadActorsFilmActorsFilms"));
    }
    

    public City getCityById(Short id) {
        List<City> rtn = ((List<City>) ds.invoke(taskMgr.getQueryTask(), "getCityById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getCityCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getCityCount"));
    }

    public List<City> getCityList(City qbeInstance, QueryOptions queryOptions) {
        return ((List<City>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    // added manually
    public List<City> getCityList(City qbeInstance) {
        return ((List<City>) ds.invoke(taskMgr.getSearchTask(), qbeInstance));
    }
    
    // added manually
    public List<Varcharpk> getVarcharpkList(Varcharpk qbeInstance, QueryOptions options) {
        return ((List<Varcharpk>) ds.invoke(taskMgr.getSearchTask(), qbeInstance, options));
    }
    
    // added manually
    public List<Compositepk> getCompositepkList(Compositepk qbeInstance, QueryOptions options) {
        return ((List<Compositepk>) ds.invoke(taskMgr.getSearchTask(), qbeInstance, options));
    }

    public void updateCity(City city) {
        ds.invoke(taskMgr.getUpdateTask(), city);
    }
    
    public void updateCity(City city, boolean updateRelated) {
        ds.invoke(taskMgr.getUpdateTask(), city, updateRelated);
    }

    public void deleteCity(City city) {
        ds.invoke(taskMgr.getDeleteTask(), city);
    }

    public void insertPayment(Payment payment) {
        ds.invoke(taskMgr.getInsertTask(), payment);
    }

    public Payment getPaymentById(Short id) {
        List<Payment> rtn = ((List<Payment>) ds.invoke(taskMgr.getQueryTask(), "getPaymentById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getPaymentCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getPaymentCount"));
    }

    public List<Payment> getPaymentList(Payment qbeInstance,
            QueryOptions queryOptions) {
        return ((List<Payment>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updatePayment(Payment payment) {
        ds.invoke(taskMgr.getUpdateTask(), payment);
    }

    public void deletePayment(Payment payment) {
        ds.invoke(taskMgr.getDeleteTask(), payment);
    }

    public void insertStore(Store store) {
        ds.invoke(taskMgr.getInsertTask(), store);
    }

    public Long getStoreCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getStoreCount"));
    }

    public Store getStoreById(Byte id) {
        List<Store> rtn = ((List<Store>) ds.invoke(taskMgr.getQueryTask(), "getStoreById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Store> getStoreList(Store qbeInstance, QueryOptions queryOptions) {
        return ((List<Store>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateStore(Store store) {
        ds.invoke(taskMgr.getUpdateTask(), store);
    }

    public void deleteStore(Store store) {
        ds.invoke(taskMgr.getDeleteTask(), store);
    }

    public void insertAddress(Address address) {
        ds.invoke(taskMgr.getInsertTask(), address);
    }

    public Address getAddressById(Short id) {
        List<Address> rtn = ((List<Address>) ds.invoke(taskMgr.getQueryTask(), "getAddressById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getAddressCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getAddressCount"));
    }

    public List<Address> getAddressList(Address qbeInstance,
            QueryOptions queryOptions) {
        return ((List<Address>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateAddress(Address address) {
        ds.invoke(taskMgr.getUpdateTask(), address);
    }

    public void deleteAddress(Address address) {
        ds.invoke(taskMgr.getDeleteTask(), address);
    }

    public void insertRental(Rental rental) {
        ds.invoke(taskMgr.getInsertTask(), rental);
    }

    public Long getRentalCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getRentalCount"));
    }

    public Rental getRentalById(Integer id) {
        List<Rental> rtn = ((List<Rental>) ds.invoke(taskMgr.getQueryTask(), "getRentalById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Rental> getRentalList(Rental qbeInstance,
            QueryOptions queryOptions) {
        return ((List<Rental>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateRental(Rental rental) {
        ds.invoke(taskMgr.getUpdateTask(), rental);
    }

    public void deleteRental(Rental rental) {
        ds.invoke(taskMgr.getDeleteTask(), rental);
    }

    public void insertNicerButSlowerFilmList(
            NicerButSlowerFilmList nicerButSlowerFilmList) {
        ds.invoke(taskMgr.getInsertTask(), nicerButSlowerFilmList);
    }

    public Long getNicerButSlowerFilmListCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(),
                "getNicerButSlowerFilmListCount"));
    }

    public NicerButSlowerFilmList getNicerButSlowerFilmListById(
            NicerButSlowerFilmListId id) {
        List<NicerButSlowerFilmList> rtn = ((List<NicerButSlowerFilmList>) ds.invoke(taskMgr.getQueryTask(), "getNicerButSlowerFilmListById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<NicerButSlowerFilmList> getNicerButSlowerFilmListList(
            NicerButSlowerFilmList qbeInstance, QueryOptions queryOptions) {
        return ((List<NicerButSlowerFilmList>) ds.invoke(taskMgr.getSearchTask(),
                qbeInstance, queryOptions));
    }

    public void updateNicerButSlowerFilmList(
            NicerButSlowerFilmList nicerButSlowerFilmList) {
        ds.invoke(taskMgr.getUpdateTask(), nicerButSlowerFilmList);
    }

    public void deleteNicerButSlowerFilmList(
            NicerButSlowerFilmList nicerButSlowerFilmList) {
        ds.invoke(taskMgr.getDeleteTask(), nicerButSlowerFilmList);
    }

    public void insertFilmText(FilmText filmText) {
        ds.invoke(taskMgr.getInsertTask(), filmText);
    }

    public Long getFilmTextCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getFilmTextCount"));
    }

    public FilmText getFilmTextById(Short id) {
        List<FilmText> rtn = ((List<FilmText>) ds.invoke(taskMgr.getQueryTask(), "getFilmTextById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<FilmText> getFilmTextList(FilmText qbeInstance,
            QueryOptions queryOptions) {
        return ((List<FilmText>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateFilmText(FilmText filmText) {
        ds.invoke(taskMgr.getUpdateTask(), filmText);
    }

    public void deleteFilmText(FilmText filmText) {
        ds.invoke(taskMgr.getDeleteTask(), filmText);
    }

    public void insertInventory(Inventory inventory) {
        ds.invoke(taskMgr.getInsertTask(), inventory);
    }

    public Inventory getInventoryById(Integer id) {
        List<Inventory> rtn = ((List<Inventory>) ds.invoke(taskMgr.getQueryTask(), "getInventoryById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getInventoryCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getInventoryCount"));
    }

    public List<Inventory> getInventoryList(Inventory qbeInstance,
            QueryOptions queryOptions) {
        return ((List<Inventory>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateInventory(Inventory inventory) {
        ds.invoke(taskMgr.getUpdateTask(), inventory);
    }

    public void deleteInventory(Inventory inventory) {
        ds.invoke(taskMgr.getDeleteTask(), inventory);
    }

    public void insertFilm(Film film) {
        ds.invoke(taskMgr.getInsertTask(), film);
    }

    public Long getFilmCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getFilmCount"));
    }

    public Film getFilmById(Short id) {
        List<Film> rtn = ((List<Film>) ds.invoke(taskMgr.getQueryTask(), "getFilmById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Film> getFilmList(Film qbeInstance, QueryOptions queryOptions) {
        return ((List<Film>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateFilm(Film film) {
        ds.invoke(taskMgr.getUpdateTask(), film);
    }

    public void deleteFilm(Film film) {
        ds.invoke(taskMgr.getDeleteTask(), film);
    }

    public void insertStaffList(StaffList staffList) {
        ds.invoke(taskMgr.getInsertTask(), staffList);
    }

    public StaffList getStaffListById(StaffListId id) {
        List<StaffList> rtn = ((List<StaffList>) ds.invoke(taskMgr.getQueryTask(), "getStaffListById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getStaffListCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getStaffListCount"));
    }

    public List<StaffList> getStaffListList(StaffList qbeInstance,
            QueryOptions queryOptions) {
        return ((List<StaffList>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateStaffList(StaffList staffList) {
        ds.invoke(taskMgr.getUpdateTask(), staffList);
    }

    public void deleteStaffList(StaffList staffList) {
        ds.invoke(taskMgr.getDeleteTask(), staffList);
    }

    public void insertFilmList(FilmList filmList) {
        ds.invoke(taskMgr.getInsertTask(), filmList);
    }

    public Long getFilmListCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getFilmListCount"));
    }

    public FilmList getFilmListById(FilmListId id) {
        List<FilmList> rtn = ((List<FilmList>) ds.invoke(taskMgr.getQueryTask(), "getFilmListById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<FilmList> getFilmListList(FilmList qbeInstance,
            QueryOptions queryOptions) {
        return ((List<FilmList>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }
    
    public List<FilmList> getFilmListList() {
        return ((List<FilmList>) ds.invoke(taskMgr.getSearchTask(), FilmList.class));
    }

    public void updateFilmList(FilmList filmList) {
        ds.invoke(taskMgr.getUpdateTask(), filmList);
    }

    public void deleteFilmList(FilmList filmList) {
        ds.invoke(taskMgr.getDeleteTask(), filmList);
    }

    public void insertActor(Actor actor) {
        ds.invoke(taskMgr.getInsertTask(), actor);
    }

    public Actor getActorById(Short id) {
        List<Actor> rtn = ((List<Actor>) ds.invoke(taskMgr.getQueryTask(), "getActorById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getActorCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getActorCount"));
    }

    public List<Actor> getActorList(Actor qbeInstance, QueryOptions queryOptions) {
        return ((List<Actor>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateActor(Actor actor) {
        ds.invoke(taskMgr.getUpdateTask(), actor);
    }

    public void deleteActor(Actor actor) {
        ds.invoke(taskMgr.getDeleteTask(), actor);
    }

    public void insertFilmCategory(FilmCategory filmCategory) {
        ds.invoke(taskMgr.getInsertTask(), filmCategory);
    }

    public FilmCategory getFilmCategoryById(FilmCategoryId id) {
        List<FilmCategory> rtn = ((List<FilmCategory>) ds.invoke(taskMgr.getQueryTask(), "getFilmCategoryById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getFilmCategoryCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getFilmCategoryCount"));
    }

    public List<FilmCategory> getFilmCategoryList(FilmCategory qbeInstance,
            QueryOptions queryOptions) {
        return ((List<FilmCategory>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateFilmCategory(FilmCategory filmCategory) {
        ds.invoke(taskMgr.getUpdateTask(), filmCategory);
    }

    public void deleteFilmCategory(FilmCategory filmCategory) {
        ds.invoke(taskMgr.getDeleteTask(), filmCategory);
    }

    public void insertCustomer(Customer customer) {
        ds.invoke(taskMgr.getInsertTask(), customer);
    }

    public Long getCustomerCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getCustomerCount"));
    }

    public Customer getCustomerById(Short id) {
        List<Customer> rtn = ((List<Customer>) ds.invoke(taskMgr.getQueryTask(), "getCustomerById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }
    
    public List<Customer> getCustomerList(Customer qbeInstance) {
        return ((List<Customer>) ds.invoke(taskMgr.getSearchTask(), qbeInstance));
        
    }

    public List<Customer> getCustomerList(Customer qbeInstance,
            QueryOptions queryOptions) {
        return ((List<Customer>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateCustomer(Customer customer) {
        ds.invoke(taskMgr.getUpdateTask(), customer);
    }

    public void deleteCustomer(Customer customer) {
        ds.invoke(taskMgr.getDeleteTask(), customer);
    }

    public void insertStaff(Staff staff) {
        ds.invoke(taskMgr.getInsertTask(), staff);
    }

    public Staff getStaffById(Byte id) {
        List<Staff> rtn = ((List<Staff>) ds.invoke(taskMgr.getQueryTask(), "getStaffById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getStaffCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getStaffCount"));
    }

    public List<Staff> getStaffList(Staff qbeInstance, QueryOptions queryOptions) {
        return ((List<Staff>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateStaff(Staff staff) {
        ds.invoke(taskMgr.getUpdateTask(), staff);
    }

    public void deleteStaff(Staff staff) {
        ds.invoke(taskMgr.getDeleteTask(), staff);
    }

    public Country insertCountry(Country country) {
        return (Country)ds.invoke(taskMgr.getInsertTask(), country);
    }

    public Country getCountryById(Short id) {
        List<Country> rtn = ((List<Country>) ds.invoke(taskMgr.getQueryTask(), "getCountryById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getCountryCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getCountryCount"));
    }

    public List<Country> getCountryList(Country qbeInstance,
            QueryOptions queryOptions) {
        return ((List<Country>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateCountry(Country country) {
        ds.invoke(taskMgr.getUpdateTask(), country);
    }

    public void deleteCountry(Country country) {
        ds.invoke(taskMgr.getDeleteTask(), country);
    }

    public void insertCategory(Category category) {
        ds.invoke(taskMgr.getInsertTask(), category);
    }

    public Long getCategoryCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getCategoryCount"));
    }

    public Category getCategoryById(Byte id) {
        List<Category> rtn = ((List<Category>) ds.invoke(taskMgr.getQueryTask(), "getCategoryById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Category> getCategoryList(Category qbeInstance,
            QueryOptions queryOptions) {
        return ((List<Category>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateCategory(Category category) {
        ds.invoke(taskMgr.getUpdateTask(), category);
    }

    public void deleteCategory(Category category) {
        ds.invoke(taskMgr.getDeleteTask(), category);
    }

    public void insertActorInfo(ActorInfo actorInfo) {
        ds.invoke(taskMgr.getInsertTask(), actorInfo);
    }

    public Long getActorInfoCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getActorInfoCount"));
    }

    public ActorInfo getActorInfoById(ActorInfoId id) {
        List<ActorInfo> rtn = ((List<ActorInfo>) ds.invoke(taskMgr.getQueryTask(), "getActorInfoById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<ActorInfo> getActorInfoList(ActorInfo qbeInstance,
            QueryOptions queryOptions) {
        return ((List<ActorInfo>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateActorInfo(ActorInfo actorInfo) {
        ds.invoke(taskMgr.getUpdateTask(), actorInfo);
    }

    public void deleteActorInfo(ActorInfo actorInfo) {
        ds.invoke(taskMgr.getDeleteTask(), actorInfo);
    }

    public void insertCustomerList(CustomerList customerList) {
        ds.invoke(taskMgr.getInsertTask(), customerList);
    }

    public CustomerList getCustomerListById(CustomerListId id) {
        List<CustomerList> rtn = ((List<CustomerList>) ds.invoke(taskMgr.getQueryTask(), "getCustomerListById", id));

        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getCustomerListCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getCustomerListCount"));
    }

    public List<CustomerList> getCustomerListList(CustomerList qbeInstance,
            QueryOptions queryOptions) {
        return ((List<CustomerList>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public List<CustomerListFixed> getCustomerListFixedList(
            CustomerListFixed qbeInstance, QueryOptions queryOptions) {
        return ((List<CustomerListFixed>) ds.invoke(taskMgr.getSearchTask(),
                qbeInstance, queryOptions));
    }

    public void updateCustomerList(CustomerList customerList) {
        ds.invoke(taskMgr.getUpdateTask(), customerList);
    }

    public void deleteCustomerList(CustomerList customerList) {
        ds.invoke(taskMgr.getDeleteTask(), customerList);
    }

    public void insertSalesByFilmCategory(
            SalesByFilmCategory salesByFilmCategory) {
        ds.invoke(taskMgr.getInsertTask(), salesByFilmCategory);
    }

    public SalesByFilmCategory getSalesByFilmCategoryById(
            SalesByFilmCategoryId id) {
        List<SalesByFilmCategory> rtn = ((List<SalesByFilmCategory>) ds.invoke(taskMgr.getQueryTask(), "getSalesByFilmCategoryById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getSalesByFilmCategoryCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(),
                "getSalesByFilmCategoryCount"));
    }

    public List<SalesByFilmCategory> getSalesByFilmCategoryList(
            SalesByFilmCategory qbeInstance, QueryOptions queryOptions) {
        return ((List<SalesByFilmCategory>) ds.invoke(taskMgr.getSearchTask(),
                qbeInstance, queryOptions));
    }

    public void updateSalesByFilmCategory(
            SalesByFilmCategory salesByFilmCategory) {
        ds.invoke(taskMgr.getUpdateTask(), salesByFilmCategory);
    }

    public void deleteSalesByFilmCategory(
            SalesByFilmCategory salesByFilmCategory) {
        ds.invoke(taskMgr.getDeleteTask(), salesByFilmCategory);
    }

    public void insertFilmActor(FilmActor filmActor) {
        ds.invoke(taskMgr.getInsertTask(), filmActor);
    }

    public Long getFilmActorCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getFilmActorCount"));
    }

    public FilmActor getFilmActorById(FilmActorId id) {
        List<FilmActor> rtn = ((List<FilmActor>) ds.invoke(taskMgr.getQueryTask(), "getFilmActorById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<FilmActor> getFilmActorList(FilmActor qbeInstance,
            QueryOptions queryOptions) {
        return ((List<FilmActor>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateFilmActor(FilmActor filmActor) {
        ds.invoke(taskMgr.getUpdateTask(), filmActor);
    }

    public void deleteFilmActor(FilmActor filmActor) {
        ds.invoke(taskMgr.getDeleteTask(), filmActor);
    }

    public void insertSalesByStore(SalesByStore salesByStore) {
        ds.invoke(taskMgr.getInsertTask(), salesByStore);
    }

    public Long getSalesByStoreCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getSalesByStoreCount"));
    }

    public SalesByStore getSalesByStoreById(SalesByStoreId id) {
        List<SalesByStore> rtn = ((List<SalesByStore>) ds.invoke(taskMgr.getQueryTask(), "getSalesByStoreById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<SalesByStore> getSalesByStoreList(SalesByStore qbeInstance,
            QueryOptions queryOptions) {
        return ((List<SalesByStore>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    public void updateSalesByStore(SalesByStore salesByStore) {
        ds.invoke(taskMgr.getUpdateTask(), salesByStore);
    }

    public void deleteSalesByStore(SalesByStore salesByStore) {
        ds.invoke(taskMgr.getDeleteTask(), salesByStore);
    }

    public void insertLanguage(Language language) {
        ds.invoke(taskMgr.getInsertTask(), language);
    }

    public Language getLanguageById(Byte id) {
        List<Language> rtn = ((List<Language>) ds.invoke(taskMgr.getQueryTask(), "getLanguageById", id));
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getLanguageCount() {
        return ((Long) ds.invoke(taskMgr.getQueryTask(), "getLanguageCount"));
    }

    public List<Language> getLanguageList(Language qbeInstance,
            QueryOptions queryOptions) {
        return ((List<Language>) ds.invoke(taskMgr.getSearchTask(), qbeInstance,
                queryOptions));
    }

    // manually added
    public List<GetActorNames> getActorNames() {
        return ((List<GetActorNames>) ds.invoke(taskMgr.getQueryTask(), "getActorNames"));
    }

    public List<Actor> getActorsByFirstNames(List<String> names) {
        return ((List<Actor>) ds.invoke(taskMgr.getQueryTask(), "getActorsByFirstNames", names));
    }

    public void begin() {
        ds.begin();
    }

    public void commit() {
        ds.commit();
    }

    public void rollback() {
        ds.rollback();
    }

    public void updateLanguage(Language language) {
        ds.invoke(taskMgr.getUpdateTask(), language);
    }

    public void deleteLanguage(Language language) {
        ds.invoke(taskMgr.getDeleteTask(), language);
    }

    public DataServiceManager getDataServiceManager() {
        return ds;
    }

    public TypedServiceReturn read(TypeDefinition type, Object instance,
            PropertyOptions propertyOptions, PagingOptions pagingOptions) {
        return ((TypedServiceReturn) ds.invoke(taskMgr.getReadTask(), type, instance, propertyOptions, pagingOptions));
    }

    public void delete(Object o) {
        ds.invoke(taskMgr.getDeleteTask(), o);
    }

    public Object insert(Object o) {
        return ds.invoke(taskMgr.getInsertTask(), o);
    }

    public Object update(Object o) {
        return ds.invoke(taskMgr.getUpdateTask(), o);
    }
}
