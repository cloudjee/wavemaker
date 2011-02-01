
package com.wavemaker.studio.clouddb.data;

import java.util.Date;


/**
 *  CloudDB.User
 *  02/01/2011 11:28:32
 * 
 */
public class User {

    private String email;
    private String password;
    private Date createDate;

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
