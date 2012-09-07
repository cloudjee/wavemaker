
package com.sampledatadb.data;

import java.util.HashSet;
import java.util.Set;


/**
 *  sampledataDB.Actor
 *  09/15/2011 08:52:08
 * 
 */
public class Actor {

    private Integer actorId;
    private String firstName;
    private String lastName;
    private Set<com.sampledatadb.data.FilmActor> filmActors = new HashSet<com.sampledatadb.data.FilmActor>();

    public Integer getActorId() {
        return actorId;
    }

    public void setActorId(Integer actorId) {
        this.actorId = actorId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Set<com.sampledatadb.data.FilmActor> getFilmActors() {
        return filmActors;
    }

    public void setFilmActors(Set<com.sampledatadb.data.FilmActor> filmActors) {
        this.filmActors = filmActors;
    }

}
