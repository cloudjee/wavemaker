
package com.sampledatadb.data;

import java.util.HashSet;
import java.util.Set;


/**
 *  sampledataDB.Store
 *  09/15/2011 08:52:08
 * 
 */
public class Store {

    private Integer storeId;
    private Address address;
    private Set<com.sampledatadb.data.Customer> customers = new HashSet<com.sampledatadb.data.Customer>();
    private Set<com.sampledatadb.data.Inventory> inventories = new HashSet<com.sampledatadb.data.Inventory>();

    public Integer getStoreId() {
        return storeId;
    }

    public void setStoreId(Integer storeId) {
        this.storeId = storeId;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Set<com.sampledatadb.data.Customer> getCustomers() {
        return customers;
    }

    public void setCustomers(Set<com.sampledatadb.data.Customer> customers) {
        this.customers = customers;
    }

    public Set<com.sampledatadb.data.Inventory> getInventories() {
        return inventories;
    }

    public void setInventories(Set<com.sampledatadb.data.Inventory> inventories) {
        this.inventories = inventories;
    }

}
