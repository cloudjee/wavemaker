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
@SuppressWarnings({ "unchecked" })
public class Sakila implements DataServiceManagerAccess, LiveDataService {

    private DataServiceManager ds = null;

    private TaskManager taskMgr = null;

    public Sakila() {
    }

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
        return (List) this.ds.invoke(this.taskMgr.getQueryTask(), "FilmInStock", filmId, storeId);
    }

    public void insertCity(City city) {
        this.ds.invoke(this.taskMgr.getInsertTask(), city);
    }

    public City testLoadCityAndCountryAndAddresses() {
        List<City> rtn = (List<City>) this.ds.invoke(this.taskMgr.getQueryTask(), "testLoadCityAndCountryAndAddresses");
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public City testLoadCityAndCountryAndCities() {
        List<City> rtn = (List<City>) this.ds.invoke(this.taskMgr.getQueryTask(), "testLoadCityAndCountryAndCities");
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Actor> testLoadActorsFilmActorsFilms() {
        return (List<Actor>) this.ds.invoke(this.taskMgr.getQueryTask(), "testLoadActorsFilmActorsFilms");
    }

    public City getCityById(Short id) {
        List<City> rtn = (List<City>) this.ds.invoke(this.taskMgr.getQueryTask(), "getCityById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getCityCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getCityCount");
    }

    public List<City> getCityList(City qbeInstance, QueryOptions queryOptions) {
        return (List<City>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    // added manually
    public List<City> getCityList(City qbeInstance) {
        return (List<City>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance);
    }

    // added manually
    public List<Varcharpk> getVarcharpkList(Varcharpk qbeInstance, QueryOptions options) {
        return (List<Varcharpk>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, options);
    }

    // added manually
    public List<Compositepk> getCompositepkList(Compositepk qbeInstance, QueryOptions options) {
        return (List<Compositepk>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, options);
    }

    public void updateCity(City city) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), city);
    }

    public void updateCity(City city, boolean updateRelated) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), city, updateRelated);
    }

    public void deleteCity(City city) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), city);
    }

    public void insertPayment(Payment payment) {
        this.ds.invoke(this.taskMgr.getInsertTask(), payment);
    }

    public Payment getPaymentById(Short id) {
        List<Payment> rtn = (List<Payment>) this.ds.invoke(this.taskMgr.getQueryTask(), "getPaymentById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getPaymentCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getPaymentCount");
    }

    public List<Payment> getPaymentList(Payment qbeInstance, QueryOptions queryOptions) {
        return (List<Payment>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updatePayment(Payment payment) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), payment);
    }

    public void deletePayment(Payment payment) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), payment);
    }

    public void insertStore(Store store) {
        this.ds.invoke(this.taskMgr.getInsertTask(), store);
    }

    public Long getStoreCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getStoreCount");
    }

    public Store getStoreById(Byte id) {
        List<Store> rtn = (List<Store>) this.ds.invoke(this.taskMgr.getQueryTask(), "getStoreById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Store> getStoreList(Store qbeInstance, QueryOptions queryOptions) {
        return (List<Store>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateStore(Store store) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), store);
    }

    public void deleteStore(Store store) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), store);
    }

    public void insertAddress(Address address) {
        this.ds.invoke(this.taskMgr.getInsertTask(), address);
    }

    public Address getAddressById(Short id) {
        List<Address> rtn = (List<Address>) this.ds.invoke(this.taskMgr.getQueryTask(), "getAddressById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getAddressCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getAddressCount");
    }

    public List<Address> getAddressList(Address qbeInstance, QueryOptions queryOptions) {
        return (List<Address>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateAddress(Address address) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), address);
    }

    public void deleteAddress(Address address) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), address);
    }

    public void insertRental(Rental rental) {
        this.ds.invoke(this.taskMgr.getInsertTask(), rental);
    }

    public Long getRentalCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getRentalCount");
    }

    public Rental getRentalById(Integer id) {
        List<Rental> rtn = (List<Rental>) this.ds.invoke(this.taskMgr.getQueryTask(), "getRentalById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Rental> getRentalList(Rental qbeInstance, QueryOptions queryOptions) {
        return (List<Rental>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateRental(Rental rental) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), rental);
    }

    public void deleteRental(Rental rental) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), rental);
    }

    public void insertNicerButSlowerFilmList(NicerButSlowerFilmList nicerButSlowerFilmList) {
        this.ds.invoke(this.taskMgr.getInsertTask(), nicerButSlowerFilmList);
    }

    public Long getNicerButSlowerFilmListCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getNicerButSlowerFilmListCount");
    }

    public NicerButSlowerFilmList getNicerButSlowerFilmListById(NicerButSlowerFilmListId id) {
        List<NicerButSlowerFilmList> rtn = (List<NicerButSlowerFilmList>) this.ds.invoke(this.taskMgr.getQueryTask(),
            "getNicerButSlowerFilmListById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<NicerButSlowerFilmList> getNicerButSlowerFilmListList(NicerButSlowerFilmList qbeInstance, QueryOptions queryOptions) {
        return (List<NicerButSlowerFilmList>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateNicerButSlowerFilmList(NicerButSlowerFilmList nicerButSlowerFilmList) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), nicerButSlowerFilmList);
    }

    public void deleteNicerButSlowerFilmList(NicerButSlowerFilmList nicerButSlowerFilmList) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), nicerButSlowerFilmList);
    }

    public void insertFilmText(FilmText filmText) {
        this.ds.invoke(this.taskMgr.getInsertTask(), filmText);
    }

    public Long getFilmTextCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getFilmTextCount");
    }

    public FilmText getFilmTextById(Short id) {
        List<FilmText> rtn = (List<FilmText>) this.ds.invoke(this.taskMgr.getQueryTask(), "getFilmTextById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<FilmText> getFilmTextList(FilmText qbeInstance, QueryOptions queryOptions) {
        return (List<FilmText>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateFilmText(FilmText filmText) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), filmText);
    }

    public void deleteFilmText(FilmText filmText) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), filmText);
    }

    public void insertInventory(Inventory inventory) {
        this.ds.invoke(this.taskMgr.getInsertTask(), inventory);
    }

    public Inventory getInventoryById(Integer id) {
        List<Inventory> rtn = (List<Inventory>) this.ds.invoke(this.taskMgr.getQueryTask(), "getInventoryById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getInventoryCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getInventoryCount");
    }

    public List<Inventory> getInventoryList(Inventory qbeInstance, QueryOptions queryOptions) {
        return (List<Inventory>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateInventory(Inventory inventory) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), inventory);
    }

    public void deleteInventory(Inventory inventory) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), inventory);
    }

    public void insertFilm(Film film) {
        this.ds.invoke(this.taskMgr.getInsertTask(), film);
    }

    public Long getFilmCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getFilmCount");
    }

    public Film getFilmById(Short id) {
        List<Film> rtn = (List<Film>) this.ds.invoke(this.taskMgr.getQueryTask(), "getFilmById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Film> getFilmList(Film qbeInstance, QueryOptions queryOptions) {
        return (List<Film>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateFilm(Film film) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), film);
    }

    public void deleteFilm(Film film) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), film);
    }

    public void insertStaffList(StaffList staffList) {
        this.ds.invoke(this.taskMgr.getInsertTask(), staffList);
    }

    public StaffList getStaffListById(StaffListId id) {
        List<StaffList> rtn = (List<StaffList>) this.ds.invoke(this.taskMgr.getQueryTask(), "getStaffListById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getStaffListCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getStaffListCount");
    }

    public List<StaffList> getStaffListList(StaffList qbeInstance, QueryOptions queryOptions) {
        return (List<StaffList>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateStaffList(StaffList staffList) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), staffList);
    }

    public void deleteStaffList(StaffList staffList) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), staffList);
    }

    public void insertFilmList(FilmList filmList) {
        this.ds.invoke(this.taskMgr.getInsertTask(), filmList);
    }

    public Long getFilmListCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getFilmListCount");
    }

    public FilmList getFilmListById(FilmListId id) {
        List<FilmList> rtn = (List<FilmList>) this.ds.invoke(this.taskMgr.getQueryTask(), "getFilmListById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<FilmList> getFilmListList(FilmList qbeInstance, QueryOptions queryOptions) {
        return (List<FilmList>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public List<FilmList> getFilmListList() {
        return (List<FilmList>) this.ds.invoke(this.taskMgr.getSearchTask(), FilmList.class);
    }

    public void updateFilmList(FilmList filmList) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), filmList);
    }

    public void deleteFilmList(FilmList filmList) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), filmList);
    }

    public void insertActor(Actor actor) {
        this.ds.invoke(this.taskMgr.getInsertTask(), actor);
    }

    public Actor getActorById(Short id) {
        List<Actor> rtn = (List<Actor>) this.ds.invoke(this.taskMgr.getQueryTask(), "getActorById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getActorCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getActorCount");
    }

    public List<Actor> getActorList(Actor qbeInstance, QueryOptions queryOptions) {
        return (List<Actor>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateActor(Actor actor) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), actor);
    }

    public void deleteActor(Actor actor) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), actor);
    }

    public void insertFilmCategory(FilmCategory filmCategory) {
        this.ds.invoke(this.taskMgr.getInsertTask(), filmCategory);
    }

    public FilmCategory getFilmCategoryById(FilmCategoryId id) {
        List<FilmCategory> rtn = (List<FilmCategory>) this.ds.invoke(this.taskMgr.getQueryTask(), "getFilmCategoryById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getFilmCategoryCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getFilmCategoryCount");
    }

    public List<FilmCategory> getFilmCategoryList(FilmCategory qbeInstance, QueryOptions queryOptions) {
        return (List<FilmCategory>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateFilmCategory(FilmCategory filmCategory) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), filmCategory);
    }

    public void deleteFilmCategory(FilmCategory filmCategory) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), filmCategory);
    }

    public void insertCustomer(Customer customer) {
        this.ds.invoke(this.taskMgr.getInsertTask(), customer);
    }

    public Long getCustomerCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getCustomerCount");
    }

    public Customer getCustomerById(Short id) {
        List<Customer> rtn = (List<Customer>) this.ds.invoke(this.taskMgr.getQueryTask(), "getCustomerById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Customer> getCustomerList(Customer qbeInstance) {
        return (List<Customer>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance);

    }

    public List<Customer> getCustomerList(Customer qbeInstance, QueryOptions queryOptions) {
        return (List<Customer>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateCustomer(Customer customer) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), customer);
    }

    public void deleteCustomer(Customer customer) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), customer);
    }

    public void insertStaff(Staff staff) {
        this.ds.invoke(this.taskMgr.getInsertTask(), staff);
    }

    public Staff getStaffById(Byte id) {
        List<Staff> rtn = (List<Staff>) this.ds.invoke(this.taskMgr.getQueryTask(), "getStaffById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getStaffCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getStaffCount");
    }

    public List<Staff> getStaffList(Staff qbeInstance, QueryOptions queryOptions) {
        return (List<Staff>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateStaff(Staff staff) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), staff);
    }

    public void deleteStaff(Staff staff) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), staff);
    }

    public Country insertCountry(Country country) {
        return (Country) this.ds.invoke(this.taskMgr.getInsertTask(), country);
    }

    public Country getCountryById(Short id) {
        List<Country> rtn = (List<Country>) this.ds.invoke(this.taskMgr.getQueryTask(), "getCountryById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getCountryCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getCountryCount");
    }

    public List<Country> getCountryList(Country qbeInstance, QueryOptions queryOptions) {
        return (List<Country>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateCountry(Country country) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), country);
    }

    public void deleteCountry(Country country) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), country);
    }

    public void insertCategory(Category category) {
        this.ds.invoke(this.taskMgr.getInsertTask(), category);
    }

    public Long getCategoryCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getCategoryCount");
    }

    public Category getCategoryById(Byte id) {
        List<Category> rtn = (List<Category>) this.ds.invoke(this.taskMgr.getQueryTask(), "getCategoryById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<Category> getCategoryList(Category qbeInstance, QueryOptions queryOptions) {
        return (List<Category>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateCategory(Category category) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), category);
    }

    public void deleteCategory(Category category) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), category);
    }

    public void insertActorInfo(ActorInfo actorInfo) {
        this.ds.invoke(this.taskMgr.getInsertTask(), actorInfo);
    }

    public Long getActorInfoCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getActorInfoCount");
    }

    public ActorInfo getActorInfoById(ActorInfoId id) {
        List<ActorInfo> rtn = (List<ActorInfo>) this.ds.invoke(this.taskMgr.getQueryTask(), "getActorInfoById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<ActorInfo> getActorInfoList(ActorInfo qbeInstance, QueryOptions queryOptions) {
        return (List<ActorInfo>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateActorInfo(ActorInfo actorInfo) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), actorInfo);
    }

    public void deleteActorInfo(ActorInfo actorInfo) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), actorInfo);
    }

    public void insertCustomerList(CustomerList customerList) {
        this.ds.invoke(this.taskMgr.getInsertTask(), customerList);
    }

    public CustomerList getCustomerListById(CustomerListId id) {
        List<CustomerList> rtn = (List<CustomerList>) this.ds.invoke(this.taskMgr.getQueryTask(), "getCustomerListById", id);

        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getCustomerListCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getCustomerListCount");
    }

    public List<CustomerList> getCustomerListList(CustomerList qbeInstance, QueryOptions queryOptions) {
        return (List<CustomerList>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public List<CustomerListFixed> getCustomerListFixedList(CustomerListFixed qbeInstance, QueryOptions queryOptions) {
        return (List<CustomerListFixed>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateCustomerList(CustomerList customerList) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), customerList);
    }

    public void deleteCustomerList(CustomerList customerList) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), customerList);
    }

    public void insertSalesByFilmCategory(SalesByFilmCategory salesByFilmCategory) {
        this.ds.invoke(this.taskMgr.getInsertTask(), salesByFilmCategory);
    }

    public SalesByFilmCategory getSalesByFilmCategoryById(SalesByFilmCategoryId id) {
        List<SalesByFilmCategory> rtn = (List<SalesByFilmCategory>) this.ds.invoke(this.taskMgr.getQueryTask(), "getSalesByFilmCategoryById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getSalesByFilmCategoryCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getSalesByFilmCategoryCount");
    }

    public List<SalesByFilmCategory> getSalesByFilmCategoryList(SalesByFilmCategory qbeInstance, QueryOptions queryOptions) {
        return (List<SalesByFilmCategory>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateSalesByFilmCategory(SalesByFilmCategory salesByFilmCategory) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), salesByFilmCategory);
    }

    public void deleteSalesByFilmCategory(SalesByFilmCategory salesByFilmCategory) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), salesByFilmCategory);
    }

    public void insertFilmActor(FilmActor filmActor) {
        this.ds.invoke(this.taskMgr.getInsertTask(), filmActor);
    }

    public Long getFilmActorCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getFilmActorCount");
    }

    public FilmActor getFilmActorById(FilmActorId id) {
        List<FilmActor> rtn = (List<FilmActor>) this.ds.invoke(this.taskMgr.getQueryTask(), "getFilmActorById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<FilmActor> getFilmActorList(FilmActor qbeInstance, QueryOptions queryOptions) {
        return (List<FilmActor>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateFilmActor(FilmActor filmActor) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), filmActor);
    }

    public void deleteFilmActor(FilmActor filmActor) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), filmActor);
    }

    public void insertSalesByStore(SalesByStore salesByStore) {
        this.ds.invoke(this.taskMgr.getInsertTask(), salesByStore);
    }

    public Long getSalesByStoreCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getSalesByStoreCount");
    }

    public SalesByStore getSalesByStoreById(SalesByStoreId id) {
        List<SalesByStore> rtn = (List<SalesByStore>) this.ds.invoke(this.taskMgr.getQueryTask(), "getSalesByStoreById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public List<SalesByStore> getSalesByStoreList(SalesByStore qbeInstance, QueryOptions queryOptions) {
        return (List<SalesByStore>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    public void updateSalesByStore(SalesByStore salesByStore) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), salesByStore);
    }

    public void deleteSalesByStore(SalesByStore salesByStore) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), salesByStore);
    }

    public void insertLanguage(Language language) {
        this.ds.invoke(this.taskMgr.getInsertTask(), language);
    }

    public Language getLanguageById(Byte id) {
        List<Language> rtn = (List<Language>) this.ds.invoke(this.taskMgr.getQueryTask(), "getLanguageById", id);
        if (rtn.isEmpty()) {
            return null;
        } else {
            return rtn.get(0);
        }
    }

    public Long getLanguageCount() {
        return (Long) this.ds.invoke(this.taskMgr.getQueryTask(), "getLanguageCount");
    }

    public List<Language> getLanguageList(Language qbeInstance, QueryOptions queryOptions) {
        return (List<Language>) this.ds.invoke(this.taskMgr.getSearchTask(), qbeInstance, queryOptions);
    }

    // manually added
    public List<GetActorNames> getActorNames() {
        return (List<GetActorNames>) this.ds.invoke(this.taskMgr.getQueryTask(), "getActorNames");
    }

    public List<Actor> getActorsByFirstNames(List<String> names) {
        return (List<Actor>) this.ds.invoke(this.taskMgr.getQueryTask(), "getActorsByFirstNames", names);
    }

    public void begin() {
        this.ds.begin();
    }

    public void commit() {
        this.ds.commit();
    }

    public void rollback() {
        this.ds.rollback();
    }

    public void updateLanguage(Language language) {
        this.ds.invoke(this.taskMgr.getUpdateTask(), language);
    }

    public void deleteLanguage(Language language) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), language);
    }

    public DataServiceManager getDataServiceManager() {
        return this.ds;
    }

    public TypedServiceReturn read(TypeDefinition type, Object instance, PropertyOptions propertyOptions, PagingOptions pagingOptions) {
        return (TypedServiceReturn) this.ds.invoke(this.taskMgr.getReadTask(), type, instance, propertyOptions, pagingOptions);
    }

    public void delete(Object o) {
        this.ds.invoke(this.taskMgr.getDeleteTask(), o);
    }

    public Object insert(Object o) {
        return this.ds.invoke(this.taskMgr.getInsertTask(), o);
    }

    public Object update(Object o) {
        return this.ds.invoke(this.taskMgr.getUpdateTask(), o);
    }
}
