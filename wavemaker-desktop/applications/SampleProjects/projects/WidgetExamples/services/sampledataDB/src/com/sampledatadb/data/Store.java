
package com.sampledatadb.data;

import java.util.HashSet;
import java.util.Set;


/**
 *  sampledataDB.Store
 *  10/02/2012 15:19:54
 * 
 */
public class Store {

    private Integer storeId;
    private Integer addressId;
    private Set<com.sampledatadb.data.Customer> customers = new HashSet<com.sampledatadb.data.Customer>();
    private Set<com.sampledatadb.data.Inventory> inventories = new HashSet<com.sampledatadb.data.Inventory>();

    public Integer getStoreId() {
        return storeId;
    }

    public void setStoreId(Integer storeId) {
        this.storeId = storeId;
    }

    public Integer getAddressId() {
        return addressId;
    }

    public void setAddressId(Integer addressId) {
        this.addressId = addressId;
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
