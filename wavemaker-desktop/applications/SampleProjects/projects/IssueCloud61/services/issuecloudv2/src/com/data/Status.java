
package com.data;



/**
 *  issuecloudv2.Status
 *  06/09/2010 15:07:54
 * 
 */
public class Status {

    private Integer sid;
    private String name;

    public Status() {
    }

    public Status(Integer sid, String name) {
        this.sid = sid;
        this.name = name;
    }

    public Integer getSid() {
        return sid;
    }

    public void setSid(Integer sid) {
        this.sid = sid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
