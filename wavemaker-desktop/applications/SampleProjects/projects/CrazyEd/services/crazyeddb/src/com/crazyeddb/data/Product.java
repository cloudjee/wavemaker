
package com.crazyeddb.data;

import java.util.HashSet;
import java.util.Set;


/**
 *  crazyeddb.Product
 *  10/13/2012 19:18:09
 * 
 */
public class Product {

    private Integer id;
    private String name;
    private String description;
    private String imageUrl;
    private Float price;
    private String specialInstructions;
    private Set<com.crazyeddb.data.Inventory> inventories = new HashSet<com.crazyeddb.data.Inventory>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public Set<com.crazyeddb.data.Inventory> getInventories() {
        return inventories;
    }

    public void setInventories(Set<com.crazyeddb.data.Inventory> inventories) {
        this.inventories = inventories;
    }

}
