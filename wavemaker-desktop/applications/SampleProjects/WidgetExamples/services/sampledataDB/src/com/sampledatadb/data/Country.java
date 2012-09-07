
package com.sampledatadb.data;

import java.util.HashSet;
import java.util.Set;


/**
 *  sampledataDB.Country
 *  09/15/2011 08:52:09
 * 
 */
public class Country {

    private Integer countryId;
    private String country;
    private Set<com.sampledatadb.data.City> cities = new HashSet<com.sampledatadb.data.City>();

    public Integer getCountryId() {
        return countryId;
    }

    public void setCountryId(Integer countryId) {
        this.countryId = countryId;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Set<com.sampledatadb.data.City> getCities() {
        return cities;
    }

    public void setCities(Set<com.sampledatadb.data.City> cities) {
        this.cities = cities;
    }

}
