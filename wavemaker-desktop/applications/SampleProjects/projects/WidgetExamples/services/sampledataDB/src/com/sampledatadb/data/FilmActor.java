
package com.sampledatadb.data;



/**
 *  sampledataDB.FilmActor
 *  10/02/2012 15:19:54
 * 
 */
public class FilmActor {

    private FilmActorId id;
    private Actor actor;
    private Film film;

    public FilmActorId getId() {
        return id;
    }

    public void setId(FilmActorId id) {
        this.id = id;
    }

    public Actor getActor() {
        return actor;
    }

    public void setActor(Actor actor) {
        this.actor = actor;
    }

    public Film getFilm() {
        return film;
    }

    public void setFilm(Film film) {
        this.film = film;
    }

}
