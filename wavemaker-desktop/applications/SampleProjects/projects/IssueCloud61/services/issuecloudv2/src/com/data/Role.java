
package com.data;



/**
 *  issuecloudv2.Role
 *  06/09/2010 15:07:54
 * 
 */
public class Role {

    private Integer rid;
    private String role;

    public Role() {
    }

    public Role(Integer rid, String role) {
        this.rid = rid;
        this.role = role;
    }

    public Integer getRid() {
        return rid;
    }

    public void setRid(Integer rid) {
        this.rid = rid;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

}
