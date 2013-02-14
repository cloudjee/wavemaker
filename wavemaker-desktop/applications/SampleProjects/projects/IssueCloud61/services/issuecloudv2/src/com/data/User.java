
package com.data;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;


/**
 *  issuecloudv2.User
 *  06/09/2010 16:20:37
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
    private Set<com.data.Comment> comments = new HashSet<com.data.Comment>();
    private Set<com.data.Issue> issues = new HashSet<com.data.Issue>();

    public User() {
    }

    public User(Integer uid, Integer tid, String firstname, String lastname, String username, String password, String email, Date createdate, String role, Integer flag) {
        this.uid = uid;
        this.tid = tid;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.password = password;
        this.email = email;
        this.createdate = createdate;
        this.role = role;
        this.flag = flag;
    }

    public User(Integer uid, Integer tid, String firstname, String lastname, String username, String password, String email, Date createdate, String role, Integer flag, Set<com.data.Comment> comments, Set<com.data.Issue> issues) {
        this.uid = uid;
        this.tid = tid;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.password = password;
        this.email = email;
        this.createdate = createdate;
        this.role = role;
        this.flag = flag;
        this.comments = comments;
        this.issues = issues;
    }

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

    public Set<com.data.Comment> getComments() {
        return comments;
    }

    public void setComments(Set<com.data.Comment> comments) {
        this.comments = comments;
    }

    public Set<com.data.Issue> getIssues() {
        return issues;
    }

    public void setIssues(Set<com.data.Issue> issues) {
        this.issues = issues;
    }

}
