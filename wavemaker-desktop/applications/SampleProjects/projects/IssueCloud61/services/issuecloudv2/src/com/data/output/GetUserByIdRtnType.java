
package com.data.output;



/**
 * Generated for query "getUserById" on 06/09/2010 16:20:40
 * 
 */
public class GetUserByIdRtnType {

    private String firstname;
    private String lastname;
    private String email;

    public GetUserByIdRtnType() {
    }

    public GetUserByIdRtnType(String firstname, String lastname, String email) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
