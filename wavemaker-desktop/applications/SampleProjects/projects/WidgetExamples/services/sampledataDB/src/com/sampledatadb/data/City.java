
package com.sampledatadb.data;

import java.util.HashSet;
import java.util.Set;


/**
 *  sampledataDB.City
 *  10/02/2012 15:19:54
 * 
 */
public class City {

    private Integer cityId;
    private String city;
    private Integer countryId;
    private Set<com.sampledatadb.data.Address> addresses = new HashSet<com.sampledatadb.data.Address>();

    public Integer getCityId() {
        return cityId;
    }

    public void setCityId(Integer cityId) {
        this.cityId = cityId;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getCountryId() {
        return countryId;
    }

    public void setCountryId(Integer countryId) {
        this.countryId = countryId;
    }

    public Set<com.sampledatadb.data.Address> getAddresses() {
        return addresses;
    }

    public void setAddresses(Set<com.sampledatadb.data.Address> addresses) {
        this.addresses = addresses;
    }

}
