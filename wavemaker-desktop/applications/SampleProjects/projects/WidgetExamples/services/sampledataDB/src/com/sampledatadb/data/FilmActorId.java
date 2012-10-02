
package com.sampledatadb.data;

import java.io.Serializable;


/**
 *  sampledataDB.FilmActorId
 *  10/02/2012 15:19:54
 * 
 */
public class FilmActorId
    implements Serializable
{

    private Integer actorId;
    private Integer filmId;

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof FilmActorId)) {
            return false;
        }
        FilmActorId other = ((FilmActorId) o);
        if (this.actorId == null) {
            if (other.actorId!= null) {
                return false;
            }
        } else {
            if (!this.actorId.equals(other.actorId)) {
                return false;
            }
        }
        if (this.filmId == null) {
            if (other.filmId!= null) {
                return false;
            }
        } else {
            if (!this.filmId.equals(other.filmId)) {
                return false;
            }
        }
        return true;
    }

    public int hashCode() {
        int rtn = 17;
        rtn = (rtn* 37);
        if (this.actorId!= null) {
            rtn = (rtn + this.actorId.hashCode());
        }
        rtn = (rtn* 37);
        if (this.filmId!= null) {
            rtn = (rtn + this.filmId.hashCode());
        }
        return rtn;
    }

    public Integer getActorId() {
        return actorId;
    }

    public void setActorId(Integer actorId) {
        this.actorId = actorId;
    }

    public Integer getFilmId() {
        return filmId;
    }

    public void setFilmId(Integer filmId) {
        this.filmId = filmId;
    }

}
