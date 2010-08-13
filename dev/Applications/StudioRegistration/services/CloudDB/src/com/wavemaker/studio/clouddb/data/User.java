
package com.wavemaker.studio.clouddb.data;

import java.util.Date;


/**
 *  CloudDB.User
 *  12/01/2008 11:08:56
 * 
 */
public class User {

    private String email;
    private String password;
    private Date createDate;

    public User() {
    }

    public User(String email, String password, Date createDate) {
        this.email = email;
        this.password = password;
        this.createDate = createDate;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

}
