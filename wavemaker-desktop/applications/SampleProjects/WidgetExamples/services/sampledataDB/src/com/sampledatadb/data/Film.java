
package com.sampledatadb.data;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;


/**
 *  sampledataDB.Film
 *  09/15/2011 08:52:08
 * 
 */
public class Film {

    private Integer filmId;
    private String title;
    private String description;
    private String releaseYear;
    private Integer rentalDuration;
    private BigDecimal rentalRate;
    private Integer length;
    private BigDecimal replacementCost;
    private String rating;
    private String specialFeatures;
    private Set<com.sampledatadb.data.FilmActor> filmActors = new HashSet<com.sampledatadb.data.FilmActor>();
    private Set<com.sampledatadb.data.Inventory> inventories = new HashSet<com.sampledatadb.data.Inventory>();

    public Integer getFilmId() {
        return filmId;
    }

    public void setFilmId(Integer filmId) {
        this.filmId = filmId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(String releaseYear) {
        this.releaseYear = releaseYear;
    }

    public Integer getRentalDuration() {
        return rentalDuration;
    }

    public void setRentalDuration(Integer rentalDuration) {
        this.rentalDuration = rentalDuration;
    }

    public BigDecimal getRentalRate() {
        return rentalRate;
    }

    public void setRentalRate(BigDecimal rentalRate) {
        this.rentalRate = rentalRate;
    }

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public BigDecimal getReplacementCost() {
        return replacementCost;
    }

    public void setReplacementCost(BigDecimal replacementCost) {
        this.replacementCost = replacementCost;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getSpecialFeatures() {
        return specialFeatures;
    }

    public void setSpecialFeatures(String specialFeatures) {
        this.specialFeatures = specialFeatures;
    }

    public Set<com.sampledatadb.data.FilmActor> getFilmActors() {
        return filmActors;
    }

    public void setFilmActors(Set<com.sampledatadb.data.FilmActor> filmActors) {
        this.filmActors = filmActors;
    }

    public Set<com.sampledatadb.data.Inventory> getInventories() {
        return inventories;
    }

    public void setInventories(Set<com.sampledatadb.data.Inventory> inventories) {
        this.inventories = inventories;
    }

}
