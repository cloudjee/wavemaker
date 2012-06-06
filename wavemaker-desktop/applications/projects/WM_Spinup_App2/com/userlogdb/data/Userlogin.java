
package com.userlogdb.data;

import java.util.Date;


/**
 *  userlogDB.Userlogin
 *  05/29/2012 10:15:26
 * 
 */
public class Userlogin {

    private Integer id;
    private String username;
    private Date login;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Date getLogin() {
        return login;
    }

    public void setLogin(Date login) {
        this.login = login;
    }

}
