
package com.crazyeddb.data;

import java.util.HashSet;
import java.util.Set;


/**
 *  crazyeddb.Store
 *  10/13/2012 19:18:09
 * 
 */
public class Store {

    private Integer id;
    private String location;
    private Set<com.crazyeddb.data.Inventory> inventories = new HashSet<com.crazyeddb.data.Inventory>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Set<com.crazyeddb.data.Inventory> getInventories() {
        return inventories;
    }

    public void setInventories(Set<com.crazyeddb.data.Inventory> inventories) {
        this.inventories = inventories;
    }

}
