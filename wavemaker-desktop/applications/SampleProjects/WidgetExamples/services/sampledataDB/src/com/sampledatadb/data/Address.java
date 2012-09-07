
package com.sampledatadb.data;

import java.util.HashSet;
import java.util.Set;


/**
 *  sampledataDB.Address
 *  09/15/2011 08:52:09
 * 
 */
public class Address {

    private Integer addressId;
    private City city;
    private String address;
    private String address2;
    private String district;
    private String postalCode;
    private String phone;
    private Set<com.sampledatadb.data.Customer> customers = new HashSet<com.sampledatadb.data.Customer>();
    private Set<com.sampledatadb.data.Store> stores = new HashSet<com.sampledatadb.data.Store>();

    public Integer getAddressId() {
        return addressId;
    }

    public void setAddressId(Integer addressId) {
        this.addressId = addressId;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAddress2() {
        return address2;
    }

    public void setAddress2(String address2) {
        this.address2 = address2;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Set<com.sampledatadb.data.Customer> getCustomers() {
        return customers;
    }

    public void setCustomers(Set<com.sampledatadb.data.Customer> customers) {
        this.customers = customers;
    }

    public Set<com.sampledatadb.data.Store> getStores() {
        return stores;
    }

    public void setStores(Set<com.sampledatadb.data.Store> stores) {
        this.stores = stores;
    }

}
