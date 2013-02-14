
package com.issuecloudv3db.data;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;


/**
 *  issuecloudv3DB.User
 *  03/28/2012 16:03:06
 * 
 */
public class User {

    private Integer uid;
    private Integer tid;
    private String firstname;
    private String lastname;
    private String username;
    private String password;
    private String email;
    private Date createdate;
    private String role;
    private Integer flag;
    private Set<com.issuecloudv3db.data.Issue> issuesForReportedUid = new HashSet<com.issuecloudv3db.data.Issue>();
    private Set<com.issuecloudv3db.data.Issue> issuesForAssignUid = new HashSet<com.issuecloudv3db.data.Issue>();
    private Set<com.issuecloudv3db.data.Comment> comments = new HashSet<com.issuecloudv3db.data.Comment>();

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public Integer getTid() {
        return tid;
    }

    public void setTid(Integer tid) {
        this.tid = tid;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getCreatedate() {
        return createdate;
    }

    public void setCreatedate(Date createdate) {
        this.createdate = createdate;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Set<com.issuecloudv3db.data.Issue> getIssuesForReportedUid() {
        return issuesForReportedUid;
    }

    public void setIssuesForReportedUid(Set<com.issuecloudv3db.data.Issue> issuesForReportedUid) {
        this.issuesForReportedUid = issuesForReportedUid;
    }

    public Set<com.issuecloudv3db.data.Issue> getIssuesForAssignUid() {
        return issuesForAssignUid;
    }

    public void setIssuesForAssignUid(Set<com.issuecloudv3db.data.Issue> issuesForAssignUid) {
        this.issuesForAssignUid = issuesForAssignUid;
    }

    public Set<com.issuecloudv3db.data.Comment> getComments() {
        return comments;
    }

    public void setComments(Set<com.issuecloudv3db.data.Comment> comments) {
        this.comments = comments;
    }

}
