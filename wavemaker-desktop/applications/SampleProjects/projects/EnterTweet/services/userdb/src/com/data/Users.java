
package com.data;



/**
 *  userdb.Users
 *  11/21/2009 19:30:13
 * 
 */
public class Users {

    private String username;
    private String password;
    private String role;
    private String firstname;
    private String lastname;
    private String phone;
    private String twittername;
    private Integer tenantid;

    public Users() {
    }

    public Users(String username, String password, String role, String firstname, String lastname, String phone, String twittername, Integer tenantid) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.firstname = firstname;
        this.lastname = lastname;
        this.phone = phone;
        this.twittername = twittername;
        this.tenantid = tenantid;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getTwittername() {
        return twittername;
    }

    public void setTwittername(String twittername) {
        this.twittername = twittername;
    }

    public Integer getTenantid() {
        return tenantid;
    }

    public void setTenantid(Integer tenantid) {
        this.tenantid = tenantid;
    }

}
