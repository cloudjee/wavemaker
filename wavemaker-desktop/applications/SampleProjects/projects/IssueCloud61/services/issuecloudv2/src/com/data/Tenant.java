
package com.data;

import java.util.Date;


/**
 *  issuecloudv2.Tenant
 *  06/09/2010 15:07:54
 * 
 */
public class Tenant {

    private Integer tid;
    private Integer billcode;
    private String companyname;
    private Integer accountnumber;
    private String address;
    private String phone;
    private Date createdate;
    private Integer flag;

    public Tenant() {
    }

    public Tenant(Integer tid, Integer billcode, String companyname, Integer accountnumber, String address, String phone, Date createdate, Integer flag) {
        this.tid = tid;
        this.billcode = billcode;
        this.companyname = companyname;
        this.accountnumber = accountnumber;
        this.address = address;
        this.phone = phone;
        this.createdate = createdate;
        this.flag = flag;
    }

    public Integer getTid() {
        return tid;
    }

    public void setTid(Integer tid) {
        this.tid = tid;
    }

    public Integer getBillcode() {
        return billcode;
    }

    public void setBillcode(Integer billcode) {
        this.billcode = billcode;
    }

    public String getCompanyname() {
        return companyname;
    }

    public void setCompanyname(String companyname) {
        this.companyname = companyname;
    }

    public Integer getAccountnumber() {
        return accountnumber;
    }

    public void setAccountnumber(Integer accountnumber) {
        this.accountnumber = accountnumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Date getCreatedate() {
        return createdate;
    }

    public void setCreatedate(Date createdate) {
        this.createdate = createdate;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

}
