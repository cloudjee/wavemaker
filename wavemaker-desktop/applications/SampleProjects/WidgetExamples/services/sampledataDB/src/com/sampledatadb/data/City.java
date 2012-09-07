
package com.sampledatadb.data;

import java.util.HashSet;
import java.util.Set;


/**
 *  sampledataDB.City
 *  09/15/2011 08:52:08
 * 
 */
public class City {

    private Integer cityId;
    private Country country;
    private String city;
    private Set<com.sampledatadb.data.Address> addresses = new HashSet<com.sampledatadb.data.Address>();

    public Integer getCityId() {
        return cityId;
    }

    public void setCityId(Integer cityId) {
        this.cityId = cityId;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Set<com.sampledatadb.data.Address> getAddresses() {
        return addresses;
    }

    public void setAddresses(Set<com.sampledatadb.data.Address> addresses) {
        this.addresses = addresses;
    }

}
