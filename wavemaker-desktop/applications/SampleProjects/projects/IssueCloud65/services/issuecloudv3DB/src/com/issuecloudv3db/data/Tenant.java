
package com.issuecloudv3db.data;

import java.util.Date;


/**
 *  issuecloudv3DB.Tenant
 *  03/28/2012 16:03:06
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
